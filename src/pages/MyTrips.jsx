import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/bookingApi";
import BudgetGuardian from "../components/BudgetGuardian";
import SafetyIntelligence from "../components/SafetyIntelligence";
import { getActiveDisasterAlerts } from "../services/emergencyApi";
import EmergencyReplanner from "../components/EmergencyReplanner";

function MyTrips() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [platformTab, setPlatformTab] = useState("bookings");

  const [activePlan] = useState(() => {
    try {
      const stored = sessionStorage.getItem("travelGurujiPlannerDraft");
      if (stored) {
        const p = JSON.parse(stored);
        if (p?.formData) return p;
      }
    } catch {}
    return null;
  });

  // Modal states
  const [activeTicket, setActiveTicket] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState("");

  // Disaster & Route Risk states
  const [disasterAlerts, setDisasterAlerts] = useState([]);
  const [activeReplanBooking, setActiveReplanBooking] = useState(null);

  const userEmail = useMemo(() => {
    try {
      const stored = localStorage.getItem("travelGurujiUser");
      if (stored) {
        const u = JSON.parse(stored);
        return u.email || "";
      }
    } catch {
      // Ignore
    }
    return "";
  }, []);

  useEffect(() => {
    loadBookings();
  }, [userEmail]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyBookings(userEmail);
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setError("Unable to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await getActiveDisasterAlerts();
        if (res && res.alerts) setDisasterAlerts(res.alerts);
      } catch (e) {
        console.warn("Could not load disaster alerts for trips:", e);
      }
    }
    fetchAlerts();
  }, []);

  const criticalAlerts = useMemo(() => {
    if (!disasterAlerts.length) return [];
    const tripDests = new Set();
    bookings.forEach((b) => {
      const dest =
        b.hotelDetails?.destination ||
        b.transportDetails?.destination ||
        b.activityDetails?.location ||
        "";
      if (dest) tripDests.add(dest.toLowerCase().trim());
    });
    if (activePlan?.formData?.destination) {
      tripDests.add(activePlan.formData.destination.toLowerCase().trim());
    }

    return disasterAlerts.filter((alert) => {
      const isRed = alert.alertTier === "RED" || alert.severity === "CRITICAL" || alert.isDisasterZone;
      if (!isRed) return false;
      const alertDest = (alert.destination || "").toLowerCase().trim();
      return Array.from(tripDests).some(
        (td) => td.includes(alertDest) || alertDest.includes(td)
      );
    });
  }, [disasterAlerts, bookings, activePlan]);

  const advisoryAlerts = useMemo(() => {
    if (!disasterAlerts.length) return [];
    const tripDests = new Set();
    bookings.forEach((b) => {
      const dest =
        b.hotelDetails?.destination ||
        b.transportDetails?.destination ||
        b.activityDetails?.location ||
        "";
      if (dest) tripDests.add(dest.toLowerCase().trim());
    });
    if (activePlan?.formData?.destination) {
      tripDests.add(activePlan.formData.destination.toLowerCase().trim());
    }

    return disasterAlerts.filter((alert) => {
      const isYellow = alert.alertTier === "YELLOW" || alert.severity === "WARNING" || alert.isModerateAdvisory;
      if (!isYellow) return false;
      const alertDest = (alert.destination || "").toLowerCase().trim();
      return Array.from(tripDests).some(
        (td) => td.includes(alertDest) || alertDest.includes(td)
      );
    });
  }, [disasterAlerts, bookings, activePlan]);

  const affectedAlerts = useMemo(() => {
    return [...criticalAlerts, ...advisoryAlerts];
  }, [criticalAlerts, advisoryAlerts]);

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;

    try {
      setCancelLoading(true);
      const res = await cancelBooking(cancellingBooking.bookingReference);
      setCancelSuccessMsg(res.message || "Booking successfully cancelled.");

      // Refresh list
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingReference === cancellingBooking.bookingReference
            ? { ...b, bookingStatus: "Cancelled", paymentStatus: "Refunded" }
            : b
        )
      );

      setTimeout(() => {
        setCancellingBooking(null);
        setCancelSuccessMsg("");
      }, 1500);
    } catch (err) {
      console.error("Cancellation error:", err);
      alert("Failed to cancel reservation: " + err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Type tab
      let matchType = true;
      if (selectedType === "Hotel") matchType = b.itemType === "Hotel";
      if (selectedType === "Transport") matchType = b.itemType === "Transport";
      if (selectedType === "Activity") matchType = b.itemType === "Activity";

      // Search
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchType;

      const refMatch = b.bookingReference?.toLowerCase().includes(q);
      const hotelName = b.hotelDetails?.name?.toLowerCase().includes(q);
      const destName = (b.hotelDetails?.destination || b.transportDetails?.destination || b.activityDetails?.location || "")
        .toLowerCase()
        .includes(q);
      const opName = b.transportDetails?.operator?.toLowerCase().includes(q);
      const actName = b.activityDetails?.activityName?.toLowerCase().includes(q);

      return matchType && (refMatch || hotelName || destName || opName || actName);
    });
  }, [bookings, selectedType, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: bookings.length,
      hotels: bookings.filter((b) => b.itemType === "Hotel").length,
      transport: bookings.filter((b) => b.itemType === "Transport").length,
      activities: bookings.filter((b) => b.itemType === "Activity").length,
    };
  }, [bookings]);

  return (
    <main className="my-trips-page">
      <div className="my-trips-background"></div>

      <div className="my-trips-container">
        {/* HEADER */}
        <header className="my-trips-header">
          <p className="hotels-eyebrow">UNIFIED TRAVEL PLATFORM</p>
          <h1>My Journey Hub</h1>
          <p className="hotels-subtitle">
            Your unified command center: manage confirmed reservations, day-wise itineraries, Budget Guardian, and Women Safety & SOS.
          </p>

          {/* UNIFIED PLATFORM TABS */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={() => setPlatformTab("bookings")}
              style={{
                padding: "9px 20px",
                borderRadius: "24px",
                border: "1px solid " + (platformTab === "bookings" ? "#0284c7" : "#cbd5e1"),
                background: platformTab === "bookings" ? "#0284c7" : "#fff",
                color: platformTab === "bookings" ? "#fff" : "#334155",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.88rem"
              }}
            >
              🎟️ Confirmed Bookings ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setPlatformTab("itinerary")}
              style={{
                padding: "9px 20px",
                borderRadius: "24px",
                border: "1px solid " + (platformTab === "itinerary" ? "#8b5cf6" : "#cbd5e1"),
                background: platformTab === "itinerary" ? "#8b5cf6" : "#fff",
                color: platformTab === "itinerary" ? "#fff" : "#334155",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.88rem"
              }}
            >
              📑 Active Plan & Itinerary
            </button>
            <button
              type="button"
              onClick={() => setPlatformTab("budget")}
              style={{
                padding: "9px 20px",
                borderRadius: "24px",
                border: "1px solid " + (platformTab === "budget" ? "#10b981" : "#cbd5e1"),
                background: platformTab === "budget" ? "#10b981" : "#fff",
                color: platformTab === "budget" ? "#fff" : "#334155",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.88rem"
              }}
            >
              💰 Budget Guardian
            </button>
            <button
              type="button"
              onClick={() => setPlatformTab("disasters")}
              style={{
                padding: "9px 20px",
                borderRadius: "24px",
                border:
                  "1px solid " +
                  (platformTab === "disasters"
                    ? "#dc2626"
                    : affectedAlerts.length > 0
                    ? "#ef4444"
                    : "#cbd5e1"),
                background:
                  platformTab === "disasters"
                    ? "#dc2626"
                    : affectedAlerts.length > 0
                    ? "#fef2f2"
                    : "#fff",
                color:
                  platformTab === "disasters"
                    ? "#fff"
                    : affectedAlerts.length > 0
                    ? "#b91c1c"
                    : "#334155",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.88rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🌪️ Route & Disaster Alerts</span>
              {affectedAlerts.length > 0 && (
                <span
                  style={{
                    background: "#dc2626",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "1px 6px",
                    fontSize: "11px",
                  }}
                >
                  {affectedAlerts.length} Active
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setPlatformTab("safety")}
              style={{
                padding: "9px 20px",
                borderRadius: "24px",
                border: "1px solid " + (platformTab === "safety" ? "#ec4899" : "#cbd5e1"),
                background: platformTab === "safety" ? "#ec4899" : "#fff",
                color: platformTab === "safety" ? "#fff" : "#334155",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.88rem"
              }}
            >
              🛡️ Women Safety & SOS Hub
            </button>
          </div>
        </header>

        {/* REAL-TIME CRITICAL TRIP RISK ALERT BANNER */}
        {criticalAlerts.length > 0 && (
          <div
            style={{
              background: "#fef2f2",
              border: "2px solid #ef4444",
              borderRadius: "14px",
              padding: "18px 24px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              boxShadow: "0 6px 18px rgba(239, 68, 68, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "32px" }}>🚨</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    CRITICAL TRIP RISK ALERT
                  </span>
                  <span style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: 700 }}>
                    Affecting: {criticalAlerts.map((a) => a.destination).join(", ")}
                  </span>
                </div>
                <h3 style={{ margin: "4px 0 2px", fontSize: "17px", fontWeight: 800, color: "#991b1b" }}>
                  {criticalAlerts[0].title}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#7f1d1d" }}>
                  Active disaster zone. Routes suspended under NDMA alert. Your booking is protected under 100% Escrow Refund Guarantee.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => setPlatformTab("disasters")}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🔄 Replan Route & 100% Refund
              </button>
              <Link
                to={`/emergency?dest=${encodeURIComponent(criticalAlerts[0].destination)}`}
                style={{
                  background: "#0f172a",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                🚨 Emergency Hub & Chat
              </Link>
            </div>
          </div>
        )}

        {/* REAL-TIME CAUTION ADVISORY BANNER */}
        {criticalAlerts.length === 0 && advisoryAlerts.length > 0 && (
          <div
            style={{
              background: "#fffbeb",
              border: "1.5px solid #fde68a",
              borderLeft: "5px solid #f59e0b",
              borderRadius: "14px",
              padding: "16px 22px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "28px" }}>🟡</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      background: "#d97706",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    WEATHER / TERRAIN ADVISORY
                  </span>
                  <span style={{ color: "#78350f", fontSize: "12px", fontWeight: 700 }}>
                    Affecting: {advisoryAlerts.map((a) => a.destination).join(", ")}
                  </span>
                </div>
                <h3 style={{ margin: "4px 0 2px", fontSize: "16px", fontWeight: 800, color: "#92400e" }}>
                  {advisoryAlerts[0].title}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#78350f" }}>
                  Movement is feasible with caution. All National Highway corridors and rail lines currently remain open.
                </p>
              </div>
            </div>

            <Link
              to={`/emergency?dest=${encodeURIComponent(advisoryAlerts[0].destination)}`}
              style={{
                background: "#d97706",
                color: "#fff",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Inspect Advisory Details ➔
            </Link>
          </div>
        )}

        {platformTab === "bookings" && (
          <>
            {/* CONTROLS BAR */}
            <div className="my-trips-controls">
          <div className="my-trips-tabs">
            <button
              type="button"
              className={`trip-tab-btn ${selectedType === "All" ? "active" : ""}`}
              onClick={() => setSelectedType("All")}
            >
              All Bookings ({counts.all})
            </button>
            <button
              type="button"
              className={`trip-tab-btn ${selectedType === "Hotel" ? "active" : ""}`}
              onClick={() => setSelectedType("Hotel")}
            >
              🏨 Stays ({counts.hotels})
            </button>
            <button
              type="button"
              className={`trip-tab-btn ${selectedType === "Transport" ? "active" : ""}`}
              onClick={() => setSelectedType("Transport")}
            >
              🚆 Transport ({counts.transport})
            </button>
            <button
              type="button"
              className={`trip-tab-btn ${selectedType === "Activity" ? "active" : ""}`}
              onClick={() => setSelectedType("Activity")}
            >
              🎯 Activities ({counts.activities})
            </button>
          </div>

          <div className="my-trips-search">
            <input
              type="text"
              placeholder="Search reference, hotel, flight, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="home-search-clear"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="no-hotels">
            <div>⏳</div>
            <h3>Loading your travel bookings...</h3>
            <p>Fetching your confirmed reservations and e-tickets.</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && bookings.length === 0 && (
          <div className="no-hotels">
            <div>⚠️</div>
            <h3>Unable to load bookings</h3>
            <p>{error}</p>
          </div>
        )}

        {/* BOOKINGS LIST */}
        {!loading && (
          <div className="my-trips-list">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => {
                const isHotel = b.itemType === "Hotel";
                const isTransport = b.itemType === "Transport";
                const isActivity = b.itemType === "Activity";
                const isCancelled = b.bookingStatus === "Cancelled";

                const itemDestination = (
                  b.hotelDetails?.destination ||
                  b.transportDetails?.destination ||
                  b.activityDetails?.location ||
                  ""
                ).toLowerCase().trim();

                const cardDisaster = disasterAlerts.find(
                  (a) =>
                    a.destination.toLowerCase() === itemDestination ||
                    (itemDestination && itemDestination.includes(a.destination.toLowerCase())) ||
                    (itemDestination && a.destination.toLowerCase().includes(itemDestination))
                );

                return (
                  <article className={`my-trip-card ${isCancelled ? "cancelled" : ""}`} key={b._id || b.bookingReference}>
                    <div className="trip-card-top">
                      <div className="trip-type-badge">
                        <span>{isHotel ? "🏨 Hotel Stay" : isTransport ? "🚆 Transport" : "🎯 Activity"}</span>
                        <strong className="booking-ref-tag">{b.bookingReference}</strong>
                        {b.isDemoMode && (
                          <small className="demo-mode-tag" style={{ color: "#34d399", background: "rgba(16, 185, 129, 0.15)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
                            [CONFIRMED]
                          </small>
                        )}
                      </div>

                      <div className="trip-status-badge" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {cardDisaster && (cardDisaster.alertTier === "RED" || cardDisaster.severity === "CRITICAL") && (
                          <span
                            style={{
                              background: "#dc2626",
                              color: "#fff",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "800",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🔴 ROUTE SUSPENDED
                          </span>
                        )}
                        {cardDisaster && (cardDisaster.alertTier === "YELLOW" || cardDisaster.severity === "WARNING") && (
                          <span
                            style={{
                              background: "#d97706",
                              color: "#fff",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "800",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🟡 ADVISORY
                          </span>
                        )}
                        {cardDisaster && cardDisaster.isRainAlert && (
                          <span
                            style={{
                              background: "#059669",
                              color: "#fff",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "800",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🌧️ RAIN ALERT
                          </span>
                        )}
                        <span className={`status-pill ${isCancelled ? "cancelled" : "confirmed"}`}>
                          ● {b.bookingStatus}
                        </span>
                      </div>
                    </div>

                    <div className="trip-card-body">
                      {/* HOTEL DETAILS */}
                      {isHotel && (
                        <div className="trip-details-grid">
                          <div>
                            <h3>{b.hotelDetails?.name || "Hotel Reservation"}</h3>
                            <p className="trip-destination">📍 {b.hotelDetails?.destination}</p>
                            <span className="trip-subtext">{b.hotelDetails?.roomType}</span>
                          </div>

                          <div className="trip-meta-col">
                            <small>CHECK-IN / OUT</small>
                            <strong>{b.hotelDetails?.checkIn} → {b.hotelDetails?.checkOut}</strong>
                            <span>{b.hotelDetails?.nights} nights • {b.hotelDetails?.roomsCount || 1} room</span>
                          </div>

                          <div className="trip-meta-col">
                            <small>GUEST</small>
                            <strong>{b.guestDetails?.fullName}</strong>
                            <span>{b.guestDetails?.email}</span>
                          </div>

                          <div className="trip-price-col">
                            <small>TOTAL PAID</small>
                            <strong className="trip-price-amount">
                              ₹{Number(b.totalAmount || 0).toLocaleString("en-IN")}
                            </strong>
                            <span className="payment-status">{b.paymentStatus}</span>
                          </div>
                        </div>
                      )}

                      {/* TRANSPORT DETAILS */}
                      {isTransport && (
                        <div className="trip-details-grid">
                          <div>
                            <h3>{b.transportDetails?.identifier || b.transportDetails?.operator}</h3>
                            <p className="trip-destination">
                              {b.transportDetails?.origin} → {b.transportDetails?.destination}
                            </p>
                            <span className="trip-subtext">
                              {b.transportDetails?.type} • {b.transportDetails?.seatClass}
                            </span>
                          </div>

                          <div className="trip-meta-col">
                            <small>DEPARTURE TIME & DATE</small>
                            <strong>{b.transportDetails?.departureTime}</strong>
                            <span>Date: {b.transportDetails?.travelDate}</span>
                          </div>

                          <div className="trip-meta-col">
                            <small>PASSENGER</small>
                            <strong>{b.guestDetails?.fullName}</strong>
                            <span>{b.transportDetails?.passengersCount || 1} Passenger(s)</span>
                          </div>

                          <div className="trip-price-col">
                            <small>TOTAL FARE</small>
                            <strong className="trip-price-amount">
                              ₹{Number(b.totalAmount || 0).toLocaleString("en-IN")}
                            </strong>
                            <span className="payment-status">{b.paymentStatus}</span>
                          </div>
                        </div>
                      )}

                      {/* ACTIVITY DETAILS */}
                      {isActivity && (
                        <div className="trip-details-grid">
                          <div>
                            <h3>{b.activityDetails?.activityName || "Activity Pass"}</h3>
                            <p className="trip-destination">📍 {b.activityDetails?.location}</p>
                            <span className="trip-subtext">{b.activityDetails?.category || "Outdoor Adventure"}</span>
                          </div>

                          <div className="trip-meta-col">
                            <small>DATE & TIME SLOT</small>
                            <strong>{b.activityDetails?.date}</strong>
                            <span>{b.activityDetails?.timeSlot}</span>
                          </div>

                          <div className="trip-meta-col">
                            <small>PRIMARY GUEST</small>
                            <strong>{b.guestDetails?.fullName}</strong>
                            <span>{b.activityDetails?.ticketsCount || 1} Participant(s)</span>
                          </div>

                          <div className="trip-price-col">
                            <small>AMOUNT</small>
                            <strong className="trip-price-amount">
                              ₹{Number(b.totalAmount || 0).toLocaleString("en-IN")}
                            </strong>
                            <span className="payment-status">{b.paymentStatus}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {cardDisaster && (cardDisaster.alertTier === "RED" || cardDisaster.severity === "CRITICAL") && (
                      <div
                        style={{
                          background: "#fff5f5",
                          border: "1px solid #fecaca",
                          borderRadius: "10px",
                          padding: "12px 16px",
                          margin: "12px 20px 0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "20px" }}>🚨</span>
                          <div>
                            <strong style={{ color: "#991b1b", fontSize: "13px", display: "block" }}>
                              ROUTE SUSPENDED: {cardDisaster.title}
                            </strong>
                            <span style={{ color: "#7f1d1d", fontSize: "12px" }}>
                              Active disaster in {cardDisaster.destination}. 100% Escrow refund & safe evacuation routes ready.
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            className="trip-replan-refund-btn protected-action-btn"
                            onClick={() => {
                              setActiveReplanBooking(b);
                              setPlatformTab("disasters");
                            }}
                            style={{
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            🔄 Replan Route / Refund
                          </button>
                        </div>
                      </div>
                    )}

                    {cardDisaster && (cardDisaster.alertTier === "YELLOW" || cardDisaster.severity === "WARNING") && (
                      <div
                        style={{
                          background: "#fffbeb",
                          border: "1px solid #fde68a",
                          borderRadius: "10px",
                          padding: "10px 16px",
                          margin: "12px 20px 0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "18px" }}>🟡</span>
                          <div>
                            <strong style={{ color: "#92400e", fontSize: "12.5px", display: "block" }}>
                              WEATHER / TERRAIN ADVISORY: {cardDisaster.title}
                            </strong>
                            <span style={{ color: "#78350f", fontSize: "11.5px" }}>
                              Movement feasible with caution ({cardDisaster.movementStatus}). Corridors are open.
                            </span>
                          </div>
                        </div>
                        <Link
                          to={`/emergency?dest=${encodeURIComponent(cardDisaster.destination)}`}
                          target="_blank"
                          style={{
                            background: "#d97706",
                            color: "#ffffff",
                            textDecoration: "none",
                            borderRadius: "6px",
                            padding: "5px 10px",
                            fontSize: "11.5px",
                            fontWeight: "700",
                          }}
                        >
                          Advisory Details ➔
                        </Link>
                      </div>
                    )}

                    {cardDisaster && cardDisaster.isRainAlert && (
                      <div
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "10px",
                          padding: "8px 16px",
                          margin: "12px 20px 0",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span style={{ fontSize: "18px" }}>🌧️</span>
                        <span style={{ color: "#065f46", fontSize: "12px", fontWeight: "600" }}>
                          <strong>Green Alert • Rain Alert:</strong> Standard rainfall in {cardDisaster.destination}. All tour activities and travel corridors 100% operational.
                        </span>
                      </div>
                    )}

                    {/* CARD FOOTER ACTIONS */}
                    <div className="trip-card-footer">
                      <div className="trip-policy-note">
                        <span>ℹ️ {b.cancellationPolicy || "Free cancellation applicable."}</span>
                      </div>

                      <div className="trip-actions-buttons">
                        <button
                          type="button"
                          className="trip-action-btn view-ticket protected-action-btn"
                          onClick={() => setActiveTicket(b)}
                        >
                          📄 View E-Ticket / Receipt
                        </button>

                        {!isCancelled && (
                          <button
                            type="button"
                            className="trip-action-btn cancel-btn protected-action-btn"
                            onClick={() => setCancellingBooking(b)}
                          >
                            Cancel Reservation
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="no-hotels">
                <div>🧳</div>
                <h3>No bookings found</h3>
                <p>
                  You haven't made any reservations matching this filter yet. Explore hotels, flights, and activities to get started!
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "14px" }}>
                  <Link to="/hotels" className="hotel-button" style={{ textDecoration: "none" }}>
                    Browse Hotels
                  </Link>
                  <Link to="/transport" className="hotel-button" style={{ textDecoration: "none" }}>
                    Find Transport
                  </Link>
                  <Link to="/activities" className="hotel-select-button" style={{ textDecoration: "none" }}>
                    Explore Activities
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
        </>
      )}

      {/* ===================================================
          ACTIVE PLAN & ITINERARY TAB
          =================================================== */}
      {platformTab === "itinerary" && (
        <div style={{ marginTop: "2rem" }}>
          {activePlan?.formData ? (
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "28px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", marginBottom: "20px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#6366f1" }}>
                    ACTIVE TRIP PLAN
                  </span>
                  <h2 style={{ margin: "4px 0 0", color: "#0f172a", fontSize: "24px" }}>
                    {activePlan.formData.destination} Getaway
                  </h2>
                  <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                    Starting from {activePlan.formData.origin || "Delhi"} • {activePlan.formData.days} Days • {activePlan.formData.persons} Travelers
                  </p>
                </div>
                <span style={{ background: "#ecfdf5", color: "#059669", padding: "6px 14px", borderRadius: "20px", fontWeight: 700, fontSize: "13px", border: "1px solid #a7f3d0" }}>
                  ● In Progress
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <small style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: 700 }}>Hotel</small>
                  <strong style={{ display: "block", color: "#1e293b", fontSize: "14px", marginTop: "2px" }}>
                    {activePlan.formData.hotel || "Auto-Recommended Stay"}
                  </strong>
                </div>
                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <small style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: 700 }}>Total Budget</small>
                  <strong style={{ display: "block", color: "#1e293b", fontSize: "14px", marginTop: "2px" }}>
                    ₹{Number(activePlan.formData.budget || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <small style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: 700 }}>Pace & Safety</small>
                  <strong style={{ display: "block", color: "#1e293b", fontSize: "14px", marginTop: "2px" }}>
                    {activePlan.formData.tripStyle || "Balanced"} • {activePlan.formData.safetyPref || "Standard"}
                  </strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Link
                  to="/plan-history"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none"
                  }}
                >
                  🗂️ View All in Plan History
                </Link>
                <Link
                  to={`/trip-plan?destination=${encodeURIComponent(activePlan.formData.destination)}&origin=${encodeURIComponent(activePlan.formData.origin || "")}&days=${activePlan.formData.days}&budget=${activePlan.formData.budget}&persons=${activePlan.formData.persons}&startDate=${activePlan.formData.startDate || ""}&hotel=${encodeURIComponent(activePlan.formData.hotel || "")}`}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none"
                  }}
                >
                  Open Interactive Day Guide ➔
                </Link>
              </div>
            </div>
          ) : (
            <div className="no-hotels" style={{ background: "#fff", borderRadius: "16px", padding: "40px" }}>
              <div>🗺️</div>
              <h3>No Active Plan Draft Found</h3>
              <p>You can check your saved plan history or generate a fresh day-wise itinerary with budget calibration.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
                <Link to="/plan-history" className="hotel-button" style={{ textDecoration: "none" }}>
                  🗂️ View Plan History
                </Link>
                <Link to="/planner" className="hotel-select-button" style={{ textDecoration: "none" }}>
                  ✨ Create New Plan
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================
          BUDGET GUARDIAN TAB
          =================================================== */}
      {platformTab === "budget" && (
        <div style={{ marginTop: "2rem" }}>
          <BudgetGuardian
            destination={activePlan?.formData?.destination || (bookings[0]?.hotelDetails?.destination || bookings[0]?.transportDetails?.destination) || "India"}
            totalBudget={Number(activePlan?.formData?.budget) || 30000}
            persons={Number(activePlan?.formData?.persons) || 2}
            days={Number(activePlan?.formData?.days) || 3}
            hotelCost={6500}
            transportCost={4200}
          />
        </div>
      )}

      {/* ===================================================
          ROUTE & DISASTER RISK TAB
          =================================================== */}
      {platformTab === "disasters" && (
        <div style={{ marginTop: "2rem", maxWidth: "980px", margin: "2rem auto 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#dc2626",
                }}
              >
                REAL-TIME DISASTER INTELLIGENCE
              </span>
              <h2 style={{ margin: "4px 0 0", color: "#0f172a", fontSize: "24px" }}>
                Route Risk Alerts & Evacuation Replanner
              </h2>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                Verified NDMA & IMD weather/geological alerts affecting your journey routes.
              </p>
            </div>

            <Link
              to={`/emergency?dest=${encodeURIComponent(
                activeReplanBooking?.hotelDetails?.destination ||
                  activeReplanBooking?.transportDetails?.destination ||
                  affectedAlerts[0]?.destination ||
                  "Manali"
              )}`}
              style={{
                background: "#ef4444",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
              }}
            >
              🚨 Open Full Crisis Hub & Chat
            </Link>
          </div>

          <EmergencyReplanner
            origin={activeReplanBooking?.transportDetails?.origin || "Delhi"}
            destination={
              activeReplanBooking?.hotelDetails?.destination ||
              activeReplanBooking?.transportDetails?.destination ||
              affectedAlerts[0]?.destination ||
              "Manali"
            }
            bookingReference={
              activeReplanBooking?.bookingReference || "TG-DISASTER-PROTECTED"
            }
          />
        </div>
      )}

      {/* ===================================================
          WOMEN SAFETY & SOS TAB
          =================================================== */}
      {platformTab === "safety" && (
        <div style={{ marginTop: "2rem", maxWidth: "900px", margin: "2rem auto 0" }}>
          <SafetyIntelligence
            destination={activePlan?.formData?.destination || (bookings[0]?.hotelDetails?.destination || bookings[0]?.transportDetails?.destination) || "Shimla"}
          />
        </div>
      )}
      </div>

      {/* ===================================================
          E-TICKET / RECEIPT MODAL
          =================================================== */}
      {activeTicket && (
        <div className="hotel-modal-overlay" onClick={() => setActiveTicket(null)}>
          <div className="hotel-modal-container ticket-modal-view" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hotel-modal-close-btn"
              onClick={() => setActiveTicket(null)}
            >
              ✕
            </button>

            <div className="ticket-printable-content" id="printable-ticket">
              <div className="ticket-header-strip">
                <div className="ticket-brand">
                  <h2>
                    <span className="logo-text" style={{ fontSize: "28px" }}>Travel<span>_Guruji</span></span>
                  </h2>
                  <span>Official Booking Confirmation & E-Ticket</span>
                </div>
                <div className="ticket-demo-stamp">
                  <span>CONFIRMED RESERVATION</span>
                  <small>[VERIFIED TICKET]</small>
                </div>
              </div>

              <div className="ticket-reference-bar">
                <div>
                  <small>BOOKING REFERENCE</small>
                  <strong>{activeTicket.bookingReference}</strong>
                </div>
                <div>
                  <small>ISSUED ON</small>
                  <span>{new Date(activeTicket.createdAt || activeTicket.confirmedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div>
                  <small>STATUS</small>
                  <span className={`status-pill ${activeTicket.bookingStatus === "Cancelled" ? "cancelled" : "confirmed"}`}>
                    ● {activeTicket.bookingStatus}
                  </span>
                </div>
              </div>

              <div className="ticket-main-section">
                <h3>
                  {activeTicket.itemType === "Hotel"
                    ? activeTicket.hotelDetails?.name
                    : activeTicket.itemType === "Transport"
                    ? activeTicket.transportDetails?.identifier || activeTicket.transportDetails?.operator
                    : activeTicket.activityDetails?.activityName}
                </h3>
                <p className="ticket-subtitle">
                  {activeTicket.itemType === "Hotel"
                    ? `📍 ${activeTicket.hotelDetails?.destination} • ${activeTicket.hotelDetails?.roomType}`
                    : activeTicket.itemType === "Transport"
                    ? `🚆 ${activeTicket.transportDetails?.origin} → ${activeTicket.transportDetails?.destination} • ${activeTicket.transportDetails?.seatClass}`
                    : `🎯 ${activeTicket.activityDetails?.location} • ${activeTicket.activityDetails?.category}`}
                </p>

                <div className="ticket-grid-details">
                  <div className="ticket-item">
                    <small>Primary Traveler</small>
                    <strong>{activeTicket.guestDetails?.fullName}</strong>
                  </div>
                  <div className="ticket-item">
                    <small>Email</small>
                    <strong>{activeTicket.guestDetails?.email}</strong>
                  </div>
                  <div className="ticket-item">
                    <small>Schedule / Dates</small>
                    <strong>
                      {activeTicket.itemType === "Hotel"
                        ? `${activeTicket.hotelDetails?.checkIn} to ${activeTicket.hotelDetails?.checkOut}`
                        : activeTicket.itemType === "Transport"
                        ? `${activeTicket.transportDetails?.travelDate} at ${activeTicket.transportDetails?.departureTime}`
                        : `${activeTicket.activityDetails?.date} at ${activeTicket.activityDetails?.timeSlot}`}
                    </strong>
                  </div>
                  <div className="ticket-item">
                    <small>Total Amount Paid</small>
                    <strong className="ticket-grand-total">
                      ₹{Number(activeTicket.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="ticket-barcode-simulator">
                  <div className="barcode-bars">
                    ||||| | |||| || | |||||| |||| | || ||||| ||||||| | ||||| |||| |
                  </div>
                  <small>Verification Code: {activeTicket.bookingReference}</small>
                </div>
              </div>

              <div className="ticket-footer-notice">
                <p>✓ Please carry a valid government ID (Aadhaar, Driving License, or Passport) at check-in / boarding.</p>
                <p>✓ Need assistance? Contact Travel Guruji 24x7 helpline: support@travelguruji.in</p>
              </div>

              <div className="ticket-modal-actions">
                <button
                  type="button"
                  className="hotel-modal-submit-btn"
                  onClick={() => window.print()}
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  type="button"
                  className="hotel-detail-back-button"
                  onClick={() => setActiveTicket(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          CANCELLATION CONFIRMATION MODAL
          =================================================== */}
      {cancellingBooking && (
        <div className="hotel-modal-overlay" onClick={() => !cancelLoading && setCancellingBooking(null)}>
          <div className="hotel-modal-container" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div className="cancel-modal-content">
              <span style={{ fontSize: "36px" }}>⚠️</span>
              <h2>Cancel Reservation?</h2>
              <p>
                Are you sure you want to cancel reservation <strong>{cancellingBooking.bookingReference}</strong>?
              </p>

              <div className="hotel-modal-summary-box" style={{ textAlign: "left" }}>
                <div className="hotel-modal-summary-item">
                  <span>Refund Amount</span>
                  <strong className="price-tag">
                    ₹{Number(cancellingBooking.totalAmount || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
                <div className="hotel-modal-summary-item">
                  <span>Policy</span>
                  <span>100% full refund simulated</span>
                </div>
              </div>

              {cancelSuccessMsg && (
                <div className="hotel-modal-success" style={{ padding: "0 0 14px" }}>
                  <span style={{ color: "#166534", fontWeight: "bold" }}>✓ {cancelSuccessMsg}</span>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button
                  type="button"
                  className="hotel-detail-back-button protected-action-btn"
                  disabled={cancelLoading}
                  onClick={() => setCancellingBooking(null)}
                >
                  Keep Booking
                </button>

                <button
                  type="button"
                  className="trip-action-btn cancel-btn protected-action-btn"
                  style={{ height: "46px", fontSize: "14px" }}
                  disabled={cancelLoading}
                  onClick={handleCancelBooking}
                >
                  {cancelLoading ? "Processing..." : "Confirm Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default MyTrips;

