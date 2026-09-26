import fs from 'fs';
import path from 'path';

// Read existing disasterDatabase.js
const currentFilePath = path.resolve('backend/data/disasterDatabase.js');
let currentContent = fs.readFileSync(currentFilePath, 'utf-8');

const additionalFacilities = {
  "Leh Ladakh": {
    disasterStatus: "RESTRICTED",
    isDisasterZone: false,
    hospitals: [
      { name: "Sonam Norboo Memorial (SNM) Hospital Leh", type: "District Apex Hospital & High-Altitude Trauma", phone: "+91 1982 252014", address: "Skara Road, Leh, Ladakh", distance: "1.5 km", hasEmergencyICU: true },
      { name: "153 General Hospital (Indian Army)", type: "Military High-Altitude Medical Center", phone: "+91 1982 252112", address: "Military Station, Leh", distance: "3.0 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "NDRF 13th Battalion Base & Relief Camp", capacity: "600 people", phone: "+91 1982 255555", location: "Choglamsar, Leh" },
      { name: "Polo Ground Emergency Evacuation Point", capacity: "1,500 people", phone: "112", location: "Main Bazaar, Leh" }
    ],
    localHelplines: [
      { role: "UT Ladakh Disaster Control Room", phone: "1070" },
      { role: "Tourist Police Leh", phone: "+91 1982 252018" },
      { role: "BRO High Mountain Pass Clearance", phone: "+91 1982 252324" }
    ]
  },
  "Kerala": {
    disasterStatus: "NORMAL",
    isDisasterZone: false,
    hospitals: [
      { name: "Ernakulam Government General Hospital", type: "Super Specialty & Emergency Trauma", phone: "+91 484 2361251", address: "Hospital Road, Marine Drive, Kochi", distance: "2.0 km", hasEmergencyICU: true },
      { name: "Aster Medcity & Disaster Trauma Center", type: "Advanced Quaternary Care", phone: "+91 484 6699999", address: "Cheranalloor, Kochi", distance: "8.5 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "Kochi Marine Drive Cyclone & Flood Shelter", capacity: "1,500 people", phone: "112", location: "Shanmugham Road, Kochi" },
      { name: "Aluva Flood Evacuation Safe Hub", capacity: "1,000 people", phone: "+91 484 2624020", location: "Town Hall Aluva, Ernakulam" }
    ],
    localHelplines: [
      { role: "Kerala State Disaster Management (KSDMA)", phone: "1070" },
      { role: "Coastal Police Station Kochi", phone: "+91 484 2215444" },
      { role: "Tourist Police Kerala", phone: "+91 484 2226543" }
    ]
  },
  "Vizag": {
    disasterStatus: "RESTRICTED",
    isDisasterZone: false,
    hospitals: [
      { name: "King George Hospital (KGH)", type: "Premier Govt. Super-Specialty & Coastal Trauma Center", phone: "+91 891 2564891", address: "Maharanipeta, Visakhapatnam", distance: "1.8 km", hasEmergencyICU: true },
      { name: "Apollo Hospitals Health City", type: "Multi-Specialty Emergency Care", phone: "+91 891 2867777", address: "Arilova, Visakhapatnam", distance: "6.0 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "RK Beach Multi-Purpose Cyclone Shelter", capacity: "1,200 people", phone: "112", location: "Beach Road, Visakhapatnam" },
      { name: "Andhra University Indoor Evacuation Center", capacity: "2,000 people", phone: "+91 891 2844000", location: "AU Campus, Siripuram" }
    ],
    localHelplines: [
      { role: "AP State Disaster Management (APSDMA)", phone: "1070" },
      { role: "Coastal Marine Police Vizag", phone: "+91 891 2565100" },
      { role: "Collectorate Emergency Helpline", phone: "+91 891 2560300" }
    ]
  },
  "Gujarat": {
    disasterStatus: "NORMAL",
    isDisasterZone: false,
    hospitals: [
      { name: "Civil Hospital Ahmedabad (Asia's Largest Apex Hospital)", type: "Super Specialty & Trauma Emergency", phone: "+91 79 22683721", address: "Asarwa, Ahmedabad", distance: "4.5 km", hasEmergencyICU: true },
      { name: "Zydus Hospital & Trauma Center", type: "Advanced Emergency Care", phone: "+91 79 66190201", address: "Thaltej, SG Highway, Ahmedabad", distance: "7.0 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "Sardar Vallabhbhai Patel Stadium Safe Zone", capacity: "3,500 people", phone: "112", location: "Navrangpura, Ahmedabad" },
      { name: "Rann of Kutch Relief Base Dhordo", capacity: "800 people", phone: "+91 2832 250020", location: "Dhordo, Kutch" }
    ],
    localHelplines: [
      { role: "Gujarat State Disaster Management (GSDMA)", phone: "1070" },
      { role: "Police Commissioner Control Room", phone: "112" },
      { role: "Tourist Assistance Gujarat", phone: "1363" }
    ]
  },
  "Punjab": {
    disasterStatus: "NORMAL",
    isDisasterZone: false,
    hospitals: [
      { name: "Guru Nanak Dev Hospital & Medical College", type: "Govt. Apex Teaching Hospital & Trauma", phone: "+91 183 2573210", address: "Majitha Road, Amritsar", distance: "3.2 km", hasEmergencyICU: true },
      { name: "Sri Guru Ram Das Institute of Medical Sciences", type: "Super Specialty Hospital", phone: "+91 183 2870200", address: "Mehta Road, Vallah, Amritsar", distance: "5.5 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "Guru Arjan Dev Niwas Emergency Safe Wing", capacity: "2,500 people", phone: "+91 183 2553957", location: "Near Sri Harmandir Sahib, Amritsar" },
      { name: "Amritsar Railway Station Passenger Safe Hall", capacity: "1,000 people", phone: "139", location: "Station Road, Amritsar" }
    ],
    localHelplines: [
      { role: "Punjab Disaster Management Control Room", phone: "1070" },
      { role: "Amritsar Police Commissionerate Control", phone: "112" },
      { role: "Golden Temple Information Center", phone: "+91 183 2553957" }
    ]
  },
  "Kalka": {
    disasterStatus: "NORMAL",
    isDisasterZone: false,
    hospitals: [
      { name: "Sub-Divisional Civil Hospital Kalka", type: "Govt. Emergency Care", phone: "+91 1733 220025", address: "Railway Colony, Kalka", distance: "0.8 km", hasEmergencyICU: true },
      { name: "Civil Hospital Sector 6 Panchkula", type: "District Super-Specialty", phone: "+91 172 2565432", address: "Sector 6, Panchkula", distance: "16 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "Kalka Railway Community Relief Hall", capacity: "500 people", phone: "139", location: "Near Kalka Railway Station" }
    ],
    localHelplines: [
      { role: "Haryana Disaster Management", phone: "1070" },
      { role: "Kalka Police Station", phone: "+91 1733 220015" }
    ]
  },
  "Udaipur": {
    disasterStatus: "NORMAL",
    isDisasterZone: false,
    hospitals: [
      { name: "Maharana Bhupal (MB) Government Hospital", type: "Premier District Medical College & Trauma", phone: "+91 294 2417721", address: "Hospital Road, Court Chauraha, Udaipur", distance: "1.5 km", hasEmergencyICU: true },
      { name: "Geetanjali Medical College & Hospital", type: "Super Specialty Hospital", phone: "+91 294 2500000", address: "Hiran Magri Extension, Udaipur", distance: "5.5 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "Sukhadia Memorial Town Hall Relief Safe Center", capacity: "1,200 people", phone: "112", location: "City Center, Udaipur" }
    ],
    localHelplines: [
      { role: "Rajasthan Disaster Management Control", phone: "1070" },
      { role: "Udaipur Tourist Police", phone: "+91 294 2421200" },
      { role: "Lake Patrol & Water Rescue", phone: "+91 294 2415555" }
    ]
  },
  "Ooty": {
    disasterStatus: "NORMAL",
    isDisasterZone: false,
    hospitals: [
      { name: "Government Headquarters Hospital (GH) Ooty", type: "Govt. Hill Multi-Specialty & Trauma", phone: "+91 423 2442212", address: "Hospital Road, Upper Bazaar, Ooty", distance: "1.0 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "Nilgiri District Community Emergency Hall", capacity: "600 people", phone: "112", location: "Commercial Road, Ooty" }
    ],
    localHelplines: [
      { role: "Tamil Nadu SDMA Control Room", phone: "1070" },
      { role: "Nilgiri Hill Rescue & Fire Service", phone: "101" },
      { role: "Ooty Police Control Room", phone: "112" }
    ]
  },
  "Pondicherry": {
    disasterStatus: "NORMAL",
    isDisasterZone: false,
    hospitals: [
      { name: "JIPMER (Jawaharlal Institute of Postgraduate Medical Education)", type: "Premier National Apex Medical Institute", phone: "+91 413 2296000", address: "Dhanvantari Nagar, Gorimedu, Puducherry", distance: "4.5 km", hasEmergencyICU: true },
      { name: "Indira Gandhi Govt. General Hospital & Research Institute", type: "Govt. Multi-Specialty Hospital", phone: "+91 413 2336050", address: "Victor Simonel St, White Town, Puducherry", distance: "0.8 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "Coastal Multi-Purpose Cyclone Center Dubrayapet", capacity: "1,500 people", phone: "112", location: "Beach Road Dubrayapet, Puducherry" }
    ],
    localHelplines: [
      { role: "Puducherry Disaster Management Authority", phone: "1070" },
      { role: "Coastal Marine Police", phone: "+91 413 2277717" },
      { role: "Tourist Assistance Cell", phone: "+91 413 2339497" }
    ]
  },
  "Mumbai": {
    disasterStatus: "NORMAL",
    isDisasterZone: false,
    hospitals: [
      { name: "King Edward Memorial (KEM) Hospital", type: "Premier Govt. Apex Super-Specialty & Trauma", phone: "+91 22 24107000", address: "Acharya Donde Marg, Parel, Mumbai", distance: "4.0 km", hasEmergencyICU: true },
      { name: "Lilavati Hospital & Research Centre", type: "Quaternary Emergency Care", phone: "+91 22 26751000", address: "A.K. Vaidya Marg, Bandra West, Mumbai", distance: "6.5 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "BMC Central Emergency Relief Ground Parel", capacity: "4,000 people", phone: "1916", location: "BMC Head Office & Relief Centers, Mumbai" },
      { name: "Wankhede Stadium Safe Evacuation Complex", capacity: "3,000 people", phone: "112", location: "Churchgate, Mumbai" }
    ],
    localHelplines: [
      { role: "BMC Disaster Management Emergency Hotline", phone: "1916" },
      { role: "Mumbai Police Emergency Control", phone: "112" },
      { role: "Indian Coast Guard Coastal SOS", phone: "1554" }
    ]
  },
  "Hampi": {
    disasterStatus: "NORMAL",
    isDisasterZone: false,
    hospitals: [
      { name: "100-Bed Taluk General Hospital Hospet", type: "Govt. Emergency Care", phone: "+91 8394 228020", address: "Station Road, Hospet", distance: "12 km", hasEmergencyICU: true },
      { name: "Vijayanagara District Trauma Center", type: "Emergency Trauma Care", phone: "+91 8394 225566", address: "TB Dam Road, Hospet", distance: "14 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "Vijayanagara Cultural Hall Safe Base", capacity: "800 people", phone: "112", location: "Hampi Main Bazaar" }
    ],
    localHelplines: [
      { role: "Karnataka Disaster Management (KSDMA)", phone: "1070" },
      { role: "Hampi Tourist Police Outpost", phone: "+91 8394 241241" }
    ]
  },
  "Andaman": {
    disasterStatus: "RESTRICTED",
    isDisasterZone: false,
    hospitals: [
      { name: "Govind Ballabh Pant (GB Pant) Hospital", type: "Apex Island Referral Hospital & ICU", phone: "+91 3192 232102", address: "Atlanta Point, Port Blair", distance: "1.2 km", hasEmergencyICU: true },
      { name: "INHS Dhanvantari (Indian Naval Hospital)", type: "Armed Forces Medical & Tsunami Relief Center", phone: "+91 3192 248200", address: "Minnie Bay, Port Blair", distance: "5.0 km", hasEmergencyICU: true }
    ],
    shelters: [
      { name: "Port Blair Central Tsunami & Cyclone Safe Hub", capacity: "2,500 people", phone: "112", location: "Netaji Stadium, Port Blair" },
      { name: "Havelock Island Cyclone Shelter (Swaraj Dweep)", capacity: "800 people", phone: "+91 3192 282222", location: "Govind Nagar, Havelock" }
    ],
    localHelplines: [
      { role: "Andaman & Nicobar Disaster Control Room", phone: "1070" },
      { role: "Indian Coast Guard Maritime Rescue (MRCC)", phone: "1554" },
      { role: "Tourist Assistance Port Blair", phone: "+91 3192 232694" }
    ]
  }
};

// Additional active alerts for travelers
const additionalAlerts = [
  {
    id: "ALERT-LD-2026-003",
    disasterType: "Sub-Zero Freezing & High-Pass Glaze Warning",
    icon: "❄️",
    severity: "WARNING",
    title: "Khardung La & Chang La Snow Gate Restrictions",
    destination: "Leh Ladakh",
    region: "Ladakh (Khardung La / Nubra Pass)",
    affectedCorridors: ["Khardung La Highway (17,582 ft)", "Chang La Pass (17,688 ft)"],
    affectedTransportModes: ["Self-Drive SUVs", "Motorcycle Expeditions"],
    status: "RESTRICTED",
    issuedAt: "2026-09-23T05:00:00Z",
    validUntil: "2026-09-27T18:00:00Z",
    description: "Sub-zero overnight freeze has generated black ice on upper hairpins beyond South Pullu. Border Roads Organisation (BRO) snowploughs operational. 4x4 vehicles with snow chains permitted between 08:30 AM and 03:00 PM only.",
    evacuationAdvice: "Carry thermal layers, portable oxygen cans, and tire snow chains. Do not attempt pass crossing after 03:00 PM.",
    safeAlternativeHub: "Leh City Center",
    safeEvacuationRoute: {
      routeTitle: "Leh Valley Low-Altitude Safe Corridor via NH-1D to Nimoo / Alchi",
      estimatedTransitTime: "1.5 hrs",
      safetyStatus: "ALL-WEATHER_LOW_ALTITUDE",
      recommendedMode: "Local Taxi Union 4x4 Fleet",
      stepByStepInstructions: [
        "1. Avoid climbing towards Khardung La during snow gate closures.",
        "2. Divert to low-altitude Indus River Valley along NH-1D towards Spituk, Phyang, and Alchi.",
        "3. Oxygen levels in Indus Valley remain comfortable at 10,500 ft with full medical coverage at SNM Hospital Leh."
      ]
    }
  },
  {
    id: "ALERT-VZ-2026-004",
    disasterType: "Coastal Squall & Rough Sea Warning",
    icon: "🌊",
    severity: "WARNING",
    title: "Maritime Squall & Sea Swell Advisory: Visakhapatnam",
    destination: "Vizag",
    region: "Andhra Pradesh Coastal Belt",
    affectedCorridors: ["RK Beach Road", "Bheemili Marine Drive", "Fishing Harbor Channel"],
    affectedTransportModes: ["Tourist Ferries", "Coastal Speedboats", "Beach Watersports"],
    status: "RESTRICTED",
    issuedAt: "2026-09-23T07:30:00Z",
    validUntil: "2026-09-26T12:00:00Z",
    description: "Deep sea depression causing wind gusts up to 52 km/h and wave heights of 3.2 meters. Fishing and tourist boat operations suspended by Port Authority.",
    evacuationAdvice: "Stay off wet rocks and sea-facing promenades along RK Beach and Rishikonda. Divert sightseeing to inland Kailasagiri and Araku Valley.",
    safeAlternativeHub: "Vijayawada / Hyderabad",
    safeEvacuationRoute: {
      routeTitle: "Inland NH-16 Golden Quadrilateral High-Speed Corridor",
      estimatedTransitTime: "2.0 hrs",
      safetyStatus: "CLEAR_INLAND_EXPRESSWAY",
      recommendedMode: "Vande Bharat Express / OSRTC Highway Fleet",
      stepByStepInstructions: [
        "1. Avoid low-lying coastal stretches along Bheemili.",
        "2. Join NH-16 towards Anakapalle / Rajahmundry.",
        "3. Complete onward air and rail transit available at Vizag Airport / Railway Junction."
      ]
    }
  },
  {
    id: "ALERT-AN-2026-005",
    disasterType: "Maritime Rough Weather Alert",
    icon: "🚢",
    severity: "WARNING",
    title: "Bay of Bengal High Sea Swells & Inter-Island Ferry Delays",
    destination: "Andaman",
    region: "Andaman & Nicobar Islands",
    affectedCorridors: ["Port Blair - Havelock Ferry Route", "Neil Island Marine Channel"],
    affectedTransportModes: ["High-Speed Catamarans (Makruzz, Green Ocean)", "Govt. Ferries"],
    status: "RESTRICTED",
    issuedAt: "2026-09-23T06:00:00Z",
    validUntil: "2026-09-26T18:00:00Z",
    description: "Maritime sea swells reaching 3.5 meters in open channels between South Andaman and Swaraj Dweep. Ferries operating under speed restrictions.",
    evacuationAdvice: "Confirm ferry departure status with Directorate of Shipping Services before reaching Phoenix Bay Jetty. Inland tours in Port Blair operational.",
    safeAlternativeHub: "Port Blair Harbor & Airport",
    safeEvacuationRoute: {
      routeTitle: "Port Blair Urban Safe Haven Corridor",
      estimatedTransitTime: "45 min",
      safetyStatus: "SAFE_WEATHER_ZONE",
      recommendedMode: "Island Tourism Registered Prepaid Cabs",
      stepByStepInstructions: [
        "1. If ferry to Havelock is deferred, stay in Port Blair hotels.",
        "2. Visit Cellular Jail, Samudrika Museum, and Corbyn's Cove safe areas.",
        "3. Veer Savarkar International Airport operates regular flights to Chennai, Kolkata, and Bengaluru."
      ]
    }
  }
];

// Additional seed crisis messages
const additionalCrisisMessages = {
  "Leh Ladakh": [
    {
      id: "MSG-LD-1",
      senderName: "Tenzin Dorje",
      role: "Ladakh Taxi Union Representative",
      tag: "ℹ️ Road Clearance Update",
      message: "South Pullu snow cleared by BRO dozers at 11 AM today. 4x4 Scorpio & Innova vehicles crossing Khardung La safely. Carry heavy woollens.",
      location: "South Pullu Checkpoint, Leh",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      verifiedTraveler: true,
      helpfulVotes: 14
    }
  ],
  "Vizag": [
    {
      id: "MSG-VZ-1",
      senderName: "Ramesh Naidu",
      role: "Rishikonda Lifeguard Supervisor",
      tag: "⚠️ Beach Warning",
      message: "Red flags posted on Rishikonda and RK Beach due to high surf. Water sports temporarily closed today for safety. Araku train is running on time.",
      location: "Rishikonda Beach, Vizag",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      verifiedTraveler: true,
      helpfulVotes: 19
    }
  ],
  "Kerala": [
    {
      id: "MSG-KL-1",
      senderName: "Anu Varghese",
      role: "Kerala Tourism Information Officer",
      tag: "✅ All Routes Normal",
      message: "Backwaters in Alleppey and Fort Kochi are calm and houseboats operating smoothly. Kochi Airport all flights on schedule.",
      location: "Kochi Marine Drive",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      verifiedTraveler: true,
      helpfulVotes: 23
    }
  ]
};

// Now inject into disasterDatabase.js
// Read existing objects
const db = await import('../backend/data/disasterDatabase.js');
const allAlerts = [...db.ACTIVE_DISASTER_ALERTS];
for (const a of additionalAlerts) {
  if (!allAlerts.some(x => x.id === a.id)) {
    allAlerts.push(a);
  }
}

const allFacilities = { ...db.DESTINATION_EMERGENCY_FACILITIES, ...additionalFacilities };
const allCrisisMessages = { ...db.SEED_CRISIS_MESSAGES, ...additionalCrisisMessages };

const newDbFileContent = `/**
 * Authentic Disaster Intelligence & Emergency Response Database
 * Formatted according to NDMA, IMD, and SDRF standard protocols.
 */

const ACTIVE_DISASTER_ALERTS = ${JSON.stringify(allAlerts, null, 2)};

const DESTINATION_EMERGENCY_FACILITIES = ${JSON.stringify(allFacilities, null, 2)};

const SEED_CRISIS_MESSAGES = ${JSON.stringify(allCrisisMessages, null, 2)};

module.exports = {
  ACTIVE_DISASTER_ALERTS,
  DESTINATION_EMERGENCY_FACILITIES,
  SEED_CRISIS_MESSAGES,
};
`;

fs.writeFileSync(currentFilePath, newDbFileContent, 'utf-8');
console.log('Successfully updated backend/data/disasterDatabase.js!');
console.log('Total ACTIVE_DISASTER_ALERTS:', allAlerts.length);
console.log('Total DESTINATION_EMERGENCY_FACILITIES keys:', Object.keys(allFacilities).length);

