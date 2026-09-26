import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import destinations from "../data/destinations";
import hotels from "../data/hotels";

const activities = [
  {
    category: "Water Activities",
    activities: [
      {
        name: "River Rafting",
        places: ["Rishikesh", "Manali", "Kasol"],
      },
      {
        name: "Scuba Diving",
        places: ["Digha", "Puri"],
      },
      {
        name: "Snorkeling",
        places: ["Digha", "Puri"],
      },
      {
        name: "Backwater Houseboating",
        places: ["Srinagar"],
      },
      {
        name: "Surfing",
        places: ["Digha", "Puri"],
      },
      {
        name: "Jet Skiing",
        places: ["Digha", "Puri"],
      },
      {
        name: "Kayaking",
        places: ["Rishikesh", "Dawki", "Srinagar"],
      },
    ],
  },
  {
    category: "Air Activities",
    activities: [
      {
        name: "Paragliding",
        places: ["Manali", "Shimla"],
      },
      {
        name: "Hot Air Ballooning",
        places: ["Jaipur"],
      },
      {
        name: "Parasailing",
        places: ["Digha", "Puri"],
      },
      {
        name: "Skydiving",
        places: ["Manali"],
      },
      {
        name: "Ziplining",
        places: ["Manali", "Shimla", "Rishikesh"],
      },
    ],
  },
  {
    category: "Land & Mountain Activities",
    activities: [
      {
        name: "Trekking",
        places: [
          "Manali",
          "Kasol",
          "Chitkul",
          "Kalpa",
          "Kaza",
          "Chandratal Lake",
        ],
      },
      {
        name: "Wildlife Safari",
        places: ["Jaipur", "Pahalgam"],
      },
      {
        name: "Camel Safari",
        places: ["Jaisalmer"],
      },
      {
        name: "Mountain Biking",
        places: ["Manali", "Shimla"],
      },
      {
        name: "Rock Climbing",
        places: ["Manali", "Rishikesh"],
      },
      {
        name: "Bungee Jumping",
        places: ["Rishikesh"],
      },
      {
        name: "Skiing",
        places: ["Gulmarg", "Manali"],
      },
      {
        name: "Quad Biking",
        places: ["Manali", "Jaisalmer"],
      },
    ],
  },
  {
    category: "Heritage & Culture",
    activities: [
      {
        name: "Heritage Walk",
        places: ["Jaipur", "Agra", "Delhi", "Varanasi"],
      },
      {
        name: "Temple Tour",
        places: ["Varanasi", "Puri", "Bhubaneswar", "Konark"],
      },
      {
        name: "Village Experience",
        places: ["Mawlynnong Village", "Chitkul"],
      },
      {
        name: "Scenic Sightseeing",
        places: ["Srinagar", "Darjeeling", "Mussoorie", "Shillong"],
      },
    ],
  },
];

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState("all");

  const search = searchTerm.toLowerCase().trim();

  /* =========================
     DESTINATION RESULTS
     ========================= */
  const destinationResults = destinations.filter((destination) => {
    return (
      destination.name.toLowerCase().includes(search) ||
      destination.state.toLowerCase().includes(search) ||
      destination.category.toLowerCase().includes(search) ||
      (destination.description &&
        destination.description.toLowerCase().includes(search))
    );
  });

  /* =========================
     HOTEL RESULTS
     ========================= */
  const hotelResults = hotels.filter((hotel) => {
    return (
      hotel.name.toLowerCase().includes(search) ||
      hotel.destination.toLowerCase().includes(search) ||
      (hotel.contact && hotel.contact.toLowerCase().includes(search)) ||
      (hotel.location && hotel.location.toLowerCase().includes(search))
    );
  });

  /* =========================
     ACTIVITY RESULTS
     ========================= */
  const activityResults = [];

  activities.forEach((category) => {
    category.activities.forEach((activity) => {
      const categoryMatches = category.category.toLowerCase().includes(search);
      const activityMatches = activity.name.toLowerCase().includes(search);
      const matchingPlaces = activity.places.filter((place) =>
        place.toLowerCase().includes(search)
      );

      if (
        !search ||
        categoryMatches ||
        activityMatches ||
        matchingPlaces.length > 0
      ) {
        activityResults.push({
          category: category.category,
          name: activity.name,
          places:
            matchingPlaces.length > 0 ? matchingPlaces : activity.places,
        });
      }
    });
  });

  function handleSearch(event) {
    event.preventDefault();
    setSearchParams({ q: searchTerm });
  }

  const totalResults =
    destinationResults.length + hotelResults.length + activityResults.length;

  return (
    <main className="search-page">
      <div className="search-page-background"></div>

      <div className="search-page-content">
        {/* HEADER */}
        <section className="search-header">
          <p className="search-eyebrow">SMART TRAVEL SEARCH</p>

          <h1>
            Search everything
            <br />
            <span>in one place.</span>
          </h1>

          <p className="search-subtitle">
            Find destinations, hotels, and activities across India.
          </p>

          {/* SEARCH FORM */}
          <form
            className="destinations-search global-search"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search destinations, hotels, activities..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setSearchParams({ q: event.target.value });
              }}
            />

            {searchTerm && (
              <button
                type="button"
                className="home-search-clear"
                onClick={() => {
                  setSearchTerm("");
                  setSearchParams({});
                }}
                aria-label="Clear search"
                title="Clear search"
              >
                ×
              </button>
            )}

            <button type="submit">Search</button>
          </form>

          {/* FILTER TABS */}
          <div className="search-filter-tabs">
            <button
              type="button"
              className={`search-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All ({totalResults})
            </button>
            <button
              type="button"
              className={`search-tab-btn ${
                activeTab === "destinations" ? "active" : ""
              }`}
              onClick={() => setActiveTab("destinations")}
            >
              📍 Destinations ({destinationResults.length})
            </button>
            <button
              type="button"
              className={`search-tab-btn ${
                activeTab === "hotels" ? "active" : ""
              }`}
              onClick={() => setActiveTab("hotels")}
            >
              🏨 Hotels ({hotelResults.length})
            </button>
            <button
              type="button"
              className={`search-tab-btn ${
                activeTab === "activities" ? "active" : ""
              }`}
              onClick={() => setActiveTab("activities")}
            >
              🎯 Activities ({activityResults.length})
            </button>
          </div>
        </section>

        {/* RESULTS */}
        <section className="search-results">
          <div className="search-results-top">
            <div>
              <p>SEARCH RESULTS</p>
              <h2>
                {search
                  ? `Results for "${searchTerm}"`
                  : "Explore everything across India."}
              </h2>
            </div>

            <span className="search-count">{totalResults} results</span>
          </div>

          {totalResults > 0 ? (
            <>
              {/* DESTINATIONS */}
              {(activeTab === "all" || activeTab === "destinations") &&
                destinationResults.length > 0 && (
                  <div className="search-result-section">
                    <h3>📍 Destinations ({destinationResults.length})</h3>

                    <div className="search-result-grid">
                      {destinationResults.map((destination) => (
                        <div
                          key={destination.id}
                          className="search-result-card"
                        >
                          <strong>{destination.name}</strong>
                          <span>{destination.state}</span>
                          <small>{destination.category}</small>

                          <div className="search-card-actions">
                            <Link
                              to={`/destinations/${destination.id}`}
                              className="search-action-link explore"
                            >
                              Explore →
                            </Link>
                            <Link
                              to={`/planner?destination=${encodeURIComponent(
                                destination.name
                              )}`}
                              className="search-action-link plan"
                            >
                              🧳 Plan Trip
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* HOTELS */}
              {(activeTab === "all" || activeTab === "hotels") &&
                hotelResults.length > 0 && (
                  <div className="search-result-section">
                    <h3>🏨 Hotels ({hotelResults.length})</h3>

                    <div className="search-result-grid">
                      {hotelResults.map((hotel) => (
                        <div key={hotel.id} className="search-result-card">
                          <strong>{hotel.name}</strong>
                          <span>📍 {hotel.destination}</span>
                          <small>
                            ₹{hotel.price.toLocaleString("en-IN")} / night
                          </small>

                          <div className="search-card-actions">
                            <Link
                              to={`/hotels/${hotel.id}`}
                              className="search-action-link explore"
                            >
                              View Hotel →
                            </Link>
                            <Link
                              to={`/planner?destination=${encodeURIComponent(
                                hotel.destination
                              )}&hotel=${encodeURIComponent(hotel.name)}`}
                              className="search-action-link plan"
                            >
                              🧳 Plan Stay
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* ACTIVITIES */}
              {(activeTab === "all" || activeTab === "activities") &&
                activityResults.length > 0 && (
                  <div className="search-result-section">
                    <h3>🎯 Activities ({activityResults.length})</h3>

                    <div className="search-result-grid">
                      {activityResults.map((activity) => (
                        <div
                          key={`${activity.category}-${activity.name}`}
                          className="search-result-card"
                        >
                          <strong>{activity.name}</strong>
                          <span>{activity.category}</span>

                          <div className="search-activity-places">
                            {activity.places.map((place) => (
                              <Link
                                key={place}
                                to={`/planner?destination=${encodeURIComponent(
                                  place
                                )}&activityType=${encodeURIComponent(
                                  activity.category
                                )}&activity=${encodeURIComponent(
                                  activity.name
                                )}`}
                                className="search-place-button"
                              >
                                📍 {place} →
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </>
          ) : (
            <div className="no-search-results">
              <div>🔎</div>
              <h3>No results found</h3>
              <p>
                Try searching for a destination (e.g. "Manali", "Kolkata"),
                hotel, or activity (e.g. "Rafting").
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Search;