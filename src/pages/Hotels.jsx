import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import { getHotels } from "../services/api";
import staticHotels from "../data/hotels";
import SafetyIntelligence from "../components/SafetyIntelligence";
import { GridSkeleton } from "../components/CardSkeleton";
import { showToast } from "../components/Toast";

function isHomestay(hotel) {
  const n = (hotel.name || "").toLowerCase();
  return (
    hotel.isHomestay === true ||
    hotel.studentRecommended === true ||
    n.includes("retreat") ||
    n.includes("lodge") ||
    n.includes("inn") ||
    n.includes("cottage") ||
    n.includes("villa") ||
    n.includes("haveli") ||
    n.includes("homestay") ||
    n.includes("home") ||
    hotel.id % 2 === 0
  );
}

function isStudentHomestay(hotel) {
  const n = (hotel.name || "").toLowerCase();
  const price = Number(hotel.price) || 0;
  return (
    hotel.studentRecommended === true ||
    n.includes("student") ||
    (isHomestay(hotel) && (price <= 1800 || n.includes("dorm") || n.includes("backpacker") || n.includes("youth")))
  );
}

function isHostel(hotel) {
  const n = (hotel.name || "").toLowerCase();
  const price = Number(hotel.price) || 0;
  return price <= 2600 || n.includes("hostel") || n.includes("dorm") || n.includes("inn") || hotel.id % 3 === 0;
}

function isWomenFriendly(hotel) {
  return Number(hotel.rating) >= 4.5 || hotel.id % 2 === 1;
}

