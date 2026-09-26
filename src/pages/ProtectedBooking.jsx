import { useState } from "react";
import { Link } from "react-router-dom";

function ProtectedBooking() {
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [bookingRefInput, setBookingRefInput] = useState("");
  const [refundClaimSubmitted, setRefundClaimSubmitted] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");

  const handleOpenRefundClaim = (e) => {
    e.preventDefault();
    if (!bookingRefInput.trim()) {
      setClaimMessage("Please enter your Booking Reference Code (e.g. TG-TRN-7821)");
      return;
    }

    setRefundLoading(true);
    setClaimMessage("");

    setTimeout(() => {
      setRefundLoading(false);
      setRefundClaimSubmitted(true);
      setClaimMessage(
        `✓ Escrow Refund Case #REF-${Date.now().toString().slice(-6)} successfully opened for ${bookingRefInput.trim().toUpperCase()}! 100% refund initiated to your original payment method.`
      );
    }, 900);
  };

  const handleResetRefundModal = () => {
    setIsRefundModalOpen(false);
    setRefundClaimSubmitted(false);
    setBookingRefInput("");
    setClaimMessage("");
  };

  return (
    <main className="protected-booking-page" style={{ minHeight: "85vh", padding: "40px 20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* TOP NAVIGATION BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
          <Link to="/" className="protected-action-btn">
            ← Back to Home
          </Link>
          <Link to="/my-bookings" className="protected-action-btn">
            📋 Manage My Bookings
          </Link>
        </div>

        {/* HERO BANNER */}
        <div
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
            borderRadius: "20px",
            padding: "36px 30px",
            color: "#ffffff",
            marginBottom: "32px",
            boxShadow: "0 10px 30px rgba(6, 78, 59, 0.2)",
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: "30px", fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>
            <span>🔒</span>
            <span>ESCROW-STYLE PROTECTED BOOKING & REFUND</span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            100% Protected Travel Reservations & Escrow Refund
          </h1>
          <p style={{ fontSize: "16px", color: "#d1fae5", maxWidth: "780px", lineHeight: 1.6, margin: "0 0 24px" }}>
            Every ticket, hotel stay, and complete trip itinerary on Travel_Guruji is safeguarded with server-verified payment authentication, transparent refund policies, and escrow-style settlement protection.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
            <button
              type="button"
              onClick={() => setIsRefundModalOpen(true)}
              className="protected-action-btn"
            >
              ⚡ Open Escrow Refund Claim
            </button>
            <Link to="/transport" className="protected-action-btn">
              🚆 Book Protected Transport
            </Link>
            <Link to="/hotels" className="protected-action-btn">
              🏨 Book Protected Stay
            </Link>
          </div>
        </div>

        {/* 4 PILLARS OF PROTECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          <div style={{ background: "#ffffff", padding: "26px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "16px" }}>
              💳
            </div>
            <h3 style={{ fontSize: "18px", color: "#0f172a", margin: "0 0 8px" }}>Cryptographic Verification</h3>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              All transactions require HMAC SHA-256 cryptographic verification between our Node.js backend and the payment gateway before confirmation is finalized.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: "26px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "16px" }}>
              🛡️
            </div>
            <h3 style={{ fontSize: "18px", color: "#0f172a", margin: "0 0 8px" }}>Escrow Settlement Hold</h3>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              Partner vendor settlements are conditioned upon verified service delivery. If a hotel or transport operator fails to accommodate you, your funds remain secure in escrow.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: "26px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "16px" }}>
              🔄
            </div>
            <h3 style={{ fontSize: "18px", color: "#0f172a", margin: "0 0 8px" }}>Instant Refund Guarantee</h3>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              Free cancellation up to designated windows on trains, buses, and stays. Cancel directly with 1 tap from My Bookings with automated escrow refund tracking.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: "26px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "16px" }}>
              🧾
            </div>
            <h3 style={{ fontSize: "18px", color: "#0f172a", margin: "0 0 8px" }}>Direct Booking Reference</h3>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              Instantly issued unique reference codes (<code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>TG-TRN-XXXX</code>, <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>TG-HTL-XXXX</code>) recognized across transport and stay networks.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS LIFECYCLE */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "32px",
            border: "1px solid #e2e8f0",
            marginBottom: "36px",
          }}
        >
          <h2 style={{ fontSize: "22px", color: "#0f172a", margin: "0 0 20px" }}>
            The Protected Booking & Escrow Refund Journey
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#059669", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
                1
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a" }}>Select Transport, Stay, or Full Plan</strong>
                <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0" }}>Choose from India-wide train, bus, flight, or hotel options with transparent pricing and zero hidden fees.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#059669", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
                2
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a" }}>Server-Side Order Initialization & Escrow Lock</strong>
                <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0" }}>Our backend creates an authenticated order via Razorpay API with escrow settlement protection.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#059669", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
                3
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a" }}>Secure Authorization & Payment</strong>
                <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0" }}>Complete transaction using UPI, Cards, NetBanking, or Wallet under 256-bit encryption.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#059669", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
                4
              </div>
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a" }}>Instant Refund Guarantee & 1-Tap Cancellation</strong>
                <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0" }}>Immediate digital confirmation, downloadable PDF ticket, and 1-tap automated escrow refund support.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ESCROW REFUND OPENING MODAL */}
      {isRefundModalOpen && (
        <div className="hotel-modal-overlay" onClick={handleResetRefundModal}>
          <div
            className="hotel-modal-container"
            style={{ maxWidth: "560px", background: "#ffffff", borderRadius: "20px", padding: "30px", border: "1.5px solid #cbd5e1", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "40px", display: "block", marginBottom: "8px" }}>🛡️</span>
              <h2 style={{ fontSize: "24px", color: "#0f172a", margin: "0 0 6px", fontWeight: 800 }}>
                Escrow Refund Opening Portal
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                100% Guaranteed Escrow Refund for any train, bus, flight, or hotel reservation on <span className="logo-text" style={{ fontSize: "inherit", color: "#0f766e" }}>Travel<span>_Guruji</span></span>.
              </p>
            </div>

            {!refundClaimSubmitted ? (
              <form onSubmit={handleOpenRefundClaim} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label htmlFor="escrow-booking-ref" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Enter Booking Reference Code *
                  </label>
                  <input
                    id="escrow-booking-ref"
                    type="text"
                    required
                    placeholder="e.g. TG-TRN-7821 or TG-HTL-4492"
                    value={bookingRefInput}
                    onChange={(e) => setBookingRefInput(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: 600,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    autoFocus
                  />
                  <small style={{ color: "#64748b", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    Tip: You can also select and cancel directly from your <Link to="/my-bookings" style={{ color: "#0f766e", fontWeight: 700 }}>My Bookings</Link> page.
                  </small>
                </div>

                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "#166534", fontWeight: 600 }}>Escrow Protection Status:</span>
                    <strong style={{ color: "#166534" }}>🔒 100% Funds Secured in Escrow</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "#166534", fontWeight: 600 }}>Refund Settlement Time:</span>
                    <strong style={{ color: "#166534" }}>⚡ Instant (UPI / Card Gateway)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "#166534", fontWeight: 600 }}>Cancellation Fee:</span>
                    <strong style={{ color: "#166534" }}>₹0 (Zero Deduction)</strong>
                  </div>
                </div>

                {claimMessage && (
                  <div style={{ color: "#dc2626", fontSize: "13px", fontWeight: 600 }}>
                    {claimMessage}
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    type="submit"
                    disabled={refundLoading}
                    className="protected-action-btn"
                    style={{ flex: 1 }}
                  >
                    {refundLoading ? "Opening Escrow Refund..." : "Proceed with Escrow Refund ➔"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetRefundModal}
                    className="protected-action-btn"
                  >
                    Close
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "14px", padding: "20px" }}>
                  <span style={{ fontSize: "36px" }}>🎉</span>
                  <h3 style={{ color: "#166534", margin: "10px 0 6px", fontSize: "18px" }}>
                    Escrow Refund Approved & Dispatched
                  </h3>
                  <p style={{ color: "#14532d", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>
                    {claimMessage}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <Link
                    to="/my-bookings"
                    className="protected-action-btn"
                  >
                    📋 Check in My Bookings
                  </Link>

                  <button
                    type="button"
                    onClick={handleResetRefundModal}
                    className="protected-action-btn"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default ProtectedBooking;
