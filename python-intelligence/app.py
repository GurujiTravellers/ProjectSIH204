"""
Travel_Guruji Python Intelligence Microservice.
Built with FastAPI for high-performance validation, change detection, geospatial intelligence, and risk interpretation.
Strictly processes authentic API data - ZERO synthetic or manually configured weather/disaster numbers.
"""

import os
import sys
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add current directory and python_service to sys.path for backward compatibility imports
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, CURRENT_DIR)
sys.path.insert(0, os.path.join(PROJECT_ROOT, "python_service"))

from models.weather import (
    WeatherObservation,
    WeatherValidationRequest,
    WeatherValidationResponse,
    WeatherChangeRequest,
    WeatherChangeResponse,
    WeatherDiscrepancyRequest,
    WeatherDiscrepancyResponse,
)
from models.disaster import (
    DisasterAnalysisRequest,
    DisasterAnalysisResponse,
    DisasterEventAnalysis,
    RiskInterpretationRequest,
    RiskInterpretationResponse,
)
from services.validation import (
    validate_weather_observation,
    validate_disaster_record,
)
from services.change_detection import (
    detect_weather_changes,
    compare_weather_discrepancy,
    track_disaster_lifecycle,
)
from services.geospatial import (
    evaluate_event_proximity,
    DEFAULT_DESTINATIONS,
)
from services.risk_engine import interpret_travel_risk

# Try importing legacy optimizers for backward compatibility
try:
    from engines.itinerary_optimizer import optimize_itinerary
    from engines.budget_optimizer import optimize_budget
    from engines.transport_optimizer import optimize_transport_candidates
    HAS_LEGACY_ENGINES = True
except Exception as e:
    HAS_LEGACY_ENGINES = False
    print(f"[Python-Intelligence] Legacy engines warning: {e}")

app = FastAPI(
    title="Travel_Guruji Python Intelligence Layer",
    description=(
        "Authentic API data validation, anomaly/change detection, geospatial proximity, "
        "and explainable risk intelligence microservice for Travel_Guruji."
    ),
    version="2.0.0",
)

# Enable CORS for local Node backend and React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "service": "Travel_Guruji Python Intelligence Layer",
        "status": "online",
        "framework": "FastAPI",
        "version": "2.0.0",
        "documentation": "/docs",
        "monitoredDestinationsCount": len(DEFAULT_DESTINATIONS),
        "zeroSyntheticRule": "Enforced - All data derived exclusively from authentic external APIs",
    }


@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Travel_Guruji Python Intelligence Engine",
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "capabilities": [
            "weather_validation_v2",
            "weather_change_detection_v2",
            "geospatial_proximity_v2",
            "disaster_lifecycle_tracking_v2",
            "explainable_risk_interpretation_v2",
            "multi_source_discrepancy_diagnostics_v2",
            "legacy_itinerary_budget_transport_optimization",
        ],
    }


# ==============================================================================
# 1. WEATHER VALIDATION ENDPOINT
# ==============================================================================
@app.post("/validate/weather", response_model=WeatherValidationResponse)
def validate_weather(payload: WeatherValidationRequest):
    """
    Validates authentic external API observation from Tomorrow.io or Open-Meteo.
    Ensures values lie within physical meteorological limits without modifying them.
    """
    max_stale = payload.maxStaleMinutes or 60
    return validate_weather_observation(payload.current, max_stale_minutes=max_stale)


# ==============================================================================
# 2. WEATHER CHANGE DETECTION ENDPOINT
# ==============================================================================
@app.post("/detect/weather-change", response_model=WeatherChangeResponse)
def detect_weather_change(payload: WeatherChangeRequest):
    """
    Detects changes, trends, wind spikes, and sudden barometric pressure drops between
    consecutive polling intervals for a monitored destination.
    """
    return detect_weather_changes(
        destination=payload.destination,
        current=payload.current,
        previous=payload.previous,
    )


# ==============================================================================
# 3. MULTI-SOURCE DISCREPANCY ENDPOINT
# ==============================================================================
@app.post("/quality/weather-discrepancy", response_model=WeatherDiscrepancyResponse)
def weather_discrepancy(payload: WeatherDiscrepancyRequest):
    """
    Compares primary Tomorrow.io reading against secondary Open-Meteo reading
    for observability diagnostics. Authoritative source is never averaged.
    """
    return compare_weather_discrepancy(
        destination=payload.destination,
        primary=payload.primary,
        secondary=payload.secondary,
    )


