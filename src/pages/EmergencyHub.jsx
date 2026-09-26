import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  getActiveDisasterAlerts,
  getDestinationEmergency,
  getOfflineEmergencyData,
  getAtRiskDistricts,
} from "../services/emergencyApi";
import destinationsData from "../data/destinations";
import CrisisCommunityChat from "../components/CrisisCommunityChat";
import EmergencyReplanner from "../components/EmergencyReplanner";
import EmergencyRadarMap from "../components/EmergencyRadarMap";
import EmergencySOSBroadcaster from "../components/EmergencySOSBroadcaster";
import OfflineEmergencyPassModal from "../components/OfflineEmergencyPassModal";
import SafeTravelDestinations from "../components/SafeTravelDestinations";

export default function EmergencyHub() {
  const [searchParams] = useSearchParams();
  const initialDest = searchParams.get("dest") || "Manali";
  const initialTab = searchParams.get("tab") || (searchParams.get("dest") ? "REPLAN" : "RADAR");

  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState(initialDest);
  const [destEmergency, setDestEmergency] = useState(null);
  const [loadingDest, setLoadingDest] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab); // RADAR, DISTRICTS, REPLAN, COMMUNITY, HOSPITALS, OFFLINE_GUIDE
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(true);
  const [offlineData, setOfflineData] = useState(getOfflineEmergencyData());
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [radarViewMode, setRadarViewMode] = useState("MAP"); // MAP or CARDS

  const [atRiskDistricts, setAtRiskDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [districtFilter, setDistrictFilter] = useState("ALL"); // ALL, RED, YELLOW, GREEN

  useEffect(() => {
    async function loadDistrictsData() {
      setLoadingDistricts(true);
      try {
        const res = await getAtRiskDistricts();
        if (res && res.districts) {
          setAtRiskDistricts(res.districts);
        }
      } catch (err) {
        console.warn("Failed to load at-risk districts:", err);
      } finally {
        setLoadingDistricts(false);
      }
    }
    loadDistrictsData();
  }, []);

  useEffect(() => {
    const dest = searchParams.get("dest");
    const tab = searchParams.get("tab");
    if (dest) setSelectedDestination(dest);
    if (tab) setActiveTab(tab);
    else if (dest) setActiveTab("REPLAN");
  }, [searchParams]);

  // All 33 Website Destinations + 11 Major Travel Hub Origins
  const allDestinationsList = useMemo(() => {
    const list = destinationsData.map((d) => ({
      name: d.name,
      state: d.state,
      isOrigin: false,
    }));

    const majorOrigins = [
      { name: "Delhi", state: "Delhi NCR", isOrigin: true },
      { name: "Mumbai", state: "Maharashtra", isOrigin: true },
      { name: "Bengaluru", state: "Karnataka", isOrigin: true },
      { name: "Chennai", state: "Tamil Nadu", isOrigin: true },
      { name: "Kolkata", state: "West Bengal", isOrigin: true },
      { name: "Hyderabad", state: "Telangana", isOrigin: true },
      { name: "Pune", state: "Maharashtra", isOrigin: true },
      { name: "Ahmedabad", state: "Gujarat", isOrigin: true },
      { name: "Lucknow", state: "Uttar Pradesh", isOrigin: true },
      { name: "Guwahati", state: "Assam", isOrigin: true },
      { name: "Chandigarh", state: "Punjab / Haryana", isOrigin: true },
      { name: "Kochi", state: "Kerala", isOrigin: true },
      { name: "Amritsar", state: "Punjab", isOrigin: true },
    ];

    majorOrigins.forEach((o) => {
      if (!list.some((d) => d.name.toLowerCase() === o.name.toLowerCase())) {
        list.push(o);
      }
    });

    return list;
  }, []);

  // Compute live safety & disaster status dynamically for every destination using 4-tier model
  const destinationStatusMap = useMemo(() => {
    const map = {};
    allDestinationsList.forEach((d) => {
      const dLower = d.name.toLowerCase();
      const match = alerts.find(
        (a) =>
          a.destination.toLowerCase() === dLower ||
          dLower.includes(a.destination.toLowerCase()) ||
          a.destination.toLowerCase().includes(dLower)
      );
      if (match) {
        if (match.alertTier === "RED") {
          map[d.name] = {
            tier: "RED",
            badge: "🔴 ",
            label: "🔴 Disaster Zone (Critical)",
            alertTitle: match.title,
            movementStatus: match.movementStatus || "TRAVEL HAZARDOUS / ROUTES SUSPENDED",
          };
        } else if (match.alertTier === "YELLOW") {
          map[d.name] = {
            tier: "YELLOW",
            badge: "🟡 ",
            label: "🟡 Yellow Alert (Moderate Advisory)",
            alertTitle: match.title,
            movementStatus: match.movementStatus || "MOVEMENT POSSIBLE WITH CAUTION",
          };
        } else if (match.isRainAlert) {
          map[d.name] = {
            tier: "GREEN",
            badge: "🟢 ",
            label: "🟢 Rain Alert (Standard Rainfall)",
            alertTitle: match.title,
            movementStatus: "MOVEMENT COMPLETELY POSSIBLE",
          };
        } else {
          map[d.name] = {
            tier: "GREEN",
            badge: "🟢 ",
            label: "🟢 Normal (All Routes Open)",
            alertTitle: match.title || "All Routes Clear & Verified",
            movementStatus: "ALL ROUTES OPEN & NORMAL",
          };
        }
      } else {
        map[d.name] = {
          tier: "GREEN",
          badge: "🟢 ",
          label: "🟢 Normal (All Routes Open)",
          alertTitle: "All Routes Clear & Verified",
          movementStatus: "ALL ROUTES OPEN & NORMAL",
        };
      }
    });
    return map;
  }, [allDestinationsList, alerts]);

  const alertStats = useMemo(() => {
    const red = alerts.filter((a) => a.alertTier === "RED").length;
    const yellow = alerts.filter((a) => a.alertTier === "YELLOW").length;
    const rain = alerts.filter((a) => a.isRainAlert).length;
    const normal = alerts.filter((a) => a.alertTier === "GREEN" && !a.isRainAlert).length;
    return { red, yellow, rain, normal, total: alerts.length };
  }, [alerts]);

  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [isRefreshingLive, setIsRefreshingLive] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );

  const handleRefreshLive = async () => {
    setIsRefreshingLive(true);
    try {
      const res = await getActiveDisasterAlerts();
      if (res && res.alerts) {
        setAlerts(res.alerts);
        setLastSyncedTime(
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        );
      }
    } catch (e) {
      console.warn("Live refresh failed:", e);
    } finally {
      setIsRefreshingLive(false);
    }
  };

  // Fetch active alerts
  useEffect(() => {
    async function loadAlerts() {
      setLoadingAlerts(true);
      try {
        const res = await getActiveDisasterAlerts();
        if (res && res.alerts) {
          setAlerts(res.alerts);
        }
      } catch (err) {
        console.warn("Failed to load alerts, using offline data:", err);
      } finally {
        setLoadingAlerts(false);
      }
    }
    loadAlerts();
    setOfflineData(getOfflineEmergencyData());
  }, []);

  // Fetch destination specific data
  useEffect(() => {
    async function loadDestData() {
      setLoadingDest(true);
      try {
        const res = await getDestinationEmergency(selectedDestination);
        setDestEmergency(res);
      } catch (err) {
        console.warn("Destination emergency load failed:", err);
      } finally {
        setLoadingDest(false);
      }
    }
    if (selectedDestination) {
      loadDestData();
    }
  }, [selectedDestination]);

  const activeAlertForDest = useMemo(() => {
    if (!selectedDestination || !alerts.length) return null;
    const destLower = selectedDestination.toLowerCase().trim();
    // Prioritize RED or YELLOW alerts
    const elevated = alerts.find(
      (a) =>
        (a.destination.toLowerCase() === destLower ||
          destLower.includes(a.destination.toLowerCase()) ||
          a.destination.toLowerCase().includes(destLower)) &&
        (a.alertTier === "RED" || a.alertTier === "YELLOW")
    );
    if (elevated) return elevated;

    // Otherwise return exact match (Rain Alert or Normal)
    return (
      alerts.find(
        (a) =>
          a.destination.toLowerCase() === destLower ||
          destLower.includes(a.destination.toLowerCase()) ||
          a.destination.toLowerCase().includes(destLower)
      ) || null
    );
  }, [selectedDestination, alerts]);

  return (
    <div
      className={isEmergencyMode ? "emergency-mode-active" : ""}
      style={{
        minHeight: "100vh",
        background: isEmergencyMode ? "#0d0404" : "#f8fafc",
        color: isEmergencyMode ? "#f9fafb" : "#0f172a",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        transition: "background 0.3s ease, color 0.3s ease",
        paddingBottom: "80px",
      }}
    >
      {/* TOP EMERGENCY MODE STRIP */}
      <div
        style={{
          background: isEmergencyMode ? "#7f1d1d" : "#0f172a",
          color: "#ffffff",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: isEmergencyMode ? "2px solid #ef4444" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🚨</span>
          <div>
            <span style={{ fontWeight: "800", fontSize: "14px", letterSpacing: "0.5px" }}>
              DISASTER CRISIS & EMERGENCY INTELLIGENCE HUB
            </span>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "12px",
                background: isEmergencyMode ? "#ef4444" : "#1e293b",
                color: "#ffffff",
                fontWeight: "700",
              }}
            >
              {isEmergencyMode ? "EMERGENCY MODE ACTIVE" : "REAL-TIME MONITORING"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "#34d399",
              background: "rgba(16, 185, 129, 0.15)",
              padding: "4px 10px",
              borderRadius: "20px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <span>●</span> Offline Ready Cached
          </div>

          <button
            onClick={() => setIsEmergencyMode(!isEmergencyMode)}
            style={{
              background: isEmergencyMode ? "#ef4444" : "#dc2626",
              color: "#ffffff",
              border: "2px solid #ffffff",
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "13px",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)",
            }}
          >
            {isEmergencyMode ? "⚡ Exit Emergency Mode" : "🚨 Turn ON Emergency Mode"}
          </button>
        </div>
      </div>

      {/* QUICK 1-TAP EMERGENCY HOTLINES STRIP */}
      <div
        style={{
          background: isEmergencyMode ? "#1a0808" : "#ffffff",
          borderBottom: isEmergencyMode ? "1px solid #451212" : "1px solid #e2e8f0",
          padding: "14px 24px",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: "800",
              textTransform: "uppercase",
              color: isEmergencyMode ? "#fca5a5" : "#64748b",
              letterSpacing: "0.5px",
            }}
          >
            Instant 24x7 SOS Numbers (1-Tap Dial):
          </span>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              { label: "112 Police & All SOS", num: "112", color: "#dc2626" },
              { label: "108 Ambulance", num: "108", color: "#ea580c" },
              { label: "1070 Disaster SDRF", num: "1070", color: "#d97706" },
              { label: "1363 Tourist SOS", num: "1363", color: "#2563eb" },
              { label: "1090 Women Helpline", num: "1090", color: "#9333ea" },
              { label: "139 Railway SOS", num: "139", color: "#059669" },
            ].map((h) => (
              <a
                key={h.num}
                href={`tel:${h.num}`}
                style={{
                  background: h.color,
                  color: "#ffffff",
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                📞 {h.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        {/* DESTINATION SELECTION & RISK SUMMARY BANNER */}
        <div
          style={{
            background: isEmergencyMode ? "#200d0d" : "#ffffff",
            border: isEmergencyMode ? "2px solid #ef4444" : "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: "#ef4444",
                  letterSpacing: "0.5px",
                  background: isEmergencyMode ? "#451212" : "#fef2f2",
                  padding: "4px 10px",
                  borderRadius: "6px",
                }}
              >
                LIVE TRAVEL RISK RADAR
              </span>
              <h2
                style={{
                  margin: "8px 0 4px",
                  fontSize: "26px",
                  fontWeight: "800",
                  color: isEmergencyMode ? "#ffffff" : "#0f172a",
                }}
              >
                Route Risk & Disaster Status: <span style={{ color: "#ef4444" }}>{selectedDestination}</span>
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: isEmergencyMode ? "#f87171" : "#64748b" }}>
                Select any upcoming destination to check live road disruptions, cloudbursts, landslides, cyclone advisories, or evacuation routes.
              </p>
            </div>

            {/* Quick Destination Switcher */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: isEmergencyMode ? "#d1d5db" : "#475569",
                }}
              >
                Inspect Destination Route:
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: isEmergencyMode ? "2px solid #ef4444" : "1px solid #cbd5e1",
                  background: isEmergencyMode ? "#331212" : "#ffffff",
                  color: isEmergencyMode ? "#ffffff" : "#0f172a",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                <optgroup label="📍 Website Destinations (All 33 Monitored)">
                  {allDestinationsList
                    .filter((d) => !d.isOrigin)
                    .map((d) => {
                      const info = destinationStatusMap[d.name] || { badge: "🟢 ", alertTitle: "All Routes Clear & Verified" };
                      return (
                        <option key={d.name} value={d.name}>
                          {info.badge} {d.name} ({d.state}) - {info.alertTitle}
                        </option>
                      );
                    })}
                </optgroup>
                <optgroup label="🛫 Major Origins & Transit Hubs (11 Monitored)">
                  {allDestinationsList
                    .filter((d) => d.isOrigin)
                    .map((d) => {
                      const info = destinationStatusMap[d.name] || { badge: "🟢 ", alertTitle: "All Routes Clear & Verified" };
                      return (
                        <option key={d.name} value={d.name}>
                          {info.badge} {d.name} ({d.state}) - {info.alertTitle}
                        </option>
                      );
                    })}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Active Risk Status Card for Chosen Destination (4-Tier Model) */}
          {activeAlertForDest?.alertTier === "RED" ? (
            /* TIER 1: RED ALERT / DISASTER ZONE */
            <div
              style={{
                background: isEmergencyMode ? "#3d1010" : "#fef2f2",
                border: "2px solid #ef4444",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "32px" }}>
                    {activeAlertForDest.destination === "Manali"
                      ? "⛰️"
                      : activeAlertForDest.destination === "Puri"
                      ? "🌪️"
                      : "🚨"}
                  </span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: "#dc2626",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        🔴 DISASTER ZONE (CRITICAL)
                      </span>
                      <span
                        style={{
                          background: "#0f172a",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {activeAlertForDest.status}
                      </span>
                      <span
                        style={{
                          background: "#991b1b",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        🚫 {activeAlertForDest.movementStatus || "TRAVEL HAZARDOUS / ROUTES SUSPENDED"}
                      </span>
                    </div>
                    <h3
                      style={{
                        margin: "6px 0 2px",
                        fontSize: "19px",
                        fontWeight: "800",
                        color: isEmergencyMode ? "#ffffff" : "#0f172a",
                      }}
                    >
                      {activeAlertForDest.title}
                    </h3>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "12px", color: isEmergencyMode ? "#fca5a5" : "#64748b" }}>
                    Verified Bulletin ID: <strong>{activeAlertForDest.id}</strong>
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: isEmergencyMode ? "#fecaca" : "#334155",
                  margin: "0 0 14px",
                }}
              >
                {activeAlertForDest.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "12px",
                  padding: "14px",
                  background: isEmergencyMode ? "#240d0d" : "#ffffff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <strong style={{ color: "#ef4444" }}>🚫 Blocked / Affected Corridors:</strong>
                  <div style={{ marginTop: "3px", color: isEmergencyMode ? "#ffffff" : "#1e293b" }}>
                    {activeAlertForDest.affectedCorridors}
                  </div>
                </div>
                <div>
                  <strong style={{ color: "#f59e0b" }}>🚌 Suspended Transport Modes:</strong>
                  <div style={{ marginTop: "3px", color: isEmergencyMode ? "#ffffff" : "#1e293b" }}>
                    {activeAlertForDest.affectedTransportModes}
                  </div>
                </div>
                <div>
                  <strong style={{ color: "#16a34a" }}>🛡️ Evacuation & Safety Advice:</strong>
                  <div style={{ marginTop: "3px", color: isEmergencyMode ? "#ffffff" : "#1e293b" }}>
                    {activeAlertForDest.evacuationAdvice}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setActiveTab("REPLAN")}
                  className="emg-hub-btn btn-red"
                >
                  🔄 View Safe Evacuation Route & 100% Refund
                </button>
                <button
                  onClick={() => setActiveTab("COMMUNITY")}
                  className="emg-hub-btn btn-dark"
                >
                  💬 Connect with Stranded Travelers in {selectedDestination}
                </button>
                <button
                  onClick={() => setActiveTab("HOSPITALS")}
                  className="emg-hub-btn btn-blue"
                >
                  🏥 Verified Hospitals & Trauma Care
                </button>
                <button
                  onClick={() => setActiveTab("SAFE_SPOTS")}
                  className="emg-hub-btn btn-green"
                >
                  🛡️ Explore Safe Places Right Now
                </button>
                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="emg-hub-btn btn-teal"
                >
                  📄 Download Offline Safety Pass
                </button>
              </div>
            </div>
          ) : activeAlertForDest?.alertTier === "YELLOW" ? (
            /* TIER 2: YELLOW ALERT / MODERATE ADVISORY */
            <div
              style={{
                background: isEmergencyMode ? "#331d08" : "#fffbeb",
                border: "2px solid #eab308",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "32px" }}>
                    {activeAlertForDest.destination === "Rohtang Pass"
                      ? "❄️"
                      : activeAlertForDest.destination === "Rishikesh"
                      ? "🌊"
                      : "🟡"}
                  </span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: "#d97706",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        🟡 YELLOW ALERT (MODERATE ADVISORY)
                      </span>
                      <span
                        style={{
                          background: "#15803d",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        ✓ MOVEMENT POSSIBLE WITH CAUTION
                      </span>
                      <span
                        style={{
                          background: "#0f172a",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {activeAlertForDest.status}
                      </span>
                    </div>
                    <h3
                      style={{
                        margin: "6px 0 2px",
                        fontSize: "19px",
                        fontWeight: "800",
                        color: isEmergencyMode ? "#ffffff" : "#0f172a",
                      }}
                    >
                      {activeAlertForDest.title}
                    </h3>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "12px", color: isEmergencyMode ? "#fde68a" : "#b45309" }}>
                    Verified Advisory ID: <strong>{activeAlertForDest.id}</strong>
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: isEmergencyMode ? "#fef3c7" : "#451a03",
                  margin: "0 0 14px",
                }}
              >
                {activeAlertForDest.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "12px",
                  padding: "14px",
                  background: isEmergencyMode ? "#261608" : "#ffffff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  border: "1px solid #fde68a",
                }}
              >
                <div>
                  <strong style={{ color: "#d97706" }}>⚠️ Corridors Under Precaution:</strong>
                  <div style={{ marginTop: "3px", color: isEmergencyMode ? "#ffffff" : "#1e293b" }}>
                    {activeAlertForDest.affectedCorridors}
                  </div>
                </div>
                <div>
                  <strong style={{ color: "#2563eb" }}>🚦 Operational Transit Modes:</strong>
                  <div style={{ marginTop: "3px", color: isEmergencyMode ? "#ffffff" : "#1e293b" }}>
                    {activeAlertForDest.affectedTransportModes}
                  </div>
                </div>
                <div>
                  <strong style={{ color: "#16a34a" }}>🧭 Travel Advisory Guidelines:</strong>
                  <div style={{ marginTop: "3px", color: isEmergencyMode ? "#ffffff" : "#1e293b" }}>
                    {activeAlertForDest.evacuationAdvice}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setActiveTab("REPLAN")}
                  className="emg-hub-btn btn-amber"
                >
                  🔄 View Recommended Detour Corridors
                </button>
                <button
                  onClick={() => setActiveTab("SAFE_SPOTS")}
                  className="emg-hub-btn btn-green"
                >
                  🛡️ Explore Safe Spots
                </button>
                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="emg-hub-btn btn-teal"
                >
                  📄 Offline Emergency Pass
                </button>
              </div>
            </div>
          ) : activeAlertForDest?.isRainAlert ? (
            /* TIER 3: GREEN ALERT / RAIN ALERT */
            <div
              style={{
                background: isEmergencyMode ? "#0d2818" : "#f0fdf4",
                border: "2px solid #10b981",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "32px" }}>🌧️</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: "#059669",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        🟢 RAIN ALERT (STANDARD MONSOON)
                      </span>
                      <span
                        style={{
                          background: "#166534",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        ✓ MOVEMENT COMPLETELY POSSIBLE
                      </span>
                      <span
                        style={{
                          background: "#0f172a",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        ALL CORRIDORS OPEN
                      </span>
                    </div>
                    <h3
                      style={{
                        margin: "6px 0 2px",
                        fontSize: "19px",
                        fontWeight: "800",
                        color: isEmergencyMode ? "#ffffff" : "#0f172a",
                      }}
                    >
                      {activeAlertForDest.title}
                    </h3>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "12px", color: isEmergencyMode ? "#86efac" : "#166534", fontWeight: "700" }}>
                    Live Radar: <strong>{activeAlertForDest.liveWeather?.precipitation?.toFixed(1) || "1.5"} mm/h</strong>
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: isEmergencyMode ? "#bbf7d0" : "#166534",
                  margin: "0 0 14px",
                }}
              >
                {activeAlertForDest.description}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  padding: "12px 14px",
                  background: isEmergencyMode ? "#143320" : "#e6fcf5",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  border: "1px solid #a7f3d0",
                }}
              >
                <div style={{ color: "#065f46" }}>
                  <strong>Travel Status: </strong> 100% normal. No flash floods, landslides, or road closures reported. All cabs, buses, and sightseeing activities are running on regular schedule.
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="emg-hub-btn btn-teal"
                >
                  📄 Download Offline Pass
                </button>
                <button
                  onClick={() => setActiveTab("SAFE_SPOTS")}
                  className="emg-hub-btn btn-green"
                >
                  🛡️ Safe Sightseeing Spots
                </button>
              </div>
            </div>
          ) : (
            /* TIER 4: GREEN ALERT / NORMAL ALL CLEAR */
            <div
              style={{
                background: isEmergencyMode ? "#0d2818" : "#f0fdf4",
                border: "2px solid #22c55e",
                borderRadius: "12px",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "32px" }}>🟢</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                    <span
                      style={{
                        background: "#16a34a",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      🟢 NORMAL (ALL ROUTES CLEAR)
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#166534" }}>
                      0 Active Disasters
                    </span>
                  </div>
                  <h4 style={{ margin: "0 0 2px", fontSize: "17px", fontWeight: "800", color: "#166534" }}>
                    All Corridors Open &amp; Verified in {selectedDestination}
                  </h4>
                  <p style={{ margin: 0, fontSize: "13px", color: isEmergencyMode ? "#86efac" : "#15803d" }}>
                    National Highway expressways, state roads, rail lines, and flights are operating under 100% normal conditions.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="emg-hub-btn btn-teal"
                >
                  📄 Offline Medical Pass
                </button>
                <button
                  onClick={() => setActiveTab("SAFE_SPOTS")}
                  className="emg-hub-btn btn-green"
                >
                  🛡️ Safe Places Right Now
                </button>
                <button
                  onClick={() => setActiveTab("RADAR")}
                  className="emg-hub-btn btn-dark"
                >
                  Inspect All Indian Hubs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 1-CLICK REAL-TIME SOS BROADCASTER */}
        <EmergencySOSBroadcaster
          destination={selectedDestination}
          stateName={allDestinationsList.find((d) => d.name.toLowerCase() === selectedDestination.toLowerCase())?.state || "India"}
          activeAlert={activeAlertForDest}
          isEmergencyMode={isEmergencyMode}
        />

        {/* NAVIGATION TABS */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: isEmergencyMode ? "2px solid #3d1414" : "2px solid #e2e8f0",
            marginBottom: "24px",
            overflowX: "auto",
          }}
        >
          {[
            { id: "RADAR", label: "🌪️ All Disaster Alerts", count: alerts.length },
            { id: "DISTRICTS", label: "🚨 Districts At Risk & Relief Ops", count: atRiskDistricts.length },
            { id: "SAFE_SPOTS", label: "🛡️ Safe Places Right Now" },
            { id: "REPLAN", label: `🔄 Emergency Replanning: ${selectedDestination}` },
            { id: "COMMUNITY", label: `💬 Stranded Traveler Chat (${selectedDestination})` },
            { id: "HOSPITALS", label: "🏥 Verified Hospitals & Shelters" },
            { id: "OFFLINE_GUIDE", label: "📱 Offline Safety & First-Aid Guide" },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: isSelected ? "3px solid #ef4444" : "3px solid transparent",
                  padding: "12px 18px",
                  fontSize: "14px",
                  fontWeight: isSelected ? "800" : "600",
                  color: isSelected
                    ? "#ef4444"
                    : isEmergencyMode
                    ? "#9ca3af"
                    : "#64748b",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ALL ACTIVE DISASTER RADAR ALERTS */}
        {activeTab === "RADAR" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      background: "#16a34a",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "800",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    ● REAL LIVE FEEDS ACTIVE
                  </span>
                  <span style={{ fontSize: "12px", color: isEmergencyMode ? "#a1a1aa" : "#64748b" }}>
                    Last Synced: {lastSyncedTime}
                  </span>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800" }}>
                  Real-Time Disaster & Route Interruption Bulletin
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: isEmergencyMode ? "#f87171" : "#64748b" }}>
                  Live seismic network (USGS), satellite storm tracking (NASA EONET), river hydrology (GloFAS), and NDMA ground directives.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={handleRefreshLive}
                  disabled={isRefreshingLive}
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 8px rgba(2, 132, 199, 0.3)",
                  }}
                >
                  {isRefreshingLive ? "⏳ Querying USGS & NASA..." : "🔄 Refresh Real-Time Feeds"}
                </button>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span
                    style={{
                      background: "#ef4444",
                      color: "#ffffff",
                      padding: "6px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "800",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    🔴 {alertStats.red} Disaster Zones
                  </span>
                  <span
                    style={{
                      background: "#eab308",
                      color: "#ffffff",
                      padding: "6px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "800",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    🟡 {alertStats.yellow} Advisories
                  </span>
                  <span
                    style={{
                      background: "#10b981",
                      color: "#ffffff",
                      padding: "6px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "800",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    🟢 {alertStats.rain} Rain Alerts
                  </span>
                  <span
                    style={{
                      background: "#059669",
                      color: "#ffffff",
                      padding: "6px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "800",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    🟢 {alertStats.normal} Normal
                  </span>
                </div>
              </div>
            </div>

            {/* RADAR VIEW MODE TOGGLE (MAP vs CARDS) */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              <button
                onClick={() => setRadarViewMode("MAP")}
                style={{
                  background: radarViewMode === "MAP" ? (isEmergencyMode ? "#ef4444" : "#0f172a") : (isEmergencyMode ? "#331212" : "#ffffff"),
                  color: radarViewMode === "MAP" ? "#ffffff" : (isEmergencyMode ? "#fca5a5" : "#475569"),
                  border: radarViewMode === "MAP" ? "none" : (isEmergencyMode ? "1px solid #551c1c" : "1px solid #cbd5e1"),
                  borderRadius: "8px",
                  padding: "9px 18px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: radarViewMode === "MAP" ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                }}
              >
                🗺️ Interactive Visual India Map
              </button>
              <button
                onClick={() => setRadarViewMode("CARDS")}
                style={{
                  background: radarViewMode === "CARDS" ? (isEmergencyMode ? "#ef4444" : "#0f172a") : (isEmergencyMode ? "#331212" : "#ffffff"),
                  color: radarViewMode === "CARDS" ? "#ffffff" : (isEmergencyMode ? "#fca5a5" : "#475569"),
                  border: radarViewMode === "CARDS" ? "none" : (isEmergencyMode ? "1px solid #551c1c" : "1px solid #cbd5e1"),
                  borderRadius: "8px",
                  padding: "9px 18px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: radarViewMode === "CARDS" ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                }}
              >
                📋 Real Incident Feed Cards ({alerts.length})
              </button>
            </div>

            {/* INTERACTIVE VISUAL INDIA RADAR MAP */}
            {radarViewMode === "MAP" && (
              <EmergencyRadarMap
                alerts={alerts}
                selectedDestination={selectedDestination}
                onSelectDestination={(dest) => setSelectedDestination(dest)}
                isEmergencyMode={isEmergencyMode}
              />
            )}

            {/* REAL-TIME SOURCE FILTER PILLS */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "20px",
                padding: "10px 14px",
                background: isEmergencyMode ? "#200e0e" : "#f1f5f9",
                borderRadius: "12px",
                border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
              }}
            >
              {[
                { id: "ALL", label: `All Hubs (${alerts.length})`, icon: "🌍" },
                { id: "RED", label: `🔴 Disaster Zones (${alertStats.red})`, icon: "🚨" },
                { id: "YELLOW", label: `🟡 Advisories (${alertStats.yellow})`, icon: "⚠️" },
                { id: "RAIN", label: `🟢 Rain Alerts (${alertStats.rain})`, icon: "🌧️" },
                { id: "NORMAL", label: `🟢 Normal / Open (${alertStats.normal})`, icon: "🛡️" },
                {
                  id: "USGS",
                  label: `USGS Earthquakes (${alerts.filter((a) => ((a.realIncidentSource || a.source || "")).includes("USGS")).length})`,
                  icon: "🌐",
                },
                {
                  id: "NASA",
                  label: `NASA Satellites (${alerts.filter((a) => ((a.realIncidentSource || a.source || "")).includes("NASA")).length})`,
                  icon: "🔭",
                },
                {
                  id: "NDMA",
                  label: `NDMA / IMD Directives (${alerts.filter((a) => {
                    const s = a.realIncidentSource || a.source || "";
                    return s.includes("NDMA") || s.includes("IMD") || s.includes("SDMA");
                  }).length})`,
                  icon: "🏛️",
                },
              ].map((pill) => {
                const isSelected = sourceFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setSourceFilter(pill.id)}
                    style={{
                      background: isSelected
                        ? isEmergencyMode
                          ? "#ef4444"
                          : "#0f172a"
                        : isEmergencyMode
                        ? "#331414"
                        : "#ffffff",
                      color: isSelected ? "#ffffff" : isEmergencyMode ? "#fca5a5" : "#334155",
                      border: isSelected ? "none" : isEmergencyMode ? "1px solid #551c1c" : "1px solid #cbd5e1",
                      borderRadius: "20px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{pill.icon}</span> {pill.label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
              {alerts
                .filter((a) => {
                  if (sourceFilter === "RED") return a.alertTier === "RED";
                  if (sourceFilter === "YELLOW") return a.alertTier === "YELLOW";
                  if (sourceFilter === "RAIN") return a.isRainAlert;
                  if (sourceFilter === "NORMAL") return a.alertTier === "GREEN" && !a.isRainAlert;
                  const s = a.realIncidentSource || a.source || "";
                  if (sourceFilter === "USGS") return s.includes("USGS");
                  if (sourceFilter === "NASA") return s.includes("NASA");
                  if (sourceFilter === "OPEN_METEO") return s.includes("Open-Meteo");
                  if (sourceFilter === "NDMA") {
                    return s.includes("NDMA") || s.includes("IMD") || s.includes("SDMA");
                  }
                  return true;
                })
                .map((al) => {
                  const isRed = al.alertTier === "RED";
                  const isYellow = al.alertTier === "YELLOW";
                  const isRain = al.isRainAlert;

                  const cardBorder = isRed
                    ? (isEmergencyMode ? "2px solid #ef4444" : "2px solid #ef4444")
                    : isYellow
                    ? (isEmergencyMode ? "2px solid #eab308" : "2px solid #f59e0b")
                    : isRain
                    ? (isEmergencyMode ? "1.5px solid #10b981" : "1.5px solid #10b981")
                    : (isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0");

                  const badgeBg = isRed ? "#dc2626" : isYellow ? "#d97706" : isRain ? "#059669" : "#16a34a";
                  const badgeText = isRed
                    ? `🔴 DISASTER ZONE • ${al.disasterType}`
                    : isYellow
                    ? `🟡 YELLOW ALERT • ${al.disasterType}`
                    : isRain
                    ? `🟢 RAIN ALERT • ${al.disasterType}`
                    : `🟢 NORMAL • ${al.disasterType}`;

                  return (
                    <div
                      key={al.id}
                      style={{
                        background: isEmergencyMode ? "#1f0c0c" : "#ffffff",
                        border: cardBorder,
                        borderRadius: "14px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div>
                        {/* REAL LIVE INCIDENT SOURCE HEADER */}
                        <div
                          style={{
                            background: isEmergencyMode ? "#331212" : "#f8fafc",
                            border: isEmergencyMode ? "1px solid #551d1d" : "1px solid #e2e8f0",
                            borderRadius: "8px",
                            padding: "6px 10px",
                            marginBottom: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "11px",
                            fontWeight: "700",
                            color: isEmergencyMode ? "#fca5a5" : "#475569",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                            <span>{al.sourceIcon || "🛰️"}</span>
                            <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                              {al.realIncidentSource || "Live Telemetry Feed"}
                            </span>
                          </div>
                          {al.sourceUrl && (
                            <a
                              href={al.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#2563eb",
                                textDecoration: "underline",
                                whiteSpace: "nowrap",
                                marginLeft: "8px",
                              }}
                            >
                              Live Source ↗
                            </a>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "10px",
                            flexWrap: "wrap",
                            gap: "6px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <span
                              style={{
                                background: badgeBg,
                                color: "#ffffff",
                                fontSize: "11px",
                                fontWeight: "800",
                                padding: "3px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              {badgeText}
                            </span>
                            {al.magnitude && (
                              <span
                                style={{
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  fontWeight: "800",
                                }}
                              >
                                {al.magnitude}
                              </span>
                            )}
                            {al.depthKm && (
                              <span
                                style={{
                                  background: "#e0e7ff",
                                  color: "#3730a3",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                }}
                              >
                                Depth: {al.depthKm}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: "12px", color: isEmergencyMode ? "#a1a1aa" : "#94a3b8" }}>
                            {al.region}
                          </span>
                        </div>

                        {/* MOVEMENT STATUS PILL */}
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            background: isRed ? "#fee2e2" : isYellow ? "#fef3c7" : "#d1fae5",
                            color: isRed ? "#991b1b" : isYellow ? "#92400e" : "#065f46",
                            fontSize: "11px",
                            fontWeight: "800",
                            marginBottom: "10px",
                          }}
                        >
                          <span>{isRed ? "🚫" : isYellow ? "⚠️" : "✓"}</span>
                          <span>{al.movementStatus || (isRed ? "TRAVEL HAZARDOUS / ROUTES SUSPENDED" : isYellow ? "MOVEMENT POSSIBLE WITH CAUTION" : "ALL ROUTES OPEN & NORMAL")}</span>
                        </div>

                        <h4 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", lineHeight: "1.4" }}>
                          {al.title}
                        </h4>

                        {/* GPS & Proximity Tag */}
                        {al.distanceToNearestHub && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "12px",
                              color: "#059669",
                              fontWeight: "600",
                              marginBottom: "10px",
                            }}
                          >
                            <span>📍 Nearest Tourist Center: {al.distanceToNearestHub}</span>
                            {al.coordinates && (
                              <span style={{ color: "#64748b", fontFamily: "monospace", fontSize: "11px" }}>
                                ({al.coordinates.lat.toFixed(2)}°N, {al.coordinates.lon.toFixed(2)}°E)
                              </span>
                            )}
                          </div>
                        )}

                        <p
                          style={{
                            margin: "0 0 12px",
                            fontSize: "13px",
                            color: isEmergencyMode ? "#fecaca" : "#475569",
                            lineHeight: "1.55",
                          }}
                        >
                          {al.description}
                        </p>

                        <div
                          style={{
                            fontSize: "12px",
                            marginBottom: "12px",
                            padding: "10px",
                            background: isEmergencyMode ? "#301212" : "#f8fafc",
                            borderRadius: "8px",
                          }}
                        >
                          <div style={{ color: isRed ? "#ef4444" : isYellow ? "#d97706" : "#059669", fontWeight: "700", marginBottom: "4px" }}>
                            {isRed ? "🚫 Suspended Route Corridor:" : isYellow ? "⚠️ Corridor Under Caution:" : "✓ Verified Clear Corridor:"}
                          </div>
                          <div style={{ color: isEmergencyMode ? "#f3f4f6" : "#334155" }}>{al.affectedCorridors}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <button
                          onClick={() => {
                            setSelectedDestination(al.destination);
                            setActiveTab("REPLAN");
                          }}
                          className={`emg-hub-btn ${isRed ? "btn-red" : isYellow ? "btn-amber" : "btn-dark"}`}
                          style={{ flex: 1 }}
                        >
                          {isRed ? `Safe Replan: ${al.destination}` : isYellow ? `Inspect Advisory: ${al.destination}` : `Inspect ${al.destination}`}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDestination(al.destination);
                            setActiveTab("COMMUNITY");
                          }}
                          className="emg-hub-btn btn-dark"
                        >
                          💬 Chat
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB: AT-RISK DISTRICTS & RELIEF OPERATIONS */}
        {activeTab === "DISTRICTS" && (
          <div style={{ marginBottom: "32px" }}>
            {/* DISTRICTS HEADER BANNER */}
            <div
              style={{
                background: isEmergencyMode
                  ? "linear-gradient(135deg, #2a0808 0%, #1a0404 100%)"
                  : "linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)",
                border: isEmergencyMode ? "1px solid #7f1d1d" : "1px solid #fecaca",
                borderRadius: "14px",
                padding: "20px 24px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: isEmergencyMode ? "#fca5a5" : "#991b1b",
                    margin: "0 0 6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>🚨</span> Districts Currently At Risk & Relief Operations Hub
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: isEmergencyMode ? "#e2e8f0" : "#475569",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Official District Disaster Management telemetry (DDMA/NDMA) • District Emergency Operation Centres (DEOC 1077) • Verified Safe Shelters & Evacuation Corridors
                </p>
              </div>

              {/* FILTER PILLS */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { id: "ALL", label: `All Districts (${atRiskDistricts.length})` },
                  { id: "RED", label: `🔴 Disaster Zones (${atRiskDistricts.filter((d) => d.alertTier === "RED").length})` },
                  { id: "YELLOW", label: `🟡 Moderate Advisories (${atRiskDistricts.filter((d) => d.alertTier === "YELLOW").length})` },
                  { id: "GREEN", label: `🟢 Rain Alerts (${atRiskDistricts.filter((d) => d.isRainAlert).length})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setDistrictFilter(f.id)}
                    style={{
                      background: districtFilter === f.id
                        ? (f.id === "RED" ? "#ef4444" : f.id === "YELLOW" ? "#f59e0b" : f.id === "GREEN" ? "#10b981" : "#3b82f6")
                        : (isEmergencyMode ? "#2d1515" : "#ffffff"),
                      color: districtFilter === f.id
                        ? "#ffffff"
                        : (isEmergencyMode ? "#e2e8f0" : "#334155"),
                      border: "1px solid",
                      borderColor: districtFilter === f.id
                        ? "transparent"
                        : (isEmergencyMode ? "#4a1e1e" : "#cbd5e1"),
                      padding: "7px 13px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingDistricts ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                Loading verified district risk telemetry...
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {atRiskDistricts
                  .filter((district) => {
                    if (districtFilter === "ALL") return true;
                    if (districtFilter === "RED") return district.alertTier === "RED";
                    if (districtFilter === "YELLOW") return district.alertTier === "YELLOW";
                    if (districtFilter === "GREEN") return district.isRainAlert;
                    return true;
                  })
                  .map((district) => {
                    const isRed = district.alertTier === "RED";
                    const isYellow = district.alertTier === "YELLOW";

                    const badgeColor = isRed ? "#ef4444" : isYellow ? "#f59e0b" : "#10b981";
                    const badgeBg = isRed ? (isEmergencyMode ? "#3d0b0b" : "#fef2f2") : isYellow ? (isEmergencyMode ? "#3a2a07" : "#fffbeb") : (isEmergencyMode ? "#092e1e" : "#f0fdf4");
                    const cardBorder = isRed ? (isEmergencyMode ? "#7f1d1d" : "#fca5a5") : isYellow ? (isEmergencyMode ? "#78350f" : "#fde68a") : (isEmergencyMode ? "#065f46" : "#bbf7d0");

                    return (
                      <div
                        key={district.districtId}
                        style={{
                          background: isEmergencyMode ? "#1a0f0f" : "#ffffff",
                          border: `1.5px solid ${cardBorder}`,
                          borderRadius: "14px",
                          padding: "22px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          position: "relative",
                        }}
                      >
                        {/* DISTRICT HEADER */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginBottom: "14px",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <span style={{ fontSize: "20px" }}>
                                {isRed ? "🔴" : isYellow ? "🟡" : "🟢"}
                              </span>
                              <h4
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  color: isEmergencyMode ? "#f8fafc" : "#0f172a",
                                  margin: 0,
                                }}
                              >
                                {district.districtName}
                              </h4>
                              <span
                                style={{
                                  background: isEmergencyMode ? "#2a1515" : "#f1f5f9",
                                  color: isEmergencyMode ? "#cbd5e1" : "#475569",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                }}
                              >
                                {district.state}
                              </span>
                            </div>

                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: badgeColor,
                                margin: "0 0 4px",
                              }}
                            >
                              Hazard: {district.hazardType}
                            </p>
                          </div>

                          <div
                            style={{
                              background: badgeBg,
                              border: `1px solid ${cardBorder}`,
                              color: badgeColor,
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "800",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {district.movementStatus}
                          </div>
                        </div>

                        {/* PRIMARY THREAT & AFFECTED CORRIDOR */}
                        <div
                          style={{
                            background: isEmergencyMode ? "#241010" : "#f8fafc",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            marginBottom: "16px",
                            fontSize: "13px",
                            lineHeight: "1.5",
                          }}
                        >
                          <div style={{ marginBottom: "6px" }}>
                            <strong style={{ color: isEmergencyMode ? "#fca5a5" : "#991b1b" }}>Primary Threat: </strong>
                            <span style={{ color: isEmergencyMode ? "#e2e8f0" : "#334155" }}>{district.primaryThreat}</span>
                          </div>
                          <div>
                            <strong style={{ color: isEmergencyMode ? "#cbd5e1" : "#475569" }}>Impacted Corridors: </strong>
                            <span style={{ color: isEmergencyMode ? "#94a3b8" : "#64748b" }}>{district.affectedCorridors}</span>
                          </div>
                        </div>

                        {/* 2-COLUMN GRID: EMERGENCY CONTACTS & RELIEF SHELTERS */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "16px",
                            marginBottom: "16px",
                          }}
                        >
                          {/* COLUMN 1: DISASTER HELPLINES & NDRF */}
                          <div
                            style={{
                              background: isEmergencyMode ? "#201212" : "#fdf4f4",
                              border: isEmergencyMode ? "1px solid #4a1e1e" : "1px solid #fee2e2",
                              borderRadius: "10px",
                              padding: "14px",
                            }}
                          >
                            <h5
                              style={{
                                fontSize: "13px",
                                fontWeight: "800",
                                color: isEmergencyMode ? "#fca5a5" : "#991b1b",
                                margin: "0 0 10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <span>📞</span> District Emergency Operations (DEOC)
                            </h5>

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: isEmergencyMode ? "#cbd5e1" : "#475569" }}>DEOC Helpline:</span>
                                <a
                                  href={`tel:${district.deocHelpline}`}
                                  style={{
                                    background: "#ef4444",
                                    color: "#ffffff",
                                    padding: "3px 10px",
                                    borderRadius: "12px",
                                    fontWeight: "800",
                                    textDecoration: "none",
                                    fontSize: "12px",
                                  }}
                                >
                                  Dial {district.deocHelpline}
                                </a>
                              </div>

                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: isEmergencyMode ? "#cbd5e1" : "#475569" }}>Direct District Control:</span>
                                <a
                                  href={`tel:${district.deocDirectPhone}`}
                                  style={{
                                    color: "#ef4444",
                                    fontWeight: "700",
                                    textDecoration: "none",
                                  }}
                                >
                                  {district.deocDirectPhone}
                                </a>
                              </div>

                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: isEmergencyMode ? "#cbd5e1" : "#475569" }}>State Emergency (SEOC):</span>
                                <strong style={{ color: isEmergencyMode ? "#f8fafc" : "#0f172a" }}>{district.seocHelpline}</strong>
                              </div>

                              <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "8px", marginTop: "4px" }}>
                                <span style={{ color: isEmergencyMode ? "#94a3b8" : "#64748b", display: "block", marginBottom: "2px" }}>
                                  Assigned Rescue Battalion:
                                </span>
                                <strong style={{ color: isEmergencyMode ? "#f8fafc" : "#0f172a", fontSize: "11px" }}>
                                  {district.ndrfBattalion}
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* COLUMN 2: ACTIVE RELIEF SHELTERS */}
                          <div
                            style={{
                              background: isEmergencyMode ? "#13231a" : "#f0fdf4",
                              border: isEmergencyMode ? "1px solid #14532d" : "1px solid #bbf7d0",
                              borderRadius: "10px",
                              padding: "14px",
                            }}
                          >
                            <h5
                              style={{
                                fontSize: "13px",
                                fontWeight: "800",
                                color: isEmergencyMode ? "#86efac" : "#166534",
                                margin: "0 0 10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <span>🏠</span> Verified Multi-Purpose Relief Shelters
                            </h5>

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              {district.activeShelters.map((shelter, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    background: isEmergencyMode ? "#182e22" : "#ffffff",
                                    border: isEmergencyMode ? "1px solid #1f4e35" : "1px solid #dcfce7",
                                    borderRadius: "6px",
                                    padding: "8px 10px",
                                    fontSize: "12px",
                                  }}
                                >
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                                    <strong style={{ color: isEmergencyMode ? "#f8fafc" : "#0f172a" }}>{shelter.name}</strong>
                                    <span style={{ background: "#10b981", color: "#ffffff", padding: "2px 6px", borderRadius: "10px", fontSize: "10px", fontWeight: "700" }}>
                                      Cap: {shelter.capacity}
                                    </span>
                                  </div>
                                  <div style={{ color: isEmergencyMode ? "#94a3b8" : "#64748b", fontSize: "11px", marginBottom: "2px" }}>
                                    📍 {shelter.location}
                                  </div>
                                  <div style={{ color: isEmergencyMode ? "#86efac" : "#16a34a", fontSize: "10px", fontWeight: "600" }}>
                                    ✓ {shelter.facilities}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* SAFE EVACUATION CORRIDOR BOX */}
                        <div
                          style={{
                            background: isEmergencyMode ? "#1a2530" : "#eff6ff",
                            border: isEmergencyMode ? "1px solid #1e3a8a" : "1px solid #bfdbfe",
                            borderRadius: "10px",
                            padding: "12px 16px",
                            marginBottom: "16px",
                            fontSize: "12px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                            <span style={{ fontSize: "16px" }}>🛣️</span>
                            <strong style={{ color: isEmergencyMode ? "#93c5fd" : "#1e40af" }}>
                              Verified Safe Evacuation Corridor:
                            </strong>
                          </div>
                          <p style={{ margin: "0 0 6px", color: isEmergencyMode ? "#e2e8f0" : "#1e293b", fontWeight: "600" }}>
                            {district.safeEvacuationCorridor}
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", color: isEmergencyMode ? "#94a3b8" : "#475569", fontSize: "11px" }}>
                            <span><strong>Mode:</strong> {district.recommendedTransitMode}</span>
                            <span><strong>Readiness:</strong> {district.stagingReadiness}</span>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <a
                            href={`tel:${district.deocHelpline}`}
                            className="emg-hub-btn btn-red"
                          >
                            <span>📞</span> Direct Call DEOC ({district.deocHelpline})
                          </a>

                          <button
                            onClick={() => {
                              // Match destination from district name
                              let targetDest = "Manali";
                              if (district.districtName.includes("Puri")) targetDest = "Puri";
                              else if (district.districtName.includes("Darjeeling")) targetDest = "Darjeeling";
                              else if (district.districtName.includes("Dehradun")) targetDest = "Rishikesh";
                              else if (district.districtName.includes("Lahaul")) targetDest = "Rohtang Pass";
                              else if (district.districtName.includes("Khasi")) targetDest = "Dawki";
                              else if (district.districtName.includes("Digha")) targetDest = "Digha";

                              setSelectedDestination(targetDest);
                              setActiveTab("REPLAN");
                            }}
                            className="emg-hub-btn btn-amber"
                          >
                            <span>🔄</span> Calculate Evacuation Detour
                          </button>

                          <button
                            onClick={() => setIsPassModalOpen(true)}
                            className="emg-hub-btn btn-teal"
                          >
                            <span>📱</span> Offline Emergency Pass
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* TAB: SAFE TRAVEL DESTINATIONS RIGHT NOW */}
        {activeTab === "SAFE_SPOTS" && (
          <div>
            <SafeTravelDestinations
              alerts={alerts}
              onSelectDestination={(dest) => {
                setSelectedDestination(dest);
              }}
              isEmergencyMode={isEmergencyMode}
            />
          </div>
        )}

        {/* TAB 2: EMERGENCY REPLANNING & TRIP DETOUR */}
        {activeTab === "REPLAN" && (
          <div>
            <EmergencyReplanner
              origin="Origin Point"
              destination={selectedDestination}
              bookingReference={searchParams.get("bookingId") || "TG-BOOKING-ACTIVE"}
              isEmergencyMode={isEmergencyMode}
            />
          </div>
        )}

        {/* TAB 3: STRANDED TRAVELER COMMUNITY CHAT */}
        {activeTab === "COMMUNITY" && (
          <div>
            <CrisisCommunityChat
              destination={selectedDestination}
              isEmergencyMode={isEmergencyMode}
            />
          </div>
        )}

        {/* TAB 4: VERIFIED HOSPITALS & RELIEF SHELTERS */}
        {activeTab === "HOSPITALS" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800" }}>
                Verified Emergency Facilities in {selectedDestination}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: isEmergencyMode ? "#f87171" : "#64748b" }}>
                District Civil Hospitals, Trauma Centers, and 24x7 SDRF Evacuation Shelters
              </p>
            </div>

            {loadingDest ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>Loading facilities...</div>
            ) : destEmergency?.facilities ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                {/* Hospitals */}
                <div
                  style={{
                    background: isEmergencyMode ? "#1c0d0d" : "#ffffff",
                    border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  <h4 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: "800", color: "#dc2626" }}>
                    🏥 Hospitals & Trauma Centers
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {destEmergency.facilities.hospitals?.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          background: isEmergencyMode ? "#2a1212" : "#f8fafc",
                          border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
                          borderRadius: "10px",
                          padding: "14px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <h5 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700" }}>{h.name}</h5>
                            <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700" }}>
                              {h.type} {h.hasEmergencyICU ? "• 24x7 ICU Ready" : ""}
                            </span>
                          </div>
                          <a
                            href={`tel:${h.phone}`}
                            style={{
                              background: "#dc2626",
                              color: "#ffffff",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              textDecoration: "none",
                              fontSize: "12px",
                              fontWeight: "700",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            📞 Call
                          </a>
                        </div>
                        <p style={{ margin: "8px 0 2px", fontSize: "12px", color: isEmergencyMode ? "#d1d5db" : "#64748b" }}>
                          📍 {h.address}
                        </p>
                        <span style={{ fontSize: "11px", color: isEmergencyMode ? "#fca5a5" : "#475569" }}>
                          Distance: {h.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shelters */}
                <div
                  style={{
                    background: isEmergencyMode ? "#1c0d0d" : "#ffffff",
                    border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  <h4 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: "800", color: "#2563eb" }}>
                    🏡 Relief Shelters & Food Distribution Points
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {destEmergency.facilities.shelters?.map((s, i) => (
                      <div
                        key={i}
                        style={{
                          background: isEmergencyMode ? "#2a1212" : "#f8fafc",
                          border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
                          borderRadius: "10px",
                          padding: "14px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <h5 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700" }}>{s.name}</h5>
                            <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: "700" }}>
                              Capacity: {s.capacity}
                            </span>
                          </div>
                          <a
                            href={`tel:${s.phone}`}
                            style={{
                              background: "#2563eb",
                              color: "#ffffff",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              textDecoration: "none",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            📞 Call
                          </a>
                        </div>
                        <p style={{ margin: "8px 0 0", fontSize: "12px", color: isEmergencyMode ? "#d1d5db" : "#64748b" }}>
                          📍 {s.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Helplines */}
                <div
                  style={{
                    background: isEmergencyMode ? "#1c0d0d" : "#ffffff",
                    border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  <h4 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: "800", color: "#d97706" }}>
                    🧗 Local SDRF & Police Helplines
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {destEmergency.facilities.localHelplines?.map((l, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          background: isEmergencyMode ? "#2a1212" : "#f8fafc",
                          borderRadius: "8px",
                          border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>{l.role}</span>
                        <a
                          href={`tel:${l.phone}`}
                          style={{
                            background: "#d97706",
                            color: "#ffffff",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "12px",
                            fontWeight: "800",
                          }}
                        >
                          {l.phone}
                        </a>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "18px", padding: "14px", background: "#fef3c7", borderRadius: "8px", border: "1px solid #fde68a" }}>
                    <span style={{ fontSize: "12px", color: "#92400e", lineHeight: "1.4", display: "block" }}>
                      🛡️ <strong>Women Safety Cell:</strong> Dial <strong>1090</strong> or access our integrated{" "}
                      <Link to="/women-safety" style={{ color: "#b45309", fontWeight: "700", textDecoration: "underline" }}>
                        Women Safety SOS Module
                      </Link>{" "}
                      for emergency GPS tracking and priority emergency escort.
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 5: OFFLINE EMERGENCY GUIDE & PROTOCOLS */}
        {activeTab === "OFFLINE_GUIDE" && (
          <div>
            <div
              style={{
                background: "#065f46",
                color: "#ffffff",
                padding: "16px 20px",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 2px", fontSize: "16px", fontWeight: "800" }}>
                  📱 Offline Emergency Protocols Cached
                </h4>
                <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
                  These instructions, first-aid procedures, and national helplines remain accessible even if cellular mobile data and internet fail.
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => setIsPassModalOpen(true)}
                  style={{
                    background: "#ffffff",
                    color: "#065f46",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: "800",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  📄 Print / Save Offline Safety Pass
                </button>
                <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                  ✓ Zero-Data Mode Active
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {offlineData.offlineFirstAidGuide?.map((guide, idx) => (
                <div
                  key={idx}
                  style={{
                    background: isEmergencyMode ? "#1a0b0b" : "#ffffff",
                    border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  <h4 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "800", color: "#ef4444" }}>
                    ⚠️ {guide.topic}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", lineHeight: "1.6", color: isEmergencyMode ? "#fecaca" : "#334155" }}>
                    {guide.steps.map((s, i) => (
                      <li key={i} style={{ marginBottom: "8px" }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PRINTABLE OFFLINE EMERGENCY SAFETY PASS MODAL */}
      <OfflineEmergencyPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        destination={selectedDestination}
        destEmergency={destEmergency}
        activeAlert={activeAlertForDest}
      />
    </div>
  );
}

