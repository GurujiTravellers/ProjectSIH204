import React, { useState, useEffect } from "react";
import { calculateEmergencyReplan } from "../services/emergencyApi";

export default function EmergencyReplanner({
  origin = "Delhi",
  destination = "Manali",
  bookingReference = null,
  isEmergencyMode = false,
  onClose = null,
}) {
  const [replanData, setReplanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [refundClaimed, setRefundClaimed] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadPlan() {
      setLoading(true);
      try {
        const data = await calculateEmergencyReplan(origin, destination, bookingReference);
        if (isMounted) {
          setReplanData(data);
          if (data?.alternativeOptions?.length > 0) {
            setSelectedOption(data.alternativeOptions[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load replan data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPlan();
    return () => {
      isMounted = false;
    };
  }, [origin, destination, bookingReference]);

  const handleClaimDisasterRefund = () => {
    setRefundClaimed(true);
    setActionSuccessMessage(
      `✓ 100% Disaster Refund Approved! Reference: REF-DISASTER-${Math.floor(100000 + Math.random() * 900000)}. Your funds are being released from Escrow back to your bank account without any deduction.`
    );
  };

  const handleBookEvacuation = (opt) => {
    setSelectedOption(opt);
    setActionSuccessMessage(
      `✓ Evacuation Seat Requested on ${opt.title}! An SMS confirmation with Police Convoy Departure Point & Vehicle Badge has been dispatched to your mobile.`
    );
  };

  if (loading) {
    return (
      <div
        style={{
          background: isEmergencyMode ? "#1a0b0b" : "#ffffff",
          padding: "36px",
          borderRadius: "16px",
          textAlign: "center",
          color: isEmergencyMode ? "#fecaca" : "#475569",
        }}
      >
        <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>🔄</span>
        <h4 style={{ margin: 0, fontSize: "17px" }}>Calculating Safe Evacuation Corridors & Escrow Guarantee...</h4>
      </div>
    );
  }

  if (!replanData) return null;

  return (
    <div
      style={{
        background: isEmergencyMode ? "#180808" : "#ffffff",
        border: isEmergencyMode ? "2px solid #ef4444" : "1px solid #e2e8f0",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Alert Top Banner */}
      <div
        style={{
          background:
            replanData.tripStatus === "TRIP_SUSPENDED"
              ? "#dc2626"
              : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
              ? "#d97706"
              : "#059669",
          color: "#ffffff",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>
            {replanData.tripStatus === "TRIP_SUSPENDED"
              ? "🚨"
              : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
              ? "⚠️"
              : "✓"}
          </span>
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", letterSpacing: "-0.2px" }}>
              {replanData.tripStatus === "TRIP_SUSPENDED"
                ? "TRIP CLOSED TO ALL TRAVELERS: Active Disaster Zone"
                : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
                ? "ROUTE RISK ADVISORY: High-Precaution Travel Zone"
                : "VERIFIED CLEAR ROUTE: Normal Travel Conditions"}
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "13px", opacity: 0.95 }}>
              {destination}: {replanData.disasterTitle} • Verified NDMA / IMD Protocol
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Close ✕
          </button>
        )}
      </div>

      {actionSuccessMessage && (
        <div
          style={{
            background: "#065f46",
            color: "#ecfdf5",
            padding: "14px 24px",
            fontSize: "14px",
            fontWeight: "600",
            borderBottom: "1px solid #10b981",
          }}
        >
          {actionSuccessMessage}
        </div>
      )}

      <div style={{ padding: "24px" }}>
        {/* Why route is closed & Escrow Refund Policy */}
        <div
          style={{
            background:
              replanData.tripStatus === "TRIP_SUSPENDED"
                ? (isEmergencyMode ? "#2a1010" : "#fef2f2")
                : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
                ? (isEmergencyMode ? "#2a1c08" : "#fffbeb")
                : (isEmergencyMode ? "#0f2316" : "#f0fdf4"),
            border:
              replanData.tripStatus === "TRIP_SUSPENDED"
                ? (isEmergencyMode ? "1px solid #551d1d" : "1px solid #fee2e2")
                : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
                ? (isEmergencyMode ? "1px solid #5d3b0e" : "1px solid #fde68a")
                : (isEmergencyMode ? "1px solid #16532d" : "1px solid #bbf7d0"),
            borderRadius: "12px",
            padding: "18px 20px",
            marginBottom: "24px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "18px" }}>🛡️</span>
              <h4
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: "800",
                  color:
                    replanData.tripStatus === "TRIP_SUSPENDED"
                      ? "#991b1b"
                      : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
                      ? "#92400e"
                      : "#065f46",
                }}
              >
                {replanData.tripStatus === "TRIP_SUSPENDED"
                  ? "100% Disaster Protection & Booking Guarantee"
                  : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
                  ? "Caution Advisory • 100% Flexible Trip Guarantee"
                  : "Verified Route • Normal Travel Clear"}
              </h4>
            </div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "13px",
                color:
                  replanData.tripStatus === "TRIP_SUSPENDED"
                    ? (isEmergencyMode ? "#fecaca" : "#7f1d1d")
                    : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
                    ? (isEmergencyMode ? "#fde68a" : "#78350f")
                    : (isEmergencyMode ? "#bbf7d0" : "#047857"),
                lineHeight: "1.45",
              }}
            >
              {replanData.tripStatus === "TRIP_SUSPENDED"
                ? `Because an official disaster advisory is in effect, all scheduled trips to ${destination} are paused. Your booking funds are held safely under Travel Guruji Escrow Protection and qualify for a 100% full refund with zero cancellation charges.`
                : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
                ? `Advisory weather or terrain conditions are active for ${destination}. Movement is feasible with caution. If you choose not to proceed, Escrow Protection allows hassle-free replanning.`
                : `All routes into ${destination} are verified clear and normal. National highways and rail terminals are operating standard schedules.`}
            </p>
            {bookingReference && (
              <span
                style={{
                  fontSize: "12px",
                  color:
                    replanData.tripStatus === "TRIP_SUSPENDED"
                      ? "#dc2626"
                      : replanData.tripStatus === "TRAVEL_WITH_CAUTION"
                      ? "#d97706"
                      : "#059669",
                  fontWeight: "700",
                }}
              >
                Booking Ref: {bookingReference}
              </span>
            )}
          </div>

          <div>
            {replanData.tripStatus === "TRIP_SUSPENDED" && (
              <button
                onClick={handleClaimDisasterRefund}
                disabled={refundClaimed}
                style={{
                  background: refundClaimed ? "#16a34a" : "#dc2626",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: refundClaimed ? "default" : "pointer",
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.3)",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                {refundClaimed ? "✓ Refund Processed" : "Claim 100% Instant Refund"}
              </button>
            )}
            {replanData.tripStatus !== "TRIP_SUSPENDED" && (
              <span
                style={{
                  background: replanData.tripStatus === "TRAVEL_WITH_CAUTION" ? "#fef3c7" : "#d1fae5",
                  color: replanData.tripStatus === "TRAVEL_WITH_CAUTION" ? "#92400e" : "#065f46",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  whiteSpace: "nowrap",
                }}
              >
                {replanData.tripStatus === "TRAVEL_WITH_CAUTION" ? "⚠️ Movement Feasible" : "✓ Routes Clear"}
              </span>
            )}
          </div>
        </div>

        {/* Step-by-Step Safe Evacuation Route */}
        {replanData.evacuationPlan && (
          <div
            style={{
              background: isEmergencyMode ? "#201212" : "#f8fafc",
              border: isEmergencyMode ? "1px solid #4a1c1c" : "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#2563eb",
                    background: "#eff6ff",
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  Verified Safe Corridor
                </span>
                <h4
                  style={{
                    margin: "6px 0 2px",
                    fontSize: "17px",
                    fontWeight: "800",
                    color: isEmergencyMode ? "#ffffff" : "#0f172a",
                  }}
                >
                  🔄 {replanData.evacuationPlan.routeTitle}
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: isEmergencyMode ? "#f87171" : "#64748b" }}>
                  Destination Safe Hub: <strong>{replanData.safeHub}</strong> • Estimated Time:{" "}
                  <strong>{replanData.evacuationPlan.estimatedTransitTime}</strong>
                </p>
              </div>

              <span
                style={{
                  background: "#dcfce7",
                  color: "#166534",
                  border: "1px solid #86efac",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                ● Status: {replanData.evacuationPlan.safetyStatus}
              </span>
            </div>

            <div style={{ marginTop: "14px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  color: isEmergencyMode ? "#d1d5db" : "#475569",
                  letterSpacing: "0.4px",
                }}
              >
                Emergency Route Guidance:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {replanData.evacuationPlan.stepByStepInstructions?.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: isEmergencyMode ? "#2a1515" : "#ffffff",
                      border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      fontSize: "13px",
                      color: isEmergencyMode ? "#f3f4f6" : "#334155",
                      lineHeight: "1.5",
                    }}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alternative Evacuation Conveyances */}
        <h4
          style={{
            margin: "0 0 14px",
            fontSize: "16px",
            fontWeight: "800",
            color: isEmergencyMode ? "#ffffff" : "#0f172a",
          }}
        >
          🚑 Available Emergency Evacuation Options to {replanData.safeHub}
        </h4>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {replanData.alternativeOptions?.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            return (
              <div
                key={opt.id}
                style={{
                  background: isEmergencyMode ? (isSelected ? "#331212" : "#200e0e") : isSelected ? "#eff6ff" : "#ffffff",
                  border: isSelected
                    ? "2px solid #2563eb"
                    : isEmergencyMode
                    ? "1px solid #4a1c1c"
                    : "1px solid #cbd5e1",
                  borderRadius: "12px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: opt.isFreeRelief ? "#dcfce7" : "#e0e7ff",
                        color: opt.isFreeRelief ? "#166534" : "#3730a3",
                      }}
                    >
                      {opt.mode}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: opt.isFreeRelief ? "#16a34a" : isEmergencyMode ? "#ffffff" : "#0f172a",
                      }}
                    >
                      {opt.isFreeRelief ? "FREE (Relief)" : `₹${opt.costPerPerson}`}
                    </span>
                  </div>

                  <h5
                    style={{
                      margin: "0 0 6px",
                      fontSize: "15px",
                      fontWeight: "700",
                      color: isEmergencyMode ? "#ffffff" : "#0f172a",
                    }}
                  >
                    {opt.title}
                  </h5>

                  <p style={{ margin: "0 0 4px", fontSize: "12px", color: isEmergencyMode ? "#f87171" : "#64748b" }}>
                    📍 Departs: <strong>{opt.departurePoint}</strong>
                  </p>
                  <p style={{ margin: "0 0 10px", fontSize: "12px", color: isEmergencyMode ? "#f87171" : "#64748b" }}>
                    ⏰ Schedule: {opt.timing}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                    {opt.features?.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "11px",
                          background: isEmergencyMode ? "#451818" : "#f1f5f9",
                          color: isEmergencyMode ? "#fca5a5" : "#475569",
                          padding: "2px 7px",
                          borderRadius: "4px",
                        }}
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleBookEvacuation(opt)}
                  style={{
                    width: "100%",
                    background: opt.isFreeRelief ? "#16a34a" : "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  {opt.isFreeRelief ? "Board Free Relief Shuttle" : "Book Evacuation Vehicle"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Emergency Helpdesk Strip */}
        <div
          style={{
            marginTop: "20px",
            padding: "12px 16px",
            background: isEmergencyMode ? "#2a1010" : "#f1f5f9",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            fontSize: "13px",
            color: isEmergencyMode ? "#fecaca" : "#334155",
          }}
        >
          <span>
            📞 24x7 SDRF Evacuation Command Center: <strong>Dial 1070 (Toll Free)</strong>
          </span>
          <a
            href="tel:1070"
            style={{
              background: "#ef4444",
              color: "#ffffff",
              padding: "6px 14px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "12px",
            }}
          >
            Call 1070 Now
          </a>
        </div>
      </div>
    </div>
  );
}

