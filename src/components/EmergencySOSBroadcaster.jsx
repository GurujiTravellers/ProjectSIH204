import React, { useState, useEffect } from "react";

export default function EmergencySOSBroadcaster({
  destination = "Manali",
  stateName = "Himachal Pradesh",
  activeAlert = null,
  isEmergencyMode = false,
}) {
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [copied, setCopied] = useState(false);
  const [customNote, setCustomNote] = useState("");

  // Auto-locate GPS on mount or destination change
  useEffect(() => {
    fetchCurrentGps();
  }, [destination]);

  const fetchCurrentGps = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser. Using destination coordinates.");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setGpsLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy || 20),
          isRealGps: true,
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn("GPS lookup denied or unavailable:", err.message);
        // Fallback to active alert coordinates or destination default
        const coords = activeAlert?.coordinates || { lat: 32.2396, lon: 77.1887 };
        setGpsLocation({
          lat: coords.lat,
          lon: coords.lon,
          accuracy: 100,
          isRealGps: false,
        });
        setLocationError("Device GPS off / permission denied. Using destination station coordinates.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const currentCoords = gpsLocation || {
    lat: activeAlert?.coordinates?.lat || 32.2396,
    lon: activeAlert?.coordinates?.lon || 77.1887,
    accuracy: 100,
    isRealGps: false,
  };

  const googleMapsUrl = `https://maps.google.com/?q=${currentCoords.lat.toFixed(5)},${currentCoords.lon.toFixed(5)}`;

  const sosMessage = `🚨 EMERGENCY SOS - STRANDED TRAVELER ALERT 🚨
I need immediate assistance!
Destination: ${destination} (${stateName})
Live GPS: ${currentCoords.lat.toFixed(5)}°N, ${currentCoords.lon.toFixed(5)}°E (Accuracy: ±${currentCoords.accuracy}m)
Google Maps Live Link: ${googleMapsUrl}
Current Incident: ${activeAlert ? activeAlert.title : "Disaster Disruption / Severe Weather Corridor"}
${customNote ? `Note from Traveler: "${customNote}"\n` : ""}
National Emergency SOS: Dial 112 | Disaster SDRF: 1070 | Ambulance: 108 | Tourist Helpline: 1363
Sent via Travel_Guruji Live Safety Radar`;

  const encodedMessage = encodeURIComponent(sosMessage);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  const smsUrl = `sms:?body=${encodedMessage}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sosMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      style={{
        background: isEmergencyMode ? "#2a0c0c" : "#ffffff",
        border: isEmergencyMode ? "2px solid #ef4444" : "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                background: "#dc2626",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "800",
                padding: "3px 8px",
                borderRadius: "4px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              1-CLICK DISTRESS BROADCASTER
            </span>
            <span style={{ fontSize: "12px", color: isEmergencyMode ? "#fca5a5" : "#64748b" }}>
              {isLocating ? "📡 Triangulating GPS Satellites..." : currentCoords.isRealGps ? "🛰️ Live Device GPS Locked" : "📍 Destination Coordinates Active"}
            </span>
          </div>
          <h3
            style={{
              margin: "4px 0 0",
              fontSize: "20px",
              fontWeight: "800",
              color: isEmergencyMode ? "#ffffff" : "#0f172a",
            }}
          >
            Emergency SOS Broadcast (WhatsApp / SMS / Police 112)
          </h3>
        </div>

        <button
          onClick={fetchCurrentGps}
          disabled={isLocating}
          style={{
            background: isEmergencyMode ? "#451212" : "#f1f5f9",
            color: isEmergencyMode ? "#ffffff" : "#334155",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isLocating ? "⏳ Locating..." : "🔄 Refresh My GPS"}
        </button>
      </div>

      {locationError && (
        <div
          style={{
            background: isEmergencyMode ? "#331d08" : "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "12px",
            color: "#d97706",
            marginBottom: "14px",
          }}
        >
          ⚠️ {locationError}
        </div>
      )}

      {/* GPS LIVE TELEMETRY BAR */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          padding: "12px 16px",
          background: isEmergencyMode ? "#1a0707" : "#f8fafc",
          borderRadius: "10px",
          border: isEmergencyMode ? "1px solid #4a1515" : "1px solid #e2e8f0",
          fontSize: "13px",
          marginBottom: "16px",
        }}
      >
        <div>
          <span style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>TARGET HUB</span>
          <div style={{ fontWeight: "800", color: isEmergencyMode ? "#ffffff" : "#0f172a" }}>
            {destination}, {stateName}
          </div>
        </div>
        <div>
          <span style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>GPS COORDINATES</span>
          <div style={{ fontWeight: "800", color: "#2563eb", fontFamily: "monospace" }}>
            {currentCoords.lat.toFixed(5)}°N, {currentCoords.lon.toFixed(5)}°E
          </div>
        </div>
        <div>
          <span style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>ESTIMATED ACCURACY</span>
          <div style={{ fontWeight: "800", color: currentCoords.isRealGps ? "#16a34a" : "#d97706" }}>
            {currentCoords.isRealGps ? `±${currentCoords.accuracy} meters (High Accuracy)` : "Regional Station Default"}
          </div>
        </div>
      </div>

      {/* OPTIONAL CUSTOM NOTE */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "700",
            marginBottom: "6px",
            color: isEmergencyMode ? "#fca5a5" : "#475569",
          }}
        >
          Add Custom Situation Note (Optional):
        </label>
        <input
          type="text"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="e.g. 'Stuck at hotel near Mall Road, 3 people with medical needs, power off'"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 14px",
            borderRadius: "8px",
            border: isEmergencyMode ? "1px solid #551c1c" : "1px solid #cbd5e1",
            background: isEmergencyMode ? "#1c0909" : "#ffffff",
            color: isEmergencyMode ? "#ffffff" : "#0f172a",
            fontSize: "13px",
          }}
        />
      </div>

      {/* BROADCAST BUTTONS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#25D366",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "800",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
          }}
        >
          💬 Send SOS via WhatsApp
        </a>

        <a
          href={smsUrl}
          style={{
            background: "#0284c7",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "800",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
          }}
        >
          📱 Send Mobile SMS SOS
        </a>

        <a
          href="tel:112"
          style={{
            background: "#dc2626",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "800",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
          }}
        >
          🚨 Dial 112 Police / All SOS
        </a>

        <button
          onClick={handleCopy}
          style={{
            background: copied ? "#16a34a" : isEmergencyMode ? "#3d1414" : "#f1f5f9",
            color: copied ? "#ffffff" : isEmergencyMode ? "#ffffff" : "#334155",
            border: isEmergencyMode ? "1px solid #551c1c" : "1px solid #cbd5e1",
            borderRadius: "10px",
            padding: "12px 18px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s",
          }}
        >
          {copied ? "✓ Copied to Clipboard!" : "📋 Copy Distress Text & Link"}
        </button>
      </div>
    </div>
  );
}

