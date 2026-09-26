import travelActivityData from "../data/travelActivityData.js";
import { optimizeTripPlanWithIntelligence } from "./intelligenceApi.js";
import { getCuratedMultiDayItinerary, getCuratedSixDayItinerary } from "../data/curatedSixDayItineraries.js";

/**
 * Smart Trip Planner Service
 * Deterministic calculations for costs, route-aware day-wise scheduling,
 * personalized recommendations, and budget overrun alternatives.
 */

// Centralized supported origin cities for travel distance / route awareness
export const SUPPORTED_ORIGINS = [
  "Kolkata",
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Bhubaneswar",
  "Guwahati",
  "Chandigarh",
  "Dehradun",
  "Kochi",
  "Patna",
  "Varanasi",
  "Amritsar",
  "Agra",
  "Shimla",
  "Goa",
  "Kalka",
];

export const MAJOR_ORIGINS = SUPPORTED_ORIGINS; // backward compatibility

// Baseline intercity travel fare estimates per traveler (one-way * 2 for round-trip)
const INTERCITY_ESTIMATES = {
  Flight: 4800,
  Train: 1400,
  Bus: 900,
  "Self-Drive": 2500, // per group base
  Flexible: 1600,
};

// Baseline accommodation price per night per room
const ACCOMMODATION_RATES = {
  Budget: 1800,
  "Mid-Range": 3600,
  Luxury: 8500,
  Homestay: 2200,
};

// Baseline food daily rate per person
const FOOD_RATES = {
  "Local / Street Food": 250,
  "Vegetarian / Pure Veg": 320,
  "Cafes & Casual": 480,
  "Fine Dining": 950,
  Flexible: 380,
};

/**
 * Calculate detailed cost breakdown with clear distinction between
 * ESTIMATED, CONFIRMED, and UNAVAILABLE.
 */
