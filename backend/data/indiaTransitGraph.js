/**
 * India-Wide Transit Graph and Transport Directory
 * 
 * Centralized location model, authentic railway database, domestic air corridors,
 * and multimodal transit connection hubs across all supported origins and destinations.
 */

// Normalized City / Hub Metadata
const TRANSIT_CITIES = {
  Delhi: {
    name: "Delhi",
    state: "Delhi",
    code: "DEL",
    isMetro: true,
    airport: "Indira Gandhi International Airport (IGI - DEL)",
    railway: "New Delhi Railway Station (NDLS)",
    secondaryStations: ["Old Delhi (DLI)", "Hazrat Nizamuddin (NZM)", "Anand Vihar (ANVT)"],
    bus: "Maharana Pratap Inter-State Bus Terminal (Kashmere Gate ISBT)",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 28.6139, lng: 77.2090 },
  },
  Mumbai: {
    name: "Mumbai",
    state: "Maharashtra",
    code: "BOM",
    isMetro: true,
    airport: "Chhatrapati Shivaji Maharaj International Airport (CSMIA - BOM)",
    railway: "Mumbai Central (MMCT) / Chhatrapati Shivaji Maharaj Terminus (CSMT)",
    secondaryStations: ["Bandra Terminus (BDTS)", "Lokmanya Tilak Terminus (LTT)", "Dadar (DR)"],
    bus: "Borivali / Dadar TT Bus Terminal",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 19.0760, lng: 72.8777 },
  },
  Kolkata: {
    name: "Kolkata",
    state: "West Bengal",
    code: "CCU",
    isMetro: true,
    airport: "Netaji Subhash Chandra Bose International Airport (CCU)",
    railway: "Howrah Junction (HWH) / Sealdah (SDAH)",
    secondaryStations: ["Kolkata Terminal (KOAA)", "Shalimar (SHM)"],
    bus: "Esplanade Central Bus Terminal / Karunamoyee ISBT",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 22.5726, lng: 88.3639 },
  },
  Bengaluru: {
    name: "Bengaluru",
    state: "Karnataka",
    code: "BLR",
    isMetro: true,
    airport: "Kempegowda International Airport (BLR)",
    railway: "KSR Bengaluru City (SBC) / Yesvantpur (YPR)",
    secondaryStations: ["Sir M. Visvesvaraya Terminal (SMVB)", "Bengaluru Cantt (BNC)"],
    bus: "Kempegowda Bus Station (Majestic) / Shantinagar Bus Stand",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  Chennai: {
    name: "Chennai",
    state: "Tamil Nadu",
    code: "MAA",
    isMetro: true,
    airport: "Chennai International Airport (MAA)",
    railway: "Puratchi Thalaivar Dr. M.G.R. Central (MAS)",
    secondaryStations: ["Chennai Egmore (MS)", "Tambaram (TBM)"],
    bus: "Chennai Mofussil Bus Terminus (CMBT Koyambedu)",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 13.0827, lng: 80.2707 },
  },
  Hyderabad: {
    name: "Hyderabad",
    state: "Telangana",
    code: "HYD",
    isMetro: true,
    airport: "Rajiv Gandhi International Airport (HYD)",
    railway: "Secunderabad Junction (SC) / Kacheguda (KCG)",
    secondaryStations: ["Hyderabad Deccan Nampally (HYB)"],
    bus: "Mahatma Gandhi Bus Station (MGBS) / Jubilee Bus Station (JBS)",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 17.3850, lng: 78.4867 },
  },
  Pune: {
    name: "Pune",
    state: "Maharashtra",
    code: "PNQ",
    isMetro: false,
    airport: "Pune International Airport (PNQ)",
    railway: "Pune Junction (PUNE)",
    secondaryStations: ["Shivajinagar (SVJR)"],
    bus: "Swargate Bus Stand / Shivajinagar ST Stand",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 18.5204, lng: 73.8567 },
  },
  Ahmedabad: {
    name: "Ahmedabad",
    state: "Gujarat",
    code: "AMD",
    isMetro: false,
    airport: "Sardar Vallabhbhai Patel International Airport (AMD)",
    railway: "Ahmedabad Junction (ADI - Kalupur)",
    secondaryStations: ["Sabarmati Junction (SBIB)"],
    bus: "Geeta Mandir Central Bus Station",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 23.0225, lng: 72.5714 },
  },
  Jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    code: "JAI",
    isMetro: false,
    airport: "Jaipur International Airport (JAI)",
    railway: "Jaipur Junction (JP)",
    secondaryStations: ["Gandhinagar Jaipur (GADJ)"],
    bus: "Sindhi Camp Central Bus Terminal",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 26.9124, lng: 75.7873 },
  },
  Goa: {
    name: "Goa",
    state: "Goa",
    code: "GOI",
    isMetro: false,
    airport: "Dabolim International (GOI) / Manohar International (MOPA - GOX)",
    railway: "Madgaon Junction (MAO)",
    secondaryStations: ["Thivim (THVM)", "Vasco da Gama (VSG)", "Karmali (KRMI)"],
    bus: "Kadam Transport Bus Stand (Panaji / Margao)",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 15.2993, lng: 74.1240 },
  },
  Shimla: {
    name: "Shimla",
    state: "Himachal Pradesh",
    code: "SLV",
    isMetro: false,
    airport: "Shimla Jubbarhatti Airport (SLV - Limited)",
    railway: "Shimla Railway Station (SML - Narrow Gauge Heritage)",
    bus: "ISBT Tutikandi Shimla",
    hasCommercialAirport: false,
    hasDirectRailway: false,
    nearestRailHub: {
      city: "Kalka",
      station: "Kalka Railway Station (KLK - Broad Gauge Railhead)",
      transferDistanceKm: 90,
      transferDuration: "3h 15m",
      modes: ["Kalka-Shimla Toy Train", "Himalayan Expressway AC Taxi", "HRTC Volvo Bus"],
    },
    nearestAirHub: {
      city: "Chandigarh",
      airport: "Shaheed Bhagat Singh International Airport (IXC)",
      transferDistanceKm: 115,
      transferDuration: "3h 30m",
      modes: ["Prepaid AC Taxi", "HRTC Himgaurav Volvo"],
    },
    coordinates: { lat: 31.1048, lng: 77.1734 },
  },
  Manali: {
    name: "Manali",
    state: "Himachal Pradesh",
    code: "KUU",
    isMetro: false,
    airport: "Kullu-Bhuntar Airport (KUU - 50 km)",
    railway: "No direct rail (Mountain Terrain)",
    bus: "Private Volvo Stand / HRTC Bus Stand Manali",
    hasCommercialAirport: false,
    hasDirectRailway: false,
    nearestRailHub: {
      city: "Chandigarh",
      station: "Chandigarh Junction (CDG)",
      transferDistanceKm: 310,
      transferDuration: "7h 30m",
      modes: ["HRTC Himsuta Volvo AC Sleeper", "Private Luxury Tourist Bus", "Intercity Cab"],
    },
    nearestAirHub: {
      city: "Chandigarh",
      airport: "Shaheed Bhagat Singh International Airport (IXC)",
      transferDistanceKm: 310,
      transferDuration: "7h 30m",
      modes: ["Overnight Volvo Sleeper", "Private Tourist Cab"],
    },
    coordinates: { lat: 32.2396, lng: 77.1887 },
  },
  Kalka: {
    name: "Kalka",
    state: "Haryana",
    code: "KLK",
    isMetro: false,
    airport: "Shaheed Bhagat Singh International Airport (IXC - 28 km)",
    railway: "Kalka Railway Station (KLK)",
    bus: "Kalka Bus Stand",
    hasCommercialAirport: false,
    hasDirectRailway: true,
    coordinates: { lat: 30.8389, lng: 76.9351 },
  },
  Chandigarh: {
    name: "Chandigarh",
    state: "Chandigarh",
    code: "IXC",
    isMetro: false,
    airport: "Shaheed Bhagat Singh International Airport (IXC)",
    railway: "Chandigarh Junction (CDG)",
    bus: "ISBT Sector 43 / ISBT Sector 17",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 30.7333, lng: 76.7794 },
  },
  Darjeeling: {
    name: "Darjeeling",
    state: "West Bengal",
    code: "IXB",
    isMetro: false,
    airport: "Bagdogra Airport (IXB - 70 km)",
    railway: "Darjeeling Railway Station (DJ - Heritage Narrow Gauge)",
    bus: "Siliguri / Darjeeling Motor Stand",
    hasCommercialAirport: false,
    hasDirectRailway: false,
    nearestRailHub: {
      city: "New Jalpaiguri",
      station: "New Jalpaiguri Junction (NJP - Broad Gauge Railhead)",
      transferDistanceKm: 72,
      transferDuration: "3h 00m",
      modes: ["DHR Heritage Toy Train", "Prepaid Hill Cart Road Taxi", "Shared Cruiser"],
    },
    nearestAirHub: {
      city: "Bagdogra",
      airport: "Bagdogra International Airport (IXB)",
      transferDistanceKm: 70,
      transferDuration: "2h 45m",
      modes: ["Prepaid Hill Cab", "WBTDC Tourist Coach"],
    },
    coordinates: { lat: 27.0410, lng: 88.2663 },
  },
  Varanasi: {
    name: "Varanasi",
    state: "Uttar Pradesh",
    code: "VNS",
    isMetro: false,
    airport: "Lal Bahadur Shastri International Airport (VNS)",
    railway: "Varanasi Junction (BSB) / Banaras (BSBS)",
    secondaryStations: ["Pt. Deen Dayal Upadhyaya Junction (DDU)"],
    bus: "Chaudhary Charan Singh ISBT",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 25.3176, lng: 82.9739 },
  },
  Srinagar: {
    name: "Srinagar",
    state: "Jammu & Kashmir",
    code: "SXR",
    isMetro: false,
    airport: "Sheikh ul-Alam International Airport (SXR)",
    railway: "Srinagar Railway Station (SINA - Kashmir Valley Line)",
    bus: "TRC Tourist Reception Centre / Batamaloo Stand",
    hasCommercialAirport: true,
    hasDirectRailway: false,
    nearestRailHub: {
      city: "Jammu Tawi",
      station: "Jammu Tawi (JAT) / Udhampur (UHP)",
      transferDistanceKm: 260,
      transferDuration: "6h 30m",
      modes: ["Shared Taxi via NH44", "JKSRTC Deluxe Bus"],
    },
    coordinates: { lat: 34.0837, lng: 74.7973 },
  },
  Rishikesh: {
    name: "Rishikesh",
    state: "Uttarakhand",
    code: "DED",
    isMetro: false,
    airport: "Dehradun Jolly Grant Airport (DED - 21 km)",
    railway: "Yog Nagari Rishikesh (YNRK) / Rishikesh (RKSH)",
    secondaryStations: ["Haridwar Junction (HW - 25 km)"],
    bus: "Rishikesh Sanyukt Yatra Bus Stand",
    hasCommercialAirport: false,
    hasDirectRailway: true,
    coordinates: { lat: 30.0869, lng: 78.2676 },
  },
  Haridwar: {
    name: "Haridwar",
    state: "Uttarakhand",
    code: "HW",
    isMetro: false,
    airport: "Dehradun Jolly Grant Airport (DED - 38 km)",
    railway: "Haridwar Junction (HW)",
    bus: "Haridwar Central Bus Stand",
    hasCommercialAirport: false,
    hasDirectRailway: true,
    coordinates: { lat: 29.9457, lng: 78.1642 },
  },
  Dehradun: {
    name: "Dehradun",
    state: "Uttarakhand",
    code: "DED",
    isMetro: false,
    airport: "Dehradun Jolly Grant Airport (DED)",
    railway: "Dehradun Terminal (DDN)",
    bus: "ISBT Dehradun",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 30.3165, lng: 78.0322 },
  },
  Mussoorie: {
    name: "Mussoorie",
    state: "Uttarakhand",
    code: "DED",
    isMetro: false,
    airport: "Dehradun Jolly Grant Airport (DED - 54 km)",
    railway: "No direct rail",
    bus: "Library Bus Stand / Picture Palace Bus Stand",
    hasCommercialAirport: false,
    hasDirectRailway: false,
    nearestRailHub: {
      city: "Dehradun",
      station: "Dehradun Terminal (DDN)",
      transferDistanceKm: 35,
      transferDuration: "1h 20m",
      modes: ["Hill Taxi", "UTC Roadways Bus"],
    },
    coordinates: { lat: 30.4598, lng: 78.0644 },
  },
  Agra: {
    name: "Agra",
    state: "Uttar Pradesh",
    code: "AGR",
    isMetro: false,
    airport: "Agra Airport / Kheria Air Force Station (AGR)",
    railway: "Agra Cantt (AGC)",
    secondaryStations: ["Agra Fort (AF)"],
    bus: "Idgah Inter-State Bus Stand",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 27.1767, lng: 78.0081 },
  },
  Amritsar: {
    name: "Amritsar",
    state: "Punjab",
    code: "ATQ",
    isMetro: false,
    airport: "Sri Guru Ram Dass Jee International Airport (ATQ)",
    railway: "Amritsar Junction (ASR)",
    bus: "Amritsar ISBT",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 31.6340, lng: 74.8723 },
  },
  Bhubaneswar: {
    name: "Bhubaneswar",
    state: "Odisha",
    code: "BBI",
    isMetro: false,
    airport: "Biju Patnaik International Airport (BBI)",
    railway: "Bhubaneswar Railway Station (BBS)",
    bus: "Baramunda ISBT",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 20.2961, lng: 85.8245 },
  },
  Puri: {
    name: "Puri",
    state: "Odisha",
    code: "PURI",
    isMetro: false,
    airport: "Biju Patnaik International Airport (BBI - 60 km)",
    railway: "Puri Railway Station (PURI)",
    bus: "Puri Central Bus Stand",
    hasCommercialAirport: false,
    hasDirectRailway: true,
    coordinates: { lat: 19.8135, lng: 85.8312 },
  },
  Shillong: {
    name: "Shillong",
    state: "Meghalaya",
    code: "SHL",
    isMetro: false,
    airport: "Umroi Airport (SHL - Limited) / Guwahati (GAU - 120 km)",
    railway: "No direct rail (Hill State)",
    bus: "ISBT Mawiong Shillong",
    hasCommercialAirport: false,
    hasDirectRailway: false,
    nearestRailHub: {
      city: "Guwahati",
      station: "Guwahati Junction (GHY)",
      transferDistanceKm: 100,
      transferDuration: "3h 15m",
      modes: ["Shared Sumo / AC Tourist Taxi", "ASTC Deluxe Bus via GS Road"],
    },
    nearestAirHub: {
      city: "Guwahati",
      airport: "Lokpriya Gopinath Bordoloi International Airport (GAU)",
      transferDistanceKm: 120,
      transferDuration: "3h 45m",
      modes: ["Prepaid Airport Cab", "Meghalaya Helicopter Service"],
    },
    coordinates: { lat: 25.5788, lng: 91.8933 },
  },
  Guwahati: {
    name: "Guwahati",
    state: "Assam",
    code: "GAU",
    isMetro: false,
    airport: "Lokpriya Gopinath Bordoloi International Airport (GAU)",
    railway: "Guwahati Junction (GHY) / Kamakhya (KYQ)",
    bus: "ISBT Betkuchi",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 26.1445, lng: 91.7362 },
  },
  Lucknow: {
    name: "Lucknow",
    state: "Uttar Pradesh",
    code: "LKO",
    isMetro: false,
    airport: "Chaudhary Charan Singh International Airport (LKO)",
    railway: "Lucknow Charbagh (LKO / LJN)",
    bus: "Alambagh Bus Terminal",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 26.8467, lng: 80.9462 },
  },
  Patna: {
    name: "Patna",
    state: "Bihar",
    code: "PAT",
    isMetro: false,
    airport: "Jay Prakash Narayan Airport (PAT)",
    railway: "Patna Junction (PNBE)",
    bus: "Bankipur Bus Stand",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 25.5941, lng: 85.1376 },
  },
  Kochi: {
    name: "Kochi",
    state: "Kerala",
    code: "COK",
    isMetro: false,
    airport: "Cochin International Airport (COK)",
    railway: "Ernakulam Junction (ERS) / Ernakulam Town (ERN)",
    bus: "KSRTC Central Bus Stand Ernakulam",
    hasCommercialAirport: true,
    hasDirectRailway: true,
    coordinates: { lat: 9.9312, lng: 76.2673 },
  },
  Digha: {
    name: "Digha",
    state: "West Bengal",
    code: "DGHA",
    isMetro: false,
    airport: "Netaji Subhash Chandra Bose Int'l (CCU - 190 km)",
    railway: "Digha Railway Station (DGHA)",
    bus: "Digha Old / New Bus Stand",
    hasCommercialAirport: false,
    hasDirectRailway: true,
    coordinates: { lat: 21.6266, lng: 87.5074 },
  },
  Kasol: {
    name: "Kasol",
    state: "Himachal Pradesh",
    code: "KUU",
    isMetro: false,
    airport: "Bhuntar Airport (KUU - 31 km)",
    railway: "No direct rail",
    bus: "Kasol Main Bus Stop",
    hasCommercialAirport: false,
    hasDirectRailway: false,
    nearestRailHub: {
      city: "Chandigarh",
      station: "Chandigarh Junction (CDG)",
      transferDistanceKm: 275,
      transferDuration: "7h 00m",
      modes: ["Volvo Sleeper to Bhuntar + Local Cab to Kasol"],
    },
    coordinates: { lat: 32.0100, lng: 77.3150 },
  },
};

