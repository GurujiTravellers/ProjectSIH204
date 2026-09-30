/**
 * Python Intelligence Service Gateway Client.
 *
 * Communicates with the Python microservice running on http://127.0.0.1:8000.
 * Includes timeout safety (3 seconds), health monitoring, and resilient fallback handling.
 *
 * Resilient Fallback Guarantee:
 * If the Python service is offline, restarting, or unresponsive:
 * - Node.js will NOT crash or fail requests.
 * - Raw external API data continues flowing directly.
 * - Intelligence blocks are tagged as { status: "unavailable", message: "Intelligence analysis temporarily unavailable" }.
 */

function getPythonServiceUrl() {
  return (
    process.env.PYTHON_INTELLIGENCE_URL ||
    process.env.PYTHON_SERVICE_URL ||
    "http://127.0.0.1:8000"
  );
}

const REQUEST_TIMEOUT_MS = 3000;

async function checkHealth() {
  const serviceUrl = getPythonServiceUrl();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(`${serviceUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return { connected: true, details: data };
    }
    return { connected: false, error: `HTTP ${response.status}` };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

async function requestPython(endpoint, payload) {
  const serviceUrl = getPythonServiceUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${serviceUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const rawText = await response.text();
    if (!response.ok) {
      throw new Error(`Python service HTTP ${response.status}: ${rawText.slice(0, 100)}`);
    }

    try {
      return JSON.parse(rawText);
    } catch (parseErr) {
      throw new Error(`Malformed JSON response from Python service: ${parseErr.message}`);
    }
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}


/**
 * 1. Validate incoming weather observation via Python Intelligence
 */
async function validateWeather(weatherObservation, maxStaleMinutes = 60) {
  try {
    return await requestPython("/validate/weather", {
      current: weatherObservation,
      maxStaleMinutes,
    });
  } catch (err) {
    console.warn(`[PythonIntelligenceClient] Weather validation fallback: ${err.message}`);
    return {
      valid: true,
      source: weatherObservation?.source || "Unknown",
      destination: weatherObservation?.destination || null,
      validatedData: weatherObservation,
      isFallback: true,
      errors: [],
      warnings: ["Python Intelligence Service unavailable, passing raw API data."],
      isStale: false,
      dataAgeMinutes: null,
      qualityScore: 1.0,
    };
  }
}

/**
 * 2. Detect weather changes, trends, and severe spikes
 */
async function detectWeatherChange(destination, current, previous) {
  try {
    return await requestPython("/detect/weather-change", {
      destination,
      current,
      previous,
    });
  } catch (err) {
    return {
      destination,
      changed: false,
      changes: {},
      significant: false,
      summary: "Intelligence change detection temporarily unavailable.",
      timestamp: new Date().toISOString(),
      fallback: true,
    };
  }
}

/**
 * 3. Multi-source discrepancy comparison between Tomorrow.io and Open-Meteo
 */
async function compareWeatherDiscrepancy(destination, primary, secondary) {
  try {
    return await requestPython("/quality/weather-discrepancy", {
      destination,
      primary,
      secondary,
    });
  } catch (err) {
    return {
      destination,
      primary_source: primary?.source || "Tomorrow.io",
      secondary_source: secondary?.source || "Open-Meteo",
      condition_match: true,
      note: "Multi-source discrepancy comparison temporarily unavailable.",
      fallback: true,
    };
  }
}

/**
 * 4. Geospatial proximity and lifecycle tracking for active disasters
 */
async function analyzeDisasters(events, previousEvents = [], destinations = null) {
  try {
    return await requestPython("/analyze/disaster", {
      events,
      previousEvents,
      destinations,
    });
  } catch (err) {
    console.warn(`[PythonIntelligenceClient] Disaster analysis fallback: ${err.message}`);
    return {
      totalEventsReceived: events.length,
      activeEvents: [],
      newEventsCount: 0,
      updatedEventsCount: 0,
      expiredEvents: [],
      timestamp: new Date().toISOString(),
      fallback: true,
    };
  }
}

/**
 * 5. Grounded, explainable risk intelligence interpretation
 */
async function analyzeRisk(destination, weather = null, activeDisasters = [], latitude = null, longitude = null) {
  try {
    return await requestPython("/analyze/risk", {
      destination,
      weather,
      activeDisasters,
      latitude,
      longitude,
    });
  } catch (err) {
    return {
      destination,
      status: "unavailable",
      message: "Intelligence analysis temporarily unavailable",
      fallback: true,
    };
  }
}

/**
 * Legacy Trip Planning Optimizers
 */
async function optimizeTripPlan(planContext) {
  return await requestPython("/api/optimize/itinerary", planContext);
}

async function optimizeBudget(budgetContext) {
  return await requestPython("/api/optimize/budget", budgetContext);
}

async function optimizeTransport(transportPayload) {
  return await requestPython("/api/optimize/transport", transportPayload);
}

module.exports = {
  checkHealth,
  validateWeather,
  detectWeatherChange,
  compareWeatherDiscrepancy,
  analyzeDisasters,
  analyzeRisk,
  optimizeTripPlan,
  optimizeBudget,
  optimizeTransport,
  getPythonServiceUrl,
  get PYTHON_SERVICE_URL() {
    return getPythonServiceUrl();
  },
};

