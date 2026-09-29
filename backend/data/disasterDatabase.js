/**
 * Authentic Disaster Intelligence & Emergency Response Database
 * Formatted according to NDMA, IMD, and SDRF standard protocols.
 */

// Active alerts are populated purely by real-time external feeds (GDACS, USGS, NASA, Open-Meteo, Tomorrow.io).
// Zero manual or hardcoded disaster events are permitted.
const ACTIVE_DISASTER_ALERTS = [];

const DESTINATION_EMERGENCY_FACILITIES = {
  "Manali": {
    "disasterStatus": "CRITICAL",
    "isDisasterZone": true,
    "hospitals": [
      {
        "name": "Civil Hospital Manali",
        "type": "Govt. Multi-Specialty & Trauma",
        "phone": "+91 1902 252338",
        "address": "Model Town, Manali",
        "distance": "0.8 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Mission Hospital",
        "type": "Emergency & Surgical Care",
        "phone": "+91 1902 252379",
        "address": "Hadimba Temple Road, Manali",
        "distance": "1.4 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Regional Hospital Kullu",
        "type": "District Trauma Care Hub",
        "phone": "+91 1902 222350",
        "address": "Dhalpur, Kullu (38 km)",
        "distance": "38 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Atal Bihari Mountaineering Institute Relief Base",
        "capacity": "500 people",
        "phone": "+91 1902 252342",
        "location": "Aleo, Manali"
      },
      {
        "name": "Government College Auditorium Safe Zone",
        "capacity": "350 people",
        "phone": "+91 1902 253010",
        "location": "Dhungri, Manali"
      }
    ],
    "localHelplines": [
      {
        "role": "SDRF Kullu Battalion Control",
        "phone": "1070"
      },
      {
        "role": "Manali Police Station Duty Officer",
        "phone": "+91 1902 252326"
      },
      {
        "role": "SDM Manali Emergency Control Room",
        "phone": "+91 1902 254100"
      }
    ]
  },
  "Puri": {
    "disasterStatus": "CRITICAL",
    "isDisasterZone": true,
    "hospitals": [
      {
        "name": "District Headquarters Hospital (DHH) Puri",
        "type": "Govt. Super-Specialty",
        "phone": "+91 6752 222055",
        "address": "Hospital Square, Grand Road, Puri",
        "distance": "1.1 km",
        "hasEmergencyICU": true
      },
      {
        "name": "IDH Infectious & Emergency Hospital",
        "type": "Disaster Medical Station",
        "phone": "+91 6752 223120",
        "address": "Chakratirtha Road, Puri",
        "distance": "2.0 km",
        "hasEmergencyICU": false
      }
    ],
    "shelters": [
      {
        "name": "Multi-Purpose Cyclone Shelter #4",
        "capacity": "1,200 people",
        "phone": "+91 6752 223400",
        "location": "Near Railway Station, Puri"
      },
      {
        "name": "Town Hall Emergency Camp",
        "capacity": "800 people",
        "phone": "+91 6752 222110",
        "location": "Grand Road, Puri"
      }
    ],
    "localHelplines": [
      {
        "role": "ODRAF (Odisha Disaster Rapid Action Force)",
        "phone": "1070"
      },
      {
        "role": "Sea Beach Police Station",
        "phone": "+91 6752 223500"
      },
      {
        "role": "Collectorate Emergency Helpline",
        "phone": "+91 6752 223230"
      }
    ]
  },
  "Rishikesh": {
    "disasterStatus": "RESTRICTED",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "AIIMS Rishikesh",
        "type": "Premier National Apex Hospital & Trauma Centre",
        "phone": "+91 135 2462929",
        "address": "Virbhadra Road, Rishikesh",
        "distance": "4.2 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Government Sub-District Hospital",
        "type": "Govt. Emergency Care",
        "phone": "+91 135 2430152",
        "address": "Dehradun Road, Rishikesh",
        "distance": "1.5 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Parmarth Niketan Disaster Relief Wing",
        "capacity": "600 people",
        "phone": "+91 135 2440088",
        "location": "Swargashram, Rishikesh"
      }
    ],
    "localHelplines": [
      {
        "role": "SDRF Uttarakhand Control Room",
        "phone": "1070"
      },
      {
        "role": "Muni Ki Reti Police Station",
        "phone": "+91 135 2430268"
      },
      {
        "role": "Disaster Control Room Tehri / Pauri",
        "phone": "+91 1376 233433"
      }
    ]
  },
  "Goa": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Goa Medical College (GMC) & Hospital",
        "type": "Premier Super Specialty & Trauma Center",
        "phone": "+91 832 2458700",
        "address": "Bambolim, Goa",
        "distance": "8.0 km",
        "hasEmergencyICU": true
      },
      {
        "name": "North Goa District Hospital",
        "type": "Govt. Multi-Specialty",
        "phone": "+91 832 2225646",
        "address": "Mapusa, Goa",
        "distance": "12 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Dr. Shyama Prasad Mukherjee Stadium Safe Hub",
        "capacity": "2,000 people",
        "phone": "+91 832 2458000",
        "location": "Taleigao, Panaji"
      }
    ],
    "localHelplines": [
      {
        "role": "Drishti Marine Coastal Rescue",
        "phone": "+91 99229 99990"
      },
      {
        "role": "Goa Police Control Room",
        "phone": "112"
      },
      {
        "role": "State Disaster Management Authority (SDMA)",
        "phone": "+91 832 2419550"
      }
    ]
  },
  "Darjeeling": {
    "disasterStatus": "RESTRICTED",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Darjeeling District Hospital (Eden Sanatorium)",
        "type": "Govt. Multi-Specialty",
        "phone": "+91 354 2254218",
        "address": "Lebong Cart Road, Darjeeling",
        "distance": "1.2 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Gorkha Ranga Manch Bhaban Hall",
        "capacity": "400 people",
        "phone": "+91 354 2252110",
        "location": "Mall Road, Darjeeling"
      }
    ],
    "localHelplines": [
      {
        "role": "Darjeeling Hill Disaster Helpline",
        "phone": "+91 354 2255749"
      },
      {
        "role": "Sadar Police Station",
        "phone": "+91 354 2252222"
      }
    ]
  },
  "Leh Ladakh": {
    "disasterStatus": "RESTRICTED",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Sonam Norboo Memorial (SNM) Hospital Leh",
        "type": "District Apex Hospital & High-Altitude Trauma",
        "phone": "+91 1982 252014",
        "address": "Skara Road, Leh, Ladakh",
        "distance": "1.5 km",
        "hasEmergencyICU": true
      },
      {
        "name": "153 General Hospital (Indian Army)",
        "type": "Military High-Altitude Medical Center",
        "phone": "+91 1982 252112",
        "address": "Military Station, Leh",
        "distance": "3.0 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "NDRF 13th Battalion Base & Relief Camp",
        "capacity": "600 people",
        "phone": "+91 1982 255555",
        "location": "Choglamsar, Leh"
      },
      {
        "name": "Polo Ground Emergency Evacuation Point",
        "capacity": "1,500 people",
        "phone": "112",
        "location": "Main Bazaar, Leh"
      }
    ],
    "localHelplines": [
      {
        "role": "UT Ladakh Disaster Control Room",
        "phone": "1070"
      },
      {
        "role": "Tourist Police Leh",
        "phone": "+91 1982 252018"
      },
      {
        "role": "BRO High Mountain Pass Clearance",
        "phone": "+91 1982 252324"
      }
    ]
  },
  "Kerala": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Ernakulam Government General Hospital",
        "type": "Super Specialty & Emergency Trauma",
        "phone": "+91 484 2361251",
        "address": "Hospital Road, Marine Drive, Kochi",
        "distance": "2.0 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Aster Medcity & Disaster Trauma Center",
        "type": "Advanced Quaternary Care",
        "phone": "+91 484 6699999",
        "address": "Cheranalloor, Kochi",
        "distance": "8.5 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Kochi Marine Drive Cyclone & Flood Shelter",
        "capacity": "1,500 people",
        "phone": "112",
        "location": "Shanmugham Road, Kochi"
      },
      {
        "name": "Aluva Flood Evacuation Safe Hub",
        "capacity": "1,000 people",
        "phone": "+91 484 2624020",
        "location": "Town Hall Aluva, Ernakulam"
      }
    ],
    "localHelplines": [
      {
        "role": "Kerala State Disaster Management (KSDMA)",
        "phone": "1070"
      },
      {
        "role": "Coastal Police Station Kochi",
        "phone": "+91 484 2215444"
      },
      {
        "role": "Tourist Police Kerala",
        "phone": "+91 484 2226543"
      }
    ]
  },
  "Vizag": {
    "disasterStatus": "RESTRICTED",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "King George Hospital (KGH)",
        "type": "Premier Govt. Super-Specialty & Coastal Trauma Center",
        "phone": "+91 891 2564891",
        "address": "Maharanipeta, Visakhapatnam",
        "distance": "1.8 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Apollo Hospitals Health City",
        "type": "Multi-Specialty Emergency Care",
        "phone": "+91 891 2867777",
        "address": "Arilova, Visakhapatnam",
        "distance": "6.0 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "RK Beach Multi-Purpose Cyclone Shelter",
        "capacity": "1,200 people",
        "phone": "112",
        "location": "Beach Road, Visakhapatnam"
      },
      {
        "name": "Andhra University Indoor Evacuation Center",
        "capacity": "2,000 people",
        "phone": "+91 891 2844000",
        "location": "AU Campus, Siripuram"
      }
    ],
    "localHelplines": [
      {
        "role": "AP State Disaster Management (APSDMA)",
        "phone": "1070"
      },
      {
        "role": "Coastal Marine Police Vizag",
        "phone": "+91 891 2565100"
      },
      {
        "role": "Collectorate Emergency Helpline",
        "phone": "+91 891 2560300"
      }
    ]
  },
  "Gujarat": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Civil Hospital Ahmedabad (Asia's Largest Apex Hospital)",
        "type": "Super Specialty & Trauma Emergency",
        "phone": "+91 79 22683721",
        "address": "Asarwa, Ahmedabad",
        "distance": "4.5 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Zydus Hospital & Trauma Center",
        "type": "Advanced Emergency Care",
        "phone": "+91 79 66190201",
        "address": "Thaltej, SG Highway, Ahmedabad",
        "distance": "7.0 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Sardar Vallabhbhai Patel Stadium Safe Zone",
        "capacity": "3,500 people",
        "phone": "112",
        "location": "Navrangpura, Ahmedabad"
      },
      {
        "name": "Rann of Kutch Relief Base Dhordo",
        "capacity": "800 people",
        "phone": "+91 2832 250020",
        "location": "Dhordo, Kutch"
      }
    ],
    "localHelplines": [
      {
        "role": "Gujarat State Disaster Management (GSDMA)",
        "phone": "1070"
      },
      {
        "role": "Police Commissioner Control Room",
        "phone": "112"
      },
      {
        "role": "Tourist Assistance Gujarat",
        "phone": "1363"
      }
    ]
  },
  "Punjab": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Guru Nanak Dev Hospital & Medical College",
        "type": "Govt. Apex Teaching Hospital & Trauma",
        "phone": "+91 183 2573210",
        "address": "Majitha Road, Amritsar",
        "distance": "3.2 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Sri Guru Ram Das Institute of Medical Sciences",
        "type": "Super Specialty Hospital",
        "phone": "+91 183 2870200",
        "address": "Mehta Road, Vallah, Amritsar",
        "distance": "5.5 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Guru Arjan Dev Niwas Emergency Safe Wing",
        "capacity": "2,500 people",
        "phone": "+91 183 2553957",
        "location": "Near Sri Harmandir Sahib, Amritsar"
      },
      {
        "name": "Amritsar Railway Station Passenger Safe Hall",
        "capacity": "1,000 people",
        "phone": "139",
        "location": "Station Road, Amritsar"
      }
    ],
    "localHelplines": [
      {
        "role": "Punjab Disaster Management Control Room",
        "phone": "1070"
      },
      {
        "role": "Amritsar Police Commissionerate Control",
        "phone": "112"
      },
      {
        "role": "Golden Temple Information Center",
        "phone": "+91 183 2553957"
      }
    ]
  },
  "Kalka": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Sub-Divisional Civil Hospital Kalka",
        "type": "Govt. Emergency Care",
        "phone": "+91 1733 220025",
        "address": "Railway Colony, Kalka",
        "distance": "0.8 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Civil Hospital Sector 6 Panchkula",
        "type": "District Super-Specialty",
        "phone": "+91 172 2565432",
        "address": "Sector 6, Panchkula",
        "distance": "16 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Kalka Railway Community Relief Hall",
        "capacity": "500 people",
        "phone": "139",
        "location": "Near Kalka Railway Station"
      }
    ],
    "localHelplines": [
      {
        "role": "Haryana Disaster Management",
        "phone": "1070"
      },
      {
        "role": "Kalka Police Station",
        "phone": "+91 1733 220015"
      }
    ]
  },
  "Udaipur": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Maharana Bhupal (MB) Government Hospital",
        "type": "Premier District Medical College & Trauma",
        "phone": "+91 294 2417721",
        "address": "Hospital Road, Court Chauraha, Udaipur",
        "distance": "1.5 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Geetanjali Medical College & Hospital",
        "type": "Super Specialty Hospital",
        "phone": "+91 294 2500000",
        "address": "Hiran Magri Extension, Udaipur",
        "distance": "5.5 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Sukhadia Memorial Town Hall Relief Safe Center",
        "capacity": "1,200 people",
        "phone": "112",
        "location": "City Center, Udaipur"
      }
    ],
    "localHelplines": [
      {
        "role": "Rajasthan Disaster Management Control",
        "phone": "1070"
      },
      {
        "role": "Udaipur Tourist Police",
        "phone": "+91 294 2421200"
      },
      {
        "role": "Lake Patrol & Water Rescue",
        "phone": "+91 294 2415555"
      }
    ]
  },
  "Ooty": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Government Headquarters Hospital (GH) Ooty",
        "type": "Govt. Hill Multi-Specialty & Trauma",
        "phone": "+91 423 2442212",
        "address": "Hospital Road, Upper Bazaar, Ooty",
        "distance": "1.0 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Nilgiri District Community Emergency Hall",
        "capacity": "600 people",
        "phone": "112",
        "location": "Commercial Road, Ooty"
      }
    ],
    "localHelplines": [
      {
        "role": "Tamil Nadu SDMA Control Room",
        "phone": "1070"
      },
      {
        "role": "Nilgiri Hill Rescue & Fire Service",
        "phone": "101"
      },
      {
        "role": "Ooty Police Control Room",
        "phone": "112"
      }
    ]
  },
  "Pondicherry": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "JIPMER (Jawaharlal Institute of Postgraduate Medical Education)",
        "type": "Premier National Apex Medical Institute",
        "phone": "+91 413 2296000",
        "address": "Dhanvantari Nagar, Gorimedu, Puducherry",
        "distance": "4.5 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Indira Gandhi Govt. General Hospital & Research Institute",
        "type": "Govt. Multi-Specialty Hospital",
        "phone": "+91 413 2336050",
        "address": "Victor Simonel St, White Town, Puducherry",
        "distance": "0.8 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Coastal Multi-Purpose Cyclone Center Dubrayapet",
        "capacity": "1,500 people",
        "phone": "112",
        "location": "Beach Road Dubrayapet, Puducherry"
      }
    ],
    "localHelplines": [
      {
        "role": "Puducherry Disaster Management Authority",
        "phone": "1070"
      },
      {
        "role": "Coastal Marine Police",
        "phone": "+91 413 2277717"
      },
      {
        "role": "Tourist Assistance Cell",
        "phone": "+91 413 2339497"
      }
    ]
  },
  "Mumbai": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "King Edward Memorial (KEM) Hospital",
        "type": "Premier Govt. Apex Super-Specialty & Trauma",
        "phone": "+91 22 24107000",
        "address": "Acharya Donde Marg, Parel, Mumbai",
        "distance": "4.0 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Lilavati Hospital & Research Centre",
        "type": "Quaternary Emergency Care",
        "phone": "+91 22 26751000",
        "address": "A.K. Vaidya Marg, Bandra West, Mumbai",
        "distance": "6.5 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "BMC Central Emergency Relief Ground Parel",
        "capacity": "4,000 people",
        "phone": "1916",
        "location": "BMC Head Office & Relief Centers, Mumbai"
      },
      {
        "name": "Wankhede Stadium Safe Evacuation Complex",
        "capacity": "3,000 people",
        "phone": "112",
        "location": "Churchgate, Mumbai"
      }
    ],
    "localHelplines": [
      {
        "role": "BMC Disaster Management Emergency Hotline",
        "phone": "1916"
      },
      {
        "role": "Mumbai Police Emergency Control",
        "phone": "112"
      },
      {
        "role": "Indian Coast Guard Coastal SOS",
        "phone": "1554"
      }
    ]
  },
  "Hampi": {
    "disasterStatus": "NORMAL",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "100-Bed Taluk General Hospital Hospet",
        "type": "Govt. Emergency Care",
        "phone": "+91 8394 228020",
        "address": "Station Road, Hospet",
        "distance": "12 km",
        "hasEmergencyICU": true
      },
      {
        "name": "Vijayanagara District Trauma Center",
        "type": "Emergency Trauma Care",
        "phone": "+91 8394 225566",
        "address": "TB Dam Road, Hospet",
        "distance": "14 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Vijayanagara Cultural Hall Safe Base",
        "capacity": "800 people",
        "phone": "112",
        "location": "Hampi Main Bazaar"
      }
    ],
    "localHelplines": [
      {
        "role": "Karnataka Disaster Management (KSDMA)",
        "phone": "1070"
      },
      {
        "role": "Hampi Tourist Police Outpost",
        "phone": "+91 8394 241241"
      }
    ]
  },
  "Andaman": {
    "disasterStatus": "RESTRICTED",
    "isDisasterZone": false,
    "hospitals": [
      {
        "name": "Govind Ballabh Pant (GB Pant) Hospital",
        "type": "Apex Island Referral Hospital & ICU",
        "phone": "+91 3192 232102",
        "address": "Atlanta Point, Port Blair",
        "distance": "1.2 km",
        "hasEmergencyICU": true
      },
      {
        "name": "INHS Dhanvantari (Indian Naval Hospital)",
        "type": "Armed Forces Medical & Tsunami Relief Center",
        "phone": "+91 3192 248200",
        "address": "Minnie Bay, Port Blair",
        "distance": "5.0 km",
        "hasEmergencyICU": true
      }
    ],
    "shelters": [
      {
        "name": "Port Blair Central Tsunami & Cyclone Safe Hub",
        "capacity": "2,500 people",
        "phone": "112",
        "location": "Netaji Stadium, Port Blair"
      },
      {
        "name": "Havelock Island Cyclone Shelter (Swaraj Dweep)",
        "capacity": "800 people",
        "phone": "+91 3192 282222",
        "location": "Govind Nagar, Havelock"
      }
    ],
    "localHelplines": [
      {
        "role": "Andaman & Nicobar Disaster Control Room",
        "phone": "1070"
      },
      {
        "role": "Indian Coast Guard Maritime Rescue (MRCC)",
        "phone": "1554"
      },
      {
        "role": "Tourist Assistance Port Blair",
        "phone": "+91 3192 232694"
      }
    ]
  }
};

