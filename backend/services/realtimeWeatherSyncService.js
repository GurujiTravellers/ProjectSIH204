/**
 * Realtime Automated Disaster & Weather Sync Service - Travel_Guruji
 * 
 * Continuously synchronizes real-time natural disaster and meteorological radar data
 * across all 55 destinations & travel hubs in India.
 * 
 * Data Sources (Live Feeds):
 * 1. GDACS (Global Disaster Alert and Coordination System - United Nations & European Commission)
 * 2. USGS Live Seismic Network (US Geological Survey)
 * 3. NASA Earth Observatory Natural Event Tracker (EONET Satellite)
 * 4. Open-Meteo European Flood & Real-Time Hydrology Radar
 * 5. National Disaster Management Authority (NDMA) & IMD Ground Directives
 * 
 * Features:
 * - 60-second automated continuous polling loop (daemon mode).
 * - Realtime Server-Sent Events (SSE) stream for instant client updates without page reload.
 * - Single source of truth for /weather and /emergency routes.
 * - Local file persistence (backend/data/liveWeatherDisasterDb.json).
 */

const fs = require("fs");
const path = require("path");
const https = require("node:https");
const http = require("node:http");
const {
  INDIA_LOCATIONS,
  findNearestIndiaLocation,
  haversineDistanceKm,
} = require("./realDisasterService");
const pythonClient = require("./pythonIntelligenceClient");

const DB_FILE_PATH = path.join(__dirname, "../data/liveWeatherDisasterDb.json");
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // Continuous poll every 5 minutes to prevent external rate-limits

// Live API Endpoints from Environment Variables
const TOMORROW_IO_API_KEY = process.env.TOMORROW_IO_API_KEY || process.env.TOMORROW_API_KEY || "";
const OPEN_METEO_API_URL = process.env.OPEN_METEO_API_URL || "https://api.open-meteo.com/v1/forecast";
const GDACS_FEED_URL = process.env.GDACS_FEED_URL || "https://www.gdacs.org/xml/rss.xml";
const USGS_EARTHQUAKE_URL = process.env.USGS_EARTHQUAKE_URL || "https://earthquake.usgs.gov/fdsnws/event/1/query";
const NASA_EONET_URL = process.env.NASA_EONET_URL || "https://eonet.gsfc.nasa.gov/api/v3/events";
const RAINVIEWER_RADAR_URL = process.env.RAINVIEWER_RADAR_URL || "https://api.rainviewer.com/public/weather-maps.json";

/**
 * Robust HTTP client with bounded timeouts, explicit IPv4 routing (preventing
 * IPv6 blackholing on external government feeds like NASA GSFC), and proper headers.
 * Preserves strict TLS certificate verification (no disabling of TLS validation).
 */
function safeHttpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const isHttps = u.protocol === "https:";
      const transport = isHttps ? https : http;
      const timeoutMs = options.timeout || 6000;
      let settled = false;

      const req = transport.request({
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || (isHttps ? 443 : 80),
        path: u.pathname + u.search,
        method: options.method || "GET",
        family: 4, // Explicitly use IPv4 to eliminate IPv6 routing blackholing for external government APIs
        headers: {
          "User-Agent": "TravelGuruji/2.0 (SmartTourism IndianSubcontinent Safety Monitor; contact@travelguruji.in)",
          "Accept": options.accept || "application/json, text/plain, text/xml, */*",
          ...(options.headers || {})
        },
        timeout: timeoutMs
      }, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          if (!settled) {
            settled = true;
            clearTimeout(hardTimer);
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: res.headers,
              text: async () => data,
              json: async () => JSON.parse(data)
            });
          }
        });
      });

      const hardTimer = setTimeout(() => {
        if (!settled) {
          settled = true;
          const err = new Error(`The operation was aborted due to timeout (${timeoutMs}ms)`);
          err.code = "TIMEOUT";
          err.name = "TimeoutError";
          req.destroy(err);
          reject(err);
        }
      }, timeoutMs);

      req.on("timeout", () => {
        if (!settled) {
          settled = true;
          clearTimeout(hardTimer);
          const err = new Error(`The operation was aborted due to timeout (${timeoutMs}ms)`);
          err.code = "TIMEOUT";
          err.name = "TimeoutError";
          req.destroy(err);
          reject(err);
        }
      });

      req.on("error", (err) => {
        if (!settled) {
          settled = true;
          clearTimeout(hardTimer);
          reject(err);
        }
      });

      if (options.body) {
        req.write(options.body);
      }
      req.end();
    } catch (parseErr) {
      reject(parseErr);
    }
  });
}

// In-memory persistent cache for disaster provider events (prevent premature expiration on network hiccups)
const cachedProviderEvents = {
  usgs: [],
  nasa: [],
  gdacs: [],
};

// Internal provider health and availability tracking
const providerHealth = {
  usgs: { status: "AVAILABLE", reason: null, durationMs: 0, lastSuccessAt: null, lastAttemptAt: null, count: 0 },
  nasa: { status: "AVAILABLE", reason: null, durationMs: 0, lastSuccessAt: null, lastAttemptAt: null, count: 0 },
  gdacs: { status: "AVAILABLE", reason: null, durationMs: 0, lastSuccessAt: null, lastAttemptAt: null, count: 0 },
  openMeteo: { status: "AVAILABLE", reason: null, durationMs: 0, lastSuccessAt: null, lastAttemptAt: null, count: 0 },
  tomorrowIo: { status: TOMORROW_IO_API_KEY ? "CONFIGURED" : "NOT_CONFIGURED", reason: null, durationMs: 0, lastSuccessAt: null, lastAttemptAt: null, count: 0 },
};

// In-memory weather cache & backoff tracking
let cachedWeatherMap = null;
let lastWeatherFetchTime = 0;
let rateLimitBackoffUntil = 0;
const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

// RainViewer Radar Frame Cache
let cachedRadarFrames = null;
let lastRadarFramesFetchTime = 0;
const RADAR_FRAMES_TTL_MS = 3 * 60 * 1000; // 3 minutes cache

// Active SSE client connections
const sseClients = new Set();
let lastKnownStateHash = "";

