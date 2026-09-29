import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  fetchLiveSyncedDestinations,
  fetchWeatherSyncStatus,
  forceWeatherSync,
  fetchDestinationLiveWeather,
} from "../services/weatherApi";
import EmergencyRadarMap from "../components/EmergencyRadarMap";

export default function Weather() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  // View Mode: RADAR_MAP or GRID_CARDS
  const [viewMode, setViewMode] = useState("RADAR_MAP"); // RADAR_MAP, GRID_CARDS, SPLIT

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [tierFilter, setTierFilter] = useState(searchParams.get("tier") || "ALL"); // ALL, RED, YELLOW, GREEN, RAIN
  const [regionFilter, setRegionFilter] = useState("ALL"); // ALL, HIMALAYAS, SOUTH, EAST, WEST, NORTHEAST

  // Modal for destination forecast details
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [detailedForecast, setDetailedForecast] = useState(null);

  // Load initial data
  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsSyncing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = forceRefresh ? await forceWeatherSync() : await fetchLiveSyncedDestinations();
      if (res && res.destinations) {
        setDestinations(res.destinations);
        if (res.syncStatus) {
          setSyncStatus(res.syncStatus);
          if (res.syncStatus.lastSyncTimestamp) {
            setLastSyncTime(new Date(res.syncStatus.lastSyncTimestamp));
          }
        }
      }
    } catch (err) {
      console.warn("Failed to load live weather data:", err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh from background database every 30 seconds
    const interval = setInterval(() => {
      fetchLiveSyncedDestinations().then((res) => {
        if (res && res.destinations) {
          setDestinations(res.destinations);
          if (res.syncStatus) {
            setSyncStatus(res.syncStatus);
            if (res.syncStatus.lastSyncTimestamp) {
              setLastSyncTime(new Date(res.syncStatus.lastSyncTimestamp));
            }
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Update "seconds ago" ticker every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (lastSyncTime) {
        const diff = Math.max(0, Math.floor((Date.now() - lastSyncTime.getTime()) / 1000));
        setSecondsAgo(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastSyncTime]);

  // Open modal if ?dest=... in URL
  useEffect(() => {
    const destParam = searchParams.get("dest");
    if (destParam && destinations.length > 0) {
      const found = destinations.find(
        (d) => d.name.toLowerCase() === destParam.toLowerCase()
      );
      if (found) {
        handleOpenDetails(found);
      }
    }
  }, [searchParams, destinations]);

  const handleOpenDetails = async (dest) => {
    setSelectedDestination(dest);
    setDetailModalOpen(true);
    setModalLoading(true);
    try {
      const res = await fetchDestinationLiveWeather(dest.name);
      if (res && res.forecast7Day) {
        setDetailedForecast(res.forecast7Day);
      } else {
        setDetailedForecast(null);
      }
    } catch (e) {
      console.warn("Failed to fetch detailed forecast:", e);
      setDetailedForecast(null);
    } finally {
      setModalLoading(false);
    }
  };

  // KPI Statistics
  const stats = useMemo(() => {
    const red = destinations.filter((d) => d.disaster.alertTier === "RED").length;
    const yellow = destinations.filter((d) => d.disaster.alertTier === "YELLOW").length;
    const rain = destinations.filter((d) => d.disaster.isRainAlert).length;
    const green = destinations.filter(
      (d) => d.disaster.alertTier === "GREEN" && !d.disaster.isRainAlert
    ).length;
    return { red, yellow, rain, green, total: destinations.length };
  }, [destinations]);

  // Filtered destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      // Tier filter
      if (tierFilter === "RED" && d.disaster.alertTier !== "RED") return false;
      if (tierFilter === "YELLOW" && d.disaster.alertTier !== "YELLOW") return false;
      if (tierFilter === "RAIN" && !d.disaster.isRainAlert) return false;
      if (tierFilter === "GREEN" && (d.disaster.alertTier !== "GREEN" || d.disaster.isRainAlert)) return false;

      // Region filter
      if (regionFilter !== "ALL") {
        const state = d.state.toLowerCase();
        if (regionFilter === "HIMALAYAS") {
          if (!state.includes("himachal") && !state.includes("uttarakhand") && !state.includes("kashmir") && !state.includes("ladakh")) {
            return false;
          }
        } else if (regionFilter === "SOUTH") {
          if (!state.includes("kerala") && !state.includes("tamil nadu") && !state.includes("karnataka") && !state.includes("telangana") && !state.includes("andhra") && !state.includes("puducherry")) {
            return false;
          }
        } else if (regionFilter === "EAST") {
          if (!state.includes("bengal") && !state.includes("odisha") && !state.includes("bihar") && !state.includes("jharkhand")) {
            return false;
          }
        } else if (regionFilter === "WEST") {
          if (!state.includes("rajasthan") && !state.includes("gujarat") && !state.includes("maharashtra") && !state.includes("goa")) {
            return false;
          }
        } else if (regionFilter === "NORTHEAST") {
          if (!state.includes("meghalaya") && !state.includes("assam") && !state.includes("sikkim")) {
            return false;
          }
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = d.name.toLowerCase().includes(q);
        const matchesState = d.state.toLowerCase().includes(q);
        const matchesCorridor = d.corridor.toLowerCase().includes(q);
        const matchesHazard = d.disaster.title.toLowerCase().includes(q);
        if (!matchesName && !matchesState && !matchesCorridor && !matchesHazard) {
          return false;
        }
      }

      return true;
    });
  }, [destinations, tierFilter, regionFilter, searchQuery]);

  // Active Disaster Warnings (RED & YELLOW alerts)
  const activeCriticalAlerts = useMemo(() => {
    return destinations.filter((d) => d.disaster.alertTier === "RED");
  }, [destinations]);

  const activeAdvisories = useMemo(() => {
    return destinations.filter((d) => d.disaster.alertTier === "YELLOW");
  }, [destinations]);

  // Formatted alerts for EmergencyRadarMap
  const radarMapAlerts = useMemo(() => {
    return destinations.map((d) => ({
      id: d.disaster.activeBulletinId || `ALERT-${d.name}`,
      destination: d.name,
      alertTier: d.disaster.alertTier,
      severity: d.disaster.severity,
      isDisasterZone: d.disaster.isDisasterZone,
      isModerateAdvisory: d.disaster.isModerateAdvisory,
      isRainAlert: d.disaster.isRainAlert,
      isNormal: d.disaster.isNormal,
      movementStatus: d.disaster.movementStatus,
      movementFeasible: d.disaster.movementFeasible,
      disasterType: d.disaster.hazardType,
      title: d.disaster.title,
      description: d.disaster.description,
      source: d.disaster.source,
      liveWeather: {
        temp: d.weather.temperature,
        precipitation: d.weather.precipitation,
        windGust: d.weather.windGusts,
        humidity: d.weather.humidity,
        condition: d.weather.condition,
      },
    }));
  }, [destinations]);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* 1. TOP LIVE REALTIME DATABASE SYNC HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #091b2c 0%, #0f2d4a 60%, #1e3a5f 100%)",
          color: "#ffffff",
          padding: "48px 24px 36px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Breadcrumb & Live Database Ticker */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  color: "#34d399",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "0.5px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 10px #10b981",
                    display: "inline-block",
                  }}
                ></span>
                REALTIME DATABASE SYNC ACTIVE
              </span>

              <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                {secondsAgo === 0 ? "Synced just now" : `Synced ${secondsAgo}s ago`} • Polled every 5m
              </span>
            </div>

            {/* Force Sync Action Button */}
            <button
              onClick={() => loadData(true)}
              disabled={isSyncing}
              className="weather-sync-btn tg-btn-slide-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: isSyncing ? "not-allowed" : "pointer",
              }}
            >
              <span style={{ display: "inline-block", transform: isSyncing ? "rotate(360deg)" : "none", transition: "transform 1s linear" }}>
                🔄
              </span>
              {isSyncing ? "Synchronizing Satellite Radar..." : "Sync Database Now"}
            </button>
          </div>

          {/* Main Title & Description */}
          <div style={{ maxWidth: "860px" }}>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "900",
                lineHeight: "1.2",
                margin: "0 0 12px",
                color: "#ffffff",
                letterSpacing: "-0.5px",
              }}
            >
              Live Weather & Natural Disaster Radar
            </h1>
            <p style={{ fontSize: "16px", color: "#cbd5e1", lineHeight: "1.6", margin: "0 0 24px" }}>
              Automated real-time synchronization tracking natural disasters, seismic tremors, flood warnings,
              and live meteorological microclimates across all <strong>{stats.total} Indian destinations & arterial corridors</strong>.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div
            className="weather-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "14px",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                Total Destinations
              </div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", marginTop: "4px" }}>
                {stats.total}
              </div>
              <div style={{ fontSize: "11px", color: "#38bdf8", marginTop: "4px" }}>
                Monitored 24x7 in Database
              </div>
            </div>

            <div
              style={{
                background: stats.red > 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(255, 255, 255, 0.05)",
                border: stats.red > 0 ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#fca5a5", fontWeight: "700", textTransform: "uppercase" }}>
                🔴 Disaster Zones
              </div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#ef4444", marginTop: "4px" }}>
                {stats.red}
              </div>
              <div style={{ fontSize: "11px", color: "#f87171", marginTop: "4px" }}>
                {stats.red > 0 ? "Routes Closed / Evacuation Active" : "No Critical Hazards"}
              </div>
            </div>

            <div
              style={{
                background: stats.yellow > 0 ? "rgba(234, 179, 8, 0.12)" : "rgba(255, 255, 255, 0.05)",
                border: stats.yellow > 0 ? "1px solid rgba(234, 179, 8, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#fde68a", fontWeight: "700", textTransform: "uppercase" }}>
                🟡 Weather Advisories
              </div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#eab308", marginTop: "4px" }}>
                {stats.yellow}
              </div>
              <div style={{ fontSize: "11px", color: "#facc15", marginTop: "4px" }}>
                Movement with Caution
              </div>
            </div>

            <div
              style={{
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#86efac", fontWeight: "700", textTransform: "uppercase" }}>
                🟢 All Clear & Verified
              </div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#10b981", marginTop: "4px" }}>
                {stats.green}
              </div>
              <div style={{ fontSize: "11px", color: "#4ade80", marginTop: "4px" }}>
                100% Clear Corridors & Fair Weather
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="weather-bulletins-wrapper" style={{ maxWidth: "1280px", margin: "36px auto 0", padding: "0 24px" }}>
        {/* VIEW MODE TABS: REAL-TIME RADAR MAP vs TELEMETRY GRID */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
            background: "#ffffff",
            padding: "10px 16px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setViewMode("RADAR_MAP")}
              style={{
                background: viewMode === "RADAR_MAP" ? "#0f172a" : "#f1f5f9",
                color: viewMode === "RADAR_MAP" ? "#ffffff" : "#475569",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span>🗺️</span> Real-Time Weather Radar Map
            </button>

            <button
              onClick={() => setViewMode("GRID_CARDS")}
              style={{
                background: viewMode === "GRID_CARDS" ? "#0f172a" : "#f1f5f9",
                color: viewMode === "GRID_CARDS" ? "#ffffff" : "#475569",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span>📋</span> All Destination Telemetry Cards ({filteredDestinations.length})
            </button>

            <button
              onClick={() => setViewMode("SPLIT")}
              style={{
                background: viewMode === "SPLIT" ? "#0f172a" : "#f1f5f9",
                color: viewMode === "SPLIT" ? "#ffffff" : "#475569",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span>📊</span> Full Split View
            </button>
          </div>

          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>
            🟢 Live Providers: Tomorrow.io • Open-Meteo • GDACS • USGS • IMD/NDMA • NASA EONET
          </div>
        </div>

        {/* 1.5 EMBEDDED REALTIME WEATHER RADAR MAP */}
        {(viewMode === "RADAR_MAP" || viewMode === "SPLIT") && (
          <EmergencyRadarMap
            alerts={radarMapAlerts}
            selectedDestination={selectedDestination?.name || "Manali"}
            onSelectDestination={(destName) => {
              const found = destinations.find(
                (d) => d.name.toLowerCase() === destName.toLowerCase()
              );
              if (found) {
                handleOpenDetails(found);
              }
            }}
          />
        )}

        {/* 2. REAL-TIME DISASTER WARNING TICKER (IF ACTIVE) */}
        {activeCriticalAlerts.length > 0 && (viewMode === "GRID_CARDS" || viewMode === "SPLIT") && (
          <div
            style={{
              background: "#ffffff",
              border: "2px solid #ef4444",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "28px",
              boxShadow: "0 10px 25px rgba(239, 68, 68, 0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "24px" }}>🚨</span>
              <strong style={{ fontSize: "18px", color: "#991b1b" }}>
                REALTIME NATURAL DISASTER BULLETINS: TRAVEL HAZARDS SUSPENDED
              </strong>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeCriticalAlerts.map((dest) => (
                <div
                  key={dest.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    background: "#fef2f2",
                    padding: "14px 18px",
                    borderRadius: "10px",
                    borderLeft: "5px solid #ef4444",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: "#dc2626",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        🔴 {dest.disaster.hazardType || "DISASTER ZONE"}
                      </span>
                      <strong style={{ fontSize: "16px", color: "#0f172a" }}>
                        {dest.name} ({dest.state})
                      </strong>
                      <span style={{ fontSize: "13px", color: "#64748b" }}>
                        • Corridor: <strong>{dest.corridor}</strong>
                      </span>
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#475569" }}>
                      {dest.disaster.description}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleOpenDetails(dest)}
                      className="weather-radar-action-btn tg-btn-slide-up"
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Inspect Telemetry
                    </button>
                    <Link
                      to={`/emergency-hub?dest=${encodeURIComponent(dest.name)}&tab=REPLAN`}
                      className="weather-detour-btn tg-btn-slide-up"
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "700",
                        textDecoration: "none",
                      }}
                    >
                      Safe Detour & Replan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SEARCH & FILTER CONTROLS (Rendered in Grid or Split mode) */}
        {(viewMode === "GRID_CARDS" || viewMode === "SPLIT") && (
        <>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "28px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {/* Search Bar */}
            <div style={{ flex: "1 1 300px", position: "relative" }}>
              <input
                type="text"
                placeholder="Search destination, state, highway corridor (e.g. Manali, Puri, NH-3, Goa)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <span style={{ position: "absolute", left: "14px", top: "12px", fontSize: "16px" }}>
                🔍
              </span>
            </div>

            {/* Region Dropdown */}
            <div style={{ minWidth: "180px" }}>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0f172a",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <option value="ALL">🇮🇳 All Geographic Zones</option>
                <option value="HIMALAYAS">🏔️ Himalayas (HP, UK, J&K, Ladakh)</option>
                <option value="SOUTH">🌴 South (Kerala, TN, Karnataka, AP)</option>
                <option value="EAST">🌊 East & Coastline (Bengal, Odisha)</option>
                <option value="WEST">🏰 West & Dunes (Rajasthan, Gujarat, Goa, MH)</option>
                <option value="NORTHEAST">🌿 Northeast (Meghalaya, Assam)</option>
              </select>
            </div>
          </div>

          {/* Tier Filter Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "16px",
              flexWrap: "wrap",
              borderTop: "1px solid #f1f5f9",
              paddingTop: "14px",
            }}
          >
            {[
              { id: "ALL", label: `All Destinations (${stats.total})`, color: "#0f172a" },
              { id: "RED", label: `🔴 Disaster Zones (${stats.red})`, color: "#ef4444" },
              { id: "YELLOW", label: `🟡 Advisories (${stats.yellow})`, color: "#eab308" },
              { id: "RAIN", label: `🌧️ Rain Alerts (${stats.rain})`, color: "#0284c7" },
              { id: "GREEN", label: `🟢 Clear & Sunny (${stats.green})`, color: "#10b981" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setTierFilter(btn.id)}
                className={`weather-filter-btn tg-btn-slide-up ${tierFilter === btn.id ? "active" : ""}`}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: tierFilter === btn.id ? `2px solid ${btn.color}` : "1px solid #cbd5e1",
                  background: tierFilter === btn.id ? btn.color : "#ffffff",
                  color: tierFilter === btn.id ? "#ffffff" : "#475569",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. DESTINATIONS WEATHER & DISASTER GRID */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px", animation: "spin 1.5s infinite linear" }}>
              🛰️
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#0f172a" }}>
              Connecting to Realtime Satellite & Seismic Feeds...
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
              Syncing live radar data for 55 Indian destinations & travel corridors.
            </p>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
            <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#0f172a" }}>
              No destinations match your filter criteria
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#64748b" }}>
              Try searching with another destination name or resetting your safety filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setTierFilter("ALL");
                setRegionFilter("ALL");
              }}
              className="weather-reset-btn tg-btn-slide-up"
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className="weather-destinations-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredDestinations.map((item) => {
              const isRed = item.disaster.alertTier === "RED";
              const isYellow = item.disaster.alertTier === "YELLOW";
              const isRain = item.disaster.isRainAlert;

              return (
                <div
                  key={item.name}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: isRed
                      ? "2px solid #ef4444"
                      : isYellow
                      ? "2px solid #eab308"
                      : "1px solid #e2e8f0",
                    boxShadow: isRed
                      ? "0 8px 24px rgba(239, 68, 68, 0.12)"
                      : "0 4px 12px rgba(0,0,0,0.03)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {/* Top Bar with Hazard Tier */}
                  <div
                    style={{
                      background: isRed
                        ? "#dc2626"
                        : isYellow
                        ? "#d97706"
                        : isRain
                        ? "#0284c7"
                        : "#10b981",
                      color: "#ffffff",
                      padding: "8px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "11px",
                      fontWeight: "800",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    <span>{item.disaster.badgeLabel}</span>
                    <span>{item.state}</span>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: "20px" }}>
                    {/* Destination Name & Weather Glance */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: "0 0 4px",
                            fontSize: "22px",
                            fontWeight: "800",
                            color: "#0f172a",
                          }}
                        >
                          {item.name}
                        </h3>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          Corridor: <strong>{item.corridor}</strong>
                        </span>
                      </div>

                      {/* Live Temp & Icon */}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "30px" }}>{item.weather.icon || "🌤️"}</span>
                          <span style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a" }}>
                            {item.weather.temperature}°C
                          </span>
                        </div>
                        <span style={{ fontSize: "12px", color: "#475569", fontWeight: "600" }}>
                          {item.weather.condition}
                        </span>
                      </div>
                    </div>

                    {/* Meteorological Telemetry Chips */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "8px",
                        background: "#f8fafc",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        marginBottom: "16px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      <div>
                        <div style={{ color: "#64748b", fontSize: "11px" }}>Feels Like</div>
                        <strong style={{ color: "#0f172a" }}>{item.weather.apparentTemperature}°C</strong>
                      </div>
                      <div>
                        <div style={{ color: "#64748b", fontSize: "11px" }}>Wind / Gusts</div>
                        <strong style={{ color: "#0f172a" }}>{item.weather.windSpeed} / {item.weather.windGusts} km/h</strong>
                      </div>
                      <div>
                        <div style={{ color: "#64748b", fontSize: "11px" }}>Precipitation</div>
                        <strong style={{ color: item.weather.precipitation > 0 ? "#0284c7" : "#0f172a" }}>
                          {item.weather.precipitation} mm/h
                        </strong>
                      </div>
                    </div>

                    {/* Route Movement & Hazard Status */}
                    <div
                      style={{
                        background: isRed ? "#fef2f2" : isYellow ? "#fffbeb" : "#f0fdf4",
                        border: `1px solid ${isRed ? "#fca5a5" : isYellow ? "#fde68a" : "#bbf7d0"}`,
                        padding: "12px 14px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        lineHeight: "1.5",
                      }}
                    >
                      <strong
                        style={{
                          display: "block",
                          color: isRed ? "#991b1b" : isYellow ? "#92400e" : "#166534",
                          marginBottom: "4px",
                        }}
                      >
                        {item.disaster.movementStatus}
                      </strong>
                      <p style={{ margin: 0, color: "#334155", fontSize: "12px" }}>
                        {item.disaster.advice || item.disaster.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div
                    style={{
                      padding: "14px 20px",
                      borderTop: "1px solid #f1f5f9",
                      display: "flex",
                      gap: "10px",
                      background: "#fafafa",
                    }}
                  >
                    <button
                      onClick={() => handleOpenDetails(item)}
                      className="weather-forecast-btn tg-btn-slide-up"
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      🌦️ 7-Day Forecast
                    </button>

                    {isRed ? (
                      <Link
                        to={`/emergency-hub?dest=${encodeURIComponent(item.name)}&tab=REPLAN`}
                        className="weather-detour-btn tg-btn-slide-up"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "center",
                          display: "inline-block",
                          textDecoration: "none",
                        }}
                      >
                        🔄 Safe Detour
                      </Link>
                    ) : (
                      <Link
                        to={`/planner?destination=${encodeURIComponent(item.name)}`}
                        className="weather-plan-btn tg-btn-slide-up"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "center",
                          display: "inline-block",
                          textDecoration: "none",
                        }}
                      >
                        🧭 Plan Trip Here
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </>
        )}
      </div>

      {/* 5. DETAILED FORECAST & DISASTER MODAL */}
      {detailModalOpen && selectedDestination && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setDetailModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              maxWidth: "780px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              padding: "28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <span
                  style={{
                    background: selectedDestination.disaster.colorCode,
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "800",
                    padding: "3px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {selectedDestination.disaster.badgeLabel}
                </span>
                <h2 style={{ margin: "8px 0 2px", fontSize: "24px", color: "#0f172a", fontWeight: "900" }}>
                  {selectedDestination.name} ({selectedDestination.state})
                </h2>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Monitored Corridor: <strong>{selectedDestination.corridor}</strong> • Basin: {selectedDestination.river}
                </span>
              </div>

              <button
                onClick={() => setDetailModalOpen(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Current Realtime Weather Telemetry */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "14px",
                marginBottom: "24px",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Current Temperature</span>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a" }}>
                  {selectedDestination.weather.temperature}°C ({selectedDestination.weather.condition})
                </div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Wind & Storm Gusts</span>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a" }}>
                  {selectedDestination.weather.windGusts} km/h
                </div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Precipitation Rate</span>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "#0284c7" }}>
                  {selectedDestination.weather.precipitation} mm/h
                </div>
              </div>
            </div>

            {/* Natural Disaster Bulletin Section */}
            <div
              style={{
                background: selectedDestination.disaster.alertTier === "RED"
                  ? "#fef2f2"
                  : selectedDestination.disaster.alertTier === "YELLOW"
                  ? "#fffbeb"
                  : "#f0fdf4",
                border: `1.5px solid ${
                  selectedDestination.disaster.alertTier === "RED"
                    ? "#ef4444"
                    : selectedDestination.disaster.alertTier === "YELLOW"
                    ? "#eab308"
                    : "#10b981"
                }`,
                borderRadius: "14px",
                padding: "18px",
                marginBottom: "24px",
              }}
            >
              <h4 style={{ margin: "0 0 8px", fontSize: "16px", color: "#0f172a" }}>
                🛡️ Live Disaster & Movement Protocol: {selectedDestination.disaster.title}
              </h4>
              <p style={{ margin: "0 0 10px", fontSize: "13px", lineHeight: "1.6", color: "#334155" }}>
                {selectedDestination.disaster.description}
              </p>
              <div style={{ fontSize: "13px", color: "#1e293b", fontWeight: "600" }}>
                Advice: {selectedDestination.disaster.advice}
              </div>
              {selectedDestination.disaster.safeAlternativeHub && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#475569" }}>
                  Alternative Safe Hub: <strong>{selectedDestination.disaster.safeAlternativeHub}</strong>
                </div>
              )}
            </div>

            {/* 7-Day Meteorological Projections */}
            <div>
              <h4 style={{ margin: "0 0 14px", fontSize: "17px", color: "#0f172a", fontWeight: "800" }}>
                🌦️ 7-Day Meteorological Projections (Open-Meteo Satellite Feed)
              </h4>

              {modalLoading ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  Loading 7-day satellite telemetry...
                </div>
              ) : detailedForecast?.daily?.time ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {detailedForecast.daily.time.map((dayDate, idx) => (
                    <div
                      key={dayDate}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        fontSize: "13px",
                      }}
                    >
                      <strong style={{ minWidth: "100px", color: "#0f172a" }}>
                        {new Date(dayDate).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                      </strong>
                      <div style={{ display: "flex", gap: "16px", color: "#475569" }}>
                        <span>
                          High: <strong>{detailedForecast.daily.temperature_2m_max[idx]}°C</strong>
                        </span>
                        <span>
                          Low: <strong>{detailedForecast.daily.temperature_2m_min[idx]}°C</strong>
                        </span>
                        <span>
                          🌧️ {detailedForecast.daily.precipitation_sum[idx]} mm ({detailedForecast.daily.precipitation_probability_max?.[idx] || 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "#64748b" }}>
                  Hourly forecast data is cached and verified for this location.
                </p>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Link
                to={`/emergency-hub?dest=${encodeURIComponent(selectedDestination.name)}`}
                className="weather-radar-action-btn tg-btn-slide-up"
                style={{
                  textDecoration: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                🚨 Open Emergency Hub
              </Link>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="weather-modal-dismiss-btn tg-btn-slide-up"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
