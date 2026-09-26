"""
Travel_Guruji Python Intelligence Microservice.

Runs an asynchronous/threaded HTTP microservice on port 8000.
Zero mandatory external dependencies - uses standard library.
"""

import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn
from urllib.parse import urlparse

# Ensure local engines module is discoverable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from engines.schemas import get_utc_now_iso, DataStatus, build_provenance_meta
from engines.itinerary_optimizer import optimize_itinerary
from engines.budget_optimizer import optimize_budget
from engines.transport_optimizer import optimize_transport_candidates


PORT = int(os.environ.get("PORT", 8000))
HOST = os.environ.get("HOST", "127.0.0.1")


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in separate threads for concurrent throughput."""
    daemon_threads = True


class IntelligenceRequestHandler(BaseHTTPRequestHandler):
    """HTTP request handler for Travel_Guruji intelligence endpoints."""

    def _set_headers(self, status_code=200, content_type="application/json"):
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        """Handle CORS pre-flight requests."""
        self._set_headers(204)

    def do_GET(self):
        """Handle GET requests (e.g. /health)."""
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path in ("/health", "/api/health"):
            response_data = {
                "status": "healthy",
                "service": "Travel_Guruji Python Intelligence Engine",
                "version": "1.0.0",
                "timestamp": get_utc_now_iso(),
                "engines": [
                    "itinerary_optimizer_v1",
                    "budget_optimizer_v1",
                    "provenance_tracker",
                ],
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(response_data).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

    def do_POST(self):
        """Handle POST requests for optimization and calculations."""
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Missing request body"}).encode("utf-8"))
            return

        try:
            raw_body = self.rfile.read(content_length).decode("utf-8")
            payload = json.loads(raw_body)
        except Exception as e:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": f"Malformed JSON: {str(e)}"}).encode("utf-8"))
            return

        try:
            if path in ("/api/optimize/itinerary", "/optimize/itinerary"):
                trip_context = payload.get("tripContext", {})
                budget_context = payload.get("budgetContext", {})
                preferences = payload.get("preferences", {})
                candidate_attractions = payload.get("candidateAttractions", [])
                real_time_context = payload.get("realTimeContext", {})

                # Execute itinerary optimization
                itin_result = optimize_itinerary(
                    trip_context=trip_context,
                    preferences=preferences,
                    candidate_attractions=candidate_attractions,
                    real_time_context=real_time_context,
                )

                # Execute deterministic budget optimization
                budget_result = optimize_budget(
                    trip_context=trip_context,
                    budget_context=budget_context,
                    preferences=preferences,
                )

                response_data = {
                    "success": True,
                    "engine": "python_intelligence_v1",
                    "lastUpdated": get_utc_now_iso(),
                    "itineraryResult": itin_result,
                    "budgetResult": budget_result,
                }
                self._set_headers(200)
                self.wfile.write(json.dumps(response_data).encode("utf-8"))

            elif path in ("/api/optimize/budget", "/optimize/budget"):
                trip_context = payload.get("tripContext", {})
                budget_context = payload.get("budgetContext", {})
                preferences = payload.get("preferences", {})

                budget_result = optimize_budget(
                    trip_context=trip_context,
                    budget_context=budget_context,
                    preferences=preferences,
                )

                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "success": True,
                    "engine": "python_budget_optimizer_v1",
                    "lastUpdated": get_utc_now_iso(),
                    "budgetResult": budget_result,
                }).encode("utf-8"))

            elif path in ("/api/optimize/transport", "/optimize/transport"):
                candidates = payload.get("candidates", [])
                user_preferences = payload.get("preferences", {})
                budget_context = payload.get("budgetContext", {})

                transport_result = optimize_transport_candidates(
                    candidates=candidates,
                    user_preferences=user_preferences,
                    budget_context=budget_context,
                )

                self._set_headers(200)
                self.wfile.write(json.dumps(transport_result).encode("utf-8"))

            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": f"Unknown endpoint: {path}"}).encode("utf-8"))

        except Exception as err:
            self._set_headers(500)
            self.wfile.write(json.dumps({
                "success": False,
                "error": "Internal intelligence optimization error",
                "details": str(err),
            }).encode("utf-8"))

    def log_message(self, format, *args):
        """Suppress default verbose logging; log clean summary."""
        sys.stderr.write(f"[Python-Intelligence] {self.address_string()} - {format % args}\n")


def run_server():
    server_address = (HOST, PORT)
    httpd = ThreadedHTTPServer(server_address, IntelligenceRequestHandler)
    print(f"[Python-Intelligence] Server running on http://{HOST}:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Python-Intelligence] Shutting down cleanly...")
        httpd.server_close()


if __name__ == "__main__":
    run_server()

