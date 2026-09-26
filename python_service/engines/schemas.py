"""
Data Status Taxonomy & Validation Schemas for Travel_Guruji Intelligence Engine.

Strictly enforces data provenance:
- LIVE: Sourced from active real-time API (e.g. Open-Meteo live weather within 14 days)
- VERIFIED: Sourced from confirmed transaction, booking, or verified user input
- DATABASE: Sourced from verified local database (destinations, hotels, attractions)
- ESTIMATED: Algorithmic projection based on standardized benchmarks
- STALE: Cached data exceeding freshness TTL
- UNAVAILABLE: Live data beyond reliable range or unreachable
- DEMO/FALLBACK: Local deterministic fallback used when service is disconnected
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict


class DataStatus(str, Enum):
    LIVE = "LIVE"
    VERIFIED = "VERIFIED"
    DATABASE = "DATABASE"
    ESTIMATED = "ESTIMATED"
    STALE = "STALE"
    UNAVAILABLE = "UNAVAILABLE"
    DEMO_FALLBACK = "DEMO/FALLBACK"


def get_utc_now_iso() -> str:
    """Return current UTC timestamp in ISO 8601 format."""
    return datetime.now(timezone.utc).isoformat()


def build_provenance_meta(
    data_source: str,
    data_status: DataStatus,
    confidence_score: float = 1.0,
    note: str = "",
) -> Dict[str, Any]:
    """Construct a standardized provenance audit metadata block."""
    return {
        "dataSource": data_source,
        "dataStatus": data_status.value,
        "lastUpdated": get_utc_now_iso(),
        "confidenceScore": round(max(0.0, min(1.0, confidence_score)), 2),
        "note": note,
    }

