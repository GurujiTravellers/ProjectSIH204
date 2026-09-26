import { useState, useMemo } from "react";

function LiveJourneyTracker({
  destination = "Shimla",
  startDate = "",
  days = 3,
  hotelName = "",
}) {
  const [activeScenario, setActiveScenario] = useState("normal"); // 'normal' | 'delayed' | 'rain' | 'extended' | 'budget_cut'

  // Calculate days remaining or day number
  const tripTiming = useMemo(() => {
    if (!startDate) return { status: "planned", daysUntil: 0, currentDay: 1 };

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.round((start - today) / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return { status: "upcoming", daysUntil: diffDays, currentDay: 0 };
    }
    if (diffDays <= 0 && Math.abs(diffDays) < days) {
      return { status: "active", daysUntil: 0, currentDay: Math.abs(diffDays) + 1 };
    }
    return { status: "completed", daysUntil: 0, currentDay: days };
  }, [startDate, days]);

  // Scenario Advice & Dynamic Adaptations
  const scenarioData = useMemo(() => {
    switch (activeScenario) {
      case "delayed":
        return {
          title: "Transport Delayed by 3 Hours",
          badge: "⏱️ Delay Recovery Mode",
          color: "#f59e0b",
          bg: "#fffbeb",
          border: "#fde68a",
          advice: [
            "Hotel Check-in: Auto-notified front desk about late check-in.",
            "Day 1 Itinerary: Move afternoon viewpoint visit to tomorrow morning.",
            "Recommended Evening: Settle in with a relaxed dinner near the hotel instead of rushed travel.",
          ],
          actionTag: "Itinerary auto-optimized for late arrival",
        };
      case "rain":
        return {
          title: "Sudden Rain / Adverse Weather Alert",
          badge: "🌧️ Weather Adaptation Mode",
          color: "#0284c7",
          bg: "#f0f9ff",
          border: "#bae6fd",
          advice: [
            "Outdoor Activities: River rafting / paragliding / beach visits paused for safety.",
            "Indoor Alternatives: Visit heritage museums, cozy art cafes, and indoor spice markets.",
            "Transit Caution: Roads may be slippery; prefer licensed prepaid cabs over bike rentals.",
          ],
          actionTag: "Indoor cultural spots activated",
        };
      case "extended":
        return {
          title: "Trip Extended by +1 Day",
          badge: "🎉 Bonus Day Added",
          color: "#10b981",
          bg: "#f0fdf4",
          border: "#bbf7d0",
          advice: [
            "Extra Day Scope: Visit scenic peripheral villages (e.g. Mashobra, Kasol, or Old Goa).",
            "Pacing: Less hurry today; allocate a leisurely 3 hours for authentic local shopping and photography.",
            "Stay: Contact hotel reception for same-room extension discount.",
          ],
          actionTag: "Extra leisure leg added",
        };
      case "budget_cut":
        return {
          title: "Budget Conscious Mode (-20%)",
          badge: "💰 Budget Smart Mode",
          color: "#6366f1",
          bg: "#eef2ff",
          border: "#c7d2fe",
          advice: [
            "Transit: Switch from private taxis to local metro/state shuttle/shared electric autos.",
            "Dining: Savor famous local street food joints and heritage dhabas (saves ~₹450/day).",
            "Sightseeing: Focus on free public viewpoints, historical ghats, and open public botanical gardens.",
          ],
          actionTag: "High-value, low-cost routing active",
        };
      default:
        return {
          title: "Smooth Schedule (On Plan)",
          badge: "🟢 Optimal Timeline",
          color: "#10b981",
          bg: "#f0fdf4",
          border: "#bbf7d0",
          advice: [
            `All bookings aligned with ${destination} weather & local transit timings.`,
            `Hotel check-in ready at ${hotelName || "booked property"}.`,
            "Morning activities commence after a healthy breakfast at 09:30 AM.",
          ],
          actionTag: "Plan running on schedule",
        };
    }
  }, [activeScenario, destination, hotelName]);

  return (
    <div className="live-journey-tracker-card">
      <div className="tracker-card-header">
        <div className="tracker-status-left">
          <span className="tracker-pulsing-dot"></span>
          <div>
            <h3>Live Journey & What-If Simulator</h3>
            <p>
              {tripTiming.status === "upcoming"
                ? `Trip starts in ${tripTiming.daysUntil} ${tripTiming.daysUntil === 1 ? "day" : "days"} (${startDate})`
                : tripTiming.status === "active"
                ? `Currently on Day ${tripTiming.currentDay} of ${days} in ${destination}`
                : `Trip to ${destination} (${days} Days)`}
            </p>
          </div>
        </div>

        <div
          className="scenario-status-pill"
          style={{
            background: scenarioData.bg,
            borderColor: scenarioData.border,
            color: scenarioData.color,
          }}
        >
          {scenarioData.badge}
        </div>
      </div>

      {/* WHAT-IF SCENARIO SELECTOR */}
      <div className="scenario-selector-box">
        <label>Simulate Real-World Travel Scenarios:</label>
        <div className="scenario-buttons-row">
          <button
            type="button"
            className={`scenario-btn ${activeScenario === "normal" ? "active" : ""}`}
            onClick={() => setActiveScenario("normal")}
          >
            🟢 Normal Flow
          </button>
          <button
            type="button"
            className={`scenario-btn ${activeScenario === "delayed" ? "active" : ""}`}
            onClick={() => setActiveScenario("delayed")}
          >
            ⏱️ +3h Delay
          </button>
          <button
            type="button"
            className={`scenario-btn ${activeScenario === "rain" ? "active" : ""}`}
            onClick={() => setActiveScenario("rain")}
          >
            🌧️ Rain / Weather Alert
          </button>
          <button
            type="button"
            className={`scenario-btn ${activeScenario === "extended" ? "active" : ""}`}
            onClick={() => setActiveScenario("extended")}
          >
            🎉 +1 Day Extra
          </button>
          <button
            type="button"
            className={`scenario-btn ${activeScenario === "budget_cut" ? "active" : ""}`}
            onClick={() => setActiveScenario("budget_cut")}
          >
            💰 Budget -20%
          </button>
        </div>
      </div>

      {/* DYNAMIC ADVICE & ACTION PLAN */}
      <div
        className="scenario-advice-container"
        style={{
          background: scenarioData.bg,
          borderColor: scenarioData.border,
        }}
      >
        <div className="scenario-advice-title">
          <strong style={{ color: scenarioData.color }}>{scenarioData.title}</strong>
          <small>{scenarioData.actionTag}</small>
        </div>

        <ul className="scenario-advice-list">
          {scenarioData.advice.map((item, idx) => (
            <li key={idx}>
              <span>✓</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LiveJourneyTracker;

