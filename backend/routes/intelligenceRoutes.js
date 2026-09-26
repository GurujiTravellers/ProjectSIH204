const express = require("express");
const {
  checkHealth,
  optimizeTripPlan,
  optimizeBudget,
  optimizeTransport,
} = require("../services/pythonIntelligenceClient");

const router = express.Router();

// Connection state tracking to throttle terminal warnings and prevent log spam
let lastOfflineNoticeTimestamp = 0;
let pythonWasOffline = false;

function logPythonOffline(errMessage) {
  const now = Date.now();
  if (!pythonWasOffline || now - lastOfflineNoticeTimestamp > 60000) {
    console.warn(
      `[Intelligence Gateway] Python intelligence service offline (${errMessage}). Operating in resilient deterministic fallback mode. (To run the Python AI service, run: python python_service/server.py)`
    );
    lastOfflineNoticeTimestamp = now;
    pythonWasOffline = true;
  }
}

function logPythonOnline() {
  if (pythonWasOffline) {
    console.log(
      "[Intelligence Gateway] Python intelligence service reconnected successfully at http://127.0.0.1:8000"
    );
    pythonWasOffline = false;
  }
}

// GET /api/intelligence/health
router.get("/health", async (req, res) => {
  const pyHealth = await checkHealth();
  if (pyHealth.connected) {
    logPythonOnline();
  }
  res.json({
    status: "ok",
    gateway: "Node.js Express API Gateway",
    pythonService: pyHealth.connected ? "connected" : "offline",
    pythonDetails: pyHealth.details || null,
    pythonError: pyHealth.error || null,
    timestamp: new Date().toISOString(),
  });
});