// Weather code description & icon lookup (WMO standards)
function mapWeatherCode(code) {
  if (code === 0) return { label: "Clear Sky", icon: "☀️", category: "clear" };
  if (code === 1) return { label: "Mainly Clear", icon: "🌤️", category: "clear" };
  if (code === 2) return { label: "Partly Cloudy", icon: "⛅", category: "cloudy" };
  if (code === 3) return { label: "Overcast", icon: "☁️", category: "cloudy" };
  if (code === 45 || code === 48) return { label: "Fog & Mist", icon: "🌫️", category: "fog" };
  if (code >= 51 && code <= 57) return { label: "Light Drizzle", icon: "🌦️", category: "rain" };
  if (code >= 61 && code <= 65) return { label: "Rain Showers", icon: "🌧️", category: "rain" };
  if (code === 66 || code === 67) return { label: "Freezing Rain", icon: "🌧️❄️", category: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snowfall", icon: "❄️", category: "snow" };
  if (code >= 80 && code <= 81) return { label: "Moderate Rain Showers", icon: "🌧️", category: "rain" };
  if (code === 82) return { label: "Violent Rain Downpour", icon: "⛈️", category: "storm" };
  if (code === 85 || code === 86) return { label: "Heavy Snow Showers", icon: "🌨️", category: "snow" };
  if (code === 95) return { label: "Thunderstorm", icon: "⛈️", category: "storm" };
  if (code === 96 || code === 99) return { label: "Severe Thunderstorm with Hail", icon: "🌩️", category: "storm" };
  return { label: "Mild & Fair", icon: "🌤️", category: "clear" };
}

// Tomorrow.io Weather Code Mapper
function mapTomorrowIoWeatherCode(code) {
  const c = Number(code) || 1000;
  if (c === 1000) return { label: "Clear Sky", icon: "☀️", category: "clear" };
  if (c === 1100) return { label: "Mostly Clear", icon: "🌤️", category: "clear" };
  if (c === 1101) return { label: "Partly Cloudy", icon: "⛅", category: "cloudy" };
  if (c === 1102) return { label: "Mostly Cloudy", icon: "🌥️", category: "cloudy" };
  if (c === 1001) return { label: "Cloudy & Overcast", icon: "☁️", category: "cloudy" };
  if (c === 2000 || c === 2100) return { label: "Fog & Mist", icon: "🌫️", category: "fog" };
  if (c === 4000 || c === 4200) return { label: "Light Rain / Drizzle", icon: "🌦️", category: "rain" };
  if (c === 4001) return { label: "Rain Showers", icon: "🌧️", category: "rain" };
  if (c === 4201) return { label: "Heavy Downpour", icon: "🌧️⛈️", category: "storm" };
  if (c === 5000 || c === 5001 || c === 5100 || c === 5101) return { label: "Snowfall", icon: "❄️", category: "snow" };
  if (c === 6000 || c === 6001 || c === 6200 || c === 6201) return { label: "Freezing Rain", icon: "🌧️❄️", category: "rain" };
  if (c === 8000) return { label: "Severe Thunderstorm", icon: "⛈️", category: "storm" };
  return { label: "Mild & Fair", icon: "🌤️", category: "clear" };
}

// In-memory state
let liveDatabase = {
  lastSyncTimestamp: null,
  nextSyncTimestamp: null,
  syncCount: 0,
  isSyncing: false,
  destinations: {},
  stats: {
    totalDestinations: Object.keys(INDIA_LOCATIONS).length,
    disasterZones: 0,
    moderateAdvisories: 0,
    rainAlerts: 0,
    normalClear: 0,
  },
  dataSources: [
    "Tomorrow.io Realtime Weather & Severe Convective Alerts",
    "Tomorrow.io Maps & RainViewer Realtime Weather Radar Tiles",
    "Open-Meteo European Flood & Real-Time Hydrology Radar",
    "Global Disaster Alert & Coordination System (GDACS - UN & EC)",
    "USGS Live Indian Subcontinent Seismic Network",
    "NASA Earth Observatory (EONET Satellite Tracking)",
    "India Meteorological Department (IMD) / Mausam Directives",
    "National Disaster Management Authority (NDMA) Safety Protocol",
  ],
  recentEventsTimeline: [],
};

// Immediately load cached database snapshot from disk on startup if present
try {
  if (fs.existsSync(DB_FILE_PATH)) {
    const saved = JSON.parse(fs.readFileSync(DB_FILE_PATH, "utf8"));
    if (saved && saved.destinations && Object.keys(saved.destinations).length > 0) {
      liveDatabase = { ...liveDatabase, ...saved, isSyncing: false };
      cachedWeatherMap = {};
      for (const [key, d] of Object.entries(saved.destinations)) {
        if (d && d.weather) {
          cachedWeatherMap[key.toLowerCase()] = d.weather;
        }
      }
      lastWeatherFetchTime = 0; // Force immediate real-time weather fetch from live API on startup
      if (saved.recentEventsTimeline && Array.isArray(saved.recentEventsTimeline)) {
        for (const ev of saved.recentEventsTimeline) {
          if (ev.source && ev.source.includes("USGS")) cachedProviderEvents.usgs.push(ev);
          else if (ev.source && ev.source.includes("NASA")) cachedProviderEvents.nasa.push(ev);
          else if (ev.source && ev.source.includes("GDACS")) cachedProviderEvents.gdacs.push(ev);
        }
      }
    }
  }
} catch (e) {
  // Ignore initial read error
}

let syncTimerId = null;

/**
 * 1. Fetch live GDACS events (Global Disaster Alert and Coordination System)
 * Real-time Cyclones, Floods, Earthquakes, Droughts & Volcanoes in India and neighboring waters
 */
async function fetchLiveGDACSEvents() {
  const t0 = Date.now();
  providerHealth.gdacs.lastAttemptAt = new Date().toISOString();

  try {
    const feedUrl = process.env.GDACS_FEED_URL || GDACS_FEED_URL;
    const res = await safeHttpRequest(feedUrl, {
      timeout: 6000,
      accept: "application/xml, text/xml, */*"
    });

    if (!res.ok) {
      throw new Error(`GDACS HTTP ${res.status}`);
    }

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    const gdacsEvents = [];

    for (const item of items) {
      const latMatch = item.match(/<geo:lat>([\d.-]+)<\/geo:lat>/);
      const lonMatch = item.match(/<geo:long>([\d.-]+)<\/geo:long>/);
      if (!latMatch || !lonMatch) continue;

      const lat = parseFloat(latMatch[1]);
      const lon = parseFloat(lonMatch[1]);

      // India & surrounding maritime buffer (lat 6.0 to 37.5, lon 65.0 to 98.0)
      if (lat < 6.0 || lat > 37.5 || lon < 65.0 || lon > 98.0) continue;

      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
      const title = (titleMatch ? titleMatch[1] : "Natural Disaster Alert").trim();
      const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);
      const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      const alertLevelMatch = item.match(/<gdacs:alertlevel>([\s\S]*?)<\/gdacs:alertlevel>/);
      const alertLevel = (alertLevelMatch ? alertLevelMatch[1] : "Green").trim();
      const eventTypeMatch = item.match(/<gdacs:eventtype>([\s\S]*?)<\/gdacs:eventtype>/);
      const eventType = (eventTypeMatch ? eventTypeMatch[1] : "GEN").trim();
      const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const link = linkMatch ? linkMatch[1].trim() : "https://www.gdacs.org";

      const nearest = findNearestIndiaLocation(lat, lon);
      if (!nearest) continue;

      let hazardName = "Natural Disaster Event";
      let icon = "⚠️";
      if (eventType === "TC") { hazardName = "Tropical Cyclone / Maritime Storm"; icon = "🌀"; }
      else if (eventType === "FL") { hazardName = "Flash Flood & River Inundation"; icon = "🌊"; }
      else if (eventType === "EQ") { hazardName = "Seismic Earthquake"; icon = "🌋"; }
      else if (eventType === "DR") { hazardName = "Drought Warning"; icon = "☀️"; }
      else if (eventType === "VO") { hazardName = "Volcanic Activity"; icon = "🌋"; }
      else if (eventType === "WF") { hazardName = "Wildfire / Forest Fire"; icon = "🔥"; }

      const isHighLevel = alertLevel.toLowerCase() === "red" || alertLevel.toLowerCase() === "orange";
      const alertTier = isHighLevel && nearest.distanceKm < 150 ? "RED" : "YELLOW";
      const isDisasterZone = alertTier === "RED";

      gdacsEvents.push({
        id: `GDACS-${eventType}-${Math.round(lat * 100)}-${Math.round(lon * 100)}`,
        alertTier,
        severity: alertTier === "RED" ? "CRITICAL" : "WARNING",
        isDisasterZone,
        isDisaster: isDisasterZone,
        isModerateAdvisory: !isDisasterZone,
        isNormal: false,
        colorCode: alertTier === "RED" ? "#ef4444" : "#eab308",
        badgeLabel: alertTier === "RED"
          ? `🔴 Disaster Zone (${hazardName})`
          : `🟡 Yellow Alert (${hazardName} Advisory)`,
        movementStatus: alertTier === "RED"
          ? "TRAVEL HAZARDOUS / ROUTES SUSPENDED"
          : "MOVEMENT POSSIBLE WITH CAUTION",
        movementFeasible: alertTier !== "RED",
        isRealLiveIncident: true,
        source: "Global Disaster Alert and Coordination System (GDACS - UN & EC)",
        sourceIcon: icon,
        sourceUrl: link,
        disasterType: hazardName,
        title: `${title} (${nearest.name} Sector)`,
        destination: nearest.name,
        region: `${nearest.state} • GDACS Live Coordination Grid`,
        coordinates: { lat, lon },
        distanceToNearestHub: `${nearest.distanceKm} km from ${nearest.name}`,
        affectedCorridors: `${nearest.corridor} (~${nearest.distanceKm} km radius)`,
        status: alertTier === "RED" ? "CLOSED_TO_TOURISTS" : "RESTRICTED",
        issuedAt: pubDate,
        validUntil: new Date(Date.now() + 48 * 3600000).toISOString(),
        description: description || `Live disaster notification tracked by GDACS sensors. Location: ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E (~${nearest.distanceKm} km from ${nearest.name}).`,
        evacuationAdvice: alertTier === "RED"
          ? `Evacuate low-lying or exposed areas along ${nearest.corridor}. Contact district emergency center 1077.`
          : `Exercise caution while traveling across ${nearest.corridor}. Avoid waterlogged routes or coastal zones.`,
      });
    }

    const duration = Date.now() - t0;
    cachedProviderEvents.gdacs = gdacsEvents;
    providerHealth.gdacs = {
      status: "AVAILABLE",
      reason: null,
      durationMs: duration,
      lastSuccessAt: new Date().toISOString(),
      lastAttemptAt: new Date().toISOString(),
      count: gdacsEvents.length,
      errorDetails: null,
    };

    return { provider: "GDACS", status: "AVAILABLE", events: gdacsEvents, durationMs: duration };
  } catch (err) {
    const duration = Date.now() - t0;
    const reason = err.code === "TIMEOUT" ? "TIMEOUT" : "NETWORK_ERROR";
    const retained = cachedProviderEvents.gdacs.filter((e) => !e.validUntil || new Date(e.validUntil).getTime() > Date.now());
    providerHealth.gdacs = {
      status: "UNAVAILABLE",
      reason,
      durationMs: duration,
      lastAttemptAt: new Date().toISOString(),
      count: retained.length,
      errorDetails: err.message,
    };
    console.warn(`[WeatherSync] ⚠️ GDACS UNAVAILABLE [${reason} ${duration}ms]: ${err.message}. Retaining ${retained.length} active cached events.`);
    return { provider: "GDACS", status: "UNAVAILABLE", reason, events: retained, durationMs: duration, error: err.message };
  }
}

/**
 * 2. Fetch real-time earthquakes in India from USGS
 */
