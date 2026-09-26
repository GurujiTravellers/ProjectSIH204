import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";

import { getHotels, getHotelById } from "../services/api";
import staticHotels from "../data/hotels";
import { createBooking } from "../services/bookingApi";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";
import { showToast } from "../components/Toast";

// ==========================================
// DESTINATION GROUPS
// ==========================================

const coldDestinations = new Set([
  "Shimla",
  "Manali",
  "Rohtang Pass",
  "Kasol",
  "Chitkul",
  "Kalpa",
  "Sissu",
  "Kaza",
  "Chandratal Lake",
  "Mussoorie",
  "Srinagar",
  "Gulmarg",
  "Pahalgam",
  "Darjeeling",
]);

const desertDestinations = new Set([
  "Jaipur",
  "Jaisalmer",
  "Ajmer",
  "Delhi",
  "Agra",
  "Varanasi",
]);

const coastalDestinations = new Set(["Digha", "Puri", "Konark", "Goa"]);

const greenDestinations = new Set([
  "Rishikesh",
  "Dehradun",
  "Shillong",
  "Mawlynnong Village",
  "Dawki",
]);

// ==========================================
// COMMON FACILITIES
// ==========================================

const commonFacilities = [
  ["📶", "Free Wi-Fi"],
  ["🍽️", "In-house Restaurant"],
  ["🛎️", "24-hour Front Desk"],
  ["🚗", "Parking"],
  ["🧹", "Daily Housekeeping"],
  ["📺", "Smart TV"],
  ["☕", "Tea & Coffee Service"],
  ["🧳", "Luggage Storage"],
];

const coldFacilities = [
  ["🚿", "Warm Water Geyser"],
  ["🔥", "Room Heater"],
  ["🛏️", "Warm Blankets"],
  ["🪵", "Fireplace Lounge"],
  ["☕", "Hot Beverage Corner"],
  ["🧤", "Winter Accessories"],
];

const desertFacilities = [
  ["❄️", "Air Conditioning"],
  ["🏊", "Swimming Pool"],
  ["🌴", "Shaded Courtyard"],
  ["💧", "Cooling Water Station"],
  ["🧴", "Cooling Amenities"],
  ["🌬️", "Ventilated Rooms"],
];

const coastalFacilities = [
  ["❄️", "Air Conditioning"],
  ["🏊", "Swimming Pool"],
  ["🏖️", "Beach Shuttle"],
  ["🌊", "Sea-view Seating"],
  ["🚿", "Hot & Cold Shower"],
  ["🍹", "Poolside Refreshments"],
];

const greenFacilities = [
  ["🌿", "Garden Area"],
  ["🧘", "Yoga / Wellness Space"],
  ["🌄", "Scenic View Deck"],
  ["🔥", "Outdoor Bonfire"],
  ["🚲", "Bicycle Access"],
  ["🌧️", "Rain Shelter"],
];

const heritageFacilities = [
  ["🏛️", "Heritage Courtyard"],
  ["🧭", "Local Guide Assistance"],
  ["🍛", "Regional Cuisine"],
  ["🛍️", "Local Shopping Assistance"],
  ["🎭", "Cultural Evening"],
  ["📸", "Heritage Photo Corner"],
];

function getDestinationFacilities(destination) {
  if (coldDestinations.has(destination)) return coldFacilities;
  if (coastalDestinations.has(destination)) return coastalFacilities;
  if (desertDestinations.has(destination)) return desertFacilities;
  if (greenDestinations.has(destination)) return greenFacilities;
  return heritageFacilities;
}

