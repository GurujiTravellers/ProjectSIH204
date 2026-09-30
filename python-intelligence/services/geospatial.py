"""
Geospatial Proximity and Geographic Calculations for Travel_Guruji.
Utilizes exact spherical Haversine formula and Shapely geometric primitives.
Zero invented locations or synthetic events.
"""

import math
from typing import Dict, Any, List, Optional, Tuple
from shapely.geometry import Point
from models.disaster import DestinationPoint, ProximityAssessment

# Default Travel_Guruji Monitored Indian Destinations & Transit Hubs
DEFAULT_DESTINATIONS: Dict[str, Dict[str, Any]] = {
    # Himachal Pradesh
    "Shimla": {"lat": 31.1048, "lon": 77.1734, "state": "Himachal Pradesh", "corridor": "NH-5 Himalayan Expressway"},
    "Manali": {"lat": 32.2396, "lon": 77.1887, "state": "Himachal Pradesh", "corridor": "NH-3 Chandigarh-Manali Highway"},
    "Rohtang Pass": {"lat": 32.3716, "lon": 77.2466, "state": "Himachal Pradesh", "corridor": "Manali-Leh Highway (13,058 ft)"},
    "Kasol": {"lat": 32.0100, "lon": 77.3150, "state": "Himachal Pradesh", "corridor": "Bhuntar-Kasol-Manikaran Road"},
    "Chitkul": {"lat": 31.3533, "lon": 78.4354, "state": "Himachal Pradesh", "corridor": "Kinnaur Valley Indo-Tibet Border Road"},
    "Kalpa": {"lat": 31.5372, "lon": 78.2562, "state": "Himachal Pradesh", "corridor": "NH-5 Reckong Peo - Kalpa Link"},
    "Sissu": {"lat": 32.4820, "lon": 77.1245, "state": "Himachal Pradesh", "corridor": "Atal Tunnel North Portal / Lahaul Highway"},
    "Kaza": {"lat": 32.2276, "lon": 78.0710, "state": "Himachal Pradesh", "corridor": "NH-505 Spiti Valley Route"},
    "Chandratal Lake": {"lat": 32.4824, "lon": 77.6166, "state": "Himachal Pradesh", "corridor": "Batal-Chandratal Dirt Route (14,100 ft)"},

    # Uttarakhand
    "Haridwar": {"lat": 29.9457, "lon": 78.1642, "state": "Uttarakhand", "corridor": "NH-334 Delhi-Haridwar Highway"},
    "Rishikesh": {"lat": 30.0869, "lon": 78.2676, "state": "Uttarakhand", "corridor": "NH-7 All-Weather Badrinath Route"},
    "Dehradun": {"lat": 30.3165, "lon": 78.0322, "state": "Uttarakhand", "corridor": "NH-72 / Delhi-Dehradun Expressway"},
    "Mussoorie": {"lat": 30.4598, "lon": 78.0644, "state": "Uttarakhand", "corridor": "Dehradun-Mussoorie Hill Ghat Road"},

    # Jammu & Kashmir & Ladakh
    "Srinagar": {"lat": 34.0837, "lon": 74.7973, "state": "Jammu & Kashmir", "corridor": "NH-44 Banihal Tunnel Expressway"},
    "Gulmarg": {"lat": 34.0484, "lon": 74.3805, "state": "Jammu & Kashmir", "corridor": "Srinagar-Tangmarg-Gulmarg Route (8,690 ft)"},
    "Pahalgam": {"lat": 34.0161, "lon": 75.3150, "state": "Jammu & Kashmir", "corridor": "Anantnag-Pahalgam Lidder Valley Highway"},
    "Leh Ladakh": {"lat": 34.1526, "lon": 77.5771, "state": "Ladakh", "corridor": "Leh-Manali Highway & Zoji La Route"},
    "Leh": {"lat": 34.1526, "lon": 77.5771, "state": "Ladakh", "corridor": "Leh-Manali Highway & Khardung La Pass"},

    # West Bengal & Odisha
    "Kolkata": {"lat": 22.5726, "lon": 88.3639, "state": "West Bengal", "corridor": "NH-16 / NH-19 / Kona Expressway"},
    "Darjeeling": {"lat": 27.0410, "lon": 88.2663, "state": "West Bengal", "corridor": "Rohini Road / Hill Cart Road (NH-110)"},
    "Digha": {"lat": 21.6266, "lon": 87.5074, "state": "West Bengal", "corridor": "NH-116B Coastal Highway"},
    "Puri": {"lat": 19.8135, "lon": 85.8312, "state": "Odisha", "corridor": "NH-316 Bhubaneswar-Puri Highway"},
    "Bhubaneswar": {"lat": 20.2961, "lon": 85.8245, "state": "Odisha", "corridor": "NH-16 Golden Quadrilateral"},
    "Konark": {"lat": 19.8876, "lon": 86.0945, "state": "Odisha", "corridor": "Puri-Konark Marine Drive"},

    # Northeast (Meghalaya & Assam)
    "Shillong": {"lat": 25.5788, "lon": 91.8933, "state": "Meghalaya", "corridor": "NH-6 Guwahati-Shillong 4-Lane"},
    "Mawlynnong Village": {"lat": 25.2017, "lon": 91.9160, "state": "Meghalaya", "corridor": "Shillong-Pynursla-Mawlynnong Road"},
    "Dawki": {"lat": 25.1878, "lon": 92.0199, "state": "Meghalaya", "corridor": "NH-206 Indo-Bangladesh Border Highway"},
    "Guwahati": {"lat": 26.1445, "lon": 91.7362, "state": "Assam", "corridor": "NH-27 / Guwahati-Shillong Highway"},

    # Rajasthan & Western India
    "Jaipur": {"lat": 26.9124, "lon": 75.7873, "state": "Rajasthan", "corridor": "NH-48 Delhi-Jaipur Expressway"},
    "Jaisalmer": {"lat": 26.9157, "lon": 70.9083, "state": "Rajasthan", "corridor": "NH-11 Thar Desert Highway"},
    "Ajmer": {"lat": 26.4499, "lon": 74.6399, "state": "Rajasthan", "corridor": "NH-48 Jaipur-Ajmer Expressway"},
    "Udaipur": {"lat": 24.5854, "lon": 73.7125, "state": "Rajasthan", "corridor": "NH-48 Golden Quadrilateral & Aravalli Ghats"},
    "Goa": {"lat": 15.2993, "lon": 74.1240, "state": "Goa", "corridor": "NH-66 Coastal Link (Mumbai-Goa-Kochi)"},
    "Mumbai": {"lat": 19.0760, "lon": 72.8777, "state": "Maharashtra", "corridor": "Western Express Highway & Coastal Road"},
    "Delhi": {"lat": 28.6139, "lon": 77.2090, "state": "Delhi NCR", "corridor": "Eastern & Western Peripheral Expressways"},
    "Agra": {"lat": 27.1767, "lon": 78.0081, "state": "Uttar Pradesh", "corridor": "Yamuna Expressway / Agra-Lucknow Expressway"},
    "Varanasi": {"lat": 25.3176, "lon": 82.9739, "state": "Uttar Pradesh", "corridor": "NH-19 / Grand Trunk Road"},
    "Ooty": {"lat": 11.4102, "lon": 76.6950, "state": "Tamil Nadu", "corridor": "Nilgiri Mountain Ghat Road"},
    "Pondicherry": {"lat": 11.9416, "lon": 79.8083, "state": "Puducherry", "corridor": "East Coast Road (Scenic Coastal Highway)"},
    "Hampi": {"lat": 15.3350, "lon": 76.4600, "state": "Karnataka", "corridor": "NH-50 & Tungabhadra Heritage Ring Road"},
    "Andaman": {"lat": 11.6234, "lon": 92.7265, "state": "Andaman & Nicobar", "corridor": "Andaman Trunk Road (ATR) & Island Ferries"},
}


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes the great-circle distance between two geographic coordinates in kilometers.
    Uses spherical trigonometry with the Earth's mean radius of 6371.0 km.
    """
    r = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 2)


def create_point(lat: float, lon: float) -> Point:
    """Creates a Shapely geometry Point object (lon, lat order standard)."""
    return Point(lon, lat)


def get_proximity_category(distance_km: float) -> str:
    """
    Classifies distance into standard Travel_Guruji proximity zones:
    - DIRECT_IMPACT: < 25 km
    - NEARBY_WARNING: 25 - 100 km
    - REGIONAL_ADVISORY: 100 - 250 km
    - DISTANT_MONITORING: > 250 km
    """
    if distance_km < 25.0:
        return "DIRECT_IMPACT"
    if distance_km <= 100.0:
        return "NEARBY_WARNING"
    if distance_km <= 250.0:
        return "REGIONAL_ADVISORY"
    return "DISTANT_MONITORING"


def compute_impact_radius_km(disaster_type: str, magnitude_val: Optional[float] = None) -> float:
    """
    Computes empirical physical impact radius based on event type and magnitude.
    - Earthquake: M>=7 (250km), M>=6 (150km), M>=5 (80km), M>=4 (40km), else 20km
    - Cyclone: Major/Severe (250-350km), Standard (150km)
    - Flood/Landslide: (40-60km)
    """
    dtype = (disaster_type or "").lower()

    if "earthquake" in dtype or "seismic" in dtype:
        if magnitude_val is not None:
            if magnitude_val >= 7.0:
                return 250.0
            if magnitude_val >= 6.0:
                return 150.0
            if magnitude_val >= 5.0:
                return 80.0
            if magnitude_val >= 4.0:
                return 40.0
        return 25.0

    if "cyclone" in dtype or "hurricane" in dtype or "typhoon" in dtype:
        return 250.0

    if "flood" in dtype:
        return 60.0

    if "landslide" in dtype:
        return 30.0

    if "wildfire" in dtype or "fire" in dtype:
        return 35.0

    return 50.0


def evaluate_event_proximity(
    event_lat: float,
    event_lon: float,
    disaster_type: str,
    magnitude_val: Optional[float] = None,
    destinations: Optional[List[Dict[str, Any]]] = None,
) -> Tuple[Optional[str], float, str, float, bool, List[ProximityAssessment]]:
    """
    Evaluates proximity between a real event and monitored destinations.
    Returns:
      (nearest_dest_name, nearest_dist_km, nearest_category, impact_radius_km, within_impact, affected_list)
    """
    dest_list: Dict[str, Dict[str, Any]] = {}
    if destinations:
        for d in destinations:
            name = d.get("name")
            lat = d.get("latitude") or d.get("lat")
            lon = d.get("longitude") or d.get("lon")
            if name and lat is not None and lon is not None:
                dest_list[name] = {"lat": float(lat), "lon": float(lon), "state": d.get("state", ""), "corridor": d.get("corridor", "")}
    if not dest_list:
        dest_list = DEFAULT_DESTINATIONS

    impact_radius = compute_impact_radius_km(disaster_type, magnitude_val)

    nearest_name: Optional[str] = None
    min_dist: float = float("inf")
    affected_list: List[ProximityAssessment] = []

    for name, loc in dest_list.items():
        dist = haversine_distance_km(event_lat, event_lon, loc["lat"], loc["lon"])
        category = get_proximity_category(dist)
        within = dist <= impact_radius

        assessment = ProximityAssessment(
            destination=name,
            distanceKm=dist,
            proximityCategory=category,
            impactRadiusKm=impact_radius,
            withinImpactRadius=within,
        )

        if dist < min_dist:
            min_dist = dist
            nearest_name = name

        # Keep record of affected or regionally relevant destinations (<= 250km)
        if dist <= 250.0 or within:
            affected_list.append(assessment)

    # Sort affected by closest first
    affected_list.sort(key=lambda x: x.distanceKm)

    nearest_category = get_proximity_category(min_dist) if nearest_name else "DISTANT_MONITORING"
    within_impact = min_dist <= impact_radius if nearest_name else False

    return nearest_name, (round(min_dist, 2) if min_dist != float("inf") else 0.0), nearest_category, impact_radius, within_impact, affected_list