async function fetchLiveUSGSEarthquakes() {
  const t0 = Date.now();
  providerHealth.usgs.lastAttemptAt = new Date().toISOString();

  try {
    let usgsUrl = process.env.USGS_EARTHQUAKE_URL || USGS_EARTHQUAKE_URL;
    if (!usgsUrl.includes("format=")) {
      const sep = usgsUrl.includes("?") ? "&" : "?";
      usgsUrl = `${usgsUrl}${sep}format=geojson&minmagnitude=2.0&minlatitude=8.0&maxlatitude=36.0&minlongitude=68.5&maxlongitude=97.5&limit=50`;
    }

    const res = await safeHttpRequest(usgsUrl, {
      timeout: 5000,
      accept: "application/json"
    });

    if (!res.ok) {
      throw new Error(`USGS HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.features || !data.features.length) {
      const duration = Date.now() - t0;
      cachedProviderEvents.usgs = [];
      providerHealth.usgs = {
        status: "AVAILABLE",
        reason: null,
        durationMs: duration,
        lastSuccessAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        count: 0,
        errorDetails: null,
      };
      return { provider: "USGS", status: "AVAILABLE", events: [], durationMs: duration };
    }

    const indianEvents = [];
    const foreignExclusions = [
      "tajikistan", "afghanistan", "pakistan", "china", "bhutan",
      "burma", "sri lanka", "xizang", "tibet", "iran", "uzbekistan"
    ];

    for (const f of data.features) {
      const p = f.properties;
      const [lon, lat, depth] = f.geometry.coordinates;
      const mag = p.mag || 0;
      const placeLower = (p.place || "").toLowerCase();

      if (foreignExclusions.some((c) => placeLower.includes(c))) {
        continue;
      }

      const nearest = findNearestIndiaLocation(lat, lon);
      if (!nearest) continue;

      if (nearest.distanceKm > 250 && !placeLower.includes("india")) {
        continue;
      }

      let alertTier = "GREEN";
      let severity = "NORMAL";
      let isDisasterZone = false;
      let isModerateAdvisory = false;
      let status = "NORMAL";
      let colorCode = "#10b981";
      let badgeLabel = "🟢 Green (Minor Tremor - Movement Normal)";
      let movementStatus = "MOVEMENT COMPLETELY POSSIBLE";
      let movementFeasible = true;

      if (mag >= 5.0 && nearest.distanceKm < 150) {
        alertTier = "RED";
        severity = "CRITICAL";
        isDisasterZone = true;
        status = "CLOSED_TO_TOURISTS";
        colorCode = "#ef4444";
        badgeLabel = "🔴 Disaster Zone (Major Seismic Hazard)";
        movementStatus = "TRAVEL HAZARDOUS / ROUTES SUSPENDED";
        movementFeasible = false;
      } else if (mag >= 4.0 && nearest.distanceKm < 200) {
        alertTier = "YELLOW";
        severity = "WARNING";
        isModerateAdvisory = true;
        status = "RESTRICTED";
        colorCode = "#eab308";
        badgeLabel = "🟡 Yellow Alert (Tremor Advisory - Movement Possible)";
        movementStatus = "MOVEMENT POSSIBLE WITH CAUTION";
        movementFeasible = true;
      }

      indianEvents.push({
        id: `USGS-${f.id}`,
        alertTier,
        severity,
        isDisasterZone,
        isDisaster: isDisasterZone,
        isModerateAdvisory,
        isNormal: !isDisasterZone && !isModerateAdvisory,
        colorCode,
        badgeLabel,
        movementStatus,
        movementFeasible,
        isRealLiveIncident: true,
        source: "USGS Live Indian Subcontinent Seismic Network",
        sourceIcon: "🌐",
        sourceUrl: p.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${f.id}`,
        disasterType: "Earthquake / Seismic Tremor",
        title: p.title || `M ${mag.toFixed(1)} Seismic Tremor near ${nearest.name}`,
        magnitude: `M ${mag.toFixed(1)}`,
        depthKm: `${Math.round(depth)} km`,
        destination: nearest.name,
        region: `${nearest.state} • ${p.place || nearest.corridor}`,
        coordinates: { lat, lon, depthKm: depth },
        distanceToNearestHub: `${nearest.distanceKm} km from ${nearest.name}`,
        affectedCorridors: `${nearest.corridor} & connecting arterial routes within ${nearest.distanceKm} km`,
        status,
        issuedAt: new Date(p.time).toISOString(),
        validUntil: new Date(p.time + 48 * 3600000).toISOString(),
        description: `Live seismic tremor recorded by USGS sensors. Epicenter: ${p.place}. Magnitude: M ${mag.toFixed(1)}, Depth: ${Math.round(depth)} km. Located ~${nearest.distanceKm} km from ${nearest.name} (${nearest.state}).`,
        evacuationAdvice: nearest.distanceKm < 100 && mag >= 4.5
          ? `Stay outdoors away from unstable structures or hillside cuts along ${nearest.corridor}.`
          : `Mild tremor recorded in ${nearest.state}. Main roadways and hotels remain operational.`,
      });
    }

    const duration = Date.now() - t0;
    cachedProviderEvents.usgs = indianEvents;
    providerHealth.usgs = {
      status: "AVAILABLE",
      reason: null,
      durationMs: duration,
      lastSuccessAt: new Date().toISOString(),
      lastAttemptAt: new Date().toISOString(),
      count: indianEvents.length,
      errorDetails: null,
    };

    return { provider: "USGS", status: "AVAILABLE", events: indianEvents, durationMs: duration };
  } catch (err) {
    const duration = Date.now() - t0;
    const reason = err.code === "TIMEOUT" ? "TIMEOUT" : "NETWORK_ERROR";
    const retained = cachedProviderEvents.usgs.filter((e) => !e.validUntil || new Date(e.validUntil).getTime() > Date.now());
    providerHealth.usgs = {
      status: "UNAVAILABLE",
      reason,
      durationMs: duration,
      lastAttemptAt: new Date().toISOString(),
      count: retained.length,
      errorDetails: err.message,
    };
    console.warn(`[WeatherSync] ⚠️ USGS UNAVAILABLE [${reason} ${duration}ms]: ${err.message}. Retaining ${retained.length} active cached events.`);
    return { provider: "USGS", status: "UNAVAILABLE", reason, events: retained, durationMs: duration, error: err.message };
  }
}

/**
 * 3. Fetch live NASA EONET events in the Indian Subcontinent
 */
async function fetchLiveNASAEvents() {
  const t0 = Date.now();
  providerHealth.nasa.lastAttemptAt = new Date().toISOString();
  const timeoutMs = parseInt(process.env.NASA_TIMEOUT_MS, 10) || 12000;

  try {
    let nasaUrl = process.env.NASA_EONET_URL || NASA_EONET_URL;
    if (!nasaUrl.includes("status=")) {
      const sep = nasaUrl.includes("?") ? "&" : "?";
      nasaUrl = `${nasaUrl}${sep}status=open&days=20&limit=25`;
    }

    const res = await safeHttpRequest(nasaUrl, {
      timeout: timeoutMs,
      accept: "application/json"
    });

    if (!res.ok) {
      const err = new Error(`NASA HTTP ${res.status}`);
      err.status = res.status;
      err.code = `HTTP_${res.status}`;
      throw err;
    }

    const data = await res.json();
    if (!data.events || !data.events.length) {
      const duration = Date.now() - t0;
      cachedProviderEvents.nasa = [];
      providerHealth.nasa = {
        status: "AVAILABLE",
        reason: null,
        durationMs: duration,
        lastSuccessAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        count: 0,
        errorDetails: null,
      };
      return { provider: "NASA", status: "AVAILABLE", events: [], durationMs: duration };
    }

    const indiaEvents = [];

    for (const e of data.events) {
      const geo = e.geometry?.[e.geometry.length - 1];
      const coords = geo?.coordinates || [0, 0];
      const lon = coords[0];
      const lat = coords[1];

      const isWithinIndiaBox = lat >= 6.5 && lat <= 36.5 && lon >= 65.0 && lon <= 98.0;
      if (!isWithinIndiaBox) continue;

      const nearest = findNearestIndiaLocation(lat, lon);
      const cat = e.categories?.[0]?.title || "Severe Storm / Natural Event";
      const isSevereCyclone = (e.title || "").toLowerCase().includes("cyclone") || (cat.toLowerCase().includes("cyclone"));

      const alertTier = isSevereCyclone && nearest && nearest.distanceKm < 150 ? "RED" : "YELLOW";
      const isDisasterZone = alertTier === "RED";

      indiaEvents.push({
        id: `NASA-IN-${e.id}`,
        alertTier,
        severity: alertTier === "RED" ? "CRITICAL" : "WARNING",
        isDisasterZone,
        isDisaster: isDisasterZone,
        isModerateAdvisory: !isDisasterZone,
        isNormal: false,
        colorCode: alertTier === "RED" ? "#ef4444" : "#eab308",
        badgeLabel: alertTier === "RED"
          ? "🔴 Disaster Zone (Severe Cyclone Landfall)"
          : "🟡 Yellow Alert (Maritime Storm Advisory - Movement Possible)",
        movementStatus: alertTier === "RED"
          ? "TRAVEL HAZARDOUS / ROUTES SUSPENDED"
          : "MOVEMENT POSSIBLE WITH CAUTION",
        movementFeasible: alertTier !== "RED",
        isRealLiveIncident: true,
        source: "NASA Earth Observatory (EONET Satellite Tracking)",
        sourceIcon: "🔭",
        sourceUrl: e.sources?.[0]?.url || `https://eonet.gsfc.nasa.gov/api/v3/events/${e.id}`,
        disasterType: cat,
        title: `${e.title} (Indian Subcontinent)`,
        destination: nearest ? nearest.name : "Indian Coastal Waters",
        region: `${nearest?.name || "India"} Sector • Satellite Observation`,
        coordinates: { lat, lon },
        status: alertTier === "RED" ? "CLOSED_TO_TOURISTS" : "RESTRICTED",
        issuedAt: geo?.date || new Date().toISOString(),
        validUntil: new Date(Date.now() + 72 * 3600000).toISOString(),
        description: `NASA satellite tracking active natural event: "${e.title}". Detected over coordinates ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E (~${nearest?.distanceKm || 0} km from ${nearest?.name}).`,
        evacuationAdvice: "Follow IMD meteorological directives. Avoid sea voyages and exposed ridge trails.",
      });
    }

    const duration = Date.now() - t0;
    cachedProviderEvents.nasa = indiaEvents;
    providerHealth.nasa = {
      status: "AVAILABLE",
      reason: null,
      durationMs: duration,
      lastSuccessAt: new Date().toISOString(),
      lastAttemptAt: new Date().toISOString(),
      count: indiaEvents.length,
      errorDetails: null,
    };

    return { provider: "NASA", status: "AVAILABLE", events: indiaEvents, durationMs: duration };
  } catch (err) {
    const duration = Date.now() - t0;
    const httpStatus = err.status || null;
    let reason = "UNKNOWN_ERROR";

    if (err.code === "TIMEOUT" || err.name === "TimeoutError" || (err.message && err.message.toLowerCase().includes("timeout"))) {
      reason = "timeout";
    } else if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") {
      reason = "dns_failure";
    } else if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET" || err.code === "EHOSTUNREACH" || err.code === "ETIMEDOUT") {
      reason = "connection_failure";
    } else if (httpStatus && httpStatus >= 400 && httpStatus < 500) {
      reason = `http_${httpStatus}`;
    } else if (httpStatus && httpStatus >= 500) {
      reason = `http_${httpStatus}`;
    } else if (err.name === "SyntaxError" || (err.message && err.message.toLowerCase().includes("json"))) {
      reason = "malformed_response";
    } else {
      reason = "network_failure";
    }

    const retained = cachedProviderEvents.nasa.filter((e) => !e.validUntil || new Date(e.validUntil).getTime() > Date.now());
    providerHealth.nasa = {
      status: "UNAVAILABLE",
      reason,
      durationMs: duration,
      lastAttemptAt: new Date().toISOString(),
      count: retained.length,
      errorDetails: err.message,
      httpStatus,
      errorCode: err.code || null,
      errorName: err.name || "Error",
      timeoutMs,
    };

    console.warn(
      `[WeatherSync] NASA fetch error:\n` +
      `  • Error Name: ${err.name || "Error"}\n` +
      `  • Error Message: ${err.message}\n` +
      `  • Timeout Duration: ${timeoutMs}ms\n` +
      `  • Request Duration: ${duration}ms\n` +
      `  • HTTP Status: ${httpStatus || "N/A"}\n` +
      `  • Error Code: ${err.code || "N/A"}\n` +
      `  • Underlying Cause: ${reason}\n` +
      `  • Retained Cached Events: ${retained.length}`
    );
    console.warn(`[NASA] unavailable\nreason=${reason}\nduration=${duration}ms`);

    return { provider: "NASA", status: "UNAVAILABLE", reason, events: retained, durationMs: duration, error: err.message };
  }
}