function buildDeterministicFallback(body, errMessage) {
  const {
    tripContext = {},
    budgetContext = {},
    preferences = {},
    candidateAttractions = [],
  } = body;

  const days = Math.max(1, Number(tripContext.days || 3));
  const destination = tripContext.destination || "Destination";
  const origin = tripContext.origin || "Origin";

  const travelersObj = tripContext.travelers || {};
  let adults = 2;
  let children = 0;
  if (typeof travelersObj === "object" && travelersObj !== null) {
    adults = Number(travelersObj.adults || tripContext.adults || 2);
    children = Number(travelersObj.children || tripContext.children || 0);
  } else if (typeof travelersObj === "number") {
    adults = Math.max(1, travelersObj);
  }
  const totalPersons = Math.max(1, adults + children);
  const nights = Math.max(1, days - 1);
  const rooms = Math.ceil(totalPersons / 2);

  const rawBudget = budgetContext.totalBudget || tripContext.budget || 25000;
  const totalBudget = Number(rawBudget);

  const stayPref = preferences.accommodation || "Mid-Range";
  const transportPref = preferences.transport || "Flexible";
  const foodPref = preferences.food || "Flexible";
  const walkingPref = preferences.walking || "Moderate";

  const stayRates = {
    Budget: 1800,
    "Mid-Range": 3600,
    Luxury: 8500,
    Homestay: 2200,
  };
  const roomRate = stayRates[stayPref] || 3600;
  const estAccommodation = Math.round(roomRate * rooms * nights);

  const transitRates = {
    Flight: 4800,
    Train: 1400,
    Bus: 900,
    "Self-Drive": 2500,
    Flexible: 1600,
  };
  const transitRate = transitRates[transportPref] || 1600;
  const estIntercity = Math.round(transitRate * 2 * totalPersons);

  const foodRates = {
    "Local / Street Food": 250,
    "Vegetarian / Pure Veg": 320,
    "Cafes & Casual": 480,
    "Fine Dining": 950,
    Flexible: 380,
  };
  const dailyFoodRate = foodRates[foodPref] || 380;
  const estFood = Math.round(dailyFoodRate * totalPersons * days);

  const estLocalTransport = Math.round(
    (walkingPref === "High / Trekking" ? 180 : 350) * totalPersons * days
  );
  const estActivities = Math.round(300 * totalPersons * days);

  const baseCost =
    estAccommodation + estIntercity + estFood + estLocalTransport + estActivities;
  const emergencyBuffer = Math.round(baseCost * 0.1);
  const totalEstimatedCost = baseCost + emergencyBuffer;
  const remainingBudget = totalBudget - totalEstimatedCost;
  const isOverBudget = totalEstimatedCost > totalBudget;
  const budgetDifference = Math.abs(totalEstimatedCost - totalBudget);

  const items = [
    {
      category: "Accommodation",
      label: `${stayPref} Stay (${nights} nights, ${rooms} room${rooms > 1 ? "s" : ""})`,
      amount: estAccommodation,
      status: "ESTIMATED",
      note: `Standard benchmark rate (~₹${roomRate}/room/night)`,
    },
    {
      category: "Transportation",
      label: `Intercity Travel (${origin} ⇄ ${destination})`,
      amount: estIntercity,
      status: "ESTIMATED",
      note: `Estimated round-trip for ${totalPersons} traveler${totalPersons > 1 ? "s" : ""} via ${transportPref}`,
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
      label: "Sightseeing & Entry Fees",
      amount: estActivities,
      status: "ESTIMATED",
      note: "Standard monument/attraction entry tickets & passes",
    },
    {
      category: "Emergency Buffer",
      label: "Contingency Safety Reserve (10%)",
      amount: emergencyBuffer,
      status: "ESTIMATED",
      note: "Reserved for unexpected local transit or emergencies",
    },
  ];

  const alternatives = [];
  if (isOverBudget) {
    if (stayPref !== "Budget" && stayPref !== "Homestay") {
      const budgetStayCost = 1800 * rooms * nights;
      const savings = estAccommodation - budgetStayCost;
      if (savings > 0) {
        alternatives.push({
          id: "alt_stay",
          title: "Switch to Verified Budget Stays or Homestays",
          savings,
          newEstimatedTotal: totalEstimatedCost - savings,
          description: `Switching to verified budget stays saves ~₹${savings.toLocaleString("en-IN")}.`,
        });
      }
    }
  }

  // Generate full time-blocked day-wise itinerary with ZERO duplicate attractions
  const itinerary = [];
  const attractionsPool =
    Array.isArray(candidateAttractions) && candidateAttractions.length > 0
      ? [...candidateAttractions]
      : [];

  const usedAttractions = new Set();
  const getUniqueAttraction = (period, dayNum) => {
    // Try to find an unused candidate attraction
    for (const attr of attractionsPool) {
      if (attr && attr.name && !usedAttractions.has(attr.name)) {
        usedAttractions.add(attr.name);
        return attr;
      }
    }

    // Dynamic unique fallback themes per day and period
    const dayThemes = [
      { morning: "Historic Heritage & Ancient Fortifications", afternoon: "Artisan Craft Guilds & Traditional Bazaars" },
      { morning: "Scenic Mountain / Coastal Viewpoint & Nature Walk", afternoon: "Royal Palace Museum & Botanical Gardens" },
      { morning: "UNESCO Monumental Architecture & Stepped Reservoirs", afternoon: "Cultural Heritage Center & Living Crafts" },
      { morning: "Wildlife Eco-Sanctuary & Forest Boardwalk", afternoon: "Lakeside Ghats & Holy Shrines" },
      { morning: "Sacred Spiritual Shrines & Serene Cloisters", afternoon: "Local Spice Plantation & Culinary Trail" },
      { morning: "Vibrant Desert Dunes / Coastal Peninsula & Cliffs", afternoon: "Handloom Weavers Enclave & Folk Traditions" },
      { morning: "Archaeological Excavations & Antiquities Gallery", afternoon: "Sunset Dam Overlook & Eco-Park Trails" },
      { morning: "Subterranean Caves & Geological Wonders", afternoon: "Old Town Heritage Walk & Street Artisan Quarter" },
      { morning: "Alpine Valley Vista & Pine Forest Trail", afternoon: "Riverfront Promenade & Twilight Cultural Spectacle" },
      { morning: "Panoramic Summit Ridge & Birding Wetland Reserve", afternoon: "Grand Farewell Scenic Viewpoint & Souvenir Enclave" },
    ];

    const theme = dayThemes[(dayNum - 1) % dayThemes.length];
    const spotName = period === "Morning" ? theme.morning : theme.afternoon;
    const uniqueSpot = `${destination} ${spotName} (Day ${dayNum})`;
    usedAttractions.add(uniqueSpot);
    return { name: uniqueSpot, duration: "2.5 hrs" };
  };

  for (let d = 1; d <= days; d++) {
    const morningAttraction = getUniqueAttraction("Morning", d);
    const afternoonAttraction = getUniqueAttraction("Afternoon", d);

    itinerary.push({
      day: d,
      date: `Day ${d}`,
      summary: `Exploration of ${destination} - Highlights & Culture`,
      timeBlocks: [
        {
          period: "Morning",
          timeSlot: "09:00 AM - 12:30 PM",
          icon: "☀️",
          title: `Discover ${morningAttraction.name || "City Highlights"}`,
          description: `Morning exploration of ${morningAttraction.name || destination} with favorable daylight.`,
          duration: morningAttraction.duration || "2.5 hrs",
          travelTime: "15-25 mins",
          transportMode: "Auto / Cab",
          walkingIntensity: walkingPref,
          bookingRequirement: "Spot Entry",
          estimatedCost: "₹150 - ₹300",
          smartReason: "Morning timing ensures pleasant weather and minimal queue delays.",
        },
        {
          period: "Midday Meal",
          timeSlot: "12:30 PM - 02:00 PM",
          icon: "🍛",
          title: `Traditional Lunch (${foodPref})`,
          description: `Authentic regional dining experience in ${destination}.`,
          duration: "1.5 hrs",
          travelTime: "Walkable",
          transportMode: "Walking",
          walkingIntensity: "Minimal",
          bookingRequirement: "Walk-in",
          estimatedCost: `₹${dailyFoodRate} per person`,
          smartReason: "Midday meal break positioned near sightseeing zone.",
        },
        {
          period: "Afternoon",
          timeSlot: "02:30 PM - 05:30 PM",
          icon: "🏛️",
          title: `Scenic Tour: ${afternoonAttraction.name || "Cultural Trail"}`,
          description: `Afternoon visit to ${afternoonAttraction.name || "notable landmarks"} with scenic photo spots.`,
          duration: afternoonAttraction.duration || "2.5 hrs",
          travelTime: "20 mins",
          transportMode: "Local Taxi",
          walkingIntensity: walkingPref,
          bookingRequirement: "Spot Entry",
          estimatedCost: "Free / Nominal",
          smartReason: "Geographically clustered to reduce transit time.",
        },
        {
          period: "Sunset & Evening",
          timeSlot: "06:00 PM - 08:30 PM",
          icon: "🌆",
          title: `${destination} Evening Promenade & Bazaars`,
          description: "Relaxed stroll through local markets and artisan shops.",
          duration: "2 hrs",
          travelTime: "10 mins",
          transportMode: "Walking",
          walkingIntensity: "Low",
          bookingRequirement: "Free Access",
          estimatedCost: "Free Entry",
          smartReason: "Safe, vibrant evening walk concluded before late night.",
        },
      ],
    });
  }

  return {
    success: true,
    engine: "deterministic_fallback",
    lastUpdated: new Date().toISOString(),
    fallback: true,
    itineraryResult: {
      engine: "deterministic_fallback",
      provenance: {
        dataSource: "deterministic_fallback_engine",
        dataStatus: "DEMO/FALLBACK",
        lastUpdated: new Date().toISOString(),
        confidenceScore: 0.88,
        note: "Generated using Node.js deterministic fallback while Python service was offline.",
      },
      itinerary,
    },
    budgetResult: {
      engine: "deterministic_fallback",
      provenance: {
        dataSource: "deterministic_rate_benchmarks",
        dataStatus: "DEMO/FALLBACK",
        lastUpdated: new Date().toISOString(),
        confidenceScore: 0.88,
        note: "Standard baseline calculations.",
      },
      totalBudget,
      totalEstimatedCost,
      remainingBudget,
      isOverBudget,
      budgetDifference,
      emergencyBuffer,
      items,
      alternatives,
    },
    gateway: {
      status: "fallback",
      source: "deterministic_fallback",
      error: errMessage,
      timestamp: new Date().toISOString(),
    },
  };
}