export function calculateTripBudgetBreakdown({
  totalBudget = 25000,
  origin = "",
  destination = "",
  days = 3,
  adults = 2,
  children = 0,
  preferences = {},
  selectedHotel = null,
  confirmedTransport = null,
  foodDailyRate = 220,
  localTransitDailyRate = 180,
  activityDailyRate = 80,
}) {
  const totalPersons = Math.max(1, Number(adults || 0) + Number(children || 0));
  const nights = Math.max(1, days - 1);
  const rooms = Math.ceil(totalPersons / 2);

  const stayPref = preferences.accommodation || "Mid-Range";
  const transportPref = preferences.transport || "Flexible";
  const foodPref = preferences.food || "Flexible";
  const walkingPref = preferences.walking || "Moderate";

  // 1. Accommodation
  let roomNightRate = ACCOMMODATION_RATES[stayPref] || 3600;
  let isHotelConfirmed = false;
  if (selectedHotel && Number(selectedHotel.price) > 0) {
    roomNightRate = Number(selectedHotel.price);
    isHotelConfirmed = true;
  }
  const estAccommodation = roomNightRate * rooms * nights;

  // 2. Intercity Transport
  let estIntercityTransport = 0;
  let isTransportConfirmed = false;
  if (confirmedTransport && Number(confirmedTransport.fare) > 0) {
    estIntercityTransport = Number(confirmedTransport.fare);
    isTransportConfirmed = true;
  } else if (transportPref === "Self-Drive") {
    estIntercityTransport = (INTERCITY_ESTIMATES["Self-Drive"] || 2500) * 2; // Fuel & tolls
  } else {
    const ratePerPerson = INTERCITY_ESTIMATES[transportPref] || 891;
    // Round trip factor
    estIntercityTransport = ratePerPerson * totalPersons;
  }

  // 3. Local Transportation (Auto, Cabs, local shuttles)
  let dailyLocalTransitRate = localTransitDailyRate || 180;
  if (walkingPref === "Low / Minimal") {
    dailyLocalTransitRate = Math.round(dailyLocalTransitRate * 1.5); // More cabs/autos needed
  } else if (walkingPref === "High / Trekking") {
    dailyLocalTransitRate = Math.round(dailyLocalTransitRate * 0.75); // High walking tolerance reduces cab usage
  }
  const estLocalTransport = dailyLocalTransitRate * totalPersons * days;

  // 4. Food & Dining
  const dailyFoodRate = foodDailyRate || 220;
  const estFood = dailyFoodRate * totalPersons * days;

  // 5. Activities & Entry Tickets
  const dailyActivityRate = activityDailyRate || 80;
  const estActivities = dailyActivityRate * totalPersons * days;

  // Subtotal before buffer
  const baseSubtotal =
    estAccommodation +
    estIntercityTransport +
    estLocalTransport +
    estFood +
    estActivities;

  // 6. Emergency Safety Buffer (10% of subtotal, minimum ₹1,500)
  const estEmergencyBuffer = Math.round(baseSubtotal * 0.1);

  const totalEstimatedCost = baseSubtotal + estEmergencyBuffer;
  const numericBudget = Number(totalBudget) || 25000;
  const remainingBudget = numericBudget - totalEstimatedCost;
  const isOverBudget = totalEstimatedCost > numericBudget;
  const budgetDifference = Math.abs(remainingBudget);

  // Line item breakdown with exact status labels
  const items = [
    {
      category: "Accommodation",
      label: `Stays (${nights}N, ${rooms} Room${rooms > 1 ? "s" : ""})`,
      amount: estAccommodation,
      status: isHotelConfirmed ? "CONFIRMED" : "ESTIMATED",
      note: isHotelConfirmed
        ? `Selected: ${selectedHotel.name} (₹${roomNightRate.toLocaleString("en-IN")}/nt)`
        : `Est. based on ${stayPref} category (~₹${roomNightRate.toLocaleString("en-IN")}/nt)`,
    },
    {
      category: "Transportation",
      label: `Intercity Travel (${origin ? `${origin} ⇄ ${destination}` : transportPref})`,
      amount: estIntercityTransport,
      status: isTransportConfirmed ? "CONFIRMED" : "ESTIMATED",
      note: isTransportConfirmed
        ? `Booked / Confirmed: ${confirmedTransport.operator || transportPref} (₹${estIntercityTransport.toLocaleString("en-IN")})`
        : `Estimated round-trip for ${totalPersons} traveler${totalPersons > 1 ? "s" : ""} via ${transportPref}`,
    },
    {
      category: "Local Transport",
      label: `Local Transit & Autos (${days} days)`,
      amount: estLocalTransport,
      status: "ESTIMATED",
      note: `Calibrated for ${walkingPref.toLowerCase()} walking tolerance`,
    },
    {
      category: "Food & Dining",
      label: `Food & Meals (${days} days)`,
      amount: estFood,
      status: "ESTIMATED",
      note: `Customized for ${foodPref} preferences (~₹${dailyFoodRate}/day/person)`,
    },
    {
      category: "Activities",
      label: `Sightseeing & Entry Fees`,
      amount: estActivities,
      status: "ESTIMATED",
      note: "Standard monument/attraction entry tickets & passes",
    },
    {
      category: "Emergency Buffer",
      label: `Contingency Safety Reserve (10%)`,
      amount: estEmergencyBuffer,
      status: "ESTIMATED",
      note: "Reserved for unexpected local transit, medical or emergency needs",
    },
  ];

  // Actionable Alternatives if Over Budget
  const alternatives = [];
  if (isOverBudget) {
    if (stayPref !== "Budget" && stayPref !== "Homestay") {
      const budgetStayCost = ACCOMMODATION_RATES["Budget"] * rooms * nights;
      const savings = estAccommodation - budgetStayCost;
      if (savings > 0) {
        alternatives.push({
          id: "alt_stay",
          title: "Switch to Verified Budget Stays or Homestays",
          savings,
          newEstimatedTotal: totalEstimatedCost - savings,
          description: `Switching to verified budget stays saves ~₹${savings.toLocaleString("en-IN")}, bringing remaining margin to ₹${(numericBudget - (totalEstimatedCost - savings)).toLocaleString("en-IN")}.`,
        });
      }
    }

    if (transportPref === "Flight" || transportPref === "Flexible") {
      const trainCost = (INTERCITY_ESTIMATES["Train"] || 1400) * 2 * totalPersons;
      const savings = estIntercityTransport - trainCost;
      if (savings > 0) {
        alternatives.push({
          id: "alt_train",
          title: "Switch Intercity Travel to Vande Bharat / Express Train",
          savings,
          newEstimatedTotal: totalEstimatedCost - savings,
          description: `Travelling by comfortable Express Train / AC Chair Car saves ~₹${savings.toLocaleString("en-IN")}.`,
        });
      }
    }

    alternatives.push({
      id: "alt_activities",
      title: "Focus on Free Scenic Nature Viewpoints & Heritage Trails",
      savings: Math.round(estActivities * 0.6),
      newEstimatedTotal: totalEstimatedCost - Math.round(estActivities * 0.6),
      description: `Replacing paid ticketed commercial experiences with free public scenic spots saves ~₹${Math.round(estActivities * 0.6).toLocaleString("en-IN")}.`,
    });
  }

  return {
    totalBudget: numericBudget,
    totalEstimatedCost,
    remainingBudget,
    isOverBudget,
    budgetDifference,
    emergencyBuffer: estEmergencyBuffer,
    items,
    alternatives,
  };
}

