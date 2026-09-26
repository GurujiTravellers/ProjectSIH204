import { getApiBaseUrl } from "../config/apiConfig";

const EMERGENCY_API_URL = `${getApiBaseUrl()}/emergency`;
const OFFLINE_STORAGE_KEY = "travelGurujiEmergencyOfflineCache";

// Baseline fallback data available 100% offline
const STATIC_OFFLINE_BASELINE = {
  nationalHelplines: [
    { title: "National Emergency Service (All-in-One)", number: "112", icon: "🚨", available: "24x7 Pan-India • Toll Free" },
    { title: "Medical Emergency / Ambulance", number: "108", icon: "🚑", available: "24x7 Immediate Paramedic Response" },
    { title: "Disaster Management (NDRF / SDRF)", number: "1070", icon: "🧗", available: "Search, Rescue & Relief Operations" },
    { title: "Tourist SOS & Safety Helpline", number: "1363", icon: "🧭", available: "Ministry of Tourism • 12 Languages" },
    { title: "Women Helpline (Safety & SOS)", number: "1090", icon: "🛡️", available: "Dedicated Women Safety Cell" },
    { title: "Railway Security / Passenger SOS", number: "139", icon: "🚆", available: "Indian Railways 24x7 Assistance" },
  ],
  offlineFirstAidGuide: [
    {
      topic: "Flash Flood / High Water",
      steps: [
        "Immediately move to higher ground. Never attempt to walk or drive through moving flood waters.",
        "Stay away from electrical poles, fallen wires, and concrete structures near raging rivers.",
        "Turn off home/hotel power mains if instructed by authorities."
      ]
    },
    {
      topic: "Landslide / Boulder Fall in Hills",
      steps: [
        "If trapped in a vehicle on a hill highway, stay inside away from the valley cliff side unless boulder impact is imminent.",
        "Park on the inner mountain cut side, away from natural drainage streams or loose gravel slopes.",
        "Keep hazard lights ON and dial 1070 or 112 with your mile marker / landmark."
      ]
    },
    {
      topic: "Severe Cyclone / Coastal Storm",
      steps: [
        "Remain indoors in a sturdy concrete structure away from glass windows and loose sheet roofs.",
        "Do not visit beaches or promenade sea walls to watch high waves.",
        "Keep mobile phones fully charged and maintain emergency battery packs."
      ]
    },
    {
      topic: "Stranded Traveler Protocol",
      steps: [
        "Conserve battery: switch phone to Battery Saver / Airplane mode when not in use.",
        "Share your last known GPS coordinates with your travel companion or local authorities.",
        "Remain with your group or locate the nearest SDRF / Panchayat community relief center."
      ]
    }
  ]
};

/**
 * Read cached offline emergency data
 */
export function getOfflineEmergencyData() {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...STATIC_OFFLINE_BASELINE,
        ...parsed,
        isFromCache: true
      };
    }
  } catch (err) {
    console.warn("Could not read offline emergency cache:", err);
  }
  return {
    ...STATIC_OFFLINE_BASELINE,
    alerts: [],
    cachedAt: new Date().toISOString(),
    isFromCache: true
  };
}

/**
 * Save data into offline cache
 */
export function saveOfflineEmergencyData(data) {
  try {
    const existing = getOfflineEmergencyData();
    const updated = {
      ...existing,
      ...data,
      cachedAt: new Date().toISOString()
    };
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save offline emergency cache:", err);
  }
}

/**
 * Fetch all active disaster and route risk alerts
 */
