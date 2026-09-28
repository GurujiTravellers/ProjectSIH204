import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { getApiBaseUrl } from "../config/apiConfig";
import { showToast } from "../components/Toast";
import { fetchLiveSyncedDestinations, forceWeatherSync } from "../services/weatherApi";

const RealtimeDisasterContext = createContext(null);

export function RealtimeDisasterProvider({ children }) {
  const [destinations, setDestinations] = useState([]);
  const [stats, setStats] = useState({
    totalDestinations: 0,
    disasterZones: 0,
    moderateAdvisories: 0,
    rainAlerts: 0,
    normalClear: 0,
  });
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [recentTimeline, setRecentTimeline] = useState([]);

  // Track known active disaster IDs to fire real-time toast alert when a new disaster strikes
  const knownDisasterIdsRef = useRef(new Set());
  const isInitialLoadRef = useRef(true);
  const sseRef = useRef(null);

  // Process incoming database payload
  const handleDatabaseUpdate = useCallback((data) => {
    if (!data) return;

    let destList = [];
    if (Array.isArray(data.destinations)) {
      destList = data.destinations;
    } else if (data.destinations && typeof data.destinations === "object") {
      destList = Object.values(data.destinations);
    }

    if (destList.length > 0) {
      setDestinations(destList);

      // Check for new real-time disasters to alert user immediately
      const currentActive = destList.filter(
        (d) => d.disaster?.alertTier === "RED" || d.disaster?.alertTier === "YELLOW"
      );

      if (!isInitialLoadRef.current) {
        currentActive.forEach((item) => {
          const id = item.disaster?.activeBulletinId || `${item.name}-${item.disaster?.hazardType}`;
          if (!knownDisasterIdsRef.current.has(id)) {
            // Brand new real-time disaster detected
            knownDisasterIdsRef.current.add(id);
            if (item.disaster?.alertTier === "RED") {
              showToast(
                `🚨 REALTIME DISASTER ALERT: ${item.disaster.hazardType} reported in ${item.name}! Evacuation routes updated.`,
                "error",
                8000
              );
            } else {
              showToast(
                `⚠️ WEATHER ADVISORY: ${item.disaster.hazardType} advisory in ${item.name}.`,
                "warning",
                6000
              );
            }
          }
        });
      } else {
        // Record initial active hazards
        currentActive.forEach((item) => {
          const id = item.disaster?.activeBulletinId || `${item.name}-${item.disaster?.hazardType}`;
          knownDisasterIdsRef.current.add(id);
        });
        isInitialLoadRef.current = false;
      }
    }

    if (data.stats) setStats(data.stats);
    if (data.timestamp) setLastSyncTimestamp(data.timestamp);
    if (data.timeline) setRecentTimeline(data.timeline);
  }, []);

  // Connect via Server-Sent Events (SSE) for instant push
  useEffect(() => {
    let reconnectTimeout = null;
    let sse = null;

    function connectSSE() {
      try {
        const streamUrl = `${getApiBaseUrl()}/weather/live-stream`;
        sse = new EventSource(streamUrl);
        sseRef.current = sse;

        sse.onopen = () => {
          setIsLiveConnected(true);
        };

        sse.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            handleDatabaseUpdate(parsed);
          } catch (err) {
            console.warn("SSE JSON parse warning:", err);
          }
        };

        sse.onerror = () => {
          setIsLiveConnected(false);
          if (sse) sse.close();
          // Attempt reconnection after 10 seconds
          reconnectTimeout = setTimeout(connectSSE, 10000);
        };
      } catch (e) {
        setIsLiveConnected(false);
      }
    }

    connectSSE();

    // Secondary continuous polling heartbeat (every 25 seconds) to ensure 100% sync reliability
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetchLiveSyncedDestinations();
        if (res && res.destinations) {
          handleDatabaseUpdate({
            destinations: res.destinations,
            stats: res.syncStatus?.stats,
            timestamp: res.syncStatus?.lastSyncTimestamp,
          });
        }
      } catch (err) {
        // Ignore network errors in background polling
      }
    }, 25000);

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (sse) sse.close();
      clearInterval(pollInterval);
    };
  }, [handleDatabaseUpdate]);

  // Initial fetch on mount
  useEffect(() => {
    fetchLiveSyncedDestinations().then((res) => {
      if (res && res.destinations) {
        handleDatabaseUpdate({
          destinations: res.destinations,
          stats: res.syncStatus?.stats,
          timestamp: res.syncStatus?.lastSyncTimestamp,
        });
      }
    });
  }, [handleDatabaseUpdate]);

  // Manual force sync action
  const forceSync = async () => {
    setIsSyncing(true);
    try {
      const res = await forceWeatherSync();
      if (res && res.destinations) {
        handleDatabaseUpdate({
          destinations: res.destinations,
          stats: res.syncStatus?.stats,
          timestamp: res.syncStatus?.lastSyncTimestamp,
        });
        showToast("✓ Realtime Database Synced with Satellite & Seismic Feeds", "success", 3000);
      }
    } catch (e) {
      showToast("Sync failed: " + e.message, "error", 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const activeDisasterZones = destinations.filter((d) => d.disaster?.alertTier === "RED");
  const activeAdvisories = destinations.filter((d) => d.disaster?.alertTier === "YELLOW");

  const value = {
    destinations,
    stats,
    lastSyncTimestamp,
    isLiveConnected,
    isSyncing,
    recentTimeline,
    activeDisasterZones,
    activeAdvisories,
    forceSync,
  };

  return (
    <RealtimeDisasterContext.Provider value={value}>
      {children}
    </RealtimeDisasterContext.Provider>
  );
}

export function useRealtimeDisaster() {
  const context = useContext(RealtimeDisasterContext);
  if (!context) {
    throw new Error("useRealtimeDisaster must be used within a RealtimeDisasterProvider");
  }
  return context;
}
