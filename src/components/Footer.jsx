import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <h2>
          Travel<span>_Guruji</span>
        </h2>
        <p>
          Discover India, plan smarter journeys and
          experience more.
        </p>
      </div>

      <div className="footer-links">

        <div>
          <h4>Explore</h4>
          <Link to="/destinations">
            Destinations
          </Link>

          <Link to="/hotels">
            Hotels
          </Link>

          <Link to="/activities">
            Activities
          </Link>
        </div>

        <div>
          <h4>Plan</h4>
          <Link to="/planner">
            Plan Your Trip
          </Link>

          <Link to="/student-planner">
            Student Planner
          </Link>

          <Link to="/login">
            Login
          </Link>
          <Link to="/register">
            Register
          </Link>
        </div>

        <div>
          <h4>Safety & Crisis</h4>
          <Link to="/weather" style={{ color: "#38bdf8", fontWeight: "700" }}>
            🌦️ Weather & Disaster Radar
          </Link>
          <Link to="/emergency" style={{ color: "#ef4444", fontWeight: "700" }}>
            🚨 Disaster & Emergency Hub
          </Link>
          <Link to="/safety">
            🛡️ Women Safety & SOS
          </Link>
          <Link to="/protected-booking">
            🔒 Escrow Booking Guarantee
          </Link>
        </div>
      </div>
    </footer>
  );
}
export default Footer;