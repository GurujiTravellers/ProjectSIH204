import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import destinations from "../data/destinations";
import hotels from "../data/hotels";
import localBusinessData from "../data/localBusinessData";
import { getWeatherForecast } from "../services/weatherApi";

const localCategories = [
  { key: "food", label: "Restaurants & Food", icon: "🍴" },
  { key: "guides", label: "Local Guides", icon: "🧑‍🏫" },
  { key: "shopping", label: "Shopping & Bazaars", icon: "🛍️" },
  { key: "activities", label: "Local Experiences", icon: "✨" },
];

function DestinationDetails() {
  const { id } = useParams();

  /*
   * Find the position of the current destination
   * in destinations.js by ID or name.
   */
  const currentIndex = destinations.findIndex(
    (item) =>
      item.id === Number(id) ||
      item.destinationId === Number(id) ||
      String(item._id) === String(id) ||
      item.name.toLowerCase() === decodeURIComponent(id || "").toLowerCase()
  );

  /*
   * Get the current destination.
   */
  const destination =
    currentIndex !== -1
      ? destinations[currentIndex]
      : null;

  const [weatherGlance, setWeatherGlance] = useState(null);

  useEffect(() => {
    if (!destination?.name) return;
    getWeatherForecast(destination.name, "", 1, { state: destination.state })
      .then((data) => setWeatherGlance(data))
      .catch(() => setWeatherGlance(null));
  }, [destination?.name, destination?.state]);

  /*
   * Get the immediately next destination.
   */
  const nextDestination =
    currentIndex !== -1
      ? destinations[
      (currentIndex + 1) % destinations.length
      ]
      : null;

  /*
   * Get the immediately previous destination.
   */
  const previousDestination =
    currentIndex !== -1
      ? destinations[
      (currentIndex - 1 + destinations.length) %
      destinations.length
      ]
      : null;

  /*
   * Get only the hotels belonging to
   * the current destination.
   */
  const destinationHotels = destination
    ? hotels.filter(
      (hotel) =>
        hotel.destination?.toLowerCase().trim() ===
        destination.name?.toLowerCase().trim()
    )
    : [];

  /*
   * Local business data (food, guides, shopping, activities)
   */
  const destinationLocalData = destination?.name && localBusinessData[destination.name]
    ? localBusinessData[destination.name]
    : { food: [], guides: [], shopping: [], activities: [] };

  const [activeLocalTab, setActiveLocalTab] = useState("food");

  /*
   * Store selected local experiences.
   */
  const [selectedLocalExperiences, setSelectedLocalExperiences] =
    useState([]);

  /*
   * Load selected local experiences from sessionStorage.
   */
  useEffect(() => {
    if (!destination?.name) {
      return;
    }

    try {
      const storageKey =
        `travelGurujiLocalExperiences:${destination.name}`;

      const savedExperiences =
        sessionStorage.getItem(storageKey);

      const parsedExperiences = savedExperiences
        ? JSON.parse(savedExperiences)
        : [];

      setSelectedLocalExperiences(
        Array.isArray(parsedExperiences)
          ? parsedExperiences
          : []
      );
    } catch (error) {
      console.error(
        "Selected local experiences loading failed:",
        error
      );

      setSelectedLocalExperiences([]);
    }
  }, [destination?.name]);

  /*
   * Toggle or remove local experiences and sync with sessionStorage
   */
  const toggleLocalExperience = (item, categoryKey = activeLocalTab) => {
    if (!destination?.name) return;
    const storageKey = `travelGurujiLocalExperiences:${destination.name}`;
    const categoryInfo = localCategories.find((c) => c.key === categoryKey);
    const experienceObj = {
      name: item.name,
      detail: item.detail,
      price: item.price,
      tag: item.tag,
      category: categoryKey,
      categoryLabel: categoryInfo?.label,
      icon: categoryInfo?.icon,
    };

    setSelectedLocalExperiences((prev) => {
      const exists = prev.some(
        (exp) => exp.name === item.name && exp.category === categoryKey
      );
      let updated;
      if (exists) {
        updated = prev.filter(
          (exp) => !(exp.name === item.name && exp.category === categoryKey)
        );
      } else {
        updated = [...prev, experienceObj];
      }
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save experience:", err);
      }
      return updated;
    });
  };

  const removeLocalExperience = (experienceToRemove) => {
    if (!destination?.name) return;
    const storageKey = `travelGurujiLocalExperiences:${destination.name}`;
    setSelectedLocalExperiences((prev) => {
      const updated = prev.filter(
        (exp) =>
          !(
            exp.name === experienceToRemove.name &&
            exp.category === experienceToRemove.category
          )
      );
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save experience:", err);
      }
      return updated;
    });
  };

  /*
   * Whenever Previous or Next opens another
   * destination, move the page to the top.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  /*
   * If destination does not exist.
   */
  if (!destination) {
    return (
      <main className="destination-details-page">
        <section className="destination-not-found">
          <p className="details-eyebrow">
            DESTINATION
          </p>

          <h1>
            Destination not found
          </h1>

          <p>
            Sorry, we could not find the destination
            you are looking for.
          </p>

          <Link
            to="/"
            className="details-home-button details-back-button"
          >
            ← Back to Home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="destination-details-page">

      {/* ================= HERO ================= */}

      <section className="destination-details-hero">
        <img
          src={destination.image}
          alt={destination.name}
          className="destination-hero-image"
        />

        <div className="destination-hero-overlay"></div>

        <div className="destination-hero-content">
          <p className="destination-hero-state">
            {destination.state}
          </p>

          <h1>
            {destination.name}
          </h1>

          <p className="destination-hero-category">
            {destination.category}
          </p>
        </div>
      </section>


      {/* ================= MAIN CONTENT ================= */}

      <div className="destination-details-content">

        {/* ================= INTRODUCTION ================= */}

        <section className="details-introduction">
          <p className="details-eyebrow">
            DISCOVER {destination.name.toUpperCase()}
          </p>

          <h2>
            Experience the beauty of{" "}
            <span>
              {destination.name}
            </span>
          </h2>

          <p className="details-description">
            {destination.description}
          </p>


          {/* INFORMATION CARDS */}

          <div className="details-meta">

            <div className="details-meta-card">
              <div className="details-meta-icon">
                ⭐
              </div>

              <div>
                <span>
                  Rating
                </span>

                <strong>
                  {destination.rating} / 10
                </strong>
              </div>
            </div>


            <div className="details-meta-card">
              <div className="details-meta-icon">
                📍
              </div>

              <div>
                <span>
                  State
                </span>

                <strong>
                  {destination.state}
                </strong>
              </div>
            </div>


            <div className="details-meta-card">
              <div className="details-meta-icon">
                🏔️
              </div>

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {destination.category}
                </strong>
              </div>
            </div>


            <div className="details-meta-card">
              <div className="details-meta-icon">
                📅
              </div>

              <div>
                <span>
                  Best Time
                </span>

                <strong>
                  {destination.bestTime}
                </strong>
              </div>
            </div>

            {weatherGlance && (
              <Link
                to={`/weather?dest=${encodeURIComponent(destination.name)}`}
                className="details-meta-card details-meta-weather"
                style={{ textDecoration: "none", cursor: "pointer" }}
                title="Click to view live weather & natural disaster telemetry"
              >
                <div className="details-meta-icon">
                  {weatherGlance.mode === "live"
                    ? weatherGlance.forecast?.[0]?.weatherIcon || "☀️"
                    : weatherGlance.seasonal?.dominantIcon || "🌤️"}
                </div>

                <div>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {weatherGlance.mode === "live" ? "Current Weather" : "Seasonal Weather"}
                    <span style={{ fontSize: "10px", color: "#0284c7", fontWeight: "700" }}>• View Radar ↗</span>
                  </span>

                  <strong>
                    {weatherGlance.mode === "live"
                      ? `${weatherGlance.forecast?.[0]?.temperatureMax ?? "--"}°C • ${weatherGlance.forecast?.[0]?.weatherLabel || "Live"}`
                      : `${weatherGlance.seasonal?.avgTempMin}°C – ${weatherGlance.seasonal?.avgTempMax}°C • ${weatherGlance.seasonal?.dominantCondition}`}
                  </strong>
                </div>
              </Link>
            )}

          </div>

          {/* QUICK DESTINATION ACTIONS */}
          <div className="destination-quick-actions">
            <Link
              to={`/planner?destination=${encodeURIComponent(destination.name)}`}
              className="destination-action-btn primary"
            >
              🧳 Plan Trip to {destination.name}
            </Link>

            <Link
              to={`/hotels?destination=${encodeURIComponent(destination.name)}`}
              className="destination-action-btn secondary"
            >
              🏨 Stays in {destination.name} ({destinationHotels.length})
            </Link>

            <Link
              to={`/transport?destination=${encodeURIComponent(destination.name)}`}
              className="destination-action-btn secondary"
            >
              🚆 Flights, Trains & Buses
            </Link>

            <Link
              to={`/local-experiences?destination=${encodeURIComponent(destination.name)}`}
              className="destination-action-btn secondary"
            >
              🏪 Local Experiences
            </Link>
          </div>
        </section>


        {/* ================= IMAGE GALLERY ================= */}

        <section className="destination-gallery">

          <div className="gallery-heading">
            <p>
              VISUAL JOURNEY
            </p>

            <h2>
              Explore {destination.name}
            </h2>

            <span>
              Take a glimpse at the beauty and
              visuals of {destination.name}.
            </span>
          </div>


          <div className="destination-image-grid">
            {destination.images?.map(
              (image, index) => (
                <div
                  className={`destination-gallery-image image-${index + 1}`}
                  key={`${destination.id}-${index}`}
                >
                  <img
                    src={image}
                    alt={`${destination.name} view ${index + 1}`}
                  />
                </div>
              )
            )}
          </div>

        </section>


        {/* ================= ATTRACTIONS ================= */}

        <section className="attractions-section">

          <div className="attractions-heading">
            <p>
              PLACES TO VISIT
            </p>

            <h2>
              Top attractions in{" "}
              {destination.name}
            </h2>

            <span>
              Discover some of the most memorable
              places and experiences around{" "}
              {destination.name}.
            </span>
          </div>


          <div className="attractions-list">

            {destination.attractions?.map(
              (attraction, index) => (

                <article
                  className="attraction-card"
                  key={`${destination.id}-${attraction.name}`}
                >

                  <div className="attraction-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>


                  <div className="attraction-content">

                    <div className="attraction-title-row">

                      <h3>
                        {attraction.name}
                      </h3>

                      <span className="attraction-rating">
                        😯 {attraction.rating}
                      </span>

                    </div>

                    <p>
                      {attraction.description}
                    </p>

                  </div>

                </article>

              )
            )}

          </div>


          {/* ================= LOCAL EXPERIENCES, RESTAURANTS, GUIDES & SHOPPING ================= */}

          <div className="destination-local-section">
            <div className="destination-local-heading">
              <p className="details-eyebrow">
                LOCAL VIBES & IMMERSION
              </p>
              <h2>
                Food, Guides, Shopping & Experiences in {destination.name}
              </h2>
              <span>
                Discover authentic regional restaurants, certified neighborhood guides, bustling bazaars, and cultural activities.
              </span>
            </div>

            {/* CATEGORY TABS */}
            <div className="destination-local-tabs">
              {localCategories.map((cat) => {
                const count = destinationLocalData[cat.key]?.length || 0;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    className={`destination-local-tab ${activeLocalTab === cat.key ? "active" : ""}`}
                    onClick={() => setActiveLocalTab(cat.key)}
                  >
                    <span className="tab-icon">{cat.icon}</span>
                    <span className="tab-label">{cat.label}</span>
                    <span className="tab-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE CATEGORY ITEMS GRID */}
            <div className="destination-local-grid">
              {(destinationLocalData[activeLocalTab] || []).map((item, index) => {
                const isSelected = selectedLocalExperiences.some(
                  (exp) => exp.name === item.name && exp.category === activeLocalTab
                );
                return (
                  <article
                    key={`${activeLocalTab}-${item.name}-${index}`}
                    className={`destination-local-card ${isSelected ? "selected" : ""}`}
                  >
                    <div className="destination-local-card-top">
                      <span className="local-card-tag">{item.tag || "Recommended"}</span>
                      {item.price && (
                        <span className="local-card-price">{item.price}</span>
                      )}
                    </div>

                    <h3>{item.name}</h3>
                    <p>{item.detail}</p>

                    <div className="destination-local-card-actions">
                      <button
                        type="button"
                        className={`local-card-add-btn ${isSelected ? "added" : ""}`}
                        onClick={() => toggleLocalExperience(item, activeLocalTab)}
                      >
                        {isSelected ? "✓ Added to Trip" : "+ Add to Trip"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="destination-local-footer">
              <Link
                to={`/local-experiences?destination=${encodeURIComponent(
                  destination.name
                )}`}
                className="details-plan-button attraction-local-experience-button"
              >
                🌿 Explore All Categories & Customize in Full Guide
              </Link>

              {/* SELECTED EXPERIENCES */}
              {selectedLocalExperiences.length > 0 && (
                <div className="selected-local-experiences">
                  <div className="selected-local-experiences-heading">
                    <span>✓</span>
                    <div>
                      <h3>
                        Your Selected Experiences ({selectedLocalExperiences.length})
                      </h3>
                      <p>
                        These experiences have been saved to your trip in {destination.name}.
                      </p>
                    </div>
                  </div>

                  <div className="selected-local-experiences-list">
                    {selectedLocalExperiences.map((experience, index) => (
                      <div
                        className="selected-local-experience-item"
                        key={`${experience.name}-${experience.category}-${index}`}
                      >
                        <div className="selected-local-experience-icon">
                          {experience.icon || "🌿"}
                        </div>

                        <div className="selected-local-experience-info">
                          <h4>{experience.name}</h4>

                          {experience.detail && (
                            <p>{experience.detail}</p>
                          )}

                          <div className="selected-local-experience-meta">
                            {experience.categoryLabel && (
                              <span>{experience.categoryLabel}</span>
                            )}

                            {experience.price && (
                              <span>{experience.price}</span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="selected-local-experience-remove"
                          onClick={() => removeLocalExperience(experience)}
                          title="Remove experience"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </section>


        {/* ================= HOTELS ================= */}

        <section className="destination-hotels-section">

          <div className="destination-hotels-heading">

            <p>
              PLACES TO STAY
            </p>

            <h2>
              Hotels in {destination.name}
            </h2>

            <span>
              Explore comfortable hotels available
              at this destination.
            </span>

          </div>


          {destinationHotels.length > 0 ? (

            <div className="destination-hotels-list">

              {destinationHotels.map((hotel) => (

                <article
                  className="destination-hotel-card"
                  key={hotel.id}
                >

                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="destination-hotel-image"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <div className="destination-hotel-card-info">

                    <p className="destination-hotel-location">
                      📍 {hotel.destination}
                    </p>

                    <h3>
                      {hotel.name}
                    </h3>

                    <div className="destination-hotel-meta">

                      <span>
                        ★ {hotel.rating} / 5
                      </span>

                      <span>
                        ₹
                        {hotel.price.toLocaleString(
                          "en-IN"
                        )}
                        {" "} / night
                      </span>

                    </div>

                  </div>


                  <Link
                    to={`/hotels/${hotel.id}?source=destination&destinationId=${destination.id}`}
                    className="destination-hotel-select"
                  >
                    Expand Description 
                  </Link>

                </article>

              ))}

            </div>

          ) : (

            <div className="destination-hotels-empty">

              No hotel information is available for{" "}
              <strong>
                {destination.name}
              </strong>.

            </div>

          )}

        </section>




        {/* ================= BOTTOM BUTTONS ================= */}

        <section className="destination-details-actions">

          {/* PREVIOUS DESTINATION */}

          <Link
            to={`/destinations/${previousDestination.id}`}
            className="details-previous-button"
          >
            ← Previous: {previousDestination.name}
          </Link>


          {/* PLAN YOUR TRIP */}

          <Link
            to={`/planner?destination=${encodeURIComponent(
              destination.name
            )}`}
            state={{
              from: `/destinations/${destination.id}`,
            }}
            className="details-plan-button"
          >
            🧳 Plan Your Trip
          </Link>


          {/* BACK TO DESTINATIONS */}

          <Link
            to="/destinations"
            className="details-home-button details-back-button"
          >
            Back to Destinations
          </Link>


          {/* NEXT DESTINATION */}

          <Link
            to={`/destinations/${nextDestination.id}`}
            className="details-next-button"
          >
            Next: {nextDestination.name} →
          </Link>

        </section>

      </div>

    </main>
  );
}

export default DestinationDetails;