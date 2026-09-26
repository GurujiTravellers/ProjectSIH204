/**
 * Python Intelligence Service Gateway Client.
 *
 * Communicates with the Python microservice running on http://127.0.0.1:8000.
 * Includes timeout safety (3 seconds), health monitoring, and connection handling.
 */

const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

const REQUEST_TIMEOUT_MS = 3000;

async function checkHealth() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(`${PYTHON_SERVICE_URL}/health`, {
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Python service responded with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

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
  optimizeTripPlan,
  optimizeBudget,
  optimizeTransport,
  PYTHON_SERVICE_URL,
};

