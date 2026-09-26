import { useState } from "react";

function SafetyIntelligence({ destination = "Shimla" }) {
  const [sosActive, setSosActive] = useState(false);
  const [copied, setCopied] = useState(false);

  // Regional emergency overrides
  const isMountain = ["shimla", "manali", "kasol", "kaza", "chitkul", "kalpa", "srinagar", "gulmarg", "pahalgam", "mussoorie", "darjeeling"].some(
    (m) => destination.toLowerCase().includes(m)
  );

  const isCoastal = ["goa", "puri", "digha", "konark"].some((c) =>
    destination.toLowerCase().includes(c)
  );

  const isDesertOrHeritage = ["jaipur", "jaisalmer", "varanasi", "agra", "delhi"].some((h) =>
    destination.toLowerCase().includes(h)
  );

  const emergencyContacts = [
    { title: "National All-in-One Emergency", number: "112", icon: "🚨", available: "24x7 Pan-India" },
    { title: "National Tourist Helpline (Multi-lingual)", number: "1363", icon: "🧭", available: "12 Languages • Toll Free" },
    { title: "Medical Emergency / Ambulance", number: "108", icon: "🚑", available: "Govt. Quick Response" },
    { title: "Women Helpline (Safety & SOS)", number: "1090", icon: "🛡️", available: "24x7 Immediate Aid" },
    ...(isMountain
      ? [{ title: "Mountain Search & Rescue / SDRF", number: "1070", icon: "🧗", available: "High Altitude Rescue" }]
      : isCoastal
      ? [{ title: "Coastal Police / Coast Guard Lifeguards", number: "1093", icon: "🌊", available: "Beach Patrol & Life Rescue" }]
      : [{ title: "Highway Patrol & Roadside Assistance", number: "1033", icon: "🛣️", available: "NHAI Highway SOS" }]),
  ];

  const terrainAdvisory = isMountain
    ? [
        "Mountain Road Safety: Avoid late-night driving across ghat sections; watch out for black ice in winter.",
        "Acclimatization: Drink plenty of water; avoid strenuous climbing within the first 6 hours of arrival.",
        "Warm Clothing: Mountain temperatures drop sharply after sunset even in summer; always carry a thermal layer.",
      ]
    : isCoastal
    ? [
        "Beach Safety Flags: Never enter water when Red Flags are hoisted by coastal lifeguards.",
        "Hydration: High coastal humidity accelerates dehydration; consume tender coconut water and electrolytes.",
        "Water Sports: Only partake in water sports operated by licensed instructors with certified lifejackets.",
      ]
    : isDesertOrHeritage
    ? [
        "Authorized Guides: Hire government-approved tour guides wearing official badges at monuments.",
        "Heat Advisory: Sightsee forts and palaces before 11:00 AM or after 04:00 PM during warm months.",
        "Safe Transit: Use authorized prepaid taxi counters at stations/airports to avoid unregulated touts.",
      ]
    : [
        "General Safety: Keep emergency numbers accessible and notify your hotel about solo hiking plans.",
        "Digital Payments: Most merchants accept UPI, but keep ₹1,000 in cash for remote local transit.",
      ];

  const handleCopySosMessage = () => {
    const text = `EMERGENCY ALERT: I am traveling in ${destination} via Travel Guruji. If you cannot reach me, my last confirmed location is ${destination}. Please contact local police (112) or Tourist Helpline (1363).`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="safety-intelligence-card">
      <div className="safety-header">
        <div className="safety-title-left">
          <span className="safety-shield-icon">🛡️</span>
          <div>
            <h3>
              <span className="logo-text" style={{ fontSize: "17px" }}>Travel<span>_Guruji</span></span> Safety & Emergency Intelligence
            </h3>
            <p>Verified Helplines & Ground Advisories for {destination}</p>
          </div>
        </div>

        <button
          type="button"
          className="safety-sos-btn"
          onClick={() => setSosActive(!sosActive)}
        >
          {sosActive ? "✕ Hide SOS Guide" : "🚨 Emergency SOS"}
        </button>
      </div>

      {/* EMERGENCY HELPLINES GRID */}
      <div className="emergency-numbers-grid">
        {emergencyContacts.map((contact) => (
          <a
            key={contact.number}
            href={`tel:${contact.number}`}
            className="emergency-contact-box"
          >
            <span className="em-icon">{contact.icon}</span>
            <div className="em-info">
              <small>{contact.available}</small>
              <strong>{contact.title}</strong>
              <span className="em-dial">Dial: {contact.number} 📞</span>
            </div>
          </a>
        ))}
      </div>

      {/* TERRAIN ADVISORY */}
      <div className="terrain-advisory-box">
        <h4>⚠️ Local Advisory for {destination}</h4>
        <ul>
          {terrainAdvisory.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* SOS MODAL POP-DOWN */}
      {sosActive && (
        <div className="sos-drawer">
          <div className="sos-drawer-content">
            <h4>🚨 Emergency Incident Protocol</h4>
            <p>
              In case of accident, medical emergency, or harassment, follow these immediate steps:
            </p>
            <ol>
              <li>Dial <strong>112</strong> immediately (connects to nearest police and ambulance unit).</li>
              <li>Share your live GPS location with family via WhatsApp.</li>
              <li>Move to a well-lit public area or nearest authorized hotel lobby.</li>
            </ol>

            <button
              type="button"
              className="copy-sos-btn"
              onClick={handleCopySosMessage}
            >
              {copied ? "✓ Copied Emergency Message to Clipboard!" : "📋 Copy SOS Message for WhatsApp"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SafetyIntelligence;

