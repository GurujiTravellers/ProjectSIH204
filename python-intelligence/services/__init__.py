"""
Services package for Travel_Guruji Python Intelligence Layer.
"""

from .geospatial import (
    haversine_distance_km,
    create_point,
    get_proximity_category,
    compute_impact_radius_km,
    evaluate_event_proximity,
    DEFAULT_DESTINATIONS,
)

from .validation import (
    parse_timestamp_iso,
    validate_weather_observation,
    validate_disaster_record,
)

from .change_detection import (
    detect_weather_changes,
    compare_weather_discrepancy,
    track_disaster_lifecycle,
)

from .risk_engine import (
    interpret_travel_risk,
    SAFE_ALTERNATIVE_HUBS,
)

__all__ = [
    "haversine_distance_km",
    "create_point",
    "get_proximity_category",
    "compute_impact_radius_km",
    "evaluate_event_proximity",
    "DEFAULT_DESTINATIONS",
    "parse_timestamp_iso",
    "validate_weather_observation",
    "validate_disaster_record",
    "detect_weather_changes",
    "compare_weather_discrepancy",
    "track_disaster_lifecycle",
    "interpret_travel_risk",
    "SAFE_ALTERNATIVE_HUBS",
]