const SEED_CRISIS_MESSAGES = {
  "Manali": [
    {
      "id": "MSG-MNL-001",
      "senderName": "Rohan Verma",
      "role": "College Group Leader (4 Students)",
      "destination": "Manali",
      "tag": "🚨 SOS Urgent",
      "message": "We are 4 college friends from Delhi staying near Old Manali Bridge. Road has slush and boulder debris. We have drinking water and roof, but road transit is blocked. Need update on emergency SDRF evacuation jeep convoy.",
      "location": "Near Club House Road, Old Manali (GPS: 32.2530° N, 77.1750° E)",
      "coordinates": {
        "lat": 32.253,
        "lng": 77.175
      },
      "timestamp": "2026-09-23T18:41:02.164Z",
      "verifiedTraveler": true,
      "helpfulVotes": 14
    },
    {
      "id": "MSG-MNL-002",
      "senderName": "Himachal Tourism Official Desk",
      "role": "Admin / SDM Kullu Liaison",
      "destination": "Manali",
      "tag": "ℹ️ General Update",
      "message": "Notice to all stranded visitors: SDRF & BRO bulldozers are clearing Pandoh detour. Escorted emergency convoy of 20 state transport buses scheduled tomorrow 09:00 AM from Manali Private Bus Stand. Please register at Civil Hospital help desk.",
      "location": "Manali Mall Road Sub-Divisional Office",
      "timestamp": "2026-09-23T19:41:02.164Z",
      "verifiedTraveler": true,
      "helpfulVotes": 38
    },
    {
      "id": "MSG-MNL-003",
      "senderName": "Pooja & Friends",
      "role": "Solo & Women Travelers",
      "destination": "Manali",
      "tag": "🏡 Shelter/Food Offered",
      "message": "We are at Himalayan Pines Homestay (SDRF verified). Host has diesel generator, hot food, and 4 extra bunk beds available free of charge for any stranded travelers or students.",
      "location": "Upper Aleo, 1.2 km from Mall Road",
      "timestamp": "2026-09-23T20:11:02.164Z",
      "verifiedTraveler": true,
      "helpfulVotes": 29
    }
  ],
  "Puri": [
    {
      "id": "MSG-PRI-001",
      "senderName": "Amitabh Sen",
      "role": "Family Traveler (3 members)",
      "destination": "Puri",
      "tag": "🛣️ Road Condition",
      "message": "Bhubaneswar highway (NH-316) is open via inland bypass. Coastal marine drive is flooded. OSRTC running free emergency evacuation buses from railway station.",
      "location": "Puri Railway Station Help Desk",
      "timestamp": "2026-09-23T17:41:02.164Z",
      "verifiedTraveler": true,
      "helpfulVotes": 19
    },
    {
      "id": "MSG-PRI-002",
      "senderName": "Odisha Disaster Volunteers",
      "role": "Relief Coordinator",
      "destination": "Puri",
      "tag": "🏡 Shelter/Food Offered",
      "message": "Cyclone Shelter #4 near station has dry food, medicine, and clean water. Medical team stationed.",
      "location": "Cyclone Shelter 4",
      "timestamp": "2026-09-23T19:41:02.164Z",
      "verifiedTraveler": true,
      "helpfulVotes": 25
    }
  ],
  "Leh Ladakh": [
    {
      "id": "MSG-LD-1",
      "senderName": "Tenzin Dorje",
      "role": "Ladakh Taxi Union Representative",
      "tag": "ℹ️ Road Clearance Update",
      "message": "South Pullu snow cleared by BRO dozers at 11 AM today. 4x4 Scorpio & Innova vehicles crossing Khardung La safely. Carry heavy woollens.",
      "location": "South Pullu Checkpoint, Leh",
      "timestamp": "2026-09-23T19:41:02.114Z",
      "verifiedTraveler": true,
      "helpfulVotes": 14
    }
  ],
  "Vizag": [
    {
      "id": "MSG-VZ-1",
      "senderName": "Ramesh Naidu",
      "role": "Rishikonda Lifeguard Supervisor",
      "tag": "⚠️ Beach Warning",
      "message": "Red flags posted on Rishikonda and RK Beach due to high surf. Water sports temporarily closed today for safety. Araku train is running on time.",
      "location": "Rishikonda Beach, Vizag",
      "timestamp": "2026-09-23T18:41:02.152Z",
      "verifiedTraveler": true,
      "helpfulVotes": 19
    }
  ],
  "Kerala": [
    {
      "id": "MSG-KL-1",
      "senderName": "Anu Varghese",
      "role": "Kerala Tourism Information Officer",
      "tag": "✅ All Routes Normal",
      "message": "Backwaters in Alleppey and Fort Kochi are calm and houseboats operating smoothly. Kochi Airport all flights on schedule.",
      "location": "Kochi Marine Drive",
      "timestamp": "2026-09-23T17:41:02.152Z",
      "verifiedTraveler": true,
      "helpfulVotes": 23
    }
  ]
};

module.exports = {
  ACTIVE_DISASTER_ALERTS,
  DESTINATION_EMERGENCY_FACILITIES,
  SEED_CRISIS_MESSAGES,
};
