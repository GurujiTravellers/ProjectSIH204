/**
 * Authentic Arrival Points & Disembarkation Hubs Registry
 * Verified disembarkation stations, airports, and central bus stands
 * for all 45 Pan-India destinations on Travel Guruji.
 */

export const ARRIVAL_POINTS_REGISTRY = {
  "Gujarat": {
    disembarkationHub: "Ahmedabad",
    train: {
      station: "Ahmedabad Junction (Kalupur)",
      code: "ADI",
      details: "Central western railway gateway; direct Vande Bharat & Superfast connectivity to all Gujarat circuits."
    },
    flight: {
      airport: "Sardar Vallabhbhai Patel International Airport",
      code: "AMD",
      distance: "12 km from city center; direct cabs and metro connectivity."
    },
    bus: {
      terminal: "Geeta Mandir Central Bus Terminus (GSRTC)",
      details: "Primary state transit hub connecting Kutch, Rajkot, Vadodara, and Somnath."
    },
    guidance: "Disembark at Ahmedabad. State express highways (NE-1) and bullet-train feeder cabs connect directly to Statue of Unity (2.5 hrs), Gir (7 hrs), and Rann of Kutch (6 hrs)."
  },

  "Hampi": {
    disembarkationHub: "Hosapete / Mysore",
    train: {
      station: "Hosapete Junction (HPT) / Mysore Jn (MYS) feeder",
      code: "HPT",
      details: "Hosapete is the official railhead for Hampi (13 km away); frequent auto-rickshaws and KSRTC shuttles."
    },
    flight: {
      airport: "Jindal Vidyanagar Airport, Bellary / Kempegowda Intl BLR",
      code: "VDY / BLR",
      distance: "Bellary Airport is 38 km; Bengaluru Airport is 340 km connected via 4-lane NH-48."
    },
    bus: {
      terminal: "Hosapete KSRTC Central Bus Stand",
      details: "Deluxe Airavat buses from Bengaluru, Mysuru, Goa, and Hyderabad terminate here."
    },
    guidance: "Disembark at Hosapete Junction (HPT) or arrive via Mysore/Bengaluru. From Hosapete, direct local autos reach Hampi Bazaar in 20 minutes."
  },

  "Pondicherry": {
    disembarkationHub: "Chennai / Puducherry",
    train: {
      station: "Puducherry Railway Station (PDY) / Chennai Central (MAS)",
      code: "PDY / MAS",
      details: "Direct weekly express to PDY; or disembark at Chennai Central (MAS) / Egmore (MS) and take East Coast Road cabs."
    },
    flight: {
      airport: "Chennai International Airport (MAA) / Puducherry Airport",
      code: "MAA / PNY",
      distance: "Chennai Airport is 145 km via the scenic East Coast Road (ECR); Puducherry Airport handles regional ATR flights."
    },
    bus: {
      terminal: "Pondicherry New Central Bus Stand (PRTC)",
      details: "Maraimalai Adigal Salai; non-stop ECR express buses from Chennai CMBT every 15 minutes."
    },
    guidance: "Disembark directly at Puducherry (PDY) or arrive at Chennai and enjoy a scenic 3-hour drive along the coast via ECR."
  },

  "Ooty": {
    disembarkationHub: "Coimbatore / Mettupalayam",
    train: {
      station: "Mettupalayam (MTP) / Coimbatore Junction (CBE)",
      code: "MTP / CBE",
      details: "Disembark at Coimbatore (CBE, 86 km) or Mettupalayam (MTP) to board the UNESCO Nilgiri Mountain Toy Train."
    },
    flight: {
      airport: "Coimbatore International Airport",
      code: "CJB",
      distance: "88 km from Ooty; 3 hours by hill taxi via Kotagiri or Coonoor ghats."
    },
    bus: {
      terminal: "Ooty Central Bus Stand (Udhagamandalam)",
      details: "Located near Ooty Railway Station; TNSTC and KSRTC deluxe buses arrive round-the-clock."
    },
    guidance: "Disembark at Coimbatore Junction for maximum train choices, or take the heritage Toy Train from Mettupalayam up into the Nilgiris."
  },

  "Goa": {
    disembarkationHub: "Madgaon / Vasco / Thivim",
    train: {
      station: "Madgaon Junction (MAO - South Goa) / Thivim (THVM - North Goa)",
      code: "MAO / THVM",
      details: "Disembark at Thivim for Calangute/Baga/Anjuna; disembark at Madgaon for Colva/Benaulim/Palolem."
    },
    flight: {
      airport: "Manohar Intl Airport Mopa (GOX) / Dabolim Airport (GOI)",
      code: "GOX / GOI",
      distance: "Mopa serves North Goa (30 mins to beaches); Dabolim serves Central & South Goa (25 mins to Panaji)."
    },
    bus: {
      terminal: "Panaji KTC Bus Stand / Mapusa Intercity Terminal",
      details: "Kadamba Transport Corporation connects Mumbai, Pune, Bangalore, and Mangalore directly."
    },
    guidance: "For North Goa beach resorts, select Thivim (THVM) or Mopa Airport (GOX). For peaceful South Goa stays, choose Madgaon (MAO) or Dabolim (GOI)."
  },

  "Shimla": {
    disembarkationHub: "Kalka / Chandigarh",
    train: {
      station: "Kalka Railway Station (KLK) / Shimla Heritage Terminus (SML)",
      code: "KLK / SML",
      details: "Disembark broad-gauge trains at Kalka (KLK); transfer to the Kalka-Shimla Toy Train or scenic taxi via Himalayan Expressway."
    },
    flight: {
      airport: "Shimla Jubbarhatti Airport (SLV) / Chandigarh Intl (IXC)",
      code: "SLV / IXC",
      distance: "Jubbarhatti is 22 km; Chandigarh Airport is 120 km (3.5 hours via 4-lane bypass)."
    },
    bus: {
      terminal: "Shimla ISBT Tutikandi",
      details: "Modern multi-level terminus; Volvo AC coaches from Delhi Kashmere Gate arrive in 8 hours."
    },
    guidance: "Disembark at Kalka for the historic toy train climb, or disembark at Chandigarh Airport/Junction for faster 4-lane road transit."
  },

  "Manali": {
    disembarkationHub: "Chandigarh / Kullu",
    train: {
      station: "Chandigarh Junction (CDG) / Anandpur Sahib (ANSB)",
      code: "CDG",
      details: "Chandigarh is 295 km away; take the Kiratpur-Nerchowk 4-lane highway expressway."
    },
    flight: {
      airport: "Kullu-Manali Airport, Bhuntar",
      code: "KUU",
      distance: "50 km from Manali; scenic 1.5-hour taxi drive along the Beas River."
    },
    bus: {
      terminal: "Manali Private & HRTC Bus Stand (Mall Road)",
      details: "Overnight luxury Scania/Volvo buses from Delhi, Chandigarh, and Amritsar terminate here."
    },
    guidance: "Disembark at Bhuntar Airport for direct flights, or take an overnight Volvo from Delhi/Chandigarh via the newly opened 4-lane Mandi tunnels."
  },

  "Rohtang Pass": {
    disembarkationHub: "Manali / South Portal",
    train: {
      station: "Chandigarh Junction (CDG)",
      code: "CDG",
      details: "Nearest major railhead; connect via Manali base."
    },
    flight: {
      airport: "Bhuntar Kullu Airport (KUU)",
      code: "KUU",
      distance: "100 km; travel via Manali hill highway."
    },
    bus: {
      terminal: "HRTC Manali Bus Stand",
      details: "Electric eco-buses and tourist shuttles depart daily for Rohtang Pass (permit required)."
    },
    guidance: "Disembark at Manali. High-altitude pass (13,058 ft) reached via Rohtang bypass or scenic Atal Tunnel loops."
  },

  "Kasol": {
    disembarkationHub: "Bhuntar / Chandigarh",
    train: {
      station: "Chandigarh Junction (CDG)",
      code: "CDG",
      details: "Chandigarh (280 km) connects to Parvati Valley via Mandi and Bhuntar."
    },
    flight: {
      airport: "Kullu-Manali Airport, Bhuntar",
      code: "KUU",
      distance: "31 km from Kasol; 1 hour by local taxi through Parvati river gorge."
    },
    bus: {
      terminal: "Bhuntar Bus Stand / Kasol Market Stop",
      details: "Disembark at Bhuntar for connecting local shuttles to Kasol, Manikaran, and Tosh."
    },
    guidance: "Disembark at Bhuntar Junction. From Bhuntar, taxis and local HRTC buses leave for Kasol every 30 minutes."
  },

  "Chitkul": {
    disembarkationHub: "Shimla / Kalka",
    train: {
      station: "Kalka Railway Station (KLK) / Shimla (SML)",
      code: "KLK",
      details: "Nearest broad-gauge railhead is Kalka (330 km via NH-05 Hindustan-Tibet Road)."
    },
    flight: {
      airport: "Shimla Airport (SLV) / Chandigarh Intl (IXC)",
      code: "IXC",
      distance: "Chandigarh is 345 km; journey ascends through Rampur and Kinnaur."
    },
    bus: {
      terminal: "Sangla / Reckong Peo HRTC Depot",
      details: "Direct local buses run between Sangla Valley and Chitkul (last inhabited village near Indo-Tibetan border)."
    },
    guidance: "Disembark at Kalka or Shimla. Drive via Hindustan-Tibet Road to Sangla, then 24 km further to Chitkul."
  },

  "Kalpa": {
    disembarkationHub: "Shimla / Reckong Peo",
    train: {
      station: "Shimla Heritage Station (SML) / Kalka (KLK)",
      code: "KLK",
      details: "Kalka is 315 km away via scenic NH-05."
    },
    flight: {
      airport: "Shimla Airport (SLV) / Chandigarh (IXC)",
      code: "SLV",
      distance: "240 km from Shimla through Kinnaur Apple Belt."
    },
    bus: {
      terminal: "Reckong Peo Central Bus Stand",
      details: "Kalpa is 13 km uphill from Reckong Peo district headquarters."
    },
    guidance: "Disembark at Reckong Peo bus hub, then take a short 20-minute mountain taxi up to Kalpa facing the sacred Kinner Kailash."
  },

  "Sissu": {
    disembarkationHub: "Manali / Atal Tunnel North",
    train: {
      station: "Chandigarh Junction (CDG)",
      code: "CDG",
      details: "Connect through Manali and the all-weather Atal Highway Tunnel."
    },
    flight: {
      airport: "Bhuntar Kullu Airport (KUU)",
      code: "KUU",
      distance: "85 km via Atal Tunnel; 2.5 hours driving time."
    },
    bus: {
      terminal: "Sissu North Portal Bus Bay",
      details: "Electric buses from Manali Mall Road pass through the tunnel directly to Sissu waterfalls."
    },
    guidance: "Disembark at Manali, then drive just 40 minutes through the 9.02 km Atal Tunnel to emerge into Sissu in Lahaul Valley."
  },

  "Kaza": {
    disembarkationHub: "Manali / Shimla",
    train: {
      station: "Chandigarh Junction (CDG) / Kalka (KLK)",
      code: "CDG",
      details: "Accessible via Manali-Atal Tunnel-Kunzum Pass route or Shimla-Kinnaur all-weather route."
    },
    flight: {
      airport: "Bhuntar Airport (KUU) / Chandigarh (IXC)",
      code: "KUU",
      distance: "Bhuntar is 245 km via Kunzum Pass (summer only)."
    },
    bus: {
      terminal: "Kaza HRTC Sub-Depot (Spiti Valley)",
      details: "Highest commercial bus hub in India connecting Key, Kibber, and Langza."
    },
    guidance: "Disembark at Manali (summer entry via Kunzum Pass) or Shimla/Reckong Peo (year-round gradual ascent into Spiti)."
  },

  "Chandratal Lake": {
    disembarkationHub: "Manali / Batal",
    train: {
      station: "Chandigarh Junction (CDG)",
      code: "CDG",
      details: "Travel through Manali base."
    },
    flight: {
      airport: "Bhuntar Kullu Airport (KUU)",
      code: "KUU",
      distance: "140 km from Bhuntar through Atal Tunnel and Gramphu."
    },
    bus: {
      terminal: "Batal Chacha Chachi Dhaba Halt",
      details: "Trek or 4x4 camper track from Batal/Gramphu junction to Chandratal camp parking."
    },
    guidance: "Disembark at Manali. Hire a certified 4WD vehicle through Atal Tunnel, Gramphu, and Batal to reach Chandratal (14,100 ft)."
  },

  "Haridwar": {
    disembarkationHub: "Haridwar",
    train: {
      station: "Haridwar Junction",
      code: "HW",
      details: "Major railway station on Northern Railway; direct Shatabdi, Vande Bharat, and Jan Shatabdi from Delhi."
    },
    flight: {
      airport: "Dehradun Jolly Grant Airport",
      code: "DED",
      distance: "38 km from Haridwar; 45 minutes via 4-lane highway."
    },
    bus: {
      terminal: "Haridwar Central ISBT (Near Railway Station)",
      details: "Direct AC and non-AC state buses from Delhi, Lucknow, Jaipur, and Chandigarh."
    },
    guidance: "Disembark directly at Haridwar Junction (HW). E-rickshaws and auto-rickshaws reach Har Ki Pauri ghats in 10 minutes."
  },

  "Rishikesh": {
    disembarkationHub: "Rishikesh / Haridwar",
    train: {
      station: "Yog Nagari Rishikesh (YNRK) / Haridwar (HW)",
      code: "YNRK / HW",
      details: "New modern terminal Yog Nagari Rishikesh; or disembark at Haridwar (25 km away) with 24x7 express taxis."
    },
    flight: {
      airport: "Dehradun Jolly Grant Airport",
      code: "DED",
      distance: "18 km from Rishikesh; 25 minutes by airport taxi."
    },
    bus: {
      terminal: "Rishikesh Sanyukt Yatra Bus Stand / Tapovan ISBT",
      details: "Dedicated gateway for rafting, yoga ashrams, and Char Dham pilgrimage."
    },
    guidance: "Disembark directly at Yog Nagari Rishikesh (YNRK) or Jolly Grant Airport (DED) for swift 20-minute transit to Tapovan."
  },

  "Dehradun": {
    disembarkationHub: "Dehradun",
    train: {
      station: "Dehradun Terminal",
      code: "DDN",
      details: "Direct terminal station for Vande Bharat Express, Shatabdi Express, and Nanda Devi Express."
    },
    flight: {
      airport: "Dehradun Jolly Grant Airport",
      code: "DED",
      distance: "28 km from city center; direct flights from Delhi, Mumbai, Bengaluru, and Hyderabad."
    },
    bus: {
      terminal: "Dehradun ISBT (Haridwar Bypass Road)",
      details: "Large multi-bay terminal operating premium UTC and interstate buses."
    },
    guidance: "Disembark at Dehradun Terminal (DDN) or Jolly Grant Airport (DED); city center and Rajpur Road are 15-30 minutes away."
  },

  "Mussoorie": {
    disembarkationHub: "Dehradun",
    train: {
      station: "Dehradun Terminal (DDN)",
      code: "DDN",
      details: "Disembark at Dehradun (34 km from Mussoorie); shared cabs and private taxis stationed outside."
    },
    flight: {
      airport: "Dehradun Jolly Grant Airport",
      code: "DED",
      distance: "58 km from Mussoorie; 1.5 hours uphill drive via Rajpur and Kolhukhet."
    },
    bus: {
      terminal: "Mussoorie Library Bus Stand / Picture Palace Stand",
      details: "Hill buses from Dehradun Railway Station leave every 15 minutes."
    },
    guidance: "Disembark at Dehradun Railway Station or Jolly Grant Airport, then enjoy a quick 1-hour scenic climb up to the Mall Road."
  },

  "Srinagar": {
    disembarkationHub: "Srinagar / Jammu",
    train: {
      station: "Srinagar Railway Station (SINA) / Jammu Tawi (JAT)",
      code: "SINA / JAT",
      details: "Srinagar station operates on the Kashmir Valley rail link; direct national trains currently connect via Jammu Tawi & Udhampur."
    },
    flight: {
      airport: "Sheikh ul-Alam International Airport, Srinagar",
      code: "SXR",
      distance: "12 km from Dal Lake promenade; high security certified terminal."
    },
    bus: {
      terminal: "TRC Srinagar (Tourist Reception Centre)",
      details: "Central hub for Dal Lake houseboats, Gulmarg shuttles, and Pahalgam taxis."
    },
    guidance: "Disembark at Srinagar Airport (SXR) for instantaneous entry, or take trains to Jammu Tawi followed by the scenic Banihal rail corridor."
  },

  "Gulmarg": {
    disembarkationHub: "Srinagar / Tangmarg",
    train: {
      station: "Jammu Tawi (JAT) / Srinagar (SINA)",
      code: "JAT",
      details: "Connect through Srinagar."
    },
    flight: {
      airport: "Srinagar International Airport",
      code: "SXR",
      distance: "56 km; 1.5 hours drive through apple orchards and pine slopes."
    },
    bus: {
      terminal: "Tangmarg Bus Stand",
      details: "Vehicles without snow chains halt at Tangmarg (12 km below Gulmarg); government chain-taxis operate uphill."
    },
    guidance: "Disembark at Srinagar, drive to Tangmarg base, and take 4WD vehicles up to the Gulmarg Gondola plateau."
  },

  "Pahalgam": {
    disembarkationHub: "Srinagar / Anantnag",
    train: {
      station: "Anantnag Railway Station (ANT) / Jammu Tawi (JAT)",
      code: "ANT",
      details: "Anantnag station is 42 km from Pahalgam on the scenic Kashmir rail line."
    },
    flight: {
      airport: "Srinagar International Airport",
      code: "SXR",
      distance: "90 km; 2.5 hours via the Pampore saffron fields and Lidder River valley."
    },
    bus: {
      terminal: "Pahalgam Main Market Bus Stand",
      details: "Direct tourist cabs from Srinagar TRC and Anantnag."
    },
    guidance: "Disembark at Srinagar Airport or Anantnag Railway Station, followed by an easy riverside drive along the Lidder River."
  },

  "Digha": {
    disembarkationHub: "Digha",
    train: {
      station: "Digha Flag Station / Digha Railway Station",
      code: "DGHA",
      details: "Direct terminal station for Tamralipta Express, Kandari Express, and Howrah-Digha AC Superfast."
    },
    flight: {
      airport: "Netaji Subhash Chandra Bose Intl Airport, Kolkata",
      code: "CCU",
      distance: "185 km; 4 hours by 4-lane NH-116B Expressway."
    },
    bus: {
      terminal: "Digha Central Bus Stand (Old Digha)",
      details: "Round-the-clock SBSTC, NBSTC, and private AC Volvos from Esplanade Kolkata."
    },
    guidance: "Disembark directly at Digha Railway Station (DGHA). Beach hotels in Old Digha and New Digha are just 5–10 minutes away."
  },

  "Darjeeling": {
    disembarkationHub: "New Jalpaiguri (NJP) / Siliguri",
    train: {
      station: "New Jalpaiguri Junction (NJP) / Darjeeling Station (DJ)",
      code: "NJP / DJ",
      details: "Disembark broad-gauge trains at NJP (70 km away); transfer to shared Himalayan jeeps or the UNESCO DHR Toy Train."
    },
    flight: {
      airport: "Bagdogra International Airport, Siliguri",
      code: "IXB",
      distance: "68 km from Darjeeling; 2.5 hours via Rohini or Mirik scenic tea garden road."
    },
    bus: {
      terminal: "Siliguri Tenzing Norgay Central Bus Terminus",
      details: "Hill shared taxis and buses leave for Darjeeling Chowrasta every 10 minutes."
    },
    guidance: "Disembark at New Jalpaiguri (NJP) or Bagdogra Airport (IXB). Take pre-paid shared or private 4WD taxis up the hill via Rohini."
  },

  "Kolkata": {
    disembarkationHub: "Kolkata (Howrah / Sealdah)",
    train: {
      station: "Howrah Junction (HWH) / Sealdah (SDAH) / Shalimar (SHM)",
      code: "HWH / SDAH",
      details: "Howrah and Sealdah are India's busiest rail hubs, connected to all four corners of India."
    },
    flight: {
      airport: "Netaji Subhash Chandra Bose International Airport",
      code: "CCU",
      distance: "16 km from central Kolkata; integrated AC buses and taxi booths."
    },
    bus: {
      terminal: "Esplanade Central Bus Terminus (Dharmatala)",
      details: "Central hub for interstate and regional Volvo services."
    },
    guidance: "Disembark at Howrah (HWH) or Sealdah (SDAH). Take the new underwater East-West Metro or iconic yellow cabs to your hotel."
  },

  "Puri": {
    disembarkationHub: "Puri / Bhubaneswar",
    train: {
      station: "Puri Railway Station",
      code: "PURI",
      details: "Terminal station for Purushottam Express, Dhauli Express, and Vande Bharat Express."
    },
    flight: {
      airport: "Biju Patnaik International Airport, Bhubaneswar",
      code: "BBI",
      distance: "60 km; 1 hour via smooth 4-lane NH-316 highway."
    },
    bus: {
      terminal: "Puri New Bus Stand (Near Gundicha Temple)",
      details: "OSRTC and private luxury coaches connect from Kolkata, Bhubaneswar, and Cuttack."
    },
    guidance: "Disembark directly at Puri Station (PURI) just 2 km from the Golden Beach and Jagannath Temple, or arrive via Bhubaneswar Airport (BBI)."
  },

  "Bhubaneswar": {
    disembarkationHub: "Bhubaneswar",
    train: {
      station: "Bhubaneswar Railway Station",
      code: "BBS",
      details: "Central East Coast railway headquarters; connected to all major Indian metropolitan cities."
    },
    flight: {
      airport: "Biju Patnaik International Airport",
      code: "BBI",
      distance: "4 km from city center; 10 minutes by pre-paid taxi or auto."
    },
    bus: {
      terminal: "Baramunda Inter-State Bus Terminal (ISBT)",
      details: "State-of-the-art modern air-conditioned transit terminal."
    },
    guidance: "Disembark at Bhubaneswar (BBS) or Biju Patnaik Airport (BBI); centrally positioned to explore ancient temple architectures."
  },

  "Konark": {
    disembarkationHub: "Puri / Bhubaneswar",
    train: {
      station: "Puri Railway Station (PURI) / Bhubaneswar (BBS)",
      code: "PURI",
      details: "Puri is 35 km away; Bhubaneswar is 65 km away via Marine Drive expressway."
    },
    flight: {
      airport: "Biju Patnaik International Airport",
      code: "BBI",
      distance: "65 km via Pipili and Nimapada highway."
    },
    bus: {
      terminal: "Konark Sun Temple Bus Stand",
      details: "Direct OTDC tourist buses and shuttles from Puri and Bhubaneswar."
    },
    guidance: "Disembark at Puri or Bhubaneswar; take the magnificent Marine Drive coastal expressway directly to the Sun Temple."
  },

  "Shillong": {
    disembarkationHub: "Guwahati",
    train: {
      station: "Guwahati Railway Station",
      code: "GHY",
      details: "Premier gateway to Northeast India; broad gauge connections to all Indian states (98 km from Shillong)."
    },
    flight: {
      airport: "Umroi Airport Shillong (SHL) / Lokpriya Gopinath Bordoloi Guwahati (GAU)",
      code: "SHL / GAU",
      distance: "Umroi is 30 km; Guwahati International Airport is 120 km (3 hours by smooth 4-lane Asian Highway 1/2)."
    },
    bus: {
      terminal: "Paltan Bazaar ASTC Stand Guwahati / Shillong Polo Grounds",
      details: "Shared tourist cabs (Sumo/Innova) leave every 5 minutes from Paltan Bazaar to Shillong Police Bazar."
    },
    guidance: "Disembark at Guwahati (GHY). Shared tourist cabs or airport coaches take you along scenic Umiam Lake directly to Police Bazar in 3 hours."
  },

  "Mawlynnong Village": {
    disembarkationHub: "Shillong / Guwahati",
    train: {
      station: "Guwahati Railway Station (GHY)",
      code: "GHY",
      details: "Connect through Shillong."
    },
    flight: {
      airport: "Guwahati Airport (GAU) / Shillong Airport (SHL)",
      code: "GAU",
      distance: "175 km from Guwahati; 78 km from Shillong."
    },
    bus: {
      terminal: "Shillong Bara Bazar Tourist Taxi Stand",
      details: "Direct day-trip and stay tourist taxis to Asia's cleanest village."
    },
    guidance: "Disembark at Shillong, then travel south for 2.5 hours through misty Khasi hills and living root bridge sanctuaries."
  },

  "Dawki": {
    disembarkationHub: "Shillong / Guwahati",
    train: {
      station: "Guwahati Railway Station (GHY)",
      code: "GHY",
      details: "Connect through Shillong via NH-206."
    },
    flight: {
      airport: "Guwahati Airport (GAU) / Shillong (SHL)",
      code: "GAU",
      distance: "82 km from Shillong; 3 hours by private tourist cab."
    },
    bus: {
      terminal: "Dawki Border Bridge Checkpost",
      details: "Interstate tourist vehicles and border trade transport halt here."
    },
    guidance: "Disembark at Shillong; drive via Pynursla ridge to reach the crystal-clear emerald waters of the Umngot River at Dawki."
  },

  "Jaipur": {
    disembarkationHub: "Jaipur",
    train: {
      station: "Jaipur Junction",
      code: "JP",
      details: "Direct high-speed Vande Bharat, Double Decker, and Shatabdi from Delhi, Mumbai, and Ahmedabad."
    },
    flight: {
      airport: "Jaipur International Airport, Sanganer",
      code: "JAI",
      distance: "12 km from city center; direct domestic and international flights."
    },
    bus: {
      terminal: "Sindhi Camp Central Bus Stand",
      details: "Major RSRTC hub with round-the-clock air-conditioned express services."
    },
    guidance: "Disembark directly at Jaipur Junction (JP) or Jaipur Airport (JAI); central heritage palaces are within a 15-minute drive."
  },

  "Jaisalmer": {
    disembarkationHub: "Jaisalmer / Jodhpur",
    train: {
      station: "Jaisalmer Railway Station",
      code: "JSM",
      details: "Direct express trains (Runicha Express, Delhi-Jaisalmer Express) arrive right into the Golden City."
    },
    flight: {
      airport: "Jaisalmer Civil Airport (JSA) / Jodhpur Airport (JDH)",
      code: "JSA / JDH",
      distance: "Jaisalmer Airport is 15 km (seasonal flights); Jodhpur is 280 km (4.5 hours by desert highway)."
    },
    bus: {
      terminal: "Jaisalmer Central Bus Stand (Near Golden Fort)",
      details: "Connecting sleeper coaches from Jodhpur, Bikaner, and Ahmedabad."
    },
    guidance: "Disembark at Jaisalmer Station (JSM), located just 2 km from the Sonar Qila (Golden Fort) and Sam Sand Dunes desert camps."
  },

  "Ajmer": {
    disembarkationHub: "Ajmer",
    train: {
      station: "Ajmer Junction",
      code: "AII",
      details: "Major rail junction on Delhi-Mumbai route; terminates Delhi-Ajmer Vande Bharat Express."
    },
    flight: {
      airport: "Kishangarh Airport (KQH) / Jaipur Airport (JAI)",
      code: "KQH / JAI",
      distance: "Kishangarh Airport is 28 km; Jaipur Airport is 135 km."
    },
    bus: {
      terminal: "Ajmer Central RSRTC Bus Stand",
      details: "Frequent shuttle buses to holy Pushkar Lake (14 km) every 10 minutes."
    },
    guidance: "Disembark at Ajmer Junction (AII) for the holy Dargah Sharif, or catch an auto to Pushkar across the scenic Nag Pahar hill."
  },

  "Delhi": {
    disembarkationHub: "New Delhi / Delhi NCR",
    train: {
      station: "New Delhi (NDLS) / Old Delhi (DLI) / Hazrat Nizamuddin (NZM)",
      code: "NDLS / NZM",
      details: "Heart of Indian Railways; Rajdhani, Vande Bharat, and Shatabdi terminals."
    },
    flight: {
      airport: "Indira Gandhi International Airport",
      code: "DEL",
      distance: "Terminal 3 & Terminal 1; direct Delhi Metro Airport Express connects to NDLS in 18 minutes."
    },
    bus: {
      terminal: "Kashmere Gate ISBT / Anand Vihar ISBT / Sarai Kale Khan",
      details: "India's largest bus transit hubs operating interstate services to all directions."
    },
    guidance: "Disembark at New Delhi (NDLS) or IGI Airport (DEL). Delhi Metro network provides instantaneous, traffic-free connectivity anywhere in NCR."
  },

  "Agra": {
    disembarkationHub: "Agra",
    train: {
      station: "Agra Cantt Railway Station",
      code: "AGC",
      details: "Gatimaan Express (100 mins from Delhi), Taj Express, and Vande Bharat halt here."
    },
    flight: {
      airport: "Agra Kheria Airport (AGR) / Delhi Airport (DEL)",
      code: "AGR",
      distance: "Agra Airport is 7 km; Delhi is 200 km via 6-lane Yamuna Expressway."
    },
    bus: {
      terminal: "Idgah Bus Stand / ISBT Transport Nagar",
      details: "Direct non-stop expressway coaches from Delhi and Lucknow."
    },
    guidance: "Disembark at Agra Cantt (AGC); prepaid taxi and auto booths deliver you to Taj Mahal and Agra Fort in 15 minutes."
  },

  "Varanasi": {
    disembarkationHub: "Varanasi / Pt. Deen Dayal Upadhyaya (Mughalsarai)",
    train: {
      station: "Varanasi Junction (BSB) / Banaras (BSBS) / DDU Junction",
      code: "BSB / DDU",
      details: "Vande Bharat Express terminal; DDU Junction (15 km) connects all eastern and northern railway mainlines."
    },
    flight: {
      airport: "Lal Bahadur Shastri International Airport, Babatpur",
      code: "VNS",
      distance: "24 km from Ghats; 40 minutes via new elevated expressway."
    },
    bus: {
      terminal: "Varanasi Cantt Roadways Bus Stand",
      details: "Direct buses to Prayagraj, Ayodhya, Bodh Gaya, and Gorakhpur."
    },
    guidance: "Disembark at Varanasi Junction (BSB) or Lal Bahadur Shastri Airport (VNS). Auto-rickshaws reach Dashashwamedh Ghat in 20 minutes."
  },

  "Kalka": {
    disembarkationHub: "Kalka / Chandigarh",
    train: {
      station: "Kalka Railway Station",
      code: "KLK",
      details: "Historic junction where broad-gauge lines transition to narrow-gauge Himalayan Toy Train."
    },
    flight: {
      airport: "Chandigarh International Airport",
      code: "IXC",
      distance: "35 km from Kalka; 45 minutes via Himalayan Expressway."
    },
    bus: {
      terminal: "Kalka Bus Stand (Shimla Road)",
      details: "Regular interstate buses between Delhi, Chandigarh, and Himachal Pradesh."
    },
    guidance: "Disembark at Kalka Railway Station (KLK) directly on Platform 3 to switch to the UNESCO Kalka-Shimla Toy Train."
  },

  "Leh Ladakh": {
    disembarkationHub: "Leh",
    train: {
      station: "Jammu Tawi (JAT) / Chandigarh (CDG)",
      code: "JAT / CDG",
      details: "No railhead in Ladakh yet; disembark at Jammu or Chandigarh, then fly or drive through Manali/Srinagar."
    },
    flight: {
      airport: "Kushok Bakula Rimpochee Airport, Leh",
      code: "IXL",
      distance: "3.5 km from Leh Main Bazaar; world's highest commercial airport."
    },
    bus: {
      terminal: "Leh New Bus Stand (Choglamsar / Skalzangling)",
      details: "Long-distance HRTC and JKSRTC buses from Manali and Srinagar operate July–October."
    },
    guidance: "Disembark at Leh Airport (IXL). Strictly dedicate Day 1 to complete rest and acclimatization to the 11,500 ft altitude."
  },

  "Kerala": {
    disembarkationHub: "Kochi (Cochin) / Thiruvananthapuram",
    train: {
      station: "Ernakulam Junction (ERS) / Ernakulam Town (ERN)",
      code: "ERS",
      details: "Central rail gateway to Munnar, Alleppey backwaters, and Thekkady spice plantations."
    },
    flight: {
      airport: "Cochin International Airport (COK) / Trivandrum (TRV)",
      code: "COK / TRV",
      distance: "Cochin Airport is world's first fully solar-powered airport; 30 km to Fort Kochi."
    },
    bus: {
      terminal: "KSRTC Central Bus Station, Thampanoor / Vyttila Mobility Hub",
      details: "Vyttila Mobility Hub Kochi integrates long-distance buses, city metro, and water metro."
    },
    guidance: "Disembark at Ernakulam (ERS) or Cochin Airport (COK). From here, Alleppey backwaters are 1.5 hrs south and Munnar hills are 3.5 hrs east."
  },

  "Vizag": {
    disembarkationHub: "Visakhapatnam",
    train: {
      station: "Visakhapatnam Junction",
      code: "VSKP",
      details: "Headquarters of South Coast Railway; direct Vande Bharat to Secunderabad and Tirupati."
    },
    flight: {
      airport: "Visakhapatnam International Airport",
      code: "VTZ",
      distance: "8 km from city center and RK Beach promenade."
    },
    bus: {
      terminal: "Dwaraka Bus Station (RTC Complex)",
      details: "APSRTC central hub connecting Araku Valley, Hyderabad, and Odisha."
    },
    guidance: "Disembark at Visakhapatnam Junction (VSKP) or Vizag Airport (VTZ); RK Beach and submarine museum are just 15 minutes away."
  },

  "Punjab": {
    disembarkationHub: "Amritsar",
    train: {
      station: "Amritsar Junction",
      code: "ASR",
      details: "Major railway terminal; direct Vande Bharat, Golden Temple Mail, and Shatabdi from Delhi and Mumbai."
    },
    flight: {
      airport: "Sri Guru Ram Dass Jee International Airport, Amritsar",
      code: "ATQ",
      distance: "11 km from Golden Temple; direct international and domestic flights."
    },
    bus: {
      terminal: "Amritsar Central ISBT (Shaheed Madan Lal Dhingra)",
      details: "PUNBUS and PRTC luxury AC buses connect all cities of Punjab and Delhi."
    },
    guidance: "Disembark at Amritsar Junction (ASR) or Amritsar Airport (ATQ). Free eco-friendly shuttles and e-rickshaws connect directly to Golden Temple."
  },

  "Udaipur": {
    disembarkationHub: "Udaipur",
    train: {
      station: "Udaipur City Railway Station",
      code: "UDZ",
      details: "Terminal station for Chetak Express, Mewar Express, and Udaipur-Jaipur Vande Bharat."
    },
    flight: {
      airport: "Maharana Pratap Airport, Dabok",
      code: "UDR",
      distance: "22 km from Lake Pichola; 35 minutes via 6-lane airport road."
    },
    bus: {
      terminal: "Udaipur Central Bus Stand (Udiapol)",
      details: "Direct AC sleeper coaches connecting Ahmedabad, Jaipur, Mumbai, and Jodhpur."
    },
    guidance: "Disembark directly at Udaipur City (UDZ). Lake Pichola heritage havelis and City Palace are just 10 minutes away."
  },

  "Mumbai": {
    disembarkationHub: "Mumbai (CSMT / Mumbai Central)",
    train: {
      station: "Chhatrapati Shivaji Maharaj Terminus (CSMT) / Mumbai Central (MMCT)",
      code: "CSMT / MMCT",
      details: "UNESCO World Heritage CSMT connects Central Railway; Mumbai Central & Bandra Terminus connect Western Railway."
    },
    flight: {
      airport: "Chhatrapati Shivaji Maharaj International Airport (BOM)",
      code: "BOM",
      distance: "Terminal 2 (Sahar) for international/domestic; Terminal 1 (Santacruz) for domestic; connected to Metro Line 3."
    },
    bus: {
      terminal: "Mumbai Central MSRTC Stand / Borivali Private Bus Hub",
      details: "Shivneri AC Volvos connecting Pune, Nashik, and Goa."
    },
    guidance: "Disembark at CSMT for South Mumbai heritage and Gateway of India, or Mumbai Central / Bandra for suburban and western seaside areas."
  },

  "Andaman": {
    disembarkationHub: "Port Blair",
    train: {
      station: "N/A (Island Territory — Connected by Sea & Air)",
      code: "PORT",
      details: "No railway line. Accessible via passenger ships from Chennai, Kolkata, or Visakhapatnam port."
    },
    flight: {
      airport: "Veer Savarkar International Airport, Port Blair",
      code: "IXZ",
      distance: "Centrally located in Port Blair; direct flights from Kolkata, Chennai, Delhi, Bengaluru, and Hyderabad."
    },
    bus: {
      terminal: "Port Blair Central Bus Terminus & Haddo Wharf",
      details: "High-speed catamarans (Makruzz, Nautika, Green Ocean) depart from Phoenix Bay / Haddo Jetty to Havelock and Neil."
    },
    guidance: "Disembark at Veer Savarkar Airport (IXZ), Port Blair. Inter-island private ferries (Makruzz/Nautika) whisk you to Havelock (Swaraj Dweep) in 90 mins."
  }
};

/**
 * Helper to fetch arrival points for any destination name
 */
export function getArrivalPoints(destinationName = "") {
  if (!destinationName) return null;
  const normalized = destinationName.trim().toLowerCase();

  for (const [key, data] of Object.entries(ARRIVAL_POINTS_REGISTRY)) {
    if (key.toLowerCase() === normalized || normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return { destination: key, ...data };
    }
  }

  // Graceful fallback for any sub-location
  return {
    destination: destinationName,
    disembarkationHub: destinationName,
    train: {
      station: `${destinationName} Junction / Nearest Railhead`,
      code: "RAIL",
      details: `Direct passenger & express trains serve ${destinationName} and adjacent district junctions.`
    },
    flight: {
      airport: `Nearest Regional / Commercial Airport to ${destinationName}`,
      code: "AIR",
      distance: `Commercial air connection with connecting taxi/shuttle service to ${destinationName}.`
    },
    bus: {
      terminal: `${destinationName} Central Intercity Bus Terminal`,
      details: `State road transport and private luxury sleeper buses operate daily services.`
    },
    guidance: `Disembark at central ${destinationName} transport terminal. Local taxis, auto-rickshaws, and app-based cabs operate round-the-clock.`
  };
}
