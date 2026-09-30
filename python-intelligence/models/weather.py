"""
Weather Data Models for Travel_Guruji Python Intelligence Layer.
Strictly authentic API data types with zero hardcoded values.
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class WeatherObservation(BaseModel):
    """Raw observation originating exclusively from external weather APIs."""
    temperature: Optional[float] = Field(None, description="Actual temperature in Celsius from API")
    apparentTemperature: Optional[float] = Field(None, description="Feels-like temperature from API")
    humidity: Optional[float] = Field(None, description="Relative humidity percentage from API")
    windSpeed: Optional[float] = Field(None, description="Wind speed in km/h from API")
    windDirection: Optional[float] = Field(None, description="Wind direction degrees from API")
    windCompass: Optional[str] = Field("", description="Compass heading e.g. NE, SSW")
    windGusts: Optional[float] = Field(None, description="Wind gusts in km/h from API")
    pressure: Optional[float] = Field(None, description="Atmospheric pressure in hPa from API")
    visibility: Optional[float] = Field(None, description="Visibility in km from API")
    precipitation: Optional[float] = Field(None, description="Precipitation rate mm/h from API")
    rain: Optional[float] = Field(None, description="Rain amount from API")
    weatherCode: Optional[int] = Field(None, description="WMO or Tomorrow.io weather code from API")
    condition: Optional[str] = Field(None, description="Descriptive weather condition")
    icon: Optional[str] = Field("🌤️", description="UI icon representation")
    source: str = Field(..., description="External source: 'Tomorrow.io' or 'Open-Meteo'")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp of observation")
    latitude: float = Field(..., description="Geographic latitude")
    longitude: float = Field(..., description="Geographic longitude")
    destination: Optional[str] = Field(None, description="Target destination name")


class WeatherValidationRequest(BaseModel):
    """Request payload for validating a live weather observation."""
    current: WeatherObservation
    maxStaleMinutes: Optional[int] = Field(60, description="Max acceptable data age before considered stale")


class WeatherValidationResponse(BaseModel):
    """Validation response - validates without ever inventing missing values."""
    valid: bool
    source: str
    destination: Optional[str] = None
    validatedData: Optional[Dict[str, Any]] = None
    errors: List[str] = []
    warnings: List[str] = []
    isStale: bool = False
    dataAgeMinutes: Optional[float] = None
    qualityScore: float = 1.0


class WeatherChangeRequest(BaseModel):
    """Request payload for detecting weather changes between polling cycles."""
    destination: str
    previous: Optional[Dict[str, Any]] = None
    current: Dict[str, Any]


class WeatherChangeResponse(BaseModel):
    """Change detection results comparing previous and current authentic API data."""
    destination: str
    changed: bool
    changes: Dict[str, Any] = {}
    significant: bool = False
    summary: str = ""
    timestamp: str
    temperatureDelta: Optional[float] = None
    trend: Optional[str] = None
    windSpike: Optional[bool] = False
    steepDrop: Optional[bool] = False
    heavyRainOnset: Optional[bool] = False
    conditionChange: Optional[str] = None


class WeatherDiscrepancyRequest(BaseModel):
    """Request to compare primary (Tomorrow.io) vs secondary (Open-Meteo) for telemetry diagnostics."""
    destination: str
    primary: Dict[str, Any]
    secondary: Dict[str, Any]


class WeatherDiscrepancyResponse(BaseModel):
    """Diagnostic comparison between primary and secondary weather sources."""
    destination: str
    primary_source: str = "Tomorrow.io"
    primary_temperature: Optional[float] = None
    secondary_source: str = "Open-Meteo"
    secondary_temperature: Optional[float] = None
    temperature_difference: Optional[float] = None
    apparent_temperature_difference: Optional[float] = None
    humidity_difference: Optional[float] = None
    wind_difference: Optional[float] = None
    precipitation_difference: Optional[float] = None
    condition_match: bool = True
    comparable: bool = True
    status: str = "COMPARED"
    discrepancy_level: str = "NORMAL"
    timestamp_difference_minutes: Optional[float] = None
    primary_timestamp: Optional[str] = None
    secondary_timestamp: Optional[str] = None
    note: str = "Diagnostic discrepancy comparison only. Authoritative primary source is never modified or averaged."