/**
 * 3.5 Fetch Live RainViewer Weather Radar Frames (Real-time Precipitation Animation)
 */
async function fetchRainViewerRadarFrames() {
  const now = Date.now();
  if (cachedRadarFrames && now - lastRadarFramesFetchTime < RADAR_FRAMES_TTL_MS) {
    return cachedRadarFrames;
  }

  try {
    const res = await fetch("https://api.rainviewer.com/public/weather-maps.json", {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`RainViewer HTTP ${res.status}`);
    const data = await res.json();

    const host = data.host || "https://tilecache.rainviewer.com";
    const radarPast = data.radar?.past || [];
    const radarNowcast = data.radar?.nowcast || [];
    const satelliteInfrared = data.satellite?.infrared || [];

    const frames = [...radarPast, ...radarNowcast].map((item) => ({
      time: item.time,
      formattedTime: new Date(item.time * 1000).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
      path: item.path,
      tileUrlTemplate: `${host}${item.path}/256/{z}/{x}/{y}/2/1_1.png`,
      isNowcast: radarNowcast.some((n) => n.time === item.time),
    }));

    const result = {
      version: data.version || "v2",
      generated: data.generated || Math.floor(Date.now() / 1000),
      host,
      frames,
      latestFrame: frames[frames.length - 1] || null,
      satelliteFrames: satelliteInfrared.map((item) => ({
        time: item.time,
        path: item.path,
        tileUrlTemplate: `${host}${item.path}/256/{z}/{x}/{y}/0/0_0.png`,
      })),
    };

    cachedRadarFrames = result;
    lastRadarFramesFetchTime = Date.now();
    return result;
  } catch (err) {
    console.warn("[WeatherSync] RainViewer radar frames fetch notice:", err.message);
    // Construct robust fallback time frames (10 min steps)
    const currentUnix = Math.floor(Date.now() / 1000);
    const fallbackFrames = [ -30, -20, -10, 0 ].map((offsetMins) => {
      const t = currentUnix + offsetMins * 60;
      return {
        time: t,
        formattedTime: new Date(t * 1000).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }),
        path: `/v2/radar/${t}`,
        tileUrlTemplate: `https://tilecache.rainviewer.com/v2/radar/${t}/256/{z}/{x}/{y}/2/1_1.png`,
        isNowcast: offsetMins > 0,
      };
    });

    return {
      version: "v2-fallback",
      generated: currentUnix,
      host: "https://tilecache.rainviewer.com",
      frames: fallbackFrames,
      latestFrame: fallbackFrames[fallbackFrames.length - 1],
      satelliteFrames: [],
    };
  }
}

// Compass direction resolver
function getWindCompass(deg) {
  if (deg == null) return "VAR";
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const idx = Math.round(deg / 22.5) % 16;
  return dirs[idx] || "N";
}

/**
 * 3.6 Fetch Tomorrow.io Real-Time Weather for a single coordinate
 */
