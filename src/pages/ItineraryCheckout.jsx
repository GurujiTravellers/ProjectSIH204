import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getArrivalPoints } from "../data/arrivalPointsData.js";
import { getHotels, getDestinations } from "../services/api.js";
import { createBooking } from "../services/bookingApi.js";
import { savePlan } from "../services/planApi.js";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { showToast } from "../components/Toast.jsx";

function ItineraryCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const destinationName = state.destination || searchParams.get("destination") || "Your Destination";
  const startDate = state.startDate || searchParams.get("startDate") || "";
  const selectedHotelName = state.selectedHotelName || searchParams.get("hotel") || "";
  const persons = Math.max(1, Number(state.persons || searchParams.get("persons")) || 2);
  const days = Math.max(1, Number(state.days || searchParams.get("days")) || 3);
  const budget = Number(state.budget || searchParams.get("budget")) || 0;
  const tripType = state.tripType || searchParams.get("tripType") || "Friends";
  const originCity = state.originCity || searchParams.get("origin") || "";
  const transportPref = state.transportPref || searchParams.get("transport") || "Train";
  const tripStyle = state.tripStyle || searchParams.get("tripStyle") || "Balanced";
  const urlTransportFare = Number(state.transportFare || searchParams.get("transportFare")) || 0;

  // Bundle Inclusions Toggles
  const [bundleTransport, setBundleTransport] = useState(true);
  const [bundleHotel, setBundleHotel] = useState(true);
  const [bundleActivities, setBundleActivities] = useState(true);

  // Payment Schedule: 30% Installment vs 100% Full Payment
  const [paymentPlan, setPaymentPlan] = useState("INSTALLMENT_ADVANCE");

  // Lead Traveler Info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);

  // Prefill logged-in user if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("travelGurujiUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setGuestName(u.name);
        if (u.email) setGuestEmail(u.email);
        if (u.phone) setGuestPhone(u.phone);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Fetch Destination & Hotel Details
  const [hotelDetails, setHotelDetails] = useState(state.hotelDetails || null);

  useEffect(() => {
    async function loadData() {
      try {
        if (selectedHotelName && !hotelDetails) {
          const hRes = await getHotels({ search: selectedHotelName, destination: destinationName });
          const list = hRes?.hotels || hRes?.data || hRes || [];
          const found = list.find(h => h.name?.toLowerCase() === selectedHotelName.toLowerCase()) || list[0];
          if (found) setHotelDetails(found);
        }
      } catch (err) {
        console.warn("Hotel fetch error:", err);
      }
    }
    loadData();
  }, [selectedHotelName, destinationName, hotelDetails]);

  // Verified Arrival & Disembarkation Hubs
  const arrivalPoints = useMemo(() => {
    return getArrivalPoints(destinationName);
  }, [destinationName]);

  // Calculations
  const hotelNights = Math.max(1, days - 1);
  const rooms = Math.ceil(persons / 2);
  const hotelRatePerNight = Number(hotelDetails?.price) || 1780;

  // Transport Base
  const transportRatePerPerson = transportPref === "Flight" ? 4200 : transportPref === "Bus" ? 850 : 1400;
  const bundleTransportCost = urlTransportFare > 0 
    ? urlTransportFare 
    : transportRatePerPerson * persons;

  // Hotel Base
  const bundleHotelCost = hotelRatePerNight * rooms * hotelNights;

  // Curated Experiences & Entry Passes
  const bundleActivitiesCost = state.bundleActivitiesCost || (180 * persons * days);

  // Dynamic Total based on selected inclusions
  const totalBundleCost = useMemo(() => {
    let sum = 0;
    if (bundleTransport) sum += bundleTransportCost;
    if (bundleHotel) sum += bundleHotelCost;
    if (bundleActivities) sum += bundleActivitiesCost;
    return sum > 0 ? sum : 2500;
  }, [bundleTransport, bundleTransportCost, bundleHotel, bundleHotelCost, bundleActivities, bundleActivitiesCost]);

  const advancePercentage = 30;
  const installmentAdvanceCost = Math.round(totalBundleCost * (advancePercentage / 100));
  const installmentRemainingCost = Math.max(0, totalBundleCost - installmentAdvanceCost);

  const payableNowAmount = paymentPlan === "INSTALLMENT_ADVANCE" ? installmentAdvanceCost : totalBundleCost;

  // Submit Form -> Open Razorpay Modal
  const handleProceedToPay = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      const returnTarget = window.location.pathname + window.location.search;
      try {
        sessionStorage.setItem("travelGurujiReturnTo", returnTarget);
      } catch {
        // Ignore
      }
      showToast("Please do login before booking your trip.", "warning", 5000);
      navigate("/login", {
        state: {
          returnTo: returnTarget,
          action: "book",
          message: "Please do login before booking your trip.",
        },
      });
      return;
    }
    if (!guestName.trim()) {
      setBookingError("Please provide lead traveler full name.");
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes("@")) {
      setBookingError("Please enter a valid email address for booking voucher confirmation.");
      return;
    }
    setBookingError("");
    setIsRazorpayModalOpen(true);
  };

  // Payment Success Handler
  const handlePaymentSuccess = async (paymentData) => {
    try {
      setBookingLoading(true);
      setBookingError("");
      setIsRazorpayModalOpen(false);

      const hasRemaining = (paymentData?.remainingBalance || 0) > 0;

      const comboItems = [];
      if (bundleTransport) {
        comboItems.push({
          itemType: "Transport",
          title: `Transit Journey (${originCity || "Origin"} ⇄ ${arrivalPoints?.disembarkationHub || destinationName})`,
          price: bundleTransportCost,
          details: { origin: originCity || "Origin", destination: destinationName, mode: transportPref },
        });
      }
      if (bundleHotel) {
        comboItems.push({
          itemType: "Hotel",
          title: `Stay at ${selectedHotelName || hotelDetails?.name || "Verified Accommodations"}`,
          price: bundleHotelCost,
          details: { hotelName: selectedHotelName || hotelDetails?.name || "Verified Accommodations", days, nights: hotelNights, rooms },
        });
      }
      if (bundleActivities) {
        comboItems.push({
          itemType: "Activity",
          title: `Curated Activities & Sightseeing Passes (Day 1 to ${days})`,
          price: bundleActivitiesCost,
          details: { destination: destinationName, days },
        });
      }

      const payload = {
        itemType: "ComboItinerary",
        guestDetails: {
          fullName: guestName.trim(),
          email: guestEmail.trim(),
          phone: guestPhone.trim(),
          specialRequests: `Trip Type: ${tripType}, Style: ${tripStyle}, Persons: ${persons}, Days: ${days}`,
        },
        comboItems,
        totalAmount: totalBundleCost,
        currency: "INR",
        paymentStatus: hasRemaining ? "Partially Paid" : "Paid",
        paymentPlan: paymentData?.paymentPlan || paymentPlan,
        amountPaid: paymentData?.amountPaid || payableNowAmount,
        remainingBalance: paymentData?.remainingBalance || (hasRemaining ? installmentRemainingCost : 0),
        razorpayOrderId: paymentData?.orderId,
        razorpayPaymentId: paymentData?.paymentId,
        paymentMethod: paymentData?.paymentMethod || "Razorpay Verified",
        installmentNote: paymentData?.installmentNote || (hasRemaining ? `30% advance paid (₹${payableNowAmount.toLocaleString("en-IN")}); balance of ₹${installmentRemainingCost.toLocaleString("en-IN")} payable upon arrival.` : "100% full payment confirmed."),
        isDemoMode: true,
      };

      const result = await createBooking(payload);
      const bookingRef = result?.booking?.bookingReference || `TG-CMB-${Date.now().toString().slice(-6)}`;

      try {
        await savePlan({
          planType: "Full",
          destination: destinationName,
          startDate,
          hotel: selectedHotelName || hotelDetails?.name || "Selected Hotel",
          persons,
          days,
          budget,
          tripType,
          localExperiences: [],
        });
      } catch (saveErr) {
        console.warn("Auto save plan note:", saveErr);
      }

      // Navigate to confirmed screen
      navigate(
        `/plan-confirmed?destination=${encodeURIComponent(destinationName)}&startDate=${encodeURIComponent(
          startDate
        )}&hotel=${encodeURIComponent(
          selectedHotelName || hotelDetails?.name || "Selected Hotel"
        )}&persons=${persons}&days=${days}&budget=${budget}&tripType=${encodeURIComponent(
          tripType
        )}&bookingRef=${encodeURIComponent(bookingRef)}&paymentPlan=${encodeURIComponent(
          paymentData?.paymentPlan || paymentPlan
        )}&amountPaid=${encodeURIComponent(
          paymentData?.amountPaid || payableNowAmount
        )}&remainingBalance=${encodeURIComponent(
          paymentData?.remainingBalance || (hasRemaining ? installmentRemainingCost : 0)
        )}&razorpayId=${encodeURIComponent(paymentData?.paymentId || "")}&paymentStatus=Paid`
      );
    } catch (err) {
      console.error("Booking creation error:", err);
      setBookingError(err.message || "Unable to finalize reservation. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px 16px 80px 16px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        
        {/* Navigation & Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              padding: "10px 18px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#334155",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            ← Back to Itinerary
          </button>

          <div style={{ fontSize: "13px", color: "#64748b" }}>
            <Link to="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 6px" }}>/</span>
            <Link to="/planner" style={{ color: "#64748b", textDecoration: "none" }}>Planner</Link>
            <span style={{ margin: "0 6px" }}>/</span>
            <span style={{ color: "#0f172a", fontWeight: 700 }}>Itinerary Checkout & Booking</span>
          </div>
        </div>

        {/* Main Card Container */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            border: "1.5px solid #e2e8f0",
            boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
            padding: "32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top Decorative Gradient Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "linear-gradient(90deg, #10b981 0%, #059669 50%, #0284c7 100%)",
            }}
          />

          {/* Header Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    background: "#ecfdf5",
                    color: "#059669",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  TRIP CONFIRMATION & RESERVATION
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    background: "#f0f9ff",
                    color: "#0284c7",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: "1px solid #bae6fd",
                  }}
                >
                  📍 PRIMARY GATEWAY: {arrivalPoints?.disembarkationHub || destinationName}
                </span>
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
                Confirm Itinerary & Book Complete Package
              </h1>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                {days} Days in <strong>{destinationName}</strong> • {persons} Traveler(s) • Verified disembarkation points & guaranteed reservations
              </p>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "14px 24px",
                textAlign: "right",
              }}
            >
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block" }}>
                Total Bundle Value
              </span>
              <strong style={{ fontSize: "28px", fontWeight: 900, color: "#059669" }}>
                ₹{totalBundleCost.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          {/* ARRIVAL POINTS & DISEMBARKATION HUBS CARDS */}
          <div
            className="arrival-points-container"
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ fontSize: "20px" }}>🚉</span>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>
                Arrival & Disembarkation Hubs for {destinationName} (Train, Flight & Bus)
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
                marginBottom: "14px",
              }}
            >
              {/* Train Arrival Point */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#0284c7", textTransform: "uppercase" }}>
                    🚆 By Train / Rail
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      background: "#e0f2fe",
                      color: "#0369a1",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    CODE: {arrivalPoints?.train?.code || "RAIL"}
                  </span>
                </div>
                <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                  {arrivalPoints?.train?.station || `${destinationName} Station`}
                </strong>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                  {arrivalPoints?.train?.details || "Direct express and superfast rail connection."}
                </p>
              </div>

              {/* Flight Arrival Point */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase" }}>
                    ✈️ By Flight / Air
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      background: "#ede9fe",
                      color: "#6d28d9",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    IATA: {arrivalPoints?.flight?.code || "AIR"}
                  </span>
                </div>
                <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                  {arrivalPoints?.flight?.airport || "Nearest Airport"}
                </strong>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                  {arrivalPoints?.flight?.distance || "Direct connecting airport with onward transit."}
                </p>
              </div>

              {/* Bus Arrival Point */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#d97706", textTransform: "uppercase" }}>
                    🚌 By Interstate Bus
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      background: "#fef3c7",
                      color: "#b45309",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    CENTRAL ISBT
                  </span>
                </div>
                <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                  {arrivalPoints?.bus?.terminal || `${destinationName} Bus Stand`}
                </strong>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                  {arrivalPoints?.bus?.details || "State RTC and private luxury sleeper coach terminus."}
                </p>
              </div>
            </div>

            {arrivalPoints?.guidance && (
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "12px",
                  color: "#1e40af",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>💡</span>
                <span>
                  <strong>Transit Guidance:</strong> {arrivalPoints.guidance}
                </span>
              </div>
            )}
          </div>

          {/* TWO COLUMN GRID: INCLUSIONS & BILL BREAKDOWN (LEFT) vs PAYMENT & CHECKOUT (RIGHT) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {/* LEFT COLUMN: BUNDLE INCLUSIONS CHECKLIST */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "22px",
              }}
            >
              <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#1e293b", margin: "0 0 16px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                📦 Package Inclusions (Included in Total)
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {/* Transport Inclusion */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#ffffff",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${bundleTransport ? "#10b981" : "#cbd5e1"}`,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="checkbox"
                      checked={bundleTransport}
                      onChange={(e) => setBundleTransport(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "#10b981", cursor: "pointer" }}
                    />
                    <div>
                      <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>
                        🚆 Intercity Rail & Transit
                      </strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {originCity ? `${originCity} ⇄ ${arrivalPoints?.disembarkationHub || destinationName}` : "Round-trip verified rail corridor"}
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                    ₹{bundleTransportCost.toLocaleString("en-IN")}
                  </strong>
                </label>

                {/* Hotel Inclusion */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#ffffff",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${bundleHotel ? "#10b981" : "#cbd5e1"}`,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="checkbox"
                      checked={bundleHotel}
                      onChange={(e) => setBundleHotel(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "#10b981", cursor: "pointer" }}
                    />
                    <div>
                      <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>
                        🏨 Verified Hotel Stay ({hotelNights} Nights)
                      </strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {hotelDetails?.name || selectedHotelName || "Curated Heritage / Boutique Stay"} ({rooms} {rooms === 1 ? "Room" : "Rooms"})
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                    ₹{bundleHotelCost.toLocaleString("en-IN")}
                  </strong>
                </label>

                {/* Experiences Inclusion */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#ffffff",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${bundleActivities ? "#10b981" : "#cbd5e1"}`,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="checkbox"
                      checked={bundleActivities}
                      onChange={(e) => setBundleActivities(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "#10b981", cursor: "pointer" }}
                    />
                    <div>
                      <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>
                        🎟️ Curated Experiences & Daily Passes
                      </strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Day 1 to Day {days} non-repeating attractions & sightseeing pass
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                    ₹{bundleActivitiesCost.toLocaleString("en-IN")}
                  </strong>
                </label>
              </div>

              {/* Bill Totals Summary Box */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b" }}>
                  <span>Base Package Subtotal</span>
                  <span>₹{totalBundleCost.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#166534" }}>
                  <span>Emergency Safety Reserve & Guardian</span>
                  <span>Included</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#0284c7" }}>
                  <span>Taxes & GST</span>
                  <span>Included (Zero Hidden Fee)</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1.5px dashed #e2e8f0",
                    paddingTop: "10px",
                    marginTop: "4px",
                  }}
                >
                  <strong style={{ fontSize: "15px", color: "#0f172a" }}>Total Package Cost:</strong>
                  <strong style={{ fontSize: "20px", color: "#059669", fontWeight: 900 }}>
                    ₹{totalBundleCost.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PAYMENT PLAN & CHECKOUT FORM */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #cbd5e1",
                borderRadius: "18px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#334155", textTransform: "uppercase", marginBottom: "10px" }}>
                  Select Payment Schedule
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {/* Option 1: 30% Installment */}
                  <div
                    onClick={() => setPaymentPlan("INSTALLMENT_ADVANCE")}
                    style={{
                      border: `2px solid ${paymentPlan === "INSTALLMENT_ADVANCE" ? "#10b981" : "#e2e8f0"}`,
                      background: paymentPlan === "INSTALLMENT_ADVANCE" ? "#f0fdf4" : "#ffffff",
                      borderRadius: "14px",
                      padding: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>Trip Installment (30%)</strong>
                      <span style={{ fontSize: "10px", fontWeight: 800, background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "4px" }}>
                        Recommended
                      </span>
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 900, color: "#059669" }}>
                      ₹{installmentAdvanceCost.toLocaleString("en-IN")} <small style={{ fontSize: "11px", color: "#64748b" }}>now</small>
                    </div>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 0", lineHeight: "1.3" }}>
                      Pay 30% advance now to lock bundle. Remainder ₹{installmentRemainingCost.toLocaleString("en-IN")} payable upon arrival.
                    </p>
                  </div>

                  {/* Option 2: 100% Full Payment */}
                  <div
                    onClick={() => setPaymentPlan("FULL_PAYMENT")}
                    style={{
                      border: `2px solid ${paymentPlan === "FULL_PAYMENT" ? "#10b981" : "#e2e8f0"}`,
                      background: paymentPlan === "FULL_PAYMENT" ? "#f0fdf4" : "#ffffff",
                      borderRadius: "14px",
                      padding: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>Full Payment (100%)</strong>
                      <span style={{ fontSize: "10px", fontWeight: 700, background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "4px" }}>
                        Complete
                      </span>
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a" }}>
                      ₹{totalBundleCost.toLocaleString("en-IN")} <small style={{ fontSize: "11px", color: "#64748b" }}>now</small>
                    </div>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 0", lineHeight: "1.3" }}>
                      Complete 100% upfront settlement with zero balance remaining.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lead Traveler Form */}
              <form onSubmit={handleProceedToPay} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label htmlFor="itn-lead-name" style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Lead Traveler Full Name *
                  </label>
                  <input
                    id="itn-lead-name"
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label htmlFor="itn-lead-email" style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Email Address *
                    </label>
                    <input
                      id="itn-lead-email"
                      type="email"
                      required
                      placeholder="e.g. traveler@gmail.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "10px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="itn-lead-phone" style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Mobile Phone
                    </label>
                    <input
                      id="itn-lead-phone"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "10px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {bookingError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#dc2626",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "13px",
                    }}
                  >
                    ⚠️ {bookingError}
                  </div>
                )}

                {/* Primary Proceed to Pay Button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: 800,
                    border: "none",
                    borderRadius: "14px",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.35)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {bookingLoading ? (
                    "Connecting Razorpay Gateway..."
                  ) : (
                    <>
                      <span>Proceed to Pay (₹{payableNowAmount.toLocaleString("en-IN")})</span>
                      <span>→</span>
                    </>
                  )}
                </button>

                <div style={{ textAlign: "center", fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  🔒 256-Bit Razorpay Instant Encrypted Checkout • Zero Convenience Fee
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Razorpay Universal Modal */}
        {isRazorpayModalOpen && (
          <RazorpayPaymentModal
            isOpen={isRazorpayModalOpen}
            onClose={() => setIsRazorpayModalOpen(false)}
            onPaymentSuccess={handlePaymentSuccess}
            totalAmount={totalBundleCost}
            bookingTitle={`Complete Trip Package: ${destinationName} (${days} Days)`}
            bookingSubtitle={`${persons} Traveler(s) • ${paymentPlan === "INSTALLMENT_ADVANCE" ? "30% Advance Installment" : "Full Payment"}`}
            bookingType="TripPlan"
            guestInfo={{
              name: guestName,
              email: guestEmail,
              phone: guestPhone,
            }}
            allowInstallment={true}
            defaultPlan={paymentPlan}
            advancePercentage={advancePercentage}
          />
        )}
      </div>
    </div>
  );
}

function ItineraryCheckoutWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <ItineraryCheckout />
    </ErrorBoundary>
  );
}

export default ItineraryCheckoutWithErrorBoundary;