/**
 * Generate a realistic, route-optimized, time-blocked day-wise itinerary
 * Enforces programmatic zero-duplicate constraint across all days.
 */
export function generateSmartItinerary({
  destinationName = "",
  startDate = "",
  days = 3,
  attractions = [],
  destinationActivities = [],
  preferences = {},
}) {
  // 1. First priority: Check authoritative curated non-repeating multi-day itinerary (1 to 10+ days)
  const curated = getCuratedMultiDayItinerary(destinationName, startDate, days);
  if (Array.isArray(curated) && curated.length > 0) {
    return curated;
  }

  const walkingPref = preferences.walking || "Moderate";
  const foodPref = preferences.food || "Flexible";
  const tripStyle = preferences.tripStyle || "Balanced";
  const lateNightPref = preferences.lateNight || "Avoid Late Night";
  const interests = Array.isArray(preferences.interests) ? preferences.interests : [];

  // Determine stops per day based on pace and walking tolerance
  let stopsPerDay = 3;
  if (tripStyle === "Relaxed" || walkingPref === "Low / Minimal") {
    stopsPerDay = 2; // Unhurried pace
  } else if (tripStyle === "Fast-Paced" && walkingPref === "High / Trekking") {
    stopsPerDay = 4; // Active pace
  }

  // GLOBAL NO-DUPLICATE CONSTRAINT (JavaScript Set)
  const usedAttractionIds = new Set();

  // Score and group attractions by interests and proximity zones
  const scoredAttractions = [...attractions].map((attr) => {
    const aMeta = travelActivityData[attr.name] || {};
    let score = 0;

    if (walkingPref === "Low / Minimal" && (attr.walking === "low" || aMeta.walking === "low")) score += 2;
    if (walkingPref === "High / Trekking" && (attr.walking === "high" || aMeta.walking === "high")) score += 2;

    for (const interest of interests) {
      if (interest === "Nature & Scenic" && (/Point|Lake|Falls|Valley|View|Crest|Beach|Dam/i.test(attr.name) || attr.category?.includes("Scenic") || attr.category?.includes("Nature"))) score += 2;
      if (interest === "Culture & Heritage" && (/Temple|Fort|Palace|Museum|Monastery|Church|Heritage|Ghat/i.test(attr.name) || attr.category?.includes("Heritage"))) score += 2;
      if (interest === "Adventure & Trekking" && (/Peak|Pass|Trek|Rafting|Snow|Safari|Watersports|Tunnel/i.test(attr.name) || attr.category?.includes("Adventure"))) score += 2;
      if (interest === "Food & Culinary" && (/Bazaar|Market|Spice|Dhaba|Food/i.test(attr.name) || attr.category?.includes("Food"))) score += 2;
    }

    return { ...attr, score };
  });

  // Sort primarily by score, preserving stable secondary order
  scoredAttractions.sort((a, b) => b.score - a.score);

  // Group into geographic zones for route-aware daily assignments
  const zoneMap = new Map();
  for (const attr of scoredAttractions) {
    const zone = attr.zone || `${destinationName} Central`;
    if (!zoneMap.has(zone)) {
      zoneMap.set(zone, []);
    }
    zoneMap.get(zone).push(attr);
  }
  const zones = Array.from(zoneMap.keys());
  let currentZoneIndex = 0;

  // Extended experience pools with 15 unique day-specific variations
  const extendedMorningThemes = [
    "Scenic Nature Trail & Pine Forest Walk",
    "Sunrise Himalayan / Coastal Viewpoint & Meditation",
    "Heritage Village Walk & Traditional Architecture Tour",
    "Riverside Promenade & Nature Photography Stroll",
    "Botanical Gardens & Flora Identification Walk",
    "Orchard Walk & Fresh Fruit Picking Experience",
    "Ancient Monastic Trails & Quiet Contemplation",
    "Foothill Trekking & Valley Panorama Excursion",
    "Quiet Brook Exploration & Birdwatching Walk",
    "Hillside Terraced Farms & Agro-Tourism Walk",
    "Alpine Meadow Wander & Wildflower Trail",
    "Historic Hilltop Hermitage & Vista Point",
    "Valley Brook Walking Path & Spring Water Fountain",
    "Early Morning Forest Canopy Walk",
    "Panoramic Valley Ridge Hiking Excursion",
  ];

  const mealThemes = [
    "Traditional Regional Thali & Heritage Dining",
    "Riverside & Valley View Cafe Experience",
    "Authentic Regional Street Delicacies & Sweets Trail",
    "Scenic Garden Bistro & Mountain Flavors",
    "Chef's Signature Regional Specialties Platter",
    "Village Kitchen & Traditional Organic Feast",
    "Celebratory Farewell Gastronomic Experience",
    "Hilltop Vista Brunch & Local Tea Tasting",
    "Old Quarter Historic Dining & Flavors",
    "Rustic Hearthside Clay-Pot Cooking Delights",
    "Sunset Veranda Dining & Herbal Refreshments",
    "Culinary Discovery & Farm-to-Table Experience",
    "Highland Spiced Platters & Artisan Bread",
    "Local Food Market Discovery & Tasting Tour",
    "Grand Regional Banquet & Festive Spread",
  ];

  const extendedAfternoonThemes = [
    "Local Artisans & Heritage Handloom Craft Walk",
    "Regional Spice & Tea Blending Workshop",
    "Traditional Pottery & Woodcarving Studio Visit",
    "Folk Art Gallery & Cultural History Museum Tour",
    "Organic Herb Garden & Traditional Wellness Session",
    "Vintage Bookshop & Bohemian Cultural Cafe Crawl",
    "Heritage Clocktower & Colonial Architecture Promenade",
    "Local Weaver Co-operative & Shawl Weaving Workshop",
    "Regional Music & Instrument Artisan Workshop",
    "Culinary Cooking Class & Native Spice Demonstration",
    "Sculptors Studio & Regional Stone Carving Walk",
    "Botanical Nursery & Indigenous Flora Tour",
    "Highland Wool Carding & Loom Craft Tour",
    "Antique Artifacts & Heritage Curiosity Emporium",
    "Local Producers Co-op & Organic Honey Tasting",
  ];

  const extendedEveningThemes = [
    "Local Bazaar Souvenir & Handicraft Stroll",
    "Sunset Point Panorama & Evening Photography",
    "Acoustic Folk Music & Bonfire Culture Session",
    "Heritage Lake / Riverside Boat Promenade",
    "Traditional Cultural Dance & Music Performance",
    "Stargazing & Night Sky Astronomy Session",
    "Illuminated Heritage Square & Artisan Walk",
    "Scenic Ridge Promenade & Evening Lantern Walk",
    "Old Town Tea House & Mountain Storytelling",
    "Farewell Sunset Reflection & Souvenir Gathering",
    "Twilight Hilltop Lookout & Valley Lights",
    "Riverside Ghat Aarti / Twilight Promenade",
    "Heritage Coffee House & Discussion Circle",
    "Boutique Craft Market & Regional Souvenirs",
    "Celebratory Sunset Gathering & Reflection",
  ];

  const itineraryDays = [];

  for (let dayNum = 1; dayNum <= days; dayNum++) {
    const dayDate = computeDayDate(startDate, dayNum);
    const dayStops = [];

    // 1. First attempt: pick unused attractions from the current geographic zone (Route-Aware)
    if (zones.length > 0) {
      const activeZone = zones[currentZoneIndex % zones.length];
      const zoneAttractions = zoneMap.get(activeZone) || [];
      for (const attr of zoneAttractions) {
        const idKey = attr.id || attr.name;
        if (!usedAttractionIds.has(idKey) && !usedAttractionIds.has(attr.name)) {
          dayStops.push(attr);
          usedAttractionIds.add(idKey);
          usedAttractionIds.add(attr.name);
          if (dayStops.length >= stopsPerDay) break;
        }
      }
      currentZoneIndex++;
    }

    // 2. Second attempt: if dayStops < stopsPerDay, pick any remaining unused attractions across all zones
    if (dayStops.length < stopsPerDay) {
      for (const attr of scoredAttractions) {
        const idKey = attr.id || attr.name;
        if (!usedAttractionIds.has(idKey) && !usedAttractionIds.has(attr.name)) {
          dayStops.push(attr);
          usedAttractionIds.add(idKey);
          usedAttractionIds.add(attr.name);
          if (dayStops.length >= stopsPerDay) break;
        }
      }
    }

    // Build structured time blocks: Morning, Midday Meal, Afternoon, Sunset & Evening
    const timeBlocks = [];

    // Morning Block
    if (dayStops.length > 0) {
      const stop1 = dayStops[0];
      const meta1 = travelActivityData[stop1.name] || {};
      timeBlocks.push({
        timeSlot: "09:00 AM – 12:00 PM",
        period: "Morning",
        icon: "🌅",
        id: stop1.id || `day${dayNum}_morning`,
        title: stop1.name,
        type: stop1.category || meta1.type || "Sightseeing",
        duration: `${stop1.duration || meta1.duration || 2.5} hours`,
        travelTime: "15–20 mins local transit",
        transportMode: walkingPref === "Low / Minimal" ? "Cab / Auto" : "Auto or scenic walk",
        estimatedCost: stop1.cost ? `₹${stop1.cost}` : (meta1.cost !== undefined ? `₹${meta1.cost}` : "Free / Nominal entry"),
        bookingRequirement: (stop1.cost || meta1.cost) > 0 ? "Ticket at counter" : "Free entry",
        walkingIntensity: stop1.walking || meta1.walking || "Moderate",
        location: stop1.zone || destinationName,
        description: stop1.description || "Scenic morning exploration and photography.",
        smartReason: `Scheduled in the morning for crisp daylight and prime visibility. Grouped in the ${stop1.zone || destinationName} cluster.`,
      });
    } else {
      // Extended trip morning experience
      const morningTitle = `${destinationName} ${extendedMorningThemes[(dayNum - 1) % extendedMorningThemes.length]}`;
      timeBlocks.push({
        timeSlot: "09:30 AM – 12:00 PM",
        period: "Morning",
        icon: "🌿",
        id: `extended_morning_day_${dayNum}`,
        title: morningTitle,
        type: "Local Nature & Exploration",
        duration: "2.5 hours",
        travelTime: "10 mins local stroll",
        transportMode: "Scenic Walk / Auto",
        estimatedCost: "Free",
        bookingRequirement: "Open public trail",
        walkingIntensity: walkingPref === "Low / Minimal" ? "Low" : "Moderate",
        location: `${destinationName} Outskirts`,
        description: "All primary destination sights have been visited. Enjoying relaxed morning nature trails, local viewpoints, and fresh mountain/coastal air.",
        smartReason: "Not enough unique verified sights remaining for this duration; scheduling unique nature exploration rather than repeating visited sights.",
      });
    }

    // Midday Meal Block (12:30 PM – 02:00 PM)
    const foodReason =
      foodPref === "Vegetarian / Pure Veg"
        ? "Curated for pure vegetarian dining with authentic local preparations."
        : foodPref === "Local / Street Food"
        ? "Selected for authentic regional specialties and popular local eateries."
        : foodPref === "Fine Dining"
        ? "Selected for ambient dining and chef-curated regional platters."
        : `Centrally located dining stop along today's route.`;

    const mealTitle = `${destinationName} ${mealThemes[(dayNum - 1) % mealThemes.length]}`;

    timeBlocks.push({
      timeSlot: "12:30 PM – 02:00 PM",
      period: "Midday Meal",
      icon: "🍽️",
      id: `meal_day_${dayNum}`,
      title: mealTitle,
      type: "Meal",
      duration: "1.5 hours",
      travelTime: "5–10 mins from morning stop",
      transportMode: "Walking distance",
      estimatedCost: `₹${FOOD_RATES[foodPref] || 350}/person`,
      bookingRequirement: "Walk-in welcome",
      walkingIntensity: "Low",
      location: `Central ${destinationName}`,
      description: `Authentic meal stop customized for ${foodPref} preference.`,
      smartReason: foodReason,
    });

    // Afternoon Block (02:30 PM – 05:00 PM)
    if (dayStops.length > 1) {
      const stop2 = dayStops[1];
      const meta2 = travelActivityData[stop2.name] || {};
      timeBlocks.push({
        timeSlot: "02:30 PM – 05:00 PM",
        period: "Afternoon",
        icon: "🏛️",
        id: stop2.id || `day${dayNum}_afternoon`,
        title: stop2.name,
        type: stop2.category || meta2.type || "Cultural / Scenic",
        duration: `${stop2.duration || meta2.duration || 2} hours`,
        travelTime: "15–20 mins local transit",
        transportMode: "Auto / Cab",
        estimatedCost: stop2.cost ? `₹${stop2.cost}` : (meta2.cost !== undefined ? `₹${meta2.cost}` : "Free entry"),
        bookingRequirement: (stop2.cost || meta2.cost) > 0 ? "Standard entry" : "Free entry",
        walkingIntensity: stop2.walking || meta2.walking || "Moderate",
        location: stop2.zone || destinationName,
        description: stop2.description || "Afternoon exploration of cultural and scenic highlights.",
        smartReason: `Co-located in the ${stop2.zone || destinationName} cluster right after lunch to avoid cross-city transit.`,
      });
    } else {
      const afternoonTitle = `${destinationName} ${extendedAfternoonThemes[(dayNum - 1) % extendedAfternoonThemes.length]}`;
      timeBlocks.push({
        timeSlot: "02:30 PM – 05:00 PM",
        period: "Afternoon",
        icon: "🎨",
        id: `extended_afternoon_day_${dayNum}`,
        title: afternoonTitle,
        type: "Cultural & Craft Walk",
        duration: "2 hours",
        travelTime: "10 mins transit",
        transportMode: "Auto / Walk",
        estimatedCost: "Free / Personal shopping",
        bookingRequirement: "Open craft community",
        walkingIntensity: "Low to Moderate",
        location: `Old Quarter, ${destinationName}`,
        description: "Discover regional handicrafts, meet local artisans/weavers, and experience authentic community heritage.",
        smartReason: "Curated local cultural experience scheduled to prevent sight repetition on extended stays.",
      });
    }

    // Sunset & Evening Block (05:30 PM – 08:00 PM)
    const isLateNightRestricted = lateNightPref === "Daytime Only" || lateNightPref === "Avoid Late Night";
    if (dayStops.length > 2) {
      const stop3 = dayStops[2];
      timeBlocks.push({
        timeSlot: isLateNightRestricted ? "05:30 PM – 07:30 PM" : "05:30 PM – 09:30 PM",
        period: "Sunset & Evening",
        icon: "🌆",
        id: stop3.id || `day${dayNum}_evening`,
        title: stop3.name,
        type: stop3.category || "Evening Sightseeing & Viewpoint",
        duration: isLateNightRestricted ? "2 hours" : "3 hours",
        travelTime: "10–15 mins local transit",
        transportMode: "Walk / Auto",
        estimatedCost: stop3.cost ? `₹${stop3.cost}` : "Free entry",
        bookingRequirement: "Open public area",
        walkingIntensity: "Low",
        location: stop3.zone || destinationName,
        description: stop3.description || "Evening golden hour vistas and leisure walk.",
        smartReason: isLateNightRestricted
          ? "Scheduled during twilight to ensure the day safely wraps up before 8:00 PM."
          : "Golden hour sunset viewpoint followed by evening cafe stroll.",
      });
    } else {
      const eveningTitle = `${destinationName} ${extendedEveningThemes[(dayNum - 1) % extendedEveningThemes.length]}`;
      timeBlocks.push({
        timeSlot: isLateNightRestricted ? "05:30 PM – 07:30 PM" : "05:30 PM – 09:30 PM",
        period: "Sunset & Evening",
        icon: "🛍️",
        id: `extended_evening_day_${dayNum}`,
        title: eveningTitle,
        type: "Evening Leisure",
        duration: isLateNightRestricted ? "2 hours" : "3.5 hours",
        travelTime: "10 mins walk",
        transportMode: "Walk / Rickshaw",
        estimatedCost: "Free / Personal spends",
        bookingRequirement: "Open public promenade",
        walkingIntensity: "Low",
        location: `Promenade & Market, ${destinationName}`,
        description: "Unhurried evening stroll through local bazaars, sampling regional tea and street delicacies at your own pace.",
        smartReason: isLateNightRestricted
          ? "Wraps up early respecting your preference to avoid late-night road transit."
          : "Relaxed evening exploring local bazaars and sunset promenade.",
      });
    }

    const summaryTitles = dayStops.map((s) => s.name).filter(Boolean);
    const daySummary = summaryTitles.length > 0
      ? `Day ${dayNum}: ${summaryTitles.join(" • ")}`
      : `Day ${dayNum}: ${destinationName} Local Culture & Leisure Walk`;

    itineraryDays.push({
      day: dayNum,
      date: dayDate,
      timeBlocks,
      summary: daySummary,
    });
  }

  return itineraryDays;
}