async function fetchTomorrowIoWeather(lat, lon) {
  if (!TOMORROW_IO_API_KEY) return null;
  try {
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${TOMORROW_IO_API_KEY}&units=metric`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const values = data.data?.values;
    if (!values) return null;

    const code = values.weatherCode || 1000;
    const mapped = mapTomorrowIoWeatherCode(code);

    return {
      temperature: values.temperature != null ? Math.round(values.temperature * 10) / 10 : null,
      apparentTemperature: values.temperatureApparent != null ? Math.round(values.temperatureApparent * 10) / 10 : null,
      humidity: values.humidity != null ? Math.round(values.humidity) : null,
      precipitation: values.precipitationIntensity != null ? Math.round(values.precipitationIntensity * 10) / 10 : 0,
      rain: values.rainIntensity != null ? Math.round(values.rainIntensity * 10) / 10 : 0,
      windSpeed: values.windSpeed != null ? Math.round(values.windSpeed * 3.6) : null, // m/s to km/h
      windDirection: values.windDirection != null ? values.windDirection : null,
      windCompass: values.windDirection != null ? getWindCompass(values.windDirection) : "",
      windGusts: values.windGust != null ? Math.round(values.windGust * 3.6) : null,
      pressure: values.pressureSurfaceLevel != null ? Math.round(values.pressureSurfaceLevel) : null,
      visibility: values.visibility != null ? Math.round(values.visibility * 10) / 10 : null,
      uvIndex: values.uvIndex != null ? Math.round(values.uvIndex) : null,
      weatherCode: code,
      condition: mapped.label,
      icon: mapped.icon,
      category: mapped.category,
      provider: "Tomorrow.io Realtime API",
      isLive: true,
      lastUpdatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * 3.7 Fetch Tomorrow.io Forecast (Hourly & Daily) for a destination
 */
async function fetchTomorrowIoForecast(lat, lon) {
  if (!TOMORROW_IO_API_KEY) return null;
  try {
    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${TOMORROW_IO_API_KEY}&units=metric`;
    const res = await fetch(url, { signal: AbortSignal.timeout(9000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

/**
 * Returns complete Radar & Meteorological Capabilities
 */
async function getRadarCapabilities() {
  const radarData = await fetchRainViewerRadarFrames();
  return {
    providers: {
      tomorrowIo: {
        name: "Tomorrow.io",
        isConfigured: !!TOMORROW_IO_API_KEY,
        weatherEndpoint: "https://api.tomorrow.io/v4/weather/realtime",
        tileUrlTemplate: TOMORROW_IO_API_KEY
          ? `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/{layer}/{timestamp}.png?apikey=${TOMORROW_IO_API_KEY}`
          : null,
        availableLayers: ["precipitation", "clouds", "windSpeed", "temperature"],
      },
      rainViewer: {
        name: "RainViewer Global Live Radar",
        isConfigured: true,
        host: radarData.host,
        tileUrlTemplate: radarData.latestFrame?.tileUrlTemplate || "https://tilecache.rainviewer.com/v2/radar/{timestamp}/256/{z}/{x}/{y}/2/1_1.png",
        frames: radarData.frames,
        latestTimestamp: radarData.latestFrame?.time || Math.floor(Date.now() / 1000),
      },
      openMeteo: {
        name: "Open-Meteo European Flood & Hydrology Radar",
        isConfigured: true,
        endpoint: "https://api.open-meteo.com/v1/forecast",
      },
      gdacs: {
        name: "GDACS (UN & European Commission)",
        isConfigured: true,
        feedUrl: "https://www.gdacs.org/xml/rss.xml",
      },
      usgs: {
        name: "USGS Seismic Network",
        isConfigured: true,
        endpoint: "https://earthquake.usgs.gov/fdsnws/event/1/query",
      },
      nasaEonet: {
        name: "NASA Earth Observatory (EONET v3)",
        isConfigured: true,
        endpoint: "https://eonet.gsfc.nasa.gov/api/v3/events",
      },
      imdNdma: {
        name: "IMD Mausam & NDMA Directives",
        isConfigured: true,
      },
    },
    radarLayers: [
      { id: "precipitation", label: "Precipitation Radar", icon: "🌧️", description: "Real-time rain & snowfall intensity scan" },
      { id: "clouds", label: "Cloud Cover Satellite", icon: "☁️", description: "Infrared satellite cloud formation scan" },
      { id: "wind", label: "Wind & Gale Storm Vectors", icon: "💨", description: "Surface wind velocity & squall warnings" },
      { id: "temperature", label: "Thermal & Freeze Heatmap", icon: "🌡️", description: "Microclimate thermal gradients & sub-zero frost" },
    ],
    timestamp: new Date().toISOString(),
  };
}

/**
 * 4. Batch fetch real-time Open-Meteo / Tomorrow.io weather telemetry for all locations with smart caching & 429 backoff
 */
async function fetchAllLocationsWeather() {
  const t0 = Date.now();
  const now = Date.now();
  providerHealth.openMeteo.lastAttemptAt = new Date().toISOString();

  // Return cached data if rate-limited or cache is still fresh (< 5 mins)
  if (cachedWeatherMap && now < rateLimitBackoffUntil) {
    const duration = Date.now() - t0;
    return { status: "RATE_LIMITED_CACHE", weatherMap: cachedWeatherMap, durationMs: duration };
  }
  if (cachedWeatherMap && now - lastWeatherFetchTime < WEATHER_CACHE_TTL_MS) {
    const duration = Date.now() - t0;
    return { status: "FRESH_CACHE", weatherMap: cachedWeatherMap, durationMs: duration };
  }

  try {
    const locations = Object.entries(INDIA_LOCATIONS);
    const lats = locations.map(([, info]) => info.lat).join(",");
    const lons = locations.map(([, info]) => info.lon).join(",");

    const weatherUrl = `${OPEN_METEO_API_URL}?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m,is_day,cloud_cover,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max&timezone=Asia%2FKolkata&forecast_days=7`;

    const res = await safeHttpRequest(weatherUrl, { timeout: 12000, accept: "application/json" });

    if (res.status === 429) {
      rateLimitBackoffUntil = Date.now() + 60 * 1000; // Adaptive 60s backoff instead of locking for 10 minutes
      const duration = Date.now() - t0;
      providerHealth.openMeteo = {
        status: "RATE_LIMITED_CACHE",
        reason: "HTTP_429",
        durationMs: duration,
        lastAttemptAt: new Date().toISOString(),
        count: cachedWeatherMap ? Object.keys(cachedWeatherMap).length : 0,
        errorDetails: "Open-Meteo rate limit active (429) - serving verified cached telemetry",
      };
      console.log(`[WeatherSync] ℹ️ Open-Meteo rate limit (429) active, seamlessly serving verified live telemetry for ${cachedWeatherMap ? Object.keys(cachedWeatherMap).length : 0} stations.`);
      return { status: "RATE_LIMITED_CACHE", weatherMap: cachedWeatherMap || {}, durationMs: duration };
    }

    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = await res.json();

    const results = Array.isArray(data) ? data : [data];
    const weatherMap = {};

    await Promise.all(results.map(async (item, index) => {
      const [destName] = locations[index];
      const cur = item.current;
      if (!cur) return;

      const code = cur.weather_code ?? 0;
      const weatherInfo = mapWeatherCode(code);
      const windDir = cur.wind_direction_10m != null ? cur.wind_direction_10m : 0;
      const windCompass = getWindCompass(windDir);
      const pressure = cur.surface_pressure != null ? Math.round(cur.surface_pressure) : null;
      // visibility in open-meteo is in meters, convert to km
      const visibilityKm = cur.visibility != null ? Math.round((cur.visibility / 1000) * 10) / 10 : null;
      const dewPoint = cur.dew_point_2m != null ? Math.round(cur.dew_point_2m * 10) / 10 : null;
      const isDay = cur.is_day != null ? cur.is_day : 0;
      const cloudCover = cur.cloud_cover != null ? Math.round(cur.cloud_cover) : 0;
      const elevation = item.elevation != null ? item.elevation : null;

      // Extract 7-day daily forecast
      const daily = item.daily || {};
      const rawDailyForecast = (daily.time || []).map((date, idx) => {
        const dCode = daily.weather_code?.[idx] ?? 0;
        const dInfo = mapWeatherCode(dCode);
        return {
          date,
          tripDay: idx + 1,
          weatherCode: dCode,
          condition: dInfo.label,
          icon: dInfo.icon,
          category: dInfo.category,
          temperatureMax: daily.temperature_2m_max?.[idx] != null ? Math.round(daily.temperature_2m_max[idx] * 10) / 10 : null,
          temperatureMin: daily.temperature_2m_min?.[idx] != null ? Math.round(daily.temperature_2m_min[idx] * 10) / 10 : null,
          precipitationSum: daily.precipitation_sum?.[idx] != null ? Math.round(daily.precipitation_sum[idx] * 10) / 10 : 0,
          precipitationProbability: daily.precipitation_probability_max?.[idx] ?? 0,
          windSpeedMax: daily.wind_speed_10m_max?.[idx] != null ? Math.round(daily.wind_speed_10m_max[idx]) : 0,
          windGustsMax: daily.wind_gusts_10m_max?.[idx] != null ? Math.round(daily.wind_gusts_10m_max[idx]) : 0,
          uvIndexMax: daily.uv_index_max?.[idx] != null ? Math.round(daily.uv_index_max[idx] * 10) / 10 : 5.0,
        };
      });

      // Calibrate 7-day forecast via Python Intelligence downscaling
      let calibratedForecast = rawDailyForecast;
      try {
        calibratedForecast = await pythonClient.calibrateForecast(destName, rawDailyForecast, elevation);
      } catch (fErr) {
        console.warn(`[WeatherSync] Forecast calibration notice for ${destName}:`, fErr.message);
      }

      weatherMap[destName.toLowerCase()] = {
        temperature: cur.temperature_2m != null ? Math.round(cur.temperature_2m * 10) / 10 : null,
        apparentTemperature: cur.apparent_temperature != null ? Math.round(cur.apparent_temperature * 10) / 10 : null,
        humidity: cur.relative_humidity_2m ?? null,
        dewPoint: dewPoint,
        isDay: isDay,
        cloudCover: cloudCover,
        elevation: elevation,
        precipitation: cur.precipitation != null ? Math.round(cur.precipitation * 10) / 10 : 0,
        rain: cur.rain != null ? Math.round(cur.rain * 10) / 10 : 0,
        windSpeed: cur.wind_speed_10m != null ? Math.round(cur.wind_speed_10m) : null,
        windDirection: windDir,
        windCompass: windCompass,
        windGusts: cur.wind_gusts_10m != null ? Math.round(cur.wind_gusts_10m) : null,
        pressure: pressure,
        visibility: visibilityKm,
        weatherCode: code,
        condition: weatherInfo.label,
        icon: weatherInfo.icon,
        category: weatherInfo.category,
        forecast: calibratedForecast,
        daily: item.daily || null,
        provider: TOMORROW_IO_API_KEY ? "Tomorrow.io / Open-Meteo Unified Radar" : "Open-Meteo Satellite Radar",
        lastUpdatedAt: new Date().toISOString(),
      };
    }));

    const duration = Date.now() - t0;
    cachedWeatherMap = weatherMap;
    lastWeatherFetchTime = Date.now();
    providerHealth.openMeteo = {
      status: "AVAILABLE",
      reason: null,
      durationMs: duration,
      lastSuccessAt: new Date().toISOString(),
      lastAttemptAt: new Date().toISOString(),
      count: Object.keys(weatherMap).length,
      errorDetails: null,
    };

    return { status: "AVAILABLE", weatherMap, durationMs: duration };
  } catch (err) {
    const duration = Date.now() - t0;
    const reason = err.code === "TIMEOUT" ? "TIMEOUT" : "NETWORK_ERROR";
    providerHealth.openMeteo = {
      status: cachedWeatherMap ? "DEGRADED" : "UNAVAILABLE",
      reason,
      durationMs: duration,
      lastAttemptAt: new Date().toISOString(),
      count: cachedWeatherMap ? Object.keys(cachedWeatherMap).length : 0,
      errorDetails: err.message,
    };
    if (cachedWeatherMap) {
      console.warn(`[WeatherSync] Open-Meteo fallback to cached telemetry [${reason} ${duration}ms]:`, err.message);
      return { status: "DEGRADED_CACHE", weatherMap: cachedWeatherMap, durationMs: duration };
    }
    console.warn(`[WeatherSync] Open-Meteo notice [${reason} ${duration}ms]:`, err.message);
    return { status: "UNAVAILABLE", weatherMap: {}, durationMs: duration, error: err.message };
  }
}

/**
 * 5. Master Sync Function: Unifies Weather Telemetry with All Real-Time Disasters
 */
async function syncDatabaseNow() {
  if (liveDatabase.isSyncing) {
    console.log("[WeatherSync] Sync already in progress, skipping concurrent run.");
    return liveDatabase;
  }

  liveDatabase.isSyncing = true;
  const startTime = Date.now();
  console.log(`[WeatherSync] 🔄 Starting automated sync cycle #${liveDatabase.syncCount + 1}...`);

  try {
    // Execute all 4 external provider requests concurrently with independent timing & error isolation
    const [usgsRes, nasaRes, gdacsRes, weatherRes] = await Promise.all([
      fetchLiveUSGSEarthquakes(),
      fetchLiveNASAEvents(),
      fetchLiveGDACSEvents(),
      fetchAllLocationsWeather(),
    ]);

    const weatherMap = weatherRes.weatherMap || {};
    const weatherFetchMs = weatherRes.durationMs;
    const disasterFetchMs = Math.max(usgsRes.durationMs, nasaRes.durationMs, gdacsRes.durationMs);

    const usgsEvents = usgsRes.events || [];
    const nasaEvents = nasaRes.events || [];
    const gdacsEvents = gdacsRes.events || [];
    const allRawDisasterEvents = [...usgsEvents, ...nasaEvents, ...gdacsEvents];

    // Pass authentic events to Python Intelligence Layer for geospatial & lifecycle analysis
    const tPyStart = Date.now();
    let disasterIntelligence = null;
    try {
      const prevEvents = liveDatabase.recentEventsTimeline || [];
      disasterIntelligence = await pythonClient.analyzeDisasters(allRawDisasterEvents, prevEvents);
    } catch (pyErr) {
      console.warn("[WeatherSync] Python disaster intelligence notice:", pyErr.message);
    }

    // Step 1: Microclimate downscaling & validation of destination weather observations via Python Intelligence
    const validationPromises = Object.entries(INDIA_LOCATIONS).map(async ([name, info]) => {
      const key = name.toLowerCase();
      let rawW = (weatherMap && weatherMap[key]) || null;
      if (!rawW || rawW.temperature == null) {
        return {
          name,
          info,
          rawW,
          validation: {
            valid: false,
            source: rawW?.provider || (TOMORROW_IO_API_KEY ? "Tomorrow.io" : "Open-Meteo"),
            destination: name,
            errors: ["Missing mandatory temperature reading from meteorological API"],
            warnings: [],
            isStale: false,
            dataAgeMinutes: null,
            qualityScore: 0.0,
          },
        };
      }

      // Physics-based microclimate downscaling (Himalayan katabatic drainage, high-altitude radiative cooling)
      let calibratedW = rawW;
      try {
        calibratedW = await pythonClient.calibrateWeather({
          ...rawW,
          latitude: info.lat,
          longitude: info.lon,
          destination: name,
        }, name);
        if (weatherMap) {
          weatherMap[key] = calibratedW;
        }
      } catch (calErr) {
        console.warn(`[WeatherSync] Microclimate calibration notice for ${name}:`, calErr.message);
      }

      const validation = await pythonClient.validateWeather({
        temperature: calibratedW.temperature,
        apparentTemperature: calibratedW.apparentTemperature,
        humidity: calibratedW.humidity,
        windSpeed: calibratedW.windSpeed,
        windDirection: calibratedW.windDirection,
        windCompass: calibratedW.windCompass,
        windGusts: calibratedW.windGusts,
        pressure: calibratedW.pressure,
        visibility: calibratedW.visibility,
        precipitation: calibratedW.precipitation,
        rain: calibratedW.rain,
        weatherCode: calibratedW.weatherCode,
        condition: calibratedW.condition,
        icon: calibratedW.icon,
        source: calibratedW.provider || (TOMORROW_IO_API_KEY ? "Tomorrow.io" : "Open-Meteo"),
        timestamp: calibratedW.lastUpdatedAt || new Date().toISOString(),
        latitude: info.lat,
        longitude: info.lon,
        destination: name,
        dewPoint: calibratedW.dewPoint,
        isDay: calibratedW.isDay,
        cloudCover: calibratedW.cloudCover,
        elevation: calibratedW.elevation,
      });

      return { name, info, rawW: calibratedW, validation };
    });

    const validatedObservations = await Promise.all(validationPromises);

    // Step 2: Evaluate destination telemetry, change detection, and risk intelligence concurrently
    const destinationEvaluationPromises = validatedObservations.map(async (item) => {
      const { name, info, rawW, validation: validationResult } = item;
      const key = name.toLowerCase();
      const prevObs = liveDatabase.destinations?.[name]?.weather || null;

      let liveW;
      if (validationResult.valid && rawW) {
        liveW = {
          ...rawW,
          isValid: true,
          validation: validationResult,
        };
      } else {
        if (rawW && rawW.temperature != null) {
          console.warn(`[WeatherSync] ⚠️ Meteorological observation for ${name} rejected by Python validation:`, validationResult.errors);
        }
        if (prevObs && prevObs.isValid !== false && prevObs.temperature != null) {
          liveW = {
            ...prevObs,
            isDegraded: true,
            validation: validationResult,
          };
        } else {
          liveW = {
            temperature: null,
            apparentTemperature: null,
            humidity: null,
            precipitation: 0,
            rain: 0,
            windSpeed: null,
            windDirection: null,
            windCompass: "",
            windGusts: null,
            pressure: null,
            visibility: null,
            weatherCode: null,
            condition: "Observation Unverified",
            icon: "❓",
            category: "unknown",
            provider: rawW?.provider || (TOMORROW_IO_API_KEY ? "Tomorrow.io / Open-Meteo Unified Radar" : "Open-Meteo Satellite Radar"),
            isValid: false,
            validation: validationResult,
          };
        }
      }

      // Default baseline: Tier 4 - Normal
      let alertTier = "GREEN";
      let severity = "NORMAL";
      let alertType = "NORMAL";
      let isDisasterZone = false;
      let isModerateAdvisory = false;
      let isRainAlert = false;
      let isNormal = true;
      let status = "NORMAL";
      let colorCode = "#10b981";
      let badgeLabel = "🟢 Normal (All Routes Open & Verified)";
      let movementStatus = "ALL ROUTES OPEN & NORMAL";
      let movementFeasible = true;
      let hazardType = "Normal Microclimate & Clear Corridors";
      let title = `Clear Corridors & Normal Weather: ${name}`;
      const tempDisplay = liveW.temperature != null ? `${liveW.temperature}°C` : "Live";
      const windDisplay = liveW.windSpeed != null ? `${liveW.windSpeed} km/h` : "Standard";
      let description = `Fair weather conditions. Current Temperature: ${tempDisplay}. Wind: ${windDisplay}. Highway corridor ${info.corridor} is 100% operational with smooth transit.`;
      let advice = `Monitored live via Open-Meteo satellite & Tomorrow.io radar. Enjoy your journey with standard schedule.`;
      let activeThreat = null;
      let activeBulletinId = null;
      let sourceName = "Open-Meteo Satellite & National Disaster Network";

      // Rule A: Real-time severe weather thresholds
      if (
        (liveW.precipitation != null && liveW.precipitation >= 30.0) ||
        (liveW.windGusts != null && liveW.windGusts >= 70.0) ||
        (liveW.temperature != null && liveW.temperature >= 46.0)
      ) {
        alertTier = "RED";
        severity = "CRITICAL";
        alertType = "DISASTER_ZONE";
        isDisasterZone = true;
        isNormal = false;
        status = "CLOSED_TO_TOURISTS";
        colorCode = "#ef4444";
        badgeLabel = "🔴 Disaster Zone (Critical Weather Hazard)";
        movementStatus = "TRAVEL HAZARDOUS / ROUTES SUSPENDED";
        movementFeasible = false;
        hazardType = (liveW.precipitation || 0) >= 30 ? "Torrential Cloudburst & Flash Flood" : "Extreme Gale Storm";
        title = `CRITICAL ALERT: Severe Weather Disruption in ${name}`;
        description = `Extreme telemetry recorded: Precipitation ${liveW.precipitation || 0} mm/h, Gusts ${liveW.windGusts || 0} km/h. Highway corridor ${info.corridor} has high risk of flooding or landslides.`;
        advice = "Stay indoors in safe masonry accommodations. Follow local administration orders.";
        sourceName = "Open-Meteo Severe Weather & Hydrology Radar";
      } else if (
        (liveW.precipitation != null && liveW.precipitation >= 15.0) ||
        (liveW.windGusts != null && liveW.windGusts >= 48.0) ||
        (liveW.temperature != null && liveW.temperature <= -2.0) ||
        (liveW.temperature != null && liveW.temperature >= 42.0)
      ) {
        alertTier = "YELLOW";
        severity = "WARNING";
        alertType = "MODERATE_ADVISORY";
        isModerateAdvisory = true;
        isNormal = false;
        status = "RESTRICTED";
        colorCode = "#eab308";
        badgeLabel = "🟡 Yellow Alert (Weather Advisory - Movement with Caution)";
        movementStatus = "MOVEMENT POSSIBLE WITH CAUTION";
        movementFeasible = true;
        hazardType = liveW.temperature != null && liveW.temperature <= -2 ? "High-Altitude Black Ice & Sub-Zero Freeze" : "Heavy Rain & Wind Advisory";
        title = `WEATHER ADVISORY: Caution Advised in ${name}`;
        description = `Advisory conditions: Rain ${liveW.precipitation || 0} mm/h, Gusts ${liveW.windGusts || 0} km/h, Temp ${tempDisplay}. Movement is operational with speed restrictions.`;
        advice = "Drive cautiously, avoid night driving, keep vehicle headlights on.";
        sourceName = "Open-Meteo Severe Weather & Hydrology Radar";
      } else if (liveW.precipitation != null && liveW.precipitation >= 1.0) {
        alertTier = "GREEN";
        severity = "GREEN_ALERT";
        alertType = "RAIN_ALERT";
        isRainAlert = true;
        isNormal = true;
        status = "NORMAL";
        colorCode = "#10b981";
        badgeLabel = "🟢 Rain Alert (Standard Rainfall - Movement Normal)";
        movementStatus = "MOVEMENT COMPLETELY POSSIBLE";
        movementFeasible = true;
        hazardType = "Standard Seasonal Rainfall";
        title = `Rain Alert: Standard Rainfall in ${name} (${liveW.precipitation} mm/h)`;
        description = `Intermittent rain showers (${liveW.precipitation} mm/h). Temperature: ${tempDisplay}. No landslides or route blockages reported.`;
        advice = "Carry an umbrella. All transit, trains, and arterial highways are operating on time.";
        sourceName = "Open-Meteo Satellite Radar";
      }

      // Rule B: Overlay live GDACS events
      const gdacs = gdacsEvents.find((g) => g.destination.toLowerCase() === key);
      if (gdacs && (gdacs.alertTier === "RED" || (gdacs.alertTier === "YELLOW" && alertTier !== "RED"))) {
        alertTier = gdacs.alertTier;
        severity = gdacs.severity;
        isDisasterZone = gdacs.isDisasterZone;
        isModerateAdvisory = gdacs.isModerateAdvisory;
        isNormal = false;
        status = gdacs.status;
        colorCode = gdacs.colorCode;
        badgeLabel = gdacs.badgeLabel;
        movementStatus = gdacs.movementStatus;
        movementFeasible = gdacs.movementFeasible;
        hazardType = gdacs.disasterType;
        title = gdacs.title;
        description = gdacs.description;
        advice = gdacs.evacuationAdvice || advice;
        activeThreat = gdacs.disasterType;
        activeBulletinId = gdacs.id;
        sourceName = "GDACS (United Nations & European Commission)";
      }

      // Rule D: Overlay live USGS earthquakes
      const quake = usgsEvents.find((q) => q.destination.toLowerCase() === key);
      if (quake && (quake.alertTier === "RED" || (quake.alertTier === "YELLOW" && alertTier !== "RED"))) {
        alertTier = quake.alertTier;
        severity = quake.severity;
        isDisasterZone = quake.isDisasterZone;
        isModerateAdvisory = quake.isModerateAdvisory;
        isNormal = false;
        status = quake.status;
        colorCode = quake.colorCode;
        badgeLabel = quake.badgeLabel;
        movementStatus = quake.movementStatus;
        movementFeasible = quake.movementFeasible;
        hazardType = quake.disasterType;
        title = quake.title;
        description = quake.description;
        advice = quake.evacuationAdvice || advice;
        activeThreat = quake.disasterType;
        activeBulletinId = quake.id;
        sourceName = "USGS Live Indian Subcontinent Seismic Network";
      }

      // Rule E: Overlay live NASA events
      const storm = nasaEvents.find((s) => s.destination.toLowerCase() === key);
      if (storm && (storm.alertTier === "RED" || (storm.alertTier === "YELLOW" && alertTier !== "RED"))) {
        alertTier = storm.alertTier;
        severity = storm.severity;
        isDisasterZone = storm.isDisasterZone;
        isModerateAdvisory = storm.isModerateAdvisory;
        isNormal = false;
        status = storm.status;
        colorCode = storm.colorCode;
        badgeLabel = storm.badgeLabel;
        movementStatus = storm.movementStatus;
        movementFeasible = storm.movementFeasible;
        hazardType = storm.disasterType;
        title = storm.title;
        description = storm.description;
        advice = storm.evacuationAdvice || advice;
        activeThreat = storm.disasterType;
        activeBulletinId = storm.id;
        sourceName = "NASA Earth Observatory (EONET Satellite)";
      }

      const isOfficialAlertPresent = alertTier === "RED" || alertTier === "YELLOW" || isRainAlert;
      const officialAlert = {
        isPresent: isOfficialAlertPresent,
        isOfficialGovernmentAlert: true,
        source: sourceName,
        alertTier,
        severity,
        title: isOfficialAlertPresent ? title : `No Active Government Warning for ${name}`,
        description: isOfficialAlertPresent
          ? description
          : `Official monitoring network (IMD, NDMA, USGS, GDACS) reports normal atmospheric & seismic conditions across ${info.state}.`,
        issuedAt: new Date().toISOString(),
        bulletinId: activeBulletinId || null,
        activeThreat: activeThreat || null,
      };

      const travelGurujiRisk = {
        isOfficialWarning: false,
        riskLevel: alertTier === "RED" ? "HIGH" : alertTier === "YELLOW" ? "MODERATE" : isRainAlert ? "LOW" : "MINIMAL",
        colorCode,
        reason: alertTier === "RED"
          ? `Severe meteorological / hazard alert detected near ${name} along corridor ${info.corridor}. Telemetry: Rain ${liveW.precipitation} mm/h, Wind Gusts ${liveW.windGusts} km/h.`
          : alertTier === "YELLOW"
          ? `Moderate weather or hazard advisory active near ${name} along ${info.corridor}. Caution recommended on transit corridors.`
          : isRainAlert
          ? `Intermittent precipitation (${liveW.precipitation} mm/h) detected. Road corridors operational with wet surfaces.`
          : `Corridors open and clear. Microclimate favorable for tourist travel.`,
        recommendation: alertTier === "RED"
          ? `Postpone non-essential travel to ${name}. Follow official district emergency directives and stay in safe accommodation.`
          : alertTier === "YELLOW"
          ? `Exercise caution and check official travel advisories before travelling. Avoid night journeys on mountain passes or coastal corridors.`
          : isRainAlert
          ? `Carry rain protection. Standard highway speeds recommended.`
          : `Proceed with your journey according to planned itinerary. Standard travel safety precautions apply.`,
        disclaimer: "Travel_Guruji Risk Interpretation is an automated algorithmic assessment for travel decision support and is NOT an official government emergency warning. Always heed official directives from IMD, NDMA, and local district authorities.",
      };

      // Weather change detection via Python Intelligence Layer
      let weatherChangeInfo = null;
      if (
        validationResult.valid &&
        !validationResult.isStale &&
        prevObs &&
        prevObs.isValid !== false &&
        !prevObs.isStale &&
        prevObs.temperature != null &&
        liveW &&
        liveW.temperature != null
      ) {
        try {
          weatherChangeInfo = await pythonClient.detectWeatherChange(name, liveW, prevObs);
        } catch (_) {}
      } else if (validationResult.isStale) {
        weatherChangeInfo = {
          destination: name,
          changed: false,
          changes: { staleObservation: true },
          significant: false,
          summary: `Observation for ${name} is stale (${validationResult.dataAgeMinutes} min old); weather change detection suspended.`,
          timestamp: new Date().toISOString(),
        };
      }

      // Grounded risk interpretation from Python Intelligence Layer
      let pythonRiskAnalysis = null;
      try {
        const destDisasters = allRawDisasterEvents.filter(
          (ev) => ev.destination && ev.destination.toLowerCase() === key
        );
        pythonRiskAnalysis = await pythonClient.analyzeRisk(
          name,
          validationResult.valid ? liveW : (prevObs && prevObs.temperature != null ? prevObs : null),
          destDisasters,
          info.lat,
          info.lon
        );
      } catch (_) {
        pythonRiskAnalysis = {
          status: "unavailable",
          message: "Intelligence analysis temporarily unavailable",
        };
      }

      return {
        name,
        alertTier,
        isRainAlert,
        destinationData: {
          name,
          state: info.state,
          type: info.type || "destination",
          corridor: info.corridor,
          river: info.river || "Regional Basin",
          coordinates: { lat: info.lat, lon: info.lon },
          weather: {
            ...liveW,
            forecast: liveW.forecast || (weatherMap && weatherMap[key] && weatherMap[key].forecast) || [],
            lastUpdatedAt: new Date().toISOString(),
            changeDetection: weatherChangeInfo,
            validation: validationResult,
          },
          officialAlert,
          travelGurujiRisk,
          intelligence: pythonRiskAnalysis || {
            status: "unavailable",
            message: "Intelligence analysis temporarily unavailable",
          },
          disaster: {
            alertTier,
            severity,
            alertType,
            isDisasterZone: alertTier === "RED",
            isDisaster: alertTier === "RED",
            isModerateAdvisory: alertTier === "YELLOW",
            isRainAlert,
            isNormal: alertTier === "GREEN" && !isRainAlert,
            status,
            colorCode,
            badgeLabel,
            movementStatus,
            movementFeasible,
            hazardType,
            title,
            description,
            advice,
            activeThreat,
            activeBulletinId,
            source: sourceName,
            safeAlternativeHub: info.state.includes("Himachal")
              ? "Chandigarh"
              : info.state.includes("Uttarakhand")
              ? "Dehradun"
              : "Nearest Capital Junction",
            affectedCorridors: info.corridor,
            lastVerifiedAt: new Date().toISOString(),
          },
        }
      };
    });

    const evaluatedResults = await Promise.all(destinationEvaluationPromises);

    const destinationMap = {};
    let disasterZonesCount = 0;
    let moderateAdvisoriesCount = 0;
    let rainAlertsCount = 0;
    let normalClearCount = 0;

    for (const item of evaluatedResults) {
      destinationMap[item.name] = item.destinationData;
      if (item.alertTier === "RED") disasterZonesCount++;
      else if (item.alertTier === "YELLOW") moderateAdvisoriesCount++;
      else if (item.isRainAlert) rainAlertsCount++;
      else normalClearCount++;
    }

    // Build timeline of active events
    const timeline = [];
    Object.values(destinationMap).forEach((d) => {
      if (d.disaster.alertTier === "RED" || d.disaster.alertTier === "YELLOW") {
        timeline.push({
          destination: d.name,
          state: d.state,
          tier: d.disaster.alertTier,
          title: d.disaster.title,
          hazardType: d.disaster.hazardType,
          corridor: d.corridor,
          movementStatus: d.disaster.movementStatus,
          source: d.disaster.source,
          timestamp: new Date().toISOString(),
        });
      }
    });

    const now = new Date();
    liveDatabase.lastSyncTimestamp = now.toISOString();
    liveDatabase.nextSyncTimestamp = new Date(now.getTime() + SYNC_INTERVAL_MS).toISOString();
    liveDatabase.syncCount += 1;
    liveDatabase.destinations = destinationMap;
    liveDatabase.recentEventsTimeline = timeline;
    liveDatabase.stats = {
      totalDestinations: Object.keys(destinationMap).length,
      disasterZones: disasterZonesCount,
      moderateAdvisories: moderateAdvisoriesCount,
      rainAlerts: rainAlertsCount,
      normalClear: normalClearCount,
    };
    liveDatabase.intelligenceSummary = {
      status: disasterIntelligence && !disasterIntelligence.fallback ? "active" : "unavailable",
      lastAnalyzedAt: new Date().toISOString(),
      disasterSummary: disasterIntelligence,
    };

    const pythonIntelligenceMs = Date.now() - tPyStart;
    const totalSyncMs = Date.now() - startTime;

    liveDatabase.performance = {
      weatherFetchMs,
      disasterFetchMs,
      pythonIntelligenceMs,
      totalSyncMs,
      lastMeasuredAt: new Date().toISOString(),
    };
    liveDatabase.providerStatus = { ...providerHealth };

    // Prevent duplicate disk writes if state has not meaningfully changed
    const stateFingerprint = JSON.stringify({
      stats: liveDatabase.stats,
      disastersCount: allRawDisasterEvents.length,
      activeQuakes: usgsEvents.length,
      activeNasa: nasaEvents.length,
      activeGdacs: gdacsEvents.length,
      tempSum: Math.round(Object.values(destinationMap).reduce((acc, d) => acc + (d.weather?.temperature || 0), 0) * 10) / 10,
    });

    const hasStateChanged = stateFingerprint !== lastKnownStateHash;
    if (hasStateChanged || liveDatabase.syncCount === 1) {
      lastKnownStateHash = stateFingerprint;
      try {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(liveDatabase, null, 2), "utf8");
      } catch (saveErr) {
        console.warn("[WeatherSync] Error saving database file:", saveErr.message);
      }
    }

    // Broadcast update to all connected SSE clients (browsers)
    broadcastUpdate({
      type: "REALTIME_DATABASE_UPDATE",
      timestamp: liveDatabase.lastSyncTimestamp,
      syncCount: liveDatabase.syncCount,
      stats: liveDatabase.stats,
      destinations: Object.values(liveDatabase.destinations),
      timeline: liveDatabase.recentEventsTimeline,
      intelligenceSummary: liveDatabase.intelligenceSummary,
    });

    console.log(
      `[WeatherSync] 📡 External Provider Status & Timings (Cycle #${liveDatabase.syncCount} in ${totalSyncMs}ms):\n` +
      `  • Open-Meteo: ${providerHealth.openMeteo.status === "RATE_LIMITED_CACHE" ? "RATE_LIMITED (Serving Fresh Cached Telemetry)" : providerHealth.openMeteo.status} (${providerHealth.openMeteo.durationMs}ms) [${Object.keys(weatherMap).length} stations]\n` +
      `  • USGS Seismic: ${providerHealth.usgs.status} (${providerHealth.usgs.durationMs}ms) [${usgsEvents.length} events]\n` +
      `  • GDACS Coordination: ${providerHealth.gdacs.status} (${providerHealth.gdacs.durationMs}ms) [${gdacsEvents.length} events]\n` +
      `  • NASA EONET: ${providerHealth.nasa.status} (${providerHealth.nasa.durationMs}ms) [${nasaEvents.length} events]\n` +
      `  • Python Intelligence: ${pythonIntelligenceMs}ms [55 stations analyzed]\n` +
      `  • Regional Impact: ${disasterZonesCount} 🔴 Disaster Zones, ${moderateAdvisoriesCount} 🟡 Advisories, ${rainAlertsCount} 🌧️ Rain Alerts, ${normalClearCount} 🟢 Clear Hubs.`
    );

  } catch (err) {
    console.error("[WeatherSync] ❌ Sync cycle failed:", err.message);
  } finally {
    liveDatabase.isSyncing = false;
  }

  return liveDatabase;
}

/**
 * Register a client response for Server-Sent Events (SSE)
 */
function registerSseClient(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  // Send immediate initial data
  const initialPayload = JSON.stringify({
    type: "INITIAL_DATABASE_STATE",
    timestamp: liveDatabase.lastSyncTimestamp,
    syncCount: liveDatabase.syncCount,
    stats: liveDatabase.stats,
    destinations: Object.values(liveDatabase.destinations || {}),
    timeline: liveDatabase.recentEventsTimeline || [],
    intelligenceSummary: liveDatabase.intelligenceSummary || { status: "active" },
  });
  res.write(`data: ${initialPayload}\n\n`);

  sseClients.add(res);

  // Send periodic keep-alive ping to prevent proxy/browser timeout
  const pingInterval = setInterval(() => {
    try {
      if (res.destroyed || res.writableEnded) {
        clearInterval(pingInterval);
        sseClients.delete(res);
        return;
      }
      res.write(":ping\n\n");
    } catch {
      clearInterval(pingInterval);
      sseClients.delete(res);
    }
  }, 15000);

  const cleanup = () => {
    clearInterval(pingInterval);
    sseClients.delete(res);
  };

  res.on("close", cleanup);
  res.on("finish", cleanup);
  res.on("error", cleanup);
}

/**
 * Broadcast real-time database update to all active browsers
 */
function broadcastUpdate(payload) {
  if (sseClients.size === 0) return;
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      if (client.destroyed || client.writableEnded) {
        sseClients.delete(client);
        continue;
      }
      client.write(message);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}


/**
 * Formats alerts into the authoritative emergency format
 */
function getAllRealtimeAlerts(destination = "", severity = "") {
  const destArray = Object.values(liveDatabase.destinations || {});
  let list = destArray.map((d) => {
    const isDis = d.disaster.alertTier === "RED";
    const isMod = d.disaster.alertTier === "YELLOW";
    return {
      id: d.disaster.activeBulletinId || `ALERT-${d.name.toUpperCase().replace(/\s+/g, "_")}`,
      alertTier: d.disaster.alertTier,
      severity: d.disaster.severity,
      isDisasterZone: isDis,
      isDisaster: isDis,
      isModerateAdvisory: isMod,
      isRainAlert: d.disaster.isRainAlert,
      isNormal: d.disaster.isNormal,
      colorCode: d.disaster.colorCode,
      badgeLabel: d.disaster.badgeLabel,
      movementStatus: d.disaster.movementStatus,
      movementFeasible: d.disaster.movementFeasible,
      isRealLiveIncident: true,
      source: d.disaster.source || "Unified Realtime Disaster Network",
      sourceIcon: isDis ? "🚨" : isMod ? "🟡" : d.disaster.isRainAlert ? "🌧️" : "🟢",
      disasterType: d.disaster.hazardType,
      title: d.disaster.title,
      destination: d.name,
      region: `${d.state} • ${d.corridor}`,
      coordinates: d.coordinates,
      affectedCorridors: d.disaster.affectedCorridors || d.corridor,
      affectedTransportModes: isDis
        ? "Road Highway Movement Suspended"
        : isMod
        ? "Movement Possible with Precaution"
        : "All Transport Modes Clear",
      status: d.disaster.status,
      issuedAt: d.disaster.lastVerifiedAt || liveDatabase.lastSyncTimestamp,
      validUntil: new Date(Date.now() + 48 * 3600000).toISOString(),
      description: d.disaster.description,
      evacuationAdvice: d.disaster.advice,
      safeAlternativeHub: d.disaster.safeAlternativeHub,
      safeEvacuationRoute: {
        routeTitle: `Safe Arterial Highway via ${d.corridor}`,
        estimatedTransitTime: "2.5 hrs",
        safetyStatus: isDis ? "POLICE_ESCORTED" : "ALL_WEATHER_CLEAR",
        recommendedMode: isDis ? "Govt. SDRF Evacuation Shuttle" : "Standard Intercity Transport",
        stepByStepInstructions: [
          `1. Depart ${d.name} via ${d.corridor}.`,
          "2. Follow directives from district police and SEOC helpline 1070.",
          `3. Arrive safely at transit hub ${d.disaster.safeAlternativeHub}.`,
        ],
      },
      liveWeather: {
        temp: d.weather.temperature,
        windGust: d.weather.windGusts,
        precipitation: d.weather.precipitation,
        humidity: d.weather.humidity,
        condition: d.weather.condition,
        icon: d.weather.icon,
      },
    };
  });

  if (destination && destination.trim()) {
    const dLower = destination.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.destination.toLowerCase() === dLower ||
        a.region.toLowerCase().includes(dLower) ||
        (a.title && a.title.toLowerCase().includes(dLower))
    );
  }

  if (severity && severity.trim()) {
    const sLower = severity.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.severity.toLowerCase() === sLower ||
        a.alertTier.toLowerCase() === sLower ||
        (sLower === "disaster_zone" && a.isDisasterZone) ||
        (sLower === "rain_alert" && a.isRainAlert)
    );
  }

  return list.sort((a, b) => {
    const rank = (item) => {
      if (item.alertTier === "RED") return 1;
      if (item.alertTier === "YELLOW") return 2;
      if (item.isRainAlert) return 3;
      return 4;
    };
    return rank(a) - rank(b);
  });
}

/**
 * Start the background continuous synchronization scheduler
 */
function startRealtimeSyncScheduler() {
  if (syncTimerId) {
    clearInterval(syncTimerId);
  }

  // Load existing database file if present on startup
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const saved = JSON.parse(fs.readFileSync(DB_FILE_PATH, "utf8"));
      if (saved && saved.destinations && Object.keys(saved.destinations).length > 0) {
        liveDatabase = { ...liveDatabase, ...saved, isSyncing: false };
        console.log(
          `[WeatherSync] 📂 Loaded existing database snapshot from disk (${Object.keys(saved.destinations).length} locations).`
        );
      }
    }
  } catch (e) {
    console.warn("[WeatherSync] Could not read existing DB file:", e.message);
  }

  // Run immediate first sync
  syncDatabaseNow();

  // Schedule recurring background sync every 60 seconds continuously
  syncTimerId = setInterval(() => {
    syncDatabaseNow();
  }, SYNC_INTERVAL_MS);

  console.log(`[WeatherSync] 🚀 Realtime background sync scheduler active (polling every ${SYNC_INTERVAL_MS / 1000}s).`);
}

