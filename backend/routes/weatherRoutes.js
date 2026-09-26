const express = require("express");

const router = express.Router();

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast";

router.get("/", async (req, res) => {
  try {
    const city = String(req.query.city || "").trim();

    if (!city) {
      return res.status(400).json({
        message: "City is required",
      });
    }

    // ========================================
    // FIND DESTINATION COORDINATES
    // ========================================

    const geocodingResponse = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`
    );

    if (!geocodingResponse.ok) {
      throw new Error(
        "Unable to find destination location"
      );
    }

    const geocodingData =
      await geocodingResponse.json();

    const location =
      geocodingData.results?.[0];

    if (!location) {
      return res.status(404).json({
        message:
          "Weather location could not be found",
      });
    }

    // ========================================
    // GET WEATHER FORECAST
    // ========================================

    const weatherResponse = await fetch(
      `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,rain_sum&timezone=auto&forecast_days=7`
    );

    if (!weatherResponse.ok) {
      throw new Error(
        "Unable to fetch weather forecast"
      );
    }

    const weatherData =
      await weatherResponse.json();

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

      timezone:
        weatherData.timezone || null,
    });
  } catch (error) {
    console.error(
      "Weather API error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Unable to load weather forecast",
    });
  }
});

module.exports = router;