# Travel_Guruji Python Intelligence Layer

High-performance, async FastAPI microservice providing authentic external API validation, meteorological change detection, geospatial disaster proximity analysis, and explainable risk intelligence for the **Travel_Guruji** platform.

---

## 🏛️ Absolute Zero-Synthetic Data Rule
This service **strictly processes and verifies real data originating from external APIs**:
- 🌤️ **Tomorrow.io** (Primary real-time weather & radar)
- 🌦️ **Open-Meteo** (Secondary satellite & hydrology radar fallback)
- 🚨 **GDACS** (United Nations & European Commission Global Disaster Alerts)
- 🌍 **USGS** (United States Geological Survey real-time seismic network)
- 🔭 **NASA EONET** (Earth Observatory Natural Event Tracker satellite)
- 🇮🇳 **IMD / NDMA** (India Meteorological Department & National Disaster Management Authority directives)

> [!IMPORTANT]
> **Zero Value Invention**: The Python Intelligence Layer **never** invents, approximates, simulates, or hardcodes weather or disaster numbers. Missing or invalid parameters are rejected and flagged for telemetry fallback without value hallucination.

---

## ⚡ Core Architecture

```
REAL EXTERNAL APIS (Tomorrow.io, Open-Meteo, USGS, GDACS, NASA)
                     │
                     ▼
         Node.js / Express Backend
                     │ (JSON payload)
                     ▼
      Python Intelligence Service (FastAPI :8000)
    ┌──────────────────────────────────────────────┐
    │  1. Physical Limit & Staleness Validation    │
    │  2. Anomaly & Change Detection (Deltas)     │
    │  3. Multi-Source Discrepancy Diagnostics    │
    │  4. Haversine & Shapely Geospatial Analysis │
    │  5. Compound Hazard Risk Interpretation     │
    └──────────────────────────────────────────────┘
                     │ (Structured Pydantic Models)
                     ▼
         Node.js / Express Backend
                     │
                     ▼ (SSE Streams & REST API)
           React / Vite Frontend
```

---

## 🚀 Microservice Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Microservice health check & engine capability report |
| `POST` | `/validate/weather` | Validates authentic meteorological observation against physical planetary bounds (`-90°C` to `+60°C`, `0-100%` humidity, `870-1085 hPa`) and checks observation staleness |
| `POST` | `/detect/weather-change` | Computes genuine deltas, trends (warming/cooling), wind spikes, barometric pressure drops, and precipitation onsets |
| `POST` | `/quality/weather-discrepancy` | Multi-source comparison between Tomorrow.io and Open-Meteo for telemetry diagnostics (zero synthetic averaging) |
| `POST` | `/analyze/disaster` | Geospatial proximity calculations (Haversine & Shapely) against 55 monitored Indian destinations, impact radius evaluation, and lifecycle tracking (`NEW_EVENT`, `UPDATED_EVENT`, `EXPIRED_EVENT`) |
| `POST` | `/analyze/risk` | Grounded, explainable risk interpretation citing external data sources with compound hazard detection (e.g. seismic + heavy rain = slope instability) and official disclaimers |
| `POST` | `/api/optimize/*` | Backward-compatible optimization endpoints for itinerary, budget, and transport |

---

## 🛠️ Setup & Running

### 1. Requirements
- Python 3.10+
- Installed virtual environment (`python-intelligence/.venv`)
- Dependencies: `fastapi`, `uvicorn`, `pydantic`, `httpx`, `shapely`, `numpy`

### 2. Standalone Launch
```bash
# Windows
.\python-intelligence\.venv\Scripts\python.exe python-intelligence\app.py

# Linux / macOS
./python-intelligence/.venv/bin/python python-intelligence/app.py
```

### 3. Integrated Full-Stack Launch
```bash
npm run dev
# Starts Node backend (:5000), Python service (:8000), and Vite frontend (:5173) concurrently
```

### 4. Running Verification Test Suite
```bash
npm run python:test
```

---

## 🛡️ Resilient Fallback Guarantee
If the Python service is offline, restarting, or crashes:
- The Node.js backend **never crashes**.
- Node.js continues delivering raw authentic API data directly to the user.
- Intelligence blocks gracefully fall back to `{ "status": "unavailable", "message": "Intelligence analysis temporarily unavailable" }`.
- Frontend functions without interruption.
