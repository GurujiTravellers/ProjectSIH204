import { useState, useMemo, useEffect } from "react";

/**
 * BudgetGuardian Component
 * Intelligently monitors trip budget, tracks booked vs projected vs spent expenses,
 * provides contingency buffer calculations, overrun warnings, and a What-If simulator.
 * Real-time responsive to changes in travelers, days, and travel tiers.
 */
function BudgetGuardian({
  totalBudget = 25000,
  persons = 2,
  days = 3,
  destination = "India",
  hotelCost = 6000,
  transportCost = 3500,
  foodDailyPerPerson = 350,
  localTransitDailyPerPerson = 180,
  miscDailyPerPerson = 150,
  onBudgetChange = null,
}) {
  const storageKey = `travelGurujiExpenses_${destination}_${days}d`;

  // Dynamic real-time interactive adjustments
  const [activePersons, setActivePersons] = useState(Number(persons) || 2);
  const [activeDays, setActiveDays] = useState(Number(days) || 3);
  const [allocatedBudget, setAllocatedBudget] = useState(Number(totalBudget) || 25000);

  // Synchronize when parent props change
  useEffect(() => {
    const p = Number(persons) || 2;
    setActivePersons((prev) => (prev !== p ? p : prev));
  }, [persons]);

  useEffect(() => {
    const d = Number(days) || 3;
    setActiveDays((prev) => (prev !== d ? d : prev));
  }, [days]);

  useEffect(() => {
    const b = Number(totalBudget) || 25000;
    setAllocatedBudget((prev) => (prev !== b ? b : prev));
  }, [totalBudget]);

  // Local recorded expenses (on-the-go tracking)
  const [recordedExpenses, setRecordedExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // What-If simulation offsets
  const [hotelTierFactor, setHotelTierFactor] = useState(1.0); // 0.75 = Budget, 1.0 = Selected, 1.4 = Luxury
  const [transportModeFactor, setTransportModeFactor] = useState(1.0); // 0.5 = Bus, 0.85 = Train, 1.0 = Current, 1.8 = Flight
  const [diningTierFactor, setDiningTierFactor] = useState(1.0); // 0.8 = Local dhabas, 1.0 = Balanced, 1.5 = Premium cafes
  const [contingencyPercent, setContingencyPercent] = useState(10); // 10% safety buffer

  // Quick expense form state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");

  // Save expenses to storage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(recordedExpenses));
    } catch (err) {
      console.warn("Could not save expenses:", err);
    }
  }, [recordedExpenses, storageKey]);

  // Actual recorded spend so far
  const totalRecordedSpend = useMemo(() => {
    return recordedExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [recordedExpenses]);

  // ========================================================
  // REAL-TIME ACCURATE COST CALCULATIONS (Zero Double Counting)
  // ========================================================
  const activeRooms = Math.ceil(activePersons / 2);
  const activeNights = Math.max(1, activeDays - 1);

  // Base per-room night rate derived from hotelCost or industry standard (₹2,200/night/room)
  const baseRoomRate = useMemo(() => {
    const parentRooms = Math.max(1, Math.ceil(persons / 2));
    const parentNights = Math.max(1, days - 1);
    if (hotelCost > 0) {
      return Math.round(hotelCost / (parentRooms * parentNights));
    }
    return 2400;
  }, [hotelCost, persons, days]);

  // Base round-trip intercity transport rate per traveler derived from transportCost or standard (₹1,400 one-way = ₹2,800 round trip)
  const baseTravelRatePerPerson = useMemo(() => {
    const parentPersons = Math.max(1, persons);
    if (transportCost > 0) {
      return Math.round(transportCost / parentPersons);
    }
    return 2800;
  }, [transportCost, persons]);

  // 1. Hotel / Stays Total
  const simHotelTotal = Math.round(baseRoomRate * activeRooms * activeNights * hotelTierFactor);

  // 2. Intercity Transport Total (Round-Trip Origin ⇄ Destination for all travelers)
  const simTransportTotal = Math.round(baseTravelRatePerPerson * activePersons * transportModeFactor);

  // 3. Food & Dining Total
  const simFoodTotal = Math.round(foodDailyPerPerson * activePersons * activeDays * diningTierFactor);

  // 4. Local City Transit Total (Autos, Cabs, local transfers - strictly separate from intercity transport)
  const simLocalTransitTotal = Math.round(localTransitDailyPerPerson * activePersons * activeDays);

  // 5. Sightseeing Tickets & Misc Incidental
  const simMiscTotal = Math.round(miscDailyPerPerson * activePersons * activeDays);

  // Subtotal of base expenses
  const baseProjectedSpend =
    simHotelTotal + simTransportTotal + simFoodTotal + simLocalTransitTotal + simMiscTotal;

  // Contingency Buffer (10% standard reserve)
  const contingencyBuffer = Math.round((baseProjectedSpend * contingencyPercent) / 100);

  // Grand Total Projected Cost
  const grandTotalProjected = baseProjectedSpend + contingencyBuffer;

  // Effective Budget & Net Remaining Buffer
  const effectiveBudget = Number(allocatedBudget) || 25000;
  const netRemaining = effectiveBudget - grandTotalProjected - totalRecordedSpend;
  const spendPercent = Math.min(
    100,
    Math.round(((grandTotalProjected + totalRecordedSpend) / effectiveBudget) * 100)
  );

  // Metrics per traveler and per day
  const costPerPerson = Math.round(grandTotalProjected / activePersons);
  const costPerPersonPerDay = Math.round(grandTotalProjected / (activePersons * activeDays));

  // Notify parent component if callback provided
  useEffect(() => {
    if (typeof onBudgetChange === "function") {
      onBudgetChange({
        persons: activePersons,
        days: activeDays,
        grandTotalProjected,
        netRemaining,
        costPerPerson,
        costPerPersonPerDay,
      });
    }
  }, [activePersons, activeDays, grandTotalProjected, netRemaining, costPerPerson, costPerPersonPerDay, onBudgetChange]);

  // Health status and intelligence advice
  const budgetStatus = useMemo(() => {
    if (netRemaining >= effectiveBudget * 0.15) {
      return {
        label: "Healthy Surplus",
        color: "#10b981",
        bg: "#f0fdf4",
        border: "#bbf7d0",
        icon: "🛡️",
        advice: `Comfortable surplus of ₹${netRemaining.toLocaleString("en-IN")}. You can safely book premium activities or explore fine dining!`,
      };
    }
    if (netRemaining >= 0) {
      return {
        label: "Balanced Margin",
        color: "#f59e0b",
        bg: "#fffbeb",
        border: "#fde68a",
        icon: "⚖️",
        advice: `Budget is on target with ₹${netRemaining.toLocaleString("en-IN")} safety reserve. Keep daily incidental expenses within limits.`,
      };
    }
    return {
      label: "Budget Deficit Warning",
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fecaca",
      icon: "⚠️",
      advice: `Projected costs exceed your allocated budget by ₹${Math.abs(netRemaining).toLocaleString("en-IN")}. Use the simulator below to switch to budget stays or express trains.`,
    };
  }, [netRemaining, effectiveBudget]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount || Number(expenseAmount) <= 0) return;

    const newExp = {
      id: "exp_" + Date.now(),
      title: expenseTitle.trim(),
      amount: Number(expenseAmount),
      category: expenseCategory,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setRecordedExpenses([newExp, ...recordedExpenses]);
    setExpenseTitle("");
    setExpenseAmount("");
    setShowAddExpense(false);
  };

  const handleRemoveExpense = (id) => {
    setRecordedExpenses(recordedExpenses.filter((item) => item.id !== id));
  };

  return (
    <div className="budget-guardian-container">
      {/* HEADER */}
      <div className="budget-guardian-header">
        <div className="guardian-title-area">
          <span className="guardian-icon">🛡️</span>
          <div>
            <h3>
              <span className="logo-text" style={{ fontSize: "17px" }}>Travel<span>_Guruji</span></span> Budget Guardian
            </h3>
            <p>Real-Time Financial Intelligence & Live Spend Monitor • Synchronized with Whole Trip Cost</p>
          </div>
        </div>
      </div>

      {/* REAL-TIME TRIP ADJUSTER CONTROLS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "14px 18px",
          margin: "18px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          {/* PERSONS ADJUSTER */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>Travelers:</span>
            <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => setActivePersons((prev) => Math.max(1, prev - 1))}
                style={{ background: "#ffffff", border: "none", padding: "6px 12px", fontWeight: "800", cursor: "pointer", color: "#0f172a" }}
              >
                -
              </button>
              <span style={{ padding: "6px 12px", background: "#f1f5f9", fontWeight: "800", fontSize: "13px", minWidth: "30px", textAlign: "center" }}>
                {activePersons}
              </span>
              <button
                type="button"
                onClick={() => setActivePersons((prev) => Math.min(12, prev + 1))}
                style={{ background: "#ffffff", border: "none", padding: "6px 12px", fontWeight: "800", cursor: "pointer", color: "#0f172a" }}
              >
                +
              </button>
            </div>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              ({activeRooms} room{activeRooms > 1 ? "s" : ""})
            </span>
          </div>

          {/* DAYS ADJUSTER */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>Duration:</span>
            <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => setActiveDays((prev) => Math.max(1, prev - 1))}
                style={{ background: "#ffffff", border: "none", padding: "6px 12px", fontWeight: "800", cursor: "pointer", color: "#0f172a" }}
              >
                -
              </button>
              <span style={{ padding: "6px 12px", background: "#f1f5f9", fontWeight: "800", fontSize: "13px", minWidth: "30px", textAlign: "center" }}>
                {activeDays}d
              </span>
              <button
                type="button"
                onClick={() => setActiveDays((prev) => Math.min(15, prev + 1))}
                style={{ background: "#ffffff", border: "none", padding: "6px 12px", fontWeight: "800", cursor: "pointer", color: "#0f172a" }}
              >
                +
              </button>
            </div>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              ({activeNights} night{activeNights > 1 ? "s" : ""})
            </span>
          </div>
        </div>

        {/* PER-PERSON & PER-DAY BADGES */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
            ₹{costPerPerson.toLocaleString("en-IN")} / traveler
          </span>
          <span style={{ background: "#fef3c7", color: "#92400e", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
            ₹{costPerPersonPerDay.toLocaleString("en-IN")} / day / person
          </span>
        </div>
      </div>

      {/* OVERVIEW METRICS CARDS */}
      <div className="guardian-metrics-grid">
        <div className="metric-box">
          <small>TOTAL ALLOCATED</small>
          <strong>₹{effectiveBudget.toLocaleString("en-IN")}</strong>
          <span>Set by Traveler</span>
        </div>

        <div className="metric-box">
          <small>PROJECTED TOTAL</small>
          <strong style={{ color: budgetStatus.color }}>
            ₹{grandTotalProjected.toLocaleString("en-IN")}
          </strong>
          <span>Incl. {contingencyPercent}% buffer</span>
        </div>

        <div className="metric-box">
          <small>RECORDED SPENT</small>
          <strong>₹{totalRecordedSpend.toLocaleString("en-IN")}</strong>
          <span>{recordedExpenses.length} on-trip receipts</span>
        </div>

        <div className="metric-box">
          <small>NET BUFFER / SAVINGS</small>
          <strong style={{ color: netRemaining >= 0 ? "#10b981" : "#ef4444" }}>
            {netRemaining >= 0 ? "+" : "-"}₹{Math.abs(netRemaining).toLocaleString("en-IN")}
          </strong>
          <span>{netRemaining >= 0 ? "Remaining Safe" : "Overrun"}</span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="guardian-progress-section">
        <div className="guardian-progress-labels">
          <span>Budget Utilization</span>
          <strong>{spendPercent}% of ₹{effectiveBudget.toLocaleString("en-IN")}</strong>
        </div>
        <div className="guardian-progress-bar">
          <div
            className="guardian-progress-fill"
            style={{
              width: `${Math.min(spendPercent, 100)}%`,
              backgroundColor: spendPercent > 100 ? "#ef4444" : spendPercent > 85 ? "#f59e0b" : "#10b981",
            }}
          ></div>
        </div>
      </div>

      {/* ADVICE ALERT BANNER */}
      <div
        className="guardian-advice-banner"
        style={{
          background: budgetStatus.bg,
          borderColor: budgetStatus.border,
          color: budgetStatus.color,
        }}
      >
        <span>💡 <strong>Guardian Insight:</strong> {budgetStatus.advice}</span>
      </div>

      {/* COST COMPONENT BREAKDOWN (Mathematically Verified) */}
      <div className="guardian-breakdown-details">
        <h4>Cost Breakdown Breakdown ({activeDays} Days • {activePersons} Travelers • {activeRooms} Room{activeRooms > 1 ? "s" : ""})</h4>
        <div className="guardian-breakdown-list">
          <div className="guardian-breakdown-row">
            <span>🏨 Accommodation ({activeNights}N @ ~₹{Math.round(baseRoomRate * hotelTierFactor).toLocaleString("en-IN")}/room)</span>
            <strong>₹{simHotelTotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="guardian-breakdown-row">
            <span>🚆 Intercity Transport (Round-Trip @ ~₹{Math.round(baseTravelRatePerPerson * transportModeFactor).toLocaleString("en-IN")}/person)</span>
            <strong>₹{simTransportTotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="guardian-breakdown-row">
            <span>🍽️ Food & Dining (~₹{Math.round(foodDailyPerPerson * diningTierFactor)}/day/person)</span>
            <strong>₹{simFoodTotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="guardian-breakdown-row">
            <span>🚕 Local Autos & Sightseeing Transit (~₹{localTransitDailyPerPerson}/day/person)</span>
            <strong>₹{simLocalTransitTotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="guardian-breakdown-row">
            <span>🎟️ Sightseeing Tickets & Misc Incidental (~₹{miscDailyPerPerson}/day/person)</span>
            <strong>₹{simMiscTotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="guardian-breakdown-row subtotal" style={{ background: "#f8fafc", fontWeight: "700", borderTop: "2px solid #e2e8f0", color: "#334155" }}>
            <span>📊 Base Trip Expenses Subtotal (Direct Costs)</span>
            <strong>₹{baseProjectedSpend.toLocaleString("en-IN")}</strong>
          </div>
          <div className="guardian-breakdown-row buffer">
            <span>🛡️ Emergency Contingency Buffer ({contingencyPercent}%)</span>
            <strong>+₹{contingencyBuffer.toLocaleString("en-IN")}</strong>
          </div>
          <div className="guardian-breakdown-row grand-total" style={{ background: "#f0fdf4", fontWeight: "800", color: "#166534", borderTop: "2px solid #86efac", fontSize: "14px" }}>
            <span>🎯 Projected Total Budget (Recommended)</span>
            <strong>₹{grandTotalProjected.toLocaleString("en-IN")}</strong>
          </div>
        </div>
        <div style={{ marginTop: "10px", padding: "8px 12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#64748b" }}>
          💡 <strong>Budget Clarity:</strong> Base Direct Expenses (₹{baseProjectedSpend.toLocaleString("en-IN")}) + {contingencyPercent}% Emergency Buffer (+₹{contingencyBuffer.toLocaleString("en-IN")}) = <strong>₹{grandTotalProjected.toLocaleString("en-IN")}</strong>. Exactly synchronized with Whole Trip Cost.
        </div>
      </div>

      {/* WHAT-IF SIMULATOR */}
      <div className="guardian-simulator-section">
        <div className="simulator-header">
          <h4>🎛️ What-If Budget Simulator</h4>
          <small>Adjust parameters to see instant real-time savings</small>
        </div>

        <div className="simulator-controls-grid">
          <div className="simulator-control">
            <label>Hotel Category:</label>
            <div className="simulator-pill-group">
              <button
                type="button"
                className={`sim-pill ${hotelTierFactor === 0.75 ? "active" : ""}`}
                onClick={() => setHotelTierFactor(0.75)}
              >
                Economy (-25%)
              </button>
              <button
                type="button"
                className={`sim-pill ${hotelTierFactor === 1.0 ? "active" : ""}`}
                onClick={() => setHotelTierFactor(1.0)}
              >
                Selected
              </button>
              <button
                type="button"
                className={`sim-pill ${hotelTierFactor === 1.4 ? "active" : ""}`}
                onClick={() => setHotelTierFactor(1.4)}
              >
                Luxury (+40%)
              </button>
            </div>
          </div>

          <div className="simulator-control">
            <label>Transport Mode:</label>
            <div className="simulator-pill-group">
              <button
                type="button"
                className={`sim-pill ${transportModeFactor === 0.5 ? "active" : ""}`}
                onClick={() => setTransportModeFactor(0.5)}
              >
                Bus / Sleeper
              </button>
              <button
                type="button"
                className={`sim-pill ${transportModeFactor === 1.0 ? "active" : ""}`}
                onClick={() => setTransportModeFactor(1.0)}
              >
                Train / Rail
              </button>
              <button
                type="button"
                className={`sim-pill ${transportModeFactor === 1.8 ? "active" : ""}`}
                onClick={() => setTransportModeFactor(1.8)}
              >
                Flight
              </button>
            </div>
          </div>

          <div className="simulator-control">
            <label>Safety Buffer:</label>
            <div className="simulator-pill-group">
              <button
                type="button"
                className={`sim-pill ${contingencyPercent === 5 ? "active" : ""}`}
                onClick={() => setContingencyPercent(5)}
              >
                5% (Lean)
              </button>
              <button
                type="button"
                className={`sim-pill ${contingencyPercent === 10 ? "active" : ""}`}
                onClick={() => setContingencyPercent(10)}
              >
                10% (Normal)
              </button>
              <button
                type="button"
                className={`sim-pill ${contingencyPercent === 15 ? "active" : ""}`}
                onClick={() => setContingencyPercent(15)}
              >
                15% (Safe)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE ON-TRIP EXPENSE TRACKER */}
      <div className="guardian-tracker-section">
        <div className="tracker-header">
          <div>
            <h4>Live Trip Expense Logger</h4>
            <small>Log on-the-go spends (Auto, snacks, shopping, entry passes)</small>
          </div>
          <button
            type="button"
            className="guardian-add-btn"
            onClick={() => setShowAddExpense(!showAddExpense)}
          >
            {showAddExpense ? "✕ Cancel" : "+ Log Expense"}
          </button>
        </div>

        {showAddExpense && (
          <form onSubmit={handleAddExpense} className="guardian-expense-form">
            <input
              type="text"
              placeholder="e.g. Taxi from Station, Chai & Samosa"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              min="1"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              required
            />
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
            >
              <option value="Food">🍽️ Food & Drinks</option>
              <option value="Cab">🚕 Auto / Taxi</option>
              <option value="Entry">🎟️ Entry Tickets</option>
              <option value="Shopping">🛍️ Shopping / Souvenirs</option>
              <option value="Other">📦 Other</option>
            </select>
            <button type="submit" className="guardian-save-btn">
              Save
            </button>
          </form>
        )}

        {recordedExpenses.length > 0 ? (
          <div className="guardian-expenses-list">
            {recordedExpenses.map((item) => (
              <div key={item.id} className="guardian-expense-item">
                <div className="expense-left">
                  <span>
                    {item.category === "Food"
                      ? "🍽️"
                      : item.category === "Cab"
                      ? "🚕"
                      : item.category === "Entry"
                      ? "🎟️"
                      : item.category === "Shopping"
                      ? "🛍️"
                      : "📦"}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.timestamp} • {item.category}</small>
                  </div>
                </div>
                <div className="expense-right">
                  <strong>₹{item.amount.toLocaleString("en-IN")}</strong>
                  <button
                    type="button"
                    className="expense-del-btn"
                    onClick={() => handleRemoveExpense(item.id)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="guardian-no-expenses">
            No on-trip expenses logged yet. Tap <strong>+ Log Expense</strong> above while travelling to track real spend!
          </p>
        )}
      </div>
    </div>
  );
}

export default BudgetGuardian;
