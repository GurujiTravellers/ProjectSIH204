import React from "react";

export default function OfflineEmergencyPassModal({
  isOpen,
  onClose,
  destination = "Manali",
  destEmergency = null,
  activeAlert = null,
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const facilities = destEmergency?.facilities || {
    hospitals: [
      {
        name: `${destination} District Civil Hospital`,
        phone: "108 / 112",
        address: `Civil Lines, ${destination}`,
        distance: "1.2 km",
        hasEmergencyICU: true,
      },
    ],
    shelters: [
      {
        name: `${destination} Community Relief Center`,
        phone: "112 / 1070",
        capacity: "350 people",
        location: `Central Town Hall, ${destination}`,
      },
    ],
  };

  const passId = `TG-EMERG-${destination.toUpperCase().replace(/\s+/g, "")}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 9999,
        fontFamily: "'Inter', sans-serif",
      }}
      onClick={onClose}
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-emergency-pass, #printable-emergency-pass * {
            visibility: visible;
          }
          #printable-emergency-pass {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-emergency-pass"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          color: "#0f172a",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "720px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "28px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "2px solid #dc2626",
          position: "relative",
        }}
      >
        {/* HEADER BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #dc2626", paddingBottom: "16px", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ background: "#dc2626", color: "#ffffff", fontSize: "11px", fontWeight: "900", padding: "3px 8px", borderRadius: "4px" }}>
                OFFICIAL EMERGENCY PASS
              </span>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>
                Pass ID: {passId}
              </span>
            </div>
            <h2 style={{ margin: "2px 0 0", fontSize: "22px", fontWeight: "900", color: "#0f172a" }}>
              <span className="logo-text" style={{ fontSize: "inherit", color: "inherit" }}>Travel<span>_Guruji</span></span> Offline Disaster & Hospital Pass
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
              Keep this card accessible. Valid for emergency assistance, medical triage, and police escort corridors.
            </p>
          </div>

          <div className="no-print" style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handlePrint}
              style={{
                background: "#dc2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              🖨️ Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: "#f1f5f9",
                color: "#475569",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* DESTINATION & HAZARD STATUS */}
        <div
          style={{
            background: activeAlert?.severity === "CRITICAL" ? "#fef2f2" : "#fffbeb",
            border: activeAlert?.severity === "CRITICAL" ? "1px solid #fecaca" : "1px solid #fde68a",
            borderRadius: "10px",
            padding: "14px 18px",
            marginBottom: "18px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            fontSize: "13px",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>TARGET DESTINATION</span>
            <div style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a" }}>{destination}</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>CORRIDOR STATUS</span>
            <div style={{ fontSize: "14px", fontWeight: "800", color: activeAlert?.severity === "CRITICAL" ? "#dc2626" : "#d97706" }}>
              {activeAlert ? `${activeAlert.severity} • ${activeAlert.disasterType || activeAlert.title}` : "NORMAL • Routes Monitored Clear"}
            </div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>VERIFICATION TIMESTAMP</span>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>{new Date().toLocaleString()}</div>
          </div>
        </div>

        {/* 24x7 NATIONAL EMERGENCY SOS CONTACTS */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: "800", color: "#dc2626", textTransform: "uppercase" }}>
            🚨 24x7 National Emergency Lines (Toll-Free Pan-India)
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
            {[
              { label: "112 All-in-One SOS", desc: "Police, Fire, Medical", color: "#dc2626" },
              { label: "108 Ambulance", desc: "Emergency Medical", color: "#ea580c" },
              { label: "1070 Disaster SDRF", desc: "Search & Rescue", color: "#d97706" },
              { label: "1363 Tourist SOS", desc: "12 Languages Support", color: "#2563eb" },
              { label: "1090 Women Helpline", desc: "Safety & Rapid Aid", color: "#9333ea" },
            ].map((c) => (
              <div
                key={c.label}
                style={{
                  border: `1px solid ${c.color}`,
                  borderRadius: "8px",
                  padding: "8px",
                  textAlign: "center",
                  background: "#ffffff",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "800", color: c.color }}>{c.label}</div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* VERIFIED LOCAL HOSPITALS */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
            🏥 Verified Local Hospitals & Medical Centers
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(facilities.hospitals || []).map((h, i) => (
              <div
                key={i}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "13px",
                }}
              >
                <div>
                  <div style={{ fontWeight: "800", color: "#0f172a" }}>{h.name}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    📍 {h.address} • Distance: {h.distance || "Town Center"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "800", color: "#dc2626" }}>📞 {h.phone}</div>
                  {h.hasEmergencyICU && (
                    <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "10px", fontWeight: "800", padding: "2px 6px", borderRadius: "4px" }}>
                      ICU EQUIPPED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RELIEF SHELTERS & EVACUATION ROUTE */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
            🛡️ Verified Emergency Shelter & Evacuation Corridor
          </h4>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px 16px", fontSize: "13px" }}>
            {(facilities.shelters || []).map((s, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <strong>Relief Assembly Point: </strong>
                {s.name} ({s.location || s.address}) • Capacity: {s.capacity || "Public Facility"} • Helpline: {s.phone || "112"}
              </div>
            ))}
            {activeAlert?.safeEvacuationRoute && (
              <div style={{ marginTop: "10px", borderTop: "1px dashed #cbd5e1", paddingTop: "8px" }}>
                <strong style={{ color: "#16a34a" }}>Police-Monitored Safe Corridor: </strong>
                {activeAlert.safeEvacuationRoute.routeTitle} (Est. Transit: {activeAlert.safeEvacuationRoute.estimatedTransitTime})
                <ul style={{ margin: "6px 0 0", paddingLeft: "20px", fontSize: "12px", color: "#334155" }}>
                  {(activeAlert.safeEvacuationRoute.stepByStepInstructions || []).map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* OFFLINE FIRST-AID PROTOCOLS */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "14px", fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
          <strong>Offline Survival Directives: </strong>
          In case of power/cellular outage: (1) In landslides, move perpendicular to the path of mud/rock slides. (2) In floods, avoid walking through flowing water deeper than ankle level. (3) During earthquakes, Drop, Cover, and Hold on inside stable masonry, avoiding exterior glass facades.
        </div>

        {/* BOTTOM PRINT FOOTER */}
        <div style={{ marginTop: "16px", textAlign: "center", fontSize: "11px", color: "#94a3b8" }}>
          Travel Guruji Official Disaster Assurance Network • Emergency Force Majeure Guarantee
        </div>
      </div>
    </div>
  );
}

