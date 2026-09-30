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
          forecast7Day = {
            source: "Open-Meteo European Flood & Hydrology Radar (Fallback)",
            daily: omData.daily,
          };
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