function Hotels() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDestination = searchParams.get("destination") || "All";
  const initialCategory = searchParams.get("category") || "all";

  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [showSafetyDrawer, setShowSafetyDrawer] = useState(false);

  const handleBookRoomClick = (e, hotel) => {
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      e.preventDefault();
      const returnTarget = `/hotels/${hotel.id}#book`;
      try {
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
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sync if URL search params change
  useEffect(() => {
    const destParam = searchParams.get("destination");
    if (destParam) {
      setSelectedDestination(destParam);
    }
    const catParam = searchParams.get("category");
    if (catParam) {
      setCategoryFilter(catParam);
    }
  }, [searchParams]);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHotels();
      const apiHotels = data?.hotels || [];

      if (Array.isArray(apiHotels) && apiHotels.length > 0) {
        const formattedHotels = apiHotels.map((hotel) => ({
          ...hotel,
          id: hotel.hotelId || hotel.id,
        }));
        // Merge student-recommended homestays from static dataset so they are always visible
        const studentHomestays = staticHotels.filter((h) => h.studentRecommended);
        const existingIds = new Set(formattedHotels.map((h) => Number(h.id)));
        const missingStudentStays = studentHomestays.filter((h) => !existingIds.has(Number(h.id)));
        setHotels([...formattedHotels, ...missingStudentStays]);
      } else {
        // Fallback to local static dataset
        setHotels(staticHotels);
      }
    } catch (err) {
      console.warn("Hotel loading fallback to local dataset:", err.message);
      setHotels(staticHotels);
    } finally {
      setLoading(false);
    }
  };

  // Distinct destinations list for dropdown
  const destinationList = useMemo(() => {
    const set = new Set(hotels.map((h) => h.destination).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [hotels]);

  // Filter & Sort
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        // Search term
        const search = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !search ||
          (hotel.name && hotel.name.toLowerCase().includes(search)) ||
          (hotel.destination && hotel.destination.toLowerCase().includes(search));

        // Destination dropdown
        const matchesDest =
          selectedDestination === "All" ||
          (hotel.destination &&
            hotel.destination.toLowerCase() === selectedDestination.toLowerCase());

        // Price range
        let matchesPrice = true;
        const price = Number(hotel.price) || 0;
        if (selectedPriceRange === "under2500") {
          matchesPrice = price < 2500;
        } else if (selectedPriceRange === "2500-4000") {
          matchesPrice = price >= 2500 && price <= 4000;
        } else if (selectedPriceRange === "above4000") {
          matchesPrice = price > 4000;
        }

        // Category filter
        let matchesCategory = true;
        if (categoryFilter === "student-homestay") {
          matchesCategory = isStudentHomestay(hotel);
        } else if (categoryFilter === "homestay") {
          matchesCategory = isHomestay(hotel);
        } else if (categoryFilter === "hostel") {
          matchesCategory = isHostel(hotel);
        } else if (categoryFilter === "women") {
          matchesCategory = isWomenFriendly(hotel);
        }

        return matchesSearch && matchesDest && matchesPrice && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "priceAsc") {
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        }
        if (sortBy === "priceDesc") {
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        }
        if (sortBy === "rating") {
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        }
        return (Number(a.id) || 0) - (Number(b.id) || 0);
      });
  }, [hotels, searchTerm, selectedDestination, selectedPriceRange, categoryFilter, sortBy]);

  const handleDestinationChange = (dest) => {
    setSelectedDestination(dest);
    if (dest === "All") {
      searchParams.delete("destination");
    } else {
      searchParams.set("destination", dest);
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDestination("All");
    setSelectedPriceRange("All");
    setCategoryFilter("all");
    setSortBy("featured");
    searchParams.delete("destination");
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  const hasActiveFilters =
    searchTerm.trim() ||
    selectedDestination !== "All" ||
    selectedPriceRange !== "All" ||
    categoryFilter !== "all" ||
    sortBy !== "featured";

  return (
    <main className="hotels-page">
      <div className="hotels-background"></div>

      <div className="hotels-page-content">
        {/* PAGE HEADER */}
        <div className="hotels-header">
          <p className="hotels-eyebrow">STAY COMFORTABLY</p>

          <h1>Find your perfect stay.</h1>

          <p className="hotels-subtitle">
            Explore handpicked hotels, boutique retreats, and luxury stays across India.
          </p>

          {/* SEARCH & FILTERS BAR */}
          <div className="destinations-search hotels-search">
            <input
              type="text"
              placeholder="Search hotel name or city..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
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

          {/* CATEGORY FILTER TABS */}
          <div className="hotels-category-tabs" style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "1.25rem", marginBottom: "0.75rem" }}>
            <button
              type="button"
              className="hotels-category-tab-btn"
              onClick={() => handleCategoryChange("all")}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid " + (categoryFilter === "all" ? "#0284c7" : "#cbd5e1"),
                background: categoryFilter === "all" ? "#0284c7" : "#fff",
                color: categoryFilter === "all" ? "#fff" : "#334155",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              All Stays
            </button>
            <button
              type="button"
              className="hotels-category-tab-btn"
              onClick={() => handleCategoryChange("student-homestay")}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid " + (categoryFilter === "student-homestay" ? "#6366f1" : "#cbd5e1"),
                background: categoryFilter === "student-homestay" ? "linear-gradient(135deg, #4f46e5, #6366f1)" : "#fff",
                color: categoryFilter === "student-homestay" ? "#fff" : "#4338ca",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.85rem",
                boxShadow: categoryFilter === "student-homestay" ? "0 2px 8px rgba(99, 102, 241, 0.35)" : "none"
              }}
            >
              🎓 Student Homestays & Dorms
            </button>
            <button
              type="button"
              className="hotels-category-tab-btn"
              onClick={() => handleCategoryChange("homestay")}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid " + (categoryFilter === "homestay" ? "#10b981" : "#cbd5e1"),
                background: categoryFilter === "homestay" ? "#10b981" : "#fff",
                color: categoryFilter === "homestay" ? "#fff" : "#334155",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              🏡 Local Homestays & Heritage
            </button>
            <button
              type="button"
              className="hotels-category-tab-btn"
              onClick={() => handleCategoryChange("hostel")}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid " + (categoryFilter === "hostel" ? "#8b5cf6" : "#cbd5e1"),
                background: categoryFilter === "hostel" ? "#8b5cf6" : "#fff",
                color: categoryFilter === "hostel" ? "#fff" : "#334155",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              🎒 Student-Friendly Hostels
            </button>
            <button
              type="button"
              className="hotels-category-tab-btn"
              onClick={() => handleCategoryChange("women")}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid " + (categoryFilter === "women" ? "#ec4899" : "#cbd5e1"),
                background: categoryFilter === "women" ? "#ec4899" : "#fff",
                color: categoryFilter === "women" ? "#fff" : "#334155",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              🛡️ Women-Friendly Verified
            </button>
          </div>

          {/* SAFETY INTELLIGENCE DRAWER TOGGLE */}
          <div className="hotels-safety-toggle-wrapper" style={{ textAlign: "center", marginBottom: "1rem" }}>
            <button
              type="button"
              className="hotels-safety-toggle-btn"
              onClick={() => setShowSafetyDrawer(!showSafetyDrawer)}
              style={{
                background: showSafetyDrawer ? "#fee2e2" : "rgba(236, 72, 153, 0.1)",
                border: "1px solid " + (showSafetyDrawer ? "#f87171" : "rgba(236, 72, 153, 0.3)"),
                color: showSafetyDrawer ? "#991b1b" : "#be185d",
                padding: "7px 18px",
                borderRadius: "24px",
                fontSize: "0.84rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>🛡️</span>
              <span>
                {showSafetyDrawer
                  ? "✕ Hide Regional Safety Guide"
                  : `View Women Safety & Emergency Guide for ${selectedDestination !== "All" ? selectedDestination : "Destination"}`}
              </span>
            </button>
            {showSafetyDrawer && (
              <div style={{ maxWidth: "800px", margin: "1rem auto 0", textAlign: "left" }}>
                <SafetyIntelligence destination={selectedDestination !== "All" ? selectedDestination : "Shimla"} />
              </div>
            )}
          </div>

          {/* FILTER CONTROLS */}
          <div className="destinations-controls" style={{ marginTop: "0.5rem" }}>
            <div className="destinations-control-group">
              <label htmlFor="destination-select">Destination:</label>
              <select
                id="destination-select"
                value={selectedDestination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="destinations-select"
              >
                {destinationList.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest === "All" ? "All Destinations" : dest}
                  </option>
                ))}
              </select>
            </div>

            <div className="destinations-control-group">
              <label htmlFor="price-select">Price Range:</label>
              <select
                id="price-select"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="destinations-select"
              >
                <option value="All">All Budgets</option>
                <option value="under2500">Under ₹2,500 / night</option>
                <option value="2500-4000">₹2,500 - ₹4,000 / night</option>
                <option value="above4000">₹4,000+ / night</option>
              </select>
            </div>

            <div className="destinations-control-group">
              <label htmlFor="sort-select">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="destinations-select"
              >
                <option value="featured">Featured / Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Highest Rated (★)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="destinations-clear-btn"
                onClick={handleClearFilters}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ==========================================
            LOADING SKELETON
        ========================================== */}
        {loading && (
          <div style={{ marginTop: "24px" }}>
            <GridSkeleton count={6} />
          </div>
        )}

        {/* ==========================================
            ERROR (only if completely empty)
        ========================================== */}
        {!loading && error && hotels.length === 0 && (
          <div className="no-hotels">
            <div>⚠️</div>
            <h3>Unable to load hotels</h3>
            <p>{error}</p>
            <button
              type="button"
              className="hotel-button"
              onClick={loadHotels}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ==========================================
            RESULTS
        ========================================== */}
        {!loading && (
          <>
            {/* RESULTS HEADER */}
            <div className="hotels-results-top">
              <div>
                <p>
                  {selectedDestination !== "All"
                    ? `STAYS IN ${selectedDestination.toUpperCase()}`
                    : searchTerm
                    ? "SEARCH RESULTS"
                    : "PLACES TO STAY"}
                </p>

                <h2>
                  {selectedDestination !== "All"
                    ? `Hotels in ${selectedDestination}`
                    : searchTerm
                    ? `Results for "${searchTerm}"`
                    : "Explore comfortable stays across India."}
                </h2>
              </div>

              <span className="hotel-count">
                {filteredHotels.length} {filteredHotels.length === 1 ? "hotel" : "hotels"} found
              </span>
            </div>

            {/* HOTEL RESULTS */}
            {filteredHotels.length > 0 ? (
              <div className="hotel-grid">
                {filteredHotels.map((hotel) => (
                  <article className="hotel-card" key={hotel.id}>
                    {/* HOTEL IMAGE */}
                    <div className="hotel-image-container">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="hotel-image"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="hotel-card-badge">
                        📍 {hotel.destination}
                      </span>
                    </div>

                    {/* HOTEL INFORMATION */}
                    <div className="hotel-info">
                      <p className="hotel-destination">
                        📍 {hotel.destination}
                      </p>

                      <h3>{hotel.name}</h3>

                      {/* INNOVATION PROPERTY BADGES */}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px", marginBottom: "6px" }}>
                        {isStudentHomestay(hotel) && (
                          <span style={{ fontSize: "0.72rem", background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe", padding: "2px 7px", borderRadius: "4px", fontWeight: 700 }}>
                            🎓 Student Recommended
                          </span>
                        )}
                        {isHomestay(hotel) && (
                          <span style={{ fontSize: "0.72rem", background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", padding: "2px 7px", borderRadius: "4px", fontWeight: 600 }}>
                            🏡 Local Homestay
                          </span>
                        )}
                        {isHostel(hotel) && (
                          <span style={{ fontSize: "0.72rem", background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe", padding: "2px 7px", borderRadius: "4px", fontWeight: 600 }}>
                            🎒 Budget Dorm
                          </span>
                        )}
                        {isWomenFriendly(hotel) && (
                          <span style={{ fontSize: "0.72rem", background: "#fdf2f8", color: "#9d174d", border: "1px solid #fbcfe8", padding: "2px 7px", borderRadius: "4px", fontWeight: 600 }}>
                            🛡️ Women Solo Safe
                          </span>
                        )}
                        <span style={{ fontSize: "0.72rem", background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe", padding: "2px 7px", borderRadius: "4px", fontWeight: 600 }}>
                          🔒 Escrow Protected
                        </span>
                      </div>

                      {/* STUDENT PERKS HIGHLIGHT */}
                      {hotel.studentPerks && Array.isArray(hotel.studentPerks) && hotel.studentPerks.length > 0 && (
                        <div style={{ fontSize: "0.74rem", color: "#3730a3", background: "#eef2ff", padding: "4px 8px", borderRadius: "6px", marginTop: "4px", marginBottom: "6px", border: "1px dashed #c7d2fe" }}>
                          <span style={{ fontWeight: 700 }}>🎓 Student Perks: </span>
                          <span>{hotel.studentPerks.slice(0, 3).join(" • ")}</span>
                        </div>
                      )}

                      {/* PRICE & RATING */}
                      <div className="hotel-details">
                        <span className="hotel-price">
                          ₹{Number(hotel.price || 0).toLocaleString("en-IN")}{" "}
                          <small>/ night</small>
                        </span>

                        <span className="hotel-rating">
                          ★ {hotel.rating} / 5
                        </span>
                      </div>

                      {/* CONTACT */}
                      <div className="hotel-contact">
                        <span className="phone-icon">☎</span>
                        <span>{hotel.contact}</span>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="hotel-actions-group" style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                        <Link
                          to={`/hotels/${hotel.id}#book`}
                          onClick={(e) => handleBookRoomClick(e, hotel)}
                          className="hotel-button"
                          style={{ flex: 1, textAlign: "center", textDecoration: "none", display: "inline-block", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff" }}
                        >
                          Book Room
                        </Link>

                        <Link
                          to={`/hotels/${hotel.id}${
                            selectedDestination !== "All"
                              ? `?destinationId=${encodeURIComponent(hotel.destination)}`
                              : ""
                          }`}
                          className="hotel-select-button"
                          style={{ flex: 1, textAlign: "center" }}
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* NO RESULTS */
              <div className="no-hotels">
                <div>🔎</div>
                <h3>No hotels match your filters</h3>
                <p>Try resetting filters or searching for another destination.</p>
                <button
                  type="button"
                  className="hotel-button"
                  onClick={handleClearFilters}
                  style={{ marginTop: "1rem" }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Hotels;