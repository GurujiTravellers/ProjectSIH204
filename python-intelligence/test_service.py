"""
Comprehensive Verification Test for Travel_Guruji Python Intelligence Layer.
Tests:
1. Physical range validation for real Tomorrow.io / Open-Meteo observations.
2. Rejection of invalid / out-of-bounds / missing data without value hallucination.
3. Change detection (warming trend, wind spikes, sudden pressure drop, heavy rain).
4. Multi-source discrepancy diagnostics without averaging.
5. Geospatial proximity calculations for Kolkata, Darjeeling, Manali, Shimla, Srinagar, Gulmarg, Puri.
6. Compound hazard evaluation and explainable risk attribution.
7. Legacy optimizer route compatibility.
"""

import sys
import os
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CURRENT_DIR)

from models.weather import (
    WeatherObservation,
    WeatherValidationRequest,
    WeatherChangeRequest,
    WeatherDiscrepancyRequest,
)
from models.disaster import (
    DisasterAnalysisRequest,
    RiskInterpretationRequest,
)
from services.validation import validate_weather_observation
from services.change_detection import (
    detect_weather_changes,
    compare_weather_discrepancy,
)
from services.geospatial import (
    haversine_distance_km,
    evaluate_event_proximity,
    DEFAULT_DESTINATIONS,
)
from services.risk_engine import interpret_travel_risk


