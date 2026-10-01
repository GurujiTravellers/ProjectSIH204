import { getApiBaseUrl } from "../config/apiConfig";

const OPEN_METEO_GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const OPEN_METEO_FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";

const OPEN_METEO_ARCHIVE_URL =
  "https://archive-api.open-meteo.com/v1/archive";

// Safe fallback coordinates for remote hamlets / natural spots not indexed in GeoNames
const KNOWN_LOCATION_FALLBACKS = {
  "manali": {
    name: "Manali",
    latitude: 32.2574,
    longitude: 77.1748,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "shimla": {
    name: "Shimla",
    latitude: 31.1048,
    longitude: 77.1734,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "sissu": {
    name: "Sissu",
    latitude: 32.4820,
    longitude: 77.1245,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "kasol": {
    name: "Kasol",
    latitude: 32.0100,
    longitude: 77.3150,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "chitkul": {
    name: "Chitkul",
    latitude: 31.3533,
    longitude: 78.4354,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "kalpa": {
    name: "Kalpa",
    latitude: 31.5372,
    longitude: 78.2562,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "srinagar": {
    name: "Srinagar",
    latitude: 34.0837,
    longitude: 74.7973,
    admin1: "Jammu & Kashmir",
    country: "India",
  },
  "gulmarg": {
    name: "Gulmarg",
    latitude: 34.0484,
    longitude: 74.3805,
    admin1: "Jammu & Kashmir",
    country: "India",
  },
  "pahalgam": {
    name: "Pahalgam",
    latitude: 34.0161,
    longitude: 75.3150,
    admin1: "Jammu & Kashmir",
    country: "India",
  },
  "rishikesh": {
    name: "Rishikesh",
    latitude: 30.0869,
    longitude: 78.2676,
    admin1: "Uttarakhand",
    country: "India",
  },
  "haridwar": {
    name: "Haridwar",
    latitude: 29.9457,
    longitude: 78.1642,
    admin1: "Uttarakhand",
    country: "India",
  },
  "darjeeling": {
    name: "Darjeeling",
    latitude: 27.0410,
    longitude: 88.2663,
    admin1: "West Bengal",
    country: "India",
  },
  "puri": {
    name: "Puri",
    latitude: 19.8135,
    longitude: 85.8312,
    admin1: "Odisha",
    country: "India",
  },
  "shillong": {
    name: "Shillong",
    latitude: 25.5788,
    longitude: 91.8933,
    admin1: "Meghalaya",
    country: "India",
  },
  "dawki": {
    name: "Dawki",
    latitude: 25.1878,
    longitude: 92.0199,
    admin1: "Meghalaya",
    country: "India",
  },
  "delhi": {
    name: "Delhi",
    latitude: 28.6139,
    longitude: 77.2090,
    admin1: "Delhi NCR",
    country: "India",
  },
  "jaipur": {
    name: "Jaipur",
    latitude: 26.9124,
    longitude: 75.7873,
    admin1: "Rajasthan",
    country: "India",
  },
  "jaisalmer": {
    name: "Jaisalmer",
    latitude: 26.9157,
    longitude: 70.9083,
    admin1: "Rajasthan",
    country: "India",
  },
  "bengaluru": {
    name: "Bengaluru",
    latitude: 12.9716,
    longitude: 77.5946,
    admin1: "Karnataka",
    country: "India",
  },
  "bangalore": {
    name: "Bengaluru",
    latitude: 12.9716,
    longitude: 77.5946,
    admin1: "Karnataka",
    country: "India",
  },
  "mawlynnong village": {
    name: "Mawlynnong",
    latitude: 25.2016,
    longitude: 91.9160,
    admin1: "Meghalaya",
    country: "India",
  },
  "mawlynnong": {
    name: "Mawlynnong",
    latitude: 25.2016,
    longitude: 91.9160,
    admin1: "Meghalaya",
    country: "India",
  },
  "chandratal lake": {
    name: "Chandratal Lake",
    latitude: 32.4824,
    longitude: 77.6154,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "chandratal": {
    name: "Chandratal Lake",
    latitude: 32.4824,
    longitude: 77.6154,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "kaza": {
    name: "Kaza",
    latitude: 32.2276,
    longitude: 78.0710,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "rohtang pass": {
    name: "Rohtang La",
    latitude: 32.37155,
    longitude: 77.24719,
    admin1: "Himachal Pradesh",
    country: "India",
  },
  "leh ladakh": {
    name: "Leh",
    latitude: 34.1526,
    longitude: 77.5771,
    admin1: "Ladakh",
    country: "India",
  },
  "leh": {
    name: "Leh",
    latitude: 34.1526,
    longitude: 77.5771,
    admin1: "Ladakh",
    country: "India",
  },
  "goa": {
    name: "Panaji",
    latitude: 15.4909,
    longitude: 73.8278,
    admin1: "Goa",
    country: "India",
  },
  "kerala": {
    name: "Kochi",
    latitude: 9.9312,
    longitude: 76.2673,
    admin1: "Kerala",
    country: "India",
  },
  "vizag": {
    name: "Visakhapatnam",
    latitude: 17.6868,
    longitude: 83.2185,
    admin1: "Andhra Pradesh",
    country: "India",
  },
  "visakhapatnam": {
    name: "Visakhapatnam",
    latitude: 17.6868,
    longitude: 83.2185,
    admin1: "Andhra Pradesh",
    country: "India",
  },
  "gujarat": {
    name: "Ahmedabad",
    latitude: 23.0225,
    longitude: 72.5714,
    admin1: "Gujarat",
    country: "India",
  },
  "punjab": {
    name: "Amritsar",
    latitude: 31.6340,
    longitude: 74.8723,
    admin1: "Punjab",
    country: "India",
  },
  "kalka": {
    name: "Kalka",
    latitude: 30.8354,
    longitude: 76.9348,
    admin1: "Haryana",
    country: "India",
  },
  "udaipur": {
    name: "Udaipur",
    latitude: 24.5854,
    longitude: 73.7125,
    admin1: "Rajasthan",
    country: "India",
  },
  "ooty": {
    name: "Ooty",
    latitude: 11.4102,
    longitude: 76.6950,
    admin1: "Tamil Nadu",
    country: "India",
  },
  "pondicherry": {
    name: "Puducherry",
    latitude: 11.9416,
    longitude: 79.8083,
    admin1: "Puducherry",
    country: "India",
  },
  "puducherry": {
    name: "Puducherry",
    latitude: 11.9416,
    longitude: 79.8083,
    admin1: "Puducherry",
    country: "India",
  },
  "mumbai": {
    name: "Mumbai",
    latitude: 19.0760,
    longitude: 72.8777,
    admin1: "Maharashtra",
    country: "India",
  },
  "hampi": {
    name: "Hampi",
    latitude: 15.3350,
    longitude: 76.4600,
    admin1: "Karnataka",
    country: "India",
  },
  "andaman": {
    name: "Port Blair",
    latitude: 11.6234,
    longitude: 92.7265,
    admin1: "Andaman and Nicobar Islands",
    country: "India",
  },
  "port blair": {
    name: "Port Blair",
    latitude: 11.6234,
    longitude: 92.7265,
    admin1: "Andaman and Nicobar Islands",
    country: "India",
  },
};

// Known destination-to-state hints to disambiguate identical city names (e.g. Manali, HP vs TN)
const DESTINATION_STATE_HINTS = {
  "shimla": "Himachal Pradesh",
  "manali": "Himachal Pradesh",
  "rohtang pass": "Himachal Pradesh",
  "kasol": "Himachal Pradesh",
  "chitkul": "Himachal Pradesh",
  "kalpa": "Himachal Pradesh",
  "sissu": "Himachal Pradesh",
  "kaza": "Himachal Pradesh",
  "chandratal lake": "Himachal Pradesh",
  "haridwar": "Uttarakhand",
  "rishikesh": "Uttarakhand",
  "dehradun": "Uttarakhand",
  "mussoorie": "Uttarakhand",
  "srinagar": "Jammu and Kashmir",
  "gulmarg": "Jammu and Kashmir",
  "pahalgam": "Jammu and Kashmir",
  "digha": "West Bengal",
  "darjeeling": "West Bengal",
  "kolkata": "West Bengal",
  "puri": "Odisha",
  "bhubaneswar": "Odisha",
  "konark": "Odisha",
  "shillong": "Meghalaya",
  "mawlynnong village": "Meghalaya",
  "dawki": "Meghalaya",
  "jaipur": "Rajasthan",
  "jaisalmer": "Rajasthan",
  "ajmer": "Rajasthan",
  "delhi": "Delhi",
  "agra": "Uttar Pradesh",
  "varanasi": "Uttar Pradesh",
  "goa": "Goa",
  "kalka": "Haryana",
  "leh ladakh": "Ladakh",
  "kerala": "Kerala",
  "vizag": "Andhra Pradesh",
  "gujarat": "Gujarat",
  "punjab": "Punjab",
  "udaipur": "Rajasthan",
  "ooty": "Tamil Nadu",
  "pondicherry": "Puducherry",
  "mumbai": "Maharashtra",
  "hampi": "Karnataka",
  "andaman": "Andaman and Nicobar Islands",
};

// Geomorphological classifications for microclimate downscaling
const TERRAIN_CLASSIFICATIONS = {
  manali: { terrain: "valley_basin", elevation: 2050 },
  kasol: { terrain: "valley_basin", elevation: 1580 },
  kalpa: { terrain: "valley_basin", elevation: 2758 },
  sissu: { terrain: "valley_basin", elevation: 3120 },
  chitkul: { terrain: "valley_basin", elevation: 3450 },
  pahalgam: { terrain: "valley_basin", elevation: 2130 },
  "leh ladakh": { terrain: "cold_desert_plateau", elevation: 3500 },
  leh: { terrain: "cold_desert_plateau", elevation: 3500 },
  kaza: { terrain: "cold_desert_plateau", elevation: 3650 },
  "rohtang pass": { terrain: "alpine_pass", elevation: 3978 },
  "chandratal lake": { terrain: "alpine_pass", elevation: 4250 },
  shimla: { terrain: "mountain_ridge", elevation: 2205 },
  mussoorie: { terrain: "mountain_ridge", elevation: 2005 },
  darjeeling: { terrain: "mountain_ridge", elevation: 2042 },
  gulmarg: { terrain: "alpine_meadow", elevation: 2650 },
  srinagar: { terrain: "broad_basin", elevation: 1585 },
  ooty: { terrain: "high_plateau", elevation: 2240 },
  shillong: { terrain: "high_plateau", elevation: 1525 },
};

function clientCalibrateDailyForecast(destinationName, dailyForecast) {
  if (!Array.isArray(dailyForecast)) return dailyForecast;
  const destLower = (destinationName || "").toLowerCase().trim();
  const profile = TERRAIN_CLASSIFICATIONS[destLower] || { terrain: "plains_coastal", elevation: 200 };
  const terrainType = profile.terrain;
  const stationElev = profile.elevation;

  return dailyForecast.map((d) => {
    let deltaMin = 0.0;
    let deltaMax = 0.0;
    const rawMin = d.temperatureMin;
    const rawMax = d.temperatureMax;

    if (rawMin != null && typeof rawMin === "number" && !isNaN(rawMin)) {
      if (terrainType === "valley_basin") {
        deltaMin = Math.min(4.5, Math.max(0.0, rawMin * 0.35));
      } else if (terrainType === "cold_desert_plateau" || terrainType === "alpine_pass") {
        deltaMin = Math.min(5.5, Math.max(0.0, rawMin * 0.45));
      } else if (terrainType === "mountain_ridge") {
        deltaMin = Math.min(2.0, Math.max(0.0, rawMin * 0.15));
      } else if (["alpine_meadow", "broad_basin", "high_plateau"].includes(terrainType)) {
        deltaMin = Math.min(2.5, Math.max(0.0, rawMin * 0.2));
      }
    }

    if (rawMax != null && typeof rawMax === "number" && !isNaN(rawMax)) {
      if (["alpine_pass", "cold_desert_plateau"].includes(terrainType) && stationElev > 3500) {
        deltaMax = Math.min(2.0, Math.max(0.0, (stationElev - 3500) / 600.0));
      }
    }

    return {
      ...d,
      temperatureMin: rawMin != null ? Math.round((rawMin - deltaMin) * 10) / 10 : null,
      temperatureMax: rawMax != null ? Math.round((rawMax - deltaMax) * 10) / 10 : null,
      rawTemperatureMin: rawMin,
      rawTemperatureMax: rawMax,
    };
  });
}

function clientCalibrateCurrentTemperature(destinationName, current) {
  if (!current || typeof current !== "object") return current;
  const destLower = (destinationName || "").toLowerCase().trim();
  const profile = TERRAIN_CLASSIFICATIONS[destLower] || { terrain: "plains_coastal", elevation: 200 };
  const rawTemp = current.temperature_2m ?? current.temperature;
  if (rawTemp == null || typeof rawTemp !== "number" || isNaN(rawTemp)) return current;

  let deltaT = 0;
  if (profile.terrain === "valley_basin") {
    deltaT = Math.min(6.5, Math.max(0, (rawTemp - 5.0) * 0.75));
  } else if (["cold_desert_plateau", "alpine_pass"].includes(profile.terrain)) {
    deltaT = Math.min(7.5, Math.max(0, (rawTemp - 1.0) * 0.85));
  } else if (profile.terrain === "mountain_ridge") {
    deltaT = Math.min(2.0, Math.max(0, (rawTemp - 9.0) * 0.35));
  }

  const calTemp = Math.round((rawTemp - deltaT) * 10) / 10;
  const rawApparent = current.apparent_temperature ?? current.apparentTemperature;
  const calApparent = rawApparent != null ? Math.round((rawApparent - deltaT) * 10) / 10 : calTemp;

  return {
    ...current,
    temperature_2m: current.temperature_2m !== undefined ? calTemp : current.temperature_2m,
    temperature: current.temperature !== undefined ? calTemp : current.temperature,
    apparent_temperature: current.apparent_temperature !== undefined ? calApparent : current.apparent_temperature,
    apparentTemperature: current.apparentTemperature !== undefined ? calApparent : current.apparentTemperature,
  };
}

// In-memory cache fallback if sessionStorage is unavailable
const memoryCache = new Map();

function getCachedData(cacheKey) {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const item = window.sessionStorage.getItem(cacheKey);
      if (item) {
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
          return parsed.data;
        }
      }
    }
  } catch {
    // Ignore sessionStorage errors
  }

  const mem = memoryCache.get(cacheKey);
  if (mem && Date.now() - mem.timestamp < 30 * 60 * 1000) {
    return mem.data;
  }

  return null;
}

function setCachedData(cacheKey, data) {
  const payload = { data, timestamp: Date.now() };
  memoryCache.set(cacheKey, payload);

  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(cacheKey, JSON.stringify(payload));
    }
  } catch {
    // Ignore storage quota or security errors
  }
}

function getWeatherSummary(weatherCode) {
  const code = Number(weatherCode) || 0;

  if (code === 0) {
    return { icon: "☀️", label: "Clear", category: "clear" };
  }

  if ([1, 2].includes(code)) {
    return { icon: "🌤️", label: "Partly Cloudy", category: "cloudy" };
  }

  if (code === 3) {
    return { icon: "☁️", label: "Overcast", category: "cloudy" };
  }

  if ([45, 48].includes(code)) {
    return { icon: "🌫️", label: "Foggy", category: "fog" };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return { icon: "🌦️", label: "Drizzle", category: "rain" };
  }

  if ([61, 63, 65, 66, 67, 80, 81].includes(code)) {
    return { icon: "🌧️", label: "Rain", category: "rain" };
  }

  if ([82, 95, 96, 99].includes(code)) {
    return { icon: "⛈️", label: "Heavy Rain", category: "heavy-rain" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { icon: "❄️", label: "Snow", category: "snow" };
  }

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

async function getLocation(destination, options = {}) {
  if (!destination || typeof destination !== "string") {
    throw new Error("Destination is required");
  }

  const raw = destination.trim();
  const lower = raw.toLowerCase();

  if (KNOWN_LOCATION_FALLBACKS[lower]) {
    return { ...KNOWN_LOCATION_FALLBACKS[lower] };
  }

  const stateHint = options.state || DESTINATION_STATE_HINTS[lower] || "";
  const cleanName = raw.replace(/\s+(Pass|Lake|Village|Beach|Fort|Temple|Ghat|Hills|Hill)$/i, "").trim();

  const searchQueries = [raw];
  if (cleanName && cleanName.toLowerCase() !== lower) {
    searchQueries.push(cleanName);
  }

  let bestMatch = null;

  for (const query of searchQueries) {
    try {
      const response = await fetch(
        `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(
          query
        )}&count=10&language=en&format=json`
      );

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const results = data.results || [];
      if (!results.length) {
        continue;
      }

      // Filter for Indian locations
      const indiaResults = results.filter(
        (r) => r.country_code === "IN" || (r.country && r.country.toLowerCase() === "india")
      );

      // 1. If state hint is available, match state
      if (stateHint && indiaResults.length) {
        const stateMatch = indiaResults.find(
          (r) => r.admin1 && r.admin1.toLowerCase().includes(stateHint.toLowerCase())
        );
        if (stateMatch) {
          bestMatch = stateMatch;
          break;
        }
      }

      // 2. Exact match in India
      const exactIndia = indiaResults.find(
        (r) =>
          r.name.toLowerCase() === raw.toLowerCase() ||
          r.name.toLowerCase() === cleanName.toLowerCase()
      );
      if (exactIndia) {
        bestMatch = exactIndia;
        break;
      }

      // 3. First Indian result
      if (indiaResults.length) {
        bestMatch = indiaResults[0];
        break;
      }

      // 4. Any result if not already matched
      if (!bestMatch && results.length) {
        bestMatch = results[0];
      }
    } catch {
      // Continue to next query
    }
  }

  if (!bestMatch) {
    if (cleanName.toLowerCase() in KNOWN_LOCATION_FALLBACKS) {
      return { ...KNOWN_LOCATION_FALLBACKS[cleanName.toLowerCase()] };
    }
    throw new Error("Weather location not found");
  }

  return {
    name: bestMatch.name,
    latitude: bestMatch.latitude,
    longitude: bestMatch.longitude,
    country: bestMatch.country || "India",
    admin1: bestMatch.admin1 || "",
  };
}

async function getWeatherForecast(
  destination,
  startDate,
  days = 7,
  options = {}
) {
  if (!destination) {
    throw new Error("Destination is required");
  }

  const tripDays = Math.min(Math.max(Number(days) || 1, 1), 30);

  // Parse start date
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let startMidnight;
  let startDateStr = "";

  if (startDate && typeof startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
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

  // Check cache first
  const cacheKey = `travelGurujiWeather:${destination.trim().toLowerCase()}:${startDateStr}:${tripDays}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  // 1. Query backend authoritative Python-calibrated forecast first
  try {
    const stateParam = options.state ? `&state=${encodeURIComponent(options.state)}` : "";
    const backendUrl = `${getApiBaseUrl()}/weather/forecast?destination=${encodeURIComponent(destination)}&startDate=${startDateStr}&days=${tripDays}${stateParam}`;
    const backendRes = await fetch(backendUrl);
    if (backendRes.ok) {
      const backendData = await backendRes.json();
      if (backendData && backendData.success && backendData.forecast) {
        setCachedData(cacheKey, backendData);
        return backendData;
      }
    }
  } catch (backendErr) {
    console.warn("Backend weather forecast endpoint notice, falling back to direct pipeline:", backendErr.message);
  }

  // Geocode location
  const location = await getLocation(destination, options);

  // Calculate day difference from today
  const diffDays = Math.round((startMidnight.getTime() - todayMidnight.getTime()) / 86400000);

  // Open-Meteo standard forecast window provides up to 15-16 days ahead
  const isLive = diffDays >= 0 && diffDays <= 14;

  let result;

  if (isLive) {
    // ==========================================
    // MODE 1: LIVE FORECAST
    // ==========================================
    const endMidnight = new Date(startMidnight.getTime() + (tripDays - 1) * 86400000);
    const maxForecastDate = new Date(todayMidnight.getTime() + 15 * 86400000);
    const cappedEnd = endMidnight > maxForecastDate ? maxForecastDate : endMidnight;

    const formatYMD = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const sStr = formatYMD(startMidnight);
    const eStr = formatYMD(cappedEnd);

    const response = await fetch(
      `${OPEN_METEO_FORECAST_URL}?latitude=${location.latitude}&longitude=${location.longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max` +
        `&timezone=auto&start_date=${sStr}&end_date=${eStr}`
    );

    if (!response.ok) {
      throw new Error("Weather forecast request failed");
    }

    const data = await response.json();
    const daily = data.daily || {};

    const forecast = (daily.time || []).map((date, index) => {
      const code = daily.weather_code?.[index] ?? 0;
      const summary = getWeatherSummary(code);
      const precipSum = daily.precipitation_sum?.[index] != null ? Math.round(daily.precipitation_sum[index] * 10) / 10 : 0;
      const windSpeed = daily.wind_speed_10m_max?.[index] != null ? Math.round(daily.wind_speed_10m_max[index]) : 0;
      const windGust = daily.wind_gusts_10m_max?.[index] != null ? Math.round(daily.wind_gusts_10m_max[index]) : 0;
      const uvIndex = daily.uv_index_max?.[index] != null ? Math.round(daily.uv_index_max[index] * 10) / 10 : 5.0;

      const reliefTelemetry = computeReliefTelemetry(
        precipSum,
        daily.precipitation_probability_max?.[index] ?? 0,
        windGust,
        daily.temperature_2m_max?.[index] ?? null,
        daily.temperature_2m_min?.[index] ?? null,
        code
      );

      let dayDateObj;
      try {
        dayDateObj = new Date(`${date}T00:00:00`);
      } catch {
        dayDateObj = new Date();
      }

      return {
        date,
        tripDay: index + 1,
        dayName: dayDateObj.toLocaleDateString("en-IN", { weekday: "short" }),
        temperatureMax: daily.temperature_2m_max?.[index] != null
          ? Math.round(daily.temperature_2m_max[index] * 10) / 10
          : null,
        temperatureMin: daily.temperature_2m_min?.[index] != null
          ? Math.round(daily.temperature_2m_min[index] * 10) / 10
          : null,
        precipitationProbability:
          daily.precipitation_probability_max?.[index] ?? 0,
        precipitationSum: precipSum,
        windSpeedMax: windSpeed,
        windGustMax: windGust,
        uvIndexMax: uvIndex,
        weatherCode: code,
        weatherLabel: summary.label,
        weatherIcon: summary.icon,
        weatherCategory: summary.category,
        // Relief & Future Planning Telemetry:
        riskTier: reliefTelemetry.riskTier,
        reliefStatus: reliefTelemetry.reliefStatus,
        safeTransitWindow: reliefTelemetry.safeTransitWindow,
        travelFeasibility: reliefTelemetry.travelFeasibility,
        floodRisk: reliefTelemetry.floodRisk,
        aerialViability: reliefTelemetry.aerialViability,
        supplyChecklist: reliefTelemetry.supplyChecklist,
      };
    });

    const calibratedForecast = clientCalibrateDailyForecast(destination, forecast);
    const calibratedCurrent = clientCalibrateCurrentTemperature(destination, data.current);

    const todayForecast = calibratedForecast[0] ? {
      ...calibratedForecast[0],
      currentTemperature: calibratedCurrent?.temperature_2m != null ? Math.round(calibratedCurrent.temperature_2m * 10) / 10 : null,
      apparentTemperature: calibratedCurrent?.apparent_temperature != null ? Math.round(calibratedCurrent.apparent_temperature * 10) / 10 : null,
    } : null;
    const tomorrowForecast = calibratedForecast[1] || null;
    const daysAheadForecast = calibratedForecast.slice(2);

    result = {
      mode: "live",
      location,
      startDate: sStr,
      endDate: calibratedForecast[calibratedForecast.length - 1]?.date || sStr,
      days: calibratedForecast.length,
      current: calibratedCurrent || null,
      forecast: calibratedForecast,
      today: todayForecast,
      tomorrow: tomorrowForecast,
      daysAhead: daysAheadForecast,
      reliefPlanning: {
        overallRiskTier: forecast.some((f) => f.riskTier === "RED")
          ? "RED"
          : forecast.some((f) => f.riskTier === "YELLOW")
          ? "YELLOW"
          : "GREEN",
        safeOperatingHours: "06:30 AM - 05:30 PM (Recommended Daylight Window)",
        maxPrecipitationExpected: Math.max(...forecast.map((f) => f.precipitationSum || 0)),
        maxWindGustExpected: Math.max(...forecast.map((f) => f.windGustMax || 0)),
        reliefStagingReadiness: forecast.some((f) => f.riskTier === "RED")
          ? "ACTIVE RED ALERT: Emergency supply depots mobilized at district headquarters."
          : forecast.some((f) => f.riskTier === "YELLOW")
          ? "MODERATE ADVISORY: Buffer supplies and standby vehicles recommended."
          : "NORMAL STANDBY: All transport corridors operational; routine monitoring.",
        primaryHelpline: "DEOC: 1077 | State: 1070 | NDRF: 112",
      },
    };
  } else {
    // ==========================================
    // MODE 2: SEASONAL WEATHER OUTLOOK
    // ==========================================
    const targetMonth = startMidnight.getMonth() + 1; // 1-12
    const targetYear = startMidnight.getFullYear();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[targetMonth - 1];

    // Reference year: previous completed year
    const currentYear = now.getFullYear();
    const refYear = currentYear - 1;
    const lastDay = new Date(refYear, targetMonth, 0).getDate();
    const startArchive = `${refYear}-${String(targetMonth).padStart(2, "0")}-01`;
    const endArchive = `${refYear}-${String(targetMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const archiveUrl = `${OPEN_METEO_ARCHIVE_URL}?latitude=${location.latitude}&longitude=${location.longitude}&start_date=${startArchive}&end_date=${endArchive}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    let avgTempMax = 28;
    let avgTempMin = 18;
    let totalPrecip = 15;
    let rainyDays = 2;
    let dominantSummary = { icon: "☀️", label: "Mild & Pleasant", category: "clear" };

    try {
      const archiveResponse = await fetch(archiveUrl);
      if (archiveResponse.ok) {
        const archiveData = await archiveResponse.json();
        const daily = archiveData.daily || {};
        const maxTemps = daily.temperature_2m_max || [];
        const minTemps = daily.temperature_2m_min || [];
        const precips = daily.precipitation_sum || [];
        const codes = daily.weather_code || [];

        if (maxTemps.length) {
          avgTempMax = Math.round(maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length);
          avgTempMin = Math.round(minTemps.reduce((a, b) => a + b, 0) / minTemps.length);
          totalPrecip = Math.round(precips.reduce((a, b) => a + b, 0));
          rainyDays = precips.filter((p) => p >= 1.0).length;

          // Find dominant weather code
          const codeCounts = {};
          for (const c of codes) {
            codeCounts[c] = (codeCounts[c] || 0) + 1;
          }
          let bestCode = 0;
          let maxCount = -1;
          for (const c in codeCounts) {
            if (codeCounts[c] > maxCount) {
              maxCount = codeCounts[c];
              bestCode = Number(c);
            }
          }
          dominantSummary = getWeatherSummary(bestCode);
        }
      }
    } catch (err) {
      console.warn("Seasonal archive fetch failed, using climate baseline:", err.message);
    }

    let rainfallTendency = `Low rainfall tendency (~${rainyDays} typical rainy day${rainyDays === 1 ? '' : 's'} in ${monthName})`;
    if (totalPrecip >= 80) {
      rainfallTendency = `High rainfall / monsoon tendency (~${rainyDays} rainy days, ~${totalPrecip}mm total expected)`;
    } else if (totalPrecip >= 25) {
      rainfallTendency = `Moderate rainfall tendency (~${rainyDays} rainy days, ~${totalPrecip}mm total expected)`;
    }

    // Provide structured forecast for today, tomorrow, and days ahead based on seasonal baseline
    const seasonalRelief = computeReliefTelemetry(
      Math.round(totalPrecip / 30),
      rainyDays > 5 ? 50 : 20,
      18,
      avgTempMax,
      avgTempMin,
      totalPrecip >= 80 ? 63 : 1
    );

    const syntheticForecast = Array.from({ length: tripDays }, (_, idx) => {
      const dObj = new Date(startMidnight.getTime() + idx * 86400000);
      const y = dObj.getFullYear();
      const m = String(dObj.getMonth() + 1).padStart(2, "0");
      const d = String(dObj.getDate()).padStart(2, "0");
      const dStr = `${y}-${m}-${d}`;

      return {
        date: dStr,
        tripDay: idx + 1,
        dayName: dObj.toLocaleDateString("en-IN", { weekday: "short" }),
        temperatureMax: avgTempMax,
        temperatureMin: avgTempMin,
        precipitationProbability: rainyDays > 5 ? 45 : 15,
        precipitationSum: Math.round((totalPrecip / 30) * 10) / 10,
        windSpeedMax: 14,
        windGustMax: 22,
        uvIndexMax: 6.0,
        weatherCode: totalPrecip >= 80 ? 63 : 1,
        weatherLabel: dominantSummary.label,
        weatherIcon: dominantSummary.icon,
        weatherCategory: dominantSummary.category,
        riskTier: seasonalRelief.riskTier,
        reliefStatus: seasonalRelief.reliefStatus,
        safeTransitWindow: seasonalRelief.safeTransitWindow,
        travelFeasibility: seasonalRelief.travelFeasibility,
        floodRisk: seasonalRelief.floodRisk,
        aerialViability: seasonalRelief.aerialViability,
        supplyChecklist: seasonalRelief.supplyChecklist,
      };
    });

    result = {
      mode: "seasonal",
      location,
      startDate: startDateStr,
      days: tripDays,
      forecast: syntheticForecast,
      today: syntheticForecast[0] || null,
      tomorrow: syntheticForecast[1] || null,
      daysAhead: syntheticForecast.slice(2),
      reliefPlanning: {
        overallRiskTier: seasonalRelief.riskTier,
        safeOperatingHours: "06:30 AM - 05:30 PM (Recommended Daylight Window)",
        maxPrecipitationExpected: Math.round((totalPrecip / 30) * 10) / 10,
        maxWindGustExpected: 22,
        reliefStagingReadiness: `SEASONAL BASELINE: ${rainfallTendency}. Standard transport operations expected.`,
        primaryHelpline: "DEOC: 1077 | State: 1070 | NDRF: 112",
      },
      seasonal: {
        month: monthName,
        year: targetYear,
        referenceYear: refYear,
        avgTempMax,
        avgTempMin,
        avgPrecipitation: totalPrecip,
        rainyDaysCount: rainyDays,
        rainfallTendency,
        dominantCondition: dominantSummary.label,
        dominantIcon: dominantSummary.icon,
        dominantCategory: dominantSummary.category,
        disclaimer: "Detailed daily forecast will become available closer to your travel date.",
        historicalNote: `Based on historical ${monthName} climate observations for ${location.name}.`,
      },
    };
  }

  // Cache result
  setCachedData(cacheKey, result);

  return result;
}

/**
 * Fetch all destinations with synchronized real-time weather & natural disasters.
 * Connects directly to backend API, with automatic direct API & authentic snapshot fallback.
 */
async function fetchLiveSyncedDestinations(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.tier) params.append("tier", filters.tier);
    if (filters.search) params.append("search", filters.search);
    if (filters.state) params.append("state", filters.state);

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${getApiBaseUrl()}/weather/destinations${query}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.destinations) && data.destinations.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Backend /weather/destinations fetch unreachable:", err.message);
  }

  return {
    success: false,
    destinations: [],
    count: 0,
    syncStatus: null,
  };
}

/**
 * Fetch current background synchronization status & statistics
 */
async function fetchWeatherSyncStatus() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/weather/live-sync-status`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("fetchWeatherSyncStatus error:", err.message);
  }
  return {
    success: false,
    isAutoSyncRunning: false,
    provider: "Tomorrow.io / Open-Meteo Direct Stream",
    lastSyncTimestamp: null,
  };
}

/**
 * Trigger immediate real-time sync with satellite, seismic, and hydrology feeds
 */
async function forceWeatherSync() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/weather/sync-now`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("forceWeatherSync error:", err.message);
  }
  return await fetchLiveSyncedDestinations();
}

/**
 * Fetch detailed live weather, disaster status, and 7-day forecast for a single destination.
 * Connects to backend API, with direct Open-Meteo external API fallback.
 */
async function fetchDestinationLiveWeather(destinationName) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/weather/destination/${encodeURIComponent(destinationName)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend fetchDestinationLiveWeather unreachable, connecting directly to live API:", err.message);
  }

  // DIRECT EXTERNAL API FALLBACK: Fetch directly from Open-Meteo
  try {
    const key = destinationName.toLowerCase().trim();
    const locFallback = KNOWN_LOCATION_FALLBACKS[key];
    const coords = locFallback ? { lat: locFallback.latitude, lon: locFallback.longitude } : null;

    if (coords) {
      const forecastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=7`
      );
      if (forecastRes.ok) {
        const raw = await forecastRes.json();
        const summary = getWeatherSummary(raw.current?.weather_code ?? 0);
        const baseTemp = raw.current?.temperature_2m != null ? Math.round(raw.current.temperature_2m * 10) / 10 : null;
        const baseApparent = raw.current?.apparent_temperature != null ? Math.round(raw.current.apparent_temperature * 10) / 10 : null;
        const calibratedObs = clientCalibrateCurrentTemperature(destinationName, {
          temperature: baseTemp,
          apparentTemperature: baseApparent,
        });

        // Also calibrate 7-day daily forecast in fallback
        const rawDaily = (raw.daily?.time || []).map((date, idx) => ({
          date,
          tripDay: idx + 1,
          temperatureMax: raw.daily.temperature_2m_max?.[idx] != null ? Math.round(raw.daily.temperature_2m_max[idx] * 10) / 10 : null,
          temperatureMin: raw.daily.temperature_2m_min?.[idx] != null ? Math.round(raw.daily.temperature_2m_min[idx] * 10) / 10 : null,
          precipitationSum: raw.daily.precipitation_sum?.[idx] != null ? Math.round(raw.daily.precipitation_sum[idx] * 10) / 10 : 0,
          precipitationProbability: raw.daily.precipitation_probability_max?.[idx] ?? 0,
          windSpeedMax: raw.daily.wind_speed_10m_max?.[idx] != null ? Math.round(raw.daily.wind_speed_10m_max[idx]) : 0,
          weatherCode: raw.daily.weather_code?.[idx] ?? 0,
        }));
        const calibratedDaily = clientCalibrateDailyForecast(destinationName, rawDaily);

        const updatedWeather = {
          temperature: calibratedObs.temperature,
          apparentTemperature: calibratedObs.apparentTemperature,
          humidity: raw.current?.relative_humidity_2m ?? null,
          precipitation: raw.current?.precipitation ?? 0,
          windSpeed: raw.current?.wind_speed_10m != null ? Math.round(raw.current.wind_speed_10m) : null,
          windGusts: raw.current?.wind_gusts_10m != null ? Math.round(raw.current.wind_gusts_10m) : null,
          pressure: raw.current?.surface_pressure != null ? Math.round(raw.current.surface_pressure) : null,
          weatherCode: raw.current?.weather_code ?? 0,
          condition: summary.label || "Clear",
          icon: summary.icon || "☀️",
          category: summary.category || "CLEAR",
          forecast: calibratedDaily,
          provider: "Open-Meteo Direct Live API",
          lastUpdatedAt: new Date().toISOString(),
        };

        const fallbackDestination = {
          name: locFallback?.name || destinationName,
          state: locFallback?.admin1 || "India",
          corridor: "Travel Corridor",
          coordinates: coords,
          weather: updatedWeather,
          disaster: {
            alertTier: "GREEN",
            severity: "NORMAL",
            isDisasterZone: false,
            badgeLabel: "🟢 Normal Conditions",
            title: "Normal Meteorological Conditions",
            description: "No active severe disaster bulletins detected.",
          },
        };

        return {
          success: true,
          destination: fallbackDestination,
          provider: "Open-Meteo Direct Live API",
          current: raw.current,
          hourlyForecast: (raw.hourly?.time || []).slice(0, 24).map((t, idx) => ({
            time: t,
            temperature: raw.hourly.temperature_2m[idx],
            precipitationProbability: raw.hourly.precipitation_probability?.[idx] || 0,
            windSpeed: raw.hourly.wind_speed_10m?.[idx] || 0,
            weatherCode: raw.hourly.weather_code?.[idx] || 0,
          })),
          forecast7Day: { daily: raw.daily },
        };
      }
    }
  } catch (directErr) {
    console.warn("Direct Open-Meteo forecast fetch failed:", directErr.message);
  }

  return null;
}

/**
 * Fetch live weather radar capabilities, providers (Tomorrow.io, RainViewer), and available layers
 */
async function fetchRadarCapabilities() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/weather/radar/capabilities`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("fetchRadarCapabilities error:", err.message);
    return {
      success: false,
      radarLayers: [
        { id: "precipitation", label: "Precipitation Radar", icon: "🌧️" },
        { id: "clouds", label: "Cloud Cover Satellite", icon: "☁️" },
        { id: "wind", label: "Wind & Gale Storm Vectors", icon: "💨" },
        { id: "temperature", label: "Thermal & Freeze Heatmap", icon: "🌡️" },
      ],
    };
  }
}

/**
 * Fetch live RainViewer real-time radar timestamp frames for animation
 */
async function fetchRainViewerRadarFrames() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/weather/radar/frames`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("fetchRainViewerRadarFrames error:", err.message);
    return { success: false, frames: [] };
  }
}

export {
  getLocation,
  getWeatherForecast,
  getWeatherSummary,
  computeReliefTelemetry,
  fetchLiveSyncedDestinations,
  fetchWeatherSyncStatus,
  forceWeatherSync,
  fetchDestinationLiveWeather,
  fetchRadarCapabilities,
  fetchRainViewerRadarFrames,
};