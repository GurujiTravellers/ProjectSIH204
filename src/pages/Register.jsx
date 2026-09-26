import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "../services/api";
import SocialAuthModal from "../components/SocialAuthModal";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [socialModal, setSocialModal] = useState({
    isOpen: false,
    provider: "google",
  });

  async function handleRegister(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    if (phone.trim()) {
      const rawTrimmed = phone.trim().replace(/[\s\-()]/g, "");
      const digitsOnly = phone.trim().replace(/\D/g, "");
      const hasInvalidChars = !/^\+?\d+$/.test(rawTrimmed);

      let cleanPhone = digitsOnly;
      if (digitsOnly.length > 10 && digitsOnly.startsWith("91")) {
        cleanPhone = digitsOnly.slice(2);
      } else if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
        cleanPhone = digitsOnly.slice(1);
      } else if (digitsOnly.length > 10) {
        cleanPhone = digitsOnly.slice(-10);
      }

      if (hasInvalidChars || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        setError("Invalid mobile number");
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      const data = await registerUser(
        name.trim(),
        email.trim(),
        password,
        phone.trim()
      );

      // If backend returns auth token, automatically log user in across the app
      if (data.token && data.user) {
        localStorage.setItem("travelGurujiToken", data.token);
        localStorage.setItem("travelGurujiUser", JSON.stringify(data.user));

        window.dispatchEvent(new Event("travelGurujiLogin"));

        setSuccess(
          `Welcome to Travel_Guruji, ${data.user.name}!`
        );

        // Clear form
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");

        setTimeout(() => {
          const returnTo =
            location.state?.returnTo ||
            sessionStorage.getItem("travelGurujiReturnTo");
          try {
            sessionStorage.removeItem("travelGurujiReturnTo");
            sessionStorage.removeItem("travelGurujiRedirectState");
          } catch {
            // Ignore
          }
          if (returnTo) {
            navigate(returnTo);
          } else {
            navigate("/");
          }
        }, 1200);
      } else {
        setSuccess(
          "Registration completed! Verification email sent. Please login."
        );

        setName("");
        setEmail("");
        setPhone("");
        setPassword("");

        setTimeout(() => {
          navigate("/login", { state: location.state });
        }, 1200);
      }
    } catch (error) {
      const msg = error.message || "";
      if (
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError") ||
        msg.includes("Network request failed")
      ) {
        setError(
          "Unable to connect to Travel_Guruji server. Please check your network connection and ensure the backend is running."
        );
      } else {
        setError(msg || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSocialSuccess(data) {
    setSocialModal({ isOpen: false, provider: "google" });
    setSuccess(
      `Welcome to Travel_Guruji, ${data.user.name}!`
    );
    const returnTo =
      location.state?.returnTo ||
      sessionStorage.getItem("travelGurujiReturnTo");
    try {
      sessionStorage.removeItem("travelGurujiReturnTo");
      sessionStorage.removeItem("travelGurujiRedirectState");
    } catch {
      // Ignore
    }
    setTimeout(() => {
      if (returnTo) {
        navigate(returnTo);
      } else {
        navigate("/");
      }
    }, 1200);
  }

  return (
    <main className="auth-page auth-with-background">
      <div className="auth-background">
        <div className="auth-ambient-orb orb-1"></div>
        <div className="auth-ambient-orb orb-2"></div>
      </div>

      <div className="auth-box auth-content mmt-auth-card auth-card-animated">
        {/* TOP BRAND BADGE */}
        <div className="mmt-brand-header">
          <div className="mmt-auth-badge">
            <span className="auth-chip-dot"></span>
            <span>SECURE REGISTRATION</span>
          </div>
        </div>

        {/* TITLE SECTION */}
        <div className="mmt-title-section">
          <h1 className="mmt-auth-title">
            Create Account
          </h1>
          <p className="mmt-auth-subtitle">
            Join Travel_Guruji to plan and book verified journeys across India.
          </p>
        </div>

        {/* REGISTRATION FORM */}
        <form onSubmit={handleRegister} className="mmt-input-form">
          {/* NAME */}
          <label htmlFor="register-name" className="mmt-input-label">Full Name</label>
          <input
            id="register-name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mmt-main-input"
            style={{ marginBottom: "14px" }}
            required
          />

          {/* EMAIL */}
          <label htmlFor="register-email" className="mmt-input-label">Email Address</label>
          <input
            id="register-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mmt-main-input"
            style={{ marginBottom: "14px" }}
            required
          />

          {/* PHONE NUMBER */}
          <label htmlFor="register-phone" className="mmt-input-label">
            Mobile Number <span className="auth-optional-tag">(Optional)</span>
          </label>
          <div className="mmt-phone-input-row">
            <div className="mmt-country-code-pill">
              <span className="mmt-pill-flag">🇮🇳</span>
              <span className="mmt-pill-code">+91</span>
            </div>
            <input
              id="register-phone"
              type="tel"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mmt-main-input"
            />
          </div>

          {/* PASSWORD */}
          <label htmlFor="register-password" className="mmt-input-label" style={{ marginTop: "4px" }}>Password</label>
          <div className="password-input-wrapper" style={{ marginBottom: "6px" }}>
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter exactly 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={8}
              pattern=".{8}"
              title="Password must contain exactly 8 characters."
              required
            />

            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "😯" : "😎"}
            </button>
          </div>

          <small className="password-rule" style={{ marginBottom: "16px" }}>
            Password must be exactly 8 characters
          </small>

          {error && <p className="auth-error-msg">{error}</p>}
          {success && <p className="auth-success-msg">{success}</p>}

          <button
            type="submit"
            className="mmt-primary-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account ➔"}
          </button>
        </form>

        <div className="mmt-divider">
          <span>or continue with</span>
        </div>

        {/* SOCIAL AUTH BUTTONS */}
        <div className="social-login-buttons mmt-social-grid">
          <button
            type="button"
            className="social-login-button google-auth-btn"
            onClick={() => setSocialModal({ isOpen: true, provider: "google" })}
            aria-label="Continue with Google"
          >
            <span className="social-icon-wrapper google-icon-wrap">
              <svg className="social-svg-icon google-svg-icon" viewBox="0 0 48 48" width="20" height="20">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </span>
            <span className="social-btn-text">Continue with Google</span>
          </button>

          <button
            type="button"
            className="social-login-button facebook-auth-btn"
            onClick={() => setSocialModal({ isOpen: true, provider: "facebook" })}
            aria-label="Continue with Facebook"
          >
            <span className="social-icon-wrapper facebook-icon-wrap">
              <svg className="social-svg-icon facebook-svg-icon" viewBox="0 0 24 24" width="16" height="16">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
              </svg>
            </span>
            <span className="social-btn-text">Continue with Facebook</span>
          </button>
        </div>

        <p className="auth-link" style={{ marginTop: "18px" }}>
          Already have an account?{" "}
          <Link to="/login" state={location.state}>
            Sign In
          </Link>
        </p>
      </div>

      <SocialAuthModal
        isOpen={socialModal.isOpen}
        provider={socialModal.provider}
        onClose={() => setSocialModal({ isOpen: false, provider: "google" })}
        onSuccess={handleSocialSuccess}
      />
    </main>
  );
}

export default Register;