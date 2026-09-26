import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../services/bookingApi";
import { getActiveDisasterAlerts } from "../services/emergencyApi";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [radarSummary, setRadarSummary] = useState(null);

  useEffect(() => {
    // Load stored user
    try {
      const stored = localStorage.getItem("travelGurujiUser");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed reading user profile in dashboard", e);
    }

    // Load recent bookings
    async function loadDashboardBookings() {
      try {
        const res = await getMyBookings();
        if (res && Array.isArray(res.bookings)) {
          setRecentBookings(res.bookings.slice(0, 2));
        }
      } catch (err) {
        console.warn("Failed fetching bookings for dashboard", err);
      }
    }
    loadDashboardBookings();

    // Load live radar telemetry summary
    async function loadRadar() {
      try {
        const res = await getActiveDisasterAlerts();
        if (res && res.summary) {
          setRadarSummary(res.summary);
        }
      } catch (err) {
        console.warn("Failed fetching radar summary for dashboard", err);
      }
    }
    loadRadar();
  }, []);

  return (
    <main className="dashboard-page dashboard-with-background">
      <div className="dashboard-background"></div>

      <div className="dashboard-content">

        {/* HEADER */}
        <section className="dashboard-header">
          <p className="section-label">
            MY TRAVEL
          </p>

          <h1>
            {user?.name ? `Welcome back, ${user.name} 👋` : "Welcome, Traveller 👋"}
          </h1>

          <p>
            Manage your trips, explore new places, book verified stays & transport,
            and plan your next journey with Travel Guruji.
          </p>
        </section>

        {/* REAL-TIME NATIONAL TRAVEL RISK RADAR BANNER */}
        <section
          style={{
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.88) 100%)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "20px",
            padding: "24px 28px",
            marginBottom: "32px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "18px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
                <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1px", color: "#38bdf8", textTransform: "uppercase" }}>
                  LIVE SURVEY OF INDIA RADAR • REAL-TIME TELEMETRY
                </span>
              </div>
              <h2 style={{ margin: "2px 0 6px", fontSize: "20px", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🇮🇳</span> National Travel Safety & Route Health
              </h2>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#cbd5e1" }}>
                Continuous monitoring via IMD meteorological radar, Open-Meteo, and NDMA alerts across 44 travel hubs.
              </p>
            </div>

            <Link
              to="/emergency"
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                padding: "10px 18px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "700",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
              }}
            >
              <span>🚨</span> Open Live Emergency Radar ➔
            </Link>
          </div>

          {/* 4-TIER METRICS BAR */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "18px" }}>
            <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", padding: "12px 16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#fca5a5", textTransform: "uppercase" }}>🔴 Disaster Zones</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#ef4444", marginTop: "2px" }}>
                {radarSummary?.disasterZones ?? 4} Zones
              </div>
              <div style={{ fontSize: "11px", color: "#f87171", marginTop: "2px" }}>Routes Suspended</div>
            </div>

            <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "12px", padding: "12px 16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#fde68a", textTransform: "uppercase" }}>🟡 Yellow Advisories</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#f59e0b", marginTop: "2px" }}>
                {radarSummary?.moderateAdvisories ?? 7} Hubs
              </div>
              <div style={{ fontSize: "11px", color: "#fbbf24", marginTop: "2px" }}>Caution Advised</div>
            </div>

            <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "12px", padding: "12px 16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#a7f3d0", textTransform: "uppercase" }}>🟢 Rain Alerts</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#10b981", marginTop: "2px" }}>
                {radarSummary?.rainAlerts ?? 0} Hubs
              </div>
              <div style={{ fontSize: "11px", color: "#34d399", marginTop: "2px" }}>Standard Rain • Open</div>
            </div>

            <div style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "12px", padding: "12px 16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#bae6fd", textTransform: "uppercase" }}>🟢 Verified Normal</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#38bdf8", marginTop: "2px" }}>
                {radarSummary?.normalHubs ?? 44} Hubs
              </div>
              <div style={{ fontSize: "11px", color: "#7dd3fc", marginTop: "2px" }}>All Corridors Clear</div>
            </div>
          </div>

          {/* QUICK RECOMMENDED SAFE DESTINATIONS STRIP */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#34d399", textTransform: "uppercase" }}>
              🛡️ Recommended Clear Spots:
            </span>
            {["Jaipur", "Shimla", "Varanasi", "Agra", "Goa", "Kochi"].map((hub) => (
              <Link
                key={hub}
                to={`/planner?destination=${encodeURIComponent(hub)}`}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#e2e8f0",
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                ✓ {hub}
              </Link>
            ))}
          </div>
        </section>

        {/* ACTIVE RESERVATIONS PREVIEW (IF ANY) */}
        {recentBookings.length > 0 && (
          <section className="dashboard-section" style={{ marginBottom: "32px" }}>
            <div className="dashboard-section-heading" style={{ marginBottom: "16px" }}>
              <div>
                <span style={{ color: "#10b981", fontWeight: 700 }}>VERIFIED TICKETS & PASSES</span>
                <h2>Active Reservations</h2>
              </div>
              <Link to="/my-bookings" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
                View All Bookings ({recentBookings.length}) →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {recentBookings.map((b) => {
                const itemTitle =
                  b.itemType === "Hotel"
                    ? b.hotelDetails?.hotelName || "Hotel Stay"
                    : b.itemType === "Transport"
                    ? `${b.transportDetails?.carrierName || "Transport"} • ${b.transportDetails?.origin || ""} to ${b.transportDetails?.destination || ""}`
                    : b.itemType === "Activity"
                    ? b.activityDetails?.activityTitle || "Activity Pass"
                    : "Trip Plan";

                return (
                  <div
                    key={b.bookingReference}
                    style={{
                      background: "rgba(15, 23, 42, 0.75)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: "16px",
                      padding: "20px",
                      color: "#f8fafc",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#38bdf8", fontWeight: 700 }}>
                          {b.bookingReference}
                        </span>
                        <span style={{ fontSize: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "2px 8px", borderRadius: "8px", fontWeight: 700 }}>
                          CONFIRMED
                        </span>
                      </div>
                      <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#ffffff" }}>
                        {itemTitle}
                      </h3>
                      <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
                        Total Paid: <strong style={{ color: "#34d399" }}>₹{Number(b.totalAmount || 0).toLocaleString("en-IN")}</strong>
                      </p>
                    </div>
                    <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                      <Link
                        to={`/my-bookings?ref=${encodeURIComponent(b.bookingReference)}`}
                        style={{
                          background: "rgba(56, 189, 248, 0.15)",
                          color: "#38bdf8",
                          border: "1px solid rgba(56, 189, 248, 0.4)",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        View E-Ticket →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MY TRAVEL */}
        <section className="dashboard-section">

          <div className="dashboard-section-heading">
            <div>
              <span>YOUR TRAVEL SPACE</span>

              <h2>
                Manage your travel
              </h2>
            </div>
          </div>


          <div className="dashboard-grid">

            {/* MY BOOKINGS & TICKETS */}
            <Link
              to="/my-bookings"
              className="dashboard-card dashboard-card-link"
            >
              <div className="dashboard-card-icon" style={{ background: "#e0f2fe" }}>
                🎟️
              </div>

              <div>
                <span className="dashboard-card-label" style={{ color: "#0284c7" }}>
                  CONFIRMED PASSES
                </span>

                <h2>
                  My Bookings
                </h2>

                <p>
                  View your confirmed hotels, transport PNRs, activity passes
                  and print official E-Tickets.
                </p>
              </div>

              <span className="dashboard-card-arrow" style={{ color: "#0284c7" }}>
                →
              </span>
            </Link>


            {/* PLAN HISTORY */}
            <Link
              to="/plan-history"
              className="dashboard-card dashboard-card-link"
            >
              <div className="dashboard-card-icon">
                🧳
              </div>

              <div>
                <span className="dashboard-card-label">
                  SAVED ITINERARIES
                </span>

                <h2>
                  Plan History
                </h2>

                <p>
                  View your confirmed trips, reopen old plans
                  and access your PDF again.
                </p>
              </div>

              <span className="dashboard-card-arrow">
                →
              </span>
            </Link>


            {/* PLAN TRIP */}
            <Link
              to="/planner"
              className="dashboard-card dashboard-card-link"
            >
              <div className="dashboard-card-icon" style={{ background: "#ecfdf5" }}>
                ✈️
              </div>

              <div>
                <span className="dashboard-card-label" style={{ color: "#059669" }}>
                  NEW JOURNEY
                </span>

                <h2>
                  Plan a Trip
                </h2>

                <p>
                  Choose a destination, hotel, dates, transport
                  and budget to create an AI-powered plan.
                </p>
              </div>

              <span className="dashboard-card-arrow" style={{ color: "#059669" }}>
                →
              </span>
            </Link>


            {/* PROFILE */}
            <Link
              to="/profile"
              className="dashboard-card dashboard-card-link"
            >
              <div className="dashboard-card-icon">
                👤
              </div>

              <div>
                <span className="dashboard-card-label">
                  YOUR PROFILE
                </span>

                <h2>
                  My Profile
                </h2>

                <p>
                  View your profile details and keep your
                  travel information updated.
                </p>
              </div>

              <span className="dashboard-card-arrow">
                →
              </span>
            </Link>

          </div>

        </section>


        {/* EXPLORE */}
        <section className="dashboard-explore-section">

          <div className="dashboard-section-heading">

            <div>
              <span>
                EXPLORE TRAVEL GURUJI
              </span>

              <h2>
                Discover more before you travel
              </h2>

              <p>
                Explore destinations, hotels, activities and
                local experiences before creating your next plan.
              </p>
            </div>

          </div>


          <div className="dashboard-explore-grid">

            {/* DESTINATIONS */}
            <Link
              to="/destinations"
              className="dashboard-explore-card"
            >
              <div className="dashboard-explore-image dashboard-explore-destination">
                <span>🏔️</span>
              </div>

              <div className="dashboard-explore-content">
                <span>
                  DESTINATIONS
                </span>

                <h3>
                  Explore Destinations
                </h3>

                <p>
                  Discover places across India and find
                  your next travel destination.
                </p>

                <strong>
                  Explore →
                </strong>
              </div>
            </Link>


            {/* HOTELS */}
            <Link
              to="/hotels"
              className="dashboard-explore-card"
            >
              <div className="dashboard-explore-image dashboard-explore-hotel">
                <span>🏨</span>
              </div>

              <div className="dashboard-explore-content">
                <span>
                  STAYS
                </span>

                <h3>
                  Find Hotels
                </h3>

                <p>
                  Browse suitable hotels and compare
                  accommodation options.
                </p>

                <strong>
                  Explore →
                </strong>
              </div>
            </Link>


            {/* TRANSPORT */}
            <Link
              to="/transport"
              className="dashboard-explore-card"
            >
              <div className="dashboard-explore-image dashboard-explore-transport">
                <span>🚆</span>
              </div>

              <div className="dashboard-explore-content">
                <span>
                  FLIGHTS & TRAINS
                </span>

                <h3>
                  Transport
                </h3>

                <p>
                  Compare Vande Bharat, domestic flights,
                  and luxury buses across top routes.
                </p>

                <strong>
                  Search →
                </strong>
              </div>
            </Link>


            {/* ACTIVITIES */}
            <Link
              to="/activities"
              className="dashboard-explore-card"
            >
              <div className="dashboard-explore-image dashboard-explore-activity">
                <span>🎯</span>
              </div>

              <div className="dashboard-explore-content">
                <span>
                  EXPERIENCES
                </span>

                <h3>
                  Activities
                </h3>

                <p>
                  Find activities, sightseeing ideas and
                  memorable things to do.
                </p>

                <strong>
                  Explore →
                </strong>
              </div>
            </Link>


            {/* LOCAL EXPERIENCES */}
            <Link
              to="/local-experiences"
              className="dashboard-explore-card"
            >
              <div className="dashboard-explore-image dashboard-explore-local">
                <span>🏪</span>
              </div>

              <div className="dashboard-explore-content">
                <span>
                  LOCAL TOURISM
                </span>

                <h3>
                  Local Experiences
                </h3>

                <p>
                  Discover local food, guides, shopping and
                  activities around your destination.
                </p>

                <strong>
                  Explore →
                </strong>
              </div>
            </Link>

          </div>

        </section>


        {/* QUICK ACTION */}
        <section className="dashboard-quick-plan">

          <div>
            <span>
              READY FOR YOUR NEXT JOURNEY?
            </span>

            <h2>
              Create a fresh travel plan
            </h2>

            <p>
              Build your itinerary, select a hotel, explore
              local experiences and confirm your trip.
            </p>
          </div>

          <Link
            to="/planner"
            className="dashboard-quick-plan-button"
          >
            Start Planning →
          </Link>

        </section>

      </div>
    </main>
  );
}

export default Dashboard;