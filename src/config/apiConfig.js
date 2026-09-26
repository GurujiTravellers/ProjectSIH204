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
    return `${protocol}//${hostname}:5000/api`;
  }

  return "http://localhost:5000/api";
}

export function getIntelligenceBaseUrl() {
  return `${getApiBaseUrl()}/intelligence`;
}

export const API_BASE_URL = getApiBaseUrl();

