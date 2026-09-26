/**
 * Client service for Travel_Guruji Intelligence API Gateway.
 * Proxies calls through Node.js Express at http://localhost:5000/api/intelligence.
 */
import { getIntelligenceBaseUrl } from "../config/apiConfig";

const API_BASE_URL = getIntelligenceBaseUrl();
const CLIENT_TIMEOUT_MS = 3000;

export async function getIntelligenceHealth() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Gateway returned HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    return {
      status: "offline",
      gateway: "unreachable",
      error: err.message,
    };
  }
}

export async function optimizeTripPlanWithIntelligence(planPayload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}/optimize-itinerary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planPayload),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`Intelligence API returned HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