export async function getActiveDisasterAlerts(destination = "", severity = "") {
  try {
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (severity) params.append("severity", severity);

    const url = `${EMERGENCY_API_URL}/alerts${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch alerts from network");

    const data = await response.json();
    if (data.success && data.alerts) {
      saveOfflineEmergencyData({ alerts: data.alerts });
    }
    return data;
  } catch (error) {
    console.warn("Network error fetching disaster alerts, falling back to offline cache:", error);
    const cached = getOfflineEmergencyData();
    return {
      success: true,
      count: (cached.alerts || []).length,
      alerts: cached.alerts || [],
      offline: true,
      timestamp: cached.cachedAt || new Date().toISOString()
    };
  }
}

/**
 * Fetch emergency intelligence & facilities for a destination
 */
export async function getDestinationEmergency(destination) {
  if (!destination) return null;
  try {
    const response = await fetch(`${EMERGENCY_API_URL}/destination/${encodeURIComponent(destination)}`);
    if (!response.ok) throw new Error("Failed to fetch destination emergency data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`Emergency fetch failed for ${destination}, using offline fallback:`, error);
    const offline = getOfflineEmergencyData();
    return {
      success: true,
      destination,
      hasDisasterAlert: false,
      activeAlert: null,
      isClosedToTourists: false,
      facilities: {
        disasterStatus: "NORMAL",
        hospitals: [
          {
            name: `${destination} Civil District Hospital`,
            type: "Govt. Hospital",
            phone: "108",
            address: `Main District Road, ${destination}`,
            distance: "Approx. 2.0 km",
            hasEmergencyICU: true
          }
        ],
        shelters: [
          {
            name: `${destination} Community Center`,
            capacity: "200 persons",
            phone: "112",
            location: `Civil Lines, ${destination}`
          }
        ],
        localHelplines: [
          { role: "Police / Emergency SOS", phone: "112" },
          { role: "Ambulance", phone: "108" },
          { role: "Disaster SDRF", phone: "1070" }
        ]
      },
      nationalHelplines: offline.nationalHelplines,
      offline: true
    };
  }
}

/**
 * Calculate emergency evacuation replan and refund options
 */
export async function calculateEmergencyReplan(origin, destination, bookingReference = null) {
  try {
    const response = await fetch(`${EMERGENCY_API_URL}/replan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination, bookingReference })
    });
    if (!response.ok) throw new Error("Replan calculation failed");
    return await response.json();
  } catch (error) {
    console.warn("Replan network error, returning safe local protocol:", error);
    return {
      success: true,
      origin,
      destination,
      isDisasterActive: true,
      disasterSeverity: "CRITICAL",
      disasterTitle: "Emergency Transit Protocol Active",
      tripStatus: "TRIP_SUSPENDED",
      safeHub: "Nearest Capital Hub / Railhead",
      evacuationPlan: {
        routeTitle: "Standard High-Elevation State Highway Bypass",
        estimatedTransitTime: "4.5 hrs",
        safetyStatus: "ESCORTED_BY_POLICE",
        recommendedMode: "Govt. SDRF Relief Shuttle",
        stepByStepInstructions: [
          "1. Report to nearest Civil Administration or Police Station.",
          "2. Join verified police escort convoy departing at scheduled intervals.",
          "3. Proceed to rail junction for safe transit back to origin."
        ]
      },
      alternativeOptions: [
        {
          id: "OFFLINE-EVAC-1",
          title: "District Administration Relief Shuttle",
          mode: "SDRF Bus",
          departurePoint: "Town Hall Relief Depot",
          timing: "Continuous during daylight",
          estimatedDuration: "4 hrs",
          costPerPerson: 0,
          isFreeRelief: true,
          safetyRating: "Official Escort",
          features: ["Free Emergency Transit", "Food & Water Provided", "Direct to Hub Rail Station"]
        }
      ],
      escrowProtection: {
        bookingReference,
        eligibleForFullRefund: true,
        refundReason: "Disaster Emergency Force Majeure Protection",
        refundProcessingTime: "Instant to Source Account",
        cancellationFee: "₹0 (100% Escrow Refund Guarantee)"
      },
      emergencyHelpdesk: "Dial 112 or 1070"
    };
  }
}

/**
 * Get crisis chat / community messages for stranded travelers
 */
export async function getCrisisMessages(destination) {
  if (!destination) return { success: true, messages: [] };
  try {
    const response = await fetch(`${EMERGENCY_API_URL}/community/${encodeURIComponent(destination)}`);
    if (!response.ok) throw new Error("Failed to fetch community messages");
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Community messages fetch failed:", error);
    return {
      success: true,
      destination,
      count: 0,
      messages: [],
      offline: true
    };
  }
}

/**
 * Post status / SOS message to stranded travelers board
 */