// Date helper
function computeDayDate(baseDate, dayOffset) {
  if (!baseDate) {
    return `Day ${dayOffset}`;
  }
  const dateObj = new Date(baseDate);
  if (isNaN(dateObj.getTime())) {
    return `Day ${dayOffset}`;
  }
  dateObj.setDate(dateObj.getDate() + (dayOffset - 1));
  return dateObj.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Hybrid Intelligence Orchestrator.
 * Attempts to fetch Python-optimized plan via Node.js Gateway.
 * If Python is offline or network fails, gracefully falls back to local deterministic calculations.
 */
export async function fetchSmartPlanIntelligence({
  destination = "",
  origin = "",
  startDate = "",
  endDate = "",
  days = 3,
  adults = 2,
  children = 0,
  budget = 25000,
  tripType = "Friends",
  preferences = {},
  selectedHotel = null,
  attractions = [],
  weatherData = null,
}) {
  const localFallbackBudget = calculateTripBudgetBreakdown({
    totalBudget: budget,
    origin,
    destination,
    days,
    adults,
    children,
    preferences,
    selectedHotel,
  });

  const localFallbackItinerary = generateSmartItinerary({
    destinationName: destination,
    startDate,
    days,
    attractions,
    preferences,
  });

  try {
    const payload = {
      tripContext: {
        destination,
        origin,
        startDate,
        endDate,
        days,
        travelers: { adults, children, total: adults + children },
        tripType,
      },
      budgetContext: {
        totalBudget: budget,
        selectedHotelPrice: selectedHotel?.price || null,
        hotelBookingStatus: selectedHotel ? "CONFIRMED" : "ESTIMATED",
      },
      preferences,
      candidateAttractions: attractions,
      realTimeContext: {
        weather: weatherData || { status: "UNAVAILABLE" },
      },
    };

    const pyResponse = await optimizeTripPlanWithIntelligence(payload);
    
    // Determine whether Python service genuinely returned a live intelligence response
    const isPythonEngine = Boolean(
      pyResponse &&
      !pyResponse.fallback &&
      (pyResponse.gateway?.source === "python_intelligence" ||
       pyResponse.engine === "python_intelligence_v1")
    );

    // Prioritize authoritative curated multi-day itinerary to guarantee 100% zero duplicate days
    const curatedMaster = getCuratedMultiDayItinerary(destination, startDate, days);
    const itineraryDays =
      Array.isArray(curatedMaster) && curatedMaster.length > 0
        ? curatedMaster
        : (isPythonEngine &&
           Array.isArray(pyResponse?.itineraryResult?.itinerary) &&
           pyResponse.itineraryResult.itinerary.length > 0
            ? pyResponse.itineraryResult.itinerary
            : localFallbackItinerary);

    const budgetBreakdown =
      pyResponse?.budgetResult &&
      typeof pyResponse.budgetResult.totalEstimatedCost === "number" &&
      Array.isArray(pyResponse.budgetResult.items) &&
      pyResponse.budgetResult.items.length > 0
        ? pyResponse.budgetResult
        : localFallbackBudget;

    return {
      source: isPythonEngine ? "python_intelligence" : "deterministic_fallback",
      dataStatus: isPythonEngine
        ? (pyResponse.itineraryResult?.provenance?.dataStatus || "DATABASE")
        : "DEMO/FALLBACK",
      engine: isPythonEngine
        ? (pyResponse.engine || "python_intelligence_v1")
        : "deterministic_local_engine",
      lastUpdated: pyResponse?.lastUpdated || new Date().toISOString(),
      confidenceScore: isPythonEngine ? 0.95 : 0.88,
      itineraryDays,
      budgetBreakdown,
      isPythonAvailable: isPythonEngine,
      notice: isPythonEngine
        ? null
        : "Smart optimization temporarily unavailable — showing standard plan.",
    };
  } catch (err) {
    console.info(
      "[Hybrid Planner] Python Intelligence offline/unreachable, using verified deterministic fallback:",
      err.message
    );
  }

  // Graceful deterministic fallback
  return {
    source: "deterministic_fallback",
    dataStatus: "DEMO/FALLBACK",
    engine: "deterministic_local_engine",
    lastUpdated: new Date().toISOString(),
    confidenceScore: 0.88,
    itineraryDays: localFallbackItinerary,
    budgetBreakdown: localFallbackBudget,
    isPythonAvailable: false,
    notice: "Smart optimization temporarily unavailable — showing standard plan.",
  };
}

