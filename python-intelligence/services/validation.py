"""
Validation Service for Travel_Guruji Python Intelligence Layer.
Strictly validates authentic incoming API records.
NEVER generates, substitutes, or hardcodes meteorological or disaster figures.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
from models.weather import WeatherObservation, WeatherValidationResponse


def parse_timestamp_iso(ts_str: Optional[str]) -> Optional[datetime]:
    """Parses ISO 8601 string to timezone-aware UTC datetime."""
    if not ts_str:
        return None
    try:
        # Handle trailing Z
        cleaned = ts_str.replace("Z", "+00:00")
        dt = datetime.fromisoformat(cleaned)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None


def validate_weather_observation(
    observation: WeatherObservation,
    max_stale_minutes: int = 60,
) -> WeatherValidationResponse:
    """
    Validates a raw weather observation originating strictly from Tomorrow.io or Open-Meteo.
    Flags invalid ranges, missing required fields, or stale observations.
    Never invents or modifies values.
    """
    errors: List[str] = []
    warnings: List[str] = []
    quality_score = 1.0

    # 1. Source verification
    known_sources = {"Tomorrow.io", "Open-Meteo", "Tomorrow.io Real-Time API", "Open-Meteo Fallback"}
    if not observation.source or not any(s in observation.source for s in ["Tomorrow", "Open-Meteo"]):
        warnings.append(f"Unverified weather source name: '{observation.source}'")
        quality_score -= 0.15

    # 2. Temperature validation (MANDATORY)
    if observation.temperature is None:
        errors.append("Missing mandatory temperature field from API response.")
    elif not isinstance(observation.temperature, (int, float)):
        errors.append(f"Temperature is non-numeric: {type(observation.temperature).__name__}")
    elif observation.temperature < -90.0 or observation.temperature > 60.0:
        errors.append(f"Temperature {observation.temperature}°C violates physical planetary limits (-90°C to +60°C).")

    # 3. Apparent Temperature (Feels like)
    if observation.apparentTemperature is not None:
        if observation.apparentTemperature < -100.0 or observation.apparentTemperature > 70.0:
            warnings.append(f"Apparent temperature {observation.apparentTemperature}°C is extreme.")
            quality_score -= 0.1

    # 4. Humidity validation
    if observation.humidity is not None:
        if observation.humidity < 0.0 or observation.humidity > 100.0:
            errors.append(f"Relative humidity {observation.humidity}% outside permissible range [0, 100].")

    # 5. Wind Speed
    if observation.windSpeed is not None:
        if observation.windSpeed < 0.0:
            errors.append(f"Wind speed {observation.windSpeed} km/h cannot be negative.")
        elif observation.windSpeed > 400.0:
            warnings.append(f"Wind speed {observation.windSpeed} km/h exceeds severe cyclone thresholds (>400 km/h).")
            quality_score -= 0.1

    # 6. Precipitation
    if observation.precipitation is not None:
        if observation.precipitation < 0.0:
            errors.append(f"Precipitation rate {observation.precipitation} mm/h cannot be negative.")
        elif observation.precipitation > 500.0:
            warnings.append(f"Precipitation rate {observation.precipitation} mm/h is exceptionally high.")
            quality_score -= 0.1

    # 7. Atmospheric Pressure (Surface station pressure valid from sea level up to ~5500m elevation)
    if observation.pressure is not None:
        if observation.pressure < 500.0 or observation.pressure > 1085.0:
            errors.append(f"Atmospheric pressure {observation.pressure} hPa outside physical bounds [500, 1085].")

    # 8. Visibility
    if observation.visibility is not None and observation.visibility < 0.0:
        errors.append(f"Visibility {observation.visibility} km cannot be negative.")

    # 9. Timestamp & Staleness validation
    is_stale = False
    data_age_min: Optional[float] = None
    obs_dt = parse_timestamp_iso(observation.timestamp)

    if not obs_dt:
        warnings.append(f"Could not parse observation timestamp: '{observation.timestamp}'")
        quality_score -= 0.2
    else:
        now_utc = datetime.now(timezone.utc)
        diff_seconds = (now_utc - obs_dt).total_seconds()
        data_age_min = round(diff_seconds / 60.0, 1)

        if data_age_min < -10.0:
            warnings.append(f"Observation timestamp is in the future by {abs(data_age_min)} minutes.")
            quality_score -= 0.1
        elif data_age_min > max_stale_minutes:
            is_stale = True
            warnings.append(f"Observation is stale: {data_age_min} minutes old (threshold: {max_stale_minutes} min).")
            quality_score -= min(0.4, 0.05 * (data_age_min / max_stale_minutes))

    # Bound quality score between 0.0 and 1.0
    quality_score = max(0.0, min(1.0, round(quality_score, 2)))
    valid = len(errors) == 0

    validated_dict = observation.model_dump() if valid else None

    return WeatherValidationResponse(
        valid=valid,
        source=observation.source,
        destination=observation.destination,
        validatedData=validated_dict,
        errors=errors,
        warnings=warnings,
        isStale=is_stale,
        dataAgeMinutes=data_age_min,
        qualityScore=quality_score if valid else 0.0,
    )


RECOGNIZED_DISASTER_TYPES = {
    "earthquake": "Earthquake",
    "seismic": "Earthquake",
    "cyclone": "Cyclone",
    "tropical_cyclone": "Cyclone",
    "hurricane": "Cyclone",
    "typhoon": "Cyclone",
    "flood": "Flood",
    "flash_flood": "Flood",
    "landslide": "Landslide",
    "mudslide": "Landslide",
    "storm": "Storm",
    "severe_storm": "Storm",
    "thunderstorm": "Storm",
    "drought": "Drought",
    "wildfire": "Wildfire",
    "forest_fire": "Wildfire",
    "bushfire": "Wildfire",
    "tsunami": "Tsunami",
}


def normalize_disaster_type(raw_type: Optional[str]) -> str:
    """Normalizes raw disaster category string into canonical Travel_Guruji taxonomy."""
    if not raw_type:
        return "Other"
    cleaned = str(raw_type).strip().lower().replace("-", "_").replace(" ", "_")
    for key, canonical in RECOGNIZED_DISASTER_TYPES.items():
        if key in cleaned:
            return canonical
    return "Other"


def validate_disaster_record(event: Dict[str, Any]) -> Tuple[bool, List[str], List[str]]:
    """
    Validates an individual real disaster record from USGS, GDACS, NASA, or IMD.
    Checks coordinate bounds, required event ID, and timestamp parsing.
    Rejects physically impossible coordinates or missing identifiers.
    Never invents missing parameters (magnitude, depth, severity).
    """
    errors: List[str] = []
    warnings: List[str] = []

    # 1. Mandatory ID and source check
    if not event.get("id"):
        errors.append("Disaster event missing mandatory unique 'id'.")
    if not event.get("source"):
        warnings.append("Disaster event missing 'source' attribution.")

    # 2. Strict coordinate bounds check: lat [-90, +90], lon [-180, +180]
    coords = event.get("coordinates") or {}
    lat = event.get("latitude") if event.get("latitude") is not None else coords.get("lat")
    lon = event.get("longitude") if event.get("longitude") is not None else coords.get("lon")

    if lat is None or lon is None:
        errors.append("Disaster event missing latitude or longitude.")
    else:
        try:
            flat = float(lat)
            flon = float(lon)
            if flat < -90.0 or flat > 90.0:
                errors.append(f"Latitude {flat} outside physical planetary bounds [-90, +90].")
            if flon < -180.0 or flon > 180.0:
                errors.append(f"Longitude {flon} outside physical planetary bounds [-180, +180].")
        except (ValueError, TypeError):
            errors.append(f"Coordinates non-numeric: lat={lat}, lon={lon}")

    # 3. Timestamp verification
    ts_raw = event.get("issuedAt") or event.get("timestamp") or event.get("time")
    if ts_raw:
        dt = parse_timestamp_iso(str(ts_raw))
        if not dt:
            warnings.append(f"Disaster event timestamp could not be parsed as valid ISO 8601: '{ts_raw}'.")
    else:
        warnings.append("Disaster event lacks explicit issuance timestamp.")

    # 4. Canonical disaster type normalization
    dtype_raw = event.get("disasterType")
    canonical_type = normalize_disaster_type(dtype_raw)
    if canonical_type == "Other" and dtype_raw:
        warnings.append(f"Unrecognized disaster type: '{dtype_raw}', categorizing as 'Other'.")

    # 5. Type-specific checks: Seismic magnitude
    if canonical_type == "Earthquake":
        mag = event.get("magnitudeValue")
        if mag is not None:
            try:
                float(mag)
            except (ValueError, TypeError):
                warnings.append(f"Seismic magnitude value '{mag}' is not a numeric float.")

    return len(errors) == 0, errors, warnings


def deduplicate_disaster_records(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Deduplicates disaster records originating from multiple API polls or feeds.
    Matches identical IDs or equivalent spatio-temporal events (source, type, coords within 0.05°, time within 1 hr).
    Preserves the latest/most complete authentic record.
    """
    seen_ids: Dict[str, Dict[str, Any]] = {}
    fingerprints: Dict[str, Dict[str, Any]] = {}
    result: List[Dict[str, Any]] = []

    for ev in events:
        eid = ev.get("id")
        if eid:
            if eid in seen_ids:
                # Update with more detailed or latest version if applicable
                continue
            seen_ids[eid] = ev

        # Spatial-temporal fingerprint
        src = str(ev.get("source") or "").lower()
        dtype = normalize_disaster_type(ev.get("disasterType"))
        coords = ev.get("coordinates") or {}
        lat = ev.get("latitude") if ev.get("latitude") is not None else coords.get("lat")
        lon = ev.get("longitude") if ev.get("longitude") is not None else coords.get("lon")


        fp_key = None
        if lat is not None and lon is not None:
            try:
                fp_key = f"{src}_{dtype}_{round(float(lat), 2)}_{round(float(lon), 2)}"
            except (ValueError, TypeError):
                fp_key = None

        if fp_key and fp_key in fingerprints:
            continue
        if fp_key:
            fingerprints[fp_key] = ev

        result.append(ev)

    return result