// Aliases and normalizer
function normalizeCityKey(raw = "") {
  const norm = String(raw || "").toLowerCase().trim();
  if (!norm) return "Delhi";
  if (norm === "new delhi" || norm.includes("delhi")) return "Delhi";
  if (norm.includes("mumbai") || norm.includes("bombay")) return "Mumbai";
  if (norm.includes("kolkata") || norm.includes("howrah") || norm.includes("sealdah")) return "Kolkata";
  if (norm.includes("bengaluru") || norm.includes("bangalore")) return "Bengaluru";
  if (norm.includes("chennai") || norm.includes("madras")) return "Chennai";
  if (norm.includes("hyderabad") || norm.includes("secunderabad")) return "Hyderabad";
  if (norm.includes("pune")) return "Pune";
  if (norm.includes("ahmedabad")) return "Ahmedabad";
  if (norm.includes("jaipur")) return "Jaipur";
  if (norm.includes("goa") || norm.includes("madgaon") || norm.includes("panaji")) return "Goa";
  if (norm.includes("shimla")) return "Shimla";
  if (norm.includes("manali")) return "Manali";
  if (norm.includes("kalka")) return "Kalka";
  if (norm.includes("chandigarh")) return "Chandigarh";
  if (norm.includes("darjeeling")) return "Darjeeling";
  if (norm.includes("varanasi") || norm.includes("banaras")) return "Varanasi";
  if (norm.includes("srinagar")) return "Srinagar";
  if (norm.includes("rishikesh")) return "Rishikesh";
  if (norm.includes("haridwar")) return "Haridwar";
  if (norm.includes("dehradun")) return "Dehradun";
  if (norm.includes("mussoorie")) return "Mussoorie";
  if (norm.includes("amritsar")) return "Amritsar";
  if (norm.includes("agra")) return "Agra";
  if (norm.includes("bhubaneswar")) return "Bhubaneswar";
  if (norm.includes("puri")) return "Puri";
  if (norm.includes("shillong")) return "Shillong";
  if (norm.includes("guwahati")) return "Guwahati";
  if (norm.includes("lucknow")) return "Lucknow";
  if (norm.includes("patna")) return "Patna";
  if (norm.includes("kochi") || norm.includes("cochin")) return "Kochi";
  if (norm.includes("digha")) return "Digha";
  if (norm.includes("kasol")) return "Kasol";

  // Fallback match in dictionary
  for (const key of Object.keys(TRANSIT_CITIES)) {
    if (key.toLowerCase() === norm || norm.includes(key.toLowerCase())) {
      return key;
    }
  }
  return raw.trim() || "Delhi";
}

// Great-circle distance calculation
function calculateGreatCircleKm(cityA, cityB) {
  const metaA = TRANSIT_CITIES[normalizeCityKey(cityA)];
  const metaB = TRANSIT_CITIES[normalizeCityKey(cityB)];
  if (!metaA || !metaB) return 800;

  const R = 6371; // Earth radius in km
  const dLat = ((metaB.coordinates.lat - metaA.coordinates.lat) * Math.PI) / 180;
  const dLng = ((metaB.coordinates.lng - metaA.coordinates.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((metaA.coordinates.lat * Math.PI) / 180) *
      Math.cos((metaB.coordinates.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

module.exports = {
  TRANSIT_CITIES,
  normalizeCityKey,
  calculateGreatCircleKm,
};

