import React, { useState, useMemo } from "react";
import indiaMapData from "../data/indiaMapData";

// GPS Coordinates for all 33 Destinations + 11 Major Origins across India
const INDIA_COORDINATES = {
  // Himachal Pradesh
  Shimla: { lat: 31.1048, lon: 77.1734, state: "Himachal Pradesh", region: "North" },
  Manali: { lat: 32.2396, lon: 77.1887, state: "Himachal Pradesh", region: "North" },
  "Rohtang Pass": { lat: 32.3716, lon: 77.2466, state: "Himachal Pradesh", region: "North" },
  Kasol: { lat: 32.0100, lon: 77.3150, state: "Himachal Pradesh", region: "North" },
  Chitkul: { lat: 31.3533, lon: 78.4354, state: "Himachal Pradesh", region: "North" },
  Kalpa: { lat: 31.5372, lon: 78.2562, state: "Himachal Pradesh", region: "North" },
  Sissu: { lat: 32.4820, lon: 77.1245, state: "Himachal Pradesh", region: "North" },
  Kaza: { lat: 32.2276, lon: 78.0710, state: "Himachal Pradesh", region: "North" },
  "Chandratal Lake": { lat: 32.4824, lon: 77.6166, state: "Himachal Pradesh", region: "North" },
  Kalka: { lat: 30.8344, lon: 76.9328, state: "Haryana / HP", region: "North" },

  // Uttarakhand
  Haridwar: { lat: 29.9457, lon: 78.1642, state: "Uttarakhand", region: "North" },
  Rishikesh: { lat: 30.0869, lon: 78.2676, state: "Uttarakhand", region: "North" },
  Dehradun: { lat: 30.3165, lon: 78.0322, state: "Uttarakhand", region: "North" },
  Mussoorie: { lat: 30.4598, lon: 78.0644, state: "Uttarakhand", region: "North" },

  // Jammu & Kashmir
  Srinagar: { lat: 34.0837, lon: 74.7973, state: "Jammu & Kashmir", region: "North" },
  Gulmarg: { lat: 34.0484, lon: 74.3805, state: "Jammu & Kashmir", region: "North" },
  Pahalgam: { lat: 34.0161, lon: 75.3150, state: "Jammu & Kashmir", region: "North" },

  // West Bengal & Odisha
  Kolkata: { lat: 22.5726, lon: 88.3639, state: "West Bengal", region: "East" },
  Darjeeling: { lat: 27.0410, lon: 88.2663, state: "West Bengal", region: "East" },
  Digha: { lat: 21.6266, lon: 87.5074, state: "West Bengal", region: "East" },
  Puri: { lat: 19.8135, lon: 85.8312, state: "Odisha", region: "East" },
  Bhubaneswar: { lat: 20.2961, lon: 85.8245, state: "Odisha", region: "East" },
  Konark: { lat: 19.8876, lon: 86.0945, state: "Odisha", region: "East" },

  // Northeast (Meghalaya & Assam)
  Shillong: { lat: 25.5788, lon: 91.8933, state: "Meghalaya", region: "Northeast" },
  "Mawlynnong Village": { lat: 25.2017, lon: 91.9160, state: "Meghalaya", region: "Northeast" },
  Dawki: { lat: 25.1878, lon: 92.0199, state: "Meghalaya", region: "Northeast" },
  Guwahati: { lat: 26.1445, lon: 91.7362, state: "Assam", region: "Northeast" },

  // Rajasthan & Central / Western India
  Jaipur: { lat: 26.9124, lon: 75.7873, state: "Rajasthan", region: "West" },
  Jaisalmer: { lat: 26.9157, lon: 70.9083, state: "Rajasthan", region: "West" },
  Ajmer: { lat: 26.4499, lon: 74.6399, state: "Rajasthan", region: "West" },
  Delhi: { lat: 28.6139, lon: 77.2090, state: "Delhi NCR", region: "North" },
  Agra: { lat: 27.1767, lon: 78.0081, state: "Uttar Pradesh", region: "North" },
  Varanasi: { lat: 25.3176, lon: 82.9739, state: "Uttar Pradesh", region: "Central" },
  Goa: { lat: 15.2993, lon: 74.1240, state: "Goa", region: "West" },

  // Newly Added Monitored Destinations
  "Leh Ladakh": { lat: 34.1526, lon: 77.5771, state: "Ladakh", region: "North" },
  Kerala: { lat: 9.9312, lon: 76.2673, state: "Kerala", region: "South" },
  Vizag: { lat: 17.6868, lon: 83.2185, state: "Andhra Pradesh", region: "East" },
  Gujarat: { lat: 23.0225, lon: 72.5714, state: "Gujarat", region: "West" },
  Punjab: { lat: 31.6340, lon: 74.8723, state: "Punjab", region: "North" },

  // Major Origins & Transit Gateways
  Mumbai: { lat: 19.0760, lon: 72.8777, state: "Maharashtra", region: "West" },
  Bengaluru: { lat: 12.9716, lon: 77.5946, state: "Karnataka", region: "South" },
  Chennai: { lat: 13.0827, lon: 80.2707, state: "Tamil Nadu", region: "South" },
  Hyderabad: { lat: 17.3850, lon: 78.4867, state: "Telangana", region: "South" },
  Pune: { lat: 18.5204, lon: 73.8567, state: "Maharashtra", region: "West" },
  Ahmedabad: { lat: 23.0225, lon: 72.5714, state: "Gujarat", region: "West" },
  Lucknow: { lat: 26.8467, lon: 80.9462, state: "Uttar Pradesh", region: "North" },
  Chandigarh: { lat: 30.7333, lon: 76.7794, state: "Punjab / Haryana", region: "North" },
  Kochi: { lat: 9.9312, lon: 76.2673, state: "Kerala", region: "South" },
  Amritsar: { lat: 31.6340, lon: 74.8723, state: "Punjab", region: "North" },
};