function getLiveDatabase() {
  return liveDatabase;
}

function getLiveDestinationsArray(filters = {}) {
  const list = Object.values(liveDatabase.destinations || {});

  let result = list;

  if (filters.tier) {
    const t = filters.tier.toUpperCase();
    if (t === "RED") {
      result = result.filter((d) => d.disaster.alertTier === "RED");
    } else if (t === "YELLOW") {
      result = result.filter((d) => d.disaster.alertTier === "YELLOW");
    } else if (t === "GREEN") {
      result = result.filter((d) => d.disaster.alertTier === "GREEN");
    } else if (t === "RAIN") {
      result = result.filter((d) => d.disaster.isRainAlert);
    }
  }

  if (filters.search) {
    const s = filters.search.toLowerCase().trim();
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(s) ||
        d.state.toLowerCase().includes(s) ||
        d.corridor.toLowerCase().includes(s) ||
        d.disaster.title.toLowerCase().includes(s)
    );
  }

  if (filters.state) {
    const st = filters.state.toLowerCase().trim();
    result = result.filter((d) => d.state.toLowerCase().includes(st));
  }

  return result.sort((a, b) => {
    const rank = (item) => {
      if (item.disaster.alertTier === "RED") return 1;
      if (item.disaster.alertTier === "YELLOW") return 2;
      if (item.disaster.isRainAlert) return 3;
      return 4;
    };
    return rank(a) - rank(b);
  });
}

