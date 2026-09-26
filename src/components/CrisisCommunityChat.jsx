import React, { useState, useEffect } from "react";
import { getCrisisMessages, postCrisisMessage } from "../services/emergencyApi";

const TAG_COLORS = {
  "🚨 SOS Urgent": { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
  "🛣️ Road Condition": { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  "🏡 Shelter/Food Offered": { bg: "#dcfce7", text: "#166534", border: "#86efac" },
  "👥 Need Ride/Transport": { bg: "#e0e7ff", text: "#3730a3", border: "#a5b4fc" },
  "ℹ️ General Update": { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" },
};

export default function CrisisCommunityChat({ destination = "Manali", isEmergencyMode = false }) {
  const [messages, setMessages] = useState([]);
  const [activeTravelersCount, setActiveTravelersCount] = useState(18);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [showPostModal, setShowPostModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [senderName, setSenderName] = useState("");
  const [tag, setTag] = useState("🚨 SOS Urgent");
  const [locationText, setLocationText] = useState("");
  const [gpsCoords, setGpsCoords] = useState(null);
  const [contactNumber, setContactNumber] = useState("");
  const [messageText, setMessageText] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState("");

  const fetchMessages = async () => {
    try {
      const data = await getCrisisMessages(destination);
      if (data && data.messages) {
        setMessages(data.messages);
        if (data.activeTravelersCount) setActiveTravelersCount(data.activeTravelersCount);
      }
    } catch (err) {
      console.warn("Failed to refresh crisis chat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Polling every 10 seconds for real-time updates
    return () => clearInterval(interval);
  }, [destination]);

  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsCoords({ lat: latitude.toFixed(5), lng: longitude.toFixed(5) });
        if (!locationText) {
          setLocationText(`GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
        }
        setGpsLoading(false);
      },
      (err) => {
        console.warn("GPS lookup failed:", err);
        alert("Unable to fetch exact GPS location. You can type your landmark manually.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        senderName: senderName.trim() || "Anonymous Traveler",
        role: tag === "🚨 SOS Urgent" ? "Stranded Traveler (Need Help)" : "Traveler / Local",
        tag,
        message: messageText.trim(),
        location: locationText.trim() || `${destination} Area`,
        coordinates: gpsCoords,
        contact: contactNumber.trim() || null,
      };

      const res = await postCrisisMessage(destination, payload);
      if (res && res.success) {
        setStatusFeedback("Message posted to community board successfully!");
        setMessageText("");
        setShowPostModal(false);
        fetchMessages();
        setTimeout(() => setStatusFeedback(""), 4000);
      }
    } catch (err) {
      alert("Failed to send message. Please verify network or dial emergency helpline directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMessages =
    activeFilter === "ALL"
      ? messages
      : messages.filter((m) => m.tag === activeFilter);

  return (
    <div
      style={{
        background: isEmergencyMode ? "#1a0b0b" : "#ffffff",
        border: isEmergencyMode ? "2px solid #ef4444" : "1px solid #e5e7eb",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: isEmergencyMode ? "#7f1d1d" : "#0f172a",
          color: "#ffffff",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>💬</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "19px", fontWeight: "700", letterSpacing: "-0.3px" }}>
              Stranded Traveler Community Board: {destination}
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "13px", opacity: 0.85 }}>
              Live real-time updates from people on the ground •{" "}
              <span style={{ color: "#34d399", fontWeight: "600" }}>● {activeTravelersCount} active in this zone</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          style={{
            background: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <span>📢</span> Post Status / SOS
        </button>
      </div>

      {/* Critical Guidance Notice */}
      <div
        style={{
          background: isEmergencyMode ? "#450a0a" : "#fffbeb",
          borderBottom: isEmergencyMode ? "1px solid #7f1d1d" : "1px solid #fef3c7",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          fontSize: "13px",
          color: isEmergencyMode ? "#fecaca" : "#92400e",
        }}
      >
        <span>
          ⚠️ <strong>Life Safety Warning:</strong> If anyone is in immediate medical danger or trapped, dial{" "}
          <a href="tel:112" style={{ color: "#ef4444", fontWeight: "800", textDecoration: "underline" }}>
            112 (National SOS)
          </a>{" "}
          or{" "}
          <a href="tel:1070" style={{ color: "#ef4444", fontWeight: "800", textDecoration: "underline" }}>
            1070 (SDRF Disaster Control)
          </a>{" "}
          directly.
        </span>
        <button
          onClick={fetchMessages}
          style={{
            background: "none",
            border: "none",
            color: isEmergencyMode ? "#fca5a5" : "#b45309",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            textDecoration: "underline",
          }}
        >
          🔄 Refresh Feed
        </button>
      </div>

      {statusFeedback && (
        <div
          style={{
            background: "#10b981",
            color: "#ffffff",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          ✓ {statusFeedback}
        </div>
      )}

      {/* Tag Filter Pills */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "14px 24px",
          overflowX: "auto",
          background: isEmergencyMode ? "#261313" : "#f8fafc",
          borderBottom: isEmergencyMode ? "1px solid #3f1919" : "1px solid #f1f5f9",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: isEmergencyMode ? "#d1d5db" : "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginRight: "4px",
          }}
        >
          Filter:
        </span>
        {["ALL", "🚨 SOS Urgent", "🛣️ Road Condition", "🏡 Shelter/Food Offered", "👥 Need Ride/Transport", "ℹ️ General Update"].map(
          (t) => {
            const isSelected = activeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                style={{
                  background: isSelected
                    ? isEmergencyMode
                      ? "#ef4444"
                      : "#0f172a"
                    : isEmergencyMode
                    ? "#331616"
                    : "#ffffff",
                  color: isSelected ? "#ffffff" : isEmergencyMode ? "#fca5a5" : "#475569",
                  border: isSelected
                    ? "none"
                    : isEmergencyMode
                    ? "1px solid #552020"
                    : "1px solid #cbd5e1",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {t === "ALL" ? "All Messages" : t}
              </button>
            );
          }
        )}
      </div>

      {/* Messages List Feed */}
      <div
        style={{
          maxHeight: "460px",
          overflowY: "auto",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          background: isEmergencyMode ? "#180a0a" : "#ffffff",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "8px" }}>⏳</span>
            Connecting to ground crisis frequency...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: isEmergencyMode ? "#fca5a5" : "#64748b",
              background: isEmergencyMode ? "#2a1010" : "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <p style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "600" }}>
              No messages found under this filter
            </p>
            <p style={{ margin: 0, fontSize: "13px" }}>
              Are you currently at or near {destination}? Click "Post Status / SOS" above to broadcast an update to other travelers and relief groups.
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const tagStyle = TAG_COLORS[msg.tag] || TAG_COLORS["ℹ️ General Update"];
            const isSOS = msg.tag === "🚨 SOS Urgent";

            return (
              <div
                key={msg.id || `${msg.timestamp}-${msg.senderName}`}
                style={{
                  background: isEmergencyMode
                    ? isSOS
                      ? "#3b1010"
                      : "#241212"
                    : isSOS
                    ? "#fff5f5"
                    : "#fbfcfe",
                  border: isEmergencyMode
                    ? isSOS
                      ? "2px solid #ef4444"
                      : "1px solid #4a1d1d"
                    : isSOS
                    ? "2px solid #fca5a5"
                    : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "16px 18px",
                  boxShadow: isSOS ? "0 4px 15px rgba(239, 68, 68, 0.15)" : "none",
                  transition: "transform 0.15s ease",
                }}
              >
                {/* Message Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "15px",
                          color: isEmergencyMode ? "#f9fafb" : "#0f172a",
                        }}
                      >
                        {msg.senderName}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: isEmergencyMode ? "#451212" : "#e2e8f0",
                          color: isEmergencyMode ? "#fca5a5" : "#475569",
                          fontWeight: "600",
                        }}
                      >
                        {msg.role || "Traveler"}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        color: isEmergencyMode ? "#f87171" : "#64748b",
                        marginTop: "3px",
                      }}
                    >
                      <span>📍 {msg.location}</span>
                      {msg.coordinates && (
                        <span
                          style={{
                            background: isEmergencyMode ? "#551a1a" : "#f1f5f9",
                            padding: "1px 6px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontFamily: "monospace",
                          }}
                        >
                          {msg.coordinates.lat}, {msg.coordinates.lng}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background: tagStyle.bg,
                        color: tagStyle.text,
                        border: `1px solid ${tagStyle.border}`,
                      }}
                    >
                      {msg.tag}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: isEmergencyMode ? "#a1a1aa" : "#94a3b8",
                      }}
                    >
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: "14px",
                    lineHeight: "1.55",
                    color: isEmergencyMode ? "#f3f4f6" : "#1e293b",
                    whiteSpace: "pre-line",
                  }}
                >
                  {msg.message}
                </p>

                {/* Footer Actions (Phone contact, upvotes, etc.) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    paddingTop: "8px",
                    borderTop: isEmergencyMode ? "1px solid #3d1414" : "1px solid #f1f5f9",
                    fontSize: "12px",
                  }}
                >
                  {msg.contact ? (
                    <a
                      href={`tel:${msg.contact}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#16a34a",
                        color: "#ffffff",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "700",
                        fontSize: "12px",
                      }}
                    >
                      📞 Call {msg.contact}
                    </a>
                  ) : (
                    <span style={{ color: isEmergencyMode ? "#9ca3af" : "#94a3b8", fontStyle: "italic" }}>
                      Verified Community Message
                    </span>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => alert(`Upvoted! Thank you for confirming this update from ${msg.senderName}.`)}
                      style={{
                        background: "transparent",
                        border: isEmergencyMode ? "1px solid #4a1d1d" : "1px solid #e2e8f0",
                        color: isEmergencyMode ? "#d1d5db" : "#64748b",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      👍 Helpful ({msg.upvotes || 3})
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Post Modal / Slideover */}
      {showPostModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "520px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "#0f172a",
                color: "#ffffff",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 style={{ margin: 0, fontSize: "17px", fontWeight: "700" }}>
                📢 Broadcast Update / SOS in {destination}
              </h4>
              <button
                onClick={() => setShowPostModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendMessage} style={{ padding: "20px" }}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#374151" }}>
                  Category Tag *
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    fontWeight: "600",
                    background: "#f8fafc",
                  }}
                >
                  <option value="🚨 SOS Urgent">🚨 SOS Urgent (Trapped / Need Rescue / Medical)</option>
                  <option value="🛣️ Road Condition">🛣️ Road Condition (Landslide / Waterlogging / Detour)</option>
                  <option value="🏡 Shelter/Food Offered">🏡 Shelter / Food Offered (Homestay / Relief Point)</option>
                  <option value="👥 Need Ride/Transport">👥 Need Ride / Transport (Pool Vehicle / Convoy)</option>
                  <option value="ℹ️ General Update">ℹ️ General Ground Status / Weather</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#374151" }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul S. or Anonymous"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#374151" }}>
                    Emergency Contact No.
                  </label>
                  <input
                    type="tel"
                    placeholder="+91-98XXXXXXXX"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#374151" }}>
                    Current Location / Landmark *
                  </label>
                  <button
                    type="button"
                    onClick={handleCaptureGPS}
                    disabled={gpsLoading}
                    style={{
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      border: "1px solid #bfdbfe",
                      borderRadius: "6px",
                      padding: "3px 8px",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    {gpsLoading ? "Acquiring GPS..." : "📍 Auto-Attach GPS"}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hotel Snow Crest, 2 km before Pandoh Bridge"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#374151" }}>
                  Situation Details / Request *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="State the situation clearly: How many people with you, road passable or blocked, food/water situation, or offer for stranded fellow travelers..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  style={{
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {submitting ? "Broadcasting..." : "Broadcast to Network"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

