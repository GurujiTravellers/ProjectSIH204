import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function FloatingEmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide on the emergency hub itself to avoid redundancy
  if (location.pathname === "/emergency-hub") {
    return null;
  }

  function handleShareLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const msg = `EMERGENCY ALERT: I need immediate assistance! My live GPS coordinates: https://maps.google.com/?q=${lat},${lng}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
        },
        () => {
          const msg = `EMERGENCY ALERT: I need immediate assistance! Please contact emergency services 112.`;
          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
        }
      );
    } else {
      window.open(`https://wa.me/?text=EMERGENCY%20ALERT:%20Need%20assistance!`, "_blank");
    }
  }

  return (
    <div className="tg-floating-sos-container" aria-label="Emergency SOS Quick Action">
      {isOpen && (
        <div className="tg-sos-menu animate-fade-in">
          <div className="tg-sos-menu-header">
            <span className="tg-sos-live-dot"></span>
            <strong>Traveler Safety Hub</strong>
          </div>
          <Link
            to="/emergency-hub"
            className="tg-sos-menu-item"
            onClick={() => setIsOpen(false)}
          >
            <span className="item-icon">🚨</span>
            <div>
              <span className="item-title">Disaster & Relief Radar</span>
              <small>Live NDRF/SDRF Alerts</small>
            </div>
          </Link>
          <Link
            to="/safety"
            className="tg-sos-menu-item"
            onClick={() => setIsOpen(false)}
          >
            <span className="item-icon">🛡️</span>
            <div>
              <span className="item-title">Women Safety Intelligence</span>
              <small>Helplines 112 & 1090</small>
            </div>
          </Link>
          <button
            type="button"
            className="tg-sos-menu-item tg-sos-whatsapp-btn"
            onClick={handleShareLocation}
          >
            <span className="item-icon">📍</span>
            <div>
              <span className="item-title">1-Tap WhatsApp SOS Location</span>
              <small>Shares live GPS with trusted contacts</small>
            </div>
          </button>
        </div>
      )}

      <button
        type="button"
        className={`tg-floating-sos-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        title="Emergency SOS & Safety Hub"
      >
        <span className="tg-sos-pulse-ring"></span>
        <span className="tg-sos-pulse-ring-2"></span>
        <span className="tg-sos-icon">{isOpen ? "✕" : "🛡️"}</span>
        <span className="tg-sos-label">SOS</span>
      </button>
    </div>
  );
}
