"""
Change Detection and Multi-Source Comparison Service for Travel_Guruji.
Analyzes consecutive authentic observations and computes deltas without altering raw data.
Tracks event lifecycle: NEW_EVENT, UPDATED_EVENT, EXPIRED_EVENT.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
from services.validation import parse_timestamp_iso
from models.weather import (
    WeatherChangeResponse,
    WeatherDiscrepancyResponse,
)


def detect_weather_changes(
    destination: str,
    current: Dict[str, Any],
    previous: Optional[Dict[str, Any]] = None,
) -> WeatherChangeResponse:
    """
    Computes genuine deltas, trends, and significance between consecutive API polls.
    Does not invent values or average data.
    """
    now_ts = current.get("timestamp") or datetime.now(timezone.utc).isoformat()

    if not previous:
        return WeatherChangeResponse(
            destination=destination,
            changed=False,
            changes={"initialObservation": True},
            significant=False,
            summary=f"Initial verified observation recorded for {destination}.",
            timestamp=now_ts,
        )

    changes: Dict[str, Any] = {}
    significant = False
    summary_parts: List[str] = []

    # 1. Time delta calculation
    curr_time = parse_timestamp_iso(current.get("timestamp"))
    prev_time = parse_timestamp_iso(previous.get("timestamp"))
    time_diff_min = 0.0
    if curr_time and prev_time:
        time_diff_min = max(1.0, round((curr_time - prev_time).total_seconds() / 60.0, 1))

    # 2. Temperature delta & trend
    curr_temp = current.get("temperature")
    prev_temp = previous.get("temperature")
    if curr_temp is not None and prev_temp is not None:
        delta_temp = round(float(curr_temp) - float(prev_temp), 2)
        if abs(delta_temp) >= 0.1:
            trend = "WARMING" if delta_temp > 0 else "COOLING"
            rate_per_hour = round(delta_temp / (time_diff_min / 60.0), 2) if time_diff_min > 0 else delta_temp
            changes["temperature"] = {
                "previous": prev_temp,
                "current": curr_temp,
                "delta": delta_temp,
                "trend": trend,
                "ratePerHour": rate_per_hour,
            }
            if abs(delta_temp) >= 2.5:
                significant = True
                summary_parts.append(f"Temperature shifted by {delta_temp:+}°C ({trend.lower()})")

    # 3. Wind speed spikes
    curr_wind = current.get("windSpeed")
    prev_wind = previous.get("windSpeed")
    if curr_wind is not None and prev_wind is not None:
        delta_wind = round(float(curr_wind) - float(prev_wind), 2)
        if abs(delta_wind) >= 1.0:
            changes["windSpeed"] = {
                "previous": prev_wind,
                "current": curr_wind,
                "delta": delta_wind,
                "windSpike": delta_wind >= 15.0 or (float(curr_wind) >= 40.0),
            }
            if delta_wind >= 15.0 or float(curr_wind) >= 45.0:
                significant = True
                summary_parts.append(f"Wind speed surged by {delta_wind:+} km/h to {curr_wind} km/h")

    # 4. Sudden Pressure Drop (crucial storm / front indicator)
    curr_press = current.get("pressure")
    prev_press = previous.get("pressure")
    if curr_press is not None and prev_press is not None:
        delta_press = round(float(curr_press) - float(prev_press), 2)
        if abs(delta_press) >= 0.5:
            changes["pressure"] = {
                "previous": prev_press,
                "current": curr_press,
                "delta": delta_press,
                "steepDrop": delta_press <= -2.0,
            }
            if delta_press <= -2.5:
                significant = True
                summary_parts.append(f"Barometric pressure dropped steeply by {delta_press} hPa")

    # 5. Precipitation onset
    curr_precip = current.get("precipitation", 0.0) or 0.0
    prev_precip = previous.get("precipitation", 0.0) or 0.0
    delta_precip = round(float(curr_precip) - float(prev_precip), 2)
    if abs(delta_precip) >= 0.2:
        onset = prev_precip == 0 and curr_precip > 0
        changes["precipitation"] = {
            "previous": prev_precip,
            "current": curr_precip,
            "delta": delta_precip,
            "heavyRainOnset": curr_precip >= 5.0,
        }
        if onset and curr_precip >= 2.0:
            significant = True
            summary_parts.append(f"Rainfall commenced ({curr_precip} mm/h)")
        elif curr_precip >= 10.0:
            significant = True
            summary_parts.append(f"Heavy precipitation detected ({curr_precip} mm/h)")

    # 6. Condition transition
    curr_cond = str(current.get("condition") or "")
    prev_cond = str(previous.get("condition") or "")
    if curr_cond and prev_cond and curr_cond.lower() != prev_cond.lower():
        changes["condition"] = {
            "previous": prev_cond,
            "current": curr_cond,
        }
        severe_terms = ["storm", "rain", "snow", "fog", "thunder", "hail"]
        if any(term in curr_cond.lower() for term in severe_terms) and not any(term in prev_cond.lower() for term in severe_terms):
            significant = True
            summary_parts.append(f"Condition changed from {prev_cond} to {curr_cond}")

    changed = len(changes) > 0
    if not summary_parts:
        summary = "Atmospheric parameters steady across monitoring cycles." if changed else "No atmospheric change recorded."
    else:
        summary = "; ".join(summary_parts)

    return WeatherChangeResponse(
        destination=destination,
        changed=changed,
        changes=changes,
        significant=significant,
        summary=summary,
        timestamp=now_ts,
    )


def compare_weather_discrepancy(
    destination: str,
    primary: Dict[str, Any],
    secondary: Dict[str, Any],
) -> WeatherDiscrepancyResponse:
    """
    Performs multi-source comparison between primary (Tomorrow.io) and secondary (Open-Meteo).
    Evaluates telemetry agreement for diagnostic observability.
    NEVER averages or blends values into a synthetic number.
    """
    pri_temp = primary.get("temperature")
    sec_temp = secondary.get("temperature")

    pri_temp_f = float(pri_temp) if pri_temp is not None else None
    sec_temp_f = float(sec_temp) if sec_temp is not None else None

    temp_diff: Optional[float] = None
    if pri_temp_f is not None and sec_temp_f is not None:
        temp_diff = round(abs(pri_temp_f - sec_temp_f), 2)

    pri_precip = primary.get("precipitation")
    sec_precip = secondary.get("precipitation")
    precip_diff: Optional[float] = None
    if pri_precip is not None and sec_precip is not None:
        precip_diff = round(abs(float(pri_precip) - float(sec_precip)), 2)

    pri_cond = str(primary.get("condition") or "").lower()
    sec_cond = str(secondary.get("condition") or "").lower()
    condition_match = (pri_cond == sec_cond) if (pri_cond and sec_cond) else True

    agreement_level = "HIGH"
    if temp_diff is not None:
        if temp_diff > 5.0:
            agreement_level = "POOR"
        elif temp_diff > 2.0:
            agreement_level = "MODERATE"

    note = (
        f"Multi-source agreement: {agreement_level}. "
        f"Tomorrow.io remains authoritative primary source. "
        f"No values have been averaged or artificially altered."
    )

    return WeatherDiscrepancyResponse(
        destination=destination,
        primary_source=str(primary.get("source") or "Tomorrow.io"),
        primary_temperature=pri_temp_f,
        secondary_source=str(secondary.get("source") or "Open-Meteo"),
        secondary_temperature=sec_temp_f,
        temperature_difference=temp_diff,
        precipitation_difference=precip_diff,
        condition_match=condition_match,
        note=note,
    )


def track_disaster_lifecycle(
    current_events: List[Dict[str, Any]],
    previous_events: Optional[List[Dict[str, Any]]] = None,
) -> Tuple[Dict[str, str], List[str]]:
    """
    Tracks lifecycle transitions between polling batches:
    - NEW_EVENT: present in current, not in previous
    - UPDATED_EVENT: present in both, with changed magnitude, coordinates, or alert level
    - UNCHANGED: present in both with identical attributes
    - EXPIRED_EVENT: present in previous, no longer in current active feed
    """
    lifecycle_map: Dict[str, str] = {}
    prev_map: Dict[str, Dict[str, Any]] = {}

    if previous_events:
        for pe in previous_events:
            eid = pe.get("id")
            if eid:
                prev_map[eid] = pe

    curr_ids = set()
    for ce in current_events:
        eid = ce.get("id")
        if not eid:
            continue
        curr_ids.add(eid)

        if eid not in prev_map:
            lifecycle_map[eid] = "NEW_EVENT"
        else:
            old = prev_map[eid]
            # Check for changes in key attributes
            mag_changed = str(ce.get("magnitude")) != str(old.get("magnitude"))
            sev_changed = str(ce.get("severity")) != str(old.get("severity"))
            tier_changed = str(ce.get("alertTier")) != str(old.get("alertTier"))
            if mag_changed or sev_changed or tier_changed:
                lifecycle_map[eid] = "UPDATED_EVENT"
            else:
                lifecycle_map[eid] = "UNCHANGED"

    expired_events = [old_id for old_id in prev_map if old_id not in curr_ids]

    return lifecycle_map, expired_events
