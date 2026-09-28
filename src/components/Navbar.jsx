import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef(null);

  // Dynamic transport vehicle animation state (Flight / Bus / Train) - Single Pass, Slower Speed
  const [vehicleAnim, setVehicleAnim] = useState({
    animating: false,
    vehicle: "flight",
  });
  const isAnimatingLogoRef = useRef(false);
  const logoTimerRef = useRef(null);

  function triggerLogoAnimation() {
    // Only perform one time per cursor movement
    if (isAnimatingLogoRef.current) return;
    isAnimatingLogoRef.current = true;

    if (logoTimerRef.current) {
      clearTimeout(logoTimerRef.current);
    }

    // Randomly select vehicle: Flight, Bus, or Train
    const vehicles = ["flight", "bus", "train"];
    const chosen = vehicles[Math.floor(Math.random() * vehicles.length)];

    // Single pass animation across the text
    setVehicleAnim({
      animating: true,
      vehicle: chosen,
    });

    // Complete after reduced-speed 1.9s single pass and stop cleanly
    logoTimerRef.current = setTimeout(() => {
      setVehicleAnim({
        animating: false,
        vehicle: chosen,
      });
      isAnimatingLogoRef.current = false;
    }, 1950);
  }

  // Cleanup logo timer on unmount
  useEffect(() => {
    return () => {
      if (logoTimerRef.current) {
        clearTimeout(logoTimerRef.current);
      }
    };
  }, []);

  // Track scroll for sticky glassmorphic elevation
  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowMenu(false);
  }, [location.pathname]);

  // Load user from localStorage first
  function loadStoredUser() {
    const token = localStorage.getItem("travelGurujiToken");
    const storedUser = localStorage.getItem("travelGurujiUser");

    if (!token || !storedUser) {
      setUser(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      setUser(null);
    }
  }

  // Verify user with backend
  async function verifyUser() {
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const data = await getCurrentUser();
      setUser(data.user);
      localStorage.setItem("travelGurujiUser", JSON.stringify(data.user));
    } catch (error) {
      localStorage.removeItem("travelGurujiToken");
      localStorage.removeItem("travelGurujiUser");
      setUser(null);
    }
  }

  // Initial load
  useEffect(() => {
    loadStoredUser();
    verifyUser();
  }, []);

  // When a NEW user logs in
  useEffect(() => {
    function handleLogin() {
      setShowMenu(false);
      loadStoredUser();
      verifyUser();
    }

    window.addEventListener("travelGurujiLogin", handleLogin);
    return () => {
      window.removeEventListener("travelGurujiLogin", handleLogin);
    };
  }, []);

  // When profile is updated
  useEffect(() => {
    function handleProfileUpdate() {
      verifyUser();
    }

    window.addEventListener("travelGurujiProfileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("travelGurujiProfileUpdated", handleProfileUpdate);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Logout
  function handleLogout() {
    localStorage.removeItem("travelGurujiToken");
    localStorage.removeItem("travelGurujiUser");
    setUser(null);
    setShowMenu(false);
    setMobileMenuOpen(false);
    navigate("/");
  }

  function getInitial() {
    if (!user?.name) return "?";
    return user.name.charAt(0).toUpperCase();
  }

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        {/* LOGO */}
        <Link
          to="/"
          className="logo"
          onMouseEnter={triggerLogoAnimation}
          title="Travel Guruji - Click for Home"
        >
          <img
            src="/favicon.svg"
            alt="Travel Guruji"
            className="navbar-logo-image"
          />
          <span className="logo-text-wrapper">
            <span
              className={`logo-text ${
                vehicleAnim.animating ? "logo-animating" : ""
              }`}
            >
              Travel<span>_Guruji</span>
            </span>

            {vehicleAnim.animating && (
              <span
                key={vehicleAnim.vehicle}
                className="logo-vehicle-runner"
              >
                <span
                  className={`logo-vehicle-trail trail-${vehicleAnim.vehicle}`}
                ></span>
                <span
                  className={`logo-vehicle-icon vehicle-${vehicleAnim.vehicle}`}
                >
                  {vehicleAnim.vehicle === "flight" && (
                    <svg viewBox="0 0 56 32" width="54" height="32" fill="none" className="vehicle-svg plane-svg">
                      <path d="M0 16h10" stroke="rgba(67, 215, 156, 0.6)" strokeWidth="3" strokeLinecap="round" />
                      <path
                        d="M6 16c0-2.5 3-4 7-4h26c7 0 12 2.5 15 4-3 1.5-8 4-15 4H13c-4 0-7-1.5-7-4z"
                        fill="#ffffff"
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                      <path d="M24 14L15 3h7l12 11h-10z" fill="#0284c7" stroke="#0f172a" strokeWidth="1.2" />
                      <rect x="22" y="19" width="9" height="3.5" rx="1.5" fill="#334155" stroke="#0f172a" strokeWidth="1"/>
                      <path d="M27 18l-7 11h6.5l8.5-11H27z" fill="#0284c7" stroke="#0f172a" strokeWidth="1.2" />
                      <path d="M9 12L4 3h7l5 9H9z" fill="#43d79c" stroke="#0f172a" strokeWidth="1.2" />
                      <path d="M48 15h4.5c.7 0 1.2.6.8 1.2-.6.9-1.8 1.3-3.3 1.3h-2v-2.5z" fill="#0f172a" />
                      <circle cx="20" cy="16" r="1.2" fill="#0284c7"/>
                      <circle cx="24" cy="16" r="1.2" fill="#0284c7"/>
                      <circle cx="28" cy="16" r="1.2" fill="#0284c7"/>
                      <circle cx="32" cy="16" r="1.2" fill="#0284c7"/>
                      <circle cx="36" cy="16" r="1.2" fill="#0284c7"/>
                      <circle cx="40" cy="16" r="1.2" fill="#0284c7"/>
                    </svg>
                  )}
                  {vehicleAnim.vehicle === "bus" && (
                    <svg viewBox="0 0 56 32" width="54" height="32" fill="none" className="vehicle-svg bus-svg">
                      <rect x="4" y="6" width="46" height="19" rx="4" fill="#f59e0b" stroke="#1f2937" strokeWidth="1.8"/>
                      <path d="M38 9h9c1.5 0 2.5 1 2.8 2.5l.7 4.5H38V9z" fill="#0284c7" stroke="#1f2937" strokeWidth="1"/>
                      <rect x="30" y="9" width="6.5" height="7" rx="1.5" fill="#e0f2fe" stroke="#1f2937" strokeWidth="0.8"/>
                      <rect x="22" y="9" width="6.5" height="7" rx="1.5" fill="#e0f2fe" stroke="#1f2937" strokeWidth="0.8"/>
                      <rect x="14" y="9" width="6.5" height="7" rx="1.5" fill="#e0f2fe" stroke="#1f2937" strokeWidth="0.8"/>
                      <rect x="6.5" y="9" width="6" height="7" rx="1.5" fill="#e0f2fe" stroke="#1f2937" strokeWidth="0.8"/>
                      <rect x="4" y="19" width="46" height="2.5" fill="#047857"/>
                      <path d="M50 20h1.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H50v-3z" fill="#fef08a"/>
                      <rect x="2.5" y="20" width="1.5" height="3" rx="0.5" fill="#ef4444"/>
                      <circle cx="41" cy="25" r="4.5" fill="#1f2937"/>
                      <circle cx="41" cy="25" r="2" fill="#d1d5db"/>
                      <circle cx="14" cy="25" r="4.5" fill="#1f2937"/>
                      <circle cx="14" cy="25" r="2" fill="#d1d5db"/>
                    </svg>
                  )}
                  {vehicleAnim.vehicle === "train" && (
                    <svg viewBox="0 0 58 32" width="56" height="32" fill="none" className="vehicle-svg train-svg">
                      <path
                        d="M4 24V9c0-2.2 1.8-3.5 3.5-3.5H38c7 0 12.5 4 16 10.5l1.5 3.5c.5 1.5-.6 2.5-2.2 2.5H4z"
                        fill="#06b6d4"
                        stroke="#1f2937"
                        strokeWidth="1.8"
                      />
                      <path d="M38 8.5h4c4 0 7.5 3.5 9 8.5L40 16.5V8.5z" fill="#0f172a"/>
                      <rect x="28" y="9.5" width="8" height="6.5" rx="1.5" fill="#e0f2fe" stroke="#1f2937" strokeWidth="0.8"/>
                      <rect x="18" y="9.5" width="8" height="6.5" rx="1.5" fill="#e0f2fe" stroke="#1f2937" strokeWidth="0.8"/>
                      <rect x="8" y="9.5" width="8" height="6.5" rx="1.5" fill="#e0f2fe" stroke="#1f2937" strokeWidth="0.8"/>
                      <line x1="4" y1="19.5" x2="52" y2="19.5" stroke="#ffffff" strokeWidth="2.5"/>
                      <line x1="4" y1="21.5" x2="48" y2="21.5" stroke="#0284c7" strokeWidth="1.5"/>
                      <circle cx="12" cy="25.5" r="3.5" fill="#1f2937"/>
                      <circle cx="12" cy="25.5" r="1.5" fill="#94a3b8"/>
                      <circle cx="21" cy="25.5" r="3.5" fill="#1f2937"/>
                      <circle cx="21" cy="25.5" r="1.5" fill="#94a3b8"/>
                      <circle cx="39" cy="25.5" r="3.5" fill="#1f2937"/>
                      <circle cx="39" cy="25.5" r="1.5" fill="#94a3b8"/>
                    </svg>
                  )}
                </span>
              </span>
            )}
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>

          <NavLink to="/destinations" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Destinations
          </NavLink>

          <NavLink to="/hotels" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Hotels
          </NavLink>

          <NavLink to="/transport" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Transport
          </NavLink>

          <NavLink to="/activities" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Activities
          </NavLink>

          <NavLink to="/planner" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Plan Trip
          </NavLink>

          <NavLink to="/weather" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Weather & Radar
          </NavLink>

          {user && (
            <>
              <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                My Bookings
              </NavLink>

              <NavLink to="/plan-history" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Plan History
              </NavLink>
            </>
          )}
        </div>

        {/* RIGHT SIDE / USER AREA */}
        <div className="navbar-right-container">
          {!user ? (
            <Link to="/login" className="login-button">
              Login
            </Link>
          ) : (
            <div className="navbar-user-area" ref={profileRef}>
              <button
                type="button"
                className="profile-avatar-button"
                onClick={() => setShowMenu((prev) => !prev)}
                aria-expanded={showMenu}
                aria-label="User account menu"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="profile-avatar-image"
                  />
                ) : (
                  <span className="profile-avatar-placeholder">{getInitial()}</span>
                )}
              </button>

              <span className="navbar-greeting">Hi, {user.name.split(" ")[0]}</span>

              {/* USER DROPDOWN */}
              {showMenu && (
                <div className="profile-dropdown animate-fade-in">
                  <div className="profile-dropdown-user">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="profile-dropdown-image"
                      />
                    ) : (
                      <div className="profile-dropdown-placeholder">{getInitial()}</div>
                    )}
                    <div className="profile-dropdown-user-info">
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                    </div>
                  </div>

                  <div className="profile-dropdown-line"></div>

                  <Link to="/profile" className="profile-menu-item" onClick={() => setShowMenu(false)}>
                    <span className="profile-menu-icon">👁️</span>
                    <span>View Profile</span>
                  </Link>

                  <Link to="/profile/edit" className="profile-menu-item" onClick={() => setShowMenu(false)}>
                    <span className="profile-menu-icon">✏️</span>
                    <span>Edit Profile</span>
                  </Link>

                  <Link to="/my-bookings" className="profile-menu-item" onClick={() => setShowMenu(false)}>
                    <span className="profile-menu-icon">🎫</span>
                    <span>My Bookings</span>
                  </Link>

                  <Link to="/plan-history" className="profile-menu-item" onClick={() => setShowMenu(false)}>
                    <span className="profile-menu-icon">📋</span>
                    <span>Plan History</span>
                  </Link>

                  <Link to="/student-planner" className="profile-menu-item" onClick={() => setShowMenu(false)}>
                    <span className="profile-menu-icon">🎓</span>
                    <span>Student Travel Portal</span>
                  </Link>

                  <Link to="/my-trips" className="profile-menu-item" onClick={() => setShowMenu(false)}>
                    <span className="profile-menu-icon">🗺️</span>
                    <span>My Journey Hub</span>
                  </Link>

                  <Link
                    to="/emergency-hub"
                    className="profile-menu-item"
                    style={{ color: "#dc2626" }}
                    onClick={() => setShowMenu(false)}
                  >
                    <span className="profile-menu-icon">🚨</span>
                    <span style={{ fontWeight: 700 }}>Emergency & Crisis Hub</span>
                  </Link>

                  <button type="button" className="profile-menu-item profile-logout" onClick={handleLogout}>
                    <span className="profile-menu-icon">↪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* HAMBURGER TOGGLE BUTTON FOR MOBILE */}
          <button
            type="button"
            className={`navbar-hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      {/* MOBILE SLIDE-OUT DRAWER */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="navbar-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="navbar-mobile-header">
              <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                <img src="/favicon.svg" alt="Travel Guruji" className="navbar-logo-image" />
                <span className="logo-text">
                  Travel<span>_Guruji</span>
                </span>
              </Link>
              <button
                type="button"
                className="navbar-mobile-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="navbar-mobile-links">
              <NavLink to="/" end className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">🏠</span> Home
              </NavLink>

              <NavLink to="/destinations" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">📍</span> Destinations
              </NavLink>

              <NavLink to="/hotels" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">🏨</span> Hotels & Stays
              </NavLink>

              <NavLink to="/transport" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">🚆</span> Transport
              </NavLink>

              <NavLink to="/activities" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">🏄</span> Activities
              </NavLink>

              <NavLink to="/planner" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">🗺️</span> Plan Trip
              </NavLink>

              <div className="mobile-divider"></div>

              <NavLink to="/student-planner" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">🎓</span> Student Trip Planner
              </NavLink>

              <NavLink to="/safety" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">🛡️</span> Women Safety Hub
              </NavLink>

              <NavLink to="/weather" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">🌦️</span> Weather & Disaster Radar
              </NavLink>

              <NavLink to="/emergency-hub" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <span className="mobile-icon">🚨</span> Emergency & SOS Radar
              </NavLink>
            </div>

            <div className="navbar-mobile-footer">
              {user ? (
                <div className="navbar-mobile-user">
                  <div className="mobile-user-info">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="profile-avatar-image" />
                    ) : (
                      <span className="profile-avatar-placeholder">{getInitial()}</span>
                    )}
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>

                  <div className="mobile-user-actions">
                    <Link to="/my-bookings" className="mobile-action-link" onClick={() => setMobileMenuOpen(false)}>
                      🎫 My Bookings
                    </Link>
                    <Link to="/plan-history" className="mobile-action-link" onClick={() => setMobileMenuOpen(false)}>
                      📋 Plan History
                    </Link>
                    <Link to="/profile" className="mobile-action-link" onClick={() => setMobileMenuOpen(false)}>
                      👤 Profile
                    </Link>
                    <button type="button" className="mobile-logout-btn" onClick={handleLogout}>
                      Logout ➔
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="mobile-login-btn" onClick={() => setMobileMenuOpen(false)}>
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;