# ==============================================================================
# 4. DISASTER GEOSPATIAL & LIFECYCLE ANALYSIS ENDPOINT
# ==============================================================================
@app.post("/analyze/disaster", response_model=DisasterAnalysisResponse)
def analyze_disasters(payload: DisasterAnalysisRequest):
    """
    Processes authentic external disaster events from USGS, GDACS, NASA EONET, and IMD.
    Performs exact spherical Haversine calculations against monitored Indian destinations,
    categorizes impact zones, and tracks event lifecycles.
    """
    raw_events = payload.events
    previous_events = payload.previousEvents or []

    # Track lifecycle changes across polling batches
    lifecycle_map, expired_ids = track_disaster_lifecycle(raw_events, previous_events)

    analyzed_events: List[DisasterEventAnalysis] = []
    new_count = 0
    updated_count = 0

    for ev in raw_events:
        valid, errors, warnings = validate_disaster_record(ev)
        if not valid:
            continue

        ev_id = ev.get("id", "UNKNOWN")
        source = ev.get("source", "Official Network")
        disaster_type = ev.get("disasterType", "Incident")
        title = ev.get("title", f"{disaster_type} Alert")

        coords = ev.get("coordinates") or {}
        lat = float(ev.get("latitude") if ev.get("latitude") is not None else coords.get("lat"))
        lon = float(ev.get("longitude") if ev.get("longitude") is not None else coords.get("lon"))

        mag_val = ev.get("magnitudeValue")
        if mag_val is None and ev.get("magnitude"):
            # Try extracting float from 'M 5.2'
            try:
                mag_val = float(str(ev.get("magnitude")).replace("M", "").strip())
            except Exception:
                mag_val = None

        # Geospatial proximity evaluation
        (
            nearest_name,
            nearest_dist,
            nearest_cat,
            impact_radius,
            within_impact,
            affected_list,
        ) = evaluate_event_proximity(
            event_lat=lat,
            event_lon=lon,
            disaster_type=disaster_type,
            magnitude_val=mag_val,
            destinations=payload.destinations,
        )

        lifecycle = lifecycle_map.get(ev_id, "NEW_EVENT")
        if lifecycle == "NEW_EVENT":
            new_count += 1
        elif lifecycle == "UPDATED_EVENT":
            updated_count += 1

        dist_str = f"{nearest_dist:.1f} km from {nearest_name}" if nearest_name else "active zone"
        attribution = f"Authentic incident data provided by {source}. Epicenter located {dist_str}."

        analyzed_events.append(
            DisasterEventAnalysis(
                eventId=ev_id,
                source=source,
                disasterType=disaster_type,
                title=title,
                lifecycle=lifecycle,
                nearestDestination=nearest_name,
                nearestDistanceKm=nearest_dist,
                proximityCategory=nearest_cat,
                withinImpactRadius=within_impact,
                impactRadiusKm=impact_radius,
                affectedDestinations=affected_list,
                sourceAttribution=attribution,
                rawEvent=ev,
            )
        )

    now_iso = datetime.now(timezone.utc).isoformat()

    return DisasterAnalysisResponse(
        totalEventsReceived=len(raw_events),
        activeEvents=analyzed_events,
        newEventsCount=new_count,
        updatedEventsCount=updated_count,
        expiredEvents=expired_ids,
        timestamp=now_iso,
    )


# ==============================================================================
# 5. EXPLAINABLE RISK INTERPRETATION ENDPOINT
# ==============================================================================
@app.post("/analyze/risk", response_model=RiskInterpretationResponse)
def analyze_risk(payload: RiskInterpretationRequest):
    """
    Generates explainable, grounded travel risk evaluations citing external sources.
    Combines authentic weather observations with real event proximities and compound hazards.
    """
    return interpret_travel_risk(payload)


# ==============================================================================
# 6. BACKWARD COMPATIBILITY ENDPOINTS (Trip Optimization)
# ==============================================================================
@app.post("/api/optimize/itinerary")
@app.post("/optimize/itinerary")
async def handle_optimize_itinerary(request: Request):
    if not HAS_LEGACY_ENGINES:
        raise HTTPException(status_code=503, detail="Legacy optimization engines unavailable")
    try:
        payload = await request.json()
        trip_context = payload.get("tripContext", {})
        budget_context = payload.get("budgetContext", {})
        preferences = payload.get("preferences", {})
        candidate_attractions = payload.get("candidateAttractions", [])
        real_time_context = payload.get("realTimeContext", {})

        itin_result = optimize_itinerary(
            trip_context=trip_context,
            preferences=preferences,
            candidate_attractions=candidate_attractions,
            real_time_context=real_time_context,
        )
        budget_result = optimize_budget(
            trip_context=trip_context,
            budget_context=budget_context,
            preferences=preferences,
        )
        return {
            "success": True,
            "engine": "python_intelligence_v2",
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
            "itineraryResult": itin_result,
            "budgetResult": budget_result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/optimize/budget")
@app.post("/optimize/budget")
async def handle_optimize_budget(request: Request):
    if not HAS_LEGACY_ENGINES:
        raise HTTPException(status_code=503, detail="Legacy optimization engines unavailable")
    try:
        payload = await request.json()
        trip_context = payload.get("tripContext", {})
        budget_context = payload.get("budgetContext", {})
        preferences = payload.get("preferences", {})

        budget_result = optimize_budget(
            trip_context=trip_context,
            budget_context=budget_context,
            preferences=preferences,
        )
        return {
            "success": True,
            "engine": "python_budget_optimizer_v2",
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
            "budgetResult": budget_result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/optimize/transport")
@app.post("/optimize/transport")
async def handle_optimize_transport(request: Request):
    if not HAS_LEGACY_ENGINES:
        raise HTTPException(status_code=503, detail="Legacy optimization engines unavailable")
    try:
        payload = await request.json()
        candidates = payload.get("candidates", [])
        preferences = payload.get("preferences", {})
        budget_context = payload.get("budgetContext", {})

        transport_result = optimize_transport_candidates(
            candidates=candidates,
            user_preferences=preferences,
            budget_context=budget_context,
        )
        return transport_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    print(f"[Python-Intelligence] Launching FastAPI service on http://{host}:{port}")
    uvicorn.run("app:app", host=host, port=port, reload=False)
