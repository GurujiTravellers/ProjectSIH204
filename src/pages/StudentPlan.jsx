import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getDestinations, getHotels } from "../services/api";
import staticHotels from "../data/hotels";
import staticDestinations from "../data/destinations";
import { createBooking } from "../services/bookingApi";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";
import ErrorBoundary from "../components/ErrorBoundary";
import { showToast } from "../components/Toast";

function StudentPlan() {
  const [searchParams] = useSearchParams();

  const destinationParam = searchParams.get("destination") || "";
  const destinationName = destinationParam.trim() || "Manali";
  const [startDate] = useState(() => searchParams.get("startDate") || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]);
  const hotelName = searchParams.get("hotel") || "";
  const persons = Math.max(1, Number(searchParams.get("persons")) || 4);
  const days = Math.max(1, Number(searchParams.get("days")) || 3);
  const budget = Number(searchParams.get("budget")) || 14500;
  const tripType = searchParams.get("tripType") || "Students";

  const navigate = useNavigate();

  // Core Trip Plan Data State
  const [destination, setDestination] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Student Checkout Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [studentPaymentPlan, setStudentPaymentPlan] = useState("INSTALLMENT_ADVANCE"); // 25% token vs 100%
  const [studentBookingError, setStudentBookingError] = useState("");
  const [studentBookingLoading, setStudentBookingLoading] = useState(false);

  // Student Verification Portal State
  const [studentConfirmed, setStudentConfirmed] = useState(() => {
    try {
      return localStorage.getItem("travelGurujiStudentVerified") === "true";
    } catch (err) {
      void err;
      return false;
    }
  });

  const [studentName, setStudentName] = useState(() => {
    try {
      const stored = localStorage.getItem("travelGurujiUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) return u.name;
      }
    } catch (err) {
      void err;
    }
    return "Aarav Sharma";
  });

  const [studentEmail, setStudentEmail] = useState(() => {
    try {
      const stored = localStorage.getItem("travelGurujiUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.email) return u.email;
      }
    } catch (err) {
      void err;
    }
    return "aarav.sharma@student.ac.in";
  });

  const [studentPhone, setStudentPhone] = useState("9876543210");

  const [studentCollegeId, setStudentCollegeId] = useState(() => {
    try {
      return localStorage.getItem("travelGurujiStudentCollege") || "Delhi University (DU)";
    } catch (err) {
      void err;
      return "Delhi University (DU)";
    }
  });

  const [studentRollNo, setStudentRollNo] = useState(() => {
    try {
      return localStorage.getItem("travelGurujiStudentRoll") || "DU-2024-STU884";
    } catch (err) {
      void err;
      return "DU-2024-STU884";
    }
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState("");

  const handleVerifyStudent = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!studentCollegeId.trim()) {
      setVerificationFeedback("Please provide your College or University name.");
      return;
    }
    setIsVerifying(true);
    setVerificationFeedback("");

    setTimeout(() => {
      try {
        localStorage.setItem("travelGurujiStudentVerified", "true");
        localStorage.setItem("travelGurujiStudentCollege", studentCollegeId.trim());
        localStorage.setItem("travelGurujiStudentRoll", studentRollNo.trim() || "DU-2024-STU884");
      } catch (err) {
        void err;
      }
      setIsVerifying(false);
      setStudentConfirmed(true);
    }, 400);
  };

  const handleQuickDemoVerify = () => {
    setIsVerifying(true);
    setStudentName((prev) => prev || "Aarav Sharma");
    setStudentCollegeId("Delhi University (North Campus)");
    setStudentRollNo("DU-UG-2024-9921");
    setStudentEmail((prev) => prev || "aarav.sharma@student.du.ac.in");

    setTimeout(() => {
      try {
        localStorage.setItem("travelGurujiStudentVerified", "true");
        localStorage.setItem("travelGurujiStudentCollege", "Delhi University (North Campus)");
        localStorage.setItem("travelGurujiStudentRoll", "DU-UG-2024-9921");
      } catch (err) {
        void err;
      }
      setIsVerifying(false);
      setStudentConfirmed(true);
    }, 350);
  };

  const handleReverifyOrEdit = () => {
    setStudentConfirmed(false);
  };

  useEffect(() => {
    const loadTripData = async () => {
      try {
        setLoading(true);
        setError("");

        const destinationResponse = await getDestinations({
          search: destinationName,
        });

        const destinationList =
          destinationResponse?.destinations ||
          destinationResponse?.data ||
          destinationResponse ||
          [];

        const matchedDestination =
          destinationList.find(
            (item) =>
              item.name?.toLowerCase() === destinationName.toLowerCase()
          ) ||
          staticDestinations.find(
            (item) =>
              item.name?.toLowerCase() === destinationName.toLowerCase()
          ) ||
          destinationList.find(
            (item) =>
              item.name?.toLowerCase().includes(destinationName.toLowerCase()) ||
              destinationName.toLowerCase().includes(item.name?.toLowerCase())
          ) ||
          staticDestinations.find(
            (item) =>
              item.name?.toLowerCase().includes(destinationName.toLowerCase()) ||
              destinationName.toLowerCase().includes(item.name?.toLowerCase())
          );

        setDestination(matchedDestination || null);

        if (hotelName) {
          const hotelResponse = await getHotels({
            search: hotelName,
            destination: destinationName,
          });

          const hotelList =
            hotelResponse?.hotels ||
            hotelResponse?.data ||
            hotelResponse ||
            [];

          const matchedHotel = hotelList.find(
            (item) => item.name?.toLowerCase() === hotelName.toLowerCase()
          );

          setHotel(matchedHotel || null);
        } else {
          // Auto-recommend a student homestay for this destination
          const dLower = destinationName.toLowerCase();
          const matchedStay =
            staticHotels.find(
              (h) =>
                (h.destination?.toLowerCase() === dLower ||
                 h.destination?.toLowerCase().includes(dLower) ||
                 dLower.includes(h.destination?.toLowerCase())) &&
                h.studentRecommended
            ) ||
            staticHotels.find(
              (h) =>
                h.destination?.toLowerCase() === dLower ||
                h.destination?.toLowerCase().includes(dLower) ||
                dLower.includes(h.destination?.toLowerCase())
            );
          setHotel(matchedStay || null);
        }
      } catch (err) {
        console.error("Student plan loading failed:", err);
        setError("Student plan could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, [destinationName, hotelName]);

  // Real-time interactive student parameters
  const [livePersons, setLivePersons] = useState(persons || 4);
  const [liveDays, setLiveDays] = useState(days || 3);
  const [stayStyle, setStayStyle] = useState("DORM"); // DORM, HOMESTAY, BUDGET_HOTEL
  const [travelOption, setTravelOption] = useState("RAIL_SLEEPER"); // RAIL_SLEEPER, RAIL_3AC, BUS

  const liveRooms = Math.ceil(livePersons / 2);
  const liveNights = Math.max(1, liveDays - 1);

  // 1. Accommodation pricing (subsidized student dorms/homestays)
  const stayRates = {
    DORM: { label: "Student Backpacker Dorm", costPerNight: 550 * livePersons, perPersonNight: 550 },
    HOMESTAY: { label: "Shared Student Homestay", costPerNight: 1100 * liveRooms, perPersonNight: Math.round((1100 * liveRooms) / livePersons) },
    BUDGET_HOTEL: { label: "Budget Student Hotel", costPerNight: 1600 * liveRooms, perPersonNight: Math.round((1600 * liveRooms) / livePersons) },
  };
  const selectedStay = stayRates[stayStyle] || stayRates.DORM;
  const hotelCost = selectedStay.costPerNight * liveNights;

  // 2. Intercity Travel (round trip with student concession)
  const travelRates = {
    RAIL_SLEEPER: { label: "IRCTC Student Concession (Sleeper)", roundTripPerPerson: 850 },
    RAIL_3AC: { label: "3rd AC Express Student Pass", roundTripPerPerson: 1850 },
    BUS: { label: "State Intercity RTC Bus Pass", roundTripPerPerson: 950 },
  };
  const selectedTravel = travelRates[travelOption] || travelRates.RAIL_SLEEPER;
  const intercityTravelCost = selectedTravel.roundTripPerPerson * livePersons;

  // 3. Local transit (cycles, shared autos, student metro): ₹110/student/day
  const localTransitCost = 110 * livePersons * liveDays;

  // 4. Combined travel cost (ensures travelCost is defined everywhere)
  const travelCost = intercityTravelCost + localTransitCost;

  // 5. Food & Dining (Student mess, dhabas, local street food): ₹200/student/day
  const foodCost = 200 * livePersons * liveDays;

  // 6. Entry Tickets & Misc (50% student museum/monument concession): ₹60/student/day
  const miscCost = 60 * livePersons * liveDays;

  // Subtotal & 5% student safety reserve
  const baseSubtotal = hotelCost + travelCost + foodCost + miscCost;
  const studentBuffer = Math.round(baseSubtotal * 0.05);
  const totalCost = baseSubtotal + studentBuffer;

  // Commercial Equivalent & Verified Student Savings (~48% discount)
  const commercialStayCost = Math.round(2200 * liveRooms * liveNights);
  const commercialTravelCost = Math.round((2200 + 380 * liveDays) * livePersons);
  const commercialFoodCost = Math.round(550 * livePersons * liveDays);
  const commercialMiscCost = Math.round(180 * livePersons * liveDays);
  const commercialEquivalent = commercialStayCost + commercialTravelCost + commercialFoodCost + commercialMiscCost;
  const savingAmount = Math.max(0, commercialEquivalent - totalCost);
  const savingPercent = Math.round((savingAmount / commercialEquivalent) * 100);

  const costPerPerson = Math.round(totalCost / livePersons);
  const costPerPersonPerDay = Math.round(totalCost / (livePersons * liveDays));

  const studentAdvancePercentage = 25;
  const studentAdvanceCost = Math.round((totalCost * studentAdvancePercentage) / 100);
  const studentRemainingCost = Math.max(0, totalCost - studentAdvanceCost);
  const studentPayableNow = studentPaymentPlan === "INSTALLMENT_ADVANCE" ? studentAdvanceCost : totalCost;

  const handleOpenStudentCheckout = () => {
    const token = localStorage.getItem("travelGurujiToken");
    const returnTarget = window.location.pathname + window.location.search;

    if (!token) {
      try {
        sessionStorage.setItem("travelGurujiReturnTo", returnTarget);
      } catch {
        // Ignore
      }
      showToast("Please do login before booking your student trip plan.", "warning", 5000);
      navigate("/login", {
        state: {
          returnTo: returnTarget,
          action: "book",
          message: "Please do login before booking your student trip plan.",
        },
      });
      return;
    }

    setStudentBookingError("");
    setIsStudentModalOpen(true);
  };

  const handleStudentProceedToPay = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      handleOpenStudentCheckout();
      return;
    }
    if (!studentName.trim() || !studentEmail.trim()) {
      setStudentBookingError("Please provide student name and email.");
      return;
    }
    setStudentBookingError("");
    setIsRazorpayModalOpen(true);
  };

  const handleStudentPaymentSuccess = async (paymentData) => {
    try {
      setStudentBookingLoading(true);
      setStudentBookingError("");
      setIsRazorpayModalOpen(false);

      const hasRemaining = (paymentData?.remainingBalance || 0) > 0;

      const payload = {
        itemType: "StudentPlan",
        studentDetails: {
          institution: studentCollegeId.trim() || "Student Identity Verified",
          studentCost: totalCost,
          savingAmount: savingAmount || 0,
        },
        guestDetails: {
          fullName: studentName.trim(),
          email: studentEmail.trim(),
          phone: studentPhone.trim(),
          specialRequests: `College ID / University: ${studentCollegeId || "Student Pass"}`,
        },
        totalAmount: totalCost,
        currency: "INR",
        paymentStatus: hasRemaining ? "Partially Paid" : "Paid",
        paymentPlan: paymentData?.paymentPlan || studentPaymentPlan,
        amountPaid: paymentData?.amountPaid || studentPayableNow,
        remainingBalance: paymentData?.remainingBalance || (hasRemaining ? studentRemainingCost : 0),
        razorpayOrderId: paymentData?.orderId,
        razorpayPaymentId: paymentData?.paymentId,
        paymentMethod: paymentData?.paymentMethod || "Razorpay Verified",
        installmentNote: paymentData?.installmentNote || (hasRemaining ? `25% student token advance paid (₹${studentPayableNow.toLocaleString("en-IN")}); remaining ₹${studentRemainingCost.toLocaleString("en-IN")} payable upon arrival.` : "100% full student plan paid."),
        isDemoMode: true,
      };

      const result = await createBooking(payload);
      const bookingRef = result?.booking?.bookingReference || (paymentData?.paymentId ? `TG-STU-${paymentData.paymentId.slice(-6)}` : "TG-STU-884192");

      setIsStudentModalOpen(false);

      navigate(
        `/student-plan-confirmed?destination=${encodeURIComponent(destinationName)}&startDate=${encodeURIComponent(
          startDate
        )}&hotel=${encodeURIComponent(
          selectedStay.label
        )}&persons=${livePersons}&days=${liveDays}&budget=${budget}&tripType=${encodeURIComponent(
          tripType
        )}&studentCost=${totalCost}&bookingRef=${encodeURIComponent(bookingRef)}&paymentPlan=${encodeURIComponent(
          paymentData?.paymentPlan || studentPaymentPlan
        )}&amountPaid=${encodeURIComponent(
          paymentData?.amountPaid || studentPayableNow
        )}&remainingBalance=${encodeURIComponent(
          paymentData?.remainingBalance || (hasRemaining ? studentRemainingCost : 0)
        )}&razorpayId=${encodeURIComponent(paymentData?.paymentId || "")}&paymentStatus=Paid`
      );
    } catch (err) {
      console.error("Student booking error:", err);
      setStudentBookingError(err.message || "Failed to confirm student booking.");
    } finally {
      setStudentBookingLoading(false);
    }
  };

  const dailyCosts = useMemo(() => {
    if (liveDays <= 0) {
      return [];
    }

    const travelWeights = Array.from({ length: liveDays }, (_, index) => {
      if (liveDays === 1) return 1;
      if (index === 0) return 1.3;
      if (index === liveDays - 1) return 1.2;
      return 0.85;
    });

    const miscWeights = Array.from({ length: liveDays }, (_, index) => {
      if (liveDays === 1) return 1;
      if (index === 0 || index === liveDays - 1) return 1.15;
      return 0.9;
    });

    const totalTravelWeight = travelWeights.reduce(
      (sum, weight) => sum + weight,
      0
    );

    const totalMiscWeight = miscWeights.reduce(
      (sum, weight) => sum + weight,
      0
    );

    const totalTripTravel = intercityTravelCost + localTransitCost;

    return Array.from({ length: liveDays }, (_, index) => {
      const dayTravelCost = Math.round(
        (totalTripTravel * travelWeights[index]) / totalTravelWeight
      );

      const dayFoodCost = Math.round(foodCost / liveDays);

      const dayMiscCost = Math.round(
        (miscCost * miscWeights[index]) / totalMiscWeight
      );

      const dayHotelCost =
        index < liveNights
          ? Math.round(hotelCost / Math.max(1, liveNights))
          : 0;

      return {
        day: index + 1,
        travel: dayTravelCost,
        food: dayFoodCost,
        hotel: dayHotelCost,
        misc: dayMiscCost,
        total:
          dayTravelCost +
          dayFoodCost +
          dayHotelCost +
          dayMiscCost,
      };
    });
  }, [
    liveDays,
    intercityTravelCost,
    localTransitCost,
    foodCost,
    miscCost,
    hotelCost,
    liveNights,
  ]);

  const tripPlanUrl = `/trip-plan?destination=${encodeURIComponent(
    destinationName
  )}&startDate=${encodeURIComponent(startDate)}&hotel=${encodeURIComponent(
    hotelName
  )}&persons=${persons}&days=${days}&budget=${budget}&tripType=${encodeURIComponent(
    tripType
  )}`;

  const itinerary = useMemo(() => {
    const attractions = Array.isArray(destination?.attractions)
      ? destination.attractions
      : [];

    const fallbackPlans = [
      {
        title: "Arrival & Local Exploration",
        icon: "🚌",
        description:
          "Reach the destination, check in and explore nearby affordable places with your group.",
      },
      {
        title: "Main Attractions",
        icon: "📍",
        description:
          "Explore popular attractions and enjoy the main highlights of the destination.",
      },
      {
        title: "Local Food & Culture",
        icon: "🍱",
        description:
          "Try affordable local food and discover the culture of the destination.",
      },
      {
        title: "Local Market & Free Time",
        icon: "🛍️",
        description:
          "Visit local markets, explore nearby places and enjoy some free time.",
      },
      {
        title: "Final Exploration & Departure",
        icon: "🎒",
        description:
          "Enjoy one final activity and prepare for the return journey.",
      },
    ];

    return Array.from({ length: days }, (_, index) => {
      const attraction = attractions[index];

      if (attraction) {
        return {
          day: index + 1,
          title: attraction.name,
          icon: "📍",
          description:
            attraction.description ||
            "Explore this place with your college group.",
          rating: attraction.rating || null,
        };
      }

      const plan = fallbackPlans[index % fallbackPlans.length];

      return {
        day: index + 1,
        title: plan.title,
        icon: plan.icon,
        description: plan.description,
        rating: null,
      };
    });
  }, [days, destination]);

  if (loading) {
    return (
      <main className="student-only-plan-page">
        <div className="student-only-plan-loading">
          <div>🎓</div>
          <h2>Creating your Student Plan...</h2>
          <p>Preparing an affordable version of your current trip.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="student-only-plan-page">
        <div className="student-only-plan-error">
          <div>⚠️</div>
          <h2>Student Plan unavailable</h2>
          <p>{error}</p>
          <Link to="/planner" className="student-plan-back-btn">
            ← Back to Planner
          </Link>
        </div>
      </main>
    );
  }

  if (!studentConfirmed) {
    return (
      <main className="student-confirmation-page">
        <section className="student-confirmation-card" style={{ maxWidth: "680px", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div className="student-confirmation-icon" style={{ margin: 0, width: "64px", height: "64px", fontSize: "32px", flexShrink: 0 }}>
              🎓
            </div>
            <div>
              <span style={{ display: "block", color: "#0284c7", fontSize: "11px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase" }}>
                TRAVEL GURUJI • STUDENT CONCESSION PORTAL
              </span>
              <h1 style={{ fontSize: "24px", color: "#0f172a", margin: "4px 0 0", lineHeight: "1.2" }}>
                Verify College ID to Access Subsidized Rates
              </h1>
            </div>
          </div>

          <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px" }}>
            This student travel portal provides <strong>up to 50% lower budget</strong> than standard commercial travel by activating IRCTC 50% sleeper railway concessions, verified backpacker youth dormitories, and subsidized mess dining.
          </p>

          {/* CONCESSION HIGHLIGHTS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "22px" }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px", borderRadius: "10px", fontSize: "12px" }}>
              <strong style={{ color: "#166534", display: "block", marginBottom: "2px" }}>🚆 50% Rail Concession</strong>
              <span style={{ color: "#15803d" }}>IRCTC Sleeper student travel pass applied</span>
            </div>
            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "12px", borderRadius: "10px", fontSize: "12px" }}>
              <strong style={{ color: "#0369a1", display: "block", marginBottom: "2px" }}>🏨 Youth Dormitory Beds</strong>
              <span style={{ color: "#0284c7" }}>Backpacker dorms & homestays from ₹550/night</span>
            </div>
            <div style={{ background: "#fefce8", border: "1px solid #fef08a", padding: "12px", borderRadius: "10px", fontSize: "12px" }}>
              <strong style={{ color: "#854d0e", display: "block", marginBottom: "2px" }}>🍱 Subsidized Food Mess</strong>
              <span style={{ color: "#a16207" }}>Campus messes & student dhabas @ ₹200/day</span>
            </div>
            <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", padding: "12px", borderRadius: "10px", fontSize: "12px" }}>
              <strong style={{ color: "#6b21a8", display: "block", marginBottom: "2px" }}>🏛️ ASI Heritage 50% Off</strong>
              <span style={{ color: "#7e22ce" }}>Discounted monuments & museum entries</span>
            </div>
          </div>

          {/* VERIFICATION FORM */}
          <form onSubmit={handleVerifyStudent} style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: "0 0 14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🪪</span> Enter Student Credentials to Unlock Portal
            </h3>

            {verificationFeedback && (
              <div style={{ background: "#fef2f2", color: "#991b1b", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", marginBottom: "14px", border: "1px solid #fecaca" }}>
                ⚠️ {verificationFeedback}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentCollegeId}
                  onChange={(e) => setStudentCollegeId(e.target.value)}
                  placeholder="e.g. Delhi University / IIT / St. Xavier's"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                  Student ID / Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={studentRollNo}
                  onChange={(e) => setStudentRollNo(e.target.value)}
                  placeholder="e.g. DU-2024-STU884"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                  Student Email Address
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g. aarav@student.ac.in"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", justifyContent: "space-between", paddingTop: "8px" }}>
              <button
                type="submit"
                disabled={isVerifying}
                style={{
                  background: "#16a34a",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: isVerifying ? "wait" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
                }}
              >
                {isVerifying ? "⏳ Verifying Student ID..." : "✓ Verify Student ID & Open Portal ➔"}
              </button>

              <button
                type="button"
                onClick={handleQuickDemoVerify}
                disabled={isVerifying}
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                ⚡ Instant Demo 1-Click Verification
              </button>
            </div>
          </form>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <Link
              to={tripPlanUrl}
              style={{ color: "#64748b", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}
            >
              ← No, return to standard commercial trip
            </Link>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
              🛡️ AICTE / UGC / Recognized University Concession Pass
            </span>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="student-only-plan-page">
      <section
        className="student-only-plan-hero"
        style={{
          backgroundImage: destination?.image
            ? `url(${destination.image})`
            : "none",
        }}
      >
        <div className="student-only-plan-overlay" />

        <div className="student-only-plan-hero-content">
          <span>🎓 TRAVEL GURUJI • STUDENT EDITION</span>
          <h1>
            Your Student
            <br />
            Smart Travel Plan
          </h1>
          <p>
            Your existing trip, redesigned specially for students and college
            groups to travel comfortably while keeping the budget low.
          </p>

          <div className="student-only-plan-badges">
            <span>💰 Low Budget</span>
            <span>🎒 Student Friendly</span>
            <span>👥 Group Travel</span>
          </div>
        </div>
      </section>

      <section className="student-only-plan-container">
        {/* ========================================================
            VERIFIED STUDENT DIGITAL IDENTITY & CONCESSION PASS
            ======================================================== */}
        <section
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)",
            color: "#ffffff",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 12px 30px rgba(6, 78, 59, 0.18)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(4px)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "30px",
                  border: "1.5px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                🎓
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1px", background: "#10b981", color: "#ffffff", padding: "3px 10px", borderRadius: "12px" }}>
                    ● ACTIVE • VERIFIED STUDENT CONCESSION PASS
                  </span>
                  <span style={{ fontSize: "12px", opacity: 0.9 }}>
                    Pass ID: <strong>TG-STU-{destinationName.toUpperCase().slice(0, 3)}-{livePersons}P</strong>
                  </span>
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "6px 0 2px", color: "#ffffff" }}>
                  {studentName || "Verified Student"}
                </h2>
                <div style={{ fontSize: "13px", opacity: 0.95 }}>
                  🏛️ {studentCollegeId || "Accredited University"} • Roll No: <strong>{studentRollNo || "STU-VERIFIED"}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                type="button"
                onClick={handleReverifyOrEdit}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                ✏️ Edit Student ID
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "16px",
              paddingTop: "14px",
              borderTop: "1px solid rgba(255, 255, 255, 0.18)",
              fontSize: "11px",
              fontWeight: "700",
            }}
          >
            <span style={{ background: "rgba(255, 255, 255, 0.12)", padding: "4px 10px", borderRadius: "6px" }}>
              ✓ 50% IRCTC Sleeper Rail Concession Active
            </span>
            <span style={{ background: "rgba(255, 255, 255, 0.12)", padding: "4px 10px", borderRadius: "6px" }}>
              ✓ Youth Dormitory Beds Unlocked (₹550/nt)
            </span>
            <span style={{ background: "rgba(255, 255, 255, 0.12)", padding: "4px 10px", borderRadius: "6px" }}>
              ✓ Subsidized Campus Mess & Dhaba Rates (~₹200/d)
            </span>
            <span style={{ background: "rgba(255, 255, 255, 0.12)", padding: "4px 10px", borderRadius: "6px" }}>
              ✓ ASI 50% Heritage Concession Pass Active
            </span>
          </div>
        </section>

        <section className="student-only-plan-trip-card">
          <div>
            <span>YOUR ORIGINAL TRIP</span>
            <h2>{destination?.name || destinationName}</h2>
            <p>
              This student plan is created from the trip you have already
              planned.
            </p>
          </div>

          <div className="student-only-plan-trip-info">
            <div>
              <span>👥</span>
              <strong>{persons}</strong>
              <small>Students</small>
            </div>

            <div>
              <span>🗓️</span>
              <strong>{days}</strong>
              <small>Days</small>
            </div>

            <div>
              <span>🏨</span>
              <strong>{hotel?.name || hotelName || "Student Homestay"}</strong>
              <small>Stay</small>
            </div>

            <div>
              <span>🧑‍🤝‍🧑</span>
              <strong>{tripType}</strong>
              <small>Trip Type</small>
            </div>

            <div>
              <span>💰</span>
              <strong>₹{budget.toLocaleString("en-IN")}</strong>
              <small>Original Budget</small>
            </div>
          </div>
        </section>

        {/* ========================================================
            INTERACTIVE STUDENT TRIP CUSTOMIZER & BUDGET PLANNING BAR
            ======================================================== */}
        <section
          style={{
            background: "#ffffff",
            border: "1.5px solid #cbd5e1",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#0284c7", textTransform: "uppercase", letterSpacing: "1px" }}>
                REAL-TIME STUDENT BUDGET CUSTOMIZER
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "4px 0 0" }}>
                Customize Your Student Package
              </h2>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ background: "#dcfce7", color: "#166534", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "800" }}>
                ✓ Verified Student Concession
              </span>
            </div>
          </div>

          {/* CONTROLS ROW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            {/* STUDENTS COUNTER */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                👥 Students in Group:
              </label>
              <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden", background: "#ffffff" }}>
                <button
                  type="button"
                  onClick={() => setLivePersons((prev) => Math.max(1, prev - 1))}
                  style={{ background: "#ffffff", border: "none", padding: "8px 14px", fontWeight: "800", cursor: "pointer", color: "#0f172a" }}
                >
                  -
                </button>
                <span style={{ padding: "8px 16px", background: "#f1f5f9", fontWeight: "800", fontSize: "14px", minWidth: "40px", textAlign: "center" }}>
                  {livePersons}
                </span>
                <button
                  type="button"
                  onClick={() => setLivePersons((prev) => Math.min(12, prev + 1))}
                  style={{ background: "#ffffff", border: "none", padding: "8px 14px", fontWeight: "800", cursor: "pointer", color: "#0f172a" }}
                >
                  +
                </button>
              </div>
              <span style={{ display: "block", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                Requires {liveRooms} shared room{liveRooms > 1 ? "s" : ""}
              </span>
            </div>

            {/* TRIP DAYS COUNTER */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                🗓️ Trip Duration:
              </label>
              <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden", background: "#ffffff" }}>
                <button
                  type="button"
                  onClick={() => setLiveDays((prev) => Math.max(1, prev - 1))}
                  style={{ background: "#ffffff", border: "none", padding: "8px 14px", fontWeight: "800", cursor: "pointer", color: "#0f172a" }}
                >
                  -
                </button>
                <span style={{ padding: "8px 16px", background: "#f1f5f9", fontWeight: "800", fontSize: "14px", minWidth: "40px", textAlign: "center" }}>
                  {liveDays}d
                </span>
                <button
                  type="button"
                  onClick={() => setLiveDays((prev) => Math.min(14, prev + 1))}
                  style={{ background: "#ffffff", border: "none", padding: "8px 14px", fontWeight: "800", cursor: "pointer", color: "#0f172a" }}
                >
                  +
                </button>
              </div>
              <span style={{ display: "block", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                Includes {liveNights} night{liveNights > 1 ? "s" : ""} stay
              </span>
            </div>

            {/* STAY STYLE */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                🏨 Student Stay Style:
              </label>
              <select
                value={stayStyle}
                onChange={(e) => setStayStyle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: "#ffffff",
                  color: "#0f172a",
                }}
              >
                <option value="DORM">🎒 Backpacker Dorm (₹550/night)</option>
                <option value="HOMESTAY">🏠 Shared Homestay (₹550/student)</option>
                <option value="BUDGET_HOTEL">🏨 Budget Hotel (₹800/student)</option>
              </select>
            </div>

            {/* TRAVEL MODE */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                🚆 Travel Pass Mode:
              </label>
              <select
                value={travelOption}
                onChange={(e) => setTravelOption(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: "#ffffff",
                  color: "#0f172a",
                }}
              >
                <option value="RAIL_SLEEPER">🚆 IRCTC Student Sleeper (₹850 RT)</option>
                <option value="RAIL_3AC">🚆 3rd AC Group Express (₹1,850 RT)</option>
                <option value="BUS">🚌 State Intercity RTC Bus (₹950 RT)</option>
              </select>
            </div>
          </div>

          {/* TRANSPARENT COMPARISON CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {/* COMMERCIAL VS STUDENT PASS */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                STANDARD COMMERCIAL RATE
              </span>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#94a3b8", textDecoration: "line-through", margin: "4px 0" }}>
                ₹{commercialEquivalent.toLocaleString("en-IN")}
              </div>
              <small style={{ color: "#64748b" }}>Normal commercial rate without student concession</small>
            </div>

            {/* VERIFIED STUDENT PASS RATE */}
            <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#166534", textTransform: "uppercase" }}>
                  VERIFIED STUDENT PASS
                </span>
                <span style={{ background: "#10b981", color: "#ffffff", fontSize: "10px", fontWeight: "800", padding: "2px 8px", borderRadius: "10px" }}>
                  Save ~{savingPercent}%
                </span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#15803d", margin: "4px 0" }}>
                ₹{totalCost.toLocaleString("en-IN")}
              </div>
              <small style={{ color: "#166534", fontWeight: "600" }}>
                Total for all {livePersons} students ({liveDays} days)
              </small>
            </div>

            {/* PER-STUDENT RATE */}
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#1e40af", textTransform: "uppercase" }}>
                COST PER STUDENT
              </span>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#1e3a8a", margin: "4px 0" }}>
                ₹{costPerPerson.toLocaleString("en-IN")}
              </div>
              <small style={{ color: "#2563eb", fontWeight: "700" }}>
                ≈ ₹{costPerPersonPerDay.toLocaleString("en-IN")} / student / day
              </small>
            </div>
          </div>

          {/* VISUAL SIDE-BY-SIDE BUDGET COMPARISON CHART */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#059669", textTransform: "uppercase", letterSpacing: "1px" }}>
                  VISUAL SAVINGS VISUALIZER
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "2px 0 0" }}>
                  Standard Commercial vs. Subsidized Student Rates
                </h3>
              </div>
              <span style={{ background: "#dcfce7", color: "#166534", fontSize: "12px", fontWeight: "800", padding: "4px 10px", borderRadius: "20px" }}>
                Total Savings: ₹{savingAmount.toLocaleString("en-IN")} ({savingPercent}% Cheaper)
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* CATEGORY 1: STAY */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <strong style={{ color: "#334155" }}>🏨 Accommodation & Stay ({liveNights} Nights)</strong>
                  <span style={{ color: "#059669", fontWeight: "700" }}>Student ₹{hotelCost.toLocaleString("en-IN")} <span style={{ color: "#94a3b8", textDecoration: "line-through", fontSize: "12px" }}>₹{commercialStayCost.toLocaleString("en-IN")}</span></span>
                </div>
                <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "6px", overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${Math.min(100, Math.round((hotelCost / commercialStayCost) * 100))}%`, background: "linear-gradient(90deg, #10b981, #059669)", borderRadius: "6px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  <span>Backpacker Dorm / Shared Homestay</span>
                  <span style={{ color: "#16a34a", fontWeight: "600" }}>Save ₹{(commercialStayCost - hotelCost).toLocaleString("en-IN")} ({Math.round(((commercialStayCost - hotelCost) / commercialStayCost) * 100)}% off)</span>
                </div>
              </div>

              {/* CATEGORY 2: TRAVEL */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <strong style={{ color: "#334155" }}>🚆 Intercity & Local Travel (Round-Trip)</strong>
                  <span style={{ color: "#059669", fontWeight: "700" }}>Student ₹{travelCost.toLocaleString("en-IN")} <span style={{ color: "#94a3b8", textDecoration: "line-through", fontSize: "12px" }}>₹{commercialTravelCost.toLocaleString("en-IN")}</span></span>
                </div>
                <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "6px", overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${Math.min(100, Math.round((travelCost / commercialTravelCost) * 100))}%`, background: "linear-gradient(90deg, #3b82f6, #2563eb)", borderRadius: "6px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  <span>IRCTC 50% Concession + Student Metro</span>
                  <span style={{ color: "#2563eb", fontWeight: "600" }}>Save ₹{(commercialTravelCost - travelCost).toLocaleString("en-IN")} ({Math.round(((commercialTravelCost - travelCost) / commercialTravelCost) * 100)}% off)</span>
                </div>
              </div>

              {/* CATEGORY 3: FOOD */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <strong style={{ color: "#334155" }}>🍱 Food & Dining ({liveDays} Days)</strong>
                  <span style={{ color: "#059669", fontWeight: "700" }}>Student ₹{foodCost.toLocaleString("en-IN")} <span style={{ color: "#94a3b8", textDecoration: "line-through", fontSize: "12px" }}>₹{commercialFoodCost.toLocaleString("en-IN")}</span></span>
                </div>
                <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "6px", overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${Math.min(100, Math.round((foodCost / commercialFoodCost) * 100))}%`, background: "linear-gradient(90deg, #f59e0b, #d97706)", borderRadius: "6px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  <span>Campus Mess, Student Dhabas & Canteens</span>
                  <span style={{ color: "#d97706", fontWeight: "600" }}>Save ₹{(commercialFoodCost - foodCost).toLocaleString("en-IN")} ({Math.round(((commercialFoodCost - foodCost) / commercialFoodCost) * 100)}% off)</span>
                </div>
              </div>

              {/* CATEGORY 4: SIGHTSEEING */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <strong style={{ color: "#334155" }}>🏛️ Monuments & Entry Passes</strong>
                  <span style={{ color: "#059669", fontWeight: "700" }}>Student ₹{miscCost.toLocaleString("en-IN")} <span style={{ color: "#94a3b8", textDecoration: "line-through", fontSize: "12px" }}>₹{commercialMiscCost.toLocaleString("en-IN")}</span></span>
                </div>
                <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "6px", overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${Math.min(100, Math.round((miscCost / commercialMiscCost) * 100))}%`, background: "linear-gradient(90deg, #8b5cf6, #7c3aed)", borderRadius: "6px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  <span>ASI Heritage Card 50% Concession / Free Passes</span>
                  <span style={{ color: "#7c3aed", fontWeight: "600" }}>Save ₹{(commercialMiscCost - miscCost).toLocaleString("en-IN")} ({Math.round(((commercialMiscCost - miscCost) / commercialMiscCost) * 100)}% off)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ITEMIZED BUDGET BREAKDOWN TABLE */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px" }}>
              📋 Transparent Student Expense Breakdown
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "6px" }}>
                <span style={{ color: "#334155" }}>🏨 Accommodation ({liveNights}N • {selectedStay.label}):</span>
                <strong>₹{hotelCost.toLocaleString("en-IN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "6px" }}>
                <span style={{ color: "#334155" }}>🚆 Intercity Travel ({selectedTravel.label}):</span>
                <strong>₹{intercityTravelCost.toLocaleString("en-IN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "6px" }}>
                <span style={{ color: "#334155" }}>🚕 Local Transit (Shared Autos, Cycles, Student Metro @ ₹110/d):</span>
                <strong>₹{localTransitCost.toLocaleString("en-IN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "6px" }}>
                <span style={{ color: "#334155" }}>🍽️ Student Food & Canteen Mess (~₹200/d/student):</span>
                <strong>₹{foodCost.toLocaleString("en-IN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "6px" }}>
                <span style={{ color: "#334155" }}>🎟️ Museum & Monument Tickets (50% Student Concession @ ₹60/d):</span>
                <strong>₹{miscCost.toLocaleString("en-IN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", paddingBottom: "6px" }}>
                <span style={{ color: "#0284c7" }}>🛡️ Student Emergency Safety Buffer (5% Reserve):</span>
                <strong style={{ color: "#0284c7" }}>₹{studentBuffer.toLocaleString("en-IN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "6px", fontSize: "15px", fontWeight: "800" }}>
                <span style={{ color: "#0f172a" }}>Total Package Payable:</span>
                <strong style={{ color: "#16a34a" }}>₹{totalCost.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            {/* ACTION CHECKOUT CTA */}
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                ⚡ Lock with 25% Token Advance (<strong>₹{studentAdvanceCost.toLocaleString("en-IN")}</strong> now, balance upon arrival)
              </div>
              <button
                type="button"
                onClick={handleOpenStudentCheckout}
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  fontWeight: "800",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Proceed to Pay (₹{studentPayableNow.toLocaleString("en-IN")}) ➔
              </button>
            </div>
          </div>
        </section>

        <section className="student-only-plan-itinerary">
          <div className="student-only-plan-heading">
            <span>STUDENT-FRIENDLY ITINERARY</span>
            <h2>{days}-Day College Trip Plan</h2>
            <p>
              A practical day-by-day plan made specially for students and
              college groups.
            </p>
          </div>

          <div className="student-only-plan-days">
            {itinerary.map((item) => (
              <article className="student-only-plan-day" key={item.day}>
                <div className="student-only-plan-day-number">
                  <span>DAY</span>
                  <strong>{item.day}</strong>
                </div>

                <div className="student-only-plan-day-icon">{item.icon}</div>

                <div className="student-only-plan-day-content">
                  <span>
                    {item.day === 1
                      ? "ARRIVAL & START"
                      : item.day === days
                        ? "FINAL DAY"
                        : "EXPLORE & ENJOY"}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.rating && <small>⭐ {item.rating}</small>}
                </div>

                <div className="student-only-plan-day-cost">
                  <span>DAILY STUDENT ESTIMATE</span>
                  <strong>
                    ₹
                    {(
                      dailyCosts[item.day - 1]?.total || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                  <small>group / day</small>

                  <div className="student-only-plan-day-cost-details">
                    <span>
                      Travel ₹
                      {(
                        dailyCosts[item.day - 1]?.travel || 0
                      ).toLocaleString("en-IN")}
                    </span>

                    <span>
                      Food ₹
                      {(
                        dailyCosts[item.day - 1]?.food || 0
                      ).toLocaleString("en-IN")}
                    </span>

                    {dailyCosts[item.day - 1]?.hotel > 0 && (
                      <span>
                        Stay ₹
                        {(
                          dailyCosts[item.day - 1]?.hotel || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    )}

                    <span>
                      Misc ₹
                      {(
                        dailyCosts[item.day - 1]?.misc || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="student-only-plan-cost-section">
          <div className="student-only-plan-heading">
            <span>SIMPLE COST BREAKDOWN</span>
            <h2>Student Trip Expenses</h2>
          </div>

          <div className="student-only-plan-cost-grid">
            <div className="student-only-plan-cost-card">
              <span>🚌</span>
              <section>
                <small>TRAVEL</small>
                <strong>₹{travelCost.toLocaleString("en-IN")}</strong>
              </section>
            </div>

            <div className="student-only-plan-cost-card">
              <span>🍱</span>
              <section>
                <small>FOOD</small>
                <strong>₹{foodCost.toLocaleString("en-IN")}</strong>
              </section>
            </div>

            <div className="student-only-plan-cost-card">
              <span>🏨</span>
              <section>
                <small>STAY</small>
                <strong>₹{hotelCost.toLocaleString("en-IN")}</strong>
              </section>
            </div>

            <div className="student-only-plan-cost-card">
              <span>🎒</span>
              <section>
                <small>MISCELLANEOUS</small>
                <strong>₹{miscCost.toLocaleString("en-IN")}</strong>
              </section>
            </div>
          </div>
        </section>

        <section className="student-only-plan-rules">
          <div className="student-only-plan-heading">
            <span>MADE FOR COLLEGE STUDENTS</span>
            <h2>How this plan saves money</h2>
          </div>

          <div className="student-only-plan-rules-grid">
            <div>
              <span>🚌</span>
              <h3>Shared Travel</h3>
              <p>Prefer group travel and affordable local transport.</p>
            </div>

            <div>
              <span>🍱</span>
              <h3>Local Food</h3>
              <p>Choose affordable local food and student-friendly cafés.</p>
            </div>

            <div>
              <span>🏨</span>
              <h3>Shared Rooms</h3>
              <p>Sharing rooms helps reduce the accommodation cost.</p>
            </div>

            <div>
              <span>🎒</span>
              <h3>Smart Spending</h3>
              <p>Avoid unnecessary expenses and keep some emergency money.</p>
            </div>
          </div>
        </section>

        <section className="student-plan-confirm-action">
          <div>
            <span>READY TO BOOK YOUR STUDENT TRIP?</span>
            <h2>Confirm this Student Plan</h2>
            <p>
              Confirm this affordable student version of your existing trip
              and save the plan as your student trip booking.
            </p>
          </div>

          <button
            type="button"
            className="confirm-student-plan-button"
            onClick={handleOpenStudentCheckout}
            style={{ cursor: "pointer", border: "none" }}
          >
            🎓 Confirm Student Plan (Proceed to Pay) →
          </button>
        </section>

        <section className="student-only-plan-final">
          <div>
            <span>🎓 STUDENT TRAVEL GURUJI</span>
            <h2>Same trip. Smarter student budget.</h2>
            <p>
              A student-focused version of your existing travel plan for
              college groups.
            </p>
          </div>

          <Link to={tripPlanUrl} className="student-only-plan-back">
            ← Back to My Trip
          </Link>
        </section>
      </section>

      {/* STUDENT CHECKOUT MODAL */}
      {isStudentModalOpen && (
        <div className="hotel-modal-backdrop" onClick={() => setIsStudentModalOpen(false)}>
          <div className="hotel-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
            <div className="hotel-modal-header">
              <div className="hotel-modal-badge">[STUDENT GROUP RESERVATION]</div>
              <button
                type="button"
                className="hotel-modal-close-btn"
                onClick={() => setIsStudentModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
              <h2>Confirm Student Tour Package</h2>
              <p className="hotel-modal-subtitle">
                {days} Days in <strong>{destinationName}</strong> • {persons} Student(s)
              </p>
            </div>

            <div className="hotel-modal-summary">
              <div className="hotel-modal-summary-item">
                <span>Destination</span>
                <strong>📍 {destinationName}</strong>
              </div>
              <div className="hotel-modal-summary-item">
                <span>College Group Savings</span>
                <strong style={{ color: "#16a34a" }}>₹{savingAmount > 0 ? savingAmount.toLocaleString("en-IN") : "Best Rate"}</strong>
              </div>
              <div className="hotel-modal-summary-item highlight">
                <span>Package Total</span>
                <strong className="price-tag">₹{totalCost.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            {studentBookingError && (
              <div className="hotel-modal-error">⚠️ {studentBookingError}</div>
            )}

            {/* Payment plan selector */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "8px" }}>
                STUDENT PAYMENT PLAN
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div
                  style={{
                    border: `1.5px solid ${studentPaymentPlan === "INSTALLMENT_ADVANCE" ? "#0284c7" : "#cbd5e1"}`,
                    background: studentPaymentPlan === "INSTALLMENT_ADVANCE" ? "#f0f9ff" : "#ffffff",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setStudentPaymentPlan("INSTALLMENT_ADVANCE")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "12px", color: "#0c2340" }}>Student Token (25%)</strong>
                    <span style={{ fontSize: "9px", fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "1px 5px", borderRadius: "4px" }}>Recommended</span>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#0c2340" }}>
                    ₹{studentAdvanceCost.toLocaleString("en-IN")} <small style={{ fontSize: "11px", color: "#64748b" }}>now</small>
                  </div>
                  <p style={{ fontSize: "10px", color: "#64748b", margin: "4px 0 0" }}>
                    Lock student beds & transit now. Pay balance ₹{studentRemainingCost.toLocaleString("en-IN")} upon campus departure.
                  </p>
                </div>

                <div
                  style={{
                    border: `1.5px solid ${studentPaymentPlan === "FULL" ? "#0284c7" : "#cbd5e1"}`,
                    background: studentPaymentPlan === "FULL" ? "#f0f9ff" : "#ffffff",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setStudentPaymentPlan("FULL")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "12px", color: "#0c2340" }}>Full 100% Payment</strong>
                    <span style={{ fontSize: "9px", fontWeight: 700, background: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: "4px" }}>Complete</span>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#0c2340" }}>
                    ₹{totalCost.toLocaleString("en-IN")} <small style={{ fontSize: "11px", color: "#64748b" }}>now</small>
                  </div>
                  <p style={{ fontSize: "10px", color: "#64748b", margin: "4px 0 0" }}>
                    One-time complete settlement for the entire student group.
                  </p>
                </div>
              </div>
            </div>

            {/* Student details form */}
            <form onSubmit={handleStudentProceedToPay} className="hotel-modal-form">
              <div className="hotel-modal-form-group">
                <label htmlFor="stu-lead-name">Lead Student Full Name *</label>
                <input
                  id="stu-lead-name"
                  type="text"
                  required
                  placeholder="e.g. Rohit Deshmukh"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              <div className="hotel-modal-form-group">
                <label htmlFor="stu-college-id">College / University Name (or Student ID)</label>
                <input
                  id="stu-college-id"
                  type="text"
                  placeholder="e.g. Delhi University / IIT / St. Xavier's"
                  value={studentCollegeId}
                  onChange={(e) => setStudentCollegeId(e.target.value)}
                />
              </div>

              <div className="hotel-modal-form-row">
                <div className="hotel-modal-form-group">
                  <label htmlFor="stu-email">Student Email Address *</label>
                  <input
                    id="stu-email"
                    type="email"
                    required
                    placeholder="e.g. rohit@student.edu"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                </div>
                <div className="hotel-modal-form-group">
                  <label htmlFor="stu-phone">Mobile Phone</label>
                  <input
                    id="stu-phone"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="hotel-modal-submit-btn"
                disabled={studentBookingLoading}
              >
                {studentBookingLoading ? "Processing..." : `Proceed to Pay (₹${studentPayableNow.toLocaleString("en-IN")}) ➔`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Universal Razorpay Modal for Student Plan */}
      {isRazorpayModalOpen && (
        <RazorpayPaymentModal
          isOpen={isRazorpayModalOpen}
          onClose={() => setIsRazorpayModalOpen(false)}
          onPaymentSuccess={handleStudentPaymentSuccess}
          totalAmount={totalCost}
          bookingTitle={`Student Tour: ${destinationName}`}
          bookingSubtitle={`${persons} Student(s) • ${studentPaymentPlan === "INSTALLMENT_ADVANCE" ? "25% Token Advance" : "Full Payment"}`}
          bookingType="StudentPlan"
          guestInfo={{
            name: studentName,
            email: studentEmail,
            phone: studentPhone,
          }}
          allowInstallment={true}
          defaultPlan={studentPaymentPlan}
          advancePercentage={studentAdvancePercentage}
        />
      )}
    </main>
  );
}

function StudentPlanWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <StudentPlan />
    </ErrorBoundary>
  );
}

export default StudentPlanWithErrorBoundary;