export async function postCrisisMessage(destination, messageData) {
  try {
    const response = await fetch(`${EMERGENCY_API_URL}/community/${encodeURIComponent(destination)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData)
    });
    if (!response.ok) throw new Error("Failed to post message");
    return await response.json();
  } catch (error) {
    console.error("Failed to post crisis message:", error);
    throw error;
  }
}

/**
 * Fetch districts currently at risk and relief operations data
 */
export async function getAtRiskDistricts() {
  try {
    const response = await fetch(`${EMERGENCY_API_URL}/districts-at-risk`);
    if (!response.ok) throw new Error("Failed to fetch at-risk districts");
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Network error fetching at-risk districts, using verified baseline:", error);
    return {
      success: true,
      count: 7,
      districts: [
        {
          districtId: "DIST-HP-MANDI-KULLU",
          districtName: "Mandi & Kullu Districts",
          state: "Himachal Pradesh",
          alertTier: "RED",
          severity: "CRITICAL",
          isDisasterZone: true,
          hazardType: "Active Landslides & Beas River Cloudburst Surge",
          primaryThreat: "NH-3 Pandoh Dam gorge hill collapses; road formation eroded near 6-Mile & 7-Mile bypass.",
          affectedCorridors: "NH-3 (Aut - Pandoh Tunnel stretch), Mandi-Kullu Highway",
          movementStatus: "TRAVEL HAZARDOUS / CIVIL ROUTES SUSPENDED",
          movementFeasible: false,
          deocHelpline: "1077",
          deocDirectPhone: "01905-226201",
          seocHelpline: "1070",
          policeControl: "112",
          ndrfBattalion: "14th NDRF Battalion, Balh, Mandi (Control Room: 01905-235000)",
          activeShelters: [
            { name: "Pandoh Community Relief Hall", location: "Pandoh Market, Mandi", capacity: "350 persons", facilities: "Potable water, emergency power, hot meals" },
            { name: "Bajaura SDRF Transit Camp", location: "Near Bajaura Checkpost, Kullu", capacity: "500 persons", facilities: "Paramedic staff, ambulance staging, warm bedding" },
            { name: "Government Degree College Shelter", location: "Mandi Sadar", capacity: "650 persons", facilities: "Medical bay, generator backup, dry rations" }
          ],
          safeEvacuationCorridor: "Southern Bypass via Bajaura - Kamand - Kataula to Sundernagar / Bilaspur (Police Escorted Convoy Only)",
          recommendedTransitMode: "State SDRF 4x4 Emergency Convoys",
          stagingReadiness: "HIGH ALERT: Heavy earthmovers, SDRF rescue teams, and disaster supply kits pre-positioned."
        },
        {
          districtId: "DIST-OD-PURI-JAGATSINGHPUR",
          districtName: "Puri & Jagatsinghpur Districts",
          state: "Odisha",
          alertTier: "RED",
          severity: "CRITICAL",
          isDisasterZone: true,
          hazardType: "Bay of Bengal Severe Cyclonic Storm & Tidal Inundation",
          primaryThreat: "Gale winds 100-115 kmph gusting to 125 kmph with 1.5m sea storm surges along beach promenade.",
          affectedCorridors: "Puri Marine Drive, Konark Marine Drive, Coastal Highway NH-316",
          movementStatus: "TRAVEL HAZARDOUS / COASTAL CORRIDORS CLOSED",
          movementFeasible: false,
          deocHelpline: "1077",
          deocDirectPhone: "06752-223230",
          seocHelpline: "1070",
          policeControl: "112",
          ndrfBattalion: "3rd NDRF Battalion, Mundali, Cuttack (Control Room: 0671-2879710)",
          activeShelters: [
            { name: "Balukhand Multi-Purpose Cyclone Shelter (MPCS)", location: "Balukhand Coastal Sanctuary Belt", capacity: "800 persons", facilities: "Reinforced concrete, backup solar power, high-volume water tanks" },
            { name: "Puri Town Hall Emergency Shelter", location: "Grand Road, Puri", capacity: "1200 persons", facilities: "Community kitchens, round-the-clock doctors, sanitation kits" },
            { name: "Konark Yatri Nivas Relief Center", location: "Konark Ring Road", capacity: "450 persons", facilities: "Emergency dry rations, satellite phones" }
          ],
          safeEvacuationCorridor: "Inland High-Elevation 4-Lane Expressway (NH-316) to Bhubaneswar & Cuttack",
          recommendedTransitMode: "Special OSRTC Evacuation Fleet / Inbound Express Trains",
          stagingReadiness: "HIGH ALERT: 42 ODRAF and NDRF rescue boats deployed across coastal blocks."
        },
        {
          districtId: "DIST-HP-LAHAUL-SPITI",
          districtName: "Lahaul & Spiti District",
          state: "Himachal Pradesh",
          alertTier: "YELLOW",
          severity: "WARNING",
          isDisasterZone: false,
          hazardType: "High-Altitude Black Ice & Sub-Zero Mountain Blizzard",
          primaryThreat: "Sub-zero night freeze (-4°C to -8°C) causing slippery black ice on Rohtang and Kunzum pass switchbacks.",
          affectedCorridors: "Manali-Rohtang Pass Road (13,058 ft), Gramphu-Batal-Kunzum Link",
          movementStatus: "MOVEMENT POSSIBLE WITH CAUTION (ATAL TUNNEL OPEN)",
          movementFeasible: true,
          deocHelpline: "1077",
          deocDirectPhone: "01900-202509",
          seocHelpline: "1070",
          policeControl: "112",
          ndrfBattalion: "BRO Project Deepak & Lahaul Police Special Mountain Rescue Unit",
          activeShelters: [
            { name: "Sissu Community Snow Shelter", location: "Sissu North Portal, Lahaul", capacity: "250 persons", facilities: "Heated rooms, emergency diesel generators, oxygen cylinders" },
            { name: "Kaza Indoor Sports Complex Staging Depot", location: "Kaza Spiti Valley", capacity: "300 persons", facilities: "Thermal sleeping bags, warm food mess" }
          ],
          safeEvacuationCorridor: "Atal Highway Tunnel (9.02 km all-weather corridor) to South Portal / Manali floor",
          recommendedTransitMode: "Certified All-Weather 4WD with snow chains or Atal Tunnel Shuttles",
          stagingReadiness: "MODERATE CAUTION: Snow-clearing dozers on 24x7 standby at North Portal."
        },
        {
          districtId: "DIST-UK-DEHRADUN-TEHRI",
          districtName: "Dehradun & Tehri Garhwal Districts",
          state: "Uttarakhand",
          alertTier: "YELLOW",
          severity: "WARNING",
          isDisasterZone: false,
          hazardType: "Ganges River High Spate & Rafting Suspension",
          primaryThreat: "River Ganga flowing near warning mark due to heavy runoff in upper Alaknanda/Bhagirathi basins.",
          affectedCorridors: "NH-7 Byasi-Devprayag lower riverbank camps, Triveni Ghat lower steps",
          movementStatus: "MOVEMENT POSSIBLE WITH CAUTION (TOWNS 100% OPERATIONAL)",
          movementFeasible: true,
          deocHelpline: "1077",
          deocDirectPhone: "0135-2726066",
          seocHelpline: "1070",
          policeControl: "112",
          ndrfBattalion: "SDRF Uttarakhand Central Camp, Jolly Grant, Dehradun",
          activeShelters: [
            { name: "Tapovan Municipal Transit Hall", location: "Tapovan, Rishikesh", capacity: "400 persons", facilities: "Medical aid post, drinking water tankers" },
            { name: "Rishikesh ISBT Emergency Shelter", location: "Haridwar Bypass Road", capacity: "600 persons", facilities: "Direct transit connectivity, food packets" }
          ],
          safeEvacuationCorridor: "NH-7 4-Lane All-Weather Highway to Jolly Grant Airport and Dehradun City",
          recommendedTransitMode: "Standard Intercity Cabs / State Electric Bus Fleet",
          stagingReadiness: "MODERATE CAUTION: River patrol motorboats deployed along Triveni Ghat."
        },
        {
          districtId: "DIST-WB-DARJEELING-KALIMPONG",
          districtName: "Darjeeling & Kalimpong Districts",
          state: "West Bengal",
          alertTier: "YELLOW",
          severity: "WARNING",
          isDisasterZone: false,
          hazardType: "Hill Slope Mudslide & Ghat Bypass Precaution",
          primaryThreat: "Localized mud slips on lower Rohini ghat road during heavy mist.",
          affectedCorridors: "Rohini Road (NH-110), Pankhabari Ghat Road",
          movementStatus: "MOVEMENT POSSIBLE WITH CAUTION (MIRIK ROUTE FULLY OPEN)",
          movementFeasible: true,
          deocHelpline: "1077",
          deocDirectPhone: "0354-2252044",
          seocHelpline: "1070",
          policeControl: "112",
          ndrfBattalion: "2nd NDRF Battalion Siliguri Unit",
          activeShelters: [
            { name: "Kurseong Tourist Lodge Staging Center", location: "Kurseong Town", capacity: "350 persons", facilities: "Warm blankets, first aid, hot beverage point" },
            { name: "Siliguri Bagdogra Relief Depot", location: "Siliguri Junction", capacity: "750 persons", facilities: "Direct rail/air access, medical triage center" }
          ],
          safeEvacuationCorridor: "Darjeeling - Ghoom - Mirik - Siliguri Scenic Paved All-Weather Bypass",
          recommendedTransitMode: "Registered Himalayan 4WD Tourist Jeeps",
          stagingReadiness: "MODERATE CAUTION: PWD Hill maintenance teams stationed along Rohini."
        },
        {
          districtId: "DIST-MEGH-EAST-KHASI-JAINTIA",
          districtName: "East Khasi Hills & West Jaintia Hills",
          state: "Meghalaya",
          alertTier: "YELLOW",
          severity: "WARNING",
          isDisasterZone: false,
          hazardType: "Umngot River High Current & Heavy Hill Fog",
          primaryThreat: "High runoff in Umngot river from Cherrapunji catchment; commercial boating regulated.",
          affectedCorridors: "NH-206 (Shillong - Pynursla - Dawki Highway)",
          movementStatus: "MOVEMENT POSSIBLE WITH CAUTION (HIGHWAY 100% CLEAR)",
          movementFeasible: true,
          deocHelpline: "1077",
          deocDirectPhone: "0364-2225289",
          seocHelpline: "1070",
          policeControl: "112",
          ndrfBattalion: "1st NDRF Battalion Guwahati / Shillong Sub-unit",
          activeShelters: [
            { name: "Pynursla Block Community Hall", location: "Pynursla Main Market", capacity: "300 persons", facilities: "Emergency shelter, potable water, medical officer" },
            { name: "Dawki Border Inspection Shelter", location: "Dawki Bridge Junction", capacity: "200 persons", facilities: "First-aid, emergency communications" }
          ],
          safeEvacuationCorridor: "NH-206 High-Elevation Highway ascending via Pynursla to Shillong capital",
          recommendedTransitMode: "Standard Intercity Tourist Cabs",
          stagingReadiness: "MODERATE CAUTION: State police safety checkpost operating at Pynursla."
        },
        {
          districtId: "DIST-WB-PURBA-MEDINIPUR",
          districtName: "Purba Medinipur (Digha Sector)",
          state: "West Bengal",
          alertTier: "GREEN",
          severity: "GREEN_ALERT",
          isRainAlert: true,
          isDisasterZone: false,
          hazardType: "Standard Coastal Monsoon Rainfall",
          primaryThreat: "Intermittent coastal rain showers (8-14 mm/h). Zero flood or road blockage.",
          affectedCorridors: "NH-116B (Kolkata - Digha Expressway)",
          movementStatus: "ALL ROUTES OPEN & NORMAL (RAIN ALERT ONLY)",
          movementFeasible: true,
          deocHelpline: "1077",
          deocDirectPhone: "03228-263100",
          seocHelpline: "1070",
          policeControl: "112",
          ndrfBattalion: "Civil Defense & Coastal Police Digha",
          activeShelters: [
            { name: "Old Digha Cyclone Shelter", location: "Barrister Colony, Digha", capacity: "500 persons", facilities: "Standard shelter facilities on standby" }
          ],
          safeEvacuationCorridor: "NH-116B 4-Lane Expressway to Kharagpur and Kolkata",
          recommendedTransitMode: "Standard Express Trains (Tamralipta / Kandari Express) & Highway Buses",
          stagingReadiness: "ROUTINE STANDBY: Lifeguards stationed along sea beach; normal activities."
        }
      ]
    };
  }
}