// POST /api/intelligence/optimize-itinerary
router.post("/optimize-itinerary", async (req, res) => {
  try {
    const pythonResult = await optimizeTripPlan(req.body);
    logPythonOnline();
    return res.json({
      ...pythonResult,
      gateway: {
        status: "proxied",
        source: "python_intelligence",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    logPythonOffline(err.message);
    const fallbackResponse = buildDeterministicFallback(req.body, err.message);
    return res.json(fallbackResponse);
  }
});

// POST /api/intelligence/optimize-budget
router.post("/optimize-budget", async (req, res) => {
  try {
    const pythonResult = await optimizeBudget(req.body);
    logPythonOnline();
    return res.json({
      ...pythonResult,
      gateway: {
        status: "proxied",
        source: "python_intelligence",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    logPythonOffline(err.message);
    return res.status(503).json({
      success: false,
      message: "Python budget optimizer offline",
    });
  }
});

// POST /api/intelligence/optimize-transport
router.post("/optimize-transport", async (req, res) => {
  try {
    const pythonResult = await optimizeTransport(req.body);
    logPythonOnline();
    return res.json({
      ...pythonResult,
      gateway: {
        status: "proxied",
        source: "python_intelligence",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    logPythonOffline(err.message);

    // Resilient Node fallback for transport candidates
    const { candidates = [] } = req.body;
    const cheapest = [...candidates].sort((a, b) => (a.price || 0) - (b.price || 0))[0] || null;
    const fastest = [...candidates].sort((a, b) => {
      const getM = (d = "") => {
        const h = (d.match(/(\d+)h/) || [])[1] || 0;
        const m = (d.match(/(\d+)m/) || [])[1] || 0;
        return parseInt(h, 10) * 60 + parseInt(m, 10);
      };
      return getM(a.duration) - getM(b.duration);
    })[0] || null;

    return res.json({
      success: true,
      engine: "deterministic_fallback",
      lastUpdated: new Date().toISOString(),
      fallback: true,
      provenance: {
        dataSource: "deterministic_transport_evaluator",
        dataStatus: "DEMO/FALLBACK",
        lastUpdated: new Date().toISOString(),
        confidenceScore: 0.88,
        note: "Ranked via local fallback while Python intelligence was offline.",
      },
      recommendation: {
        topId: (cheapest || fastest)?.id || null,
        cheapestId: cheapest?.id || null,
        fastestId: fastest?.id || null,
        reason: cheapest
          ? `Recommended: Optimal fare at ₹${cheapest.price?.toLocaleString("en-IN")} for this route.`
          : "Standard transport evaluation.",
      },
      rankedCandidates: candidates,
      gateway: {
        status: "fallback",
        source: "deterministic_fallback",
        error: err.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

module.exports = router;

