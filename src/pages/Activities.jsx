import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import destinations from "../data/destinations";
import { createBooking } from "../services/bookingApi";
import { getActiveDisasterAlerts } from "../services/emergencyApi";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";
import { showToast } from "../components/Toast";

const activities = [
  {
    category: "Water Activities",
    icon: "🌊",
    activities: [
      {
        name: "River Rafting",
        icon: "🚣",
        places: ["Rishikesh", "Manali", "Kasol"],
        price: 1400,
        duration: "3 Hours",
        difficulty: "Moderate",
        description: "Exhilarating white water rapid descent with safety gear and trained river guides.",
      },
      {
        name: "Scuba Diving",
        icon: "🤿",
        places: ["Goa", "Digha", "Puri"],
        price: 3800,
        duration: "2 Hours",
        difficulty: "Easy to Moderate",
        description: "Explore vibrant coral reefs and marine life with PADI-certified dive masters.",
      },
      {
        name: "Snorkeling",
        icon: "🤿",
        places: ["Goa", "Digha", "Puri"],
        price: 1500,
        duration: "1.5 Hours",
        difficulty: "Easy",
        description: "Surface reef viewing in crystal-clear waters with mask, snorkel, and safety jacket.",
      },
      {
        name: "Backwater Houseboating",
        icon: "🛶",
        places: ["Srinagar"],
        price: 4500,
        duration: "4 Hours",
        difficulty: "Relaxed",
        description: "Peaceful cruise on Dal Lake / backwaters with traditional refreshments.",
      },
      {
        name: "Surfing & Paddleboarding",
        icon: "🏄",
        places: ["Goa", "Puri"],
        price: 1800,
        duration: "2 Hours",
        difficulty: "Moderate",
        description: "Catch waves with expert surf instructors and top-quality surfboards.",
      },
      {
        name: "Jet Skiing",
        icon: "🚤",
        places: ["Goa", "Digha", "Puri"],
        price: 950,
        duration: "20 Mins",
        difficulty: "Easy",
        description: "High-speed personal watercraft ride with professional pilot guidance.",
      },
      {
        name: "Kayaking",
        icon: "🛶",
        places: ["Rishikesh", "Dawki", "Srinagar"],
        price: 850,
        duration: "1.5 Hours",
        difficulty: "Easy",
        description: "Glide through calm emerald waters with paddle and lightweight kayak.",
      },
    ],
  },
  {
    category: "Air Activities",
    icon: "🪂",
    activities: [
      {
        name: "Paragliding",
        icon: "🪂",
        places: ["Manali", "Shimla"],
        price: 2600,
        duration: "30 Mins",
        difficulty: "High Thrill",
        description: "Tandem flight over picturesque valleys with licensed pilot and Go-Pro video.",
      },
      {
        name: "Hot Air Ballooning",
        icon: "🎈",
        places: ["Jaipur"],
        price: 8500,
        duration: "1 Hour",
        difficulty: "Scenic & Calm",
        description: "Sunrise aerial vistas over historic forts, palaces, and Aravali hills.",
      },
      {
        name: "Parasailing",
        icon: "🪂",
        places: ["Goa", "Digha", "Puri"],
        price: 1250,
        duration: "20 Mins",
        difficulty: "Moderate",
        description: "Speedboat-towed canopy ascension offering panoramic ocean vistas.",
      },
      {
        name: "Skydiving",
        icon: "🪂",
        places: ["Manali"],
        price: 18500,
        duration: "3 Hours",
        difficulty: "Extreme Thrill",
        description: "10,000 ft tandem jump with USPA-certified instructors and certificate.",
      },
      {
        name: "Ziplining",
        icon: "🧗",
        places: ["Manali", "Shimla", "Rishikesh"],
        price: 1100,
        duration: "45 Mins",
        difficulty: "Moderate",
        description: "Fly across deep river gorges on high-tension steel cable harnesses.",
      },
    ],
  },
  {
    category: "Land & Mountain Activities",
    icon: "🏔️",
    activities: [
      {
        name: "Alpine Trekking",
        icon: "🥾",
        places: ["Manali", "Kasol", "Chitkul", "Kalpa", "Kaza", "Chandratal Lake"],
        price: 1800,
        duration: "Full Day",
        difficulty: "Challenging",
        description: "Guided mountain trek with trail guides, trekking poles, and packed lunch.",
      },
      {
        name: "Wildlife Safari",
        icon: "🐅",
        places: ["Jaipur", "Pahalgam"],
        price: 2200,
        duration: "4 Hours",
        difficulty: "All Ages",
        description: "Open 4x4 Gypsy jungle safari tracking tigers, leopards, and rare fauna.",
      },
      {
        name: "Stargazing & Camping",
        icon: "⛺",
        places: ["Chandratal Lake", "Kasol", "Jaisalmer"],
        price: 2100,
        duration: "Overnight",
        difficulty: "Relaxed",
        description: "Alpine dome tent stay with telescope stargazing, bonfire, and warm dinner.",
      },
      {
        name: "Bungee Jumping",
        icon: "🪢",
        places: ["Rishikesh"],
        price: 3600,
        duration: "1 Hour",
        difficulty: "Extreme",
        description: "India's highest 83m cantilever platform jump over Hall river with video.",
      },
      {
        name: "Snow Skiing & Boarding",
        icon: "⛷️",
        places: ["Gulmarg", "Manali", "Rohtang Pass"],
        price: 2900,
        duration: "2.5 Hours",
        difficulty: "Moderate",
        description: "Ski equipment rental, boots, poles, and personalized slope instruction.",
      },
      {
        name: "Desert ATV Quad Biking",
        icon: "🏎️",
        places: ["Jaisalmer", "Jaipur"],
        price: 1350,
        duration: "30 Mins",
        difficulty: "Thrill",
        description: "Navigate golden sand dunes on high-powered 4-wheel all-terrain quads.",
      },
    ],
  },
  {
    category: "Cultural & Spiritual",
    icon: "🏛️",
    activities: [
      {
        name: "Ganga Aarti Boat Experience",
        icon: "🪔",
        places: ["Varanasi", "Rishikesh"],
        price: 550,
        duration: "2 Hours",
        difficulty: "Spiritual",
        description: "Front-row boat seating for evening grand prayer ceremonies with floating diyas.",
      },
      {
        name: "Heritage Walking Tour",
        icon: "🧭",
        places: ["Jaipur", "Delhi", "Agra", "Varanasi"],
        price: 750,
        duration: "2.5 Hours",
        difficulty: "Easy Walk",
        description: "Explore hidden bazaars, historic alleys, and culinary gems with an expert historian.",
      },
      {
        name: "Yoga & Meditation Retreat",
        icon: "🧘",
        places: ["Rishikesh", "Dharamsala"],
        price: 850,
        duration: "2 Hours",
        difficulty: "Wellness",
        description: "Traditional Hatha yoga, pranayama, and guided mindfulness meditation session.",
      },
    ],
  },
];

function getDefaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
}

function Activities() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Booking modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(getDefaultDate());
  const [selectedSlot, setSelectedSlot] = useState("09:30 AM (Morning)");
  const [ticketsCount, setTicketsCount] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [disasterAlertsMap, setDisasterAlertsMap] = useState({});

  // Prefill logged-in user if available & load disaster alerts
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

    async function loadAlerts() {
      try {
        const res = await getActiveDisasterAlerts();
        if (res && Array.isArray(res.alerts)) {
          const map = {};
          res.alerts.forEach((a) => {
            if (a.destination) {
              map[a.destination.toLowerCase().trim()] = a;
            }
          });
          setDisasterAlertsMap(map);
        }
      } catch (err) {
        console.warn("Could not load disaster alerts for activities:", err);
      }
    }
    loadAlerts();
  }, []);

  // Restore activity draft & reopen booking modal after login
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("travelGurujiActivityDraft");
      if (saved) {
        const draft = JSON.parse(saved);
        for (const cat of activities) {
          const found = cat.activities.find((a) => a.name === draft.activityName);
          if (found) {
            setSelectedActivity(found);
            setSelectedLocation(draft.selectedLocation || found.places?.[0] || "India");
            if (draft.selectedDate) setSelectedDate(draft.selectedDate);
            if (draft.selectedSlot) setSelectedSlot(draft.selectedSlot);
            if (draft.ticketsCount) setTicketsCount(draft.ticketsCount);
            setIsModalOpen(true);
            break;
          }
        }
        sessionStorage.removeItem("travelGurujiActivityDraft");
      }
    } catch {
      // Ignore
    }
  }, []);

  const filteredActivities = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return activities;

    return activities
      .map((cat) => ({
        ...cat,
        activities: cat.activities.filter(
          (act) =>
            act.name.toLowerCase().includes(search) ||
            cat.category.toLowerCase().includes(search) ||
            act.places.some((p) => p.toLowerCase().includes(search))
        ),
      }))
      .filter((cat) => cat.activities.length > 0);
  }, [searchTerm]);

  const totalActivities = useMemo(() => {
    return filteredActivities.reduce((acc, cat) => acc + cat.activities.length, 0);
  }, [filteredActivities]);

  const saveActivityDraftAndRedirect = (act, defaultPlace = "") => {
    const returnTarget = "/activities";
    try {
      sessionStorage.setItem(
        "travelGurujiActivityDraft",
        JSON.stringify({
          activityName: act?.name,
          categoryName: act?.category,
          defaultPlace,
          selectedLocation: defaultPlace || act?.places?.[0] || "India",
          selectedDate,
          selectedSlot,
          ticketsCount,
        })
      );
      sessionStorage.setItem("travelGurujiReturnTo", returnTarget);
    } catch {
      // Ignore
    }

    showToast("Please do login before booking an activity experience.", "warning", 5000);
    navigate("/login", {
      state: {
        returnTo: returnTarget,
        action: "book",
        message: "Please do login before booking an activity experience.",
      },
    });
  };

  const handleOpenBooking = (act, defaultPlace = "") => {
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      saveActivityDraftAndRedirect(act, defaultPlace);
      return;
    }

    setSelectedActivity(act);
    setSelectedLocation(defaultPlace || act.places[0] || "India");
    setSelectedDate(getDefaultDate());
    setSelectedSlot("09:30 AM (Morning)");
    setTicketsCount(1);
    setBookingError("");
    setConfirmedBooking(null);
    setIsModalOpen(true);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      if (selectedActivity) {
        saveActivityDraftAndRedirect(selectedActivity, selectedLocation);
      }
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setBookingError("Please provide guest full name and email.");
      return;
    }
    setBookingError("");
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setBookingLoading(true);
      setBookingError("");
      setIsRazorpayOpen(false);

      const baseAmount = selectedActivity.price * ticketsCount;
      const gstAmount = Math.round(baseAmount * 0.05);
      const grandTotal = baseAmount + gstAmount;

      const payload = {
        itemType: "Activity",
        activityDetails: {
          activityName: selectedActivity.name,
          category: selectedActivity.category || "Experience",
          location: selectedLocation,
          date: selectedDate,
          timeSlot: selectedSlot,
          ticketsCount,
        },
        guestDetails: {
          fullName: guestName.trim(),
          email: guestEmail.trim(),
          phone: guestPhone.trim(),
        },
        totalAmount: grandTotal,
        currency: "INR",
        paymentStatus: "Paid",
        paymentPlan: "FULL",
        amountPaid: grandTotal,
        remainingBalance: 0,
        razorpayOrderId: paymentData?.orderId,
        razorpayPaymentId: paymentData?.paymentId,
        paymentMethod: paymentData?.paymentMethod || "Razorpay Verified",
        installmentNote: "100% full pass settlement.",
        isDemoMode: true,
        cancellationPolicy: "Free cancellation up to 24 hours prior to activity slot.",
      };

      const result = await createBooking(payload);
      if (result.booking) {
        setConfirmedBooking(result.booking);
      } else {
        throw new Error("Unable to confirm activity booking.");
      }
    } catch (err) {
      console.error("Activity booking error:", err);
      setBookingError(err.message || "Failed to confirm experience pass.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main className="activities-page">
      <div className="activities-background"></div>

      <div className="activities-page-content">
        {/* PAGE HEADER */}
        <section className="activities-header">
          <p className="activities-eyebrow">CURATED EXPERIENCES</p>
          <h1>Activities & Adventures in India</h1>
          <p className="activities-subtitle">
            From river rafting in Rishikesh to paragliding in Manali, book verified outdoor adventures and cultural tours.
          </p>

          {/* SEARCH BAR */}
          <div className="destinations-search activities-search">
            <input
              type="text"
              placeholder="Search rafting, paragliding, trekking, Rishikesh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                className="home-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                title="Clear search"
              >
                ×
              </button>
            )}

            <button type="button">Search</button>
          </div>
        </section>

        {/* RESULTS SECTION */}
        <section className="activities-results">
          <div className="activities-results-top">
            <div>
              <p>
                {searchTerm ? "SEARCH RESULTS" : "DISCOVER EXPERIENCES"}
              </p>
              <h2>
                {searchTerm
                  ? `Results for "${searchTerm}"`
                  : "Explore activities across India."}
              </h2>
            </div>
            <span className="activity-count">{totalActivities} activities</span>
          </div>

          {filteredActivities.length > 0 ? (
            filteredActivities.map((category) => (
              <div className="activity-category" key={category.category}>
                <div className="activity-category-header">
                  <div className="activity-category-title">
                    <span className="activity-category-icon">{category.icon}</span>
                    <div>
                      <h2>{category.category}</h2>
                    </div>
                  </div>
                </div>

                <div className="activity-grid">
                  {category.activities.map((activity) => (
                    <article className="activity-card" key={activity.name}>
                      <div className="activity-card-top">
                        <div className="activity-icon">{activity.icon}</div>
                        <div>
                          <h3>{activity.name}</h3>
                          <span className="activity-meta-badge">
                            ⏱️ {activity.duration} • {activity.difficulty}
                          </span>
                        </div>
                      </div>

                      <p className="activity-description-text">
                        {activity.description}
                      </p>

                      <div className="activity-price-row">
                        <span className="activity-price-val">
                          ₹{activity.price.toLocaleString("en-IN")}{" "}
                          <small>/ person</small>
                        </span>

                        <button
                          type="button"
                          className="activity-book-btn"
                          onClick={() => handleOpenBooking(activity)}
                        >
                          Book Slot
                        </button>
                      </div>

                      <p className="activity-places-title">Available in:</p>
                      <div className="activity-places">
                        {activity.places.map((place) => {
                          const destination = destinations.find(
                            (item) => item.name === place
                          );
                          const placeAlert = disasterAlertsMap[place.toLowerCase().trim()];
                          const statusIcon =
                            placeAlert?.alertTier === "RED"
                              ? "🔴"
                              : placeAlert?.alertTier === "YELLOW"
                              ? "🟡"
                              : placeAlert?.isRainAlert
                              ? "🌧️"
                              : "🟢";

                          if (!destination) {
                            return (
                              <button
                                key={place}
                                type="button"
                                className="activity-place"
                                onClick={() => handleOpenBooking(activity, place)}
                                title={`Book ${activity.name} in ${place}`}
                              >
                                <span>📍 {place} {statusIcon}</span>
                              </button>
                            );
                          }

                          return (
                            <Link
                              key={place}
                              to={`/destinations/${destination.id}?source=activities`}
                              className="activity-place"
                              title={`Explore ${place} (${statusIcon === "🔴" ? "Disaster Zone" : statusIcon === "🟡" ? "Advisory" : "Open"})`}
                            >
                              <span>📍 {place} {statusIcon}</span>
                              <span className="activity-place-arrow">→</span>
                            </Link>
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-activities">
              <div>🔎</div>
              <h3>No activities found</h3>
              <p>Try searching for another activity, activity type or destination.</p>
            </div>
          )}
        </section>
      </div>

      {/* ===================================================
          INSTANT ACTIVITY BOOKING MODAL
          =================================================== */}
      {isModalOpen && selectedActivity && (
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

            {!confirmedBooking ? (
              <div className="hotel-modal-content">
                <div className="hotel-modal-header">
                  <div className="hotel-modal-badge">[PASS RESERVATION]</div>
                  <h2>Book {selectedActivity.name}</h2>
                  <p>Guaranteed slot reservation with licensed instructors & safety gear.</p>
                </div>

                <div className="hotel-modal-summary-box">
                  <div className="hotel-modal-summary-item">
                    <span>Experience</span>
                    <strong>{selectedActivity.name}</strong>
                  </div>
                  <div className="hotel-modal-summary-item">
                    <span>Duration & Level</span>
                    <strong>{selectedActivity.duration} • {selectedActivity.difficulty}</strong>
                  </div>
                  <div className="hotel-modal-summary-item">
                    <span>Rate</span>
                    <strong>₹{selectedActivity.price.toLocaleString("en-IN")} per ticket</strong>
                  </div>
                  <div className="hotel-modal-summary-item highlight">
                    <span>Total Fare ({ticketsCount} {ticketsCount === 1 ? "ticket" : "tickets"} + 5% GST)</span>
                    <strong className="price-tag">
                      ₹
                      {(
                        selectedActivity.price * ticketsCount +
                        Math.round(selectedActivity.price * ticketsCount * 0.05)
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                {bookingError && (
                  <div className="hotel-modal-error">⚠️ {bookingError}</div>
                )}

                {(() => {
                  const selectedPlaceAlert = disasterAlertsMap[selectedLocation?.toLowerCase()?.trim()];
                  const isSuspended = selectedPlaceAlert?.alertTier === "RED" || selectedPlaceAlert?.isDisasterZone;

                  return (
                    <>
                      {/* REAL-TIME SAFETY ADVISORY / SUSPENSION BANNER IN MODAL */}
                      {isSuspended && (
                        <div
                          style={{
                            background: "#fef2f2",
                            border: "1.5px solid #ef4444",
                            borderLeft: "5px solid #dc2626",
                            borderRadius: "10px",
                            padding: "12px 16px",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span style={{ fontSize: "24px" }}>🚫</span>
                          <div>
                            <strong style={{ color: "#991b1b", fontSize: "13px", display: "block" }}>
                              Activity Suspended in {selectedLocation} (Active Disaster Zone)
                            </strong>
                            <span style={{ color: "#7f1d1d", fontSize: "12px" }}>
                              Due to real-time disaster conditions ({selectedPlaceAlert?.title || "Routes Suspended"}), adventure and outdoor bookings in {selectedLocation} are paused under tourist safety protocols.
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedPlaceAlert?.alertTier === "YELLOW" && (
                        <div
                          style={{
                            background: "#fffbeb",
                            border: "1px solid #fde68a",
                            borderLeft: "4px solid #f59e0b",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>⚠️</span>
                          <div>
                            <strong style={{ color: "#92400e", fontSize: "12.5px", display: "block" }}>
                              Weather & Terrain Advisory in {selectedLocation}
                            </strong>
                            <span style={{ color: "#78350f", fontSize: "11.5px" }}>
                              Activity operational under caution ({selectedPlaceAlert?.movementStatus}). Instructor safety guidance mandatory.
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedPlaceAlert?.isRainAlert && (
                        <div
                          style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>🌧️</span>
                          <span style={{ color: "#065f46", fontSize: "11.5px", fontWeight: "600" }}>
                            <strong>Rain Alert:</strong> Standard showers in {selectedLocation}. Activity is 100% operational with weather gear.
                          </span>
                        </div>
                      )}

                      <form onSubmit={handleProceedToPayment} className="hotel-modal-form">
                        <div className="hotel-modal-form-row">
                          <div className="hotel-modal-form-group">
                            <label htmlFor="activity-location">Select City / Location *</label>
                            <select
                              id="activity-location"
                              value={selectedLocation}
                              onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                              {selectedActivity.places.map((p) => {
                                const pAlert = disasterAlertsMap[p.toLowerCase().trim()];
                                const tag =
                                  pAlert?.alertTier === "RED"
                                    ? "🔴 [Suspended - Disaster Zone]"
                                    : pAlert?.alertTier === "YELLOW"
                                    ? "🟡 [Caution Advisory]"
                                    : pAlert?.isRainAlert
                                    ? "🌧️ [Rain Alert]"
                                    : "🟢 [Open & Clear]";
                                return (
                                  <option key={p} value={p}>
                                    📍 {p} {tag}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                    <div className="hotel-modal-form-group">
                      <label htmlFor="activity-date">Activity Date *</label>
                      <input
                        id="activity-date"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="hotel-modal-form-row">
                    <div className="hotel-modal-form-group">
                      <label htmlFor="activity-slot">Preferred Time Slot *</label>
                      <select
                        id="activity-slot"
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                      >
                        <option value="07:00 AM (Early Sunrise)">07:00 AM (Early Sunrise)</option>
                        <option value="09:30 AM (Morning)">09:30 AM (Morning)</option>
                        <option value="12:30 PM (Mid-day)">12:30 PM (Mid-day)</option>
                        <option value="03:30 PM (Afternoon)">03:30 PM (Afternoon)</option>
                        <option value="05:00 PM (Sunset)">05:00 PM (Sunset)</option>
                      </select>
                    </div>

                    <div className="hotel-modal-form-group">
                      <label htmlFor="activity-tickets">Participants</label>
                      <select
                        id="activity-tickets"
                        value={ticketsCount}
                        onChange={(e) => setTicketsCount(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "Person" : "Persons"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="hotel-modal-form-group">
                    <label htmlFor="guest-full-name">Lead Guest Name *</label>
                    <input
                      id="guest-full-name"
                      type="text"
                      required
                      placeholder="e.g. Ananya Sen"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                  </div>

                  <div className="hotel-modal-form-row">
                    <div className="hotel-modal-form-group">
                      <label htmlFor="guest-email-act">Email Address *</label>
                      <input
                        id="guest-email-act"
                        type="email"
                        required
                        placeholder="e.g. ananya@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                      />
                    </div>

                    <div className="hotel-modal-form-group">
                      <label htmlFor="guest-phone-act">Phone Number</label>
                      <input
                        id="guest-phone-act"
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="hotel-modal-terms-notice">
                    <span>
                      🛡️ <strong>Instant Reservation:</strong> A confirmed Activity Pass reference will be generated and saved to your account.
                    </span>
                    <span>✓ Free cancellation up to 24 hours before your slot.</span>
                  </div>

                  <button
                    type="submit"
                    className="hotel-modal-submit-btn"
                    disabled={bookingLoading || isSuspended}
                    style={isSuspended ? { background: "#94a3b8", cursor: "not-allowed", opacity: 0.85 } : {}}
                  >
                    {isSuspended
                      ? `🚫 Suspended in ${selectedLocation} (Disaster Zone)`
                      : bookingLoading
                      ? "Processing..."
                      : `Proceed to Pay (₹${(
                          selectedActivity.price * ticketsCount +
                          Math.round(selectedActivity.price * ticketsCount * 0.05)
                        ).toLocaleString("en-IN")}) ➔`}
                  </button>
                </form>
              </>
            );
          })()}
        </div>
            ) : (
              // CONFIRMATION SCREEN
              <div className="hotel-modal-success">
                <div className="hotel-success-icon">✓</div>
                <div className="hotel-modal-badge">[RESERVATION CONFIRMED]</div>
                <h2>Experience Pass Confirmed!</h2>
                <p>
                  Your pass for <strong>{selectedActivity.name}</strong> is reserved.
                </p>

                <div className="hotel-confirmation-card">
                  <div className="hotel-conf-row">
                    <span>Booking Reference</span>
                    <strong className="booking-ref-code">
                      {confirmedBooking.bookingReference}
                    </strong>
                  </div>
                  {confirmedBooking.razorpayPaymentId && (
                    <div className="hotel-conf-row">
                      <span>Razorpay Payment ID</span>
                      <strong style={{ color: "#0284c7", fontFamily: "monospace" }}>
                        {confirmedBooking.razorpayPaymentId}
                      </strong>
                    </div>
                  )}
                  <div className="hotel-conf-row">
                    <span>Activity</span>
                    <strong>{selectedActivity.name}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Location</span>
                    <strong>{selectedLocation}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Date & Time</span>
                    <strong>{selectedDate} at {selectedSlot}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Participants</span>
                    <strong>{ticketsCount} {ticketsCount === 1 ? "Person" : "Persons"}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Amount Paid</span>
                    <strong className="price-tag">
                      ₹{Number(confirmedBooking.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Payment Status</span>
                    <span className="hotel-status-pill confirmed">● Paid via Razorpay</span>
                  </div>
                </div>

                <div className="hotel-confirmation-actions">
                  <Link
                    to={`/planner?destination=${encodeURIComponent(selectedLocation)}`}
                    className="hotel-button"
                    style={{ textDecoration: "none", textAlign: "center" }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    🧳 Plan Trip to {selectedLocation}
                  </Link>

                  <button
                    type="button"
                    className="hotel-detail-back-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Universal Razorpay Payment Modal for Activities */}
      {isRazorpayOpen && selectedActivity && (
        <RazorpayPaymentModal
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          totalAmount={
            selectedActivity.price * ticketsCount +
            Math.round(selectedActivity.price * ticketsCount * 0.05)
          }
          bookingTitle={selectedActivity.name}
          bookingSubtitle={`${selectedLocation} • ${ticketsCount} Ticket(s) • ${selectedDate}`}
          bookingType="Activity"
          guestInfo={{
            name: guestName,
            email: guestEmail,
            phone: guestPhone,
          }}
          allowInstallment={false}
          defaultPlan="FULL"
        />
      )}
    </main>
  );
}

export { activities };
export default Activities;