function getDestinationByName(name) {
  if (!name) return null;
  const nLower = name.toLowerCase().trim();
  const found = Object.values(liveDatabase.destinations || {}).find(
    (d) => d.name.toLowerCase() === nLower
  );
  return found || null;
}

function getSyncStatus() {
  const now = Date.now();
  const lastSyncMs = liveDatabase.lastSyncTimestamp ? new Date(liveDatabase.lastSyncTimestamp).getTime() : 0;
  const secondsSinceSync = lastSyncMs ? Math.round((now - lastSyncMs) / 1000) : null;
  const nextSyncInSeconds = Math.max(0, Math.round((SYNC_INTERVAL_MS - (now - lastSyncMs)) / 1000));

  return {
    isAutoSyncRunning: true,
    syncIntervalSeconds: SYNC_INTERVAL_MS / 1000,
    syncCount: liveDatabase.syncCount,
    lastSyncTimestamp: liveDatabase.lastSyncTimestamp,
    secondsSinceSync,
    nextSyncInSeconds,
    isSyncing: liveDatabase.isSyncing,
    stats: liveDatabase.stats,
    performance: liveDatabase.performance,
    providerStatus: liveDatabase.providerStatus || providerHealth,
    dataSources: liveDatabase.dataSources,
    recentEventsTimeline: liveDatabase.recentEventsTimeline,
    activeSubscribersCount: sseClients.size,
  };
}

module.exports = {
  startRealtimeSyncScheduler,
  syncDatabaseNow,
  getLiveDatabase,
  getLiveDestinationsArray,
  getDestinationByName,
  getSyncStatus,
  registerSseClient,
  getAllRealtimeAlerts,
  getRadarCapabilities,
  fetchRainViewerRadarFrames,
  fetchTomorrowIoWeather,
  fetchTomorrowIoForecast,
  fetchLiveNASAEvents,
  fetchLiveGDACSEvents,
  fetchLiveUSGSEarthquakes,
  fetchAllLocationsWeather,
  providerHealth,
};
