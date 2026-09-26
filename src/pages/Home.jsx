import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import DestinationCard from "../components/DestinationCard";
import FeatureCard from "../components/FeatureCard";
import destinations from "../data/destinations";
import { getActiveDisasterAlerts } from "../services/emergencyApi";

const featuredDestinations = destinations.slice(0, 6);

function Home() {
  const [disasterAlertsMap, setDisasterAlertsMap] = useState({});

  useEffect(() => {
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
        console.warn("Could not load disaster alerts for home:", err);
      }
    }
    loadAlerts();
  }, []);

  return (
    <main>
      <Hero />

      {/* DESTINATIONS */}

      <section className="destinations-section">
        <div className="section-heading">
          <p>EXPLORE INDIA</p>

          <h2>
            Find your loving
            <br />
            Destinations.
          </h2>

          <span>
            Explore beautiful destinations across India
            and discover experiences worth remembering.
          </span>
        </div>

        <div className="destination-grid">
          {featuredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              source="home"
              alertInfo={disasterAlertsMap[destination.name.toLowerCase().trim()]}
            />
          ))}
        </div>
      </section>

      {/* OUR SOLUTION & INNOVATION HIGHLIGHTS */}
      <section className="uniqueness-section">
        <div className="section-heading">
          <p> INNOVATION FEATURES </p>

          <h2>
            Travel Smarter & Safer
            <br />
            with Travel_Guruji
          </h2>

          <span>
            Beyond ordinary booking — student trip planning, student-recommended homestays, women safety intelligence, escrow-style protection, and vlogger-style day guides.
          </span>
        </div>

        <div className="innovation-grid">
            
            {/* 1. STUDENT TRIP PLANNER */}
            <div className="innovation-card">
              <div>
                <span style={{ fontSize: "36px" }}>🎓</span>
                <h3 style={{ fontSize: "20px", color: "#0f172a", margin: "14px 0 8px" }}>Student Trip Planner</h3>
                <p style={{ fontSize: "14px", color: "#57534e", lineHeight: 1.6, margin: 0 }}>
                  Specially built for college students & backpacker groups. Low-cost route algorithms, student ID discounts (ASI & Rail), hostel dorm splits, and daily pocket money trackers.
                </p>
              </div>
              <Link to="/student-planner" className="innovation-btn innovation-btn-student">
                Plan Student Trip ➔
              </Link>
            </div>

            {/* 2. STUDENT-RECOMMENDED HOMESTAYS */}
            <div className="innovation-card">
              <div>
                <span style={{ fontSize: "36px" }}>🏡</span>
                <h3 style={{ fontSize: "20px", color: "#0f172a", margin: "14px 0 8px" }}>Student-Recommended Homestays</h3>
                <p style={{ fontSize: "14px", color: "#57534e", lineHeight: 1.6, margin: 0 }}>
                  Curated authentic homestays rated highly by university students. Benefit from host hospitality, kitchen access, student discounts, and budget nightly rates.
                </p>
              </div>
              <Link to="/hotels?category=student-homestay" className="innovation-btn innovation-btn-homestay">
                Browse Student Homestays ➔
              </Link>
            </div>

            {/* 3. WOMEN SAFETY */}
            <div className="innovation-card">
              <div>
                <span style={{ fontSize: "36px" }}>🛡️</span>
                <h3 style={{ fontSize: "20px", color: "#0f172a", margin: "14px 0 8px" }}>Women Safety Intelligence</h3>
                <p style={{ fontSize: "14px", color: "#57534e", lineHeight: 1.6, margin: 0 }}>
                  Area safety scores, late-night transit alerts, verified 24/7 front desk stays, nationwide emergency helplines (112, 1090), and 1-tap WhatsApp SOS location share.
                </p>
              </div>
              <Link to="/safety" className="innovation-btn innovation-btn-safety">
                Explore Safety Hub ➔
              </Link>
            </div>

            {/* 4. PROTECTED BOOKING */}
            <div className="innovation-card">
              <div>
                <span style={{ fontSize: "36px" }}>🔒</span>
                <h3 style={{ fontSize: "20px", color: "#0f172a", margin: "14px 0 8px" }}>Protected Booking & Escrow Refund</h3>
                <p style={{ fontSize: "14px", color: "#57534e", lineHeight: 1.6, margin: 0 }}>
                  Zero ghost bookings. Server-side Razorpay cryptographic verification, partner settlement protection, and automated transparent refunds.
                </p>
              </div>
              <Link to="/protected-booking" className="innovation-btn innovation-btn-escrow">
                View Protection Guarantee ➔
              </Link>
            </div>

            {/* 5. VLOGGER-STYLE GUIDE */}
            <div className="innovation-card">
              <div>
                <span style={{ fontSize: "36px" }}>🎥</span>
                <h3 style={{ fontSize: "20px", color: "#0f172a", margin: "14px 0 8px" }}>Vlogger-Style Smart Day Guide</h3>
                <p style={{ fontSize: "14px", color: "#57534e", lineHeight: 1.6, margin: 0 }}>
                  Curated morning-to-night flow: "Start your morning at...", "Midday local lunch stop...", transit times, expected costs, and zero repeated attractions.
                </p>
              </div>
              <Link to="/planner" className="innovation-btn innovation-btn-vlogger">
                Generate Smart Itinerary ➔
              </Link>
            </div>

            {/* 6. BUDGET-FIRST PLANNING */}
            <div className="innovation-card">
              <div>
                <span style={{ fontSize: "36px" }}>💰</span>
                <h3 style={{ fontSize: "20px", color: "#0f172a", margin: "14px 0 8px" }}>Budget-First Trip Planning</h3>
                <p style={{ fontSize: "14px", color: "#57534e", lineHeight: 1.6, margin: 0 }}>
                  Input your spending limit. Our planning engine distributes it across stays, travel, meals, and activities with a live 10% emergency safety reserve.
                </p>
              </div>
              <Link to="/planner" className="innovation-btn innovation-btn-budget">
                Start Budget-First Plan ➔
              </Link>
            </div>

            {/* 7. REAL-TIME DISASTER & EMERGENCY SAFETY */}
            <div className="innovation-card">
              <div>
                <span style={{ fontSize: "36px" }}>🌪️</span>
                <h3 style={{ fontSize: "20px", color: "#0f172a", margin: "14px 0 8px" }}>Disaster & Route Risk Intelligence</h3>
                <p style={{ fontSize: "14px", color: "#57534e", lineHeight: 1.6, margin: 0 }}>
                  Live NDMA & IMD flood, cyclone, and landslide alerts. Instant safe evacuation routing, 100% Escrow protected refunds during trip disruptions, and stranded traveler community frequency.
                </p>
              </div>
              <Link to="/emergency" className="innovation-btn innovation-btn-disaster">
                Explore Emergency Hub ➔
              </Link>
            </div>

          </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-heading">
          <p> DISCOVER FEATURES </p>

          <h2>
            Take the trip.
            <br />
            Make the memories.
          </h2>

          <span>
            Everything you need to plan a memorable
            journey in one place.
          </span>
        </div>

        <div className="feature-grid">

          {/* DISCOVER PLACES */}
          <Link
            to="/destinations"
            className="feature-link"
          >
            <FeatureCard
              icon="📍"
              title="Discover Places"
              description="Find destinations, attractions and unique local experiences."
            />
          </Link>

          {/* PLAN YOUR TRIP */}
          <Link
            to="/planner"
            className="feature-link"
          >
            <FeatureCard
              icon="🧳"
              title="Plan Your Trip"
              description="Organise your destinations, hotels and activities in one plan."
            />
          </Link>

          {/* Interests on activities */}
          <Link
            to="/activities"
            className="feature-link"
          >
            <FeatureCard
              icon="🪂"
              title=" Interests on activities."
              description="Get personalised travel suggestions based on your interests and budget."
            />
          </Link>

        </div>
      </section>
    </main>
  );
}

export default Home;