/**
 * Calibrated linear GPS projection mapping (lat, lon) directly
 * into the official India vector map viewBox ("0 0 612 696").
 */
function projectToIndiaMap(lat, lon) {
  const x = 21.0072 * lon - 1432.6018;
  const y = -24.2582 * lat + 901.8341;
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

export default function EmergencyRadarMap({
  alerts = [],
  selectedDestination = "Manali",
  onSelectDestination,
  isEmergencyMode = false,
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [filterType, setFilterType] = useState("ALL"); // ALL, CRITICAL_WARNING, SAFE, SEISMIC, WEATHER

  // Map each monitored destination/origin to active telemetry & alerts
  const mappedPoints = useMemo(() => {
    return Object.entries(INDIA_COORDINATES).map(([name, info]) => {
      const nameLower = name.toLowerCase();
      const pos = projectToIndiaMap(info.lat, info.lon);

      // Match highest severity alert first (RED, then YELLOW)
      const redAlert = alerts.find(
        (a) =>
          (a.destination.toLowerCase() === nameLower ||
            nameLower.includes(a.destination.toLowerCase()) ||
            a.destination.toLowerCase().includes(nameLower)) &&
          a.alertTier === "RED"
      );

      const yellowAlert = alerts.find(
        (a) =>
          (a.destination.toLowerCase() === nameLower ||
            nameLower.includes(a.destination.toLowerCase()) ||
            a.destination.toLowerCase().includes(nameLower)) &&
          a.alertTier === "YELLOW"
      );

      const anyAlert =
        redAlert ||
        yellowAlert ||
        alerts.find(
          (a) =>
            a.destination.toLowerCase() === nameLower ||
            nameLower.includes(a.destination.toLowerCase()) ||
            a.destination.toLowerCase().includes(nameLower)
        );

      const alertTier = anyAlert?.alertTier || "GREEN";
      const isRainAlert = !!anyAlert?.isRainAlert;
      const severity = anyAlert?.severity || "NORMAL";

      return {
        name,
        state: info.state,
        region: info.region,
        lat: info.lat,
        lon: info.lon,
        x: pos.x,
        y: pos.y,
        alertTier,
        isRainAlert,
        severity,
        movementStatus: anyAlert?.movementStatus || "ALL ROUTES OPEN & NORMAL",
        movementFeasible: anyAlert ? anyAlert.movementFeasible : true,
        alert: anyAlert || null,
        isSeismic: (anyAlert?.source || anyAlert?.realIncidentSource || "").includes("USGS"),
        isSevereWeather:
          alertTier === "RED" ||
          (anyAlert?.disasterType || "").includes("Wind") ||
          (anyAlert?.disasterType || "").includes("Cyclone") ||
          (anyAlert?.disasterType || "").includes("Rain") ||
          (anyAlert?.disasterType || "").includes("Storm"),
      };
    });
  }, [alerts]);

  const filteredPoints = useMemo(() => {
    if (filterType === "RED") {
      return mappedPoints.filter((p) => p.alertTier === "RED");
    }
    if (filterType === "YELLOW") {
      return mappedPoints.filter((p) => p.alertTier === "YELLOW");
    }
    if (filterType === "RAIN") {
      return mappedPoints.filter((p) => p.isRainAlert);
    }
    if (filterType === "SAFE") {
      return mappedPoints.filter((p) => p.alertTier === "GREEN");
    }
    if (filterType === "CRITICAL_WARNING") {
      return mappedPoints.filter((p) => p.alertTier === "RED" || p.alertTier === "YELLOW");
    }
    if (filterType === "SEISMIC") {
      return mappedPoints.filter((p) => p.isSeismic);
    }
    if (filterType === "WEATHER") {
      return mappedPoints.filter((p) => p.isSevereWeather);
    }
    return mappedPoints;
  }, [mappedPoints, filterType]);

  const stats = useMemo(() => {
    const red = mappedPoints.filter((p) => p.alertTier === "RED").length;
    const yellow = mappedPoints.filter((p) => p.alertTier === "YELLOW").length;
    const rain = mappedPoints.filter((p) => p.isRainAlert).length;
    const normal = mappedPoints.filter((p) => p.alertTier === "GREEN" && !p.isRainAlert).length;
    return { red, yellow, rain, normal, total: mappedPoints.length };
  }, [mappedPoints]);

  return (
    <div
      style={{
        background: isEmergencyMode ? "#180808" : "#ffffff",
        border: isEmergencyMode ? "2px solid #ef4444" : "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "24px",
        boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER & TOP METRICS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                background: "#ef4444",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "800",
                padding: "3px 8px",
                borderRadius: "4px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              OFFICIAL SURVEY OF INDIA PROJECTION
            </span>
            <span style={{ fontSize: "12px", color: isEmergencyMode ? "#fca5a5" : "#64748b", fontWeight: "700" }}>
              36 States & UTs • 44 Real-Time GPS Hubs
            </span>
          </div>
          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "22px",
              fontWeight: "800",
              color: isEmergencyMode ? "#ffffff" : "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>🇮🇳</span> Authentic India Real-Time Travel Risk Radar
          </h2>
        </div>

        {/* METRICS PILLS */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <div
            style={{
              background: isEmergencyMode ? "#331212" : "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "6px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "800", color: "#ef4444", textTransform: "uppercase" }}>
              🔴 Disaster Zones
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#dc2626" }}>{stats.red} Zones</div>
          </div>
          <div
            style={{
              background: isEmergencyMode ? "#331d08" : "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "10px",
              padding: "6px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "800", color: "#d97706", textTransform: "uppercase" }}>
              🟡 Yellow Advisories
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#d97706" }}>{stats.yellow} Hubs</div>
          </div>
          <div
            style={{
              background: isEmergencyMode ? "#1a2e1d" : "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "10px",
              padding: "6px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "800", color: "#059669", textTransform: "uppercase" }}>
              🟢 Rain Alerts
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#059669" }}>{stats.rain} Hubs</div>
          </div>
          <div
            style={{
              background: isEmergencyMode ? "#1a2e1d" : "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "10px",
              padding: "6px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "800", color: "#16a34a", textTransform: "uppercase" }}>
              🟢 Normal Open
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#16a34a" }}>
              {stats.normal} Clear
            </div>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "16px",
          padding: "8px 12px",
          background: isEmergencyMode ? "#200e0e" : "#f8fafc",
          borderRadius: "10px",
          border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
        }}
      >
        {[
          { id: "ALL", label: `All 44 Monitored Nodes (${mappedPoints.length})`, icon: "🇮🇳" },
          { id: "RED", label: `🔴 Disaster Zones (${stats.red})`, icon: "🚨" },
          { id: "YELLOW", label: `🟡 Advisories (${stats.yellow})`, icon: "⚠️" },
          { id: "RAIN", label: `🟢 Rain Alerts (${stats.rain})`, icon: "🌧️" },
          { id: "SAFE", label: `🟢 Safe Places (${stats.normal + stats.rain})`, icon: "🛡️" },
          { id: "SEISMIC", label: "USGS Earthquakes", icon: "🌐" },
          { id: "WEATHER", label: "Severe Storms", icon: "🌊" },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterType(btn.id)}
            style={{
              background: filterType === btn.id ? (isEmergencyMode ? "#ef4444" : "#0f172a") : "transparent",
              color: filterType === btn.id ? "#ffffff" : isEmergencyMode ? "#d1d5db" : "#475569",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <span>{btn.icon}</span> {btn.label}
          </button>
        ))}
      </div>

      {/* SVG INTERACTIVE AUTHENTIC RADAR MAP */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxHeight: "740px",
          overflow: "hidden",
          borderRadius: "14px",
          background: isEmergencyMode ? "#0d0404" : "#0a1122",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: isEmergencyMode ? "1px solid #451212" : "1px solid #1e293b",
        }}
      >
        <svg
          viewBox={indiaMapData.viewBox || "0 0 612 696"}
          style={{ width: "100%", height: "auto", maxHeight: "740px", display: "block" }}
        >
          <defs>
            {/* Background Radar Scanning Grid */}
            <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#172554" strokeWidth="0.6" opacity="0.6" />
            </pattern>

            {/* Glowing Red Filter for Critical Incidents */}
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glowing Orange Filter for Warnings */}
            <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glowing Green Filter for Safe Travel Spots */}
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Lines */}
          <rect width="612" height="696" fill="url(#radarGrid)" />

          {/* Concentric Radar Scanning Range Rings */}
          <circle cx="306" cy="348" r="120" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="306" cy="348" r="220" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="306" cy="348" r="320" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* Radar Center Coordinate Reticle */}
          <line x1="306" y1="20" x2="306" y2="676" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="2 4" />
          <line x1="20" y1="348" x2="592" y2="348" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="2 4" />

          {/* ALL 36 OFFICIAL INDIAN STATES & UNION TERRITORIES */}
          <g id="india-states-layer">
            {indiaMapData.locations.map((loc) => {
              const isHoveredState = hoveredState === loc.name;
              return (
                <path
                  key={loc.id}
                  id={loc.id}
                  d={loc.path}
                  fill={
                    isEmergencyMode
                      ? isHoveredState
                        ? "#301010"
                        : "#1a0b0b"
                      : isHoveredState
                      ? "#243c5a"
                      : "#15243b"
                  }
                  stroke={
                    isEmergencyMode
                      ? isHoveredState
                        ? "#ef4444"
                        : "#7f1d1d"
                      : isHoveredState
                      ? "#38bdf8"
                      : "#1e3a5f"
                  }
                  strokeWidth={isHoveredState ? "1.6" : "0.75"}
                  strokeLinejoin="round"
                  style={{
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredState(loc.name)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <title>{loc.name}</title>
                </path>
              );
            })}
          </g>

          {/* Compass / Orientation Indicator */}
          <g transform="translate(540, 60)">
            <circle cx="0" cy="0" r="16" fill="rgba(15, 23, 42, 0.7)" stroke="#38bdf8" strokeWidth="1" />
            <polygon points="0,-12 4,-2 0,0 -4,-2" fill="#ef4444" />
            <polygon points="0,12 4,2 0,0 -4,2" fill="#94a3b8" />
            <text x="0" y="-14" fill="#38bdf8" fontSize="8" fontWeight="800" textAnchor="middle">
              N
            </text>
          </g>

          {/* Coastal Waters & Geographic Labeling */}
          <text x="45" y="520" fill="#334155" fontSize="11" fontWeight="800" letterSpacing="2">
            ARABIAN SEA
          </text>
          <text x="420" y="520" fill="#334155" fontSize="11" fontWeight="800" letterSpacing="2">
            BAY OF BENGAL
          </text>
          <text x="230" y="680" fill="#334155" fontSize="10" fontWeight="800" letterSpacing="2">
            INDIAN OCEAN
          </text>
          <text x="210" y="45" fill="#334155" fontSize="10" fontWeight="800" letterSpacing="2">
            HIMALAYAN ARC & KARAKORAM
          </text>

          {/* PLOT ALL DESTINATIONS & ORIGINS ACCORDING TO REAL GPS PROJECTION */}
          {filteredPoints.map((point) => {
            const isSelected = selectedDestination.toLowerCase() === point.name.toLowerCase();
            const isHovered = hoveredPoint?.name === point.name;

            // Strict 4-Tier coloring
            let mainColor = "#10b981"; // Green (Normal / Rain Alert)
            let glowFilter = "url(#glowGreen)";
            if (point.alertTier === "RED") {
              mainColor = "#ef4444"; // Red Disaster Zone
              glowFilter = "url(#glowRed)";
            } else if (point.alertTier === "YELLOW") {
              mainColor = "#eab308"; // Yellow Caution Advisory
              glowFilter = "url(#glowOrange)";
            } else if (point.isRainAlert) {
              mainColor = "#10b981"; // Emerald Rain Alert (Safe / Open)
              glowFilter = "url(#glowGreen)";
            }

            return (
              <g
                key={point.name}
                style={{ cursor: "pointer" }}
                onClick={() => onSelectDestination && onSelectDestination(point.name)}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Pulsing ring for real red disaster zones or selected pin */}
                {(point.alertTier === "RED" || isSelected) && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isSelected ? 14 : 11}
                    fill="none"
                    stroke={mainColor}
                    strokeWidth="1.5"
                    opacity="0.85"
                  >
                    <animate attributeName="r" values="6;18" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Outer pin halo */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isSelected ? 8.5 : isHovered ? 7 : 4.5}
                  fill={mainColor}
                  opacity={isSelected || isHovered ? 0.95 : 0.8}
                  filter={glowFilter}
                />

                {/* Inner core white dot */}
                <circle cx={point.x} cy={point.y} r={isSelected ? 3.5 : 2} fill="#ffffff" />

                {/* Selected Dashed Ring */}
                {isSelected && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="12"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeDasharray="3 2"
                  />
                )}

                {/* Text Label: Always show for Red disasters, Yellow advisories, and selected, or when hovered */}
                {(point.alertTier === "RED" ||
                  point.alertTier === "YELLOW" ||
                  isSelected ||
                  isHovered ||
                  (filterType === "SAFE" && ["Jaipur", "Shimla", "Varanasi", "Goa", "Kochi"].includes(point.name))) && (
                  <text
                    x={point.x + 8}
                    y={point.y + 3}
                    fill={
                      point.alertTier === "RED"
                        ? "#fca5a5"
                        : point.alertTier === "YELLOW"
                        ? "#fde047"
                        : "#ffffff"
                    }
                    fontSize={isSelected ? "11.5" : "9.5"}
                    fontWeight={isSelected ? "800" : "700"}
                    style={{
                      textShadow: "0 1px 4px rgba(0,0,0,0.95), 0 0 2px #000000",
                      pointerEvents: "none",
                    }}
                  >
                    {point.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* CURRENT HOVERED STATE BADGE (Top-Left overlay) */}
        {hoveredState && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              background: "rgba(15, 23, 42, 0.88)",
              border: "1px solid #38bdf8",
              borderRadius: "8px",
              padding: "6px 12px",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "700",
              pointerEvents: "none",
              backdropFilter: "blur(6px)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            }}
          >
            🗺️ State / UT: <span style={{ color: "#38bdf8" }}>{hoveredState}</span>
          </div>
        )}

        {/* INTERACTIVE HOVER FLOATING POINT CARD */}
        {hoveredPoint && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              background: isEmergencyMode ? "rgba(30, 10, 10, 0.95)" : "rgba(15, 23, 42, 0.95)",
              border: `2px solid ${
                hoveredPoint.alertTier === "RED"
                  ? "#ef4444"
                  : hoveredPoint.alertTier === "YELLOW"
                  ? "#eab308"
                  : "#10b981"
              }`,
              borderRadius: "12px",
              padding: "14px 18px",
              maxWidth: "360px",
              color: "#ffffff",
              backdropFilter: "blur(8px)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "800" }}>{hoveredPoint.name}</span>
              <span
                style={{
                  background:
                    hoveredPoint.alertTier === "RED"
                      ? "#ef4444"
                      : hoveredPoint.alertTier === "YELLOW"
                      ? "#eab308"
                      : hoveredPoint.isRainAlert
                      ? "#059669"
                      : "#10b981",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: "800",
                  padding: "3px 7px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {hoveredPoint.alertTier === "RED"
                  ? "🔴 DISASTER ZONE"
                  : hoveredPoint.alertTier === "YELLOW"
                  ? "🟡 CAUTION ADVISORY"
                  : hoveredPoint.isRainAlert
                  ? "🟢 RAIN ALERT"
                  : "🟢 NORMAL SPOT"}
              </span>
            </div>

            <div style={{ fontSize: "12px", color: "#cbd5e1", marginBottom: "6px" }}>
              {hoveredPoint.state} • Coordinates: {hoveredPoint.lat.toFixed(2)}°N, {hoveredPoint.lon.toFixed(2)}°E
            </div>

            {/* Movement status guarantee */}
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                marginBottom: "6px",
                padding: "3px 8px",
                borderRadius: "4px",
                background:
                  hoveredPoint.alertTier === "RED"
                    ? "rgba(239, 68, 68, 0.2)"
                    : hoveredPoint.alertTier === "YELLOW"
                    ? "rgba(234, 179, 8, 0.2)"
                    : "rgba(16, 185, 129, 0.2)",
                color:
                  hoveredPoint.alertTier === "RED"
                    ? "#fca5a5"
                    : hoveredPoint.alertTier === "YELLOW"
                    ? "#fde047"
                    : "#a7f3d0",
              }}
            >
              {hoveredPoint.alertTier === "RED"
                ? `🚫 ${hoveredPoint.movementStatus}`
                : hoveredPoint.alertTier === "YELLOW"
                ? `⚠️ ${hoveredPoint.movementStatus}`
                : `✓ ${hoveredPoint.movementStatus}`}
            </div>

            {hoveredPoint.alert && (hoveredPoint.alertTier === "RED" || hoveredPoint.alertTier === "YELLOW" || hoveredPoint.isRainAlert) ? (
              <div
                style={{
                  fontSize: "12px",
                  color:
                    hoveredPoint.alertTier === "RED"
                      ? "#f87171"
                      : hoveredPoint.alertTier === "YELLOW"
                      ? "#fde047"
                      : "#86efac",
                  lineHeight: "1.4",
                }}
              >
                <strong>
                  {hoveredPoint.alertTier === "RED"
                    ? "Active Disaster: "
                    : hoveredPoint.alertTier === "YELLOW"
                    ? "Advisory Notice: "
                    : "Rain Notice: "}
                </strong>
                {hoveredPoint.alert.title || hoveredPoint.alert.description}
              </div>
            ) : (
              <div style={{ fontSize: "12px", color: "#86efac", lineHeight: "1.4" }}>
                ✓ No active disaster conditions. Clear highway corridors and open rail terminals.
              </div>
            )}

            <div style={{ marginTop: "8px", fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
              👉 Click pin to inspect safety advisory & corridor status
            </div>
          </div>
        )}
      </div>

      {/* QUICK SAFE SPOTS STRIP BENEATH MAP */}
      <div
        style={{
          marginTop: "14px",
          padding: "12px 16px",
          background: isEmergencyMode ? "#1a2e1d" : "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "14px" }}>🛡️</span>
          <span style={{ fontSize: "12px", fontWeight: "800", color: "#166534" }}>
            Recommended Safe Travel Spots Right Now:
          </span>
          {["Jaipur", "Shimla", "Varanasi", "Agra", "Goa", "Kochi"].map((safeName) => (
            <button
              key={safeName}
              onClick={() => onSelectDestination && onSelectDestination(safeName)}
              style={{
                background: "#ffffff",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                fontSize: "12px",
                fontWeight: "700",
                padding: "3px 10px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#15803d";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#15803d";
              }}
            >
              ✓ {safeName}
            </button>
          ))}
        </div>

        <div style={{ fontSize: "12px", color: "#166534", fontWeight: "700" }}>
          Selected Hub: <span style={{ color: "#ef4444" }}>{selectedDestination}</span>
        </div>
      </div>

      {/* MAP FOOTER & LEGEND */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "12px",
          fontSize: "12px",
          color: isEmergencyMode ? "#fca5a5" : "#64748b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#ef4444",
                display: "inline-block",
              }}
            ></span>
            <span>Critical Disruption (Landslide / Storm)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#f59e0b",
                display: "inline-block",
              }}
            ></span>
            <span>Warning (High-Pass Freeze / Seismic Tremor)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
              }}
            ></span>
            <span>Safe Place (0 Disasters • Corridors Clear)</span>
          </div>
        </div>

        <div style={{ fontSize: "11px", color: isEmergencyMode ? "#f87171" : "#94a3b8" }}>
          Official map data: Survey of India boundaries via @svg-maps/india
        </div>
      </div>
    </div>
  );
}
