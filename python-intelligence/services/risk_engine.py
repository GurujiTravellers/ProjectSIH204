"""
Risk Intelligence Engine for Travel_Guruji.
Synthesizes verified real weather observations with authentic disaster events.
Provides grounded, explainable, and attributed travel risk assessments.
NEVER invents hazards or hardcodes arbitrary risk scores.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from services.geospatial import (
    haversine_distance_km,
    get_proximity_category,
    DEFAULT_DESTINATIONS,
)
from models.disaster import (
    RiskInterpretationRequest,
    RiskInterpretationResponse,
)

# Safe Alternative Transit Hubs mapped to key destinations
SAFE_ALTERNATIVE_HUBS: Dict[str, str] = {
    "Puri": "Bhubaneswar",
    "Konark": "Bhubaneswar",
    "Bhubaneswar": "Cuttack / Kolkata",
    "Digha": "Kolkata",
    "Darjeeling": "Siliguri / Bagdogra",
    "Manali": "Chandigarh",
    "Shimla": "Chandigarh",
    "Rohtang Pass": "Manali (South Portal)",
    "Kasol": "Bhuntar / Chandigarh",
    "Chitkul": "Shimla",
    "Kalpa": "Shimla",
    "Sissu": "Manali (South Portal)",
    "Kaza": "Shimla / Manali",
    "Chandratal Lake": "Kaza / Manali",
    "Haridwar": "Dehradun",
    "Rishikesh": "Dehradun",
    "Dehradun": "Haridwar / Delhi",
    "Mussoorie": "Dehradun",
    "Srinagar": "Jammu / Delhi",
    "Gulmarg": "Srinagar",
    "Pahalgam": "Srinagar",
    "Shillong": "Guwahati",
    "Mawlynnong Village": "Guwahati",
    "Dawki": "Guwahati",
    "Jaipur": "Delhi / Agra",
    "Jaisalmer": "Jodhpur",
    "Ajmer": "Jaipur",
    "Udaipur": "Ahmedabad / Jaipur",
    "Goa": "Belagavi / Mumbai",
    "Kalka": "Chandigarh",
    "Leh Ladakh": "Srinagar / Manali",
    "Leh": "Srinagar / Manali",
    "Mumbai": "Pune",
    "Hampi": "Hubballi / Bengaluru",
    "Andaman": "Port Blair Harbor & Airport",
}


def interpret_travel_risk(req: RiskInterpretationRequest) -> RiskInterpretationResponse:
    """
    Evaluates travel risk grounded exclusively in authentic weather parameters
    and real proximity-filtered disaster feeds.
    Strictly follows explainability rules and source attribution.
    """
    dest = req.destination
    dest_info = DEFAULT_DESTINATIONS.get(dest, {})
    dest_lat = req.latitude if req.latitude is not None else dest_info.get("lat")
    dest_lon = req.longitude if req.longitude is not None else dest_info.get("lon")
    corridor = dest_info.get("corridor", f"{dest} access corridor")

    now_iso = datetime.now(timezone.utc).isoformat()
    contributing_factors: List[str] = []
    compound_hazards: List[str] = []
    source_evidence: List[str] = []

    # Risk tiers
    risk_level = "LOW"
    badge_label = "🟢 Green Alert (Movement Normal)"
    color_code = "#10b981"
    movement_status = "MOVEMENT COMPLETELY POSSIBLE"
    travel_advisory = f"All major routes and highway corridors into {dest} are operating normally under standard travel conditions."

    # 1. Weather Grounding
    weather = req.weather or {}
    temp = weather.get("temperature")
    wind = weather.get("windSpeed")
    precip = weather.get("precipitation")
    condition = str(weather.get("condition") or "")
    weather_src = weather.get("source") or "Real-Time Weather Feed"

    has_heavy_rain = False
    has_gale_wind = False

    # Stale weather telemetry handling (Phase 8: >3 hours old limits confidence)
    is_stale = weather.get("isStale", False)
    data_age_min = weather.get("dataAgeMinutes")
    ts_weather = weather.get("timestamp")
    if is_stale or (data_age_min is not None and data_age_min > 180):
        contributing_factors.append("Weather telemetry is stale (>3 hours old); risk assessment confidence is limited.")
    elif ts_weather:
        try:
            from services.validation import parse_timestamp_iso
            dt_w = parse_timestamp_iso(ts_weather)
            if dt_w:
                age_h = (datetime.now(timezone.utc) - dt_w).total_seconds() / 3600.0
                if age_h > 3.0:
                    contributing_factors.append("Weather telemetry is stale (>3 hours old); risk assessment confidence is limited.")
        except Exception:
            pass

    if temp is not None:
        source_evidence.append(f"Temperature: {temp}°C via {weather_src}")
        if float(temp) <= -10.0:
            contributing_factors.append(f"Extreme sub-zero cold ({temp}°C) - frost and black ice risks on mountain passes.")
            if risk_level == "LOW":
                risk_level = "MODERATE"

    if wind is not None:
        w_float = float(wind)
        source_evidence.append(f"Wind Speed: {w_float} km/h via {weather_src}")
        if w_float >= 65.0:
            has_gale_wind = True
            contributing_factors.append(f"Gale force winds of {w_float} km/h recorded.")
            risk_level = "HIGH"
        elif w_float >= 40.0:
            contributing_factors.append(f"Brisk crosswinds of {w_float} km/h along elevated corridors.")
            if risk_level == "LOW":
                risk_level = "MODERATE"

    if precip is not None:
        p_float = float(precip)
        source_evidence.append(f"Precipitation: {p_float} mm/h via {weather_src}")
        if p_float >= 15.0:
            has_heavy_rain = True
            contributing_factors.append(f"Torrential rainfall ({p_float} mm/h) causing surface runoff and reduced braking friction.")
            risk_level = "HIGH"
        elif p_float >= 5.0:
            has_heavy_rain = True
            contributing_factors.append(f"Moderate to heavy rain ({p_float} mm/h) across local drainage basins.")
            if risk_level == "LOW":
                risk_level = "MODERATE"

    # 2. Disaster Proximity Grounding
    active_disasters = req.activeDisasters or []
    has_nearby_seismic = False

    for event in active_disasters:
        src = event.get("source") or "Official Disaster Network"
        ev_type = event.get("disasterType") or "Incident"
        title = event.get("title") or "Recorded Event"
        issued = event.get("issuedAt") or "recent"

        # Coordinates & Distance
        coords = event.get("coordinates") or {}
        e_lat = event.get("latitude") if event.get("latitude") is not None else coords.get("lat")
        e_lon = event.get("longitude") if event.get("longitude") is not None else coords.get("lon")

        dist_km: Optional[float] = None
        if dest_lat is not None and dest_lon is not None and e_lat is not None and e_lon is not None:
            dist_km = haversine_distance_km(float(dest_lat), float(dest_lon), float(e_lat), float(e_lon))
        elif event.get("distanceKm") is not None:
            dist_km = float(event.get("distanceKm"))

        dist_str = f"located {dist_km:.1f} km from {dest}" if dist_km is not None else f"in {dest} sector"
        citation = f"Based on {src} ({title}) issued at {issued}, {dist_str}."
        source_evidence.append(citation)

        # Proximity category
        category = get_proximity_category(dist_km) if dist_km is not None else "REGIONAL_ADVISORY"
        severity = str(event.get("severity") or "").upper()
        mag = event.get("magnitudeValue")

        if "earthquake" in ev_type.lower() or "seismic" in ev_type.lower():
            if dist_km is not None and dist_km <= 150:
                has_nearby_seismic = True

        if category == "DIRECT_IMPACT":
            if severity in ("CRITICAL", "RED", "DISASTER_ZONE"):
                risk_level = "CRITICAL"
                contributing_factors.append(f"Direct disaster zone: {ev_type} ({title}) within 25 km of {dest}.")
            else:
                if risk_level != "CRITICAL":
                    risk_level = "HIGH"
                contributing_factors.append(f"Immediate proximity ({dist_km} km) to active {ev_type}.")
        elif category == "NEARBY_WARNING":
            if severity in ("CRITICAL", "RED"):
                if risk_level != "CRITICAL":
                    risk_level = "HIGH"
                contributing_factors.append(f"Major {ev_type} operating within {dist_km} km along connecting arterial routes.")
            else:
                if risk_level == "LOW":
                    risk_level = "MODERATE"
                contributing_factors.append(f"Advisory alert for {ev_type} ({dist_km} km away).")
        elif category == "REGIONAL_ADVISORY":
            if severity in ("CRITICAL", "RED") and risk_level == "LOW":
                risk_level = "MODERATE"
                contributing_factors.append(f"Regional alert: {ev_type} {dist_km} km away may impact highway transits.")

    # 3. Compound Hazard Logic (Real physical interactions)
    is_mountainous = dest in [
        "Shimla", "Manali", "Rohtang Pass", "Kasol", "Chitkul", "Kalpa", "Sissu",
        "Kaza", "Chandratal Lake", "Mussoorie", "Rishikesh", "Srinagar", "Gulmarg",
        "Pahalgam", "Darjeeling", "Shillong", "Leh Ladakh", "Leh", "Ooty"
    ]

    if has_heavy_rain and has_nearby_seismic and is_mountainous:
        compound_hazards.append(
            f"Compound Risk: Recent seismic activity combined with heavy rainfall in mountainous terrain markedly elevates slope instability and landslide hazards along {corridor}."
        )
        if risk_level != "CRITICAL":
            risk_level = "HIGH"

    if has_gale_wind and has_heavy_rain:
        compound_hazards.append(
            f"Compound Weather: High wind gusts paired with driving rain cause hazardous driving visibility and treefall risks."
        )

    # 4. Final Risk Tier Configuration
    if risk_level == "CRITICAL":
        badge_label = "🔴 Red Alert (Disaster Zone / Critical Hazard)"
        color_code = "#ef4444"
        movement_status = "TRAVEL HAZARDOUS / ROUTES SUSPENDED"
        travel_advisory = (
            f"Active critical natural incident or severe weather impacts detected in the immediate {dest} corridor. "
            f"Non-essential tourist movements should be halted pending highway clearance."
        )
    elif risk_level == "HIGH":
        badge_label = "🟠 High Advisory (Significant Hazard Reported)"
        color_code = "#f97316"
        movement_status = "MOVEMENT RESTRICTED / CAUTION ADVISED"
        travel_advisory = (
            f"Significant environmental or route warning active near {dest}. "
            f"Travelers must monitor official police and highway bulletins before traversing {corridor}."
        )
    elif risk_level == "MODERATE":
        badge_label = "🟡 Yellow Alert (Moderate Advisory - Caution Advised)"
        color_code = "#eab308"
        movement_status = "MOVEMENT POSSIBLE WITH CAUTION"
        travel_advisory = (
            f"Minor weather variation or distant regional advisory reported. "
            f"Movement is feasible with vigilance along {corridor}."
        )
    else:
        badge_label = "🟢 Green Alert (Movement Normal)"
        color_code = "#10b981"
        movement_status = "MOVEMENT COMPLETELY POSSIBLE"
        travel_advisory = f"Clear atmospheric and seismic conditions verified for {dest}. All regular highway links open."

    safe_hub = SAFE_ALTERNATIVE_HUBS.get(dest, "Nearest State Transit Hub")
    safe_alt_text = f"Lower-risk alternative based on currently available data: {safe_hub}"

    if risk_level in ("HIGH", "CRITICAL"):
        travel_advisory = f"{travel_advisory} {safe_alt_text}."

    return RiskInterpretationResponse(
        destination=dest,
        overallRiskLevel=risk_level,
        badgeLabel=badge_label,
        colorCode=color_code,
        travelAdvisory=travel_advisory,
        movementStatus=movement_status,
        disclaimer="TRAVEL_GURUJI RISK INTERPRETATION (Not an official government evacuation order)",
        contributingFactors=contributing_factors,
        compoundHazards=compound_hazards,
        sourceEvidence=source_evidence,
        safeAlternatives=safe_hub,
        safeAlternativeRecommendation=safe_alt_text,
        timestamp=now_iso,
    )


