const OPEN_METEO_GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const OPEN_METEO_FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";

const OPEN_METEO_ARCHIVE_URL =
  "https://archive-api.open-meteo.com/v1/archive";

// Safe fallback coordinates for remote hamlets / natural spots not indexed in GeoNames
const KNOWN_LOCATION_FALLBACKS = {
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

function computeReliefTelemetry(precipSum = 0, precipProb = 0, windGust = 0, tempMax = 25, tempMin = 15, weatherCode = 0) {
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
  } else if (precipSum >= 12 || windGust >= 45 || tempMin <= 0 || tempMax >= 42) {
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
        daily.temperature_2m_max?.[index] ?? 25,
        daily.temperature_2m_min?.[index] ?? 15,
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

    const todayForecast = forecast[0] || null;
    const tomorrowForecast = forecast[1] || null;
    const daysAheadForecast = forecast.slice(2);

    result = {
      mode: "live",
      location,
      startDate: sStr,
      endDate: forecast[forecast.length - 1]?.date || sStr,
      days: forecast.length,
      forecast,
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

export {
  getLocation,
  getWeatherForecast,
  getWeatherSummary,
  computeReliefTelemetry,
};