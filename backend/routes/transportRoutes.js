const express = require("express");
const { searchTransport, getAllLocations, OFFICIAL_PROVIDERS } = require("../services/transportService");
const { INDIA_LOCATIONS } = require("../data/indiaLocationMaster");
const { optimizeTransport } = require("../services/pythonIntelligenceClient");

const router = express.Router();

console.log("Transport routes loaded with India-Wide Multimodal Engine");

// Popular Indian travel corridors
const popularRoutes = [
  { origin: "Delhi", destination: "Shimla", modes: ["Train", "Bus", "Flight"], description: "Scenic mountain getaway with Kalka Toy Train & direct Volvos." },
  { origin: "Kolkata", destination: "Mumbai", modes: ["Train", "Flight"], description: "Major trans-India trunk line; Gitanjali & Duronto Express, nonstop flights." },
  { origin: "Delhi", destination: "Mumbai", modes: ["Flight", "Train"], description: "Golden Quadrilateral; Mumbai Rajdhani in 15h 30m, 2h 10m direct flights." },
  { origin: "Kolkata", destination: "Delhi", modes: ["Train", "Flight"], description: "Howrah Rajdhani Express & hourly direct flights." },
  { origin: "Mumbai", destination: "Goa", modes: ["Flight", "Train", "Bus"], description: "Beaches & nightlife; Tejas Express, Vande Bharat & 1h 15m flights." },
  { origin: "Bengaluru", destination: "Goa", modes: ["Flight", "Bus", "Train"], description: "Coastal weekend trips; overnight sleeper buses & direct flights." },
  { origin: "Kolkata", destination: "Darjeeling", modes: ["Train", "Flight", "Bus"], description: "Himalayan tea country; Darjeeling Mail via NJP + Hill Toy Train." },
  { origin: "Delhi", destination: "Manali", modes: ["Bus", "Flight"], description: "Adventure & snow hub; overnight luxury sleeper buses via Chandigarh." },
  { origin: "Delhi", destination: "Jaipur", modes: ["Train", "Bus", "Flight"], description: "Golden Triangle heritage; Vande Bharat Express in 3h 40m." },
  { origin: "Delhi", destination: "Varanasi", modes: ["Train", "Flight"], description: "Spiritual corridor; Vande Bharat & nonstop direct flights." },
  { origin: "Chennai", destination: "Bengaluru", modes: ["Train", "Bus", "Flight"], description: "Southern tech corridor; Shatabdi / Vande Bharat in 4h 15m." },
  { origin: "Kolkata", destination: "Puri", modes: ["Train", "Bus"], description: "Coastal pilgrimage & beach retreat; Vande Bharat Express in 6h 25m." },
];

// GET /api/transport/search
router.get("/search", async (req, res) => {
  try {
    const {
      origin = "Delhi",
      destination = "Shimla",
      type = "all",
      date,
      travelDate,
      sortBy = "recommended",
      maxPrice,
      passengers = 1,
      useAiOptimization = "true",
    } = req.query;

    const results = searchTransport({
      origin,
      destination,
      type,
      travelDate: travelDate || date,
      sortBy,
      maxPrice,
      passengers: parseInt(passengers, 10) || 1,
    });

    // Optionally score candidates via Python Intelligence if available and requested
    if (useAiOptimization === "true" && results.results && results.results.length > 0) {
      try {
        const aiScore = await optimizeTransport({
          origin: results.origin,
          destination: results.destination,
          travelDate: results.travelDate,
          sortBy,
          candidates: results.results.slice(0, 20),
        });

        if (aiScore && aiScore.recommendation) {
          results.intelligence = {
            engine: aiScore.engine || "python_transport_optimizer",
            recommendation: aiScore.recommendation,
            provenance: aiScore.provenance,
          };
        }
      } catch (aiErr) {
        // Non-blocking fallback
        results.intelligence = {
          engine: "deterministic_evaluator",
          note: "Evaluated using deterministic transit matrix.",
        };
      }
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Transport search error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to search transport options.",
    });
  }
});

// GET /api/transport/popular-routes
router.get("/popular-routes", (req, res) => {
  res.status(200).json({
    success: true,
    routes: popularRoutes,
  });
});

// GET /api/transport/locations
router.get("/locations", (req, res) => {
  res.status(200).json({
    success: true,
    locations: getAllLocations(),
  });
});

// GET /api/transport/cities (backward compatibility)
router.get("/cities", (req, res) => {
  res.status(200).json({
    success: true,
    cities: getAllLocations(),
  });
});

// GET /api/transport/providers
router.get("/providers", (req, res) => {
  res.status(200).json({
    success: true,
    providers: OFFICIAL_PROVIDERS,
  });
});

module.exports = router;
