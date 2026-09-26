import { useState, useEffect, useMemo } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import hotels from "../data/hotels";
import destinations from "../data/destinations";
import { MAJOR_ORIGINS, SUPPORTED_ORIGINS } from "../services/plannerService";
import { getActiveDisasterAlerts } from "../services/emergencyApi";
import { showToast } from "../components/Toast";

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

const INTEREST_OPTIONS = [
  { id: "Culture & Heritage", label: "🏛️ Culture & Heritage" },
  { id: "Nature & Scenic", label: "🏔️ Nature & Scenic" },
  { id: "Adventure & Treks", label: "🧗 Adventure & Treks" },
  { id: "Food & Markets", label: "🍜 Food & Bazaars" },
  { id: "Relaxed & Leisure", label: "🌿 Relaxed & Leisure" },
];

function Planner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const destinationFromUrl = searchParams.get("destination") || "";
  const hotelFromUrl = searchParams.get("hotel") || "";
  const localExperiencesFromUrl = searchParams.get("localExperiences") || "";
  const localExperienceFromUrl = searchParams.get("localExperience") || "";

  const [savedPlannerDraft] = useState(() => {
    try {
      const savedDraft = sessionStorage.getItem("travelGurujiPlannerDraft");
      if (!savedDraft) return null;
      const parsedDraft = JSON.parse(savedDraft);
      return parsedDraft && typeof parsedDraft === "object" ? parsedDraft : null;
    } catch (error) {
      console.error("Planner draft loading failed:", error);
      return null;
    }
  });

  const initialDestination =
    savedPlannerDraft?.formData?.destination || destinationFromUrl;

  const initialHotel =
    savedPlannerDraft?.formData?.hotel || hotelFromUrl;

  const [formData, setFormData] = useState({
    origin: savedPlannerDraft?.formData?.origin || "New Delhi",
    destination: initialDestination,
    startDate: savedPlannerDraft?.formData?.startDate || "",
    endDate: savedPlannerDraft?.formData?.endDate || "",
    days: savedPlannerDraft?.formData?.days || "3",
    hotel: initialHotel,
    tripType: savedPlannerDraft?.formData?.tripType || "Friends",
    adults: savedPlannerDraft?.formData?.adults || "2",
    children: savedPlannerDraft?.formData?.children || "0",
    persons: savedPlannerDraft?.formData?.persons || "2",
    budget: savedPlannerDraft?.formData?.budget || "30000",
    stayPref: savedPlannerDraft?.formData?.stayPref || "Mid-Range",
    transportMode: savedPlannerDraft?.formData?.transportMode || "Flexible",
    foodPref: savedPlannerDraft?.formData?.foodPref || "Flexible",
    walkingPref: savedPlannerDraft?.formData?.walkingPref || "Moderate",
    tripStyle: savedPlannerDraft?.formData?.tripStyle || "Balanced",
    lateNightPref: savedPlannerDraft?.formData?.lateNightPref || "Avoid Late Night",
    safetyPref: savedPlannerDraft?.formData?.safetyPref || "Standard",
    interests: savedPlannerDraft?.formData?.interests || [
      "Culture & Heritage",
      "Nature & Scenic",
    ],
  });

  const [hotelSuggestionsOpen, setHotelSuggestionsOpen] = useState(false);
  const [error, setError] = useState("");
  const [disasterAlerts, setDisasterAlerts] = useState([]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await getActiveDisasterAlerts();
        if (res && res.alerts) setDisasterAlerts(res.alerts);
      } catch (err) {
        console.warn("Could not load alerts in planner:", err);
      }
    }
    loadAlerts();
  }, []);

  // Continuously preserve planner draft so user never loses state if redirected to login
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "travelGurujiPlannerDraft",
        JSON.stringify({ formData, selectedLocalExperiences })
      );
    } catch {
      // Ignore
    }
  }, [formData, selectedLocalExperiences]);

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

  const [selectedHotel, setSelectedHotel] = useState(() => {
    const initialHotelName = savedPlannerDraft?.formData?.hotel || hotelFromUrl;
    if (!initialHotelName) return null;
    return (
      hotels.find(
        (hotel) => normalize(hotel.name) === normalize(initialHotelName)
      ) || null
    );
  });

  const [selectedLocalExperiences] = useState(() => {
    if (Array.isArray(savedPlannerDraft?.selectedLocalExperiences)) {
      return savedPlannerDraft.selectedLocalExperiences;
    }
    if (localExperiencesFromUrl) {
      try {
        const parsed = JSON.parse(decodeURIComponent(localExperiencesFromUrl));
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        void err;
        try {
          const parsed = JSON.parse(localExperiencesFromUrl);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // Ignore invalid JSON
        }
      }
    }
    if (localExperienceFromUrl) {
      try {
        return [JSON.parse(decodeURIComponent(localExperienceFromUrl))];
      } catch {
        // Ignore invalid JSON
      }
    }
    return [];
  });

  const destinationSearch = normalize(formData.destination);
  const hotelSearch = normalize(formData.hotel);

  const destinationHotels = destinationSearch
    ? hotels.filter((hotel) => {
        const hotelDestination = normalize(hotel.destination);
        return (
          hotelDestination.includes(destinationSearch) ||
          destinationSearch.includes(hotelDestination)
        );
      })
    : [];

  const filteredHotelSuggestions = destinationHotels.filter(
    (hotel) =>
      !hotelSearch || normalize(hotel.name).includes(hotelSearch)
  );

  function handleDestinationChange(event) {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      destination: value,
      hotel: "",
    }));
    setSelectedHotel(null);
    setHotelSuggestionsOpen(false);
    setError("");
  }

  function handleStartDateChange(event) {
    const startVal = event.target.value;
    setFormData((prev) => {
      let computedEnd = prev.endDate;
      const numDays = Number(prev.days);
      if (startVal && numDays >= 1) {
        const startD = new Date(startVal);
        startD.setDate(startD.getDate() + (numDays - 1));
        computedEnd = startD.toISOString().split("T")[0];
      }
      return { ...prev, startDate: startVal, endDate: computedEnd };
    });
    setError("");
  }

  function handleEndDateChange(event) {
    const endVal = event.target.value;
    setFormData((prev) => {
      let computedDays = prev.days;
      if (prev.startDate && endVal) {
        const startD = new Date(prev.startDate);
        const endD = new Date(endVal);
        const diffTime = endD - startD;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays >= 1) {
          computedDays = String(diffDays);
        }
      }
      return { ...prev, endDate: endVal, days: computedDays };
    });
    setError("");
  }

  function handleDaysChange(event) {
    const daysVal = event.target.value;
    setFormData((prev) => {
      let computedEnd = prev.endDate;
      const numDays = Number(daysVal);
      if (prev.startDate && numDays >= 1) {
        const startD = new Date(prev.startDate);
        startD.setDate(startD.getDate() + (numDays - 1));
        computedEnd = startD.toISOString().split("T")[0];
      }
      return { ...prev, days: daysVal, endDate: computedEnd };
    });
    setError("");
  }

  function toggleInterest(interestId) {
    setFormData((prev) => {
      const current = prev.interests || [];
      const updated = current.includes(interestId)
        ? current.filter((i) => i !== interestId)
        : [...current, interestId];
      return { ...prev, interests: updated };
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "tripType") {
      if (value === "Solo") {
        setFormData((prev) => ({
          ...prev,
          tripType: value,
          adults: "1",
          children: "0",
          persons: "1",
        }));
        setError("");
        return;
      }
      if (value === "Couple") {
        setFormData((prev) => ({
          ...prev,
          tripType: value,
          adults: "2",
          children: "0",
          persons: "2",
        }));
        setError("");
        return;
      }
      if (value === "Students") {
        setFormData((prev) => ({
          ...prev,
          tripType: value,
          adults: prev.adults && Number(prev.adults) >= 2 ? prev.adults : "4",
          children: "0",
          persons: prev.adults && Number(prev.adults) >= 2 ? prev.adults : "4",
        }));
        setError("");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        tripType: value,
      }));
      setError("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");

    if (name === "hotel") {
      setSelectedHotel(null);
      setHotelSuggestionsOpen(true);
    }
  }

  function handleHotelSelect(hotel) {
    setFormData((prev) => ({
      ...prev,
      destination: hotel.destination,
      hotel: hotel.name,
    }));
    setSelectedHotel(hotel);
    setHotelSuggestionsOpen(false);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.destination.trim() || !formData.startDate || !formData.budget) {
      setError("Please provide Destination, Start Date, and Budget.");
      return;
    }

    const calculatedDays = Number(formData.days) || 1;
    const calculatedBudget = Number(formData.budget) || 0;
    const totalPersons = Math.max(
      1,
      (Number(formData.adults) || 0) + (Number(formData.children) || 0)
    );

    if (calculatedDays < 1) {
      setError("Trip duration must be at least 1 day.");
      return;
    }

    if (calculatedBudget < 1) {
      setError("Budget must be greater than ₹0.");
      return;
    }

    if (formData.tripType === "Solo" && totalPersons !== 1) {
      setError("Solo travel must have exactly 1 person.");
      return;
    }

    if (formData.tripType === "Couple" && totalPersons < 2) {
      setError("Couple travel requires at least 2 travelers.");
      return;
    }

    setError("");

    const params = new URLSearchParams();
    params.set("origin", formData.origin.trim());
    params.set("destination", formData.destination.trim());
    params.set("startDate", formData.startDate);
    if (formData.endDate) params.set("endDate", formData.endDate);
    params.set("days", String(calculatedDays));
    params.set("adults", String(formData.adults || 1));
    params.set("children", String(formData.children || 0));
    params.set("persons", String(totalPersons));
    params.set("budget", String(calculatedBudget));
    params.set("tripType", formData.tripType);
    if (formData.hotel.trim()) params.set("hotel", formData.hotel.trim());
    params.set("stayPref", formData.stayPref);
    params.set("transport", formData.transportMode);
    params.set("foodPref", formData.foodPref);
    params.set("walkingPref", formData.walkingPref);
    params.set("tripStyle", formData.tripStyle);
    params.set("lateNightPref", formData.lateNightPref);
    params.set("safetyPref", formData.safetyPref);

    if (formData.interests && formData.interests.length > 0) {
      params.set("interests", formData.interests.join(","));
    }

    if (selectedLocalExperiences.length > 0) {
      params.set(
        "localExperiences",
        encodeURIComponent(JSON.stringify(selectedLocalExperiences))
      );
    }

    // Save draft
    try {
      sessionStorage.setItem(
        "travelGurujiPlannerDraft",
        JSON.stringify({ formData, selectedLocalExperiences })
      );
    } catch {
      // Ignore session storage failure
    }

    const token = localStorage.getItem("travelGurujiToken");
    const targetUrl =
      formData.tripType === "Students"
        ? `/student-plan?${params.toString()}`
        : `/trip-plan?${params.toString()}`;

    if (!token) {
      try {
        sessionStorage.setItem("travelGurujiReturnTo", targetUrl);
      } catch {
        // Ignore
      }
      showToast("Please do login before creating or viewing your trip plan.", "warning", 5000);
      navigate("/login", {
        state: {
          returnTo: targetUrl,
          action: "plan",
          message: "Please do login before creating or viewing your trip plan.",
        },
      });
      return;
    }

    if (formData.tripType === "Students") {
      navigate(`/student-plan?${params.toString()}`);
    } else {
      navigate(`/trip-plan?${params.toString()}`);
    }
  }

  function handleCancelTrip() {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/");
    }
  }

  return (
    <main className="planner-page">
      {/* Blurred Scenic Indian Mountain Background */}
      <div className="planner-bg-backdrop" aria-hidden="true">
        <div className="planner-bg-image" />
        <div className="planner-bg-overlay" />
      </div>

      <div className="planner-content">
        <div className="planner-header-top">
          <div className="planner-badge-pill">
            <span className="planner-pulse-dot" />
            <span>TRIP ARCHITECT &bull; ROUTE &amp; BUDGET FRIENDLY</span>
          </div>
        </div>

        <h1 className="planner-main-title">
           Trip Planner<span className="planner-title-dot"></span>
          <span className="planner-gradient-subtitle">
            Budget-Aware &amp; Contextual Journey Engine
          </span>
        </h1>

        <p className="planner-description">
          Configure your origin, travel dates, companion dynamics and spending preferences.
          Travel Guruji synthesizes custom route intelligence, safe corridor detours and live budget allocations into your itinerary.
        </p>

        {/* STUDENT SPECIAL BANNER */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(30, 58, 138, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            borderRadius: "16px",
            padding: "16px 22px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span
              style={{
                fontSize: "26px",
                background: "rgba(59, 130, 246, 0.2)",
                borderRadius: "12px",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              🎓
            </span>
            <div>
              <div
                style={{
                  fontWeight: "700",
                  color: "#60a5fa",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                College &amp; University Student Special
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "13px", marginTop: "3px" }}>
                Save up to <strong>48%</strong> with verified student passes, youth dorms &amp; IRCTC rail concessions.
              </div>
            </div>
          </div>
          <Link
            to="/student-planner"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "13px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Open Student Planner ➔
          </Link>
        </div>

        <form className="planner-form" onSubmit={handleSubmit}>
          {/* STEP 1: JOURNEY ESSENTIALS */}
          <section className="planner-step-card">
            <div className="planner-step-header">
              <span className="planner-step-num">1</span>
              <div>
                <h3 className="planner-step-title">Journey Essentials</h3>
                <p className="planner-step-subtitle">Where you start, your destination, and travel dates</p>
              </div>
            </div>

            <div className="planner-row-2">
              {/* ORIGIN / STARTING LOCATION */}
              <div className="form-group">
                <label htmlFor="origin">Starting Location (Origin)</label>
                <select
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Starting City...</option>
                  {(SUPPORTED_ORIGINS || MAJOR_ORIGINS).map((city) => (
                    <option key={city} value={city}>
                      📍 {city}
                    </option>
                  ))}
                  {formData.origin && !(SUPPORTED_ORIGINS || MAJOR_ORIGINS).includes(formData.origin) && (
                    <option value={formData.origin}>📍 {formData.origin}</option>
                  )}
                </select>
              </div>

              {/* DESTINATION */}
              <div className="form-group">
                <label htmlFor="destination">Destination</label>
                <select
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleDestinationChange}
                  required
                >
                  <option value="" disabled>Select Destination...</option>
                  {destinations.map((dest) => (
                    <option key={dest.id} value={dest.name}>
                      🎯 {dest.name} ({dest.state})
                    </option>
                  ))}
                  {formData.destination && !destinations.some((d) => d.name.toLowerCase() === formData.destination.toLowerCase()) && (
                    <option value={formData.destination}>🎯 {formData.destination}</option>
                  )}
                </select>

                {disasterAlertForDest && disasterAlertForDest.alertTier === "RED" && (
                  <div className="planner-disaster-alert" style={{ background: "#fef2f2", border: "1.5px solid #ef4444", borderLeft: "5px solid #dc2626" }}>
                    <div className="planner-disaster-info">
                      <span className="planner-disaster-badge" style={{ background: "#fee2e2" }}>🔴</span>
                      <div className="planner-disaster-text-wrap">
                        <div className="planner-disaster-tag" style={{ color: "#b91c1c" }}>REAL-TIME DISASTER ZONE • HAZARDOUS TRAVEL</div>
                        <strong className="planner-disaster-title" style={{ color: "#991b1b" }}>
                          {disasterAlertForDest.title}
                        </strong>
                        <div className="planner-disaster-meta">
                          <span className="planner-status-pill" style={{ background: "#fee2e2", color: "#991b1b" }}>
                            🚫 {disasterAlertForDest.movementStatus}
                          </span>
                          <span className="planner-corridor-text">Affected: {disasterAlertForDest.affectedCorridors}</span>
                        </div>
                      </div>
                    </div>
                    <div className="planner-disaster-actions">
                      {disasterAlertForDest.safeAlternativeHub && (
                        <button
                          type="button"
                          onClick={() => {
                            const cleanHub = disasterAlertForDest.safeAlternativeHub.split(/[/,]/)[0].trim();
                            const matchedDest = destinations.find(
                              (d) => d.name.toLowerCase() === cleanHub.toLowerCase()
                            );
                            setFormData((prev) => ({
                              ...prev,
                              destination: matchedDest ? matchedDest.name : cleanHub,
                              hotel: "",
                            }));
                            setSelectedHotel(null);
                          }}
                          className="planner-replan-hub-btn"
                        >
                          <span className="btn-icon">🛡️</span> Replan to Safe Hub: <strong>{disasterAlertForDest.safeAlternativeHub.split(/[/,]/)[0].trim()}</strong>
                        </button>
                      )}
                      <Link
                        to={`/emergency?dest=${encodeURIComponent(disasterAlertForDest.destination)}&tab=REPLAN`}
                        target="_blank"
                        className="planner-detour-btn"
                      >
                        View Evacuation Detour & Emergency Hub ➔
                      </Link>
                    </div>
                  </div>
                )}

                {disasterAlertForDest && disasterAlertForDest.alertTier === "YELLOW" && (
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1.5px solid #fde68a",
                      borderLeft: "5px solid #f59e0b",
                      borderRadius: "14px",
                      padding: "14px 18px",
                      marginTop: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "24px" }}>🟡</span>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "800", color: "#b45309", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          CAUTION ADVISORY • MOVEMENT FEASIBLE
                        </div>
                        <strong style={{ color: "#92400e", fontSize: "14px", display: "block" }}>
                          {disasterAlertForDest.title}
                        </strong>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                          <span style={{ background: "#fef3c7", color: "#b45309", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>
                            ⚠️ {disasterAlertForDest.movementStatus}
                          </span>
                          <span style={{ fontSize: "12px", color: "#78350f" }}>
                            Corridors: {disasterAlertForDest.affectedCorridors || "Open with local caution"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/emergency?dest=${encodeURIComponent(disasterAlertForDest.destination)}`}
                      target="_blank"
                      style={{
                        background: "#d97706",
                        color: "#ffffff",
                        padding: "7px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        textDecoration: "none",
                      }}
                    >
                      View Advisory Details ➔
                    </Link>
                  </div>
                )}

                {disasterAlertForDest && disasterAlertForDest.isRainAlert && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "1.5px solid #bbf7d0",
                      borderLeft: "5px solid #10b981",
                      borderRadius: "14px",
                      padding: "12px 18px",
                      marginTop: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "22px" }}>🌧️</span>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          GREEN ALERT • RAIN ALERT (MOVEMENT 100% POSSIBLE)
                        </div>
                        <strong style={{ color: "#064e3b", fontSize: "13.5px", display: "block" }}>
                          {disasterAlertForDest.title || "Standard Rainfall Detected"}
                        </strong>
                        <span style={{ color: "#047857", fontSize: "12px" }}>
                          ✓ {disasterAlertForDest.movementStatus} • No flood or road blocks.
                        </span>
                      </div>
                    </div>
                    <span style={{ background: "#d1fae5", color: "#065f46", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px" }}>
                      🟢 Routes Fully Operational
                    </span>
                  </div>
                )}

                {disasterAlertForDest && disasterAlertForDest.alertTier === "GREEN" && !disasterAlertForDest.isRainAlert && (
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderLeft: "4px solid #10b981",
                      borderRadius: "10px",
                      padding: "8px 14px",
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#10b981", fontSize: "16px", fontWeight: "900" }}>✓</span>
                      <span style={{ fontSize: "12px", color: "#334155", fontWeight: "600" }}>
                        <strong>Normal Destination Status:</strong> All routes clear & verified. 0 active disaster risks.
                      </span>
                    </div>
                    <Link
                      to={`/emergency?dest=${encodeURIComponent(disasterAlertForDest.destination)}`}
                      target="_blank"
                      style={{ fontSize: "11px", color: "#059669", fontWeight: "700", textDecoration: "none" }}
                    >
                      Inspect Live Radar ➔
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="planner-row-3">
              {/* START DATE */}
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleStartDateChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* END DATE */}
              <div className="form-group">
                <label htmlFor="endDate">
                  End Date <span className="planner-optional">Auto-calculated</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleEndDateChange}
                  min={formData.startDate || new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* DURATION (DAYS) */}
              <div className="form-group">
                <label htmlFor="days">Trip Duration (Days)</label>
                <input
                  id="days"
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleDaysChange}
                  min="1"
                  max="30"
                  required
                />
              </div>
            </div>

            {/* CHOOSE HOTEL (OPTIONAL) */}
            <div className="form-group planner-hotel-group">
              <label htmlFor="hotel">
                Specific Hotel <span className="planner-optional">Optional</span>
              </label>
              <div className="planner-hotel-input-wrapper">
                <input
                  id="hotel"
                  type="text"
                  name="hotel"
                  value={formData.hotel}
                  onChange={handleChange}
                  onFocus={() => {
                    if (formData.destination) setHotelSuggestionsOpen(true);
                  }}
                  placeholder={
                    formData.destination
                      ? "Search hotel or leave blank for automatic recommendation"
                      : "Enter destination first"
                  }
                  autoComplete="off"
                  disabled={!formData.destination}
                />

                {formData.destination && hotelSuggestionsOpen && (
                  <div className="planner-hotel-options">
                    {filteredHotelSuggestions.length > 0 ? (
                      filteredHotelSuggestions.slice(0, 6).map((hotel) => {
                        const isSelected = selectedHotel?.id === hotel.id;
                        return (
                          <button
                            type="button"
                            key={hotel.id}
                            className={`planner-hotel-option ${isSelected ? "selected" : ""}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleHotelSelect(hotel);
                            }}
                          >
                            <span className="planner-hotel-option-info">
                              <strong>{hotel.name}</strong>
                              <span>
                                📍 {hotel.destination} • ₹{Number(hotel.price || 0).toLocaleString("en-IN")}/night
                              </span>
                            </span>
                            {isSelected && <span className="planner-hotel-check">✓</span>}
                          </button>
                        );
                      })
                    ) : (
                      <div className="planner-hotel-empty">
                        No specific hotel match for <strong>{formData.destination}</strong>. We will auto-recommend.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* STEP 2: TRAVELERS & BUDGET */}
          <section className="planner-step-card">
            <div className="planner-step-header">
              <span className="planner-step-num">2</span>
              <div>
                <h3 className="planner-step-title">Travelers & Total Budget</h3>
                <p className="planner-step-subtitle">Calibrate costs for group dynamics and spending capacity</p>
              </div>
            </div>

            <div className="planner-row-3">
              {/* TRIP TYPE */}
              <div className="form-group">
                <label htmlFor="tripType">Who are you travelling with?</label>
                <select
                  id="tripType"
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleChange}
                >
                  <option value="Solo">🧍 Solo Travel</option>
                  <option value="Couple">💑 Couple</option>
                  <option value="Family">👨‍👩‍👧 Family</option>
                  <option value="Friends">👥 Friends</option>
                  <option value="Students">🎒 Student Group / College Tour (Subsidized)</option>
                  <option value="Senior Citizens">👴 Senior Citizens</option>
                </select>
                {formData.tripType === "Students" && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px 14px",
                      background: "rgba(37, 99, 235, 0.15)",
                      border: "1px solid rgba(59, 130, 246, 0.35)",
                      borderRadius: "10px",
                      fontSize: "12px",
                      color: "#93c5fd",
                      lineHeight: "1.5",
                    }}
                  >
                    🎓 <strong>Student Subsidies Activated:</strong> Includes 50% IRCTC Sleeper rail concession, youth dormitories (₹550/nt), and ASI monument discounts (~48% lower budget).
                  </div>
                )}
              </div>

              {/* ADULTS */}
              <div className="form-group">
                <label htmlFor="adults">Adults (18+ yrs)</label>
                <input
                  id="adults"
                  type="number"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  readOnly={formData.tripType === "Solo"}
                  required
                />
              </div>

              {/* CHILDREN */}
              <div className="form-group">
                <label htmlFor="children">Children (0–10 yrs)</label>
                <input
                  id="children"
                  type="number"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  disabled={formData.tripType === "Solo"}
                />
              </div>
            </div>

            {/* TOTAL BUDGET */}
            <div className="form-group">
              <label htmlFor="budget">
                Total Trip Budget (₹)
                <span className="planner-optional">Includes Stays, Travel, Food & Emergency Buffer</span>
              </label>
              <input
                id="budget"
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Example: 30000"
                min="1000"
                required
              />
              <small className="planner-field-hint">
                The planner will calibrate your accommodation, transit, and dining choices to stay within this limit.
              </small>

              {/* LIVE BUDGET-FIRST ALLOCATION PREVIEW */}
              {Number(formData.budget) > 0 && (
                <div className="planner-budget-preview">
                  <div className="planner-budget-preview-header">
                    <span className="planner-budget-pill">
                      💡 Budget-First Live Allocation Model
                    </span>
                    <span className="planner-budget-auto">Auto-calibrated</span>
                  </div>
                  <div className="planner-budget-grid">
                    <div className="planner-budget-item">
                      <small>🏨 Stay (35%)</small>
                      <strong>₹{Math.round(Number(formData.budget) * 0.35).toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="planner-budget-item">
                      <small>🚆 Travel (25%)</small>
                      <strong>₹{Math.round(Number(formData.budget) * 0.25).toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="planner-budget-item">
                      <small>🍲 Food (18%)</small>
                      <strong>₹{Math.round(Number(formData.budget) * 0.18).toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="planner-budget-item">
                      <small>🎟️ Sights (12%)</small>
                      <strong>₹{Math.round(Number(formData.budget) * 0.12).toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="planner-budget-item highlight">
                      <small>🛡️ Safety Buffer (10%)</small>
                      <strong>₹{Math.round(Number(formData.budget) * 0.10).toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* STEP 3: PREFERENCES & COMFORT */}
          <section className="planner-step-card">
            <div className="planner-step-header">
              <span className="planner-step-num">3</span>
              <div>
                <h3 className="planner-step-title">Preferences & Travel Style</h3>
                <p className="planner-step-subtitle">Customize accommodation, transport mode, food and walking comfort</p>
              </div>
            </div>

            <div className="planner-row-2">
              {/* ACCOMMODATION PREFERENCE */}
              <div className="form-group">
                <label htmlFor="stayPref">Accommodation Preference</label>
                <select
                  id="stayPref"
                  name="stayPref"
                  value={formData.stayPref}
                  onChange={handleChange}
                >
                  <option value="Budget">🏠 Budget Stays & Hostels (~₹1,800/nt)</option>
                  <option value="Homestay">🏡 Authentic Homestays (~₹2,200/nt)</option>
                  <option value="Mid-Range">🏨 Mid-Range Hotels (~₹3,600/nt)</option>
                  <option value="Luxury">✨ Luxury Resorts & 5-Star (~₹8,500/nt)</option>
                </select>
              </div>

              {/* TRANSPORT PREFERENCE */}
              <div className="form-group">
                <label htmlFor="transportMode">Intercity Transport Mode</label>
                <select
                  id="transportMode"
                  name="transportMode"
                  value={formData.transportMode}
                  onChange={handleChange}
                >
                  <option value="Flexible">🔄 Flexible / Best Value Match</option>
                  <option value="Train">🚆 Express Trains & Vande Bharat</option>
                  <option value="Flight">✈️ Flights (Speed & Comfort)</option>
                  <option value="Bus">🚌 Luxury AC Sleeper Buses</option>
                  <option value="Self-Drive">🚗 Self-Drive / Road Trip</option>
                </select>
              </div>
            </div>

            <div className="planner-row-2">
              {/* FOOD PREFERENCE */}
              <div className="form-group">
                <label htmlFor="foodPref">Dining & Food Preference</label>
                <select
                  id="foodPref"
                  name="foodPref"
                  value={formData.foodPref}
                  onChange={handleChange}
                >
                  <option value="Flexible">🍲 Flexible (Regional Mix)</option>
                  <option value="Vegetarian / Pure Veg">🥗 Pure Vegetarian / Satvik</option>
                  <option value="Local / Street Food">🍛 Street Food & Local Dhabas</option>
                  <option value="Cafes & Casual">☕ Modern Cafés & Casual Dining</option>
                  <option value="Fine Dining">🍷 Premium & Fine Dining</option>
                </select>
              </div>

              {/* WALKING TOLERANCE */}
              <div className="form-group">
                <label htmlFor="walkingPref">Walking Preference / Tolerance</label>
                <select
                  id="walkingPref"
                  name="walkingPref"
                  value={formData.walkingPref}
                  onChange={handleChange}
                >
                  <option value="Moderate">🚶 Moderate (Standard sightseeing walks)</option>
                  <option value="Low / Minimal">🚗 Low / Minimal (Drive-up viewpoints & cabs)</option>
                  <option value="High / Trekking">🥾 High / Active (Nature trails & trekking)</option>
                </select>
              </div>
            </div>

            <div className="planner-row-2">
              {/* TRIP PACE */}
              <div className="form-group">
                <label htmlFor="tripStyle">Trip Pace</label>
                <select
                  id="tripStyle"
                  name="tripStyle"
                  value={formData.tripStyle}
                  onChange={handleChange}
                >
                  <option value="Balanced">⚖️ Balanced (Optimal sight mix & rest)</option>
                  <option value="Relaxed">🌿 Relaxed (Fewer stops, unhurried leisure)</option>
                  <option value="Fast-Paced">⚡ Fast-Paced (Cover maximum attractions)</option>
                </select>
              </div>

              {/* LATE-NIGHT TRAVEL */}
              <div className="form-group">
                <label htmlFor="lateNightPref">Late-Night Travel Preference</label>
                <select
                  id="lateNightPref"
                  name="lateNightPref"
                  value={formData.lateNightPref}
                  onChange={handleChange}
                >
                  <option value="Avoid Late Night">🌙 Avoid Late Night (Conclude by 8:00 PM)</option>
                  <option value="Daytime Only">☀️ Daytime Only (Finish before dusk)</option>
                  <option value="Open to Night Travel">✨ Open to Night Hangouts & Cafes</option>
                </select>
              </div>
            </div>

            {/* SAFETY PREFERENCE */}
            <div className="form-group">
              <label htmlFor="safetyPref">Safety & Security Focus</label>
              <select
                id="safetyPref"
                name="safetyPref"
                value={formData.safetyPref}
                onChange={handleChange}
              >
                <option value="Standard">🛡️ Standard Travel Safety</option>
                <option value="Verified Stays & Well-Lit">🌟 Verified Stays, Well-Lit Routes & Family Transit</option>
                <option value="Women & Solo Traveler Priority">🛡️ Women Safety & Solo Traveler Priority (24/7 Verified)</option>
              </select>

              <div className="planner-women-safety-banner">
                <div className="planner-safety-text">
                  <span className="planner-safety-icon">🛡️</span>
                  <span>
                    <strong>Women Safety Mode:</strong> Prioritizes verified 24/7 stays, illuminated transit hubs & rapid SOS protocols.
                  </span>
                </div>
                <Link
                  to="/safety"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="planner-safety-link"
                >
                  View Regional Safety Guide ↗
                </Link>
              </div>
            </div>

            {/* ACTIVITY INTERESTS CHIPS */}
            <div className="form-group">
              <label>Activity Interests (Select all that apply)</label>
              <div className="planner-chip-group">
                {INTEREST_OPTIONS.map((opt) => {
                  const isChecked = formData.interests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`planner-chip ${isChecked ? "active" : ""}`}
                      onClick={() => toggleInterest(opt.id)}
                    >
                      {opt.label} {isChecked ? "✓" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* LOCAL EXPERIENCES (IF PRE-SELECTED) */}
          {selectedLocalExperiences.length > 0 && (
            <div className="planner-selected-experiences">
              <div className="planner-selected-experiences-heading">
                <span>YOUR LOCAL EXPERIENCES</span>
                <strong>{selectedLocalExperiences.length} selected</strong>
              </div>
              <div className="planner-selected-experiences-list">
                {selectedLocalExperiences.map((experience, index) => (
                  <div
                    className="planner-selected-experience"
                    key={`${experience.category}-${experience.name}-${index}`}
                  >
                    <div className="planner-selected-experience-icon">
                      {experience.icon || "✨"}
                    </div>
                    <div className="planner-selected-experience-content">
                      <span>{experience.categoryLabel || "LOCAL EXPERIENCE"}</span>
                      <strong>{experience.name}</strong>
                      <small>{experience.price || "Price on request"}</small>
                    </div>
                    <div className="planner-selected-experience-check">✓</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="planner-error">
              ⚠️ {error}
            </div>
          )}

          {/* CREATE PLAN BUTTON */}
          <button type="submit" className="planner-button">
            Generate Smart Trip Plan →
          </button>

          {/* CANCEL */}
          <button
            type="button"
            className="planner-cancel-button"
            onClick={handleCancelTrip}
          >
            Cancel My Trip
          </button>
        </form>
      </div>
    </main>
  );
}

export default Planner;