function buildHotelProfile(hotel) {
  const rooms = 28 + ((hotel.id * 19) % 173);

  const basePrice = Number(hotel.price) || 2500;
  const roomTypes = [
    {
      name: "Standard Room",
      multiplier: 1.0,
      price: basePrice,
      features: "1 Queen Bed • City/Courtyard View • Free Wi-Fi • En-suite Bathroom",
      maxGuests: "2 Guests",
    },
    {
      name: "Deluxe Mountain/View Room",
      multiplier: 1.25,
      price: Math.round(basePrice * 1.25),
      features: "1 King Bed • Scenic Balcony • Breakfast Included • Smart TV",
      maxGuests: "3 Guests",
    },
    {
      name: "Luxury Executive Suite",
      multiplier: 1.6,
      price: Math.round(basePrice * 1.6),
      features: "King Bed + Living Area • Panoramic View • Jacuzzi/Bathtub • All Meals Included",
      maxGuests: "4 Guests",
    },
  ];

  const destinationFacilities = getDestinationFacilities(hotel.destination);
  const rotatedFacilities = Array.from(
    { length: destinationFacilities.length },
    (_, offset) =>
      destinationFacilities[(hotel.id + offset) % destinationFacilities.length]
  );

  const facilities = [
    ...commonFacilities,
    ...rotatedFacilities,
  ]
    .filter(
      (facility, index, array) =>
        array.findIndex((item) => item[1] === facility[1]) === index
    )
    .slice(0, 7 + (hotel.id % 3));

  const reviewCount = 70 + ((hotel.id * 47) % 830);
  const email = `reservations${hotel.id}@travelguruji.in`;
  const whatsapp = (hotel.contact || "").replace(/\D/g, "");

  const description = coldDestinations.has(hotel.destination)
    ? `${hotel.name} is a comfortable mountain stay in ${hotel.destination}, designed for travelers who want a warm and relaxing base after exploring the hills. The property combines practical winter comforts with convenient access to local sightseeing and adventure experiences.`
    : coastalDestinations.has(hotel.destination)
    ? `${hotel.name} offers a relaxed coastal stay in ${hotel.destination}, with easy access to beaches, local food and sightseeing. It is designed for travelers who want a comfortable base for a warm-weather holiday.`
    : desertDestinations.has(hotel.destination)
    ? `${hotel.name} offers a comfortable city and heritage stay in ${hotel.destination}. It is suited to travelers exploring forts, markets, monuments and local culture, with cooling facilities that make warm-weather stays more comfortable.`
    : greenDestinations.has(hotel.destination)
    ? `${hotel.name} provides a calm stay in ${hotel.destination}, balancing comfortable rooms with nature-friendly facilities. It is a practical choice for travelers who want sightseeing, outdoor experiences and relaxation in one trip.`
    : `${hotel.name} is a comfortable stay in ${hotel.destination}, offering useful modern facilities for travelers exploring local attractions, food, heritage and culture.`;

  return {
    ...hotel,
    totalRooms: rooms,
    roomTypes,
    facilities,
    reviewCount,
    email,
    whatsapp,
    description,
  };
}

// Helpers for dates
function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getDayAfterTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
}

function HotelDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const bookingSectionRef = useRef(null);

  const [hotel, setHotel] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking state
  const [checkIn, setCheckIn] = useState(getTomorrowDate());
  const [checkOut, setCheckOut] = useState(getDayAfterTomorrowDate());
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Booking Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

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

  // Restore draft selection after login redirect
  useEffect(() => {
    if (!hotel) return;
    try {
      const saved = sessionStorage.getItem("travelGurujiHotelDraft");
      if (saved) {
        const draft = JSON.parse(saved);
        if (String(draft.hotelId) === String(hotel.id)) {
          if (draft.selectedRoomIndex !== undefined) setSelectedRoomIndex(draft.selectedRoomIndex);
          if (draft.checkIn) setCheckIn(draft.checkIn);
          if (draft.checkOut) setCheckOut(draft.checkOut);
          if (draft.roomsCount) setRoomsCount(draft.roomsCount);
          if (draft.adultsCount) setAdultsCount(draft.adultsCount);
          if (draft.childrenCount !== undefined) setChildrenCount(draft.childrenCount);
          if (draft.specialRequests) setSpecialRequests(draft.specialRequests);
          sessionStorage.removeItem("travelGurujiHotelDraft");
          setTimeout(() => {
            setIsModalOpen(true);
          }, 350);
        }
      }
    } catch {
      // Ignore
    }
  }, [hotel]);

  useEffect(() => {
    loadHotel();
  }, [id]);

  // Scroll to booking anchor if hash is #book
  useEffect(() => {
    if (window.location.hash === "#book" && bookingSectionRef.current) {
      setTimeout(() => {
        bookingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [hotel]);

  const loadHotel = async () => {
    try {
      setLoading(true);
      setError("");

      let currentHotel = null;

      try {
        const hotelData = await getHotelById(id);
        if (hotelData?.hotel) {
          const bh = hotelData.hotel;
          currentHotel = { ...bh, id: bh.hotelId || bh.id };
        }
      } catch (backendErr) {
        console.warn("Backend hotel fetch error, checking static data:", backendErr.message);
      }

      if (!currentHotel) {
        // Find in static dataset
        const match = staticHotels.find(
          (h) => String(h.id) === String(id) || String(h.hotelId) === String(id)
        );
        if (match) {
          currentHotel = match;
        }
      }

      if (!currentHotel) {
        throw new Error("Hotel not found with ID: " + id);
      }

      setHotel(currentHotel);

      // Load all hotels for previous / next navigation
      try {
        const allData = await getHotels();
        const allHotels = (allData.hotels || []).map((item) => ({
          ...item,
          id: item.hotelId || item.id,
        }));
        setHotels(allHotels.length > 0 ? allHotels : staticHotels);
      } catch {
        setHotels(staticHotels);
      }
    } catch (err) {
      console.error("Hotel details error:", err);
      setError(err.message || "Could not load hotel details.");
      setHotel(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const cin = new Date(checkIn);
    const cout = new Date(checkOut);
    const diff = Math.round((cout - cin) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  // Handle check-in change
  const handleCheckInChange = (newCin) => {
    setCheckIn(newCin);
    const cin = new Date(newCin);
    const cout = new Date(checkOut);
    if (cout <= cin) {
      const nextDay = new Date(cin);
      nextDay.setDate(cin.getDate() + 1);
      setCheckOut(nextDay.toISOString().split("T")[0]);
    }
  };

  if (loading) {
    return (
      <main className="hotel-detail-page">
        <div className="hotel-detail-shell">
          <div className="hotel-detail-not-found">
            <p className="hotel-detail-eyebrow">HOTEL DETAILS</p>
            <h1>Loading hotel...</h1>
            <p>Please wait while we load the hotel details.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !hotel) {
    return (
      <main className="hotel-detail-page">
        <div className="hotel-detail-shell">
          <div className="hotel-detail-not-found">
            <p className="hotel-detail-eyebrow">HOTEL NOT FOUND</p>
            <h1>We couldn't find this hotel.</h1>
            <p>{error || "Sorry, we could not find the hotel you are looking for."}</p>
            <Link to="/hotels" className="hotel-detail-back-button">
              Back to Hotels
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const profile = buildHotelProfile(hotel);
  const selectedRoom = profile.roomTypes[selectedRoomIndex] || profile.roomTypes[0];

  // Pricing calculations
  const pricePerNight = selectedRoom.price;
  const roomSubtotal = pricePerNight * nights * roomsCount;
  const gstTax = Math.round(roomSubtotal * 0.12);
  const grandTotal = roomSubtotal + gstTax;

  // Search context navigation
  const searchIds = searchParams
    .get("ids")
    ?.split(",")
    .map(Number)
    .filter(Number.isFinite);

  const isSearchContext =
    searchParams.get("source") === "search" && searchIds?.length > 0;
  const destinationId = searchParams.get("destinationId");
  const isDestinationContext =
    searchParams.get("source") === "destination" && destinationId;

  const navigationHotels = isSearchContext
    ? searchIds
        .map((hotelId) => hotels.find((item) => item.id === hotelId))
        .filter(Boolean)
    : hotels;

  const currentIndex = navigationHotels.findIndex((item) => item.id === hotel.id);
  const previousHotel = currentIndex > 0 ? navigationHotels[currentIndex - 1] : null;
  const nextHotel =
    currentIndex >= 0 && currentIndex < navigationHotels.length - 1
      ? navigationHotels[currentIndex + 1]
      : null;

  function hotelDetailsUrl(hotelId) {
    if (isDestinationContext) {
      return `/hotels/${hotelId}?source=destination&destinationId=${destinationId}`;
    }
    if (!isSearchContext) {
      return `/hotels/${hotelId}`;
    }
    return `/hotels/${hotelId}?source=search&ids=${navigationHotels.map((i) => i.id).join(",")}`;
  }

  const backUrl = isDestinationContext ? `/destinations/${destinationId}` : "/hotels";
  const backLabel = isDestinationContext ? `Back to ${hotel.destination}` : "Back to Hotels";
  const plannerUrl = `/planner?destination=${encodeURIComponent(hotel.destination)}&hotel=${encodeURIComponent(hotel.name)}`;

  const saveHotelDraftAndRedirectToLogin = () => {
    const returnTarget = window.location.pathname + window.location.search + "#book";
    try {
      sessionStorage.setItem(
        "travelGurujiHotelDraft",
        JSON.stringify({
          hotelId: hotel?.id,
          selectedRoomIndex,
          checkIn,
          checkOut,
          roomsCount,
          adultsCount,
          childrenCount,
          specialRequests,
        })
      );
      sessionStorage.setItem("travelGurujiReturnTo", returnTarget);
    } catch {
      // Ignore
    }

    showToast("Please do login before booking your hotel stay.", "warning", 5000);
    navigate("/login", {
      state: {
        returnTo: returnTarget,
        action: "book",
        message: "Please do login before booking your hotel stay.",
      },
    });
  };

  // Open Razorpay payment gateway on form submission
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      saveHotelDraftAndRedirectToLogin();
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setBookingError("Please provide both full name and email address.");
      return;
    }
    setBookingError("");
    setIsRazorpayOpen(true);
  };

  // Called when Razorpay transaction completes and verifies
  const handlePaymentSuccess = async (paymentData) => {
    try {
      setBookingLoading(true);
      setBookingError("");
      setIsRazorpayOpen(false);

      const hasRemaining = (paymentData?.remainingBalance || 0) > 0;

      const payload = {
        itemType: "Hotel",
        hotelDetails: {
          hotelId: hotel.id,
          name: hotel.name,
          destination: hotel.destination,
          roomType: selectedRoom.name,
          roomsCount,
          nights,
          pricePerNight,
          checkIn,
          checkOut,
          guests: {
            adults: adultsCount,
            children: childrenCount,
          },
        },
        guestDetails: {
          fullName: guestName.trim(),
          email: guestEmail.trim(),
          phone: guestPhone.trim(),
          specialRequests: specialRequests.trim(),
        },
        totalAmount: grandTotal,
        currency: "INR",
        paymentStatus: hasRemaining ? "Partially Paid" : "Paid",
        paymentPlan: paymentData?.paymentPlan || "PARTIAL_HOTEL",
        amountPaid: paymentData?.amountPaid || grandTotal,
        remainingBalance: paymentData?.remainingBalance || 0,
        razorpayOrderId: paymentData?.orderId,
        razorpayPaymentId: paymentData?.paymentId,
        paymentMethod: paymentData?.paymentMethod || "Razorpay Verified",
        installmentNote: paymentData?.installmentNote || "",
        isDemoMode: true,
        cancellationPolicy: "Free cancellation up to 24 hours before check-in.",
      };

      const result = await createBooking(payload);
      if (result.booking) {
        setConfirmedBooking(result.booking);
      } else {
        throw new Error("Unable to complete reservation.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError(err.message || "Failed to confirm reservation.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleOpenBookingModal = () => {
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      saveHotelDraftAndRedirectToLogin();
      return;
    }
    setBookingError("");
    setConfirmedBooking(null);
    setIsModalOpen(true);
  };

  return (
    <main className="hotel-detail-page">
      <div className="hotel-detail-background"></div>

      <div className="hotel-detail-shell">
        {/* ==================================
            HEADER
        ================================== */}
        <header className="hotel-detail-header">
          <p className="hotel-detail-eyebrow">HOTEL DETAILS</p>
          <h1>{hotel.name}</h1>
          <p className="hotel-detail-location">📍 {hotel.destination}</p>
        </header>

        {/* ==================================
            MAIN HOTEL HERO IMAGE
        ================================== */}
        <section className="hotel-detail-hero-card">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="hotel-detail-main-image"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="hotel-detail-hero-overlay">
            <div>
              <span className="hotel-detail-rating-badge">
                ★ {hotel.rating} / 5
              </span>
              <p>{profile.reviewCount} guest reviews</p>
            </div>
            <button
              type="button"
              className="hotel-detail-book-hero-btn"
              onClick={() => {
                bookingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              📅 Book Room Now
            </button>
          </div>
        </section>

        {/* ==================================
            DESCRIPTION + QUICK FACTS
        ================================== */}
        <section className="hotel-detail-intro-grid">
          <article className="hotel-detail-description-card">
            <p className="hotel-detail-section-label">ABOUT THE HOTEL</p>
            <h2>A stay designed around {hotel.destination}.</h2>
            <p>{profile.description}</p>
          </article>

          <article className="hotel-detail-facts-card">
            <div className="hotel-detail-fact">
              <span>Price</span>
              <strong>
                💰 ₹{Number(hotel.price || 0).toLocaleString("en-IN")} / night
              </strong>
            </div>

            <div className="hotel-detail-fact">
              <span>Rating</span>
              <strong>⭐ {hotel.rating} / 5</strong>
            </div>

            <div className="hotel-detail-fact">
              <span>Total rooms</span>
              <strong>🛏️ {profile.totalRooms}</strong>
            </div>

            <div className="hotel-detail-fact">
              <span>Room types</span>
              <strong>🛋️ {profile.roomTypes.length} options</strong>
            </div>
          </article>
        </section>

        {/* ==================================
            INTERACTIVE ROOM SELECTION & BOOKING ENGINE
        ================================== */}
        <section
          ref={bookingSectionRef}
          id="book"
          className="hotel-booking-engine-section"
        >
          <div className="hotel-booking-engine-header">
            <div>
              <span className="hotel-detail-section-label">ROOM RESERVATION</span>
              <h2>Select Room & Check-in Dates</h2>
              <p>Instant confirmation with transparent pricing and flexible cancellation.</p>
            </div>
            <div className="hotel-demo-badge">
              <span>🛡️ Sandbox Reservation</span>
              <small>No Real Card Charged</small>
            </div>
          </div>

          <div className="hotel-booking-grid">
            {/* ROOM SELECTION LIST */}
            <div className="hotel-rooms-selector">
              <h3>1. Choose Room Category</h3>
              <div className="hotel-room-options-list">
                {profile.roomTypes.map((room, index) => {
                  const isSelected = selectedRoomIndex === index;
                  return (
                    <div
                      key={room.name}
                      className={`hotel-room-option-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedRoomIndex(index)}
                    >
                      <div className="hotel-room-option-header">
                        <div className="hotel-room-radio">
                          <span className={`radio-dot ${isSelected ? "active" : ""}`}></span>
                          <strong>{room.name}</strong>
                        </div>
                        <span className="hotel-room-price">
                          ₹{room.price.toLocaleString("en-IN")}{" "}
                          <small>/ night</small>
                        </span>
                      </div>
                      <p className="hotel-room-features">{room.features}</p>
                      <div className="hotel-room-meta">
                        <span>👥 Up to {room.maxGuests}</span>
                        <span>☕ Free Breakfast</span>
                        <span>📶 High Speed Wi-Fi</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DATES & PRICE CALCULATOR CARD */}
            <div className="hotel-booking-summary-card">
              <h3>2. Stay Details & Pricing</h3>

              <div className="hotel-form-row">
                <div className="hotel-input-group">
                  <label htmlFor="checkin-date">Check-in Date</label>
                  <input
                    id="checkin-date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                  />
                </div>

                <div className="hotel-input-group">
                  <label htmlFor="checkout-date">Check-out Date</label>
                  <input
                    id="checkout-date"
                    type="date"
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              <div className="hotel-form-row hotel-counters-row">
                <div className="hotel-input-group">
                  <label htmlFor="rooms-count">Rooms</label>
                  <select
                    id="rooms-count"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Room" : "Rooms"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hotel-input-group">
                  <label htmlFor="adults-count">Adults</label>
                  <select
                    id="adults-count"
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Adult" : "Adults"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hotel-input-group">
                  <label htmlFor="children-count">Children</label>
                  <select
                    id="children-count"
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Child" : "Children"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRICE BREAKDOWN TABLE */}
              <div className="hotel-price-breakdown">
                <div className="hotel-breakdown-row">
                  <span>
                    {selectedRoom.name} ({nights} {nights === 1 ? "night" : "nights"} × {roomsCount} room)
                  </span>
                  <span>₹{roomSubtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="hotel-breakdown-row">
                  <span>Taxes & GST (12%)</span>
                  <span>₹{gstTax.toLocaleString("en-IN")}</span>
                </div>
                <div className="hotel-breakdown-divider"></div>
                <div className="hotel-breakdown-row total">
                  <strong>Total Amount Payable</strong>
                  <strong className="hotel-grand-total">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="hotel-cancellation-notice">
                <span>✓ Free cancellation up to 24 hours prior to check-in</span>
                <span>✓ Pay at property / Instant confirmation</span>
              </div>

              <button
                type="button"
                className="hotel-reserve-btn"
                onClick={handleOpenBookingModal}
              >
                Proceed to Reserve (₹{grandTotal.toLocaleString("en-IN")})
              </button>
            </div>
          </div>
        </section>

        {/* ==================================
            FACILITIES
        ================================== */}
        <section className="hotel-detail-section">
          <div className="hotel-detail-section-heading">
            <p className="hotel-detail-section-label">HOTEL FUNCTIONALITIES</p>
            <h2>Facilities available here.</h2>
            <span>Facilities tailored to {hotel.destination}.</span>
          </div>

          <div className="hotel-detail-facility-grid">
            {profile.facilities.map(([icon, name]) => (
              <article className="hotel-detail-facility-card" key={name}>
                <span className="hotel-detail-facility-icon">{icon}</span>
                <strong>{name}</strong>
                <small>Available at this property</small>
              </article>
            ))}
          </div>
        </section>

        {/* ==================================
            CONTACT
        ================================== */}
        <section className="hotel-detail-contact-card">
          <div>
            <p className="hotel-detail-section-label">CONTACT</p>
            <h2>Contact the hotel.</h2>
            <p>Use phone, WhatsApp or email for direct hotel inquiries.</p>
          </div>

          <div className="hotel-detail-contact-links">
            <a
              href={`tel:${(hotel.contact || "").replace(/\s/g, "")}`}
              className="hotel-detail-contact-item"
            >
              <span>☎️</span>
              <div>
                <strong>Phone</strong>
                <small>{hotel.contact}</small>
              </div>
            </a>

            <a
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hotel-detail-contact-item"
            >
              <span>💬</span>
              <div>
                <strong>WhatsApp</strong>
                <small>{hotel.contact}</small>
              </div>
            </a>

            <a
              href={`mailto:${profile.email}`}
              className="hotel-detail-contact-item"
            >
              <span>📧</span>
              <div>
                <strong>Email</strong>
                <small>{profile.email}</small>
              </div>
            </a>
          </div>
        </section>

        {/* ==================================
            PREVIOUS / BACK / SELECT / NEXT
        ================================== */}
        <section className="hotel-detail-actions">
          {previousHotel ? (
            <Link
              to={hotelDetailsUrl(previousHotel.id)}
              className="hotel-detail-previous-button"
            >
              ← Previous
              <span>{previousHotel.name}</span>
            </Link>
          ) : (
            <button
              type="button"
              className="hotel-detail-previous-button"
              disabled
            >
              ← Previous
              <span>First hotel</span>
            </button>
          )}

          <Link to={backUrl} className="hotel-detail-back-button">
            {backLabel}
          </Link>

          <Link to={plannerUrl} className="hotel-detail-select-button">
            🧳 Plan Trip with this Hotel
          </Link>

          {nextHotel ? (
            <Link
              to={hotelDetailsUrl(nextHotel.id)}
              className="hotel-detail-next-button"
            >
              Next →
              <span>{nextHotel.name}</span>
            </Link>
          ) : (
            <button
              type="button"
              className="hotel-detail-next-button"
              disabled
            >
              Next →
              <span>Last hotel</span>
            </button>
          )}
        </section>

        <p className="hotel-detail-navigation-note">
          {isSearchContext
            ? `Browsing ${navigationHotels.length} hotels from current search result.`
            : `Browsing all ${navigationHotels.length} stays.`}
        </p>
      </div>

      {/* ==================================
          INSTANT BOOKING MODAL
      ================================== */}
      {isModalOpen && (
        <div className="hotel-modal-overlay" onClick={() => !bookingLoading && setIsModalOpen(false)}>
          <div
            className="hotel-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL CLOSE BUTTON */}
            <button
              type="button"
              className="hotel-modal-close-btn"
              onClick={() => setIsModalOpen(false)}
              disabled={bookingLoading}
            >
              ✕
            </button>

            {!confirmedBooking ? (
              // BOOKING FORM
              <div className="hotel-modal-content">
                <div className="hotel-modal-header">
                  <div className="hotel-modal-badge">[HOTEL RESERVATION]</div>
                  <h2>Confirm Hotel Reservation</h2>
                  <p>Review your booking details and guest information.</p>
                </div>

                {/* TRIP SUMMARY SNIPPET */}
                <div className="hotel-modal-summary-box">
                  <div className="hotel-modal-summary-item">
                    <span>Property</span>
                    <strong>{hotel.name}</strong>
                  </div>
                  <div className="hotel-modal-summary-item">
                    <span>Room Type</span>
                    <strong>{selectedRoom.name}</strong>
                  </div>
                  <div className="hotel-modal-summary-item">
                    <span>Check-in / Out</span>
                    <strong>{checkIn} to {checkOut} ({nights} {nights === 1 ? "night" : "nights"})</strong>
                  </div>
                  <div className="hotel-modal-summary-item">
                    <span>Guests & Rooms</span>
                    <strong>{adultsCount} Adults{childrenCount > 0 ? `, ${childrenCount} Children` : ""}, {roomsCount} {roomsCount === 1 ? "Room" : "Rooms"}</strong>
                  </div>
                  <div className="hotel-modal-summary-item highlight">
                    <span>Total Amount</span>
                    <strong className="price-tag">₹{grandTotal.toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                {bookingError && (
                  <div className="hotel-modal-error">
                    ⚠️ {bookingError}
                  </div>
                )}

                <form onSubmit={handleProceedToPayment} className="hotel-modal-form">
                  <div className="hotel-modal-form-group">
                    <label htmlFor="guest-name">Primary Guest Full Name *</label>
                    <input
                      id="guest-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                  </div>

                  <div className="hotel-modal-form-row">
                    <div className="hotel-modal-form-group">
                      <label htmlFor="guest-email">Email Address *</label>
                      <input
                        id="guest-email"
                        type="email"
                        required
                        placeholder="e.g. rahul@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                      />
                    </div>

                    <div className="hotel-modal-form-group">
                      <label htmlFor="guest-phone">Phone Number</label>
                      <input
                        id="guest-phone"
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="hotel-modal-form-group">
                    <label htmlFor="special-requests">Special Requests (Optional)</label>
                    <input
                      id="special-requests"
                      type="text"
                      placeholder="e.g. High floor, quiet room, late check-in"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>

                  <div className="hotel-modal-terms-notice">
                    <span>ℹ️ <strong>Reservation Guarantee:</strong> Pay 25% advance token now to lock your room; pay remainder directly to hotel reception at check-in.</span>
                    <span>✓ Free cancellation up to 24 hours before check-in.</span>
                  </div>

                  <button
                    type="submit"
                    className="hotel-modal-submit-btn"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "Processing..." : `Proceed to Pay (₹${grandTotal.toLocaleString("en-IN")}) ➔`}
                  </button>
                </form>
              </div>
            ) : (
              // CONFIRMATION SUCCESS SCREEN
              <div className="hotel-modal-success">
                <div className="hotel-success-icon">✓</div>
                <div className="hotel-modal-badge">[RESERVATION CONFIRMED]</div>
                <h2>Reservation Confirmed!</h2>
                <p>Your room at <strong>{hotel.name}</strong> is successfully reserved.</p>

                <div className="hotel-confirmation-card">
                  <div className="hotel-conf-row">
                    <span>Booking Reference</span>
                    <strong className="booking-ref-code">{confirmedBooking.bookingReference}</strong>
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
                    <span>Guest Name</span>
                    <strong>{confirmedBooking.guestDetails?.fullName}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Room</span>
                    <strong>{confirmedBooking.hotelDetails?.roomType}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Check-in / Check-out</span>
                    <strong>{confirmedBooking.hotelDetails?.checkIn} → {confirmedBooking.hotelDetails?.checkOut}</strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Payment Plan</span>
                    <strong>
                      {confirmedBooking.paymentPlan === "PARTIAL_HOTEL"
                        ? "25% Advance Token (75% at Reception)"
                        : "Full 100% Payment"}
                    </strong>
                  </div>
                  <div className="hotel-conf-row">
                    <span>Amount Paid Now</span>
                    <strong className="price-tag">
                      ₹{Number(confirmedBooking.amountPaid || confirmedBooking.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  {confirmedBooking.remainingBalance > 0 && (
                    <div className="hotel-conf-row" style={{ background: "#fef3c7", padding: "8px 12px", borderRadius: "8px" }}>
                      <span style={{ color: "#92400e", fontWeight: 700 }}>Due at Hotel Check-in</span>
                      <strong style={{ color: "#b45309" }}>
                        ₹{Number(confirmedBooking.remainingBalance).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  )}
                  <div className="hotel-conf-row">
                    <span>Status</span>
                    <span className="hotel-status-pill confirmed">● {confirmedBooking.paymentStatus || "Confirmed"}</span>
                  </div>
                </div>

                <div className="hotel-confirmation-actions">
                  <Link
                    to={plannerUrl}
                    className="hotel-button"
                    style={{ textDecoration: "none", textAlign: "center" }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    🧳 Plan Itinerary with this Hotel
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

      {/* Universal Razorpay Payment Modal */}
      {isRazorpayOpen && (
        <RazorpayPaymentModal
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          totalAmount={grandTotal}
          bookingTitle={hotel.name}
          bookingSubtitle={`${selectedRoom.name} • ${nights} Night(s) • ${roomsCount} Room(s)`}
          bookingType="Hotel"
          guestInfo={{
            name: guestName,
            email: guestEmail,
            phone: guestPhone,
          }}
          allowInstallment={true}
          defaultPlan="PARTIAL_HOTEL"
          advancePercentage={25}
        />
      )}
    </main>
  );
}

export default HotelDetails;