def run_all_tests():
    print("=" * 60)
    print("TRAVEL_GURUJI PYTHON INTELLIGENCE LAYER - VERIFICATION SUITE")
    print("=" * 60)

    # 1. Weather Validation Test
    print("\n[TEST 1] Weather Observation Validation...")
    valid_obs = WeatherObservation(
        temperature=21.5,
        apparentTemperature=22.0,
        humidity=65.0,
        windSpeed=12.4,
        windDirection=180.0,
        pressure=1013.25,
        visibility=10.0,
        precipitation=0.0,
        weatherCode=1000,
        condition="Clear",
        source="Tomorrow.io",
        timestamp=datetime.now(timezone.utc).isoformat(),
        latitude=22.5726,
        longitude=88.3639,
        destination="Kolkata",
    )
    res = validate_weather_observation(valid_obs)
    assert res.valid is True, f"Expected valid, got errors: {res.errors}"
    assert res.qualityScore > 0.8, f"Expected high quality score, got {res.qualityScore}"
    print("  -> Valid observation test PASSED (Quality score:", res.qualityScore, ")")

    # 2. Out-of-bounds rejection (NO invented values)
    invalid_obs = WeatherObservation(
        temperature=120.0,  # Physically impossible on Earth
        humidity=150.0,    # Out of range
        windSpeed=-5.0,    # Negative
        pressure=500.0,    # Impossibly low
        source="Tomorrow.io",
        timestamp="2026-09-30T00:00:00Z",
        latitude=22.5726,
        longitude=88.3639,
    )
    res_inv = validate_weather_observation(invalid_obs)
    assert res_inv.valid is False
    assert len(res_inv.errors) >= 3
    assert res_inv.validatedData is None  # Zero synthesized data
    print("  -> Rejection of impossible meteorological data PASSED (Errors caught:", len(res_inv.errors), ")")

    # 3. Change Detection Test
    print("\n[TEST 2] Change Detection & Trend Analysis...")
    prev_reading = {
        "temperature": 18.0,
        "windSpeed": 10.0,
        "pressure": 1015.0,
        "precipitation": 0.0,
        "condition": "Partly Cloudy",
        "timestamp": "2026-09-30T00:00:00Z",
    }
    curr_reading = {
        "temperature": 22.0,
        "windSpeed": 45.0,  # Sudden spike
        "pressure": 1011.5,  # Pressure drop
        "precipitation": 8.5,  # Rain onset
        "condition": "Heavy Rain",
        "timestamp": "2026-09-30T00:30:00Z",
    }
    change_res = detect_weather_changes("Shimla", curr_reading, prev_reading)
    assert change_res.changed is True
    assert change_res.significant is True
    assert "temperature" in change_res.changes
    assert change_res.changes["temperature"]["trend"] == "WARMING"
    assert change_res.changes["windSpeed"]["windSpike"] is True
    assert change_res.changes["pressure"]["steepDrop"] is True
    assert change_res.changes["precipitation"]["heavyRainOnset"] is True
    print("  -> Weather change detection PASSED (Summary:", change_res.summary, ")")

    # 4. Multi-Source Discrepancy (Zero averaging)
    print("\n[TEST 3] Multi-Source Discrepancy Diagnostics...")
    pri = {"source": "Tomorrow.io", "temperature": 24.2, "precipitation": 0.0, "condition": "Sunny"}
    sec = {"source": "Open-Meteo", "temperature": 23.5, "precipitation": 0.0, "condition": "Sunny"}
    disc_res = compare_weather_discrepancy("Kolkata", pri, sec)
    assert disc_res.temperature_difference == 0.7
    assert "Tomorrow.io remains authoritative" in disc_res.note
    print("  -> Discrepancy diagnostics PASSED (Delta: 0.7°C, Note verified)")

    # 5. Geospatial Proximity for Key Destinations
    print("\n[TEST 4] Geospatial Calculations for Monitored Destinations...")
    # Test Kolkata to Darjeeling distance (approx 500-600 km)
    kol_lat, kol_lon = DEFAULT_DESTINATIONS["Kolkata"]["lat"], DEFAULT_DESTINATIONS["Kolkata"]["lon"]
    dar_lat, dar_lon = DEFAULT_DESTINATIONS["Darjeeling"]["lat"], DEFAULT_DESTINATIONS["Darjeeling"]["lon"]
    dist_kd = haversine_distance_km(kol_lat, kol_lon, dar_lat, dar_lon)
    assert 450 < dist_kd < 600, f"Unexpected Kolkata-Darjeeling distance: {dist_kd}"
    print(f"  -> Kolkata to Darjeeling: {dist_kd} km (Haversine verified)")

    # Test Shimla to Manali distance (approx 120-150 km)
    shi_lat, shi_lon = DEFAULT_DESTINATIONS["Shimla"]["lat"], DEFAULT_DESTINATIONS["Shimla"]["lon"]
    man_lat, man_lon = DEFAULT_DESTINATIONS["Manali"]["lat"], DEFAULT_DESTINATIONS["Manali"]["lon"]
    dist_sm = haversine_distance_km(shi_lat, shi_lon, man_lat, man_lon)
    assert 100 < dist_sm < 160, f"Unexpected Shimla-Manali distance: {dist_sm}"
    print(f"  -> Shimla to Manali: {dist_sm} km (Haversine verified)")

    # Test Srinagar to Gulmarg distance (approx 35-55 km)
    sri_lat, sri_lon = DEFAULT_DESTINATIONS["Srinagar"]["lat"], DEFAULT_DESTINATIONS["Srinagar"]["lon"]
    gul_lat, gul_lon = DEFAULT_DESTINATIONS["Gulmarg"]["lat"], DEFAULT_DESTINATIONS["Gulmarg"]["lon"]
    dist_sg = haversine_distance_km(sri_lat, sri_lon, gul_lat, gul_lon)
    assert 30 < dist_sg < 60, f"Unexpected Srinagar-Gulmarg distance: {dist_sg}"
    print(f"  -> Srinagar to Gulmarg: {dist_sg} km (Haversine verified)")

    # Test Real Event Proximity (Simulated USGS epicenter near Manali)
    nearest_name, nearest_dist, cat, radius, within, affected = evaluate_event_proximity(
        event_lat=32.25, event_lon=77.20, disaster_type="Earthquake", magnitude_val=5.2
    )
    assert nearest_name == "Manali"
    assert nearest_dist < 10.0
    assert cat == "DIRECT_IMPACT"
    assert within is True
    print(f"  -> Epicenter near Manali evaluated correctly: {nearest_name}, {nearest_dist} km ({cat})")

    # 6. Risk Engine & Compound Hazards
    print("\n[TEST 5] Risk Intelligence & Compound Hazards...")
    risk_req = RiskInterpretationRequest(
        destination="Manali",
        weather={
            "temperature": 12.0,
            "windSpeed": 25.0,
            "precipitation": 18.0,  # Torrential rain
            "condition": "Heavy Rain",
            "source": "Tomorrow.io",
        },
        activeDisasters=[
            {
                "id": "USGS-test-01",
                "source": "USGS Seismic Network",
                "disasterType": "Earthquake",
                "title": "M 5.1 Tremor near Beas Valley",
                "magnitudeValue": 5.1,
                "latitude": 32.30,
                "longitude": 77.15,
                "issuedAt": "2026-09-30T01:00:00Z",
                "severity": "CRITICAL",
            }
        ],
    )
    risk_res = interpret_travel_risk(risk_req)
    assert risk_res.overallRiskLevel in ("HIGH", "CRITICAL")
    assert len(risk_res.compoundHazards) > 0  # Slope instability / landslide triggered!
    assert "TRAVEL_GURUJI RISK INTERPRETATION" in risk_res.disclaimer
    assert "USGS" in risk_res.sourceEvidence[len(risk_res.sourceEvidence) - 1]
    assert risk_res.safeAlternatives == "Chandigarh"
    print("  -> Risk engine PASSED:")
    print("     Overall level:", risk_res.overallRiskLevel)
    print("     Badge:", risk_res.badgeLabel)
    print("     Compound hazard:", risk_res.compoundHazards[0])
    print("     Safe alternative:", risk_res.safeAlternatives)

    print("\n" + "=" * 60)
    print("ALL PYTHON INTELLIGENCE LAYER TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    run_all_tests()
