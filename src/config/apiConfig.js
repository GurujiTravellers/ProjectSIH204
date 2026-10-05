/**
 * Dynamic API Base URL resolver for Travel_Guruji.
 * Automatically detects whether the client is accessing the app via:
 * - Desktop Localhost: http://localhost:5000/api
 * - Mobile / LAN Browser: http://<LAN_IP>:5000/api (e.g. http://10.158.124.186:5000/api)
 * - Custom Environment: VITE_API_BASE_URL (if provided)
 */

export function getApiBaseUrl() {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const protocol = window.location.protocol || "http:";
    const hostname = window.location.hostname;
    const port = window.location.port;

    // Local development: Vite dev server running on port 5173, backend on 5000
    const isLocalDev =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local") ||
      /^(?:10|127|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\./.test(hostname);

    if (isLocalDev && port !== "5000") {
      return `${protocol}//${hostname}:5000/api`;
    }

    // Production / Deployed environment (Render, Cloud VPS, Custom Domain):
    return "/api";
  }

  return "/api";
}

export function getIntelligenceBaseUrl() {
  return `${getApiBaseUrl()}/intelligence`;
}

export const API_BASE_URL = getApiBaseUrl();

