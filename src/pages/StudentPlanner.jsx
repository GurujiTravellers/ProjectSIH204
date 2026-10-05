import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import destinations from "../data/destinations";
import { SUPPORTED_ORIGINS, MAJOR_ORIGINS } from "../services/plannerService";
import { getActiveDisasterAlerts } from "../services/emergencyApi";
import { showToast } from "../components/Toast";

const POPULAR_STUDENT_DESTINATIONS = [
  "Leh Ladakh",
  "Goa",
  "Kerala",
  "Vizag",
  "Gujarat",
  "Punjab",
  "Manali",
  "Rishikesh",
  "Shimla",
  "Kasol",
  "Jaipur",
  "Darjeeling",
  "Varanasi",
  "Puri",
  "Agra",
  "Kolkata",
];

const STUDENT_BUDGET_PRESETS = [
  { label: "⚡ Extreme Budget", perDay: 950, desc: "Sleeper class, hostel dorms, campus mess" },
  { label: "🎒 Balanced Backpacker", perDay: 1450, desc: "Student homestays, dhaba meals, shared transit" },
  { label: "✨ Comfortable Squad", perDay: 2100, desc: "Private dorms/rooms, AC train/bus, café hangouts" },
];

function StudentPlanner() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedStudentDraft = useMemo(() => {
    if (location.state?.formData) {
      return location.state.formData;
    }
    try {
      const saved = sessionStorage.getItem("travelGurujiStudentPlannerDraft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch {
      // Ignore
    }
    return null;
  }, [location.state]);

  const [formData, setFormData] = useState(() => {
    if (savedStudentDraft) return savedStudentDraft;
    return {
      origin: "Delhi",
      destination: "Manali",
      startDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
      days: "3",
      studentsCount: "4",
      budgetPerHead: "3600",
      stayType: "student-homestay",
      transportPreference: "Sleeper Train / State RTC",
      concessions: {
        studentId: true,
        sharedKitchen: true,
        freeAttractions: true,
      },
      notes: "",
    };
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [disasterAlerts, setDisasterAlerts] = useState([]);

  // Continuously save student planner draft so state never resets
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "travelGurujiStudentPlannerDraft",
        JSON.stringify(formData)
      );
    } catch {
      // Ignore
    }
  }, [formData]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await getActiveDisasterAlerts();
        if (res && res.alerts) setDisasterAlerts(res.alerts);
      } catch (err) {
        console.warn("Could not load alerts in student planner:", err);
      }
    }
    loadAlerts();
  }, []);

  const disasterAlertForDest = useMemo(() => {
    if (!formData.destination || !disasterAlerts.length) return null;
    const dLower = formData.destination.toLowerCase().trim();
    return disasterAlerts.find(
      (a) =>
        a.destination.toLowerCase() === dLower ||
        dLower.includes(a.destination.toLowerCase()) ||
        a.destination.toLowerCase().includes(dLower)
    );
  }, [formData.destination, disasterAlerts]);

  const numStudents = Math.max(1, Number(formData.studentsCount) || 1);
  const numDays = Math.max(1, Number(formData.days) || 1);
  const budgetPerStudent = Math.max(1, Number(formData.budgetPerHead) || 0);
  const totalGroupBudget = budgetPerStudent * numStudents;

  // Real-time student cost allocation breakdown
  const studentCostSplit = useMemo(() => {
    const stayShare = Math.round(budgetPerStudent * 0.35);
    const transportShare = Math.round(budgetPerStudent * 0.25);
    const foodShare = Math.round(budgetPerStudent * 0.20);
    const activitiesShare = Math.round(budgetPerStudent * 0.10);
    const emergencyBuffer = Math.round(budgetPerStudent * 0.10);

    return {
      stay: stayShare,
      transport: transportShare,
      food: foodShare,
      activities: activitiesShare,
      buffer: emergencyBuffer,
      stayTotal: stayShare * numStudents,
      transportTotal: transportShare * numStudents,
      foodTotal: foodShare * numStudents,
      activitiesTotal: activitiesShare * numStudents,
      bufferTotal: emergencyBuffer * numStudents,
    };
  }, [budgetPerStudent, numStudents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPreset = (preset) => {
    const computedTotal = preset.perDay * numDays;
    setFormData((prev) => ({
      ...prev,
      budgetPerHead: String(computedTotal),
    }));
  };

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    const queryParams = new URLSearchParams({
      destination: formData.destination,
      origin: formData.origin,
      startDate: formData.startDate,
      days: String(numDays),
      persons: String(numStudents),
      budget: String(totalGroupBudget),
      tripType: "Students",
      studentBudgetPerHead: String(budgetPerStudent),
      stayType: formData.stayType,
      transport: formData.transportPreference,
    });

    const targetUrl = `/student-plan?${queryParams.toString()}`;
    const token = localStorage.getItem("travelGurujiToken");

    if (!token) {
      setIsGenerating(false);
      try {
        sessionStorage.setItem("travelGurujiReturnTo", targetUrl);
      } catch {
        // Ignore
      }
      showToast("Please do login before creating your student trip plan.", "warning", 5000);
      navigate("/login", {
        state: {
          returnTo: targetUrl,
          action: "plan",
          message: "Please do login before creating your student trip plan.",
        },
      });
      return;
    }

    setTimeout(() => {
      navigate(targetUrl);
    }, 600);
  };

  const currentDailyBudget = Math.round(budgetPerStudent / numDays);

  return (
    <main className="student-planner-page">
      <div className="student-planner-container">
        
        {/* STUDENT PLANNER HEADER */}
        <div className="student-planner-header">
          <span className="student-planner-badge">
            🎓 Dedicated Student & Youth Trip Planner
          </span>
          <h1 className="student-planner-title">
            Smart Student Trip Planner.
          </h1>
          <p className="student-planner-subtitle">
            Designed specifically for college friends, university clubs, and backpackers.
            Auto-calculates room splits, applies student concessions, and finds student-recommended homestays.
          </p>

          <div style={{ background: "#ecfdf5", border: "1.5px solid #a7f3d0", borderRadius: "14px", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginTop: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>💳</span>
              <div>
                <strong style={{ color: "#065f46", fontSize: "14px", display: "block" }}>Subsidized Student Concession Rates Active (~48% Lower Budget)</strong>
                <span style={{ color: "#047857", fontSize: "12px" }}>Includes IRCTC 50% sleeper concession, ₹550/night youth dorms & campus mess dining.</span>
              </div>
            </div>
            <span style={{ background: "#10b981", color: "#ffffff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "800" }}>
              ✓ Verified Concession
            </span>
          </div>
        </div>

        {/* PREVIOUS DRAFT RESTORATION BANNER */}
        {savedStudentDraft && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)",
              border: "1.5px solid rgba(16, 185, 129, 0.5)",
              borderRadius: "14px",
              padding: "14px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 18px rgba(16, 185, 129, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "22px" }}>✅</span>
              <div>
                <strong style={{ color: "#10b981", fontSize: "14px", display: "block" }}>
                  Previous Student Trip Plan Parameters Restored
                </strong>
                <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "13px" }}>
                  Your route to {formData.destination || "selected destination"}, {formData.studentsCount || "4"} student group, and ₹{formData.budgetPerHead || "3600"}/head budget have been loaded.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.removeItem("travelGurujiStudentPlannerDraft");
                } catch {
                  // Ignore
                }
                window.location.reload();
              }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#e2e8f0",
                fontSize: "12px",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Start Fresh ↺
            </button>
          </div>
        )}

        {/* PLANNER FORM */}
        <form onSubmit={handleGeneratePlan} className="student-planner-card">
          {/* STEP 1: JOURNEY ESSENTIALS */}
          <div className="student-planner-step">
            <div className="student-step-header">
              <span className="student-step-number" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                1
              </span>
              <h3 className="student-step-title">College Route & Travel Dates</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div>
                <label className="student-form-label">
                  📍 College / Starting City (Origin)
                </label>
                <select
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="student-form-control"
                  required
                >
                  {(SUPPORTED_ORIGINS || MAJOR_ORIGINS).map((city) => (
                    <option key={city} value={city}>
                      📍 {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="student-form-label">
                  🎯 Target Destination
                </label>
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="student-form-control"
                  required
                >
                  {POPULAR_STUDENT_DESTINATIONS.map((d) => (
                    <option key={d} value={d}>
                      🎯 {d} (Popular Student Pick)
                    </option>
                  ))}
                  {destinations
                    .filter((d) => !POPULAR_STUDENT_DESTINATIONS.includes(d.name))
                    .map((d) => (
                      <option key={d.id} value={d.name}>
                        🎯 {d.name} ({d.state})
                      </option>
                    ))}
                </select>

                {disasterAlertForDest && disasterAlertForDest.alertTier === "RED" && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #f87171",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px" }}>🔴</span>
                      <div>
                        <strong style={{ color: "#991b1b", fontSize: "12px", display: "block" }}>
                          REAL-TIME DISASTER ZONE: {disasterAlertForDest.title}
                        </strong>
                        <span style={{ color: "#7f1d1d", fontSize: "11px" }}>
                          Status: 🚫 {disasterAlertForDest.movementStatus} • Affected: {disasterAlertForDest.affectedCorridors}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/emergency?dest=${encodeURIComponent(disasterAlertForDest.destination)}`}
                      target="_blank"
                      style={{
                        background: "#dc2626",
                        color: "#ffffff",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "700",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Safe Detours & Hub ➔
                    </Link>
                  </div>
                )}

                {disasterAlertForDest && disasterAlertForDest.alertTier === "YELLOW" && (
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px" }}>🟡</span>
                      <div>
                        <strong style={{ color: "#92400e", fontSize: "12px", display: "block" }}>
                          WEATHER / TERRAIN ADVISORY: {disasterAlertForDest.title}
                        </strong>
                        <span style={{ color: "#78350f", fontSize: "11px" }}>
                          Status: ⚠️ {disasterAlertForDest.movementStatus} • Corridors open with caution
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/emergency?dest=${encodeURIComponent(disasterAlertForDest.destination)}`}
                      target="_blank"
                      style={{
                        background: "#d97706",
                        color: "#ffffff",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "700",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      View Advisory ➔
                    </Link>
                  </div>
                )}

                {disasterAlertForDest && disasterAlertForDest.isRainAlert && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>🌧️</span>
                    <span style={{ fontSize: "11px", color: "#065f46", fontWeight: "700" }}>
                      <strong>Green Alert / Rain Alert:</strong> Standard rainfall recorded. All student routes 100% open & safe.
                    </span>
                  </div>
                )}

                {disasterAlertForDest && disasterAlertForDest.alertTier === "GREEN" && !disasterAlertForDest.isRainAlert && (
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ color: "#10b981", fontSize: "13px", fontWeight: "900" }}>✓</span>
                    <span style={{ fontSize: "11px", color: "#475569", fontWeight: "600" }}>
                      All student travel corridors open & verified normal. 0 active disasters.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginTop: "16px" }}>
              <div>
                <label className="student-form-label">
                  📅 Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="student-form-control"
                  required
                />
              </div>

              <div>
                <label className="student-form-label">
                  ⏱️ Trip Duration (Days)
                </label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  min="1"
                  max="14"
                  className="student-form-control"
                  required
                />
              </div>

              <div>
                <label className="student-form-label">
                  👥 Number of Students / Friends
                </label>
                <select
                  name="studentsCount"
                  value={formData.studentsCount}
                  onChange={handleChange}
                  className="student-form-control"
                >
                  <option value="1">🧍 1 (Solo Backpacker)</option>
                  <option value="2">👥 2 (Duo)</option>
                  <option value="3">👥 3 (Triple Share)</option>
                  <option value="4">🎒 4 (Classic 4-Bed Dorm Squad)</option>
                  <option value="5">👥 5 (5 Friends)</option>
                  <option value="6">🏕️ 6+ (College Group / Gang)</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 2: BUDGET & PER-STUDENT SPLIT */}
          <div className="student-planner-step">
            <div className="student-step-header">
              <span className="student-step-number" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                2
              </span>
              <h3 className="student-step-title">Student Pocket Money & Live Group Split</h3>
            </div>

            {/* QUICK PRESET BUTTONS */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                ⚡ Student Budget Presets:
              </label>
              <div className="student-presets-grid">
                {STUDENT_BUDGET_PRESETS.map((preset) => {
                  const isActive = currentDailyBudget === preset.perDay;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`student-preset-card ${isActive ? "active" : ""}`}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                        <strong style={{ fontSize: "13px", color: isActive ? "#1d4ed8" : "#0f172a" }}>{preset.label}</strong>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: isActive ? "#2563eb" : "#059669" }}>~₹{preset.perDay}/d</span>
                      </div>
                      <small style={{ color: "#64748b", fontSize: "11px", display: "block", lineHeight: 1.4 }}>{preset.desc}</small>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div>
                <label className="student-form-label">
                  💰 Target Budget PER STUDENT (₹)
                </label>
                <input
                  type="number"
                  name="budgetPerHead"
                  value={formData.budgetPerHead}
                  onChange={handleChange}
                  min="1"
                  step="any"
                  className="student-form-control"
                  style={{ fontSize: "16px", fontWeight: 700, color: "#059669" }}
                  required
                />
                <small style={{ color: "#64748b", fontSize: "12px", marginTop: "4px", display: "inline-block" }}>
                  ~₹{currentDailyBudget.toLocaleString("en-IN")} per student per day
                </small>
              </div>

              <div>
                <label className="student-form-label">
                  👥 TOTAL SQUAD POOL ({numStudents} Students)
                </label>
                <div className="student-pool-card">
                  <div className="student-pool-amount">
                    ₹{totalGroupBudget.toLocaleString("en-IN")}
                  </div>
                  <small style={{ color: "#065f46", fontSize: "12px", fontWeight: 500, marginTop: "2px" }}>
                    Combined group budget managed by Travel Guruji
                  </small>
                </div>
              </div>
            </div>

            {/* LIVE PER-STUDENT ALLOCATION CARDS */}
            <div className="student-split-wrapper">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                <strong style={{ fontSize: "12px", color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>💡</span> Live Per-Student Cost Allocation Model
                </strong>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Splits applied automatically</span>
              </div>

              <div className="student-split-grid">
                <div className="student-split-pill">
                  <small style={{ color: "#64748b", fontSize: "11px", display: "block" }}>🏡 Homestay / Dorm</small>
                  <strong style={{ color: "#0f172a", fontSize: "14px" }}>₹{studentCostSplit.stay.toLocaleString("en-IN")}</strong>
                  <span style={{ color: "#94a3b8", fontSize: "10px", display: "block" }}>35% allocation</span>
                </div>
                <div className="student-split-pill">
                  <small style={{ color: "#64748b", fontSize: "11px", display: "block" }}>🚆 Train / Bus Transit</small>
                  <strong style={{ color: "#0f172a", fontSize: "14px" }}>₹{studentCostSplit.transport.toLocaleString("en-IN")}</strong>
                  <span style={{ color: "#94a3b8", fontSize: "10px", display: "block" }}>25% allocation</span>
                </div>
                <div className="student-split-pill">
                  <small style={{ color: "#64748b", fontSize: "11px", display: "block" }}>🍲 Street Food & Cafes</small>
                  <strong style={{ color: "#0f172a", fontSize: "14px" }}>₹{studentCostSplit.food.toLocaleString("en-IN")}</strong>
                  <span style={{ color: "#94a3b8", fontSize: "10px", display: "block" }}>20% allocation</span>
                </div>
                <div className="student-split-pill">
                  <small style={{ color: "#64748b", fontSize: "11px", display: "block" }}>🎟️ Sights & Passes</small>
                  <strong style={{ color: "#0f172a", fontSize: "14px" }}>₹{studentCostSplit.activities.toLocaleString("en-IN")}</strong>
                  <span style={{ color: "#94a3b8", fontSize: "10px", display: "block" }}>10% allocation</span>
                </div>
                <div className="student-split-pill" style={{ borderColor: "#a7f3d0", background: "#f0fdf4" }}>
                  <small style={{ color: "#065f46", fontSize: "11px", display: "block" }}>🛡️ Safety Buffer</small>
                  <strong style={{ color: "#047857", fontSize: "14px" }}>₹{studentCostSplit.buffer.toLocaleString("en-IN")}</strong>
                  <span style={{ color: "#059669", fontSize: "10px", display: "block" }}>10% emergency</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: STUDENT PREFERENCES & CONCESSIONS */}
          <div className="student-planner-step">
            <div className="student-step-header">
              <span className="student-step-number" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
                3
              </span>
              <h3 className="student-step-title">Student Stays & Concessions</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div>
                <label className="student-form-label">
                  🏡 Stay Style
                </label>
                <select
                  name="stayType"
                  value={formData.stayType}
                  onChange={handleChange}
                  className="student-form-control"
                >
                  <option value="student-homestay">🏡 Verified Student-Recommended Homestays (~₹900/nt)</option>
                  <option value="backpacker-dorm">🎒 Backpacker Bunk Dorm (Zostel Style, ~₹650/nt)</option>
                  <option value="budget-hotel">🏨 Budget Quad-Sharing Room (~₹1,400/nt)</option>
                </select>
              </div>

              <div>
                <label className="student-form-label">
                  🚆 Intercity Transit Preference
                </label>
                <select
                  name="transportPreference"
                  value={formData.transportPreference}
                  onChange={handleChange}
                  className="student-form-control"
                >
                  <option value="Sleeper Train / State RTC">🚆 Sleeper Class Train / State RTC Bus (High Savings)</option>
                  <option value="3AC Train">🚆 3AC / Chair Car Express (Comfortable)</option>
                  <option value="AC Volvo Bus">🚌 AC Semi-Sleeper Volvo Bus</option>
                  <option value="Flexible">🔄 Flexible (Auto-Match Cheapest Mode)</option>
                </select>
              </div>
            </div>

            {/* STUDENT CONCESSION BADGES */}
            <div className="student-perks-box">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "18px" }}>🎟️</span>
                <strong style={{ fontSize: "14px", color: "#0f172a" }}>Student Concessions & Smart Hacks Applied:</strong>
              </div>
              <div style={{ display: "grid", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#334155" }}>
                  <span style={{ color: "#16a34a", fontWeight: 800 }}>✓</span>
                  <span><strong>ASI Monument Passes:</strong> Free / ₹5 entry with college ID card at historical sites.</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#334155" }}>
                  <span style={{ color: "#16a34a", fontWeight: 800 }}>✓</span>
                  <span><strong>Student-Friendly Homestay Perks:</strong> Kitchen access for midnight Maggi & shared tea included.</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#334155" }}>
                  <span style={{ color: "#16a34a", fontWeight: 800 }}>✓</span>
                  <span><strong>Transit Concession:</strong> Preferential Sleeper & State Express timing optimization.</span>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <button
              type="submit"
              disabled={isGenerating}
              className="student-submit-btn"
            >
              <span>{isGenerating ? "⏳ Generating Cost-Friendly Plan..." : "⚡ Generate Student Trip Plan ➔"}</span>
            </button>
            <div style={{ marginTop: "14px", fontSize: "13px", color: "#64748b" }}>
              Already have a plan? <Link to="/plan-history" style={{ color: "#2563eb", fontWeight: 600 }}>Check your Plan History ↗</Link>
            </div>
          </div>
        </form>

      </div>
    </main>
  );
}

export default StudentPlanner;
