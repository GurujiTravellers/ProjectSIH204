import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { searchTransportApi, getAllTransportLocations, OFFICIAL_PROVIDERS } from "../services/transportApi";
import { getActiveDisasterAlerts } from "../services/emergencyApi";
import { createBooking } from "../services/bookingApi";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";
import { SUPPORTED_ORIGINS } from "../services/plannerService";
import destinations from "../data/destinations";
import { showToast } from "../components/Toast";

function getDefaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
}

function isLateNight(timeStr = "") {
  if (!timeStr) return false;
  const isPM = timeStr.includes("PM");
  let hour = parseInt(timeStr.split(":")[0], 10) || 0;
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  return hour >= 22 || hour < 6;
}

function Transport() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlOrigin = searchParams.get("origin") || "Delhi";
  const urlDest = searchParams.get("destination") || "Shimla";
  const urlType = searchParams.get("type") || "all";
  const urlDate = searchParams.get("date") || getDefaultDate();

  const [extraLocations, setExtraLocations] = useState([]);

  useEffect(() => {
    getAllTransportLocations().then((locs) => {
      if (Array.isArray(locs) && locs.length > 0) {
        setExtraLocations(locs);
      }
    });
  }, []);

  // Unified origins & destinations list covering all verified Indian transit nodes and all 44 registered places
  const PAN_INDIA_CITIES = [
    // Metros & Transit Gateways
    "Delhi", "New Delhi", "Kolkata", "Mumbai", "Bengaluru", "Chennai", "Hyderabad",
    "Ahmedabad", "Gujarat", "Visakhapatnam", "Vizag", "Amritsar", "Punjab",
    "Chandigarh", "Lucknow", "Pune", "Patna", "Kochi", "Guwahati", "New Jalpaiguri", "Kalka",
    // All 44 Registered Website Destinations
    "Shimla", "Manali", "Rohtang Pass", "Kasol", "Chitkul", "Kalpa", "Sissu", "Kaza", "Chandratal Lake",
    "Haridwar", "Rishikesh", "Dehradun", "Mussoorie", "Srinagar", "Gulmarg", "Pahalgam", "Digha",
    "Darjeeling", "Puri", "Bhubaneswar", "Konark", "Shillong", "Mawlynnong Village", "Dawki",
    "Jaipur", "Jaisalmer", "Ajmer", "Agra", "Varanasi", "Goa", "Leh Ladakh",
    "Kerala", "Udaipur", "Ooty", "Coimbatore", "Pondicherry", "Hampi", "Andaman",
  ];

  const originList = useMemo(() => {
    const set = new Set([
      ...SUPPORTED_ORIGINS,
      ...PAN_INDIA_CITIES,
      ...extraLocations,
    ]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [extraLocations]);

  const destinationList = useMemo(() => {
    const list = destinations.map((d) => d.name);
    PAN_INDIA_CITIES.forEach((c) => {
      if (!list.includes(c)) list.push(c);
    });
    extraLocations.forEach((c) => {
      if (!list.includes(c)) list.push(c);
    });
    return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
  }, [extraLocations]);

  // Search state
  const [origin, setOrigin] = useState(urlOrigin);
  const [destination, setDestination] = useState(urlDest);
  const [selectedType, setSelectedType] = useState(urlType);
  const [travelDate, setTravelDate] = useState(urlDate);
  const [passengersCount, setPassengersCount] = useState(1);
  const [sortBy, setSortBy] = useState("recommended");
  const [timeFilter, setTimeFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  // Selected Class Map for interactive MakeMyTrip-style class selection (SL, 3A, 2A, 1A / STD, CC, SLP / ECO, BIZ)
  const [selectedClassMap, setSelectedClassMap] = useState({});

  // Results state
  const [transportData, setTransportData] = useState({ results: [], highlights: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [passengerName, setPassengerName] = useState("");
  const [passengerAge, setPassengerAge] = useState("28");
  const [passengerGender, setPassengerGender] = useState("Male");
  const [seatPreference, setSeatPreference] = useState("Window");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  // Real-Time Disaster & Route Disruption State
  const [disasterAlerts, setDisasterAlerts] = useState([]);

  useEffect(() => {
    async function loadDisasterAlerts() {
      try {
        const res = await getActiveDisasterAlerts();
        if (res && res.alerts) setDisasterAlerts(res.alerts);
      } catch (e) {
        console.warn("Could not load disaster alerts for transport:", e);
      }
    }
    loadDisasterAlerts();
  }, []);

  const corridorRisk = useMemo(() => {
    if (!disasterAlerts.length || !destination) return null;
    const destLower = destination.toLowerCase().trim();
    const origLower = (origin || "").toLowerCase().trim();

    const matchesRoute = (a) => {
      const aDest = (a.destination || "").toLowerCase();
      return (
        aDest === destLower ||
        destLower.includes(aDest) ||
        aDest.includes(destLower) ||
        (origLower && (aDest === origLower || origLower.includes(aDest) || aDest.includes(origLower)))
      );
    };

    // 1. Red Disaster Zone on transit route
    const redAlert = disasterAlerts.find(
      (a) => matchesRoute(a) && (a.alertTier === "RED" || a.severity === "CRITICAL" || a.isDisasterZone)
    );
    if (redAlert) return redAlert;

    // 2. Yellow Caution Advisory on transit route
    const yellowAlert = disasterAlerts.find(
      (a) => matchesRoute(a) && (a.alertTier === "YELLOW" || a.severity === "WARNING" || a.isModerateAdvisory)
    );
    if (yellowAlert) return yellowAlert;

    // 3. Green Rain Alert (Standard rainfall, movement feasible)
    const rainAlert = disasterAlerts.find(
      (a) => matchesRoute(a) && (a.isRainAlert || a.severity === "GREEN_ALERT")
    );
    if (rainAlert) return rainAlert;

    // 4. Normal routes return null (no alert banner required)
    return null;
  }, [disasterAlerts, destination, origin]);

  // Prefill logged-in user if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("travelGurujiUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setPassengerName(u.name);
        if (u.email) setContactEmail(u.email);
        if (u.phone) setContactPhone(u.phone);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Restore draft selection & reopen modal after login
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("travelGurujiTransportDraft");
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.origin) setOrigin(draft.origin);
        if (draft.destination) setDestination(draft.destination);
        if (draft.travelDate) setTravelDate(draft.travelDate);
        if (draft.selectedType) setSelectedType(draft.selectedType);
        if (draft.passengersCount) setPassengersCount(draft.passengersCount);
        if (draft.passengerAge) setPassengerAge(draft.passengerAge);
        if (draft.passengerGender) setPassengerGender(draft.passengerGender);
        if (draft.seatPreference) setSeatPreference(draft.seatPreference);
        if (draft.contactPhone) setContactPhone(draft.contactPhone);

        if (draft.item && draft.activeClass) {
          setSelectedItem({
            ...draft.item,
            price: draft.activeClass.price,
            seatClass: draft.activeClass.name,
            selectedClassCode: draft.activeClass.code,
          });
          setIsModalOpen(true);
        }
        sessionStorage.removeItem("travelGurujiTransportDraft");
      }
    } catch {
      // Ignore
    }
  }, []);

  // Fetch transport on search parameters change
  useEffect(() => {
    fetchTransport();
  }, [origin, destination, travelDate, sortBy]);

  const fetchTransport = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await searchTransportApi({
        origin,
        destination,
        type: "all",
        travelDate,
        sortBy,
        passengers: passengersCount,
      });

      setTransportData(data || { results: [], highlights: {} });
    } catch (err) {
      console.error("Fetch transport error:", err);
      setError("Unable to load transport schedules.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    searchParams.set("origin", destination);
    searchParams.set("destination", temp);
    setSearchParams(searchParams);
  };

  const handleTypeTabClick = (type) => {
    setSelectedType(type);
    setVisibleCount(10);
    searchParams.set("type", type);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setVisibleCount(10);
  }, [origin, destination, travelDate, sortBy, timeFilter]);

  // Filter results by mode tab and departure time
  const filteredResults = useMemo(() => {
    if (!transportData.results) return [];
    let list = transportData.results;

    if (selectedType === "flights") {
      list = list.filter((item) => item.type === "Flight" || (item.category === "DIRECT" && item.type.includes("Flight")));
    } else if (selectedType === "trains") {
      list = list.filter((item) => item.type === "Train");
    } else if (selectedType === "buses") {
      list = list.filter((item) => item.type === "Bus");
    } else if (selectedType === "connecting") {
      list = list.filter((item) => item.category === "CONNECTING");
    } else if (selectedType === "multimodal") {
      list = list.filter((item) => item.category === "MULTIMODAL");
    }

    if (timeFilter !== "all") {
      list = list.filter((item) => {
        const timeStr = item.departureTime || "";
        const isPM = timeStr.includes("PM");
        let hour = parseInt(timeStr.split(":")[0], 10) || 0;
        if (isPM && hour !== 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;

        if (timeFilter === "morning") return hour >= 6 && hour < 12;
        if (timeFilter === "afternoon") return hour >= 12 && hour < 18;
        if (timeFilter === "night") return hour >= 18 || hour < 6;
        return true;
      });
    }

    return list;
  }, [transportData.results, selectedType, timeFilter]);

  const displayedResults = useMemo(() => {
    return filteredResults.slice(0, visibleCount);
  }, [filteredResults, visibleCount]);


  // Counts by mode
  const counts = useMemo(() => {
    const all = transportData.results || [];
    return {
      all: all.length,
      flights: all.filter((i) => i.type === "Flight" || (i.category === "DIRECT" && i.type.includes("Flight"))).length,
      trains: all.filter((i) => i.type === "Train").length,
      buses: all.filter((i) => i.type === "Bus").length,
      connecting: all.filter((i) => i.category === "CONNECTING").length,
      multimodal: all.filter((i) => i.category === "MULTIMODAL").length,
    };
  }, [transportData.results]);

  // Comparison Highlights
  const cheapestItem = useMemo(() => {
    if (!transportData.results || transportData.results.length === 0) return null;
    return [...transportData.results].sort((a, b) => a.price - b.price)[0];
  }, [transportData.results]);

  const fastestItem = useMemo(() => {
    if (!transportData.results || transportData.results.length === 0) return null;
    const getMins = (s = "") => {
      const h = parseInt((s.match(/(\d+)h/) || [0, 0])[1], 10);
      const m = parseInt((s.match(/(\d+)m/) || [0, 0])[1], 10);
      return h * 60 + m || 9999;
    };
    return [...transportData.results].sort((a, b) => getMins(a.duration) - getMins(b.duration))[0];
  }, [transportData.results]);

  // Get current active class for an item
  const getActiveClass = (item) => {
    if (selectedClassMap[item.id]) return selectedClassMap[item.id];
    if (Array.isArray(item.classes) && item.classes.length > 0) return item.classes[0];
    const isTrain = item.type === "Train";
    const isFlight = item.type === "Flight" || (item.type && item.type.includes("Flight"));
    return {
      name: item.seatClass || (isTrain ? "Sleeper (SL)" : isFlight ? "Economy Class" : "Standard (Non-AC)"),
      code: isTrain ? "SL" : isFlight ? "ECO" : "STD",
      price: item.price,
      status: item.availabilityStatus || "AVAILABLE",
      features: item.features || "Confirmed reservation",
    };
  };

  const handleSelectClass = (itemId, cls) => {
    setSelectedClassMap((prev) => ({
      ...prev,
      [itemId]: cls,
    }));
  };

  const saveTransportDraftAndRedirect = (item, activeClass) => {
    const returnTarget = window.location.pathname + window.location.search;
    try {
      sessionStorage.setItem(
        "travelGurujiTransportDraft",
        JSON.stringify({
          item,
          activeClass,
          passengersCount,
          passengerAge,
          passengerGender,
          seatPreference,
          contactPhone,
          origin,
          destination,
          travelDate,
          selectedType,
        })
      );
      sessionStorage.setItem("travelGurujiReturnTo", returnTarget);
    } catch {
      // Ignore
    }

    showToast("Please do login before booking your transport ticket.", "warning", 5000);
    navigate("/login", {
      state: {
        returnTo: returnTarget,
        action: "book",
        message: "Please do login before booking your transport ticket.",
      },
    });
  };

  // Open booking modal with chosen class
  const handleOpenBooking = (item, explicitClass = null) => {
    const activeClass = explicitClass || getActiveClass(item);
    const token = localStorage.getItem("travelGurujiToken");

    if (!token) {
      saveTransportDraftAndRedirect(item, activeClass);
      return;
    }

    setSelectedItem({
      ...item,
      price: activeClass.price,
      seatClass: activeClass.name,
      selectedClassCode: activeClass.code,
    });
    setBookingError("");
    setConfirmedTicket(null);
    setIsModalOpen(true);
  };

  // Open payment gateway on passenger form submit
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      if (selectedItem) {
        const activeClass = {
          name: selectedItem.seatClass,
          price: selectedItem.price,
          code: selectedItem.selectedClassCode,
        };
        saveTransportDraftAndRedirect(selectedItem, activeClass);
      }
      return;
    }
    if (!passengerName.trim() || !contactEmail.trim()) {
      setBookingError("Please provide passenger name and contact email.");
      return;
    }
    setBookingError("");
    setIsRazorpayOpen(true);
  };

  // Called when Razorpay transaction is verified
  const handlePaymentSuccess = async (paymentData) => {
    try {
      setBookingLoading(true);
      setBookingError("");
      setIsRazorpayOpen(false);

      const baseAmount = selectedItem.price * passengersCount;
      const convenienceFee = 50 * passengersCount;
      const gstAmount = Math.round(baseAmount * 0.05);
      const totalAmount = baseAmount + convenienceFee + gstAmount;

      const payload = {
        itemType: "Transport",
        transportDetails: {
          type: selectedItem.type,
          operator: selectedItem.operator,
          identifier: selectedItem.identifier,
          origin: selectedItem.originCity,
          destination: selectedItem.destinationCity,
          departureTime: selectedItem.departureTime,
          arrivalTime: selectedItem.arrivalTime,
          travelDate: selectedItem.travelDate,
          seatClass: selectedItem.seatClass || "Standard",
          passengersCount,
        },
        guestDetails: {
          fullName: passengerName.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim(),
          specialRequests: `Age: ${passengerAge}, Gender: ${passengerGender}, Preference: ${seatPreference}`,
        },
        totalAmount,
        currency: "INR",
        paymentStatus: "Paid",
        paymentPlan: paymentData?.paymentPlan || "FULL",
        amountPaid: paymentData?.amountPaid || totalAmount,
        remainingBalance: paymentData?.remainingBalance || 0,
        razorpayOrderId: paymentData?.orderId,
        razorpayPaymentId: paymentData?.paymentId,
        paymentMethod: paymentData?.paymentMethod || "Razorpay Verified",
        installmentNote: paymentData?.installmentNote || "",
        isDemoMode: true,
        cancellationPolicy: selectedItem.cancellationPolicy || "Free cancellation up to 4 hours before departure.",
      };

      const result = await createBooking(payload);
      if (result.booking) {
        setConfirmedTicket(result.booking);

        // Save selected transport to localStorage for Budget Guardian & Smart Planner
        try {
          localStorage.setItem(
            "travelGurujiSelectedTransport",
            JSON.stringify({
              id: selectedItem.id,
              type: selectedItem.type,
              operator: selectedItem.operator,
              identifier: selectedItem.identifier,
              origin: selectedItem.originCity,
              destination: selectedItem.destinationCity,
              travelDate: selectedItem.travelDate,
              fare: totalAmount,
              bookingRef: result.booking.bookingReference,
              razorpayPaymentId: paymentData?.paymentId,
              status: "PAID",
            })
          );
        } catch {
          // Ignore
        }
      } else {
        throw new Error("Unable to confirm booking.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError(err.message || "Failed to process transport reservation.");
    } finally {
      setBookingLoading(false);
    }
  };
  

  return (
    <main className="transport-page">
      <div className="transport-background"></div>

      <div className="transport-container">
        {/* HEADER */}
        <header className="transport-header">
          <p className="hotels-eyebrow">INDIA-WIDE TRAVEL TRANSIT NETWORK</p>
          <h1>Flight, Train, Bus & Multimodal Journeys</h1>
          <p className="hotels-subtitle">
            Travel between any Indian origin and destination with authentic timetables, connecting routes, and direct official booking links.
          </p>
        </header>

        {/* SEARCH BAR & CONTROLS */}
        <div className="transport-search-card">
          <div className="transport-search-grid">
            {/* ORIGIN */}
            <div className="transport-input-box">
              <label htmlFor="transport-origin">FROM (ORIGIN)</label>
              <select
                id="transport-origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              >
                {originList.map((city) => (
                  <option key={`origin_${city}`} value={city}>
                    📍 {city}
                  </option>
                ))}
              </select>
            </div>

            {/* SWAP BUTTON */}
            <button
              type="button"
              className="transport-swap-btn"
              onClick={handleSwapCities}
              title="Swap Origin & Destination"
              aria-label="Swap cities"
            >
              ⇄
            </button>

            {/* DESTINATION */}
            <div className="transport-input-box">
              <label htmlFor="transport-destination">TO (DESTINATION)</label>
              <select
                id="transport-destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                {destinationList.map((city) => (
                  <option key={`dest_${city}`} value={city}>
                    🎯 {city}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div className="transport-input-box">
              <label htmlFor="transport-date">DEPARTURE DATE</label>
              <input
                id="transport-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
              />
            </div>

            {/* PASSENGERS */}
            <div className="transport-input-box small">
              <label htmlFor="transport-passengers">PASSENGERS</label>
              <select
                id="transport-passengers"
                value={passengersCount}
                onChange={(e) => setPassengersCount(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Adult" : "Adults"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* REAL-TIME CORRIDOR DISRUPTION ADVISORY BANNER */}
        {corridorRisk && (
          <div
            style={{
              background:
                corridorRisk.alertTier === "RED" || corridorRisk.severity === "CRITICAL"
                  ? "#fef2f2"
                  : corridorRisk.alertTier === "YELLOW" || corridorRisk.severity === "WARNING"
                  ? "#fffbeb"
                  : "#f0fdf4",
              border:
                corridorRisk.alertTier === "RED" || corridorRisk.severity === "CRITICAL"
                  ? "2px solid #ef4444"
                  : corridorRisk.alertTier === "YELLOW" || corridorRisk.severity === "WARNING"
                  ? "2px solid #f59e0b"
                  : "2px solid #10b981",
              borderRadius: "16px",
              padding: "18px 22px",
              marginBottom: "24px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>
                  {corridorRisk.alertTier === "RED" || corridorRisk.severity === "CRITICAL"
                    ? "🚨"
                    : corridorRisk.alertTier === "YELLOW" || corridorRisk.severity === "WARNING"
                    ? "⚠️"
                    : "🌧️"}
                </span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        background:
                          corridorRisk.alertTier === "RED" || corridorRisk.severity === "CRITICAL"
                            ? "#ef4444"
                            : corridorRisk.alertTier === "YELLOW" || corridorRisk.severity === "WARNING"
                            ? "#f59e0b"
                            : "#10b981",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {corridorRisk.alertTier === "RED" || corridorRisk.severity === "CRITICAL"
                        ? "CRITICAL CORRIDOR DISRUPTION"
                        : corridorRisk.alertTier === "YELLOW" || corridorRisk.severity === "WARNING"
                        ? "TRANSIT ADVISORY"
                        : "GREEN ALERT • RAIN ALERT"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background:
                          corridorRisk.alertTier === "RED" || corridorRisk.severity === "CRITICAL"
                            ? "rgba(239, 68, 68, 0.15)"
                            : corridorRisk.alertTier === "YELLOW" || corridorRisk.severity === "WARNING"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                        color:
                          corridorRisk.alertTier === "RED" || corridorRisk.severity === "CRITICAL"
                            ? "#b91c1c"
                            : corridorRisk.alertTier === "YELLOW" || corridorRisk.severity === "WARNING"
                            ? "#b45309"
                            : "#065f46",
                      }}
                    >
                      {corridorRisk.alertTier === "RED" || corridorRisk.severity === "CRITICAL"
                        ? `🚫 ${corridorRisk.movementStatus || "TRAVEL HAZARDOUS"}`
                        : corridorRisk.alertTier === "YELLOW" || corridorRisk.severity === "WARNING"
                        ? `⚠️ ${corridorRisk.movementStatus || "MOVEMENT POSSIBLE WITH CAUTION"}`
                        : `✓ ${corridorRisk.movementStatus || "MOVEMENT COMPLETELY POSSIBLE"}`}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>
                      📡 Verified Agency: {corridorRisk.source || corridorRisk.realIncidentSource || "IMD / Open-Meteo"}
                    </span>
                  </div>
                  <h3 style={{ margin: "4px 0 0", fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>
                    {corridorRisk.title}
                  </h3>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(corridorRisk.alertTier === "RED" || corridorRisk.severity === "CRITICAL") && (
                  <Link
                    to={`/emergency?dest=${encodeURIComponent(destination)}`}
                    style={{
                      background: "#ef4444",
                      color: "#ffffff",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🔄 View Safe Detours & Replanning
                  </Link>
                )}
                <Link
                  to={`/emergency?dest=${encodeURIComponent(destination)}`}
                  style={{
                    background: "#0f172a",
                    color: "#ffffff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "700",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  🛡️ Live Disaster Radar
                </Link>
              </div>
            </div>

            <div style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
              <strong>Transit Status: </strong>
              {corridorRisk.affectedCorridors ? `Corridors: ${corridorRisk.affectedCorridors}. ` : ""}
              {corridorRisk.evacuationAdvice || corridorRisk.description}
            </div>
          </div>
        )}

        {/* COMPARISON MATRIX / QUICK INSIGHTS */}
        {cheapestItem && fastestItem && (
          <div className="transport-insights-banner">
            <div className="insight-card fastest">
              <span className="insight-icon">⚡</span>
              <div>
                <small>FASTEST DURATION</small>
                <strong>
                  {fastestItem.type} ({fastestItem.duration})
                </strong>
                <span>
                  {fastestItem.operator} • ₹{fastestItem.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="insight-card cheapest">
              <span className="insight-icon">💰</span>
              <div>
                <small>LOWEST FARE</small>
                <strong>
                  ₹{cheapestItem.price.toLocaleString("en-IN")} ({cheapestItem.type})
                </strong>
                <span>
                  {cheapestItem.operator} • {cheapestItem.duration}
                </span>
              </div>
            </div>

            <div className="insight-card eco">
              <span className="insight-icon">🔀</span>
              <div>
                <small>NETWORK CONNECTIVITY</small>
                <strong>{counts.multimodal > 0 ? "Multimodal Available" : "Direct & Connecting"}</strong>
                <span>{counts.direct || (counts.flights + counts.trains)} Direct, {counts.connecting} Connecting, {counts.multimodal} Multimodal</span>
              </div>
            </div>
          </div>
        )}

        {/* MODE TABS & FILTERS */}
        <div className="transport-controls-bar">
          <div className="transport-mode-tabs">
            <button
              type="button"
              className={`transport-tab-btn ${selectedType === "all" ? "active" : ""}`}
              onClick={() => handleTypeTabClick("all")}
            >
              All Options ({counts.all})
            </button>
            <button
              type="button"
              className={`transport-tab-btn ${selectedType === "flights" ? "active" : ""}`}
              onClick={() => handleTypeTabClick("flights")}
            >
              ✈️ Flights ({counts.flights})
            </button>
            <button
              type="button"
              className={`transport-tab-btn ${selectedType === "trains" ? "active" : ""}`}
              onClick={() => handleTypeTabClick("trains")}
            >
              🚆 Trains ({counts.trains})
            </button>
            <button
              type="button"
              className={`transport-tab-btn ${selectedType === "buses" ? "active" : ""}`}
              onClick={() => handleTypeTabClick("buses")}
            >
              🚌 Buses ({counts.buses})
            </button>
            <button
              type="button"
              className={`transport-tab-btn ${selectedType === "connecting" ? "active" : ""}`}
              onClick={() => handleTypeTabClick("connecting")}
            >
              🔄 Connecting ({counts.connecting})
            </button>
            <button
              type="button"
              className={`transport-tab-btn ${selectedType === "multimodal" ? "active" : ""}`}
              onClick={() => handleTypeTabClick("multimodal")}
            >
              🔀 Multimodal ({counts.multimodal})
            </button>
          </div>

          <div className="transport-filter-group">
            <div className="transport-filter-item">
              <label htmlFor="time-filter">Timing:</label>
              <select
                id="time-filter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">Any Time</option>
                <option value="morning">Morning (6 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                <option value="night">Night (6 PM - 6 AM)</option>
              </select>
            </div>

            <div className="transport-filter-item">
              <label htmlFor="sort-transport">Sort:</label>
              <select
                id="sort-transport"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="duration">Fastest Duration</option>
                <option value="fewestTransfers">Fewest Transfers</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="no-hotels">
            <div>⏳</div>
            <h3>Scanning India-Wide Transit Corridors...</h3>
            <p>Evaluating direct trains, flights, connecting hubs, and multimodal routes between {origin} and {destination}.</p>
          </div>
        )}

        {/* RESULTS LIST */}
        {!loading && (
          <div className="transport-results-section">
            {/* INNOVATION & SAFETY BANNER */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(240, 253, 250, 0.95))",
                border: "1px solid #c7d2fe",
                borderRadius: "12px",
                padding: "12px 18px",
                marginBottom: "20px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>🛡️</span>
                <div>
                  <strong style={{ fontSize: "0.95rem", color: "#1e1b4b" }}>Women Safety & Transit SOS Support Active</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#4338ca" }}>
                    24/7 National Emergency (112) & Railway Police (139/182) integration for journeys to {destination}.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link
                  to={`/safety?destination=${encodeURIComponent(destination)}`}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: "#4338ca",
                    color: "#fff",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  Safety & SOS Guide ↗
                </Link>
                <Link
                  to="/protected-booking"
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: "#059669",
                    color: "#fff",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  🔒 Protected Settlement ↗
                </Link>
              </div>
            </div>

            <div className="transport-results-heading">
              <h2>
                Available Journeys from <span>{origin}</span> to <span>{destination}</span>
              </h2>
              <span className="results-count-tag">
                {filteredResults.length} {filteredResults.length === 1 ? "option" : "options"} found
                {filteredResults.length > visibleCount && ` · Showing 1–${Math.min(visibleCount, filteredResults.length)}`}
              </span>
            </div>

            {filteredResults.length > 0 ? (
              <div className="transport-cards-list">
                {displayedResults.map((item) => {
                  const isFlight = item.type === "Flight" || (item.type && item.type.includes("Flight"));
                  const isTrain = item.type === "Train";
                  const isBus = item.type === "Bus";
                  const isMultimodal = item.category === "MULTIMODAL";
                  const isConnecting = item.category === "CONNECTING" || item.isConnecting || !!item.layoverCity || !!item.transitHub;

                  const activeClass = getActiveClass(item);
                  const activePrice = activeClass.price || item.price;
                  const totalFare = activePrice * passengersCount;

                  // Available classes for this journey
                  const availableClasses = Array.isArray(item.classes) && item.classes.length > 0
                    ? item.classes
                    : [
                        {
                          name: item.seatClass || (isTrain ? "Sleeper (SL)" : isFlight ? "Economy Class" : "Standard (Non-AC)"),
                          code: isTrain ? "SL" : isFlight ? "ECO" : "STD",
                          price: item.price,
                          status: item.availabilityStatus || "AVAILABLE",
                          features: item.features || "Confirmed standard seat"
                        }
                      ];

                  return (
                    <article
                      className={`transport-card mmt-style-card ${isConnecting ? "connecting-card" : ""} ${isMultimodal ? "multimodal-card" : ""}`}
                      key={item.id}
                    >
                      {/* 1. TOP HEADER: OPERATOR, IDENTIFIER, STATUS & RATINGS */}
                      <div className="mmt-card-header">
                        <div className="mmt-header-left">
                          <span className={`transport-type-tag ${isFlight ? "flight" : isTrain ? "train" : isBus ? "bus" : "multimodal"}`}>
                            {isFlight ? "✈️ Flight" : isTrain ? "🚆 Train" : isBus ? "🚌 Express Bus" : "🔀 Multimodal"}
                          </span>
                          {isConnecting && (
                            <span className="transport-type-tag connecting">
                              🔄 1 Layover Connection
                            </span>
                          )}
                          <h3 className="mmt-operator-title">{item.operator}</h3>
                          <span className="transport-id-code">{item.identifier}</span>
                        </div>

                        <div className="mmt-header-right">
                          {item.rating && (
                            <span className="transport-rating">★ {item.rating} / 5</span>
                          )}
                          {item.punctuality && (
                            <span className="mmt-punctuality-badge">⏱ {item.punctuality} on-time</span>
                          )}
                          <span className="transport-provenance-badge">
                            ✓ {item.dataStatus || "VERIFIED"} TIMETABLE
                          </span>
                        </div>
                      </div>

                      {/* 2. DIRECT LINE JOURNEY ROUTE (MakeMyTrip Direct Line Display) */}
                      <div className="mmt-direct-line-section">
                        {/* DEPARTURE */}
                        <div className="mmt-route-point departure">
                          <span className="mmt-time">{item.departureTime}</span>
                          <span className="mmt-station" title={item.originStation}>{item.originStation}</span>
                          <span className="mmt-city">{item.originCity}</span>
                        </div>

                        {/* DIRECT LINE GRAPHIC & DURATION */}
                        <div className="mmt-route-line-box">
                          <span className="mmt-duration">{item.duration}</span>
                          <div className="mmt-line-graphic">
                            <span className="mmt-dot start"></span>
                            <div className="mmt-track">
                              <span className="mmt-arrow-head">➔</span>
                            </div>
                            <span className="mmt-dot end"></span>
                          </div>
                          <span className={`mmt-stops-badge ${isConnecting ? "connecting" : "direct"}`}>
                            {isConnecting
                              ? `🟡 1 Layover via ${item.layoverCity || item.transitHub || "Hub"}`
                              : "🟢 Direct Line (Non-Stop)"}
                          </span>
                        </div>

                        {/* ARRIVAL */}
                        <div className="mmt-route-point arrival">
                          <span className="mmt-time">{item.arrivalTime}</span>
                          <span className="mmt-station" title={item.destinationStation}>{item.destinationStation}</span>
                          <span className="mmt-city">{item.destinationCity}</span>
                        </div>
                      </div>

                      {/* 3. STRAIGHTFORWARD LAYOVER HUB DETAILS (If connecting) */}
                      {isConnecting && (
                        <div className="mmt-layover-hub-banner">
                          <div className="layover-hub-icon">🚉</div>
                          <div className="layover-hub-info">
                            <div className="layover-hub-title">
                              <strong>Layover Hub:</strong> {item.layoverCity || item.transitHub} ({item.layoverStation || `${item.layoverCity} Junction`})
                            </div>
                            <div className="layover-hub-desc">
                              <span>Transfer Window: <strong>{item.layoverDuration || "2h 15m"}</strong></span>
                              <span className="layover-bullet">•</span>
                              <span>{item.layoverNote || `Platform transfer at ${item.layoverCity || item.transitHub} for connecting sector.`}</span>
                            </div>
                          </div>
                          {item.legs && item.legs.length >= 2 && (
                            <div className="layover-legs-pill">
                              <span>{item.legs[0]?.trainNo || item.legs[0]?.flightNo || item.legs[0]?.operator}</span>
                              <span className="leg-arrow">➔</span>
                              <span>{item.legs[1]?.trainNo || item.legs[1]?.flightNo || item.legs[1]?.operator}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. BROAD-GAUGE RAILHEAD ADVISORY (If off-rail destination) */}
                      {item.railheadNotice && (
                        <div className="transport-railhead-notice" style={{ margin: "6px 0 10px", fontSize: "0.82rem", color: "#4338ca", background: "rgba(99, 102, 241, 0.08)", padding: "8px 14px", borderRadius: "8px", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                          🚉 <strong>Railhead Connection:</strong> {item.railheadNotice}
                        </div>
                      )}

                      {/* 5. LATE NIGHT ADVISORY */}
                      {(isLateNight(item.departureTime) || isLateNight(item.arrivalTime)) && (
                        <div style={{ margin: "4px 0 10px", fontSize: "0.8rem", color: "#991b1b", background: "#fef2f2", padding: "6px 12px", borderRadius: "6px", border: "1px solid #fecaca", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>🌙</span>
                          <span><strong>Late-Night Advisory:</strong> Late arrival/departure ({item.departureTime} → {item.arrivalTime}). Authorized station prepaid booths or verified cabs recommended.</span>
                        </div>
                      )}

                      {/* 6. INTERACTIVE TRAVEL CLASSES & FARE SELECTOR (MakeMyTrip Standard) */}
                      <div className="mmt-class-selection-block">
                        <div className="mmt-class-section-header">
                          <span className="class-section-title">
                            Select Class / Fare Category:
                          </span>
                          <span className="class-section-hint">
                            Click class below to select & view price breakdown
                          </span>
                        </div>

                        <div className="mmt-class-cards-grid">
                          {availableClasses.map((cls) => {
                            const isSelected = activeClass.code ? activeClass.code === cls.code : activeClass.name === cls.name;
                            const isAvail = (cls.status || "").toUpperCase().includes("AVAIL");

                            return (
                              <div
                                key={cls.code || cls.name}
                                className={`mmt-class-card ${isSelected ? "active" : ""}`}
                                onClick={() => handleSelectClass(item.id, cls)}
                              >
                                <div className="mmt-class-card-top">
                                  <span className="mmt-class-code-tag">{cls.code || cls.name}</span>
                                  <span className={`mmt-class-avail-tag ${isAvail ? "avail" : "wl"}`}>
                                    {cls.status || "AVAILABLE"}
                                  </span>
                                </div>
                                <div className="mmt-class-name">{cls.name}</div>
                                <div className="mmt-class-price">₹{cls.price.toLocaleString("en-IN")}</div>
                                {cls.features && (
                                  <div className="mmt-class-features">{cls.features}</div>
                                )}
                                {cls.baggage && (
                                  <div className="mmt-class-baggage">🧳 {cls.baggage}</div>
                                )}
                                <div className="mmt-class-select-indicator">
                                  {isSelected ? "✓ Selected Class" : "Select Class"}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 7. CARD FOOTER: PRICING BREAKDOWN & ACTION BUTTONS */}
                      <div className="mmt-card-footer">
                        <div className="mmt-footer-selection-info">
                          <div className="mmt-selected-class-pill">
                            <span>Class: <strong>{activeClass.name}</strong></span>
                            <span className="sep">•</span>
                            <span>₹{activePrice.toLocaleString("en-IN")} / seat</span>
                          </div>
                          <div className="mmt-escrow-badge">
                            🔒 Escrow Protected · IRCTC / Official Partner Timetable
                          </div>
                        </div>

                        <div className="mmt-footer-cta-group">
                          <div className="mmt-price-summary">
                            <span className="mmt-total-fare">
                              ₹{totalFare.toLocaleString("en-IN")}
                            </span>
                            <small className="mmt-fare-sub">
                              Total for {passengersCount} {passengersCount === 1 ? "passenger" : "passengers"}
                            </small>
                          </div>

                          <button
                            type="button"
                            className="mmt-book-now-btn"
                            onClick={() => handleOpenBooking(item, activeClass)}
                          >
                            Book Ticket (₹{totalFare.toLocaleString("en-IN")})
                          </button>

                          {item.bookingUrl && (
                            <a
                              href={item.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transport-provider-btn"
                              style={{ width: "auto", padding: "8px 14px" }}
                            >
                              Search {item.providerName || (isTrain ? "IRCTC" : isFlight ? "Airline" : "RedBus")} ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}

                {/* LOAD MORE / SHOW ALL PAGINATION CONTROLS */}
                {filteredResults.length > visibleCount && (
                  <div className="transport-load-more-bar" style={{ display: "flex", justifyContent: "center", gap: "14px", margin: "24px 0 12px" }}>
                    <button
                      type="button"
                      className="hotel-button"
                      style={{ padding: "10px 24px", fontSize: "0.95rem" }}
                      onClick={() => setVisibleCount((prev) => prev + 10)}
                    >
                      Load More (+{Math.min(10, filteredResults.length - visibleCount)} more)
                    </button>
                    <button
                      type="button"
                      className="hotel-detail-back-button"
                      style={{ padding: "10px 20px", fontSize: "0.95rem" }}
                      onClick={() => setVisibleCount(filteredResults.length)}
                    >
                      Show All ({filteredResults.length})
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-hotels">
                <div>🔎</div>
                <h3>No transport schedules found for this selection.</h3>
                <p>
                  Try selecting "All Options" or switching your departure date or timing filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================================================
          INSTANT TRANSPORT BOOKING MODAL
          =================================================== */}
      {isModalOpen && selectedItem && (
        <div className="hotel-modal-overlay" onClick={() => !bookingLoading && setIsModalOpen(false)}>
          <div className="hotel-modal-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hotel-modal-close-btn"
              onClick={() => setIsModalOpen(false)}
              disabled={bookingLoading}
            >
              ✕
            </button>

            {!confirmedTicket ? (
              <div className="hotel-modal-content">
                <div className="hotel-modal-header">
                  <div className="hotel-modal-badge">[TICKET BOOKING]</div>
                  <h2>Reserve {selectedItem.type} Ticket</h2>
                  <p>
                    {selectedItem.identifier} • {selectedItem.originCity} → {selectedItem.destinationCity}
                  </p>
                </div>

                {/* TRIP SUMMARY SNIPPET */}
                <div className="hotel-modal-summary-box">
                  <div className="hotel-modal-summary-item">
                    <span>Operator / Service</span>
                    <strong>{selectedItem.operator}</strong>
                  </div>
                  <div className="hotel-modal-summary-item">
                    <span>Departure</span>
                    <strong>
                      {selectedItem.departureTime} ({selectedItem.originStation})
                    </strong>
                  </div>
                  <div className="hotel-modal-summary-item">
                    <span>Arrival</span>
                    <strong>
                      {selectedItem.arrivalTime} ({selectedItem.destinationStation})
                    </strong>
                  </div>
                  <div className="hotel-modal-summary-item">
                    <span>Travel Date</span>
                    <strong>{selectedItem.travelDate}</strong>
                  </div>
                  <div className="hotel-modal-summary-item">
                    <span>Seat / Class</span>
                    <strong>{selectedItem.seatClass || "Standard"}</strong>
                  </div>
                  <div className="hotel-modal-summary-item highlight">
                    <span>Total Fare ({passengersCount} {passengersCount === 1 ? "passenger" : "passengers"})</span>
                    <strong className="price-tag">
                      ₹
                      {(
                        selectedItem.price * passengersCount +
                        50 * passengersCount +
                        Math.round(selectedItem.price * passengersCount * 0.05)
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                {bookingError && (
                  <div className="hotel-modal-error">⚠️ {bookingError}</div>
                )}

                <form onSubmit={handleProceedToPayment} className="hotel-modal-form">
                  <div className="hotel-modal-form-group">
                    <label htmlFor="passenger-name">Primary Passenger Name *</label>
                    <input
                      id="passenger-name"
                      type="text"
                      required
                      placeholder="e.g. Priya Patel"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                    />
                  </div>

                  <div className="hotel-modal-form-row">
                    <div className="hotel-modal-form-group">
                      <label htmlFor="passenger-age">Age</label>
                      <input
                        id="passenger-age"
                        type="number"
                        min="1"
                        max="110"
                        value={passengerAge}
                        onChange={(e) => setPassengerAge(e.target.value)}
                      />
                    </div>

                    <div className="hotel-modal-form-group">
                      <label htmlFor="passenger-gender">Gender</label>
                      <select
                        id="passenger-gender"
                        value={passengerGender}
                        onChange={(e) => setPassengerGender(e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="hotel-modal-form-group">
                      <label htmlFor="seat-preference">Berth / Seat</label>
                      <select
                        id="seat-preference"
                        value={seatPreference}
                        onChange={(e) => setSeatPreference(e.target.value)}
                      >
                        <option value="Window">Window</option>
                        <option value="Aisle">Aisle</option>
                        <option value="Lower Berth">Lower Berth</option>
                        <option value="Upper Berth">Upper Berth</option>
                        <option value="No Preference">No Preference</option>
                      </select>
                    </div>
                  </div>

                  <div className="hotel-modal-form-row">
                    <div className="hotel-modal-form-group">
                      <label htmlFor="contact-email">Email Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="e.g. priya@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>

                    <div className="hotel-modal-form-group">
                      <label htmlFor="contact-phone">Mobile Number</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="hotel-modal-terms-notice">
                    <span>
                      🛡️ <strong>Booking Environment:</strong>  A confirmed PNR reference is recorded to your account.
                    </span>
                    <span>✓ {selectedItem.cancellationPolicy || "Free cancellation up to 4h before journey"}</span>
                  </div>

                  <button
                    type="submit"
                    className="hotel-modal-submit-btn"
                    disabled={bookingLoading}
                  >
                    {bookingLoading
                      ? "Processing..."
                      : `Proceed to Pay (₹${(
                          selectedItem.price * passengersCount +
                          50 * passengersCount +
                          Math.round(selectedItem.price * passengersCount * 0.05)
                        ).toLocaleString("en-IN")}) ➔`}
                  </button>
                </form>
              </div>
            ) : (
              // CONFIRMATION SCREEN
              <div className="hotel-modal-success">
                <div className="hotel-success-icon">✓</div>
                <div className="hotel-modal-badge">[BOOKING CONFIRMED]</div>
                <h2>E-Ticket Confirmed!</h2>
                <p>
                  Your journey with <strong>{selectedItem.operator}</strong> is successfully reserved.
                </p>

                <div className="hotel-confirmation-card">
                  <div className="hotel-conf-row">
                    <span>PNR / Reference</span>
                    <strong className="booking-ref-code">
                      {confirmedTicket.bookingReference}
                    </strong>
                  </div>
                  {confirmedTicket.razorpayPaymentId && (
                    <div className="hotel-conf-row">
                      <span>Razorpay Payment ID</span>
                      <strong style={{ color: "#0284c7", fontFamily: "monospace" }}>
                        {confirmedTicket.razorpayPaymentId}
                      </strong>
                    </div>
                  )}
                  <div className="hotel-conf-row">
                    <span>Passenger Name</span>
                    <strong>{confirmedTicket.guestDetails?.fullName}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Journey</span>
                    <strong>
                      {selectedItem.originCity} → {selectedItem.destinationCity}
                    </strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Departure Time</span>
                    <strong>{selectedItem.departureTime}, {selectedItem.travelDate}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Vehicle / Service</span>
                    <strong>{selectedItem.identifier}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Travel Class / Category</span>
                    <strong>{confirmedTicket.transportDetails?.seatClass || selectedItem.seatClass || "Standard"}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Total Amount Paid</span>
                    <strong className="price-tag">
                      ₹{Number(confirmedTicket.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Payment Status</span>
                    <span className="hotel-status-pill confirmed">● Paid via Razorpay</span>
                  </div>
                </div>

                <div className="hotel-confirmation-actions">
                  <Link
                    to={`/hotels?destination=${encodeURIComponent(selectedItem.destinationCity)}`}
                    className="hotel-button"
                    style={{ textDecoration: "none", textAlign: "center" }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    🏨 Browse Stays in {selectedItem.destinationCity}
                  </Link>

                  <Link
                    to={`/planner?destination=${encodeURIComponent(selectedItem.destinationCity)}&origin=${encodeURIComponent(selectedItem.originCity)}&transport=${encodeURIComponent(selectedItem.type)}&transportFare=${encodeURIComponent(confirmedTicket.totalAmount)}`}
                    className="hotel-detail-back-button"
                    style={{ textDecoration: "none", textAlign: "center" }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    🧳 Plan Itinerary with Confirmed Transport
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Universal Razorpay Payment Gateway Modal */}
      {isRazorpayOpen && selectedItem && (
        <RazorpayPaymentModal
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          totalAmount={
            selectedItem.price * passengersCount +
            50 * passengersCount +
            Math.round(selectedItem.price * passengersCount * 0.05)
          }
          bookingTitle={`${selectedItem.operator} (${selectedItem.identifier})`}
          bookingSubtitle={`${selectedItem.originCity} → ${selectedItem.destinationCity} • ${selectedItem.seatClass || "Standard"}`}
          bookingType="Transport"
          guestInfo={{
            name: passengerName,
            email: contactEmail,
            phone: contactPhone,
          }}
          allowInstallment={false}
          defaultPlan="FULL"
        />
      )}
    </main>
  );
}

export default Transport;
