/**
 * India-Wide Location Master
 * Authoritative registry of Indian cities, multi-station railway codes,
 * airport IATA codes, and off-rail/off-airport transit hub linkages.
 */

const INDIA_LOCATIONS = {
  Kolkata: {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    aliases: ["kolkata", "calcutta", "howrah", "sealdah", "shalimar", "kolkata terminal", "hwh", "sdah", "shm", "koaa"],
    coordinates: { lat: 22.5726, lng: 88.3639 },
    isMetro: true,
    stations: [
      { code: "HWH", name: "Howrah Junction", isPrimary: true },
      { code: "SDAH", name: "Sealdah Railway Station", isPrimary: true },
      { code: "SHM", name: "Shalimar Railway Station", isPrimary: false },
      { code: "KOAA", name: "Kolkata Railway Station (Chitpur)", isPrimary: false },
    ],
    airports: [
      { code: "CCU", name: "Netaji Subhash Chandra Bose International Airport", isPrimary: true },
    ],
    busTerminals: ["Esplanade Central Bus Station", "Babughat ISBT", "Karunamoyee Bus Station (Salt Lake)"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Puri: {
    id: "puri",
    name: "Puri",
    state: "Odisha",
    aliases: ["puri", "jagannath puri", "puri beach"],
    coordinates: { lat: 19.8135, lng: 85.8312 },
    isMetro: false,
    stations: [
      { code: "PURI", name: "Puri Railway Station", isPrimary: true },
      { code: "KUR", name: "Khurda Road Junction (44 km)", isPrimary: false },
    ],
    airports: [],
    busTerminals: ["Puri Central Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: {
      city: "Bhubaneswar",
      airportCode: "BBI",
      airportName: "Biju Patnaik International Airport, Bhubaneswar",
      distanceKm: 60,
      transferDuration: "1h 30m",
      modes: ["OSRTC AC Bus", "Prepaid Taxi", "Local Train from Puri to BBS"],
    },
  },

  Delhi: {
    id: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    aliases: ["delhi", "new delhi", "ndls", "dli", "nzm", "anvt", "dee"],
    coordinates: { lat: 28.6139, lng: 77.2090 },
    isMetro: true,
    stations: [
      { code: "NDLS", name: "New Delhi Railway Station", isPrimary: true },
      { code: "DLI", name: "Old Delhi Railway Station", isPrimary: true },
      { code: "NZM", name: "Hazrat Nizamuddin Railway Station", isPrimary: true },
      { code: "ANVT", name: "Anand Vihar Terminal", isPrimary: true },
      { code: "DEE", name: "Delhi Sarai Rohilla", isPrimary: false },
    ],
    airports: [
      { code: "DEL", name: "Indira Gandhi International Airport", isPrimary: true },
    ],
    busTerminals: ["Maharana Pratap ISBT (Kashmere Gate)", "Sarai Kale Khan ISBT", "Anand Vihar ISBT"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Mumbai: {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    aliases: ["mumbai", "bombay", "csmt", "mmct", "bdts", "ltt", "dr"],
    coordinates: { lat: 19.0760, lng: 72.8777 },
    isMetro: true,
    stations: [
      { code: "CSMT", name: "Chhatrapati Shivaji Maharaj Terminus", isPrimary: true },
      { code: "MMCT", name: "Mumbai Central Railway Station", isPrimary: true },
      { code: "BDTS", name: "Bandra Terminus", isPrimary: true },
      { code: "LTT", name: "Lokmanya Tilak Terminus (Kurla)", isPrimary: true },
      { code: "DR", name: "Dadar Railway Station", isPrimary: false },
    ],
    airports: [
      { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", isPrimary: true },
    ],
    busTerminals: ["Borivali Bus Station", "Dadar Asiad Bus Stand", "Mumbai Central ST Bus Depot"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Bengaluru: {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    aliases: ["bengaluru", "bangalore", "sbc", "ypr", "smvb", "bnc"],
    coordinates: { lat: 12.9716, lng: 77.5946 },
    isMetro: true,
    stations: [
      { code: "SBC", name: "KSR Bengaluru City Junction (Majestic)", isPrimary: true },
      { code: "YPR", name: "Yesvantpur Junction", isPrimary: true },
      { code: "SMVB", name: "Sir M. Visvesvaraya Terminal (Baiyappanahalli)", isPrimary: true },
      { code: "BNC", name: "Bengaluru Cantt", isPrimary: false },
    ],
    airports: [
      { code: "BLR", name: "Kempegowda International Airport", isPrimary: true },
    ],
    busTerminals: ["Kempegowda Bus Station (Majestic)", "Shantinagar Bus Station", "Satellite Bus Stand (Mysore Road)"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Chennai: {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    aliases: ["chennai", "madras", "mas", "ms", "tbm"],
    coordinates: { lat: 13.0827, lng: 80.2707 },
    isMetro: true,
    stations: [
      { code: "MAS", name: "Puratchi Thalaivar Dr. M.G.R. Central (Chennai Central)", isPrimary: true },
      { code: "MS", name: "Chennai Egmore", isPrimary: true },
      { code: "TBM", name: "Tambaram", isPrimary: false },
    ],
    airports: [
      { code: "MAA", name: "Chennai International Airport", isPrimary: true },
    ],
    busTerminals: ["Chennai Mofussil Bus Terminus (CMBT Koyambedu)", "Kilambakkam Bus Terminus (KCBT)"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  NewJalpaiguri: {
    id: "new_jalpaiguri",
    name: "New Jalpaiguri / Siliguri",
    state: "West Bengal",
    aliases: ["new jalpaiguri", "njp", "siliguri", "sguj", "bagdogra", "ixb"],
    coordinates: { lat: 26.6853, lng: 88.4418 },
    isMetro: false,
    stations: [
      { code: "NJP", name: "New Jalpaiguri Junction", isPrimary: true },
      { code: "SGUJ", name: "Siliguri Junction", isPrimary: true },
    ],
    airports: [
      { code: "IXB", name: "Bagdogra International Airport", isPrimary: true },
    ],
    busTerminals: ["Tenzing Norgay Central Bus Terminus Siliguri"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Darjeeling: {
    id: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    aliases: ["darjeeling", "dj"],
    coordinates: { lat: 27.0410, lng: 88.2663 },
    isMetro: false,
    stations: [
      { code: "DJ", name: "Darjeeling Heritage Railway Station (Narrow Gauge)", isPrimary: false },
    ],
    airports: [],
    busTerminals: ["Siliguri / Darjeeling Motor Stand", "Chowk Bazaar Bus Stand"],
    nearestRailHub: {
      city: "New Jalpaiguri",
      stationCode: "NJP",
      stationName: "New Jalpaiguri Junction (NJP - Broad Gauge Railhead)",
      distanceKm: 72,
      transferDuration: "3h 00m",
      modes: ["DHR Heritage Toy Train", "Prepaid Hill Cart Road Taxi", "Shared Cruiser"],
    },
    nearestAirHub: {
      city: "Bagdogra",
      airportCode: "IXB",
      airportName: "Bagdogra International Airport (IXB)",
      distanceKm: 70,
      transferDuration: "2h 45m",
      modes: ["Prepaid Hill Cab", "WBTDC Tourist Coach"],
    },
  },

  Shimla: {
    id: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    aliases: ["shimla", "simla", "sml"],
    coordinates: { lat: 31.1048, lng: 77.1734 },
    isMetro: false,
    stations: [
      { code: "SML", name: "Shimla Heritage Station (Narrow Gauge)", isPrimary: false },
    ],
    airports: [
      { code: "SLV", name: "Shimla Jubbarhatti Airport (Limited Regional)", isPrimary: false },
    ],
    busTerminals: ["ISBT Tutikandi Shimla"],
    nearestRailHub: {
      city: "Kalka",
      stationCode: "KLK",
      stationName: "Kalka Railway Station (KLK - Broad Gauge Railhead)",
      distanceKm: 90,
      transferDuration: "3h 15m",
      modes: ["Kalka-Shimla Toy Train", "Himalayan Expressway AC Taxi", "HRTC Volvo Bus"],
    },
    nearestAirHub: {
      city: "Chandigarh",
      airportCode: "IXC",
      airportName: "Shaheed Bhagat Singh International Airport, Chandigarh",
      distanceKm: 115,
      transferDuration: "3h 30m",
      modes: ["Prepaid AC Taxi", "HRTC Himgaurav Volvo"],
    },
  },

  Kalka: {
    id: "kalka",
    name: "Kalka",
    state: "Haryana",
    aliases: ["kalka", "klk"],
    coordinates: { lat: 30.8389, lng: 76.9351 },
    isMetro: false,
    stations: [
      { code: "KLK", name: "Kalka Railway Station", isPrimary: true },
    ],
    airports: [],
    busTerminals: ["Kalka Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: {
      city: "Chandigarh",
      airportCode: "IXC",
      airportName: "Chandigarh International Airport (28 km)",
      distanceKm: 28,
      transferDuration: "45m",
      modes: ["Taxi", "Local Bus"],
    },
  },

  Chandigarh: {
    id: "chandigarh",
    name: "Chandigarh",
    state: "Chandigarh",
    aliases: ["chandigarh", "cdg", "ixc"],
    coordinates: { lat: 30.7333, lng: 76.7794 },
    isMetro: false,
    stations: [
      { code: "CDG", name: "Chandigarh Junction", isPrimary: true },
    ],
    airports: [
      { code: "IXC", name: "Shaheed Bhagat Singh International Airport", isPrimary: true },
    ],
    busTerminals: ["ISBT Sector 43", "ISBT Sector 17"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Manali: {
    id: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    aliases: ["manali", "kullu manali"],
    coordinates: { lat: 32.2396, lng: 77.1887 },
    isMetro: false,
    stations: [],
    airports: [
      { code: "KUU", name: "Kullu-Bhuntar Airport (50 km - Regional)", isPrimary: false },
    ],
    busTerminals: ["HRTC Bus Stand Manali", "Private Volvo Stand Manali"],
    nearestRailHub: {
      city: "Chandigarh",
      stationCode: "CDG",
      stationName: "Chandigarh Junction (CDG)",
      distanceKm: 310,
      transferDuration: "7h 30m",
      modes: ["HRTC Himsuta Volvo AC Sleeper", "Private Luxury Tourist Bus", "Intercity Cab"],
    },
    nearestAirHub: {
      city: "Chandigarh",
      airportCode: "IXC",
      airportName: "Shaheed Bhagat Singh International Airport (IXC)",
      distanceKm: 310,
      transferDuration: "7h 30m",
      modes: ["Overnight Volvo Sleeper", "Private Tourist Cab"],
    },
  },

  Goa: {
    id: "goa",
    name: "Goa",
    state: "Goa",
    aliases: ["goa", "madgaon", "panaji", "vasco", "mopa", "thivim", "karmali", "mao", "goi", "gox"],
    coordinates: { lat: 15.2993, lng: 74.1240 },
    isMetro: false,
    stations: [
      { code: "MAO", name: "Madgaon Junction", isPrimary: true },
      { code: "THVM", name: "Thivim Railway Station (North Goa)", isPrimary: true },
      { code: "KRMI", name: "Karmali Railway Station (Near Old Goa)", isPrimary: false },
      { code: "VSG", name: "Vasco da Gama", isPrimary: false },
    ],
    airports: [
      { code: "GOI", name: "Dabolim International Airport (South Goa)", isPrimary: true },
      { code: "GOX", name: "Manohar International Airport (MOPA - North Goa)", isPrimary: true },
    ],
    busTerminals: ["Kadam Transport Bus Stand (Panaji)", "Margao KSRTC Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Varanasi: {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    aliases: ["varanasi", "banaras", "kashi", "bsb", "bsbs", "ddu"],
    coordinates: { lat: 25.3176, lng: 82.9739 },
    isMetro: false,
    stations: [
      { code: "BSB", name: "Varanasi Junction (Cantonment)", isPrimary: true },
      { code: "BSBS", name: "Banaras Railway Station (Manduadih)", isPrimary: true },
      { code: "DDU", name: "Pt. Deen Dayal Upadhyaya Junction (16 km)", isPrimary: true },
    ],
    airports: [
      { code: "VNS", name: "Lal Bahadur Shastri International Airport", isPrimary: true },
    ],
    busTerminals: ["Chaudhary Charan Singh ISBT Varanasi"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Bhubaneswar: {
    id: "bhubaneswar",
    name: "Bhubaneswar",
    state: "Odisha",
    aliases: ["bhubaneswar", "bbs", "bbi"],
    coordinates: { lat: 20.2961, lng: 85.8245 },
    isMetro: false,
    stations: [
      { code: "BBS", name: "Bhubaneswar Railway Station", isPrimary: true },
    ],
    airports: [
      { code: "BBI", name: "Biju Patnaik International Airport", isPrimary: true },
    ],
    busTerminals: ["Baramunda ISBT Bhubaneswar"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Jaipur: {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    aliases: ["jaipur", "jp", "jai"],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    isMetro: false,
    stations: [
      { code: "JP", name: "Jaipur Junction", isPrimary: true },
      { code: "GADJ", name: "Gandhinagar Jaipur", isPrimary: false },
    ],
    airports: [
      { code: "JAI", name: "Jaipur International Airport", isPrimary: true },
    ],
    busTerminals: ["Sindhi Camp Central Bus Terminal"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Hyderabad: {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    aliases: ["hyderabad", "secunderabad", "sc", "hyd", "kcg"],
    coordinates: { lat: 17.3850, lng: 78.4867 },
    isMetro: true,
    stations: [
      { code: "SC", name: "Secunderabad Junction", isPrimary: true },
      { code: "HYB", name: "Hyderabad Deccan Nampally", isPrimary: true },
      { code: "KCG", name: "Kacheguda", isPrimary: false },
    ],
    airports: [
      { code: "HYD", name: "Rajiv Gandhi International Airport", isPrimary: true },
    ],
    busTerminals: ["Mahatma Gandhi Bus Station (MGBS)", "Jubilee Bus Station (JBS)"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Pune: {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    aliases: ["pune", "poona", "pune junction", "pnq"],
    coordinates: { lat: 18.5204, lng: 73.8567 },
    isMetro: false,
    stations: [
      { code: "PUNE", name: "Pune Junction", isPrimary: true },
      { code: "SVJR", name: "Shivajinagar", isPrimary: false },
    ],
    airports: [
      { code: "PNQ", name: "Pune International Airport", isPrimary: true },
    ],
    busTerminals: ["Swargate Bus Stand", "Shivajinagar ST Stand"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Ahmedabad: {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    aliases: ["ahmedabad", "amdavad", "adi", "amd"],
    coordinates: { lat: 23.0225, lng: 72.5714 },
    isMetro: false,
    stations: [
      { code: "ADI", name: "Ahmedabad Junction (Kalupur)", isPrimary: true },
      { code: "SBIB", name: "Sabarmati Junction", isPrimary: false },
    ],
    airports: [
      { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", isPrimary: true },
    ],
    busTerminals: ["Geeta Mandir Central Bus Station"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Lucknow: {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    aliases: ["lucknow", "lko", "ljn"],
    coordinates: { lat: 26.8467, lng: 80.9462 },
    isMetro: false,
    stations: [
      { code: "LKO", name: "Lucknow Charbagh NR", isPrimary: true },
      { code: "LJN", name: "Lucknow Junction NER", isPrimary: true },
    ],
    airports: [
      { code: "LKO", name: "Chaudhary Charan Singh International Airport", isPrimary: true },
    ],
    busTerminals: ["Alambagh Bus Terminal", "Kaiserbagh Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Guwahati: {
    id: "guwahati",
    name: "Guwahati",
    state: "Assam",
    aliases: ["guwahati", "gauhati", "ghy", "gau", "kyq"],
    coordinates: { lat: 26.1445, lng: 91.7362 },
    isMetro: false,
    stations: [
      { code: "GHY", name: "Guwahati Junction", isPrimary: true },
      { code: "KYQ", name: "Kamakhya Junction", isPrimary: true },
    ],
    airports: [
      { code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", isPrimary: true },
    ],
    busTerminals: ["ISBT Betkuchi Guwahati"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Shillong: {
    id: "shillong",
    name: "Shillong",
    state: "Meghalaya",
    aliases: ["shillong", "shl"],
    coordinates: { lat: 25.5788, lng: 91.8933 },
    isMetro: false,
    stations: [],
    airports: [
      { code: "SHL", name: "Umroi Airport Shillong (Limited Regional)", isPrimary: false },
    ],
    busTerminals: ["ISBT Mawiong Shillong"],
    nearestRailHub: {
      city: "Guwahati",
      stationCode: "GHY",
      stationName: "Guwahati Junction (GHY)",
      distanceKm: 100,
      transferDuration: "3h 15m",
      modes: ["Shared Sumo / AC Tourist Taxi", "ASTC Deluxe Bus via GS Road"],
    },
    nearestAirHub: {
      city: "Guwahati",
      airportCode: "GAU",
      airportName: "Lokpriya Gopinath Bordoloi International Airport (GAU)",
      distanceKm: 120,
      transferDuration: "3h 45m",
      modes: ["Prepaid Airport Cab", "Meghalaya Helicopter Service"],
    },
  },

  Agra: {
    id: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    aliases: ["agra", "agc", "af", "agr"],
    coordinates: { lat: 27.1767, lng: 78.0081 },
    isMetro: false,
    stations: [
      { code: "AGC", name: "Agra Cantt", isPrimary: true },
      { code: "AF", name: "Agra Fort", isPrimary: false },
    ],
    airports: [
      { code: "AGR", name: "Agra Airport (Kheria Air Force Station)", isPrimary: false },
    ],
    busTerminals: ["Idgah Inter-State Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: {
      city: "Delhi",
      airportCode: "DEL",
      airportName: "Indira Gandhi International Airport, Delhi",
      distanceKm: 210,
      transferDuration: "3h 00m",
      modes: ["Yamuna Expressway AC Taxi", "Gatimaan / Vande Bharat Express"],
    },
  },

  Amritsar: {
    id: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    aliases: ["amritsar", "asr", "atq"],
    coordinates: { lat: 31.6340, lng: 74.8723 },
    isMetro: false,
    stations: [
      { code: "ASR", name: "Amritsar Junction", isPrimary: true },
    ],
    airports: [
      { code: "ATQ", name: "Sri Guru Ram Dass Jee International Airport", isPrimary: true },
    ],
    busTerminals: ["Amritsar ISBT"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Srinagar: {
    id: "srinagar",
    name: "Srinagar",
    state: "Jammu & Kashmir",
    aliases: ["srinagar", "kashmir", "sxr"],
    coordinates: { lat: 34.0837, lng: 74.7973 },
    isMetro: false,
    stations: [
      { code: "SINA", name: "Srinagar Railway Station (Kashmir Valley Section)", isPrimary: false },
    ],
    airports: [
      { code: "SXR", name: "Sheikh ul-Alam International Airport", isPrimary: true },
    ],
    busTerminals: ["TRC Tourist Reception Centre Srinagar", "Batamaloo Stand"],
    nearestRailHub: {
      city: "Jammu Tawi",
      stationCode: "JAT",
      stationName: "Jammu Tawi Railway Station (JAT) / Udhampur (UHP)",
      distanceKm: 260,
      transferDuration: "6h 30m",
      modes: ["Shared Taxi via NH44", "JKSRTC Deluxe Bus"],
    },
    nearestAirHub: null,
  },

  Rishikesh: {
    id: "rishikesh",
    name: "Rishikesh",
    state: "Uttarakhand",
    aliases: ["rishikesh", "ynrk", "rksh"],
    coordinates: { lat: 30.0869, lng: 78.2676 },
    isMetro: false,
    stations: [
      { code: "YNRK", name: "Yog Nagari Rishikesh", isPrimary: true },
      { code: "RKSH", name: "Rishikesh Railway Station", isPrimary: false },
    ],
    airports: [],
    busTerminals: ["Rishikesh Sanyukt Yatra Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: {
      city: "Dehradun",
      airportCode: "DED",
      airportName: "Dehradun Jolly Grant Airport (21 km)",
      distanceKm: 21,
      transferDuration: "35m",
      modes: ["Airport Taxi"],
    },
  },

  Haridwar: {
    id: "haridwar",
    name: "Haridwar",
    state: "Uttarakhand",
    aliases: ["haridwar", "hw"],
    coordinates: { lat: 29.9457, lng: 78.1642 },
    isMetro: false,
    stations: [
      { code: "HW", name: "Haridwar Junction", isPrimary: true },
    ],
    airports: [],
    busTerminals: ["Haridwar Central Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: {
      city: "Dehradun",
      airportCode: "DED",
      airportName: "Dehradun Jolly Grant Airport (38 km)",
      distanceKm: 38,
      transferDuration: "50m",
      modes: ["Taxi", "Bus"],
    },
  },

  Dehradun: {
    id: "dehradun",
    name: "Dehradun",
    state: "Uttarakhand",
    aliases: ["dehradun", "ddn", "ded"],
    coordinates: { lat: 30.3165, lng: 78.0322 },
    isMetro: false,
    stations: [
      { code: "DDN", name: "Dehradun Terminal", isPrimary: true },
    ],
    airports: [
      { code: "DED", name: "Dehradun Jolly Grant Airport", isPrimary: true },
    ],
    busTerminals: ["ISBT Dehradun"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Mussoorie: {
    id: "mussoorie",
    name: "Mussoorie",
    state: "Uttarakhand",
    aliases: ["mussoorie"],
    coordinates: { lat: 30.4598, lng: 78.0644 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Library Bus Stand Mussoorie"],
    nearestRailHub: {
      city: "Dehradun",
      stationCode: "DDN",
      stationName: "Dehradun Terminal (DDN)",
      distanceKm: 35,
      transferDuration: "1h 20m",
      modes: ["Hill Taxi", "UTC Roadways Bus"],
    },
    nearestAirHub: {
      city: "Dehradun",
      airportCode: "DED",
      airportName: "Dehradun Jolly Grant Airport (54 km)",
      distanceKm: 54,
      transferDuration: "1h 50m",
      modes: ["Prepaid Hill Taxi"],
    },
  },

  Kasol: {
    id: "kasol",
    name: "Kasol",
    state: "Himachal Pradesh",
    aliases: ["kasol", "parvati valley"],
    coordinates: { lat: 32.0100, lng: 77.3150 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Kasol Main Bus Stop"],
    nearestRailHub: {
      city: "Chandigarh",
      stationCode: "CDG",
      stationName: "Chandigarh Junction (CDG)",
      distanceKm: 275,
      transferDuration: "7h 00m",
      modes: ["Volvo Sleeper to Bhuntar + Local Cab to Kasol"],
    },
    nearestAirHub: {
      city: "Kullu",
      airportCode: "KUU",
      airportName: "Bhuntar Airport (31 km)",
      distanceKm: 31,
      transferDuration: "1h 10m",
      modes: ["Local Taxi"],
    },
  },

  Digha: {
    id: "digha",
    name: "Digha",
    state: "West Bengal",
    aliases: ["digha", "dgha"],
    coordinates: { lat: 21.6266, lng: 87.5074 },
    isMetro: false,
    stations: [
      { code: "DGHA", name: "Digha Railway Station", isPrimary: true },
    ],
    airports: [],
    busTerminals: ["Digha Central Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: {
      city: "Kolkata",
      airportCode: "CCU",
      airportName: "Netaji Subhash Chandra Bose Int'l Airport (CCU - 190 km)",
      distanceKm: 190,
      transferDuration: "4h 00m",
      modes: ["Express Train", "SBSTC AC Bus"],
    },
  },

  Kochi: {
    id: "kochi",
    name: "Kochi",
    state: "Kerala",
    aliases: ["kochi", "cochin", "ernakulam", "ers", "ern", "cok"],
    coordinates: { lat: 9.9312, lng: 76.2673 },
    isMetro: false,
    stations: [
      { code: "ERS", name: "Ernakulam Junction (South)", isPrimary: true },
      { code: "ERN", name: "Ernakulam Town (North)", isPrimary: true },
    ],
    airports: [
      { code: "COK", name: "Cochin International Airport (Nedumbassery)", isPrimary: true },
    ],
    busTerminals: ["KSRTC Central Bus Station Ernakulam"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Patna: {
    id: "patna",
    name: "Patna",
    state: "Bihar",
    aliases: ["patna", "pnbe", "pat"],
    coordinates: { lat: 25.5941, lng: 85.1376 },
    isMetro: false,
    stations: [
      { code: "PNBE", name: "Patna Junction", isPrimary: true },
      { code: "DNR", name: "Danapur", isPrimary: false },
    ],
    airports: [
      { code: "PAT", name: "Jay Prakash Narayan Airport", isPrimary: true },
    ],
    busTerminals: ["Bankipur Bus Stand", "Patliputra ISBT"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Leh_Ladakh: {
    id: "leh_ladakh",
    name: "Leh Ladakh",
    state: "Ladakh",
    aliases: ["leh ladakh", "leh", "ladakh", "ixl", "pangong", "nubra"],
    coordinates: { lat: 34.1526, lng: 77.5771 },
    isMetro: false,
    stations: [],
    airports: [
      { code: "IXL", name: "Kushok Bakula Rimpochee Airport (Leh)", isPrimary: true },
    ],
    busTerminals: ["Leh New Bus Stand", "JKSRTC Main Bus Station"],
    nearestRailHub: {
      city: "Jammu / Chandigarh",
      stationCode: "JAT",
      stationName: "Jammu Tawi / Chandigarh Railhead",
      distanceKm: 680,
      transferDuration: "14h",
      modes: ["Himalayan Shared Taxi / Cab", "HRTC / JKSRTC Deluxe Mountain Bus"],
    },
    nearestAirHub: null,
  },

  Vizag: {
    id: "vizag",
    name: "Vizag",
    state: "Andhra Pradesh",
    aliases: ["vizag", "visakhapatnam", "vskp", "vtz", "waltair"],
    coordinates: { lat: 17.6868, lng: 83.2185 },
    isMetro: true,
    stations: [
      { code: "VSKP", name: "Visakhapatnam Junction", isPrimary: true },
      { code: "DVD", name: "Duvvada Railway Station", isPrimary: false },
    ],
    airports: [
      { code: "VTZ", name: "Visakhapatnam International Airport", isPrimary: true },
    ],
    busTerminals: ["Dwaraka RTC Bus Station (Complex)", "Maddilapalem Bus Station"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Kerala: {
    id: "kerala",
    name: "Kerala",
    state: "Kerala",
    aliases: ["kerala", "munnar", "alleppey", "ernakulam", "alappuzha", "wayanad"],
    coordinates: { lat: 9.9312, lng: 76.2673 },
    isMetro: true,
    stations: [
      { code: "ERS", name: "Ernakulam Junction (South)", isPrimary: true },
      { code: "ERN", name: "Ernakulam Town (North)", isPrimary: true },
      { code: "ALLP", name: "Alappuzha Railway Station", isPrimary: false },
    ],
    airports: [
      { code: "COK", name: "Cochin International Airport (CIAL)", isPrimary: true },
    ],
    busTerminals: ["KSRTC Central Bus Station Ernakulam", "KSRTC Vyttila Mobility Hub"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Gujarat: {
    id: "gujarat",
    name: "Gujarat",
    state: "Gujarat",
    aliases: ["gujarat", "kutch", "rann of kutch", "bhuj", "gandhinagar", "vadodara"],
    coordinates: { lat: 23.0225, lng: 72.5714 },
    isMetro: true,
    stations: [
      { code: "ADI", name: "Ahmedabad Junction (Kalupur)", isPrimary: true },
      { code: "BRC", name: "Vadodara Junction", isPrimary: false },
      { code: "BHUJ", name: "Bhuj Railway Station (Kutch)", isPrimary: false },
    ],
    airports: [
      { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", isPrimary: true },
      { code: "BHJ", name: "Bhuj Airport (Kutch)", isPrimary: false },
    ],
    busTerminals: ["Gita Mandir Central Bus Station (GSRTC)", "Ranip Bus Terminal"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Punjab: {
    id: "punjab",
    name: "Punjab",
    state: "Punjab",
    aliases: ["punjab", "ludhiana", "jalandhar", "amritsar cantt", "attari"],
    coordinates: { lat: 31.6340, lng: 74.8723 },
    isMetro: true,
    stations: [
      { code: "ASR", name: "Amritsar Junction", isPrimary: true },
      { code: "LDH", name: "Ludhiana Junction", isPrimary: false },
    ],
    airports: [
      { code: "ATQ", name: "Sri Guru Ram Dass Jee International Airport (Amritsar)", isPrimary: true },
    ],
    busTerminals: ["Amritsar Central ISBT", "Jalandhar Shaheed-e-Azam Bhagat Singh ISBT"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Jaisalmer: {
    id: "jaisalmer",
    name: "Jaisalmer",
    state: "Rajasthan",
    aliases: ["jaisalmer", "jsm", "golden city", "sam sand dunes", "thar desert"],
    coordinates: { lat: 26.9157, lng: 70.9083 },
    isMetro: false,
    stations: [
      { code: "JSM", name: "Jaisalmer Railway Station", isPrimary: true },
    ],
    airports: [
      { code: "JSA", name: "Jaisalmer Airport", isPrimary: true },
    ],
    busTerminals: ["Jaisalmer Central Bus Stand", "Air Force Circle Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Ajmer: {
    id: "ajmer",
    name: "Ajmer",
    state: "Rajasthan",
    aliases: ["ajmer", "aii", "pushkar", "dargah sharif", "ajmer sharif"],
    coordinates: { lat: 26.4499, lng: 74.6399 },
    isMetro: false,
    stations: [
      { code: "AII", name: "Ajmer Junction", isPrimary: true },
    ],
    airports: [
      { code: "KQH", name: "Kishangarh Airport (Ajmer)", isPrimary: true },
    ],
    busTerminals: ["Ajmer Central Bus Stand", "Pushkar Road Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Udaipur: {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    aliases: ["udaipur", "udz", "city of lakes", "lake pichola", "udaipur city"],
    coordinates: { lat: 24.5854, lng: 73.7125 },
    isMetro: false,
    stations: [
      { code: "UDZ", name: "Udaipur City Railway Station", isPrimary: true },
      { code: "RPZ", name: "Ranapratapnagar Railway Station", isPrimary: false },
    ],
    airports: [
      { code: "UDR", name: "Maharana Pratap Airport (Udaipur)", isPrimary: true },
    ],
    busTerminals: ["Udaipur Central Bus Stand (Udiapole)", "Paras Circle Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Ooty: {
    id: "ooty",
    name: "Ooty",
    state: "Tamil Nadu",
    aliases: ["ooty", "udhagamandalam", "uam", "nilgiris", "coonoor"],
    coordinates: { lat: 11.4102, lng: 76.6950 },
    isMetro: false,
    stations: [
      { code: "UAM", name: "Udagamandalam Railway Station (Ooty)", isPrimary: true },
    ],
    airports: [],
    busTerminals: ["Ooty Central Bus Stand", "ATC Bus Stand Ooty"],
    nearestRailHub: {
      city: "Coimbatore",
      stationCode: "CBE",
      stationName: "Coimbatore Junction",
      distanceKm: 86,
      transferDuration: "2h 30m",
      modes: ["Express Mountain Coach", "TNSTC Volvo Bus", "Prepaid Hill Taxi", "Mettupalayam UNESCO Toy Train"],
    },
    nearestAirHub: {
      city: "Coimbatore",
      airportCode: "CJB",
      airportName: "Coimbatore International Airport",
      distanceKm: 88,
      transferDuration: "2h 45m",
      modes: ["Airport Taxi to Ooty", "Direct Intercity Coach"],
    },
  },

  Coimbatore: {
    id: "coimbatore",
    name: "Coimbatore",
    state: "Tamil Nadu",
    aliases: ["coimbatore", "cbe", "cjb", "kovai", "mettupalayam", "mtp"],
    coordinates: { lat: 11.0168, lng: 76.9558 },
    isMetro: false,
    stations: [
      { code: "CBE", name: "Coimbatore Junction", isPrimary: true },
      { code: "MTP", name: "Mettupalayam Railway Station", isPrimary: false },
    ],
    airports: [
      { code: "CJB", name: "Coimbatore International Airport", isPrimary: true },
    ],
    busTerminals: ["Gandhipuram Central Bus Stand", "Omni Bus Stand Coimbatore", "Singanallur Bus Stand"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Pondicherry: {
    id: "pondicherry",
    name: "Pondicherry",
    state: "Puducherry",
    aliases: ["pondicherry", "puducherry", "pdy", "auroville", "french quarter"],
    coordinates: { lat: 11.9416, lng: 79.8083 },
    isMetro: false,
    stations: [
      { code: "PDY", name: "Puducherry Railway Station", isPrimary: true },
    ],
    airports: [
      { code: "PNY", name: "Puducherry Airport", isPrimary: true },
    ],
    busTerminals: ["Puducherry New Bus Stand (Maraimalai Adigal)", "PRTC Bus Depot"],
    nearestRailHub: null,
    nearestAirHub: null,
  },

  Hampi: {
    id: "hampi",
    name: "Hampi",
    state: "Karnataka",
    aliases: ["hampi", "hpt", "hosapete", "hospet", "vijayanagara"],
    coordinates: { lat: 15.3350, lng: 76.4600 },
    isMetro: false,
    stations: [
      { code: "HPT", name: "Hosapete Junction (Hampi Railhead)", isPrimary: true },
    ],
    airports: [
      { code: "VDY", name: "Jindal Vijayanagar Airport (Toranagallu)", isPrimary: true },
    ],
    busTerminals: ["Hampi Bazaar Bus Stand", "Hosapete Central KSRTC Bus Station"],
    nearestRailHub: {
      city: "Hosapete",
      stationCode: "HPT",
      stationName: "Hosapete Junction",
      distanceKm: 12,
      transferDuration: "20m",
      modes: ["KSRTC Local Shuttle", "Prepaid Auto/Taxi to Hampi Bazaar"],
    },
    nearestAirHub: {
      city: "Hubli",
      airportCode: "HBX",
      airportName: "Hubli Airport",
      distanceKm: 160,
      transferDuration: "3h 15m",
      modes: ["KSRTC Express Bus", "Highway Taxi"],
    },
  },

  Konark: {
    id: "konark",
    name: "Konark",
    state: "Odisha",
    aliases: ["konark", "sun temple konark", "chandrabhaga"],
    coordinates: { lat: 19.8876, lng: 86.0945 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Konark Central Bus Stand"],
    nearestRailHub: {
      city: "Puri",
      stationCode: "PURI",
      stationName: "Puri Railway Station",
      distanceKm: 35,
      transferDuration: "45m",
      modes: ["OSRTC Coastal Bus", "Marine Drive Tourist Taxi", "Auto Rickshaw"],
    },
    nearestAirHub: {
      city: "Bhubaneswar",
      airportCode: "BBI",
      airportName: "Biju Patnaik International Airport (Bhubaneswar)",
      distanceKm: 65,
      transferDuration: "1h 30m",
      modes: ["Prepaid Airport Taxi", "Highway Coach"],
    },
  },

  Gulmarg: {
    id: "gulmarg",
    name: "Gulmarg",
    state: "Jammu & Kashmir",
    aliases: ["gulmarg", "gulmarg gondola", "meadow of flowers"],
    coordinates: { lat: 34.0484, lng: 74.3805 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Gulmarg Bus Stand", "Tangmarg Bus Stand"],
    nearestRailHub: {
      city: "Jammu",
      stationCode: "JAT",
      stationName: "Jammu Tawi Railway Station",
      distanceKm: 310,
      transferDuration: "7h 00m",
      modes: ["JKSRTC Mountain Coach", "Prepaid 4x4 Snow Taxi from Tangmarg", "Vande Bharat to Katra + Onward Cab"],
    },
    nearestAirHub: {
      city: "Srinagar",
      airportCode: "SXR",
      airportName: "Sheikh ul-Alam International Airport (Srinagar)",
      distanceKm: 56,
      transferDuration: "1h 45m",
      modes: ["Prepaid Tourist Taxi", "JKSRTC Deluxe Coach"],
    },
  },

  Pahalgam: {
    id: "pahalgam",
    name: "Pahalgam",
    state: "Jammu & Kashmir",
    aliases: ["pahalgam", "betaab valley", "baisaran", "aru valley", "lidder river"],
    coordinates: { lat: 34.0161, lng: 75.3150 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Pahalgam Central Bus Stand"],
    nearestRailHub: {
      city: "Jammu",
      stationCode: "JAT",
      stationName: "Jammu Tawi Railway Station",
      distanceKm: 260,
      transferDuration: "6h 15m",
      modes: ["JKSRTC Mountain Coach", "Highway Tourist Cab"],
    },
    nearestAirHub: {
      city: "Srinagar",
      airportCode: "SXR",
      airportName: "Sheikh ul-Alam International Airport (Srinagar)",
      distanceKm: 90,
      transferDuration: "2h 30m",
      modes: ["Prepaid Airport Cab", "JKSRTC Luxury Coach"],
    },
  },

  Mawlynnong: {
    id: "mawlynnong",
    name: "Mawlynnong Village",
    state: "Meghalaya",
    aliases: ["mawlynnong", "mawlynnong village", "cleanest village", "living root bridge"],
    coordinates: { lat: 25.2016, lng: 91.9042 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Mawlynnong Village Parking Stand"],
    nearestRailHub: {
      city: "Guwahati",
      stationCode: "GHY",
      stationName: "Guwahati Railway Station",
      distanceKm: 170,
      transferDuration: "4h 45m",
      modes: ["Guwahati to Shillong Shared Sumo + Connecting Cab to Mawlynnong"],
    },
    nearestAirHub: {
      city: "Guwahati",
      airportCode: "GAU",
      airportName: "Lokpriya Gopinath Bordoloi International Airport (Guwahati)",
      distanceKm: 185,
      transferDuration: "5h 00m",
      modes: ["Prepaid Airport Taxi", "Helicopter Service to Shillong + Hill Cab"],
    },
  },

  Dawki: {
    id: "dawki",
    name: "Dawki",
    state: "Meghalaya",
    aliases: ["dawki", "umngot river", "dawki boating", "shnongpdeng", "jaflong border"],
    coordinates: { lat: 25.1833, lng: 92.0167 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Dawki Border Bus Stand"],
    nearestRailHub: {
      city: "Guwahati",
      stationCode: "GHY",
      stationName: "Guwahati Railway Station",
      distanceKm: 175,
      transferDuration: "5h 00m",
      modes: ["Guwahati Railway Taxi to Dawki via Pynursla"],
    },
    nearestAirHub: {
      city: "Guwahati",
      airportCode: "GAU",
      airportName: "Lokpriya Gopinath Bordoloi International Airport (Guwahati)",
      distanceKm: 190,
      transferDuration: "5h 15m",
      modes: ["Prepaid Airport Cab to Dawki Riverfront"],
    },
  },

  Rohtang_Pass: {
    id: "rohtang_pass",
    name: "Rohtang Pass",
    state: "Himachal Pradesh",
    aliases: ["rohtang pass", "rohtang", "atal tunnel pass", "snow point rohtang"],
    coordinates: { lat: 32.3716, lng: 77.2466 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Manali Bus Stand (Departure point for Rohtang EV Buses)"],
    nearestRailHub: {
      city: "Chandigarh",
      stationCode: "CDG",
      stationName: "Chandigarh Junction",
      distanceKm: 340,
      transferDuration: "8h 30m",
      modes: ["HRTC Himsuta Volvo to Manali + Electric Green Bus to Rohtang"],
    },
    nearestAirHub: {
      city: "Manali",
      airportCode: "KUU",
      airportName: "Kullu-Manali Airport (Bhuntar)",
      distanceKm: 98,
      transferDuration: "3h 30m",
      modes: ["Prepaid Mountain 4x4 Taxi"],
    },
  },

  Sissu: {
    id: "sissu",
    name: "Sissu",
    state: "Himachal Pradesh",
    aliases: ["sissu", "sissu waterfall", "lahaul sissu", "north portal atal tunnel"],
    coordinates: { lat: 32.4833, lng: 77.1167 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Sissu Lahaul Stand", "Manali ISBT"],
    nearestRailHub: {
      city: "Chandigarh",
      stationCode: "CDG",
      stationName: "Chandigarh Junction",
      distanceKm: 350,
      transferDuration: "8h 45m",
      modes: ["Chandigarh to Manali AC Volvo + 45m scenic cab through Atal Tunnel"],
    },
    nearestAirHub: {
      city: "Manali",
      airportCode: "KUU",
      airportName: "Bhuntar Kullu Airport",
      distanceKm: 85,
      transferDuration: "2h 45m",
      modes: ["Scenic Atal Tunnel Taxi"],
    },
  },

  Chitkul: {
    id: "chitkul",
    name: "Chitkul",
    state: "Himachal Pradesh",
    aliases: ["chitkul", "last indian village", "baspa valley", "sangla valley"],
    coordinates: { lat: 31.3533, lng: 78.4350 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Chitkul Village Bus Stand", "Sangla Bus Depot"],
    nearestRailHub: {
      city: "Kalka",
      stationCode: "KLK",
      stationName: "Kalka Railway Station",
      distanceKm: 270,
      transferDuration: "8h 00m",
      modes: ["HRTC Kinnaur Deluxe Bus via Shimla-Rampur-Sangla"],
    },
    nearestAirHub: {
      city: "Shimla",
      airportCode: "SLV",
      airportName: "Shimla Jubbarhatti Airport",
      distanceKm: 250,
      transferDuration: "7h 30m",
      modes: ["Kinnaur Mountain 4x4 SUV"],
    },
  },

  Kalpa: {
    id: "kalpa",
    name: "Kalpa",
    state: "Himachal Pradesh",
    aliases: ["kalpa", "kinnaur kailash view", "reckong peo"],
    coordinates: { lat: 31.5372, lng: 78.2561 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Reckong Peo Central ISBT (7 km from Kalpa)"],
    nearestRailHub: {
      city: "Kalka",
      stationCode: "KLK",
      stationName: "Kalka Railway Station",
      distanceKm: 255,
      transferDuration: "7h 45m",
      modes: ["Broad Gauge to Kalka + Toy Train to Shimla + Mountain Coach to Kalpa"],
    },
    nearestAirHub: {
      city: "Shimla",
      airportCode: "SLV",
      airportName: "Shimla Airport",
      distanceKm: 240,
      transferDuration: "7h 15m",
      modes: ["Kinnaur Highway Taxi"],
    },
  },

  Kaza: {
    id: "kaza",
    name: "Kaza",
    state: "Himachal Pradesh",
    aliases: ["kaza", "spiti valley", "key monastery", "kibber", "hikkim"],
    coordinates: { lat: 32.2276, lng: 78.0710 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Kaza Spiti Central Bus Depot"],
    nearestRailHub: {
      city: "Chandigarh",
      stationCode: "CDG",
      stationName: "Chandigarh Junction",
      distanceKm: 420,
      transferDuration: "12h 00m",
      modes: ["Chandigarh to Manali Volvo + 4x4 Expedition Vehicle via Atal Tunnel & Kunzum Pass"],
    },
    nearestAirHub: {
      city: "Manali",
      airportCode: "KUU",
      airportName: "Bhuntar Kullu Airport",
      distanceKm: 200,
      transferDuration: "6h 30m",
      modes: ["Spiti Mountain SUV"],
    },
  },

  Chandratal: {
    id: "chandratal_lake",
    name: "Chandratal Lake",
    state: "Himachal Pradesh",
    aliases: ["chandratal lake", "chandratal", "moon lake", "spiti lake", "batal camp"],
    coordinates: { lat: 32.4824, lng: 77.6156 },
    isMetro: false,
    stations: [],
    airports: [],
    busTerminals: ["Batal Roadside Transit Point", "Kaza Bus Stand"],
    nearestRailHub: {
      city: "Chandigarh",
      stationCode: "CDG",
      stationName: "Chandigarh Junction",
      distanceKm: 390,
      transferDuration: "11h 00m",
      modes: ["Broad Gauge to Chandigarh + Atal Tunnel Coach to Batal + 4x4 to Chandratal"],
    },
    nearestAirHub: {
      city: "Manali",
      airportCode: "KUU",
      airportName: "Bhuntar Kullu Airport",
      distanceKm: 140,
      transferDuration: "5h 00m",
      modes: ["High-Altitude 4x4 Snow Taxi"],
    },
  },

  Andaman: {
    id: "andaman",
    name: "Andaman",
    state: "Andaman & Nicobar",
    aliases: ["andaman", "port blair", "havelock", "neil island", "radhanagar beach", "cellular jail"],
    coordinates: { lat: 11.6234, lng: 92.7265 },
    isMetro: false,
    stations: [],
    airports: [
      { code: "IXZ", name: "Veer Savarkar International Airport (Port Blair)", isPrimary: true },
    ],
    busTerminals: ["Port Blair Central Bus Terminus (Mohanpura)"],
    nearestRailHub: null,
    nearestAirHub: {
      city: "Kolkata",
      airportCode: "CCU",
      airportName: "Netaji Subhash Chandra Bose International Airport (2h direct flight to Port Blair)",
      distanceKm: 1300,
      transferDuration: "2h 10m",
      modes: ["Daily Direct Flight (IndiGo / Air India / SpiceJet) to Port Blair IXZ"],
    },
  },
};

/**
 * Normalizes any free-text city / station / location string to a canonical location key
 */
function resolveLocation(query = "") {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return INDIA_LOCATIONS.Delhi;

  // 1. Exact match on location key or canonical location name
  for (const [key, loc] of Object.entries(INDIA_LOCATIONS)) {
    if (key.toLowerCase() === q || loc.name.toLowerCase() === q) {
      return loc;
    }
  }

  // 2. Exact match on any alias
  for (const [key, loc] of Object.entries(INDIA_LOCATIONS)) {
    if (loc.aliases && loc.aliases.some((alias) => q === alias.toLowerCase())) {
      return loc;
    }
  }

  // 3. Whole-word match for short aliases (<= 3 chars) or substring match for longer aliases (>= 4 chars)
  for (const [key, loc] of Object.entries(INDIA_LOCATIONS)) {
    if (loc.aliases && loc.aliases.some((alias) => {
      const a = alias.toLowerCase();
      if (a.length <= 3) {
        // Must match on a distinct word boundary to avoid substrings like 'dr' matching 'chandratal'
        const regex = new RegExp(`(^|[^a-z0-9])${a}([^a-z0-9]|$)`, "i");
        return regex.test(q);
      }
      return q.includes(a) || a.includes(q);
    })) {
      return loc;
    }
  }

  // 4. Case-insensitive fallback to name search
  for (const [key, loc] of Object.entries(INDIA_LOCATIONS)) {
    if (key.toLowerCase().includes(q) || loc.name.toLowerCase().includes(q)) {
      return loc;
    }
  }

  // Return generic fallback descriptor preserving user input
  return {
    id: q.replace(/\s+/g, "_"),
    name: query.trim(),
    state: "India",
    aliases: [q],
    coordinates: { lat: 28.6139, lng: 77.2090 },
    stations: [{ code: q.slice(0, 4).toUpperCase(), name: `${query.trim()} Station`, isPrimary: true }],
    airports: [],
    busTerminals: [`${query.trim()} Bus Stand`],
    nearestRailHub: null,
    nearestAirHub: null,
  };
}

/**
 * Great-circle distance between two locations
 */
function calculateDistanceKm(locA, locB) {
  if (!locA || !locB || !locA.coordinates || !locB.coordinates) return 800;
  const R = 6371;
  const dLat = ((locB.coordinates.lat - locA.coordinates.lat) * Math.PI) / 180;
  const dLng = ((locB.coordinates.lng - locA.coordinates.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((locA.coordinates.lat * Math.PI) / 180) *
      Math.cos((locB.coordinates.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

module.exports = {
  INDIA_LOCATIONS,
  resolveLocation,
  calculateDistanceKm,
};

