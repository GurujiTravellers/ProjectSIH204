import { useState } from "react";
import { Link } from "react-router-dom";

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
        places: [
          "Varanasi",
          "Puri",
          "Bhubaneswar",
          "Konark",
        ],
      },
      {
        name: "Village Experience",
        places: ["Mawlynnong Village", "Chitkul"],
      },
      {
        name: "Scenic Sightseeing",
        places: [
          "Srinagar",
          "Darjeeling",
          "Mussoorie",
          "Shillong",
        ],
      },
    ],
  },
];

function Hero() {
  const [searchTerm, setSearchTerm] = useState("");

  const search = searchTerm.toLowerCase().trim();

  /* =========================
     DESTINATION SEARCH
     ========================= */

  const destinationResults = search
    ? destinations
        .filter((destination) => {
          return (
            destination.name
              .toLowerCase()
              .includes(search) ||
            destination.state
              .toLowerCase()
              .includes(search) ||
            destination.category
              .toLowerCase()
              .includes(search) ||
            destination.description
              .toLowerCase()
              .includes(search)
          );
        })
        .slice(0, 4)
    : [];


  /* =========================
     HOTEL SEARCH
     ========================= */

  const hotelResults = search
    ? hotels
        .filter((hotel) => {
          return (
            hotel.name
              .toLowerCase()
              .includes(search) ||
            hotel.destination
              .toLowerCase()
              .includes(search)
          );
        })
        .slice(0, 4)
    : [];


  /* =========================
     ACTIVITY SEARCH
     ========================= */

  const activityResults = [];

  if (search) {
    activities.forEach((category) => {
      category.activities.forEach((activity) => {

        const activityMatches =
          activity.name
            .toLowerCase()
            .includes(search);

        const categoryMatches =
          category.category
            .toLowerCase()
            .includes(search);

        const matchingPlaces =
          activity.places.filter((place) =>
            place.toLowerCase().includes(search)
          );

        if (
          activityMatches ||
          categoryMatches ||
          matchingPlaces.length > 0
        ) {
          activityResults.push({
            category: category.category,
            name: activity.name,
            places:
              matchingPlaces.length > 0
                ? matchingPlaces
                : activity.places,
          });
        }
      });
    });
  }


  const totalResults =
    destinationResults.length +
    hotelResults.length +
    activityResults.length;


  return (
    <section className="hero">

      <div className="hero-overlay">

        <div className="hero-content">

          <p className="hero-small-text">
            EXPLORE TRAVEL • DISCOVER INDIA
          </p>

          <h1>
            Your Trip,
            <br />
            <span>Our Plan.</span>
          </h1>

          <p className="hero-description">
            Discover incredible destinations,
            explore local experiences and create
            personalised travel plans with
            efficient recommendations.
          </p>


          {/* GLOBAL SEARCH */}

          <div className="home-search-wrapper">

            <div className="destinations-search home-search">

              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
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

              <button type="button">
                Search
              </button>

            </div>


            {}

            {searchTerm.trim() && (

              <div className="home-live-results">

                <div className="home-live-results-header">

                  <span>
                    SEARCH RESULTS
                  </span>

                  <span>
                    {totalResults} found
                  </span>

                </div>


                {totalResults > 0 ? (

                  <>

                    {/*destinations*/}

                    {destinationResults.length > 0 && (

                      <div className="home-search-section">

                        <h3>
                          📍 Destinations
                        </h3>

                        {destinationResults.map(
                          (destination) => (

                            <Link
                              key={destination.id}
                              to={`/destinations/${destination.id}?source=home`}
                              className="home-search-result"
                            >

                              <div>
                                <strong>
                                  {destination.name}
                                </strong>

                                <span>
                                  {destination.state}
                                </span>
                              </div>

                              <span>→</span>

                            </Link>

                          )
                        )}

                      </div>
                    )}


                    {/* hotels */}

                    {hotelResults.length > 0 && (

                      <div className="home-search-section">

                        <h3>
                          🏨 Hotels
                        </h3>

                        {hotelResults.map((hotel) => (

                          <Link
                            key={hotel.id}
                            to="/hotels"
                            className="home-search-result"
                          >

                            <div>

                              <strong>
                                {hotel.name}
                              </strong>

                              <span>
                                {hotel.destination}
                              </span>

                            </div>

                            <span>→</span>

                          </Link>

                        ))}

                      </div>
                    )}


                    {/* activities */}

                    {activityResults.length > 0 && (

                      <div className="home-search-section">

                        <h3>
                          🎯 Activities
                        </h3>

                        {activityResults
                          .slice(0, 5)
                          .map((activity) => (

                            <div
                              key={`${activity.category}-${activity.name}`}
                              className="home-search-result activity-search-result"
                            >

                              <div>

                                <strong>
                                  {activity.name}
                                </strong>

                                <span>
                                  {activity.category}
                                </span>

                                <div className="home-search-places">

                                  {activity.places
                                    .slice(0, 3)
                                    .map((place) => (

                                      <Link
                                        key={place}
                                        to={`/planner?destination=${encodeURIComponent(
                                          place
                                        )}&activityType=${encodeURIComponent(
                                          activity.category
                                        )}&activity=${encodeURIComponent(
                                          activity.name
                                        )}`}
                                        className="home-search-place"
                                      >
                                        📍 {place}
                                      </Link>

                                    ))}

                                </div>

                              </div>

                            </div>

                          ))}

                      </div>
                    )}

                  </>

                ) : (

                  <div className="home-no-results">

                    <div>
                      🔎
                    </div>

                    <strong>
                      No results found
                    </strong>

                    <span>
                      Try another destination,
                      hotel or activity.
                    </span>

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;