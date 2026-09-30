"""
Disaster and Risk Data Models for Travel_Guruji Python Intelligence Layer.
Strictly authentic API data types with zero invented values.
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class DisasterCoordinates(BaseModel):
    lat: float
    lon: float
    depthKm: Optional[float] = None


class DisasterEvent(BaseModel):
    """Authentic disaster record originating exclusively from external APIs."""
    id: str = Field(..., description="External event identifier e.g. USGS-us7000xxxx, GDACS-12345")
    source: str = Field(..., description="External source: USGS, GDACS, NASA EONET, IMD")
    disasterType: str = Field(..., description="Earthquake, Cyclone, Flood, Landslide, Storm")
    title: str = Field(..., description="Official event title or header")
    severity: Optional[str] = Field("NORMAL", description="Severity grade from provider or normalized")
    magnitude: Optional[str] = Field(None, description="Formatted magnitude if applicable e.g. M 5.2")
    magnitudeValue: Optional[float] = Field(None, description="Numeric magnitude float if available")
    depthKm: Optional[float] = Field(None, description="Depth in km for seismic events")
    latitude: Optional[float] = Field(None, description="Epicenter/center latitude")
    longitude: Optional[float] = Field(None, description="Epicenter/center longitude")
    coordinates: Optional[Dict[str, Any]] = Field(None, description="Raw coordinate map {lat, lon, depthKm}")
    issuedAt: Optional[str] = Field(None, description="ISO timestamp of issuance")
    validUntil: Optional[str] = Field(None, description="ISO timestamp of validity")
    rawAlertLevel: Optional[str] = Field(None, description="Raw alert tier from source e.g. Red, Orange, Green")
    description: Optional[str] = Field(None, description="Authentic description from source feed")
    url: Optional[str] = Field(None, description="Official link to feed event page")
    destination: Optional[str] = Field(None, description="Associated nearest destination if pre-tagged")


class DestinationPoint(BaseModel):
    """Monitored Travel_Guruji destination point for geospatial calculations."""
    name: str
    latitude: float
    longitude: float
    state: Optional[str] = ""
    corridor: Optional[str] = ""


class ProximityAssessment(BaseModel):
    """Proximity evaluation between a disaster event and a monitored destination."""
    destination: str
    distanceKm: float
    proximityCategory: str = Field(..., description="DIRECT_IMPACT (<25km), NEARBY_WARNING (25-100km), REGIONAL_ADVISORY (100-250km), DISTANT_MONITORING (>250km)")
    impactRadiusKm: float
    withinImpactRadius: bool


class DisasterEventAnalysis(BaseModel):
    """Detailed geospatial and lifecycle analysis of a real disaster event."""
    eventId: str
    source: str
    disasterType: str
    title: str
    lifecycle: str = Field(..., description="NEW_EVENT, UPDATED_EVENT, UNCHANGED, EXPIRED_EVENT")
    nearestDestination: Optional[str] = None
    nearestDistanceKm: Optional[float] = None
    proximityCategory: Optional[str] = None
    withinImpactRadius: bool = False
    impactRadiusKm: float = 0.0
    affectedDestinations: List[ProximityAssessment] = []
    sourceAttribution: str
    rawEvent: Dict[str, Any] = {}


class DisasterAnalysisRequest(BaseModel):
    """Request payload for analyzing a batch of real disaster events."""
    events: List[Dict[str, Any]] = Field(..., description="Authentic disaster records from USGS, GDACS, NASA, IMD")
    destinations: Optional[List[Dict[str, Any]]] = Field(None, description="Optional custom destination list; defaults to 33 Indian destinations")
    previousEvents: Optional[List[Dict[str, Any]]] = Field(None, description="Previous batch of events for lifecycle delta tracking")


class DisasterAnalysisResponse(BaseModel):
    """Geospatial proximity and lifecycle tracking output."""
    totalEventsReceived: int
    activeEvents: List[DisasterEventAnalysis] = []
    newEventsCount: int = 0
    updatedEventsCount: int = 0
    expiredEvents: List[str] = []
    timestamp: str


class RiskInterpretationRequest(BaseModel):
    """Payload to evaluate grounded travel risk for a destination given real weather and active events."""
    destination: str
    weather: Optional[Dict[str, Any]] = Field(None, description="Real weather observation from Tomorrow.io or Open-Meteo")
    activeDisasters: Optional[List[Dict[str, Any]]] = Field(default=[], description="Active authentic disaster events near or affecting destination")
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class RiskInterpretationResponse(BaseModel):
    """Grounded, explainable risk interpretation citing external data sources."""
    destination: str
    overallRiskLevel: str = Field(..., description="LOW, MODERATE, HIGH, CRITICAL")
    badgeLabel: str
    colorCode: str
    travelAdvisory: str
    movementStatus: str
    disclaimer: str = "TRAVEL_GURUJI RISK INTERPRETATION (Not an official government evacuation order)"
    contributingFactors: List[str] = []
    compoundHazards: List[str] = []
    sourceEvidence: List[str] = []
    safeAlternatives: Optional[str] = None
    timestamp: str
