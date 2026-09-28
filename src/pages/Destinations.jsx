import { useEffect, useMemo, useState } from "react";
import DestinationCard from "../components/DestinationCard";
import { GridSkeleton } from "../components/CardSkeleton";
import { getDestinations } from "../services/api";
import { getActiveDisasterAlerts } from "../services/emergencyApi";
import { useRealtimeDisaster } from "../context/RealtimeDisasterContext";
import staticDestinations from "../data/destinations";

const CATEGORIES = [
  "All",
  "Hill Station",
  "Spiritual",
  "Beach",
  "Heritage",
  "Nature",
  "Adventure",
];

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedSafety, setSelectedSafety] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [disasterAlertsMap, setDisasterAlertsMap] = useState({});
  const { destinations: liveSyncedDestinations } = useRealtimeDisaster();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Continuously sync destination alerts from realtime database
  useEffect(() => {
    if (liveSyncedDestinations && liveSyncedDestinations.length > 0) {
      const map = {};
      liveSyncedDestinations.forEach((d) => {
        if (d.name) {
          map[d.name.toLowerCase().trim()] = {
            alertTier: d.disaster?.alertTier,
            severity: d.disaster?.severity,
            badgeLabel: d.disaster?.badgeLabel,
            title: d.disaster?.title,
            movementStatus: d.disaster?.movementStatus,
            colorCode: d.disaster?.colorCode,
            hazardType: d.disaster?.hazardType,
          };
        }
      });
      setDisasterAlertsMap(map);
    }
  }, [liveSyncedDestinations]);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDestinations();

      const apiList = data?.destinations || data?.data || [];

      if (Array.isArray(apiList) && apiList.length > 0) {
        const formattedDestinations = apiList.map((destination) => ({
          ...destination,
          id: destination.destinationId || destination.id,
        }));
        setDestinations(formattedDestinations);
      } else {
        // Fallback to rich static destinations dataset
        setDestinations(staticDestinations);
      }
    } catch (err) {
      console.warn(
        "Backend destinations fetch failed, using local dataset:",
        err.message
      );
      // Graceful offline fallback
      setDestinations(staticDestinations);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique states for dropdown
  const availableStates = useMemo(() => {
    const states = new Set();
    destinations.forEach((d) => {
      if (d.state) states.add(d.state);
    });
    return ["All", ...Array.from(states).sort()];
  }, [destinations]);

  // Filtering and Sorting
  const filteredDestinations = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return destinations
      .filter((destination) => {
        const matchesSearch =
          !search ||
          destination.name.toLowerCase().includes(search) ||
          destination.state.toLowerCase().includes(search) ||
          destination.category.toLowerCase().includes(search) ||
          (destination.description &&
            destination.description.toLowerCase().includes(search));

        const matchesCategory =
          selectedCategory === "All" ||
          (destination.category &&
            destination.category
              .toLowerCase()
              .includes(selectedCategory.toLowerCase()));

        const matchesState =
          selectedState === "All" ||
          (destination.state &&
            destination.state.toLowerCase() === selectedState.toLowerCase());

        const matchesSafety = () => {
          if (selectedSafety === "All") return true;
          const info = disasterAlertsMap[destination.name.toLowerCase().trim()];
          const tier = info?.alertTier || "GREEN";
          if (selectedSafety === "DISASTER") return tier === "RED" || info?.isDisasterZone;
          if (selectedSafety === "ADVISORY") return tier === "YELLOW" || info?.isModerateAdvisory;
          if (selectedSafety === "RAIN") return !!info?.isRainAlert;
          if (selectedSafety === "CLEAR") return (tier === "GREEN" && !info?.isRainAlert) || !info;
          return true;
        };

        return matchesSearch && matchesCategory && matchesState && matchesSafety();
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return (a.id || 0) - (b.id || 0);
      });
  }, [destinations, searchTerm, selectedCategory, selectedState, selectedSafety, sortBy, disasterAlertsMap]);

  return (
    <main className="destinations-page">
      <div className="destinations-background"></div>

      <div className="destinations-page-content">
        {/* PAGE HEADER */}
        <section className="destinations-header">
          <p className="destinations-eyebrow">EXPLORE INDIA</p>

          <h1>
            Discover your
            <br />
            <span> Destinations.</span>
          </h1>

          <p className="destinations-subtitle">
            Explore 30+ beautiful places, cultures, and authentic experiences
            across India.
          </p>

          {/* SEARCH BAR */}
          <div className="destinations-search">
            <input
              type="text"
              placeholder="Search destination, state, or category..."
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

          {/* CATEGORY FILTER CHIPS */}
          <div className="destinations-filters-bar">
            <div className="destinations-category-chips">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`destinations-chip ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* STATE & SORT SELECTORS */}
            <div className="destinations-selectors">
              <div className="destinations-select-wrapper">
                <label htmlFor="state-filter">State:</label>
                <select
                  id="state-filter"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  {availableStates.map((st) => (
                    <option key={st} value={st}>
                      {st === "All" ? "All States" : st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="destinations-select-wrapper">
                <label htmlFor="safety-filter">Travel Status:</label>
                <select
                  id="safety-filter"
                  value={selectedSafety}
                  onChange={(e) => setSelectedSafety(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="CLEAR">🟢 Verified Clear</option>
                  <option value="RAIN">🌧️ Rain Alert</option>
                  <option value="ADVISORY">🟡 Caution Advisory</option>
                  <option value="DISASTER">🔴 Disaster Zone</option>
                </select>
              </div>

              <div className="destinations-select-wrapper">
                <label htmlFor="sort-filter">Sort:</label>
                <select
                  id="sort-filter"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Top Rated ⭐</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* LOADING SKELETON */}
        {loading && (
          <section className="destinations-results">
            <div className="destinations-results-top">
              <div>
                <p>PLACES TO EXPLORE</p>
                <h2>Loading beautiful destinations...</h2>
              </div>
            </div>
            <GridSkeleton count={6} />
          </section>
        )}

        {/* RESULTS */}
        {!loading && (
          <section className="destinations-results">
            <div className="destinations-results-top">
              <div>
                <p>PLACES TO EXPLORE</p>
                <h2>
                  {searchTerm
                    ? `Results for "${searchTerm}"`
                    : selectedCategory !== "All"
                    ? `${selectedCategory} Destinations`
                    : "Explore India's beautiful destinations."}
                </h2>
              </div>

              <span className="destination-count">
                {filteredDestinations.length} destinations found
              </span>
            </div>

            {filteredDestinations.length > 0 ? (
              <div className="destination-grid">
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    alertInfo={disasterAlertsMap[destination.name.toLowerCase().trim()]}
                  />
                ))}
              </div>
            ) : (
              <div className="no-destinations">
                <div>🔎</div>
                <h3>No destinations found</h3>
                <p>
                  Try searching for another destination, state, or clearing your
                  filters.
                </p>
                <button
                  type="button"
                  className="destinations-reset-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedState("All");
                    setSelectedSafety("All");
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default Destinations;