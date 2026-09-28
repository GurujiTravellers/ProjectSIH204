const express = require("express");
const {
  getLiveDestinationsArray,
  getSyncStatus,
  syncDatabaseNow,
  getDestinationByName,
  registerSseClient,
} = require("../services/realtimeWeatherSyncService");

const router = express.Router();

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

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

    // Also fetch 7-day detailed forecast for this destination
    let forecast7Day = null;
    try {
      const coords = syncedData.coordinates;
      const forecastRes = await fetch(
        `${WEATHER_URL}?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&hourly=temperature_2m,precipitation_probability,weather_code&timezone=Asia%2FKolkata&forecast_days=7`
      );
      if (forecastRes.ok) {
        forecast7Day = await forecastRes.json();
      }
    } catch (fErr) {
      console.warn("Forecast fetch warning for destination:", fErr.message);
    }

    res.json({
      success: true,
      destination: syncedData,
      forecast7Day,
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

    const geocodingResponse = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`
    );

    if (!geocodingResponse.ok) {
      throw new Error("Unable to find destination location");
    }

    const geocodingData = await geocodingResponse.json();
    const location = geocodingData.results?.[0];

    if (!location) {
      return res.status(404).json({
        message: "Weather location could not be found",
      });
    }

    const weatherResponse = await fetch(
      `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,rain_sum&timezone=auto&forecast_days=7`
    );

    if (!weatherResponse.ok) {
      throw new Error("Unable to fetch weather forecast");
    }

    const weatherData = await weatherResponse.json();

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