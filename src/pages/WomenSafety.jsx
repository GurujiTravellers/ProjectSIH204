import { useState } from "react";
import { Link } from "react-router-dom";
import SafetyIntelligence from "../components/SafetyIntelligence";
import destinations from "../data/destinations";

function WomenSafety() {
  const [selectedDestination, setSelectedDestination] = useState("Shimla");

  const popularSafetyDestinations = [
    "Shimla",
    "Manali",
    "Goa",
    "Jaipur",
    "Varanasi",
    "Kolkata",
    "Delhi",
    "Darjeeling",
    "Puri",
    "Srinagar",
  ];

  return (
    <main className="safety-hub-page" style={{ minHeight: "85vh", padding: "40px 20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* HERO BANNER */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #4c1d95 100%)",
            borderRadius: "20px",
            padding: "36px 30px",
            color: "#ffffff",
            marginBottom: "32px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.12)", padding: "6px 14px", borderRadius: "30px", fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>
            <span>🛡️</span>
            <span>WOMEN & SOLO TRAVELER PRIORITY</span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            Women Safety-Aware Travel Intelligence
          </h1>
          <p style={{ fontSize: "16px", color: "#cbd5e1", maxWidth: "750px", lineHeight: 1.6, margin: 0 }}>
            Travel with complete confidence across India. Verified terrain alerts, night travel timing advisories, 24/7 national emergency helplines, and 1-tap SOS assistance tailored to your destination.
          </p>
        </div>

        {/* DESTINATION SELECTOR BAR */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            padding: "20px 24px",
            marginBottom: "28px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", color: "#64748b", textTransform: "uppercase" }}>
              Selected Travel Destination
            </span>
            <h3 style={{ margin: "2px 0 0", fontSize: "20px", color: "#0f172a" }}>
              Safety Intelligence for: <span style={{ color: "#7c3aed" }}>{selectedDestination}</span>
            </h3>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Quick Select:</span>
            {popularSafetyDestinations.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => setSelectedDestination(dest)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: selectedDestination === dest ? "2px solid #7c3aed" : "1px solid #cbd5e1",
                  background: selectedDestination === dest ? "#f5f3ff" : "#ffffff",
                  color: selectedDestination === dest ? "#6d28d9" : "#334155",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>

        {/* EMBEDDED SAFETY INTELLIGENCE COMPONENT */}
        <SafetyIntelligence destination={selectedDestination} />

        {/* SAFETY PILLARS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "32px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>🏨</div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "#0f172a" }}>Women-Friendly Stays</h3>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: "0 0 16px" }}>
              Filter hotels and homestays with verified 24/7 security, well-lit street access, and dedicated solo-traveler reviews.
            </p>
            <Link
              to={`/hotels?destination=${encodeURIComponent(selectedDestination)}`}
              style={{ color: "#7c3aed", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}
            >
              Browse Verified Stays →
            </Link>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>🌙</div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "#0f172a" }}>Late-Night Travel Alerts</h3>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: "0 0 16px" }}>
              Our transport engine automatically tags night departures/arrivals between 11 PM and 5 AM with safe transit advisories.
            </p>
            <Link
              to={`/transport?destination=${encodeURIComponent(selectedDestination)}`}
              style={{ color: "#7c3aed", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}
            >
              Check Daytime Schedules →
            </Link>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>🗺️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "#0f172a" }}>Safety-First Day Planner</h3>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: "0 0 16px" }}>
              Generates evening itineraries prioritizing vibrant, well-lit city squares and recommending return before 9:30 PM.
            </p>
            <Link
              to={`/planner?destination=${encodeURIComponent(selectedDestination)}&safety=high`}
              style={{ color: "#7c3aed", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}
            >
              Plan Safety-Prioritized Trip →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

export default WomenSafety;

