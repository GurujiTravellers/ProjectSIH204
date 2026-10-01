const express = require("express");
const {
  getLiveDestinationsArray,
  getSyncStatus,
  syncDatabaseNow,
  getDestinationByName,
  registerSseClient,
  getRadarCapabilities,
  fetchRainViewerRadarFrames,
  fetchTomorrowIoWeather,
  fetchTomorrowIoForecast,
} = require("../services/realtimeWeatherSyncService");
const pythonClient = require("../services/pythonIntelligenceClient");

const router = express.Router();

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = process.env.OPEN_METEO_API_URL || "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

function getWeatherSummary(weatherCode) {
  const code = Number(weatherCode) || 0;
  if (code === 0) return { icon: "☀️", label: "Clear", category: "clear" };
  if ([1, 2].includes(code)) return { icon: "🌤️", label: "Partly Cloudy", category: "cloudy" };
  if (code === 3) return { icon: "☁️", label: "Overcast", category: "cloudy" };
  if ([45, 48].includes(code)) return { icon: "🌫️", label: "Foggy", category: "fog" };
  if ([51, 53, 55, 56, 57].includes(code)) return { icon: "🌦️", label: "Drizzle", category: "rain" };
  if ([61, 63, 65, 66, 67, 80, 81].includes(code)) return { icon: "🌧️", label: "Rain", category: "rain" };
  if ([82, 95, 96, 99].includes(code)) return { icon: "⛈️", label: "Heavy Rain", category: "heavy-rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: "❄️", label: "Snow", category: "snow" };
  return { icon: "🌤️", label: "Mixed Weather", category: "mixed" };
}

function computeReliefTelemetry(precipSum = 0, precipProb = 0, windGust = 0, tempMax = null, tempMin = null, weatherCode = 0) {
  let riskTier = "GREEN";
  let reliefStatus = "NORMAL / ROUTINE STANDBY";
  let safeTransitWindow = "06:00 AM - 07:00 PM (Optimal daylight & clear roads)";
  let travelFeasibility = "100% Clear & Accessible";
  let floodRisk = "Low / Negligible";
  let aerialViability = "Optimal: Clear sky ceiling, low wind shear";
  let supplyChecklist = [
    "Standard travel first-aid kit",
    "Hydration bottles & electrolytes",
    "Sunscreen & uv protection"
  ];

  if (precipSum >= 35 || windGust >= 70 || [82, 95, 96, 99].includes(weatherCode)) {
    riskTier = "RED";
    reliefStatus = "HIGH ALERT / RELIEF MOBILIZATION";
    safeTransitWindow = "EMERGENCY TRANSIT ONLY (Escorted convoys under SDRF / Police directives)";
    travelFeasibility = "Hazardous / Routes Suspended";
    floodRisk = "High: Flash Flood & Mountain Stream Overflow";
    aerialViability = "Suspended / Grounded: Low ceiling, heavy squall";
    supplyChecklist = [
      "Heavy-duty waterproof tarpaulins & shelter sheets",
      "Packaged potable drinking water (min 10L per family unit)",
      "High-energy dry rations & ready-to-eat meal packs",
      "Chlorine / iodine water purification drops",
      "Emergency VHF wireless / satellite emergency beacon",
      "High-clearance 4x4 utility relief vehicle with winches"
    ];
  } else if (precipSum >= 12 || windGust >= 45 || (tempMin != null && tempMin <= 0) || (tempMax != null && tempMax >= 42)) {
    riskTier = "YELLOW";
    reliefStatus = "MODERATE ADVISORY / CAUTION STANDBY";
    safeTransitWindow = "07:30 AM - 04:30 PM (Proceed with caution during full daylight)";
    travelFeasibility = "Movement Possible with Caution";
    floodRisk = precipSum >= 12 ? "Moderate runoff in low-lying sections" : "Low";
    aerialViability = windGust >= 45 ? "Caution: Moderate wind shear" : "Operational in morning hours";
    supplyChecklist = [
      "Waterproof rain jackets & protective boots",
      "High-capacity power bank (20,000 mAh)",
      "Thermal blankets / emergency insulation foil",
      "Basic non-perishable snack rations & glucose",
      "High-lumen LED torch with spare batteries"
    ];
  } else if (precipSum >= 1.0 || precipProb >= 40) {
    riskTier = "GREEN";
    reliefStatus = "STANDARD RAIN ALERT / NORMAL MOVEMENT";
    safeTransitWindow = "06:00 AM - 07:30 PM (All routes clear & accessible)";
    travelFeasibility = "Normal Movement (Standard seasonal shower)";
    floodRisk = "Standard drainage (Zero disruption)";
    aerialViability = "Operational: Safe for light aircraft & drones";
    supplyChecklist = [
      "Compact umbrella or light rain poncho",
      "Waterproof phone sleeve"
    ];
  }

  return {
    riskTier,
    reliefStatus,
    safeTransitWindow,
    travelFeasibility,
    floodRisk,
    aerialViability,
    supplyChecklist,
  };
}

/**
 * 0. GET REAL-TIME WEATHER RADAR CAPABILITIES & LIVE PROVIDER TILES
 * GET /api/weather/radar/capabilities
 * Supports Tomorrow.io Maps / Tiles & RainViewer Global Radar Frames
 */
router.get("/radar/capabilities", async (req, res) => {
  try {
    const capabilities = await getRadarCapabilities();
    res.json({
      success: true,
      ...capabilities,
    });
  } catch (error) {
    console.error("Radar capabilities error:", error);
    res.status(500).json({ success: false, message: "Error fetching radar capabilities" });
  }
});

/**
 * 0.5 GET REAL-TIME RAINVIEWER RADAR ANIMATION FRAMES
 * GET /api/weather/radar/frames
 */
router.get("/radar/frames", async (req, res) => {
  try {
    const framesData = await fetchRainViewerRadarFrames();
    res.json({
      success: true,
      ...framesData,
    });
  } catch (error) {
    console.error("Radar frames error:", error);
    res.status(500).json({ success: false, message: "Error fetching radar frames" });
  }
});

/**
 * 1. GET ALL DESTINATIONS WITH SYNCHRONIZED REAL-TIME WEATHER & DISASTERS
 * GET /api/weather/destinations?tier=RED|YELLOW|GREEN|RAIN&search=...&state=...
 */
router.get("/destinations", (req, res) => {
  try {
    const { tier, search, state } = req.query;
    const destinations = getLiveDestinationsArray({ tier, search, state });
    const syncStatus = getSyncStatus();

    res.json({
      success: true,
      count: destinations.length,
      isRealtimeDatabase: true,
      syncStatus,
      destinations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Live destinations weather error:", error);
    res.status(500).json({ success: false, message: "Error fetching synced weather destinations" });
  }
});

/**
 * 2. GET LIVE DATABASE SYNC STATUS & HEALTH
 * GET /api/weather/live-sync-status
 */
router.get("/live-sync-status", (req, res) => {
  try {
    const status = getSyncStatus();
    res.json({
      success: true,
      ...status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sync status error:", error);
    res.status(500).json({ success: false, message: "Error fetching sync status" });
  }
});

/**
 * 2.5 REAL-TIME SERVER-SENT EVENTS (SSE) STREAM
 * GET /api/weather/live-stream
 * Continuously pushes updates whenever background sync runs or disasters are detected
 */
router.get("/live-stream", (req, res) => {
  try {
    registerSseClient(res);
  } catch (error) {
    console.error("SSE stream error:", error);
    res.status(500).end();
  }
});

/**
 * 3. FORCE REAL-TIME DATABASE SYNC ON DEMAND
 * POST /api/weather/sync-now
 */
router.post("/sync-now", async (req, res) => {
  try {
    const updatedDb = await syncDatabaseNow();
    const destinations = getLiveDestinationsArray();
    const syncStatus = getSyncStatus();

    res.json({
      success: true,
      message: "Real-time database successfully synchronized with satellite, seismic & hydrology radar feeds.",
      syncStatus,
      count: destinations.length,
      destinations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Force sync error:", error);
    res.status(500).json({ success: false, message: "Error performing live sync" });
  }
});

/**
 * 4. GET SINGLE DESTINATION REAL-TIME WEATHER & DISASTER TELEMETRY
 * GET /api/weather/destination/:name
 */
router.get("/destination/:name", async (req, res) => {
  try {
    const destName = req.params.name.trim();
    const syncedData = getDestinationByName(destName);

    if (!syncedData) {
      return res.status(404).json({
        success: false,
        message: `Destination '${destName}' not found in synced weather database`,
      });
    }

    const coords = syncedData.coordinates;
    let liveProvider = syncedData.weather.provider || "Open-Meteo Satellite Radar";
    let hourlyForecast = [];
    let forecast7Day = null;

    // 1. Check Tomorrow.io real-time & forecast if key is available
    try {
      const tomorrowLive = await fetchTomorrowIoWeather(coords.lat, coords.lon);
      if (tomorrowLive && tomorrowLive.temperature != null) {
        const tomorrowValidation = await pythonClient.validateWeather({
          ...tomorrowLive,
          source: "Tomorrow.io Realtime API",
          timestamp: tomorrowLive.lastUpdatedAt || new Date().toISOString(),
          latitude: coords.lat,
          longitude: coords.lon,
          destination: destName,
        });

        if (tomorrowValidation.valid) {
          liveProvider = "Tomorrow.io Realtime API";
          syncedData.weather = {
            ...syncedData.weather,
            ...tomorrowLive,
            provider: "Tomorrow.io Realtime API",
            validation: tomorrowValidation,
          };
        } else {
          console.warn(`[WeatherRoutes] ⚠️ Tomorrow.io observation for ${destName} rejected by Python validation:`, tomorrowValidation.errors);
          syncedData.weather.validationFailure = tomorrowValidation.errors;
        }
      }

      const tomorrowForecast = await fetchTomorrowIoForecast(coords.lat, coords.lon);
      if (tomorrowForecast && tomorrowForecast.timelines?.hourly) {
        liveProvider = "Tomorrow.io Live Weather & Forecast";
        const tomorrowHourly = (tomorrowForecast.timelines.hourly || []).slice(0, 24).map((h) => ({
          time: h.time,
          temperature: h.values?.temperature != null ? Math.round(h.values.temperature * 10) / 10 : null,
          apparentTemperature: h.values?.temperatureApparent != null ? Math.round(h.values.temperatureApparent * 10) / 10 : null,
          humidity: h.values?.humidity != null ? Math.round(h.values.humidity) : null,
          precipitation: h.values?.precipitationIntensity != null ? Math.round(h.values.precipitationIntensity * 10) / 10 : 0,
          precipitationProbability: h.values?.precipitationProbability ?? null,
          windSpeed: h.values?.windSpeed != null ? Math.round(h.values.windSpeed * 3.6) : null,
          windDirection: h.values?.windDirection ?? null,
          pressure: h.values?.pressureSurfaceLevel != null ? Math.round(h.values.pressureSurfaceLevel) : null,
          visibility: h.values?.visibility != null ? Math.round(h.values.visibility * 10) / 10 : null,
          weatherCode: h.values?.weatherCode ?? null,
        }));

        hourlyForecast = tomorrowHourly;

        if (tomorrowForecast.timelines?.daily) {
          const tomorrowDaily = (tomorrowForecast.timelines.daily || []).slice(0, 7);
          forecast7Day = {
            source: "Tomorrow.io Forecast API",
            daily: {
              time: tomorrowDaily.map((d) => d.time),
              temperature_2m_max: tomorrowDaily.map((d) => d.values?.temperatureMax != null ? Math.round(d.values.temperatureMax * 10) / 10 : null),
              temperature_2m_min: tomorrowDaily.map((d) => d.values?.temperatureMin != null ? Math.round(d.values.temperatureMin * 10) / 10 : null),
              precipitation_sum: tomorrowDaily.map((d) => d.values?.precipitationSum != null ? Math.round(d.values.precipitationSum * 10) / 10 : 0),
              precipitation_probability_max: tomorrowDaily.map((d) => d.values?.precipitationProbabilityMax ?? 0),
              wind_speed_10m_max: tomorrowDaily.map((d) => d.values?.windSpeedMax != null ? Math.round(d.values.windSpeedMax * 3.6) : null),
            },
          };
        }
      }
    } catch (tErr) {
      console.warn("[WeatherRoutes] Tomorrow.io forecast fallback to Open-Meteo:", tErr.message);
    }

    // 1.5 If destination already has synchronized calibrated 7-day forecast, use it directly!
    if (syncedData.weather?.forecast && Array.isArray(syncedData.weather.forecast) && syncedData.weather.forecast.length > 0) {
      const sf = syncedData.weather.forecast;
      forecast7Day = {
        source: "Travel_Guruji Python Microclimate Intelligence (Calibrated)",
        daily: {
          time: sf.map((d) => d.date),
          temperature_2m_max: sf.map((d) => d.temperatureMax),
          temperature_2m_min: sf.map((d) => d.temperatureMin),
          precipitation_sum: sf.map((d) => d.precipitationSum),
          precipitation_probability_max: sf.map((d) => d.precipitationProbability),
          wind_speed_10m_max: sf.map((d) => d.windSpeedMax),
          weather_code: sf.map((d) => d.weatherCode),
        },
      };
    }

    // 2. Open-Meteo fallback if hourly or daily forecast is still needed
    let directCurrent = null;
    if (!forecast7Day || hourlyForecast.length === 0) {
      try {
        const forecastRes = await fetch(
          `${WEATHER_URL}?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility&timezone=Asia%2FKolkata&forecast_days=7`
        );
        if (forecastRes.ok) {
          const omData = await forecastRes.json();
          directCurrent = omData.current || null;

          if (omData.daily && omData.daily.time && !forecast7Day) {
            const rawDaily = omData.daily.time.map((d, i) => ({
              date: d,
              temperatureMax: omData.daily.temperature_2m_max?.[i],
              temperatureMin: omData.daily.temperature_2m_min?.[i],
            }));
            try {
              const calibratedDaily = await pythonClient.calibrateForecast(destName, rawDaily, omData.elevation);
              omData.daily.temperature_2m_max = calibratedDaily.map((d) => d.temperatureMax);
              omData.daily.temperature_2m_min = calibratedDaily.map((d) => d.temperatureMin);
            } catch (cErr) {
              console.warn("[WeatherRoutes] Fallback forecast calibration notice:", cErr.message);
            }
            forecast7Day = {
              source: "Open-Meteo Microclimate Calibrated Radar",
              daily: omData.daily,
            };
          }

          if (hourlyForecast.length === 0 && omData.hourly) {
            const h = omData.hourly;
            hourlyForecast = (h.time || []).slice(0, 24).map((t, idx) => ({
              time: t,
              temperature: h.temperature_2m?.[idx] != null ? Math.round(h.temperature_2m[idx] * 10) / 10 : null,
              apparentTemperature: h.apparent_temperature?.[idx] != null ? Math.round(h.apparent_temperature[idx] * 10) / 10 : null,
              humidity: h.relative_humidity_2m?.[idx] ?? null,
              precipitation: h.precipitation?.[idx] ?? 0,
              precipitationProbability: h.precipitation_probability?.[idx] ?? 0,
              windSpeed: h.wind_speed_10m?.[idx] != null ? Math.round(h.wind_speed_10m[idx]) : null,
              windDirection: h.wind_direction_10m?.[idx] ?? 0,
              pressure: h.surface_pressure?.[idx] != null ? Math.round(h.surface_pressure[idx]) : null,
              visibility: h.visibility?.[idx] != null ? Math.round((h.visibility[idx] / 1000) * 10) / 10 : null,
              weatherCode: h.weather_code?.[idx] ?? 0,
            }));
          }
        }
      } catch (fErr) {
        console.warn("[WeatherRoutes] Open-Meteo fallback forecast fetch error:", fErr.message);
      }
    }

    if (directCurrent && syncedData.weather?.temperature != null) {
      directCurrent.temperature_2m = syncedData.weather.temperature;
      if (syncedData.weather.apparentTemperature != null) {
        directCurrent.apparent_temperature = syncedData.weather.apparentTemperature;
      }
    }

    res.json({
      success: true,
      destination: {
        ...syncedData,
        weather: {
          ...syncedData.weather,
          provider: liveProvider,
        },
      },
      current: directCurrent,
      provider: liveProvider,
      hourlyForecast,
      forecast7Day,
      officialAlert: syncedData.officialAlert,
      travelGurujiRisk: syncedData.travelGurujiRisk,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Destination weather lookup error:", error);
    res.status(500).json({ success: false, message: "Error fetching destination weather" });
  }
});

/**
 * 4.5 AUTHENTIC PYTHON-CALIBRATED WEATHER FORECAST FOR TRIP PLAN & ITINERARY
 * GET /api/weather/forecast?destination=...&startDate=...&days=...&state=...
 */
router.get("/forecast", async (req, res) => {
  try {
    const destination = String(req.query.destination || req.query.city || "").trim();
    if (!destination) {
      return res.status(400).json({ success: false, message: "destination parameter is required" });
    }

    const startDate = req.query.startDate || "";
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 30);
    const stateHint = req.query.state || "";

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let startMidnight;
    let startDateStr = "";

    if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      startDateStr = startDate;
      const [y, m, d] = startDate.split("-").map(Number);
      startMidnight = new Date(y, m - 1, d);
    } else {
      startMidnight = todayMidnight;
      const y = todayMidnight.getFullYear();
      const m = String(todayMidnight.getMonth() + 1).padStart(2, "0");
      const d = String(todayMidnight.getDate()).padStart(2, "0");
      startDateStr = `${y}-${m}-${d}`;
    }

    const diffDays = Math.round((startMidnight.getTime() - todayMidnight.getTime()) / 86400000);
    const isLive = diffDays >= 0 && diffDays <= 14;

    const syncedDest = getDestinationByName(destination);

    // Fast path: Destination is part of our authoritative 55 stations in live window
    if (syncedDest && isLive && syncedDest.weather?.forecast?.length > 0) {
      const forecastDays = syncedDest.weather.forecast;
      const startIndex = forecastDays.findIndex((f) => f.date === startDateStr);
      let matchedDays = [];
      if (startIndex >= 0) {
        matchedDays = forecastDays.slice(startIndex, startIndex + days);
      } else if (diffDays >= 0 && diffDays < forecastDays.length) {
        matchedDays = forecastDays.slice(diffDays, diffDays + days);
      } else {
        matchedDays = forecastDays.slice(0, days);
      }

      if (matchedDays.length > 0) {
        const enrichedForecast = matchedDays.map((f, idx) => {
          const relief = computeReliefTelemetry(
            f.precipitationSum || 0,
            f.precipitationProbability || 0,
            f.windGustsMax || 0,
            f.temperatureMax,
            f.temperatureMin,
            f.weatherCode || 0
          );
          let dayDateObj;
          try {
            dayDateObj = new Date(`${f.date}T00:00:00`);
          } catch {
            dayDateObj = new Date();
          }
          return {
            date: f.date,
            tripDay: idx + 1,
            dayName: dayDateObj.toLocaleDateString("en-IN", { weekday: "short" }),
            temperatureMax: f.temperatureMax,
            temperatureMin: f.temperatureMin,
            precipitationProbability: f.precipitationProbability || 0,
            precipitationSum: f.precipitationSum || 0,
            windSpeedMax: f.windSpeedMax || 0,
            windGustMax: f.windGustsMax || 0,
            uvIndexMax: f.uvIndexMax || 5.0,
            weatherCode: f.weatherCode || 0,
            weatherLabel: f.condition || "Clear",
            weatherIcon: f.icon || "☀️",
            weatherCategory: f.category || "clear",
            microclimateCalibration: f.microclimateCalibration || null,
            riskTier: relief.riskTier,
            reliefStatus: relief.reliefStatus,
            safeTransitWindow: relief.safeTransitWindow,
            travelFeasibility: relief.travelFeasibility,
            floodRisk: relief.floodRisk,
            aerialViability: relief.aerialViability,
            supplyChecklist: relief.supplyChecklist,
          };
        });

        const todayForecast = enrichedForecast[0] ? {
          ...enrichedForecast[0],
          currentTemperature: syncedDest.weather.temperature,
          apparentTemperature: syncedDest.weather.apparentTemperature,
        } : null;

        const tomorrowForecast = enrichedForecast[1] || null;
        const daysAhead = enrichedForecast.slice(2);

        return res.json({
          success: true,
          mode: "live",
          location: {
            name: syncedDest.name,
            state: syncedDest.state,
            admin1: syncedDest.state,
            country: "India",
            latitude: syncedDest.coordinates.lat,
            longitude: syncedDest.coordinates.lon,
          },
          startDate: startDateStr,
          endDate: enrichedForecast[enrichedForecast.length - 1]?.date || startDateStr,
          days: enrichedForecast.length,
          current: {
            temperature_2m: syncedDest.weather.temperature,
            apparent_temperature: syncedDest.weather.apparentTemperature,
            relative_humidity_2m: syncedDest.weather.humidity,
            precipitation: syncedDest.weather.precipitation,
            weather_code: syncedDest.weather.weatherCode,
            wind_speed_10m: syncedDest.weather.windSpeed,
            microclimateCalibration: syncedDest.weather.microclimateCalibration || null,
          },
          forecast: enrichedForecast,
          today: todayForecast,
          tomorrow: tomorrowForecast,
          daysAhead,
          reliefPlanning: {
            overallRiskTier: enrichedForecast.some((f) => f.riskTier === "RED")
              ? "RED"
              : enrichedForecast.some((f) => f.riskTier === "YELLOW")
              ? "YELLOW"
              : "GREEN",
            safeOperatingHours: "06:30 AM - 05:30 PM (Recommended Daylight Window)",
            maxPrecipitationExpected: Math.max(...enrichedForecast.map((f) => f.precipitationSum || 0)),
            maxWindGustExpected: Math.max(...enrichedForecast.map((f) => f.windGustMax || 0)),
            reliefStagingReadiness: enrichedForecast.some((f) => f.riskTier === "RED")
              ? "ACTIVE RED ALERT: Emergency supply depots mobilized at district headquarters."
              : enrichedForecast.some((f) => f.riskTier === "YELLOW")
              ? "MODERATE ADVISORY: Buffer supplies and standby vehicles recommended."
              : "NORMAL STANDBY: All transport corridors operational; routine monitoring.",
            primaryHelpline: "DEOC: 1077 | State: 1070 | NDRF: 112",
          },
        });
      }
    }

    // Dynamic Geocoded Fallback (or non-synced stations / longer horizons)
    let location = null;
    if (syncedDest) {
      location = {
        name: syncedDest.name,
        state: syncedDest.state,
        admin1: syncedDest.state,
        country: "India",
        latitude: syncedDest.coordinates.lat,
        longitude: syncedDest.coordinates.lon,
      };
    } else {
      const geoRes = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(destination)}&count=10&language=en&format=json`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const results = geoData.results || [];
        const inResults = results.filter((r) => r.country_code === "IN" || (r.country && r.country.toLowerCase() === "india"));
        if (stateHint && inResults.length) {
          location = inResults.find((r) => r.admin1 && r.admin1.toLowerCase().includes(stateHint.toLowerCase())) || inResults[0];
        } else {
          location = inResults[0] || results[0] || null;
        }
      }
    }

    if (!location) {
      return res.status(404).json({ success: false, message: `Could not geocode location for '${destination}'` });
    }

    const formatYMD = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (isLive) {
      const endMidnight = new Date(startMidnight.getTime() + (days - 1) * 86400000);
      const maxForecastDate = new Date(todayMidnight.getTime() + 15 * 86400000);
      const cappedEnd = endMidnight > maxForecastDate ? maxForecastDate : endMidnight;

      const sStr = formatYMD(startMidnight);
      const eStr = formatYMD(cappedEnd);

      const omRes = await fetch(
        `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,dew_point_2m,is_day,cloud_cover,precipitation,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max` +
        `&timezone=auto&start_date=${sStr}&end_date=${eStr}`
      );

      if (!omRes.ok) {
        throw new Error(`Open-Meteo HTTP ${omRes.status}`);
      }

      const omData = await omRes.json();
      const daily = omData.daily || {};

      const rawForecast = (daily.time || []).map((date, idx) => {
        const code = daily.weather_code?.[idx] ?? 0;
        const summary = getWeatherSummary(code);
        return {
          date,
          tripDay: idx + 1,
          weatherCode: code,
          condition: summary.label,
          icon: summary.icon,
          category: summary.category,
          temperatureMax: daily.temperature_2m_max?.[idx] != null ? Math.round(daily.temperature_2m_max[idx] * 10) / 10 : null,
          temperatureMin: daily.temperature_2m_min?.[idx] != null ? Math.round(daily.temperature_2m_min[idx] * 10) / 10 : null,
          precipitationSum: daily.precipitation_sum?.[idx] != null ? Math.round(daily.precipitation_sum[idx] * 10) / 10 : 0,
          precipitationProbability: daily.precipitation_probability_max?.[idx] ?? 0,
          windSpeedMax: daily.wind_speed_10m_max?.[idx] != null ? Math.round(daily.wind_speed_10m_max[idx]) : 0,
          windGustsMax: daily.wind_gusts_10m_max?.[idx] != null ? Math.round(daily.wind_gusts_10m_max[idx]) : 0,
          uvIndexMax: daily.uv_index_max?.[idx] != null ? Math.round(daily.uv_index_max[idx] * 10) / 10 : 5.0,
        };
      });

      // Calibrate forecast via Python microclimate downscaling
      let calibratedForecast = rawForecast;
      try {
        calibratedForecast = await pythonClient.calibrateForecast(location.name, rawForecast, omData.elevation);
      } catch (calErr) {
        console.warn("[WeatherRoutes] Microclimate forecast downscaling notice:", calErr.message);
      }

      // Calibrate current observation
      let calibratedCurrent = omData.current || null;
      if (calibratedCurrent) {
        try {
          const calCur = await pythonClient.calibrateWeather({
            temperature: calibratedCurrent.temperature_2m,
            apparentTemperature: calibratedCurrent.apparent_temperature,
            humidity: calibratedCurrent.relative_humidity_2m,
            dewPoint: calibratedCurrent.dew_point_2m,
            isDay: calibratedCurrent.is_day,
            cloudCover: calibratedCurrent.cloud_cover,
            windSpeed: calibratedCurrent.wind_speed_10m,
            latitude: location.latitude,
            longitude: location.longitude,
            destination: location.name,
          }, location.name);
          calibratedCurrent.temperature_2m = calCur.temperature;
          calibratedCurrent.apparent_temperature = calCur.apparentTemperature;
          calibratedCurrent.microclimateCalibration = calCur.microclimateCalibration;
        } catch (_) {}
      }

      const enrichedForecast = calibratedForecast.map((f, idx) => {
        const relief = computeReliefTelemetry(
          f.precipitationSum || 0,
          f.precipitationProbability || 0,
          f.windGustsMax || f.windGustMax || 0,
          f.temperatureMax,
          f.temperatureMin,
          f.weatherCode || 0
        );
        let dayDateObj;
        try {
          dayDateObj = new Date(`${f.date}T00:00:00`);
        } catch {
          dayDateObj = new Date();
        }
        return {
          ...f,
          dayName: dayDateObj.toLocaleDateString("en-IN", { weekday: "short" }),
          weatherLabel: f.condition || "Clear",
          weatherIcon: f.icon || "☀️",
          weatherCategory: f.category || "clear",
          windGustMax: f.windGustsMax || f.windGustMax || 0,
          riskTier: relief.riskTier,
          reliefStatus: relief.reliefStatus,
          safeTransitWindow: relief.safeTransitWindow,
          travelFeasibility: relief.travelFeasibility,
          floodRisk: relief.floodRisk,
          aerialViability: relief.aerialViability,
          supplyChecklist: relief.supplyChecklist,
        };
      });

      const todayForecast = enrichedForecast[0] ? {
        ...enrichedForecast[0],
        currentTemperature: calibratedCurrent?.temperature_2m != null ? Math.round(calibratedCurrent.temperature_2m * 10) / 10 : null,
        apparentTemperature: calibratedCurrent?.apparent_temperature != null ? Math.round(calibratedCurrent.apparent_temperature * 10) / 10 : null,
      } : null;

      const tomorrowForecast = enrichedForecast[1] || null;
      const daysAhead = enrichedForecast.slice(2);

      return res.json({
        success: true,
        mode: "live",
        location,
        startDate: sStr,
        endDate: enrichedForecast[enrichedForecast.length - 1]?.date || sStr,
        days: enrichedForecast.length,
        current: calibratedCurrent,
        forecast: enrichedForecast,
        today: todayForecast,
        tomorrow: tomorrowForecast,
        daysAhead,
        reliefPlanning: {
          overallRiskTier: enrichedForecast.some((f) => f.riskTier === "RED") ? "RED" : enrichedForecast.some((f) => f.riskTier === "YELLOW") ? "YELLOW" : "GREEN",
          safeOperatingHours: "06:30 AM - 05:30 PM (Recommended Daylight Window)",
          maxPrecipitationExpected: Math.max(...enrichedForecast.map((f) => f.precipitationSum || 0)),
          maxWindGustExpected: Math.max(...enrichedForecast.map((f) => f.windGustMax || 0)),
          reliefStagingReadiness: enrichedForecast.some((f) => f.riskTier === "RED")
            ? "ACTIVE RED ALERT: Emergency supply depots mobilized at district headquarters."
            : enrichedForecast.some((f) => f.riskTier === "YELLOW")
            ? "MODERATE ADVISORY: Buffer supplies and standby vehicles recommended."
            : "NORMAL STANDBY: All transport corridors operational; routine monitoring.",
          primaryHelpline: "DEOC: 1077 | State: 1070 | NDRF: 112",
        },
      });
    } else {
      // Seasonal Mode: fetch authentic historical climate archive baseline
      const archiveYear = 2023;
      const histStart = new Date(archiveYear, startMidnight.getMonth(), startMidnight.getDate());
      const histEnd = new Date(histStart.getTime() + (days - 1) * 86400000);
      const sStr = formatYMD(histStart);
      const eStr = formatYMD(histEnd);

      const archRes = await fetch(
        `${OPEN_METEO_ARCHIVE_URL}?latitude=${location.latitude}&longitude=${location.longitude}` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
        `&timezone=auto&start_date=${sStr}&end_date=${eStr}`
      );

      if (!archRes.ok) throw new Error(`Archive HTTP ${archRes.status}`);
      const archData = await archRes.json();
      const daily = archData.daily || {};

      const rawForecast = (daily.time || []).map((date, idx) => {
        const futureDateObj = new Date(startMidnight.getTime() + idx * 86400000);
        const fStr = formatYMD(futureDateObj);
        const code = daily.weather_code?.[idx] ?? 0;
        const summary = getWeatherSummary(code);
        return {
          date: fStr,
          tripDay: idx + 1,
          weatherCode: code,
          condition: summary.label,
          icon: summary.icon,
          category: summary.category,
          temperatureMax: daily.temperature_2m_max?.[idx] != null ? Math.round(daily.temperature_2m_max[idx] * 10) / 10 : null,
          temperatureMin: daily.temperature_2m_min?.[idx] != null ? Math.round(daily.temperature_2m_min[idx] * 10) / 10 : null,
          precipitationSum: daily.precipitation_sum?.[idx] != null ? Math.round(daily.precipitation_sum[idx] * 10) / 10 : 0,
          precipitationProbability: 0,
          windSpeedMax: daily.wind_speed_10m_max?.[idx] != null ? Math.round(daily.wind_speed_10m_max[idx]) : 0,
          windGustsMax: 0,
          uvIndexMax: 5.0,
        };
      });

      let calibratedForecast = rawForecast;
      try {
        calibratedForecast = await pythonClient.calibrateForecast(location.name, rawForecast, archData.elevation);
      } catch (_) {}

      const enrichedForecast = calibratedForecast.map((f, idx) => {
        const relief = computeReliefTelemetry(
          f.precipitationSum || 0,
          0,
          f.windSpeedMax || 0,
          f.temperatureMax,
          f.temperatureMin,
          f.weatherCode || 0
        );
        let dayDateObj;
        try {
          dayDateObj = new Date(`${f.date}T00:00:00`);
        } catch {
          dayDateObj = new Date();
        }
        return {
          ...f,
          dayName: dayDateObj.toLocaleDateString("en-IN", { weekday: "short" }),
          weatherLabel: f.condition || "Clear",
          weatherIcon: f.icon || "☀️",
          weatherCategory: f.category || "clear",
          windGustMax: f.windSpeedMax || 0,
          riskTier: relief.riskTier,
          reliefStatus: relief.reliefStatus,
          safeTransitWindow: relief.safeTransitWindow,
          travelFeasibility: relief.travelFeasibility,
          floodRisk: relief.floodRisk,
          aerialViability: relief.aerialViability,
          supplyChecklist: relief.supplyChecklist,
        };
      });

      const todayForecast = enrichedForecast[0] || null;
      const tomorrowForecast = enrichedForecast[1] || null;
      const daysAhead = enrichedForecast.slice(2);

      return res.json({
        success: true,
        mode: "seasonal",
        location,
        startDate: formatYMD(startMidnight),
        endDate: enrichedForecast[enrichedForecast.length - 1]?.date || formatYMD(startMidnight),
        days: enrichedForecast.length,
        current: null,
        forecast: enrichedForecast,
        today: todayForecast,
        tomorrow: tomorrowForecast,
        daysAhead,
        reliefPlanning: {
          overallRiskTier: "GREEN",
          safeOperatingHours: "06:30 AM - 05:30 PM (Recommended Daylight Window)",
          maxPrecipitationExpected: Math.max(...enrichedForecast.map((f) => f.precipitationSum || 0)),
          maxWindGustExpected: Math.max(...enrichedForecast.map((f) => f.windGustMax || 0)),
          reliefStagingReadiness: "NORMAL STANDBY: Seasonal baseline projection.",
          primaryHelpline: "DEOC: 1077 | State: 1070 | NDRF: 112",
        },
      });
    }
  } catch (error) {
    console.error("Weather forecast route error:", error);
    res.status(500).json({ success: false, message: "Error fetching weather forecast: " + error.message });
  }
});

/**
 * 5. BACKWARD-COMPATIBLE SINGLE-CITY WEATHER FORECAST
 * GET /api/weather?city=...
 */
router.get("/", async (req, res) => {
  try {
    const city = String(req.query.city || "").trim();

    if (!city) {
      return res.status(400).json({
        message: "City is required",
      });
    }

    let location = null;
    const syncedDest = getDestinationByName(city);
    if (syncedDest && syncedDest.coordinates) {
      location = {
        name: syncedDest.name,
        country: "India",
        latitude: syncedDest.coordinates.lat,
        longitude: syncedDest.coordinates.lon,
        admin1: syncedDest.state || "",
      };
    } else {
      const geocodingResponse = await fetch(
        `${GEOCODING_URL}?name=${encodeURIComponent(
          city
        )}&count=10&language=en&format=json`
      );

      if (!geocodingResponse.ok) {
        throw new Error("Unable to find destination location");
      }

      const geocodingData = await geocodingResponse.json();
      const results = geocodingData.results || [];
      const indiaResults = results.filter(
        (r) => r.country_code === "IN" || (r.country && r.country.toLowerCase() === "india")
      );

      if (city.toLowerCase() === "manali") {
        location = indiaResults.find((r) => r.admin1 && r.admin1.toLowerCase().includes("himachal")) || indiaResults[0] || results[0];
      } else {
        location = indiaResults[0] || results[0];
      }
    }

    if (!location) {
      return res.status(404).json({
        message: "Weather location could not be found",
      });
    }

    const weatherResponse = await fetch(
      `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m,is_day,cloud_cover,precipitation,rain,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,rain_sum&timezone=auto&forecast_days=7`
    );

    if (!weatherResponse.ok) {
      throw new Error("Unable to fetch weather forecast");
    }

    const weatherData = await weatherResponse.json();

    if (weatherData.current) {
      try {
        const calibrated = await pythonClient.calibrateWeather({
          temperature: weatherData.current.temperature_2m,
          apparentTemperature: weatherData.current.apparent_temperature,
          humidity: weatherData.current.relative_humidity_2m,
          dewPoint: weatherData.current.dew_point_2m,
          isDay: weatherData.current.is_day,
          cloudCover: weatherData.current.cloud_cover,
          windSpeed: weatherData.current.wind_speed_10m,
          latitude: location.latitude,
          longitude: location.longitude,
          destination: location.name,
        }, location.name);
        weatherData.current.temperature_2m = calibrated.temperature;
        weatherData.current.apparent_temperature = calibrated.apparentTemperature;
        weatherData.current.microclimateCalibration = calibrated.microclimateCalibration;
      } catch (calErr) {
        console.warn("[WeatherRoutes] Microclimate calibration notice for single city:", calErr.message);
      }
    }

    if (weatherData.daily && weatherData.daily.time) {
      try {
        const rawDaily = weatherData.daily.time.map((d, i) => ({
          date: d,
          temperatureMax: weatherData.daily.temperature_2m_max?.[i],
          temperatureMin: weatherData.daily.temperature_2m_min?.[i],
        }));
        const calibratedDaily = await pythonClient.calibrateForecast(location.name, rawDaily);
        weatherData.daily.temperature_2m_max = calibratedDaily.map((d) => d.temperatureMax);
        weatherData.daily.temperature_2m_min = calibratedDaily.map((d) => d.temperatureMin);
      } catch (calErr) {
        console.warn("[WeatherRoutes] Microclimate daily forecast calibration notice:", calErr.message);
      }
    }

    return res.json({
      location: {
        name: location.name,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      current: weatherData.current,
      hourly: weatherData.hourly,
      daily: weatherData.daily,
      timezone: weatherData.timezone || null,
    });
  } catch (error) {
    console.error("Weather API error:", error.message);
    return res.status(500).json({
      message: "Unable to load weather forecast",
    });
  }
});

module.exports = router;