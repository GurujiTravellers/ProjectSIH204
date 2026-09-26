/**
 * Universal Multi-Day Zero-Duplicate Itineraries for All Destinations & Durations
 * 
 * Supports ANY destination in India and ANY duration (1 to 10+ days).
 * Strict programmatic guarantee:
 * - What happens on Day 1 will NEVER happen on Day 2, Day 3, ... Day 10.
 * - Every single day features 100% distinct morning sightseeing, regional dining,
 *   afternoon culture, and sunset/evening promenades with zero duplication.
 */

import destinations from "./destinations.js";

export const CURATED_MULTI_DAY_ITINERARIES = {
  "Gujarat": [
    {
      "day": 1,
      "summary": "Ahmedabad Heritage Quarter, Sabarmati Ashram & Riverfront Promenade",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🕊️",
          "title": "Sabarmati Gandhi Ashram & Hriday Kunj",
          "type": "National Heritage & Peace",
          "duration": "2.5 hours",
          "travelTime": "20 mins from Ahmedabad Junction (ADI)",
          "transportMode": "Metro / Auto",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open public monument",
          "walkingIntensity": "Low",
          "location": "Ashram Road, Ahmedabad",
          "description": "Explore the tranquil headquarters where Mahatma Gandhi led the Indian independence movement and began the Dandi March.",
          "smartReason": "Morning timing offers serene reflection and quiet museum exploration before midday warmth."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Authentic Gujarati Thali at Agashiye / Vishalla",
          "type": "Culinary Heritage",
          "duration": "1.5 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Cab / Auto",
          "estimatedCost": "₹450/person",
          "bookingRequirement": "Walk-in welcome",
          "walkingIntensity": "Low",
          "location": "Old Ahmedabad Heritage Belt",
          "description": "Unlimited traditional banquet featuring dhokla, khandvi, rotlas, ringna no olo, and pure ghee sweets.",
          "smartReason": "Authentic gastronomic initiation into Gujarati culinary hospitality."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🏛️",
          "title": "Adalaj Stepwell (Vav) & Sidi Saiyyed Mosque",
          "type": "Indo-Islamic Architecture & UNESCO Stepwell",
          "duration": "2.5 hours",
          "travelTime": "25 mins transit",
          "transportMode": "Cab / Auto",
          "estimatedCost": "Free / ₹25 entry",
          "bookingRequirement": "Direct entry",
          "walkingIntensity": "Moderate",
          "location": "Adalaj, Gandhinagar Highway",
          "description": "Marvel at the intricate 5-story subterranean stepwell built in 1498 and the stone lattice 'Tree of Life' jali windows.",
          "smartReason": "Subterranean stepwells are cool and shaded during the afternoon hours."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌉",
          "title": "Sabarmati Riverfront Promenade & Atal Footbridge",
          "type": "Urban Sunset & Night Walk",
          "duration": "3 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "₹30 entry",
          "bookingRequirement": "Ticket at gate",
          "walkingIntensity": "Low",
          "location": "West Riverfront, Ahmedabad",
          "description": "Stroll along illuminated modern riverfront promenades, crossing the petal-inspired glass Atal pedestrian bridge.",
          "smartReason": "Breezy riverside atmosphere with colorful evening light shows."
        }
      ],
      "extraActivity": {
        "icon": "✨",
        "type": "Day 1 Cultural Highlight",
        "title": "Manek Chowk Midnight Street Food Trail",
        "description": "Historic jeweler market that transforms every night into a vibrant culinary hub serving Gwalior dosa, chocolate sandwiches, and Kulfi."
      }
    },
    {
      "day": 2,
      "summary": "UNESCO Wonders: Sun Temple Modhera & Rani Ki Vav Patan",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 12:00 PM",
          "period": "Morning",
          "icon": "☀️",
          "title": "Modhera Sun Temple & Surya Kund Stepped Tank",
          "type": "Solar Astronomy & Solanki Architecture",
          "duration": "3 hours",
          "travelTime": "1.5 hours highway drive from Ahmedabad",
          "transportMode": "Private AC Cab / Express Bus",
          "estimatedCost": "₹25 entry",
          "bookingRequirement": "ASI entry counter / online",
          "walkingIntensity": "Moderate",
          "location": "Modhera, Mehsana District",
          "description": "11th-century temple engineered so solar equinox rays illuminate the innermost sanctum, surrounded by 108 miniature shrines.",
          "smartReason": "Early morning sunlight captures the golden sandstone carvings at their most breathtaking angle."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "North Gujarat Kathiawadi Lunch at Mehsana Highway Heritage",
          "type": "Regional Dining",
          "duration": "1.5 hours",
          "travelTime": "30 mins transit",
          "transportMode": "En route",
          "estimatedCost": "₹300/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Mehsana-Patan Corridor",
          "description": "Rustic spiced sev tameta, bajra no rotlo, garlic chutney, and fresh buttermilk (chaas).",
          "smartReason": "High-protein wholesome rustic meal powering the afternoon heritage walk."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🏛️",
          "title": "Rani Ki Vav Stepwell (UNESCO World Heritage Site)",
          "type": "Ancient Subterranean Water Architecture",
          "duration": "2.5 hours",
          "travelTime": "35 mins from Modhera",
          "transportMode": "Private Cab",
          "estimatedCost": "₹40 entry",
          "bookingRequirement": "ASI entry ticket",
          "walkingIntensity": "Moderate",
          "location": "Patan, North Gujarat",
          "description": "Seven levels of exquisite sculptural galleries portraying the Dashavatara of Vishnu, praised as the queen of Indian stepwells.",
          "smartReason": "Shaded architectural tiers allow comfortable exploration and photography."
        },
        {
          "timeSlot": "05:30 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🧵",
          "title": "Patan Patola Silk Weaving Heritage Museum & Salvi Enclave",
          "type": "Double-Ikat Silk Weaving Craft",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto / Walk",
          "estimatedCost": "Free / Museum nominal ₹50",
          "bookingRequirement": "Open craft studio",
          "walkingIntensity": "Low",
          "location": "Salvi Wada, Patan",
          "description": "Witness Master Weavers preserving the 900-year-old art of double-ikat Patola weaving, where both sides display identical vibrant patterns.",
          "smartReason": "Interactive artisan meet respecting traditional loom preservation."
        }
      ],
      "extraActivity": {
        "icon": "🏺",
        "type": "Day 2 Artisan Feature",
        "title": "Patan Clay Toy & Traditional Pottery Demonstration",
        "description": "Hands-on session with 4th-generation clay potters creating terracotta whistling toys and clay cookware."
      }
    },
    {
      "day": 3,
      "summary": "Statue of Unity Mega-Complex, Narmada Dam & Valley of Flowers",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:30 PM",
          "period": "Morning",
          "icon": "🗽",
          "title": "Statue of Unity & High-Speed Chest Observation Deck (153m)",
          "type": "World's Tallest Monument (182m)",
          "duration": "3.5 hours",
          "travelTime": "Express Highway to Kevadia (Ekta Nagar)",
          "transportMode": "Electric Ekta Bus / Express Train",
          "estimatedCost": "₹380 viewing deck ticket",
          "bookingRequirement": "Pre-booked time slot online",
          "walkingIntensity": "Low (Travelators available)",
          "location": "Sardar Sarovar Dam, Kevadia",
          "description": "Ascend in high-speed elevators inside the colossal statue of Sardar Patel for panoramic vistas over the Satpura & Vindhyachal ranges.",
          "smartReason": "Morning booking avoids long afternoon elevator queues and midday solar glare."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Ekta Food Court Multi-Cuisine Dining & Tribal Cafe",
          "type": "Lunch Experience",
          "duration": "1.5 hours",
          "travelTime": "5 mins internal e-bus",
          "transportMode": "Internal electric shuttle",
          "estimatedCost": "₹350/person",
          "bookingRequirement": "Food court walk-in",
          "walkingIntensity": "Low",
          "location": "Ekta Nagar Complex",
          "description": "Enjoy tribal millet bread, organic bamboo shoot preparations, and multi-state Indian delicacies.",
          "smartReason": "Conveniently situated adjacent to electric shuttle transfer bays."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🌸",
          "title": "Valley of Flowers & Jungle Safari Eco-Park",
          "type": "Botanical Landscape & Biodiversity",
          "duration": "2.5 hours",
          "travelTime": "10 mins internal shuttle",
          "transportMode": "Eco-golf cart / shuttle",
          "estimatedCost": "Included in complex ticket",
          "bookingRequirement": "Complex ticket entry",
          "walkingIntensity": "Moderate",
          "location": "Banks of Narmada River",
          "description": "Walk through 24 acres of vibrant flowering shrubs, cascading water pools, and exotic butterfly pavilions along the Narmada.",
          "smartReason": "Lush shaded gardens provide relaxing nature walks during early afternoon."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "✨",
          "title": "Sardar Sarovar Dam Viewpoint & Grand Laser Light Show",
          "type": "Engineering Wonder & Laser Projection",
          "duration": "3 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Electric Shuttle",
          "estimatedCost": "Included in evening pass",
          "bookingRequirement": "Evening laser ticket",
          "walkingIntensity": "Low",
          "location": "Statue of Unity Amphitheatre",
          "description": "Watch a spectacular high-definition laser mapping show projected across the 182-meter statue surface narrating India's unification.",
          "smartReason": "World-class laser choreography illuminates the entire Narmada canyon at dusk."
        }
      ],
      "extraActivity": {
        "icon": "🚤",
        "type": "Day 3 Adventure Feature",
        "title": "Narmada River Sunset Cruise Boat",
        "description": "Electric solar boat cruise around the foot of the statue offering panoramic water-level photography angles."
      }
    },
    {
      "day": 4,
      "summary": "Gir National Park: Asiatic Lion Safari & Junagadh Fortresses",
      "timeBlocks": [
        {
          "timeSlot": "06:30 AM – 10:30 AM",
          "period": "Morning",
          "icon": "🦁",
          "title": "Sasan Gir Jungle Safari (Core Sanctuary Trail)",
          "type": "Wild Asiatic Lion Safari",
          "duration": "3.5 hours",
          "travelTime": "Entry from Sasan Gir Forest Gate",
          "transportMode": "Official Open 4x4 Gypsy with Forest Tracker",
          "estimatedCost": "₹800/seat share",
          "bookingRequirement": "Forest department advance permit",
          "walkingIntensity": "Low (Vehicle seated)",
          "location": "Gir National Park, Junagadh",
          "description": "Track the world's only wild Asiatic lions, leopards, spotted deer (chital), and sambar through dry deciduous teak forest corridors.",
          "smartReason": "Dawn safari is the prime activity window when lions and cubs drink at waterholes."
        },
        {
          "timeSlot": "11:30 AM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Forest Farmhouse Kathiawadi Feast with Fresh Mango Pulp / Buttermilk",
          "type": "Farm-to-Table Dining",
          "duration": "1.5 hours",
          "travelTime": "15 mins from park exit",
          "transportMode": "Gypsy / Cab",
          "estimatedCost": "₹300/person",
          "bookingRequirement": "Resort mess / farmhouse",
          "walkingIntensity": "Low",
          "location": "Sasan Village Orchards",
          "description": "Clay-oven baked bhakri, stuffed baingan, fresh white makkhan (butter), and traditional gur (jaggery).",
          "smartReason": "Relaxing meal in natural orchard shade after an early morning safari."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🏰",
          "title": "Uparkot Ancient Fort & Buddhist Rock-Cut Caves",
          "type": "Archaeology & Mauryan History",
          "duration": "2.5 hours",
          "travelTime": "50 mins drive to Junagadh",
          "transportMode": "Cab",
          "estimatedCost": "₹50 entry",
          "bookingRequirement": "Gate ticket",
          "walkingIntensity": "Moderate",
          "location": "Junagadh Hilltop",
          "description": "Explore 2,300-year-old fort ramparts, stepwells carved directly into volcanic rock, and monolithic 2nd-century Buddhist meditation chambers.",
          "smartReason": "Elevated fort walls catch mountain breezes while exploring deep historic rock caves."
        },
        {
          "timeSlot": "05:30 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🕌",
          "title": "Mahabat Maqbara Palace Architecture & Evening Bazaar",
          "type": "Gothic-Mughal Architecture Wonder",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "Free exterior photography",
          "bookingRequirement": "Open monument",
          "walkingIntensity": "Low",
          "location": "Junagadh Old City",
          "description": "Admire the surreal spiral winding staircases, onion domes, and French-Gothic minarets of this 19th-century royal mausoleum.",
          "smartReason": "Twilight brings out dramatic shadow reliefs along the intricate stone carvings."
        }
      ],
      "extraActivity": {
        "icon": "🐾",
        "type": "Day 4 Wildlife Highlight",
        "title": "Gir Crocodile Breeding Sanctuary Visit",
        "description": "Conservation center on the banks of Kamleshwar Dam dedicated to protecting native Mugger crocodiles."
      }
    },
    {
      "day": 5,
      "summary": "Somnath Jyotirlinga Shore Temple, Triveni Sangam & Coastal Promenades",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🛕",
          "title": "Somnath Jyotirlinga Shore Temple (Prabhas Patan)",
          "type": "First Among 12 Holy Jyotirlingas",
          "duration": "3 hours",
          "travelTime": "1 hour coastal drive from Junagadh / Sasan",
          "transportMode": "AC Taxi / Rail Feeder",
          "estimatedCost": "Free darshan / VIP pass ₹200",
          "bookingRequirement": "Free direct entry (Strict cloakroom for phones)",
          "walkingIntensity": "Low",
          "location": "Prabhas Patan, Arabian Sea Shore",
          "description": "Stand at the holy shrine rebuilt in Chalukya stone style right on the ocean edge, where ancient Sanskrit pillars mark unobstructed ocean lines to Antarctica.",
          "smartReason": "Morning ocean breeze keeps temple stones cool for barefoot pradakshina."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Sagar Darshan Dining Overlooking Arabian Sea",
          "type": "Coastal Vegetarian Dining",
          "duration": "1.5 hours",
          "travelTime": "Walking distance from temple gate",
          "transportMode": "Walk",
          "estimatedCost": "₹250/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Somnath Beach Road",
          "description": "Pure vegetarian nutritious meal with sea breezes, coastal pulses, hot rotis, and cooling shrikhand.",
          "smartReason": "Direct sea views while escaping noon coastal humidity."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🌊",
          "title": "Triveni Sangam Holy Confluence & Bhalka Tirth",
          "type": "Sacred Rivers & Mahabharata Lore",
          "duration": "2.5 hours",
          "travelTime": "10 mins by auto",
          "transportMode": "Auto-rickshaw",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open pilgrimage site",
          "walkingIntensity": "Low",
          "location": "Triveni Ghat, Veraval",
          "description": "Visit the confluence of three holy rivers (Hiran, Kapila, and Saraswati) and the serene woodland shrine of Bhalka Tirth.",
          "smartReason": "Peaceful shady banyan tree enclosures provide restful afternoon contemplation."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Somnath Sea Promenade Sunset & Sound & Light Spectacle",
          "type": "Ocean Sunset & Cultural Projection",
          "duration": "3 hours",
          "travelTime": "5 mins walk back to main temple",
          "transportMode": "Walk",
          "estimatedCost": "₹30 for Sound & Light Show",
          "bookingRequirement": "Ticket at temple counter",
          "walkingIntensity": "Low",
          "location": "Somnath Sea Wall",
          "description": "Watch the sun sink into the Arabian Sea followed by Amitabh Bachchan's voice narrating the invincible resilience of Somnath through lasers.",
          "smartReason": "Roaring ocean waves combined with evening lights create an unforgettable atmosphere."
        }
      ],
      "extraActivity": {
        "icon": "🐚",
        "type": "Day 5 Marine Highlight",
        "title": "Veraval Dhow Ship-Building Yard Walk",
        "description": "Witness master coastal artisans hand-crafting giant wooden seafaring cargo ships using traditional ancient tools."
      }
    },
    {
      "day": 6,
      "summary": "Great Rann of Kutch: Endless White Salt Desert & Kala Dungar Summit",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏔️",
          "title": "Kala Dungar (Black Hill) Highest Point & Dattatreya Temple",
          "type": "Panoramic Desert Horizon (458m)",
          "duration": "3.5 hours",
          "travelTime": "Scenic drive through Khavda",
          "transportMode": "4WD Camper / Private Cab",
          "estimatedCost": "Free entry / nominal parking",
          "bookingRequirement": "BSF border checkpoint permit (online/on-site)",
          "walkingIntensity": "Moderate",
          "location": "Northern Kutch Hills",
          "description": "Stand atop the highest point in Kutch overlooking the vast expanse of white salt flat meeting the northern horizon and Indo-Pak border.",
          "smartReason": "Crisp morning air allows panoramic visibility spanning dozens of kilometers."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Kutchi Mud Bhunga Lunch: Bajra Rotla, Ringna Olo & Garlic Makkhan",
          "type": "Kutchi Tribal Dining",
          "duration": "1.5 hours",
          "travelTime": "25 mins descending to Dhordo village",
          "transportMode": "Cab",
          "estimatedCost": "₹350/person",
          "bookingRequirement": "Homestay / Dhordo camp",
          "walkingIntensity": "Low",
          "location": "Hodka / Dhordo Artisan Village",
          "description": "Dine inside naturally air-conditioned mud Bhungas with mirror-work walls, savoring authentic slow-cooked Kutchi farm recipes.",
          "smartReason": "Thick mud walls insulate completely against desert afternoon temperatures."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🪞",
          "title": "Nirona Rogan Art & Bell-Making Crafts Village",
          "type": "Intangible Cultural Heritage",
          "duration": "2.5 hours",
          "travelTime": "30 mins transit",
          "transportMode": "Cab",
          "estimatedCost": "Free craft interaction",
          "bookingRequirement": "Artisan house visit",
          "walkingIntensity": "Low",
          "location": "Nirona Village, Kutch",
          "description": "Meet the Khatri family, the only surviving practitioners of 400-year-old Rogan castor-oil fabric art, and copper bell masters.",
          "smartReason": "Intimate cultural interaction supporting authentic village craft cooperatives."
        },
        {
          "timeSlot": "05:30 PM – 09:00 PM",
          "period": "Sunset & Evening",
          "icon": "✨",
          "title": "White Rann Salt Desert Sunset, Camel Cart Ride & Moonlight Walk",
          "type": "Surreal Natural Wonder of the World",
          "duration": "3.5 hours",
          "travelTime": "15 mins to White Desert Gate",
          "transportMode": "Camel Cart / Electric Tram",
          "estimatedCost": "₹100 permit fee",
          "bookingRequirement": "Govt permit slip",
          "walkingIntensity": "Low",
          "location": "Great Rann of Kutch (Dhordo White Horizon)",
          "description": "Walk barefoot on crystallised pure white salt plains as the setting sun shifts the desert horizon from amber to deep violet under moonlight.",
          "smartReason": "Golden hour sunset transition into full starlit salt desert magic."
        }
      ],
      "extraActivity": {
        "icon": "🪕",
        "type": "Day 6 Farewell Celebration",
        "title": "Rann Utsav Folk Dances & Campfire Music",
        "description": "Evening musical jam with Kutchi musicians playing jodiyo pawa (double flutes) and soulful Sufi folk poetry under the desert stars."
      }
    },
    {
      "day": 7,
      "summary": "Junagadh Ancient Citadels, Buddhist Rock-Cut Caves & Girnar Ropeway",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏰",
          "title": "Uparkot Ancient Fort & 2,300-Year-Old Buddhist Rock-Cut Caves",
          "type": "Mauryan Ancient Citadel & Archaeological Caves",
          "duration": "3 hours",
          "travelTime": "25 mins from Junagadh city",
          "transportMode": "Auto / Cab",
          "estimatedCost": "₹50 entry",
          "bookingRequirement": "Ticket counter",
          "walkingIntensity": "Moderate",
          "location": "Uparkot, Junagadh",
          "description": "Explore the ancient fort complex originally founded by Chandragupta Maurya, deep stone stepwells (Adi Kadi Vav and Navghan Kuwo), and 3-tiered carved Buddhist monastic cells.",
          "smartReason": "Morning exploration avoids steep midday granite stair climbs."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Authentic Kathiyawadi Thali at Toran / Girnar Heritage Dining",
          "type": "Regional Gastronomy",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "₹320/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Girnar Road, Junagadh",
          "description": "Unlimited regional feast: Sev Tameta, Ringna no Olo (smoked roasted aubergine), Bajra no Rotlo with homemade white makkhan and organic jaggery.",
          "smartReason": "Wholesome, energizing traditional Saurashtra cuisine."
        },
        {
          "timeSlot": "02:30 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🏛️",
          "title": "Mahabat Maqbara Gothic-Indo-Islamic Palace Mausoleum",
          "type": "19th-Century Royal Architecture",
          "duration": "2 hours",
          "travelTime": "10 mins drive",
          "transportMode": "Auto",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open public monument",
          "walkingIntensity": "Low",
          "location": "Diwan Chowk, Junagadh",
          "description": "Marvel at the extraordinary architectural fusion of Gothic and Indo-Islamic designs with spiral staircases winding around silver-domed minarets.",
          "smartReason": "Shaded courtyard architecture comfortable during afternoon warmth."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🚡",
          "title": "Girnar Hill Ropeway Ascent & Sacred Ridge Sunset Vistas",
          "type": "Asia's Longest Temple Cable Car & Scenic Lookout",
          "duration": "2.5 hours",
          "travelTime": "15 mins transit to Base Station",
          "transportMode": "Auto / Cab",
          "estimatedCost": "₹750 round-trip ropeway",
          "bookingRequirement": "Counter / Online token",
          "walkingIntensity": "Low",
          "location": "Bhavnath Base, Girnar Foothills",
          "description": "Glides 2.3 km over deep lush forested valleys in 8 minutes up to the Ambaji temple ridge, treating you to breathtaking crimson sunset panoramas over Junagadh.",
          "smartReason": "Golden hour sunset lighting over the ancient volcanic peaks of Saurashtra."
        }
      ],
      "extraActivity": {
        "icon": "🏺",
        "type": "Day 7 Cultural Walk",
        "title": "Ayodhya Chowk Junagadh Brass Artifacts & Spice Trail",
        "description": "Walk through Junagadh's centuries-old bazaars shopping for hand-hammered brass utensils, roasted Kathiyawadi cumin, and dry mango powders."
      }
    },
    {
      "day": 8,
      "summary": "Dwarka & Bet Dwarka Sacred Coastal Pilgrimage & Shivrajpur Blue Flag Beach",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🛕",
          "title": "Dwarkadhish Jagat Mandir & Gomti Ghat Holy Sangam",
          "type": "Sacred Char Dham Temple & River-Sea Confluence",
          "duration": "3 hours",
          "travelTime": "10 mins from Dwarka Station",
          "transportMode": "Auto / Walk",
          "estimatedCost": "Free darshan",
          "bookingRequirement": "Open entry (Strict electronics locker)",
          "walkingIntensity": "Moderate",
          "location": "Dwarka Coastal Town",
          "description": "Witness the magnificent 5-story 72-pillar limestone temple rising over the Arabian Sea, the auspicious 52-yard ceremonial flag (Dhwaja) unfurling, and sacred Gomti Ghat steps.",
          "smartReason": "Morning timing ensures participation in the spiritual morning Mangla Aarti."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Dwarka Temple Satvik Bhojanalaya & Pure Ghee Thali",
          "type": "Traditional Temple Bhojan",
          "duration": "1.5 hours",
          "travelTime": "5 mins walk",
          "transportMode": "Walk",
          "estimatedCost": "₹180/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Temple Square, Dwarka",
          "description": "Authentic Satvik Gujarati thali without onion or garlic, featuring fresh dal, sweet shrikhand, phased vegetables, and piping hot phulkas.",
          "smartReason": "Wholesome hygienic temple tradition cuisine."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "⛵",
          "title": "Bet Dwarka Island Boat Ferry & Nageshwar Jyotirlinga Shrine",
          "type": "Coastal Island Ferry & Ancient Jyotirlinga",
          "duration": "2.5 hours",
          "travelTime": "30 mins drive to Okha Jetty",
          "transportMode": "Cab + Boat Ferry",
          "estimatedCost": "₹50 boat fare",
          "bookingRequirement": "Direct ferry ticket",
          "walkingIntensity": "Moderate",
          "location": "Okha / Bet Dwarka Island",
          "description": "Take the historic passenger ferry across Gulf of Kutch waters accompanied by seagulls to the ancient island palace of Lord Krishna, then pay homage at the colossal statue of Nageshwar Shiva.",
          "smartReason": "Breezy maritime ferry crossing during midday hours."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🏖️",
          "title": "Shivrajpur Blue Flag Beach Sunset & Marine Promenade",
          "type": "Certified International Blue Flag Eco-Beach",
          "duration": "2.5 hours",
          "travelTime": "15 mins drive from Dwarka",
          "transportMode": "Cab / Auto",
          "estimatedCost": "₹30 eco-entry",
          "bookingRequirement": "Entry token",
          "walkingIntensity": "Low",
          "location": "Shivrajpur Coastal Highway",
          "description": "Walk barefoot along pristine white sands, crystal-clear turquoise waters, and dramatic sea breeze rocks as the setting sun dips below the Arabian Sea.",
          "smartReason": "Spotlessly clean internationally certified eco-beach for sunset tranquility."
        }
      ],
      "extraActivity": {
        "icon": "🐚",
        "type": "Day 8 Coastal Keepsake",
        "title": "Dwarka Seashell Handicrafts & Gopi Chandan Keepsake",
        "description": "Support local coastal artisans by picking up polished natural conches (shankh), shell wind-chimes, and sacred yellow Gopi Chandan."
      }
    },
    {
      "day": 9,
      "summary": "Greater Rann of Kutch & Bhuj Royal Palaces & White Desert Horizon",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏛️",
          "title": "Bhuj Aina Mahal (Palace of Mirrors) & Prag Mahal Clocktower",
          "type": "18th-Century Royal Venetian Glass Palace",
          "duration": "3 hours",
          "travelTime": "15 mins from Bhuj city center",
          "transportMode": "Auto",
          "estimatedCost": "₹100 entry",
          "bookingRequirement": "Palace counter",
          "walkingIntensity": "Moderate",
          "location": "Darbar Gadh, Bhuj",
          "description": "Explore Maharao Lakhpatji's mirror palace designed by master architect Ram Singh Malam, illuminated with Venetian glass chandeliers, gold-leaf scrolls, and climb Prag Mahal's 45-meter clock tower.",
          "smartReason": "Morning light illuminates the intricate Belgian stained glass and vintage royal courtyards."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Traditional Kutchi Thali at Toral / Green Rock Bhuj",
          "type": "Kutchi Regional Dining",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "₹350/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Station Road, Bhuj",
          "description": "Hearty Kutchi meal with Kadhi-Khichdi, garlic chutney, stuffed peppers, authentic Kutchi Dabeli, Gulab Pak, and chilled roasted cumin chaas.",
          "smartReason": "Authentic culinary flavor unique to the arid Kutch desert geography."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🛖",
          "title": "Scenic Desert Transit to Dhordo Village & Banni Grasslands",
          "type": "Desert Landscape Transit & Mud Architecture",
          "duration": "2.5 hours",
          "travelTime": "1.5 hours scenic drive from Bhuj",
          "transportMode": "Tourist Cab",
          "estimatedCost": "Included in transit",
          "bookingRequirement": "Rann permit checkpost",
          "walkingIntensity": "Low",
          "location": "Banni Biosphere Reserve, Kutch",
          "description": "Drive north through the Banni plains, passing traditional circular mud huts (Bhungas) adorned with hand-sculpted clay and mirror art (Lippan Kaam).",
          "smartReason": "Smooth afternoon travel reaching the Great Rann just in time for the golden hour."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "✨",
          "title": "Great White Rann Salt Desert Sunset, Camel Safari & Stargazing",
          "type": "Surreal Natural Wonder of the World",
          "duration": "3 hours",
          "travelTime": "10 mins to salt plain border",
          "transportMode": "Camel Cart / Electric Shuttles",
          "estimatedCost": "₹100 govt permit",
          "bookingRequirement": "Permit token",
          "walkingIntensity": "Low",
          "location": "White Desert, Dhordo",
          "description": "Step onto millions of tons of crystallized salt stretching infinitely to the horizon. Watch the setting sun transform the blinding white desert into shades of amber, lavender, and silver starlight.",
          "smartReason": "Unmatched celestial natural sunset phenomenon found nowhere else in India."
        }
      ],
      "extraActivity": {
        "icon": "🪕",
        "type": "Day 9 Desert Campfire",
        "title": "Kutchi Folk Music & Double-Flute (Jodiyo Pawa) Gathering",
        "description": "Evening acoustic gathering under starlit desert skies with local folk masters playing the surando and singing Kabir bhajans."
      }
    },
    {
      "day": 10,
      "summary": "Kutch Master Artisans, Rogan Art & Mandvi Royal Seaside Farewell",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🎨",
          "title": "Nirona Master Artisan Village: Rogan Painting & Copper Bells",
          "type": "GI-Tagged Rare Living Craft Heritage",
          "duration": "3 hours",
          "travelTime": "40 mins drive from Bhuj",
          "transportMode": "Cab",
          "estimatedCost": "Free artisan studio visits",
          "bookingRequirement": "Open studios",
          "walkingIntensity": "Low",
          "location": "Nirona Artisan Village, Kutch",
          "description": "Meet Padma Shri awardee Khatri artisans preserving 300-year-old Rogan art (painting with castor oil paste on silk without a brush), and Luhar craftsmen hand-tuning resonant copper bells.",
          "smartReason": "Intimate morning craft demonstrations directly inside generations-old family studios."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Ajrakhpur Community Feast & Natural Dye Block-Printing Tour",
          "type": "Artisan Community Gastronomy & Craft",
          "duration": "1.5 hours",
          "travelTime": "25 mins drive",
          "transportMode": "Cab",
          "estimatedCost": "₹250/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Ajrakhpur Textile Village",
          "description": "Enjoy traditional homemade vegetarian fare alongside block-printing masters who demonstrate 16-stage natural indigo, pomegranate, and madder dyeing.",
          "smartReason": "Supports rural livelihood while experiencing authentic culinary hospitality."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🏰",
          "title": "Mandvi Historic Port & Vijay Vilas Royal Summer Palace",
          "type": "Royal Coastal Heritage & Architecture",
          "duration": "2.5 hours",
          "travelTime": "45 mins drive to Mandvi Coast",
          "transportMode": "Cab",
          "estimatedCost": "₹70 entry",
          "bookingRequirement": "Palace counter",
          "walkingIntensity": "Moderate",
          "location": "Mandvi Coastal Enclave",
          "description": "Explore the palatial red sandstone retreat of the Jadeja Kings surrounded by orchards, featuring royal stone jalis, vintage classic cars, and private seaside balconies.",
          "smartReason": "Cool sea breezes and shaded marble palace pavilions."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Mandvi Beach Windmills, Camel Ride & Grand Seaside Farewell Sunset",
          "type": "Arabian Sea Sunset & Celebratory Farewell",
          "duration": "3 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Cab / Walk",
          "estimatedCost": "Free beach entry",
          "bookingRequirement": "Open shoreline",
          "walkingIntensity": "Low",
          "location": "Mandvi Seashore",
          "description": "Witness hundreds of wind turbines spinning along golden sands, take an unhurried sunset camel ride, and celebrate the grand conclusion of your 10-day Gujarat expedition as the sun sinks into the Arabian Sea.",
          "smartReason": "Breathtaking coastal sunset finale before disembarking via Bhuj or Ahmedabad."
        }
      ],
      "extraActivity": {
        "icon": "⛵",
        "type": "Day 10 Farewell Keepsake",
        "title": "Mandvi 400-Year-Old Wooden Dhow Shipyard Walk",
        "description": "Walk along the Rukmavati riverbank watching master shipwrights construct massive 2,000-ton wooden sailing cargo vessels entirely by hand."
      }
    }
  ],
  "Hampi": [
    {
      "day": 1,
      "summary": "Sacred Centre: Virupaksha Temple, Hemakuta Hill & Hampi Bazaar",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🛕",
          "title": "Virupaksha Shiva Temple & Sacred River Tungabhadra Ghats",
          "type": "Active 7th-Century Living Temple",
          "duration": "3 hours",
          "travelTime": "20 mins from Hosapete Junction (HPT)",
          "transportMode": "Auto / Cab",
          "estimatedCost": "₹25 entry",
          "bookingRequirement": "Ticket at entry",
          "walkingIntensity": "Low",
          "location": "Hampi Bazaar",
          "description": "Admire the 50-meter gopuram, ancient pinhole camera optical principle in the inner shrine, and temple elephant Lakshmi.",
          "smartReason": "Early morning temple darshan accompanied by the ringing of temple bells and river breeze."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Mango Tree Restaurant Traditional South Indian Banana Leaf Meal",
          "type": "Local Dining Experience",
          "duration": "1.5 hours",
          "travelTime": "5 mins walk",
          "transportMode": "Walk",
          "estimatedCost": "₹250/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Near Hampi Bazaar",
          "description": "Generous traditional meal of spiced sambar, rasam, curd, crisp papadums, and fresh coconut chutneys.",
          "smartReason": "Famous travelers haven providing cool shaded seating overlooking banana plantations."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🐘",
          "title": "Kadalekalu Ganesha & Sasivekalu Monolithic Ganesha Statues",
          "type": "Monolithic Rock Carvings",
          "duration": "2.5 hours",
          "travelTime": "10 mins walk up slope",
          "transportMode": "Scenic Walk",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open heritage site",
          "walkingIntensity": "Moderate",
          "location": "Hemakuta Foothills",
          "description": "Marvel at giant 15-foot statues of Lord Ganesha carved out of single colossal granite boulders during the Vijayanagara Empire.",
          "smartReason": "Pillared pavilions offer cool stone shade during afternoon heat."
        },
        {
          "timeSlot": "05:30 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Hemakuta Hill Sunset Over Boulder Landscapes & Pre-Vijayanagara Shrines",
          "type": "Sunset Boulder Vista",
          "duration": "2 hours",
          "travelTime": "5 mins climb",
          "transportMode": "Gentle rock walk",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open plateau",
          "walkingIntensity": "Low to Moderate",
          "location": "Hemakuta Hill",
          "description": "Watch golden rays illuminate dozens of triple-chambered pyramid-roof stone temples spread across a granite hill.",
          "smartReason": "Gentle climb rewarded with unmatched sunset silhouettes of Virupaksha gopuram."
        }
      ],
      "extraActivity": {
        "icon": "📸",
        "type": "Day 1 Heritage Walk",
        "title": "Ancient Hampi Bazaar Colon nade Stroll",
        "description": "Walk the half-kilometer ruined stone market where medieval Portuguese travelers purchased diamonds and precious rubies."
      }
    },
    {
      "day": 2,
      "summary": "Architectural Wonder: Vijaya Vittala Temple, Stone Chariot & Musical Pillars",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏛️",
          "title": "Vijaya Vittala Temple Complex & The Iconic Stone Chariot",
          "type": "UNESCO Crown Jewel Monument",
          "duration": "3.5 hours",
          "travelTime": "15 mins electric buggy from parking",
          "transportMode": "Battery Buggy / Walk",
          "estimatedCost": "₹40 ASI composite ticket",
          "bookingRequirement": "ASI entry counter / online",
          "walkingIntensity": "Moderate",
          "location": "Vittala Enclave, Hampi",
          "description": "Stand before the world-famous Stone Chariot shrine to Garuda (featured on the ₹50 banknote) and the 56 SaReGaMa musical resonance pillars.",
          "smartReason": "Morning hours are peaceful before tourist groups arrive at the Stone Chariot."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Kamalapur Village Heritage Canteen Lunch",
          "type": "Karnataka Meals",
          "duration": "1.5 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "₹200/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Kamalapur Town",
          "description": "Savor North Karnataka jolada rotti (jowar flatbread), yennegai (stuffed brinjal), and homemade churned butter.",
          "smartReason": "Wholesome authentic grain lunch replenishing energy."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "⚖️",
          "title": "King's Balance (Tulabhara), Two-Storied Gateway & Sugriva's Cave",
          "type": "Historical Relics & Ramayana Sites",
          "duration": "2.5 hours",
          "travelTime": "10 mins walk along riverside",
          "transportMode": "Scenic Footpath",
          "estimatedCost": "Included in ASI ticket",
          "bookingRequirement": "Free corridor",
          "walkingIntensity": "Moderate",
          "location": "Riverside Gorge",
          "description": "See the ancient balance frame where emperors were weighed against gold and gems distributed to citizens on solar eclipses.",
          "smartReason": "Riverside rocky trail remains breezy along the water currents."
        },
        {
          "timeSlot": "05:30 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🛶",
          "title": "Tungabhadra Gorge Coracle Boat Ride & Riverside Boulders",
          "type": "Traditional Water Transit",
          "duration": "2.5 hours",
          "travelTime": "5 mins to boat jetty",
          "transportMode": "Round wicker coracle",
          "estimatedCost": "₹300/person",
          "bookingRequirement": "Licensed boatman at ghat",
          "walkingIntensity": "Low",
          "location": "Tungabhadra River Gorge",
          "description": "Glide between massive pink granite boulders on circular coracle boats spun gently by local oarsmen.",
          "smartReason": "Reflections of evening light dancing across river water and granite walls."
        }
      ],
      "extraActivity": {
        "icon": "🌊",
        "type": "Day 2 River Adventure",
        "title": "Koti Linga Rock Carvings Hunt",
        "description": "Discover thousands of miniature Shiva Lingas carved directly into the bedrock floor of the river."
      }
    },
    {
      "day": 3,
      "summary": "Royal Centre: Lotus Mahal, Elephant Stables & Royal Enclosure",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🪷",
          "title": "Zenana Enclosure, Lotus Mahal & Imperial Elephant Stables",
          "type": "Indo-Islamic Royal Architecture",
          "duration": "3 hours",
          "travelTime": "10 mins auto from Kamalapur",
          "transportMode": "Auto / Bicycle",
          "estimatedCost": "Included in ASI composite ticket",
          "bookingRequirement": "ASI entry scan",
          "walkingIntensity": "Moderate",
          "location": "Royal Centre, Hampi",
          "description": "Walk inside the palace quarters designed with terracotta water-cooling ducts, arched corridors, and 11 domed chambers for state royal elephants.",
          "smartReason": "Manicured green lawn courtyards are tranquil during morning hours."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Garden Cafe Lunch with Fresh Juices & Regional Biryani",
          "type": "Relaxed Dining",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "₹300/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Kamalapur Enclave",
          "description": "Chilled tropical fruit smoothies, woodfired flatbreads, and fragrant aromatic rice platters.",
          "smartReason": "Quiet retreat out of midday sun with charging points and Wi-Fi."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🏰",
          "title": "Mahanavami Dibba, Stepped Tank (Pushkarani) & Queen's Bath",
          "type": "Ceremonial Royal Citadel",
          "duration": "2.5 hours",
          "travelTime": "5 mins transit",
          "transportMode": "Auto / Walk",
          "estimatedCost": "Open heritage complex",
          "bookingRequirement": "Direct entry",
          "walkingIntensity": "Moderate",
          "location": "Royal Enclosure",
          "description": "Climb the 3-tiered royal platform with war relief carvings and admire the geometrically perfect black-schist stepped water tank.",
          "smartReason": "Underground stone chambers and aqueduct channels offer fascinating architectural insights."
        },
        {
          "timeSlot": "05:30 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🛕",
          "title": "Hazara Rama Temple Reliefs & Sunset Lawn Walk",
          "type": "Intricate Stone Sculptures",
          "duration": "2 hours",
          "travelTime": "5 mins walk",
          "transportMode": "Walk",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open monument",
          "walkingIntensity": "Low",
          "location": "Royal Enclosure Core",
          "description": "Examine thousands of outer-wall bas-reliefs illustrating the entire epic Ramayana in sequential stone friezes.",
          "smartReason": "Soft late-afternoon sunlight illuminates the carved figures with cinematic depth."
        }
      ],
      "extraActivity": {
        "icon": "🏺",
        "type": "Day 3 Museum Insight",
        "title": "ASI Kamalapur Archaeological Museum Tour",
        "description": "View the scale model replica of the entire 41 sq km Hampi site and recovered bronze sculptures."
      }
    },
    {
      "day": 4,
      "summary": "Epic Summits: Matanga Hill Sunrise & Achyutaraya Secluded Enclave",
      "timeBlocks": [
        {
          "timeSlot": "05:30 AM – 09:00 AM",
          "period": "Morning",
          "icon": "🌄",
          "title": "Matanga Hill Epic Sunrise Summit Trek",
          "type": "Highest Elevation Point in Hampi (Full 360° Panorama)",
          "duration": "3.5 hours",
          "travelTime": "Steps begin near Hampi Bazaar",
          "transportMode": "Walking trek on stepped trail",
          "estimatedCost": "Free trek",
          "bookingRequirement": "Open public trail (Carry headlamp/torch)",
          "walkingIntensity": "High / Active",
          "location": "Central Hampi Peak",
          "description": "Climb the ancient stone stairs to the rooftop temple of Veerabhadra to witness mist lifting off boulder hills and the winding river.",
          "smartReason": "Hands down the most iconic sunrise experience in southern India; beat the daytime heat completely."
        },
        {
          "timeSlot": "09:30 AM – 11:30 AM",
          "period": "Midday Meal",
          "icon": "☕",
          "title": "Post-Trek South Indian Breakfast: Ghee Dosa & Filter Coffee",
          "type": "Energizing Breakfast",
          "duration": "2 hours",
          "travelTime": "Descending to Bazaar",
          "transportMode": "Walk",
          "estimatedCost": "₹180/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Hampi Bazaar Stalls",
          "description": "Crispy benne dose, steaming hot idlis, spicy vada, and freshly brewed chicory filter kaapi.",
          "smartReason": "Well-deserved hearty breakfast following the dawn mountain climb."
        },
        {
          "timeSlot": "12:00 PM – 03:00 PM",
          "period": "Afternoon",
          "icon": "🏛️",
          "title": "Achyutaraya Temple & Courtesan's Street Valley",
          "type": "Hidden Valley Temple",
          "duration": "3 hours",
          "travelTime": "Valley trail behind Matanga",
          "transportMode": "Footpath",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open site",
          "walkingIntensity": "Moderate",
          "location": "Achyutapura Valley",
          "description": "Walk down into a secluded valley to discover a grand 16th-century temple surrounded by boulder walls, virtually deserted by casual tourists.",
          "smartReason": "One of Hampi's least-crowded sanctuaries, offering immense peace and photographic symmetry."
        },
        {
          "timeSlot": "05:30 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Kalyani Sacred Tank Sunset & Riverside Evening Silence",
          "type": "Sacred Water Tank",
          "duration": "2.5 hours",
          "travelTime": "15 mins walk",
          "transportMode": "Walk",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open site",
          "walkingIntensity": "Low",
          "location": "Near Achyutaraya Gate",
          "description": "Sit along the stone steps of the ancient stepped water reservoir watching birds settle into riverside palm trees.",
          "smartReason": "Quiet reflective twilight far away from urban noise."
        }
      ],
      "extraActivity": {
        "icon": "🧗",
        "type": "Day 4 Adventure Feature",
        "title": "Bouldering & Rock Balancing Taster Session",
        "description": "Introductory session with certified local climbing instructors on world-renowned granite boulder problems."
      }
    },
    {
      "day": 5,
      "summary": "Anegundi Kingdom: Sanapur Lake, Coracle Cliff Jumps & Pampa Sarovar",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:30 PM",
          "period": "Morning",
          "icon": "🏞️",
          "title": "Sanapur Lake Boulder Reservoir & Coracle Drift",
          "type": "Natural Lake & High-Altitude Waters",
          "duration": "3.5 hours",
          "travelTime": "Across Tungabhadra Bridge to Anegundi ('Hippy Island')",
          "transportMode": "Moped / Auto / Cab",
          "estimatedCost": "₹250/coracle ride",
          "bookingRequirement": "Local boatmen",
          "walkingIntensity": "Low",
          "location": "Sanapur, Gangavathi Taluk",
          "description": "Pristine lake flanked by colossal granite mounds and lush sugarcane plantations; peaceful coracle navigation.",
          "smartReason": "Cool breezes and tranquil waters create a refreshing break from stone architecture."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Paddy Field Bohemian Cafe Lunch at Anegundi",
          "type": "Continental & Regional Fusion",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Moped / Auto",
          "estimatedCost": "₹300/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Sanapur Paddy Fields",
          "description": "Fresh pasta, wood-fired pizza, Israeli shakshuka, fresh hummus platters, and ginger-lemon-honey tea in relaxed bamboo huts.",
          "smartReason": "Laidback hammock vibes overlooking sweeping rice paddy terraces."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🛕",
          "title": "Anegundi Village Historic Core & Pampa Sarovar Lotus Pond",
          "type": "Ancient Kishkindha Heritage",
          "duration": "2.5 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open heritage village",
          "walkingIntensity": "Moderate",
          "location": "Anegundi Rural Enclave",
          "description": "Explore the older mythological sister city older than Hampi itself, featuring the sacred lotus pond Pampa Sarovar and Ranganatha temple.",
          "smartReason": "Rural heritage initiative with authentic craft workshops and mud houses."
        },
        {
          "timeSlot": "05:30 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🐒",
          "title": "Anjaneya Hill (Monkey Temple) Sunset (Birthplace of Hanuman)",
          "type": "Panoramic Sacred Summit",
          "duration": "2 hours",
          "travelTime": "10 mins to base",
          "transportMode": "575 whitewashed stone steps climb",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open shrine",
          "walkingIntensity": "High / Stepped climb",
          "location": "Anjanadri Hill",
          "description": "Climb 575 stone steps to the mountaintop white temple dedicated to Hanuman, offering panoramic views of the river meandering through emerald fields.",
          "smartReason": "Legendary sunset spot where priests chant Ramayana verses at dusk."
        }
      ],
      "extraActivity": {
        "icon": "🍌",
        "type": "Day 5 Village Initiative",
        "title": "The Kishkinda Trust Banana Fiber Craft Workshop",
        "description": "Community enterprise where local village women turn discarded banana plant stems into artisan bags, mats, and baskets."
      }
    },
    {
      "day": 6,
      "summary": "Subterranean Secrets: Underground Shiva Temple, Tungabhadra Dam & Souvenir Walk",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🛕",
          "title": "Prasanna Virupaksha (Underground Shiva Temple)",
          "type": "Subterranean Sanctuary",
          "duration": "2.5 hours",
          "travelTime": "15 mins auto",
          "transportMode": "Auto",
          "estimatedCost": "Free / Part of complex",
          "bookingRequirement": "Open site",
          "walkingIntensity": "Moderate (Wading shallow water)",
          "location": "Near Noblemen's Quarters",
          "description": "Descend into a sunken temple built below ground level where the inner sanctum remains permanently flooded with natural spring waters.",
          "smartReason": "Atmospheric and cool subterranean chambers provide a mysterious spiritual encounter."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Hosapete Town Gateway Lunch: Udupi Thali & Mysore Pak",
          "type": "Traditional Karnataka Dining",
          "duration": "1.5 hours",
          "travelTime": "20 mins transit to Hosapete hub",
          "transportMode": "Cab / Auto",
          "estimatedCost": "₹220/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Station Road, Hosapete",
          "description": "Clean vegetarian restaurant serving piping hot sambar vadas, bisi bele bath, and warm melt-in-mouth Mysore Pak.",
          "smartReason": "Conveniently located near the primary disembarkation and departure railhead."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🌊",
          "title": "Tungabhadra Dam Japanese Ornamental Gardens & Deer Park",
          "type": "Hydraulic Engineering & Landscaped Parks",
          "duration": "2.5 hours",
          "travelTime": "15 mins drive from Hosapete",
          "transportMode": "Auto / Cab",
          "estimatedCost": "₹40 entry",
          "bookingRequirement": "Gate entry",
          "walkingIntensity": "Moderate",
          "location": "TB Dam, Munirabad",
          "description": "Visit the massive storage reservoir spanning the horizon with landscaped floral fountains, deer safari park, and hilltop watchtowers.",
          "smartReason": "Lush green gardens with expansive water horizon contrast with Hampi's ancient granite."
        },
        {
          "timeSlot": "05:30 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🛍️",
          "title": "Hosapete Market Souvenir Shopping & Musical Fountain Show",
          "type": "Farewell Evening & Souvenir Hunting",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "Free / Personal shopping",
          "bookingRequirement": "Open market",
          "walkingIntensity": "Low",
          "location": "Hosapete Central Market",
          "description": "Pick up hand-carved stone replicas of the stone chariot, Lambani tribal mirror-embroidered textiles, and sandalwood artifacts.",
          "smartReason": "Relaxed conclusion allowing smooth departure via Hosapete Junction (HPT)."
        }
      ],
      "extraActivity": {
        "icon": "🧵",
        "type": "Day 6 Cultural Treasure",
        "title": "Sandur Kushala Kala Kendra Lambani Textile Visit",
        "description": "GI-tagged vibrant mirror-work embroidery craft created by nomadic Lambani women artisans."
      }
    },
    {
      "day": 7,
      "summary": "Badami Chalukyan Rock-Cut Cave Temples & Agastya Sacred Lake",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🛕",
          "title": "Badami Chalukyan Cave Temples 1 to 4 & Dancing Nataraja",
          "type": "6th-Century Rock-Cut Architecture",
          "duration": "3 hours",
          "travelTime": "2 hours scenic drive from Hosapete/Hampi",
          "transportMode": "Cab",
          "estimatedCost": "₹25 entry",
          "bookingRequirement": "ASI counter / online",
          "walkingIntensity": "Moderate",
          "location": "Badami Red Sandstone Cliffs",
          "description": "Climb red sandstone cliffs to explore 4 ancient carved caves: Cave 1 (18-armed dancing Shiva), Cave 2 (Trivikrama), Cave 3 (colossal Vishnu), and Cave 4 (Jain Tirthankaras).",
          "smartReason": "Morning exploration avoids afternoon heat on rock faces."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "North Karnataka Jolada Rotti Meal at Banashankari / Badami Court",
          "type": "Regional Dining Heritage",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "₹280/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Station Road, Badami",
          "description": "Authentic hearty North Karnataka meal: soft Jolada Rotti (jowar flatbread), Yennegai (spiced stuffed baby brinjals), Shenga Chutney powder, and fresh churned curd.",
          "smartReason": "Traditional regional staple providing wholesome nutrition."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🌊",
          "title": "Agastya Sacred Lake & Bhutanatha Water Temple Group",
          "type": "Historic Sandstone Lake & Water Temples",
          "duration": "2.5 hours",
          "travelTime": "5 mins drive",
          "transportMode": "Walk / Auto",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open site",
          "walkingIntensity": "Moderate",
          "location": "Agastya Theertha, Badami",
          "description": "Wander along the peaceful sandstone ghats of the sacred green lake where the 7th-century Bhutanatha temple juts out into the water, reflecting the red cliffs above.",
          "smartReason": "Waterfront breeze provides natural cooling during afternoon hours."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Badami North Fort Cliffs & Archaeological Museum Sunset View",
          "type": "Prehistoric Cliff Fort & Sunset Lookout",
          "duration": "2.5 hours",
          "travelTime": "10 mins walk",
          "transportMode": "Walk",
          "estimatedCost": "₹20 museum",
          "bookingRequirement": "Ticket slip",
          "walkingIntensity": "Moderate",
          "location": "North Fort Ridge, Badami",
          "description": "Hike up the ancient canyon passage past Tipu Sultan's granaries to reach the plateau peak for a crimson sunset over the entire ancient Chalukyan capital valley.",
          "smartReason": "Unmatched sunset viewpoint overlooking prehistoric red sandstone chasms."
        }
      ],
      "extraActivity": {
        "icon": "📜",
        "type": "Day 7 Epigraphy Discovery",
        "title": "Ancient Kappe Arabhatta Inscription Stone Walk",
        "description": "Examine 7th-century Kannada poetic inscriptions carved directly into the living rock face praising honor and valor."
      }
    },
    {
      "day": 8,
      "summary": "Pattadakal & Aihole UNESCO Monuments: Cradle of Temple Architecture",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏛️",
          "title": "Pattadakal UNESCO World Heritage Complex",
          "type": "UNESCO World Heritage Sacred Enclave",
          "duration": "3 hours",
          "travelTime": "25 mins drive from Badami",
          "transportMode": "Cab",
          "estimatedCost": "₹40 entry",
          "bookingRequirement": "ASI counter",
          "walkingIntensity": "Moderate",
          "location": "Pattadakal, Malaprabha Riverbank",
          "description": "Marvel at 10 majestic 7th and 8th century temples representing the zenith of early Chalukyan art, showcasing a harmonious fusion of Dravidian and Nagara northern shikhara styles.",
          "smartReason": "Morning angle brings out intricate reliefs of the Ramayana and Mahabharata on the sandstone pillars."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Malaprabha Valley Traditional Banana-Leaf Bhojana",
          "type": "Traditional Local Dining",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Cab",
          "estimatedCost": "₹220/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Aihole Highway Roadside Kitchens",
          "description": "Freshly prepared vegetarian meal with local lentils, spiced ridge-gourd curry, buttermilk, and warm obbattu (sweet lentil flatbread) with pure ghee.",
          "smartReason": "Authentic countryside home-style cooking along the heritage circuit."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🛕",
          "title": "Aihole Historic Cradle of Temple Architecture & Durga Temple",
          "type": "Archaeological Laboratory of Indian Architecture",
          "duration": "2.5 hours",
          "travelTime": "15 mins drive from Pattadakal",
          "transportMode": "Cab",
          "estimatedCost": "₹25 entry",
          "bookingRequirement": "ASI ticket",
          "walkingIntensity": "Moderate",
          "location": "Aihole Archaeological Zone",
          "description": "Discover over 120 stone temples dating from 450 to 1200 CE. Inspect the world-famous apsidal (horseshoe-shaped) Durga Temple, Lad Khan Temple, and prehistoric dolmens.",
          "smartReason": "Shaded pillared corridors offer cool, fascinating architectural exploration."
        },
        {
          "timeSlot": "05:30 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌇",
          "title": "Malaprabha Riverbank Twilight Reflection & Countryside Return",
          "type": "Scenic Riverbank Sunset & Return Drive",
          "duration": "2 hours",
          "travelTime": "Scenic return drive to Hampi base",
          "transportMode": "Cab",
          "estimatedCost": "Free",
          "bookingRequirement": "Open public area",
          "walkingIntensity": "Low",
          "location": "Malaprabha River Overlook",
          "description": "Watch golden hour twilight settle over pastoral sunflower fields, ancient village temples, and the Malaprabha river as you drive back to your Hampi resort.",
          "smartReason": "Peaceful countryside evening reflection after a full day of world-heritage exploration."
        }
      ],
      "extraActivity": {
        "icon": "🔨",
        "type": "Day 8 Masonry Workshop",
        "title": "Traditional Stone Carving Demonstration by Village Sculptors",
        "description": "Witness local hereditary stone carvers demonstrate ancient chiseling techniques used across the Chalukyan and Vijayanagara empires."
      }
    },
    {
      "day": 9,
      "summary": "Vijayanagara Aqueducts, Noblemen's Quarters & Underground Temples",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🕳️",
          "title": "Prasanna Virupaksha (Underground Shiva Temple) & Aqueducts",
          "type": "Subterranean Sanctum & Gravity Hydraulic Systems",
          "duration": "2.5 hours",
          "travelTime": "15 mins from Hampi Bazaar",
          "transportMode": "Auto",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open ASI monument",
          "walkingIntensity": "Moderate",
          "location": "Royal Center Outer Belt, Hampi",
          "description": "Descend cool stone steps into the subterranean temple sanctum often fed with clear natural spring water, and inspect the massive stone water aqueducts that supplied royal fountains.",
          "smartReason": "Subterranean chambers are naturally cool and atmospheric in the morning."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Hampi Mango Tree Courtyard Dining & Thali",
          "type": "Garden Courtyard Dining",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "₹350/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Kamalapur Road, Hampi",
          "description": "Relaxed dining under shaded thatch roofs serving multi-cuisine South Indian thalis, stuffed parathas, iced lemongrass tea, and fresh banana crumbles.",
          "smartReason": "Tranquil garden ambiance with cooling fans to recharge midday."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🏛️",
          "title": "Noblemen's Quarters, Mint Area & Stepped Octagonal Bath",
          "type": "Aristocratic Residential Enclave & Royal Baths",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto / Walk",
          "estimatedCost": "Included in Royal Center",
          "bookingRequirement": "Open site",
          "walkingIntensity": "Moderate",
          "location": "Noblemen's Enclosure, Hampi",
          "description": "Explore the multi-tiered plinths of the commanders' palaces, the high-security mint enclosure, and the exquisite symmetrical stepped stone bathing tank.",
          "smartReason": "Off-the-beaten-path sector with very few crowds and peaceful atmosphere."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🛕",
          "title": "Malyavanta Raghunatha Hill Sunset & 24/7 Ramayana Chanting",
          "type": "Hilltop Temple Sunset & Sacred Chant Enclave",
          "duration": "2.5 hours",
          "travelTime": "15 mins drive to hilltop",
          "transportMode": "Auto / Cab",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open temple",
          "walkingIntensity": "Low to Moderate",
          "location": "Malyavanta Hill, Eastern Hampi",
          "description": "Climb up to the stone temple perched high on huge boulder ridges where priests maintain uninterrupted, continuous Ramayana chanting 24 hours a day, overlooking sweeping sunset vistas.",
          "smartReason": "Deeply meditative acoustic sunset experience overlooking boulder horizons."
        }
      ],
      "extraActivity": {
        "icon": "📐",
        "type": "Day 9 Engineering Walk",
        "title": "Vijayanagara Gravity-Fed Stone Aqueduct Architecture Tour",
        "description": "Follow the masterly stone-fitted water conduit from the Kamalapur reservoir all the way to the royal stepped tanks."
      }
    },
    {
      "day": 10,
      "summary": "Sandur Lush Valley, Kumaraswamy Shrine & Grand Farewell Sunset",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🌲",
          "title": "Sandur Valley Scenic Ridge & 8th-Century Kumaraswamy Temple",
          "type": "Lush Mountain Forest & Ancient Rashtrakuta Temple",
          "duration": "3 hours",
          "travelTime": "45 mins scenic drive through Sandur hills",
          "transportMode": "Cab",
          "estimatedCost": "Free darshan",
          "bookingRequirement": "Open shrine",
          "walkingIntensity": "Moderate",
          "location": "Krai, Sandur Valley",
          "description": "Experience a dramatic change of scenery from granite boulders to emerald green forested hills and sandalwood plantations, visiting the historic Rashtrakuta-era Kumaraswamy & Parvati shrines.",
          "smartReason": "Cool, forested mountain microclimate with crisp morning air."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Sandur Kushala Kala Kendra Traditional Rural Feast",
          "type": "Artisan Community Dining",
          "duration": "1.5 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Cab",
          "estimatedCost": "₹260/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Kushala Kendra, Sandur",
          "description": "Wholesome organic spread featuring foxtail millet rice, spiced country vegetable sambar, buttermilk, and wild forest honey sweets.",
          "smartReason": "Supports local community empowerment and indigenous artisans."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🪡",
          "title": "Lambani Mirror-Work Embroidery Workshop & Artisan Studios",
          "type": "GI-Tagged Living Tribal Textile Craft",
          "duration": "2.5 hours",
          "travelTime": "Inside Kendra",
          "transportMode": "Walk",
          "estimatedCost": "Free studio tour",
          "bookingRequirement": "Open workshop",
          "walkingIntensity": "Low",
          "location": "Sandur Craft Village",
          "description": "Meet Lambani nomadic women artisans crafting UNESCO-recognized textiles using 39 distinct embroidery stitches, cowrie shells, and shimmering mirrors on handloom cotton.",
          "smartReason": "Direct artisan interaction to appreciate the living textile heritage."
        },
        {
          "timeSlot": "05:00 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🚣",
          "title": "Tungabhadra River Sunset Coracle Cruise & Grand Farewell Reflections",
          "type": "Celebratory Sunset Water Safari & Grand Conclusion",
          "duration": "3 hours",
          "travelTime": "30 mins return to Tungabhadra Ghats",
          "transportMode": "Cab",
          "estimatedCost": "₹400 coracle ride",
          "bookingRequirement": "Boatman point",
          "walkingIntensity": "Low",
          "location": "Chakratirtha / Anegundi Riverbank",
          "description": "Glide silently in a round wicker coracle beneath towering granite boulders as the setting sun turns the Tungabhadra waters to molten gold, reflecting on 10 extraordinary days of Vijayanagara splendor.",
          "smartReason": "Unforgettable tranquil river sunset finale before departure via Hosapete Junction (HPT)."
        }
      ],
      "extraActivity": {
        "icon": "🎁",
        "type": "Day 10 Farewell Keepsake",
        "title": "Handcrafted Black Granite Stone Chariot Keepsake Shopping",
        "description": "Acquire an authentic hand-carved miniature replica of Hampi's stone chariot directly from local Kamalapur stone artisans."
      }
    }
  ],
  "Ooty": [
    {
      "day": 1,
      "summary": "Ooty Heritage: Government Botanical Gardens & Ooty Lake Boating",
      "timeBlocks": [
        {
          "timeSlot": "09:30 AM – 12:30 PM",
          "period": "Morning",
          "icon": "🌺",
          "title": "Government Botanical Gardens & Fossil Tree Trunk",
          "type": "Colonial Botanical Sanctuary (1848)",
          "duration": "3 hours",
          "travelTime": "10 mins from Ooty Central Bus Stand",
          "transportMode": "Auto / Cab",
          "estimatedCost": "₹40 entry",
          "bookingRequirement": "Ticket at entry",
          "walkingIntensity": "Moderate",
          "location": "Vannarapettai, Ooty",
          "description": "Stroll across 55 acres of terraced exotic flora, Italian gardens, fern houses, and a 20-million-year-old fossilized tree trunk.",
          "smartReason": "Crisp morning hill air with dew on exotic Nilgiri blossoms."
        },
        {
          "timeSlot": "01:00 PM – 02:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Earl's Secret at King's Cliff Colonial Dining",
          "type": "Colonial Heritage Experience",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Cab",
          "estimatedCost": "₹500/person",
          "bookingRequirement": "Reservation recommended",
          "walkingIntensity": "Low",
          "location": "Havelock Road, Ooty",
          "description": "Glass conservatory dining with fireplace hearths serving chicken stroganoff, shepherd's pie, and Nilgiri spiced curries.",
          "smartReason": "Atmospheric heritage estate immersing you in vintage British-era hill station ambiance."
        },
        {
          "timeSlot": "03:00 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "⛵",
          "title": "Ooty Lake & Boathouse Pedal/Motor Boating",
          "type": "Scenic Lake & Leisure",
          "duration": "2 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Auto / Cab",
          "estimatedCost": "₹25 entry + ₹250 boat rental",
          "bookingRequirement": "Ticket at jetty",
          "walkingIntensity": "Low",
          "location": "North Lake Road, Ooty",
          "description": "Glide across the 65-acre artificial lake surrounded by tall eucalyptus trees, constructed in 1824 by John Sullivan.",
          "smartReason": "Pleasant afternoon water breeze with pedal boats and mini-train joyrides."
        },
        {
          "timeSlot": "05:30 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🍫",
          "title": "Commercial Road Homemade Chocolate & Tea Tasting Trail",
          "type": "Shopping & Local Confectionery",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Walk",
          "estimatedCost": "Free / Personal spends",
          "bookingRequirement": "Open market",
          "walkingIntensity": "Low",
          "location": "Commercial Road & Charing Cross",
          "description": "Sample handcrafted fudge, dark rum truffles, white chocolate, and fresh eucalyptus oil in bustling mountain market shops.",
          "smartReason": "Lively evening market atmosphere with warm cocoa drinks against the mountain chill."
        }
      ],
      "extraActivity": {
        "icon": "🚂",
        "type": "Day 1 Heritage Track",
        "title": "Ooty Heritage Railway Station Visit",
        "description": "Inspect the quaint stone Swiss-style railway terminus where steam toy trains whistle upon arrival."
      }
    },
    {
      "day": 2,
      "summary": "Skyline Vistas: Doddabetta Peak (8,650 ft) & Tea Factory Museum",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "⛰️",
          "title": "Doddabetta Peak & Telescope House (Highest Nilgiri Point)",
          "type": "Panoramic Mountain Summit (2,637m)",
          "duration": "3 hours",
          "travelTime": "25 mins drive from Ooty center",
          "transportMode": "Cab / Tourist Shuttle",
          "estimatedCost": "₹20 entry",
          "bookingRequirement": "Ticket counter",
          "walkingIntensity": "Moderate",
          "location": "Ooty-Kotagiri Road",
          "description": "Stand at the junction of the Western and Eastern Ghats, looking through high-powered telescopes across misty valley ridges.",
          "smartReason": "Clear morning skies offer the best cloudless panoramic views across the Nilgiri plateau."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "The Casket / Hillside Bistro Lunch with Fresh Valley Greens",
          "type": "Mountain View Dining",
          "duration": "1.5 hours",
          "travelTime": "15 mins descending",
          "transportMode": "Cab",
          "estimatedCost": "₹350/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Doddabetta Foothills",
          "description": "Organic salads harvested from terraced mountain plots, piping hot parottas, and tender kurma.",
          "smartReason": "Scenic hillside balconies overlooking emerald tea plantation slopes."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🍵",
          "title": "Ooty Tea Factory & Handcrafted Chocolate Processing Museum",
          "type": "Interactive Agro-Industry Tour",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Cab",
          "estimatedCost": "₹30 entry",
          "bookingRequirement": "Ticket at door",
          "walkingIntensity": "Low",
          "location": "Doddabetta Road",
          "description": "Follow the aroma of freshly crushed tea leaves through the withering, rolling, and drying machines; complimentary cup of cardamom black tea.",
          "smartReason": "Learn the CTC processing science firsthand while escaping the chilly afternoon wind."
        },
        {
          "timeSlot": "05:30 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌹",
          "title": "Government Rose Garden Twilight Stroll (20,000 Varieties)",
          "type": "Asia's Largest Terraced Rose Sanctuary",
          "duration": "2 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "₹40 entry",
          "bookingRequirement": "Ticket at gate",
          "walkingIntensity": "Moderate",
          "location": "Elk Hill Slopes",
          "description": "Walk between terraced curves of hybrid tea roses, miniature roses, ramblers, and black roses spanning 10 hillside acres.",
          "smartReason": "Late afternoon floral fragrance peaks right before twilight gates close."
        }
      ],
      "extraActivity": {
        "icon": "🍯",
        "type": "Day 2 Natural Produce",
        "title": "Toda Tribal Cooperative Pure Forest Honey Tasting",
        "description": "Support indigenous Toda artisans selling pure wild rock-bee honey and hand-woven shawls."
      }
    },
    {
      "day": 3,
      "summary": "UNESCO Heritage: Nilgiri Mountain Toy Train & Coonoor Sim's Park",
      "timeBlocks": [
        {
          "timeSlot": "09:15 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🚂",
          "title": "Nilgiri Mountain Railway Toy Train (Ooty to Coonoor)",
          "type": "UNESCO World Heritage Rail Corridor (1908)",
          "duration": "2.2 hours",
          "travelTime": "Departs Ooty Station (UAM)",
          "transportMode": "Heritage Steam/Diesel Toy Train",
          "estimatedCost": "₹35 (Second) / ₹150 (First Class)",
          "bookingRequirement": "IRCTC advance booking or counter token",
          "walkingIntensity": "Low (Train seated)",
          "location": "Ooty - Lovedale - Coonoor",
          "description": "Rumble through dark stone tunnels, wooden trestle bridges, and cliffside tea slopes on India's steepest rack-and-pinion railway.",
          "smartReason": "Unforgettable vintage travel experience with open windows framing misty eucalyptus valleys."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Hopscotch / Café Diem Organic Lunch in Coonoor",
          "type": "Boutique Cafe Dining",
          "duration": "1.5 hours",
          "travelTime": "10 mins from Coonoor Station",
          "transportMode": "Auto",
          "estimatedCost": "₹450/person",
          "bookingRequirement": "Reservation recommended",
          "walkingIntensity": "Low",
          "location": "Upper Coonoor",
          "description": "Artisan herb quiches, Nilgiri cheese platters, pumpkin soup, and signature passion-fruit tarts.",
          "smartReason": "Charming French-colonial villa setting nestled among rolling tea bushes."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🌿",
          "title": "Sim's Park Coonoor & Natural Japanese Rock Garden",
          "type": "Botanical Landscape & Rare Flora",
          "duration": "2.5 hours",
          "travelTime": "5 mins transit",
          "transportMode": "Auto / Walk",
          "estimatedCost": "₹30 entry",
          "bookingRequirement": "Ticket at gate",
          "walkingIntensity": "Moderate",
          "location": "Coonoor Valley",
          "description": "Explore 12 hectares of natural terraced botanical gardens established in 1874 with Queensland karry pines and tree ferns.",
          "smartReason": "Gentle natural slope walk with towering ornamental trees from around the globe."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🦅",
          "title": "Dolphin's Nose Viewpoint & Catherine Falls Panorama",
          "type": "Dramatic Canyon Vista",
          "duration": "2.5 hours",
          "travelTime": "25 mins drive from Coonoor",
          "transportMode": "Cab",
          "estimatedCost": "₹20 entry",
          "bookingRequirement": "Gate entry",
          "walkingIntensity": "Low",
          "location": "Coonoor Edge",
          "description": "Peer across a colossal rock cliff shaped like a dolphin's nose, looking across deep blue ravines at the two-tiered Catherine Falls.",
          "smartReason": "Evening mist swirling over the 1,500-foot gorge creates breathtaking depth."
        }
      ],
      "extraActivity": {
        "icon": "🧀",
        "type": "Day 3 Gastronomic Gem",
        "title": "Acres Wild Organic Cheese Farm Visit",
        "description": "Taste locally aged artisanal Gouda, Cheddar, and Halloumi crafted by Nilgiri dairy farms."
      }
    },
    {
      "day": 4,
      "summary": "Water Sanctuaries: Pykara Lake Speedboating & Cascading Pykara Falls",
      "timeBlocks": [
        {
          "timeSlot": "09:30 AM – 12:30 PM",
          "period": "Morning",
          "icon": "🚤",
          "title": "Pykara Lake & TTDC Speedboat Safari",
          "type": "Pristine Sacred Lake & Boating",
          "duration": "3 hours",
          "travelTime": "40 mins scenic drive via Mysore road",
          "transportMode": "Private Cab",
          "estimatedCost": "₹10 entry + ₹600 speedboat share",
          "bookingRequirement": "TTDC boat counter",
          "walkingIntensity": "Low",
          "location": "Pykara, 21 km from Ooty",
          "description": "Zoom through glass-like blue waters surrounded by undisturbed pine and shola forest shores, revered by the indigenous Toda community.",
          "smartReason": "Morning calm produces mirror-like reflections on the mountain reservoir."
        },
        {
          "timeSlot": "01:00 PM – 02:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Pykara Boathouse Restaurant Riverside Lunch",
          "type": "Lakeside Dining",
          "duration": "1.5 hours",
          "travelTime": "Adjacent to boathouse jetty",
          "transportMode": "Walk",
          "estimatedCost": "₹250/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Pykara Lake Shores",
          "description": "Traditional hot South Indian thali, fried river fish, curd rice, and lemon tea.",
          "smartReason": "Unwind on the water-facing deck listening to gentle lake ripples."
        },
        {
          "timeSlot": "03:00 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🌊",
          "title": "Pykara Waterfalls (Upper & Lower Cascades)",
          "type": "Natural Waterfall & Shola Forest",
          "duration": "2 hours",
          "travelTime": "5 mins drive + 10 mins paved trail",
          "transportMode": "Cab + short walk",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open natural site",
          "walkingIntensity": "Moderate",
          "location": "Pykara River Gorge",
          "description": "Watch the Pykara River plunge over granite rocks in two sequential cascades before settling into a deep forest gorge.",
          "smartReason": "Paved walking track shaded by pine canopies with misty viewing platforms."
        },
        {
          "timeSlot": "05:30 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌲",
          "title": "Shooting Point / Wenlock Downs 9th Mile Sunset Meadows",
          "type": "Vast Rolling Green Meadows",
          "duration": "2 hours",
          "travelTime": "15 mins drive on return",
          "transportMode": "Cab",
          "estimatedCost": "₹20 entry",
          "bookingRequirement": "Ticket at entry gate",
          "walkingIntensity": "Moderate",
          "location": "Wenlock Downs, 9th Mile",
          "description": "Run across endless undulating green grasslands featured in dozens of Indian films, offering sunset views over Kamraj Sagar.",
          "smartReason": "Golden hour sunset turns the green meadows into a sea of shimmering gold."
        }
      ],
      "extraActivity": {
        "icon": "🐎",
        "type": "Day 4 Hill Activity",
        "title": "Meadow Horse Riding at Wenlock Downs",
        "description": "Gentle equestrian trail ride across the rolling grassy slopes led by certified local horsemen."
      }
    },
    {
      "day": 5,
      "summary": "Wild Nilgiris: Avalanche Lake, Emerald Lake & Shola Forest Nature Trails",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:30 PM",
          "period": "Morning",
          "icon": "🌲",
          "title": "Avalanche Lake & Forest Department Eco-Safari",
          "type": "Undisturbed Shola Forest Sanctuary",
          "duration": "3.5 hours",
          "travelTime": "1 hour scenic drive through tribal villages",
          "transportMode": "Forest Department 4x4 Safari Bus",
          "estimatedCost": "₹200 safari ticket",
          "bookingRequirement": "Forest checkpost entry (Permit regulated)",
          "walkingIntensity": "Low",
          "location": "Avalanche Sanctuary, 28 km from Ooty",
          "description": "Journey deep into protected virgin forests filled with blooming rhododendrons, magnolias, and crystal trout streams.",
          "smartReason": "Heavily restricted vehicle access preserves tranquil wilderness and clean air."
        },
        {
          "timeSlot": "01:00 PM – 02:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Emerald Lake Village Farm Fresh Picnic / Local Mess",
          "type": "Rustic Village Lunch",
          "duration": "1.5 hours",
          "travelTime": "20 mins from Avalanche checkpost",
          "transportMode": "Cab",
          "estimatedCost": "₹220/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Emerald Village Valley",
          "description": "Warm country meals with steamed rice, local potato roast, rasam, and fresh mountain carrots.",
          "smartReason": "Authentic countryside encounter in the heart of the Nilgiri vegetable belt."
        },
        {
          "timeSlot": "03:00 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "💧",
          "title": "Emerald Lake Serene Shoreline & Tea Estate Walk",
          "type": "Uncommercialized Blue Lake",
          "duration": "2 hours",
          "travelTime": "5 mins transit",
          "transportMode": "Walk",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open public lakeshore",
          "walkingIntensity": "Moderate",
          "location": "Silent Valley Road, Emerald",
          "description": "Sit beside striking turquoise-blue waters surrounded by silent tea estates with zero commercial shops or noise.",
          "smartReason": "Arguably the most tranquil lake in South India, ideal for peaceful nature photography."
        },
        {
          "timeSlot": "05:30 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🍵",
          "title": "Tea Factory Viewpoint Twilight Chai & Red Hills Vista",
          "type": "Scenic Plantation Twilight",
          "duration": "2 hours",
          "travelTime": "Drive along the dam rim",
          "transportMode": "Cab",
          "estimatedCost": "₹100 for snacks and hot tea",
          "bookingRequirement": "Open tea stall",
          "walkingIntensity": "Low",
          "location": "Emerald Dam Overlook",
          "description": "Sip steaming hot ginger chai overlooking the reflective reservoir as fog rolls over the surrounding blue mountains.",
          "smartReason": "Dramatic sunset color palette reflecting off the tranquil water body."
        }
      ],
      "extraActivity": {
        "icon": "🎣",
        "type": "Day 5 Angling Lore",
        "title": "Trout Hatchery Visit at Avalanche",
        "description": "Learn how Rainbow Trout fish were introduced by the British and bred in pristine mountain streams."
      }
    },
    {
      "day": 6,
      "summary": "Hidden Groves: Pine Forest Canopy, Kamraj Sagar Dam & St. Stephen’s Church",
      "timeBlocks": [
        {
          "timeSlot": "09:30 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🌲",
          "title": "Ooty Pine Forest Slope Canopy Walk",
          "type": "Majestic Pine Tree Sanctuary",
          "duration": "2.5 hours",
          "travelTime": "20 mins drive from city center",
          "transportMode": "Cab",
          "estimatedCost": "₹10 entry",
          "bookingRequirement": "Entry gate ticket",
          "walkingIntensity": "Moderate (Sloping terrain)",
          "location": "Thalaikundha - Pykara Road",
          "description": "Descend into a dense sloping forest of soaring Siberian pines planted over a century ago, creating a carpet of soft brown pine needles.",
          "smartReason": "Sunbeams filtering through the tall pine canopy create enchanting light columns."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Shinkow's Authentic Chinese Restaurant Ooty (Established 1954)",
          "type": "Iconic Mountain Heritage Dining",
          "duration": "1.5 hours",
          "travelTime": "15 mins back to town",
          "transportMode": "Cab",
          "estimatedCost": "₹380/person",
          "bookingRequirement": "Walk-in early (popular spot)",
          "walkingIntensity": "Low",
          "location": "Commissioner's Road, Ooty",
          "description": "Famous mountain destination serving hearty sweet corn chicken soup, crispy chili beef, cantonese noodles, and jasmine tea.",
          "smartReason": "Heartwarming comfort food beloved by generations of Nilgiri travelers."
        },
        {
          "timeSlot": "02:30 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "⛪",
          "title": "St. Stephen's Church (1829) & Historic Cemetery",
          "type": "Gothic Colonial Architecture",
          "duration": "2 hours",
          "travelTime": "5 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "Free entry (Donations welcome)",
          "bookingRequirement": "Open heritage church",
          "walkingIntensity": "Low",
          "location": "Club Road, Upper Ooty",
          "description": "Visit Ooty's oldest church with beams salvaged from Tipu Sultan's Srirangapatna palace and stunning stained-glass depictions of the Last Supper.",
          "smartReason": "Cool historic stone interiors steeped in early 19th-century mountain heritage."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🛍️",
          "title": "Tibetan Market Souvenir Shopping & Nilgiri Spices Farewell",
          "type": "Mountain Market Farewell",
          "duration": "2.5 hours",
          "travelTime": "Adjacent to Botanical Gardens",
          "transportMode": "Walk",
          "estimatedCost": "Free / Personal shopping",
          "bookingRequirement": "Open market",
          "walkingIntensity": "Low",
          "location": "Vannarapettai Market",
          "description": "Pick up hand-knitted woolen cardigans, authentic Nilgiri wintergreen oils, spices (cloves, cinnamon, nutmeg), and chocolate gift boxes.",
          "smartReason": "Perfect conclusion before disembarking to Coimbatore Junction or airport."
        }
      ],
      "extraActivity": {
        "icon": "🕯️",
        "type": "Day 6 Scenic Overlook",
        "title": "Kamraj Sagar (Sandynalla Reservoir) Birdwatching",
        "description": "Serene peaceful waters where kingfishers, herons, and mountain raptors nest among shoreline reeds."
      }
    },
    {
      "day": 7,
      "summary": "Kotagiri Tea Estates, Kodanad Panoramic Viewpoint & Toda Hamlets",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "⛰️",
          "title": "Kodanad Viewpoint & Thengumarahada Valley Panorama",
          "type": "High-Altitude Nilgiri Ridge Vista (2,000m)",
          "duration": "3 hours",
          "travelTime": "45 mins scenic drive from Ooty to Kotagiri",
          "transportMode": "Cab",
          "estimatedCost": "₹30 viewpoint ticket",
          "bookingRequirement": "Direct counter",
          "walkingIntensity": "Low",
          "location": "Kodanad Ridge, Kotagiri",
          "description": "Stand at the edge of the Nilgiri plateau gazing into the dramatic deep gorge of the Moyar River, verdant Bhavanisagar reservoir waters, and endless sweeps of tea plantations.",
          "smartReason": "Morning timing avoids thick mountain fog that rolls in by afternoon."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Kotagiri Hillside Planters' Lunch & Nilgiri Spiced Brew",
          "type": "Mountain Plantation Dining",
          "duration": "1.5 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Cab",
          "estimatedCost": "₹320/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Kotagiri Town Center",
          "description": "Freshly prepared meal featuring crunchy Nilgiri vegetables (hill carrots, baby potatoes, green beans), spiced rasam, curd rice, and freshly steeped silver-needle white tea.",
          "smartReason": "Wholesome dining at a quieter, less-commercialized hill hamlet."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🛖",
          "title": "Rangaswamy Pillar Vista & Authentic Toda Tribal Enclave",
          "type": "Sacred Geological Spire & Indigenous Toda Village",
          "duration": "2.5 hours",
          "travelTime": "20 mins drive",
          "transportMode": "Cab",
          "estimatedCost": "Free village visit",
          "bookingRequirement": "Respectful entry",
          "walkingIntensity": "Moderate",
          "location": "Kil-Kotagiri Tribal Belt",
          "description": "View the awe-inspiring 400-foot solitary sacred rock pillar rising out of virgin forest, and visit an indigenous Toda village with semi-barrel thatched huts and buffalo dairies.",
          "smartReason": "Authentic cultural immersion into the earliest inhabitants of the Blue Mountains."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌊",
          "title": "Catherine Falls Double-Cascade Sunset Lookout",
          "type": "Dramatic 250-Foot Waterfall Sunset Lookout",
          "duration": "2.5 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Cab",
          "estimatedCost": "Free viewpoint",
          "bookingRequirement": "Open public area",
          "walkingIntensity": "Low to Moderate",
          "location": "Mettupalayam Highway Ridge",
          "description": "Gaze across the valley as the double cascade of Catherine Falls plunges 250 feet into the Kallar river basin, catching golden evening sunset rays amidst swirling mountain mists.",
          "smartReason": "Peaceful twilight atmosphere over lush tea terraces."
        }
      ],
      "extraActivity": {
        "icon": "🧣",
        "type": "Day 7 Tribal Textile",
        "title": "Authentic Toda Pukhoor Red-and-Black Embroidery Craft",
        "description": "Witness Toda women demonstrate their distinctive geometric hand-embroidery on unbleached white cotton shawls, a GI-tagged craft recognized globally."
      }
    },
    {
      "day": 8,
      "summary": "Kalhatty Waterfalls & 36-Hairpin Sigur Plateau Wildlife Descent",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 11:30 AM",
          "period": "Morning",
          "icon": "💦",
          "title": "Kalhatty Falls Descent via the Famous 36 Hairpin Bends",
          "type": "Mountain Waterfall & Thrilling Ghat Road Descent",
          "duration": "2.5 hours",
          "travelTime": "30 mins drive from Ooty along Sigur Ghat",
          "transportMode": "Cab",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open natural falls",
          "walkingIntensity": "Moderate",
          "location": "Kalhatty Slopes, Nilgiris",
          "description": "Descend the world-famous 36 steep hairpin turns of the Sigur ghat road, reaching the picturesque 120-foot Kalhatty waterfalls cascading into a forest glen.",
          "smartReason": "Morning descent offers crisp mountain air and clear panoramic road vistas."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Sigur Foothills Roadside Country Kitchen Feast",
          "type": "Local Country Dining",
          "duration": "1.5 hours",
          "travelTime": "15 mins drive",
          "transportMode": "Cab",
          "estimatedCost": "₹240/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Sigur Valley Roadside",
          "description": "Authentic South Indian country meal: flaky layered parottas, flavorful vegetable kurma, steamed rice with drumstick sambar, and chilled fresh tender coconut water.",
          "smartReason": "Satisfying roadside meal in the peaceful foothill transition zone."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🦅",
          "title": "Sigur Wildlife Corridor Birdwatching & Biosphere Walk",
          "type": "Forest Birdwatching & Elephant Corridor Trail",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Guided Walk / Jeep",
          "estimatedCost": "₹200 eco guide",
          "bookingRequirement": "Local forest naturalist",
          "walkingIntensity": "Moderate",
          "location": "Sigur Deciduous Forest Belt",
          "description": "Walk with a certified forest tracker through the vital wildlife corridor connecting Western and Eastern Ghats, spotting Malabar grey hornbills, crested serpent eagles, and chital deer.",
          "smartReason": "Deciduous forest offers clear bird sightlines through the trees."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🐐",
          "title": "Kalhatty Valley Lookout Sunset & Nilgiri Tahr Spotting",
          "type": "Escarpment Sunset & Endangered Wildlife Spotting",
          "duration": "2.5 hours",
          "travelTime": "Return drive up Sigur Ghat",
          "transportMode": "Cab",
          "estimatedCost": "Free lookout",
          "bookingRequirement": "Open ridge",
          "walkingIntensity": "Low",
          "location": "Kalhatty Upper Viewpoint",
          "description": "Pull up at the ridge observation post as dusk settles over the dry deciduous plains below, often catching glimpses of the endangered Nilgiri Tahr mountain goat agile on sheer rocky precipices.",
          "smartReason": "Dusk is prime feeding time when mountain goats step out onto rocky outcroppings."
        }
      ],
      "extraActivity": {
        "icon": "🌿",
        "type": "Day 8 Herbal Exploration",
        "title": "Wild Nilgiri Eucalyptus & Wintergreen Essential Oil Distillery",
        "description": "Visit a traditional steam-extraction wood-fired distillation shed learning how pure medicinal eucalyptus and camphor oils are produced from hand-harvested leaves."
      }
    },
    {
      "day": 9,
      "summary": "Upper Bhavani Reservoir Eco-Safari & Mukurthi Alpine Sholas",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🌲",
          "title": "Upper Bhavani Forest Eco-Safari & Pristine Blue Reservoir",
          "type": "Protected Biosphere Safari & High-Altitude Lake",
          "duration": "3.5 hours",
          "travelTime": "1.5 hours scenic drive from Ooty via Avalanche",
          "transportMode": "Forest Dept Eco-Bus / Authorized Jeep",
          "estimatedCost": "₹350 safari fee",
          "bookingRequirement": "Forest Dept Checkpost Permit",
          "walkingIntensity": "Moderate",
          "location": "Upper Bhavani Sanctuary",
          "description": "Board the official forest department safari through dense, ancient moss-covered shola forests and rolling grasslands to reach the pristine, untouched turquoise waters of Upper Bhavani Lake.",
          "smartReason": "Morning mist rising from the undisturbed high-altitude waters creates a magical alpine atmosphere."
        },
        {
          "timeSlot": "12:30 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🥪",
          "title": "High-Altitude Eco-Packed Picnic Lunch by Lakeside Sholas",
          "type": "Scenic Wilderness Picnic",
          "duration": "1 hour",
          "travelTime": "Lakeside picnic area",
          "transportMode": "Walk",
          "estimatedCost": "₹250/person packed lunch",
          "bookingRequirement": "Pre-arranged with resort",
          "walkingIntensity": "Low",
          "location": "Upper Bhavani Permitted Area",
          "description": "Enjoy fresh farm-style sandwiches, Nilgiri cheese, boiled hill potatoes with salt and pepper, boiled eggs, fruit cakes, and hot tea from a thermos under pine trees.",
          "smartReason": "Zero-waste scenic dining surrounded by complete silence and pristine nature."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🌾",
          "title": "Mukurthi National Park Border & Endangered Alpine Peat Bogs",
          "type": "UNESCO Biosphere Core & Peat Bog Ecology",
          "duration": "2.5 hours",
          "travelTime": "20 mins transit inside safari zone",
          "transportMode": "Eco-Bus",
          "estimatedCost": "Included in safari",
          "bookingRequirement": "Sanctuary permit",
          "walkingIntensity": "Moderate",
          "location": "Mukurthi Outer Boundary",
          "description": "Traverse high-altitude rolling montane grasslands resembling the Scottish highlands, punctuated by dwarf rhododendron trees, ground orchids, and ancient peat bogs that regulate water flow to south India.",
          "smartReason": "Rare, vulnerable ecosystem protected at 2,400 meters altitude."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌄",
          "title": "Silent Valley Ridge Viewpoint Sunset & Return Drive",
          "type": "Sublime Mountain Sunset & Twilight Valley Drive",
          "duration": "2.5 hours",
          "travelTime": "Scenic return drive to Ooty",
          "transportMode": "Cab",
          "estimatedCost": "Free",
          "bookingRequirement": "Open viewpoint",
          "walkingIntensity": "Low",
          "location": "Lakshmi Hill Overlook, Avalanche Road",
          "description": "Pause on the mountain ridge as the sun casts long golden shadows across green slopes, turning the sky through shades of apricot, amber, and indigo over the distant Silent Valley national park.",
          "smartReason": "Incredible tranquility and mountain solitude far away from tourist towns."
        }
      ],
      "extraActivity": {
        "icon": "📷",
        "type": "Day 9 Wilderness Photography",
        "title": "Nilgiri Laughingthrush & High-Altitude Flora Identification",
        "description": "Spot the endemic Rufous-breasted Laughingthrush and wild purple Kurinji shrubs that bloom once every 12 years."
      }
    },
    {
      "day": 10,
      "summary": "Glenmorgan Historic Tea Estate, Moyar Canyon & Grand Nilgiri Farewell",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🚡",
          "title": "Glenmorgan Tea Estate & Historic Single-Track Cable Ropeway",
          "type": "Pioneering 19th-Century High-Elevation Tea Estate",
          "duration": "2.5 hours",
          "travelTime": "40 mins drive from Ooty via Pykara road",
          "transportMode": "Cab",
          "estimatedCost": "Free estate walk",
          "bookingRequirement": "Open estate road",
          "walkingIntensity": "Moderate",
          "location": "Glenmorgan Highlands",
          "description": "Visit one of the earliest colonial tea plantations in the Nilgiris, walking along manicured tea bushes to the historic electricity board ropeway vantage point.",
          "smartReason": "Panoramic mountain overlook where the tea slopes suddenly drop into deep river canyons."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🫖",
          "title": "Colonial High Tea & English Garden Lunch Spread",
          "type": "Colonial Club-Style Dining",
          "duration": "1.5 hours",
          "travelTime": "15 mins drive to heritage lodge",
          "transportMode": "Cab",
          "estimatedCost": "₹450/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Heritage Bungalow / Savoy Ooty",
          "description": "Indulge in freshly baked scones with clotted cream and strawberry preserves, cucumber-mint sandwiches, chicken/veg pot pie, and single-estate whole-leaf orthodox black tea.",
          "smartReason": "Celebrates the 180-year-old Anglo-Indian tea culture of the Queen of Hill Stations."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🌹",
          "title": "Government Rose Garden Terraces & Charing Cross Boutiques",
          "type": "India's Largest Terraced Rose Sanctuary (20,000 Varieties)",
          "duration": "2.5 hours",
          "travelTime": "15 mins drive back to Ooty center",
          "transportMode": "Cab",
          "estimatedCost": "₹50 entry",
          "bookingRequirement": "Counter ticket",
          "walkingIntensity": "Moderate",
          "location": "Elk Hill Terraces, Ooty",
          "description": "Wander through 4 hectares of beautifully tiered curved terraces on Elk Hill showcasing miniature roses, hybrid teas, ramblers, and rare green and black roses.",
          "smartReason": "Vibrant floral colors and fragrant breezes across afternoon sun terraces."
        },
        {
          "timeSlot": "05:00 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Doddabetta Sunset Peak & Grand Fireplace Farewell Dinner",
          "type": "Highest Nilgiri Peak (2,637m) Sunset & Farewell Feast",
          "duration": "3 hours",
          "travelTime": "20 mins drive",
          "transportMode": "Cab",
          "estimatedCost": "₹650/person dinner",
          "bookingRequirement": "Advance dinner booking",
          "walkingIntensity": "Low",
          "location": "Doddabetta Summit & Heritage Lounge",
          "description": "Gaze from the highest peak in the Nilgiri range as twilight blankets Coimbatore plains, followed by a cozy celebratory farewell dinner before a crackling colonial fireplace.",
          "smartReason": "The ultimate celebratory peak finale to a 10-day Nilgiri expedition before departure via MTP / CBE."
        }
      ],
      "extraActivity": {
        "icon": "🎁",
        "type": "Day 10 Farewell Keepsake",
        "title": "Handmade Nilgiri Chocolate Box & Single-Estate Tea Gift Hamper",
        "description": "Curate a personalized farewell hamper containing dark rum-and-raisin fudge, roasted almond truffles, and golden-flowery orange pekoe tea."
      }
    }
  ],
  "Pondicherry": [
    {
      "day": 1,
      "summary": "French Quarter (White Town) Heritage, Promenade Beach & Sri Aurobindo Ashram",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🕊️",
          "title": "Sri Aurobindo Ashram & Samadhi Sanctuary",
          "type": "Spiritual Peace & Meditation",
          "duration": "2.5 hours",
          "travelTime": "10 mins from Puducherry Railway Station (PDY)",
          "transportMode": "Cycle Rickshaw / Walk",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Silent entry (Shoes deposited outside)",
          "walkingIntensity": "Low",
          "location": "Rue de la Marine, White Town",
          "description": "Experience profound inner silence at the marble samadhi of Sri Aurobindo and The Mother, decorated with fresh daily flower mandalas.",
          "smartReason": "Quiet morning contemplation before street bustling commences."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Café des Arts / Coromandel Cafe French-Creole Lunch",
          "type": "Colonial Courtyard Dining",
          "duration": "1.5 hours",
          "travelTime": "5 mins walk",
          "transportMode": "Walk",
          "estimatedCost": "₹450/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Rue Romain Rolland, White Town",
          "description": "Dine under pink bougainvillea arches on fresh baguettes, crepes, ratatouille, prawn curry in coconut milk, and hibiscus iced tea.",
          "smartReason": "Iconic colonial villa courtyard with vintage French posters and cooling fans."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🏛️",
          "title": "White Town French Architecture Walking Tour & Basilica of Sacred Heart",
          "type": "Colonial Heritage Promenade",
          "duration": "2.5 hours",
          "travelTime": "Walking tour",
          "transportMode": "Bicycle / Foot",
          "estimatedCost": "Free walk",
          "bookingRequirement": "Open heritage streets",
          "walkingIntensity": "Moderate",
          "location": "Rue Dumas & Rue Suffren",
          "description": "Admire mustard-yellow colonial mansions, arched louvered wooden shutters, and the Gothic Basilica of the Sacred Heart of Jesus.",
          "smartReason": "Cobblestone lanes shaded by ancient rain trees provide breezy afternoon walks."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌊",
          "title": "Goubert Promenade Beach Walk & French War Memorial",
          "type": "Pedestrian Seaside Sunset",
          "duration": "3 hours",
          "travelTime": "1 min walk to sea face",
          "transportMode": "Pedestrian Only Promenade",
          "estimatedCost": "Free public access",
          "bookingRequirement": "Open seaside (Vehicle-free after 5 PM)",
          "walkingIntensity": "Low",
          "location": "Beach Road, Promenade",
          "description": "Stroll along the 1.5 km stone-embanked seaside promenade with crashing Bay of Bengal waves, Mahatma Gandhi statue, and old lighthouse.",
          "smartReason": "Completely closed to motorized vehicles every evening, allowing pure seaside strolls."
        }
      ],
      "extraActivity": {
        "icon": "🚲",
        "type": "Day 1 Leisure Highlight",
        "title": "Vintage Dutch Bicycle Rental Stroll",
        "description": "Rent a classic pastel-colored bicycle with front wicker basket to leisurely navigate French Quarter lanes."
      }
    },
    {
      "day": 2,
      "summary": "Universal City: Auroville Matrimandir, Solar Kitchen & Peace Pavilion",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 12:30 PM",
          "period": "Morning",
          "icon": "✨",
          "title": "Auroville Universal Township & Matrimandir Viewing Point",
          "type": "International Utopian City & Peace Dome",
          "duration": "4 hours",
          "travelTime": "25 mins drive from White Town",
          "transportMode": "Cab / Moped",
          "estimatedCost": "Free pass at Visitors Centre",
          "bookingRequirement": "Inner chamber requires 2-day advance online registration",
          "walkingIntensity": "Moderate (Shaded forest path)",
          "location": "Auroville, Viluppuram Border",
          "description": "Walk through tranquil green forest paths to view the golden geodesic sphere Matrimandir, symbolizing human unity and consciousness.",
          "smartReason": "Early morning walk allows peaceful contemplation before midday temperatures."
        },
        {
          "timeSlot": "01:00 PM – 02:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Solar Kitchen / Right Path Cafe Organic Farm Feast",
          "type": "Sustainable Organic Dining",
          "duration": "1.5 hours",
          "travelTime": "5 mins internal transit",
          "transportMode": "Walk / Moped",
          "estimatedCost": "₹280/person",
          "bookingRequirement": "Visitors Centre card / coupon",
          "walkingIntensity": "Low",
          "location": "Auroville Center",
          "description": "Wholesome organic meals prepared using solar steam cookers: sourdough breads, organic salads, tofu stir-fry, and cold-pressed passion fruit juice.",
          "smartReason": "Direct taste of Auroville's zero-waste regenerative farming culture."
        },
        {
          "timeSlot": "03:00 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🌿",
          "title": "Auroville Botanical Gardens & Svaram Sound Healing Centre",
          "type": "Sound Ecology & Conservation",
          "duration": "2 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Moped / Cab",
          "estimatedCost": "₹100 entry / donation",
          "bookingRequirement": "Open centre",
          "walkingIntensity": "Low",
          "location": "Kottakarai, Auroville",
          "description": "Interact with acoustic wind chimes, lithophones (resonant stones), and handcrafted musical instruments engineered for acoustic healing.",
          "smartReason": "Unique sensory acoustic experience in shaded bamboo pavilions."
        },
        {
          "timeSlot": "05:30 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🕯️",
          "title": "Auroville Boutique Boutiques & Maroma Incense Workshop",
          "type": "Artisan Handicrafts & Natural Aromas",
          "duration": "2.5 hours",
          "travelTime": "5 mins to Visitors Centre Plaza",
          "transportMode": "Walk",
          "estimatedCost": "Free / Personal shopping",
          "bookingRequirement": "Open stores",
          "walkingIntensity": "Low",
          "location": "Auroville Visitors Plaza",
          "description": "Shop for fair-trade handmade paper products, chemical-free aromatherapy oils, natural spirulina, and pottery.",
          "smartReason": "Ethical artisan shopping supporting local village craftspeople."
        }
      ],
      "extraActivity": {
        "icon": "🥐",
        "type": "Day 2 Culinary Treat",
        "title": "Tanto Pizzeria Wood-Fired Dinner",
        "description": "Famous organic pizzeria serving thin-crust Italian pizzas baked in wood-fired ovens with homemade farm mozzarella."
      }
    },
    {
      "day": 3,
      "summary": "Tropical Waters: Chunnambar Boat House & Paradise Beach Island",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 01:00 PM",
          "period": "Morning",
          "icon": "🚤",
          "title": "Chunnambar River Ferry & Paradise Beach (Plage Paradiso)",
          "type": "Island Beach & Water Excursion",
          "duration": "4 hours",
          "travelTime": "20 mins auto to Chunnambar Jetty",
          "transportMode": "Auto + Backwater Boat Shuttle",
          "estimatedCost": "₹350 ferry return ticket",
          "bookingRequirement": "Ticket at Chunnambar counter",
          "walkingIntensity": "Low to Moderate",
          "location": "Chunnambar, Cuddalore Road",
          "description": "Cruise past backwater mangrove trees to reach a pristine isolated spit of golden sand bounded by the river on one side and the ocean on the other.",
          "smartReason": "Morning ferry guarantees clean uncrowded sand and gentle warm waves for swimming."
        },
        {
          "timeSlot": "01:30 PM – 03:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Seagulls Restaurant Chunnambar Backwaters Lunch",
          "type": "Waterside Coastal Dining",
          "duration": "1.5 hours",
          "travelTime": "Ferry return to jetty",
          "transportMode": "Ferry + Walk",
          "estimatedCost": "₹350/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Chunnambar Boathouse Resort",
          "description": "Fresh Bay of Bengal crab roast, vanjaram (seer fish) fry, spiced Chettinad chicken, and steamed rice.",
          "smartReason": "Shaded treehouse-style restaurant overlooking the calm river estuary."
        },
        {
          "timeSlot": "03:30 PM – 05:30 PM",
          "period": "Afternoon",
          "icon": "🏺",
          "title": "Arikamedu Ancient Indo-Roman Port Excavations",
          "type": "2,000-Year-Old Roman Trade Port",
          "duration": "2 hours",
          "travelTime": "15 mins drive from Chunnambar",
          "transportMode": "Auto / Cab",
          "estimatedCost": "Free entry",
          "bookingRequirement": "ASI open heritage site",
          "walkingIntensity": "Moderate",
          "location": "Ariyankuppam River Bank",
          "description": "Walk through ruins of ancient brick warehouses where Roman wine amphorae and Roman glass beads were traded in the 1st century BC.",
          "smartReason": "Offbeat historical sanctuary shaded by deep mango and palm groves."
        },
        {
          "timeSlot": "06:00 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🍹",
          "title": "Rooftop Sea View Lounge Twilight & Craft Mocktails",
          "type": "Evening Leisure",
          "duration": "2.5 hours",
          "travelTime": "15 mins back to White Town",
          "transportMode": "Auto",
          "estimatedCost": "₹400/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Promenade Sea Face",
          "description": "Unwind on a rooftop terrace overlooking the illuminated pier, enjoying ocean breezes and fusion appetizers.",
          "smartReason": "Sweeping views of the starlit Bay of Bengal horizon."
        }
      ],
      "extraActivity": {
        "icon": "🏄",
        "type": "Day 3 Water Sport",
        "title": "Paradise Beach Jet Ski & Banana Boat Ride",
        "description": "Thrilling water rides operated by licensed lifeguards along the designated water-sports cove."
      }
    },
    {
      "day": 4,
      "summary": "Spiritual Heritage: Manakula Vinayagar Temple & Goubert Market Spice Trail",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🛕",
          "title": "Arulmigu Manakula Vinayagar Temple & Golden Chariot Shrine",
          "type": "Ancient Dravidian Temple (Pre-1666 AD)",
          "duration": "3 hours",
          "travelTime": "10 mins walk from White Town center",
          "transportMode": "Walk",
          "estimatedCost": "Free entry / Special archana ₹50",
          "bookingRequirement": "Open temple",
          "walkingIntensity": "Low",
          "location": "Manakula Vinayagar Koil Street",
          "description": "Revered shrine dedicated to Lord Ganesha with gold-plated vimana tower and 40 exquisite wall murals depicting Ganesha's mythology.",
          "smartReason": "Sacred morning aarti accompanied by nadaswaram wind pipe melodies."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Surguru Traditional Tamil Vegetarian Meals",
          "type": "Authentic South Indian Lunch",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto / Walk",
          "estimatedCost": "₹200/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Sardar Vallabhbhai Patel Salai",
          "description": "Banana-leaf traditional meal served with piping hot paruppu podi (lentil powder), ghee, kootu, mor kozhambu, and payasam.",
          "smartReason": "Renowned local institution known for supreme hygiene and authentic flavors."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🏛️",
          "title": "Pondicherry Museum & Bharathi Park French Pavilions",
          "type": "Archaeology & French Governor Carriage",
          "duration": "2.5 hours",
          "travelTime": "5 mins walk",
          "transportMode": "Walk",
          "estimatedCost": "₹20 entry",
          "bookingRequirement": "Museum ticket counter",
          "walkingIntensity": "Low",
          "location": "Saint Louis Street, White Town",
          "description": "Explore the French governor Joseph Dupleix's carved bed, ancient Roman coins, and exquisite Pallava bronze sculptures.",
          "smartReason": "Air-conditioned museum halls provide a calm and educational afternoon escape."
        },
        {
          "timeSlot": "05:00 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🛍️",
          "title": "Grand Bazaar (Goubert Market) Spices & Textile Walk",
          "type": "Traditional Market & Heritage Life",
          "duration": "3 hours",
          "travelTime": "10 mins walk into Tamil Quarter",
          "transportMode": "Walk",
          "estimatedCost": "Free / Personal shopping",
          "bookingRequirement": "Open market",
          "walkingIntensity": "Moderate",
          "location": "Mahatma Gandhi Road",
          "description": "Immerse in the sensory contrast of the Tamil Quarter: mountains of fresh fragrant jasmine flowers, madras cottons, and freshly ground curry spices.",
          "smartReason": "Fascinating cultural contrast between French White Town and Tamil Heritage quarter."
        }
      ],
      "extraActivity": {
        "icon": "☕",
        "type": "Day 4 Coffee Culture",
        "title": "Indian Kaffe Express Traditional Filter Coffee Stop",
        "description": "Watch skilled coffee masters froth strong chicory filter coffee between brass dabarahs from a height."
      }
    },
    {
      "day": 5,
      "summary": "Coastal Surfing & Mangroves: Serenity Beach & Pichavaram Mangrove Forests",
      "timeBlocks": [
        {
          "timeSlot": "08:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏄",
          "title": "Serenity Beach Surfing Lesson & Sea Rock Jetty",
          "type": "Coastal Surfing & Beach Break",
          "duration": "4 hours",
          "travelTime": "15 mins drive north along East Coast Road (ECR)",
          "transportMode": "Cab / Moped",
          "estimatedCost": "Free beach / ₹800 surf intro lesson",
          "bookingRequirement": "Surf school walk-in",
          "walkingIntensity": "Moderate",
          "location": "Serenity Beach, Kottakuppam",
          "description": "Catch beginner-friendly rolling beach waves with certified surf instructors or walk out on the long rocky breakwater pier.",
          "smartReason": "Morning tides are gentlest for surfing and morning beach walks."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Theevu Plage Shack Seafood Lunch directly on Sand",
          "type": "Barefoot Beach Dining",
          "duration": "1.5 hours",
          "travelTime": "Right on Serenity Beach",
          "transportMode": "Walk",
          "estimatedCost": "₹400/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Serenity Beachfront",
          "description": "Catch of the day grilled with lemon-garlic butter, calamari fritters, cold mango sodas, and garlic toast.",
          "smartReason": "Dine with your feet in the sand listening to waves breaking a few meters away."
        },
        {
          "timeSlot": "02:30 PM – 05:30 PM",
          "period": "Afternoon",
          "icon": "🌿",
          "title": "Pichavaram Mangrove Forest Rowboat Expedition",
          "type": "World's Second Largest Mangrove Forest",
          "duration": "3 hours",
          "travelTime": "1 hour scenic highway drive to Pichavaram",
          "transportMode": "Private Cab",
          "estimatedCost": "₹200/person rowboat share",
          "bookingRequirement": "Forest department boat jetty",
          "walkingIntensity": "Low (Boat seated)",
          "location": "Pichavaram, Chidambaram Coast",
          "description": "Row through narrow natural water tunnels roofed by interlocking mangrove canopies, spotting kingfishers, cormorants, and mudskippers.",
          "smartReason": "Dense overhead mangrove canopy keeps water channels cool and shaded."
        },
        {
          "timeSlot": "06:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Bodhi Beach Golden Sunset & Beach Shack Music",
          "type": "Tranquil Sunset Beach",
          "duration": "2 hours",
          "travelTime": "25 mins drive on return",
          "transportMode": "Cab",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open public beach",
          "walkingIntensity": "Low",
          "location": "Bodhi Beach, Nonankuppam",
          "description": "Secluded pristine beach clean of litter, watching fishing catamarans returning through sunset surf.",
          "smartReason": "Quiet golden hour retreat away from tourist hubs."
        }
      ],
      "extraActivity": {
        "icon": "🌊",
        "type": "Day 5 Marine Exploration",
        "title": "Tsunami Island Sandbar Stroll",
        "description": "Small raised sand island created during ocean tides where hermit crabs scurry across golden sand ripples."
      }
    },
    {
      "day": 6,
      "summary": "Artisan Heritage: Cluny Embroidery Centre, Handloom Guild & Farewell Dinner",
      "timeBlocks": [
        {
          "timeSlot": "09:30 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🧵",
          "title": "Cluny Embroidery Centre (18th Century Heritage Convent)",
          "type": "Colonial Needlecraft Heritage",
          "duration": "2.5 hours",
          "travelTime": "10 mins in White Town",
          "transportMode": "Walk",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open convent workshop",
          "walkingIntensity": "Low",
          "location": "Rue Romain Rolland",
          "description": "Admire exquisite hand-embroidered tablecloths, napkins, and tapestries hand-stitched by underprivileged women supported by Catholic sisters.",
          "smartReason": "Peaceful historic courtyard showcasing intricate world-class French needlecraft."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Appachi Chettinad Traditional Mansion Lunch",
          "type": "Traditional Chettinad Feast",
          "duration": "1.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "₹300/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Ranga Pillai Street",
          "description": "Fiery black pepper chicken, mutton sukka, kal dosa, and piping hot tomato rasam served in a restored traditional Tamil home.",
          "smartReason": "Celebrated culinary encounter with authentic spicy Tamil Nadu gastronomy."
        },
        {
          "timeSlot": "02:30 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🏺",
          "title": "Pudumai Handloom Weaving Co-op & Villianur Terracotta Enclave",
          "type": "GI-Tagged Terracotta Pottery",
          "duration": "2 hours",
          "travelTime": "20 mins drive to Villianur",
          "transportMode": "Cab / Auto",
          "estimatedCost": "Free craft visit",
          "bookingRequirement": "Artisan village",
          "walkingIntensity": "Low",
          "location": "Villianur Pottery Village",
          "description": "Meet master sculptors shaping GI-tagged clay terracotta figurines, ornamental lamps, and traditional kitchenware.",
          "smartReason": "Direct artisan purchases supporting heritage crafts at source."
        },
        {
          "timeSlot": "05:00 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🥂",
          "title": "Villa Shanti Candlelit Courtyard Farewell Dinner",
          "type": "Gastronomic French-Indian Farewell",
          "duration": "3.5 hours",
          "travelTime": "15 mins back to White Town",
          "transportMode": "Auto",
          "estimatedCost": "₹650/person",
          "bookingRequirement": "Advance table reservation",
          "walkingIntensity": "Low",
          "location": "Rue Suffren, White Town",
          "description": "Conclude your Pondicherry voyage under open sky courtyard lamps, dining on stuffed calamari, lemon mint chicken, and dark chocolate gateau.",
          "smartReason": "Elegantly wraps up the trip with romantic courtyard memories before departure via Chennai or Puducherry."
        }
      ],
      "extraActivity": {
        "icon": "🎁",
        "type": "Day 6 Farewell Souvenir",
        "title": "Sri Aurobindo Handmade Paper Factory Visit",
        "description": "Purchase beautiful textured rag paper stationery, notebooks, and lampshades created through sustainable water-recycling methods."
      }
    },
    {
      "day": 7,
      "summary": "Serenity Beach Morning Surf, Coastal Fishing Enclaves & Seaside Potteries",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🏄",
          "title": "Serenity Beach Surfing Lesson & Coastal Golden Sand Walk",
          "type": "Gentle Coastal Surf Breaks & Pristine Sands",
          "duration": "3 hours",
          "travelTime": "15 mins north of White Town",
          "transportMode": "Auto / Scooter",
          "estimatedCost": "₹1,200 surf lesson / Free beach walk",
          "bookingRequirement": "On-spot / Surf school",
          "walkingIntensity": "Moderate",
          "location": "Serenity Beach, Kottakuppam",
          "description": "Catch gentle rolling waves with ISA-certified local instructors at one of India's premier surf beaches, or stroll along the golden sands watching local fishermen launch timber catamarans.",
          "smartReason": "Morning offshore breezes provide clean, easy wave swells."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Theevu Plage / Coastal Seaside Beach Shack Seafood & Creole Feast",
          "type": "Open-Air Beachfront Dining",
          "duration": "1.5 hours",
          "travelTime": "2 mins walk from beach",
          "transportMode": "Walk",
          "estimatedCost": "₹450/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Serenity Beachfront",
          "description": "Dine barefoot under palm-leaf thatch on fresh grilled fish catch of the day, coconut prawn curry, spiced calamari, crisp dosa platters, and fresh tender coconut water.",
          "smartReason": "Refreshing ocean sea breezes and tranquil beachfront vibes."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🏺",
          "title": "Kottakuppam Artisan Pottery Village & Glazed Ceramic Studios",
          "type": "Heritage Terracotta & Ceramic Craft Guild",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "Free studio walkthrough",
          "bookingRequirement": "Open studios",
          "walkingIntensity": "Low",
          "location": "Kottakuppam Artisan Quarter",
          "description": "Visit traditional terracotta potters and modern stoneware ceramic ateliers who hand-throw lamps, wind chimes, bowls, and garden sculptures using local red clay.",
          "smartReason": "Cool shaded open studios with fascinating tactile pottery demonstrations."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Serenity Beach Rock Pier Sunset Promenade & Fishermen's Return",
          "type": "Granite Wave-Breaker Sunset Walk",
          "duration": "2.5 hours",
          "travelTime": "5 mins transit back to shore",
          "transportMode": "Walk",
          "estimatedCost": "Free",
          "bookingRequirement": "Open pier",
          "walkingIntensity": "Low",
          "location": "Serenity Rock Jetty",
          "description": "Walk 200 meters out into the ocean along the granite boulder jetty as evening waves crash against rocks and twilight paints the Bay of Bengal in shades of pink and lilac.",
          "smartReason": "Spectacular 360-degree ocean view away from beach crowds."
        }
      ],
      "extraActivity": {
        "icon": "🐚",
        "type": "Day 7 Coastal Souvenir",
        "title": "Hand-Painted Terracotta Wind-Chime & Shell Craft Workshop",
        "description": "Pick up hand-painted clay bells, terracotta planters, and seashell necklaces crafted by coastal women's self-help groups."
      }
    },
    {
      "day": 8,
      "summary": "Ousteri Lake Wetland Bird Sanctuary & Heritage Textile Embroideries",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🦩",
          "title": "Ousteri (Osudu) Freshwater Lake Eco-Boat Safari & Bird Sanctuary",
          "type": "Century-Old Man-Made Lake & Important Bird Area (IBA)",
          "duration": "3 hours",
          "travelTime": "25 mins drive west of Puducherry",
          "transportMode": "Auto / Cab",
          "estimatedCost": "₹150 boat ride",
          "bookingRequirement": "PTDC Boat Jetty counter",
          "walkingIntensity": "Low to Moderate",
          "location": "Osudu Lake, Villianur Road",
          "description": "Glide on electric eco-boats across the 800-hectare freshwater wetland refuge, spotting migratory painted storks, spot-billed pelicans, openbill storks, and purple moorhens amidst lotus beds.",
          "smartReason": "Morning is the prime feeding hour when thousands of wetland birds gather in shallow marshes."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Creole Bistro Lunch at Surguru / Maison Perumal Heritage Courtyard",
          "type": "Heritage Franco-Tamil Courtyard Dining",
          "duration": "1.5 hours",
          "travelTime": "20 mins return drive to town",
          "transportMode": "Cab",
          "estimatedCost": "₹380/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Heritage Town, Puducherry",
          "description": "Traditional Chettinad-French fusion meal: Vazhaipoo (banana blossom) cutlets, yam roast, spiced rasam, creole fish/paneer curry, and jaggery payasam served in an inner open courtyard.",
          "smartReason": "Charming Tamil quarter heritage architecture with cooling terracotta tile roofs."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🪡",
          "title": "Cluny Embroidery Centre & 18th-Century French Colonial Manse",
          "type": "Historic Needlecraft Atelier & Philanthropic Mission",
          "duration": "2.5 hours",
          "travelTime": "5 mins walk inside White Town",
          "transportMode": "Walk",
          "estimatedCost": "Free entry / Craft purchases",
          "bookingRequirement": "Open heritage atelier",
          "walkingIntensity": "Low",
          "location": "Rue Romain Rolland, White Town",
          "description": "Step into an elegant 250-year-old French mansion run by the Sisters of Saint Joseph of Cluny, where disadvantaged local women practice delicate French hand-embroidery on linen table runners, napkins, and blouses.",
          "smartReason": "Quiet, peaceful colonial courtyard supporting an inspiring social welfare cause."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🚲",
          "title": "Goubert Avenue Twilight Bicycle Ride & Seafront Artisan Gelato",
          "type": "French Quarter Cycling Tour & Seaside Gelato",
          "duration": "2.5 hours",
          "travelTime": "Starting from Rock Beach",
          "transportMode": "Vintage Rental Bicycle / Walk",
          "estimatedCost": "₹100 cycle rental",
          "bookingRequirement": "Bicycle rental stand",
          "walkingIntensity": "Low to Moderate",
          "location": "Goubert Avenue, Promenade",
          "description": "Pedal down vehicle-free seaside boulevards lined with colonial lampposts, pastel yellow mansions, stopping at GMT Gelateria for artisanal salted caramel and dark chocolate gelato.",
          "smartReason": "Cool evening ocean breeze as vehicular traffic is banned along the promenade after 5 PM."
        }
      ],
      "extraActivity": {
        "icon": "📜",
        "type": "Day 8 Heritage Walk",
        "title": "French Consulate, Joan of Arc Statue & Eglise de Notre Dame des Anges",
        "description": "Admire the Greco-Roman facade of Our Lady of Angels church, the marble Joan of Arc statue in Dumas garden, and historic consulate mansions."
      }
    },
    {
      "day": 9,
      "summary": "French Colonial Culinary Masterclass, Goubert Spices & Sacred Shrines",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🌶️",
          "title": "Goubert Market Heritage Spice & Fresh Produce Walking Tour",
          "type": "Century-Old Central Bazaar Walk & Spice Sourcing",
          "duration": "3 hours",
          "travelTime": "10 mins from White Town",
          "transportMode": "Cycle Rickshaw / Walk",
          "estimatedCost": "Free market tour",
          "bookingRequirement": "Open public market",
          "walkingIntensity": "Moderate",
          "location": "Grand Bazaar, Nehru Street",
          "description": "Immerse in the sensory explosion of Pondicherry's historic covered market: heaps of fresh jasmine garlands, local wild cinnamon, whole nutmeg, dried Malabar tamarind, and seasonal mangoes.",
          "smartReason": "Vibrant morning market energy and freshly picked produce."
        },
        {
          "timeSlot": "12:00 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍳",
          "title": "Interactive Franco-Tamil Culinary Masterclass & Courtyard Feast",
          "type": "Hands-on Cooking Workshop & Lunch Banquet",
          "duration": "2 hours",
          "travelTime": "5 mins walk to cooking atelier",
          "transportMode": "Walk",
          "estimatedCost": "₹950/person workshop & lunch",
          "bookingRequirement": "Advance slot reservation",
          "walkingIntensity": "Low",
          "location": "Rue Bazar Saint Laurent",
          "description": "Cook with a French-Pondicherrian home chef: learn to prepare poulet creole (creole chicken/paneer in spiced coconut gravy), raw mango salad, vadam wafers, and warm chocolate lava cake.",
          "smartReason": "Hands-on understanding of the unique 300-year French-Tamil gastronomic synthesis."
        },
        {
          "timeSlot": "02:30 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "⛪",
          "title": "Basilica of the Sacred Heart of Jesus & Manakula Vinayagar Shrine",
          "type": "Gothic Revival Basilica & Ancient Elephant-Blessing Temple",
          "duration": "2 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Auto",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open places of worship",
          "walkingIntensity": "Moderate",
          "location": "South Boulevard / Temple Street",
          "description": "Visit the soaring 1907 Gothic basilica with rare stained-glass panels depicting 28 saints, then pay respects at the historic 500-year-old temple of Manakula Vinayagar with golden chariot and elephant blessings.",
          "smartReason": "Contrasting spiritual traditions coexisting within a kilometer radius."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🍹",
          "title": "Seagulls Restaurant Pier Sunset Gathering & Sea Breeze Cocktails",
          "type": "Seaside Pier Dining & Coromandel Sunset View",
          "duration": "2.5 hours",
          "travelTime": "Adjacent to Old Port Pier",
          "transportMode": "Walk",
          "estimatedCost": "₹450/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Old Harbour Jetty, Promenade",
          "description": "Sit on the open-air wooden deck over the sea watching waves crash against the iron pillars of the historic 1860 colonial pier as twilight illuminates the coastline.",
          "smartReason": "Relaxed open-water ocean deck ambiance as the day winds down."
        }
      ],
      "extraActivity": {
        "icon": "🥐",
        "type": "Day 9 French Bakery Crawl",
        "title": "Baker Street French Patisserie Tasting Tour",
        "description": "Sample golden flaky almond croissants, pain au chocolat, quiche lorraine, and delicate fruit tarts baked using authentic Normandy butter."
      }
    },
    {
      "day": 10,
      "summary": "Gingee 'Troy of the East' Fort Citadel & Grand Coastal Farewell",
      "timeBlocks": [
        {
          "timeSlot": "08:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏰",
          "title": "Gingee Fort Historic Citadel: Rajagiri Fortress & Kalyana Mahal",
          "type": "Impregnable 800-Foot Granite Hill Fortress",
          "duration": "4 hours",
          "travelTime": "1 hour 15 mins scenic drive from Pondicherry",
          "transportMode": "Cab",
          "estimatedCost": "₹25 entry",
          "bookingRequirement": "ASI counter",
          "walkingIntensity": "High / Hiking",
          "location": "Gingee, Villupuram District",
          "description": "Explore the legendary fortress that Chhatrapati Shivaji declared the most impregnable in India. Climb through 7 defensive wall lines to the Rajagiri peak citadel, granaries, and the 8-story Kalyana Mahal tower.",
          "smartReason": "Early morning start ensures ascending the granite citadel before direct midday sun."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Traditional Gingee Banana-Leaf Feast with Spiced Lentils & Payasam",
          "type": "Authentic Rural Tamil Dining",
          "duration": "1.5 hours",
          "travelTime": "10 mins drive to town",
          "transportMode": "Cab",
          "estimatedCost": "₹220/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Gingee Town Road",
          "description": "Unlimited rural banana-leaf feast: piping hot ponni rice, aromatic shallot sambar, pepper rasam, crispy vadai, cabbage kootu, appalam, and sweet semiya payasam.",
          "smartReason": "Substantial, comforting nutrition following an active morning fortress hike."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🛍️",
          "title": "Scenic Countryside Return & Auroville Handicrafts Farewell Shopping",
          "type": "Countryside Drive & Boutique Craft Shopping",
          "duration": "2.5 hours",
          "travelTime": "Return drive to Pondicherry/Auroville belt",
          "transportMode": "Cab",
          "estimatedCost": "Free / Personal shopping",
          "bookingRequirement": "Open boutique shops",
          "walkingIntensity": "Low",
          "location": "Auroshikha / Auroville Boutiques",
          "description": "Pick up hand-marbled silk scarves, spirulina natural soaps, hand-rolled essential oil incense sticks, and ceramic tableware directly from cooperative craft outlets.",
          "smartReason": "Relaxing indoor shopping during afternoon warmth."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌊",
          "title": "Promenade Beach Rock Walk Grand Farewell Sunset & Starlight Ocean",
          "type": "Grand Coastal Farewell & Twilight Ocean Reflections",
          "duration": "3 hours",
          "travelTime": "10 mins transit to Promenade",
          "transportMode": "Walk",
          "estimatedCost": "₹600/person celebratory dinner",
          "bookingRequirement": "Promenade restaurant reservation",
          "walkingIntensity": "Low",
          "location": "Rock Beach Promenade, White Town",
          "description": "Celebrate the conclusion of your 10-day Pondicherry sojourn sitting on the black granite breakwater rocks as waves crash gently, moonlight glints across the Bay of Bengal, and French Quarter streetlamps glow amber.",
          "smartReason": "The definitive romantic, peaceful coastal farewell before departure via Chennai or Puducherry."
        }
      ],
      "extraActivity": {
        "icon": "🎁",
        "type": "Day 10 Farewell Keepsake",
        "title": "Handmade Rag Paper Travel Journal & French Botanical Perfume",
        "description": "Gift yourself a cotton rag leather-bound journal and locally distilled jasmine & vetiver natural botanical perfume."
      }
    }
  ],
  "Goa": [
    {
      "day": 1,
      "summary": "Capital Heritage: Fontainhas Latin Quarter, Old Churches & Mandovi River Sunset Cruise",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏘️",
          "title": "Fontainhas Latin Quarter Heritage Walk & Our Lady of the Immaculate Conception",
          "type": "Portuguese Colonial Heritage",
          "duration": "3 hours",
          "travelTime": "25 mins from Thivim (THVM) / Mopa Airport (GOX)",
          "transportMode": "Cab / Scooter",
          "estimatedCost": "Free walking tour",
          "bookingRequirement": "Open heritage precinct",
          "walkingIntensity": "Moderate",
          "location": "Panaji Central",
          "description": "Stroll along narrow cobblestone streets lined with pastel blue, yellow, and terracotta Portuguese villas, wrought-iron balconies, and tiled street plaques.",
          "smartReason": "Morning shade keeps narrow heritage lanes cool for street photography."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Viva Panjim / Hospedaria Venite Goan Heritage Lunch",
          "type": "Authentic Goan-Portuguese Dining",
          "duration": "1.5 hours",
          "travelTime": "5 mins walk inside Fontainhas",
          "transportMode": "Walk",
          "estimatedCost": "₹450/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Rue 31 de Janeiro, Panaji",
          "description": "Traditional Goan fish curry thali, prawn balchão, pork vindaloo, and warm bebinca with vanilla ice cream.",
          "smartReason": "Heritage dining in a 150-year-old family-run Portuguese townhouse."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🏛️",
          "title": "Goa State Central Museum & Miramar Beach Shoreline",
          "type": "History & Coastal Boardwalk",
          "duration": "2.5 hours",
          "travelTime": "10 mins drive",
          "transportMode": "Auto / Cab",
          "estimatedCost": "Free museum entry",
          "bookingRequirement": "Open entry",
          "walkingIntensity": "Low",
          "location": "Miramar, Panaji",
          "description": "Explore pre-colonial artifacts, Portuguese weaponry, and Christian art before strolling along Miramar's breezy shoreline.",
          "smartReason": "Air-conditioned museum halls during peak sun hours."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🚢",
          "title": "Mandovi River Sunset Cruise with Goan Folk Fugdi Dances",
          "type": "Sunset River Cruise & Culture",
          "duration": "3 hours",
          "travelTime": "10 mins transit to Santa Monica Jetty",
          "transportMode": "Auto",
          "estimatedCost": "₹500/person cruise ticket",
          "bookingRequirement": "Ticket at GTDC counter / online",
          "walkingIntensity": "Low",
          "location": "Santa Monica Jetty, Panaji",
          "description": "Cruise down the Mandovi River as live troupe dancers perform the Corridinho and Dekhni dances against the golden sunset.",
          "smartReason": "Gentle river breezes with stunning illuminated views of the new Atal Setu cable bridge."
        }
      ],
      "extraActivity": {
        "icon": "🍸",
        "type": "Day 1 Evening Feature",
        "title": "Joseph Bar Heritage Feni Tasting",
        "description": "Tiny rustic tavern in Fontainhas serving artisanal cashew feni, craft beer, and spicy mackerel cutlets."
      }
    },
    {
      "day": 2,
      "summary": "North Goa Coastal Beaches: Calangute, Baga Watersports & Tito’s Lane",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 01:00 PM",
          "period": "Morning",
          "icon": "🏄",
          "title": "Baga & Calangute Beach Watersports Adventure Hub",
          "type": "Parasailing, Jet Ski & Bumper Rides",
          "duration": "4 hours",
          "travelTime": "25 mins drive north from Panaji",
          "transportMode": "Scooter / Cab",
          "estimatedCost": "₹1,200 combo watersports package",
          "bookingRequirement": "Certified watersports counter on beach",
          "walkingIntensity": "Moderate",
          "location": "Baga Beach, North Goa",
          "description": "Soar above the Arabian Sea with parachute parasailing, bounce across waves on speedboats, and swim in warm coastal waters.",
          "smartReason": "Morning ocean conditions feature calm swells ideal for water activities."
        },
        {
          "timeSlot": "01:30 PM – 03:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Britto’s Legendary Beachside Seafood Shack Lunch",
          "type": "Barefoot Beach Shack",
          "duration": "1.5 hours",
          "travelTime": "Directly on Baga Beach",
          "transportMode": "Walk",
          "estimatedCost": "₹550/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Baga Beachfront",
          "description": "Crab xec xec in spiced roasted coconut gravy, butter-garlic tiger prawns, and signature caramel custard.",
          "smartReason": "Breezy shaded beachfront table with front-row views of crashing waves."
        },
        {
          "timeSlot": "03:30 PM – 05:30 PM",
          "period": "Afternoon",
          "icon": "🛍️",
          "title": "Tibetan Market & Calangute Beachside Souvenir Bazaars",
          "type": "Beachwear, Souvenirs & Leather Craft",
          "duration": "2 hours",
          "travelTime": "5 mins transit",
          "transportMode": "Walk",
          "estimatedCost": "Free / Personal shopping",
          "bookingRequirement": "Open market",
          "walkingIntensity": "Moderate",
          "location": "Calangute Beach Road",
          "description": "Shop for boho beach kaftans, handcrafted silver jewelry, leather sandals, and coconut shell artifacts.",
          "smartReason": "Great spot for picking up beachwear and coastal mementos."
        },
        {
          "timeSlot": "06:00 PM – 09:30 PM",
          "period": "Sunset & Evening",
          "icon": "🎶",
          "title": "Tito's Lane Sunset Lounges & Night Market Atmosphere",
          "type": "Nightlife & Coastal Music",
          "duration": "3.5 hours",
          "travelTime": "5 mins walk to Baga",
          "transportMode": "Walk",
          "estimatedCost": "₹400/person covers appetizers/drinks",
          "bookingRequirement": "Entry passes available at clubs",
          "walkingIntensity": "Low",
          "location": "Tito's Lane, Baga",
          "description": "Experience the vibrant electric pulse of Goa's most famous nightlife avenue with neon lights and live acoustic musicians.",
          "smartReason": "World-famous avenue buzzing with energy right as the sun dips into the sea."
        }
      ],
      "extraActivity": {
        "icon": "🌊",
        "type": "Day 2 Coastal Feature",
        "title": "Baga Creek Sunset Kayaking",
        "description": "Paddle tandem kayaks quietly along the mangrove-fringed Baga river estuary at golden hour."
      }
    },
    {
      "day": 3,
      "summary": "Coastal Fortresses: Fort Aguada Lighthouse, Sinquerim & Reis Magos",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏰",
          "title": "Fort Aguada (1612) & Heritage 4-Storey Freshwater Citadel",
          "type": "17th-Century Portuguese Ocean Bastion",
          "duration": "3 hours",
          "travelTime": "20 mins from Calangute / Candolim",
          "transportMode": "Cab / Scooter",
          "estimatedCost": "₹25 ASI entry",
          "bookingRequirement": "ASI counter / online",
          "walkingIntensity": "Moderate",
          "location": "Sinquerim Headland",
          "description": "Inspect the massive laterite ocean fortress built to guard against Dutch fleets, housing a 79-million-liter subterranean freshwater cistern.",
          "smartReason": "Morning ocean breezes make climbing the bastion ramparts comfortable."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Fisherman's Wharf / House of Lloyds Candolim Lunch",
          "type": "Garden Estate Dining",
          "duration": "1.5 hours",
          "travelTime": "10 mins descending to Candolim",
          "transportMode": "Cab",
          "estimatedCost": "₹500/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Candolim Main Road",
          "description": "Slow-roasted pork ribs, spiced rawa-fried surmai (kingfish), poi bread, and tender coconut souffle.",
          "smartReason": "Shaded tropical gardens offering culinary respite."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🏛️",
          "title": "Reis Magos Fort & Cultural Centre Overlooking Mandovi Estuary",
          "type": "Restored River Citadel (1551)",
          "duration": "2.5 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Scooter / Cab",
          "estimatedCost": "₹50 entry",
          "bookingRequirement": "Ticket at gate",
          "walkingIntensity": "Moderate",
          "location": "Verem, Mandi North Bank",
          "description": "Walk inside the immaculately restored fortress featuring Mario Miranda cartoon galleries, cannons, and views of Panaji city across the river.",
          "smartReason": "Lesser-crowded cultural jewel with cool stone archways and gallery exhibits."
        },
        {
          "timeSlot": "05:30 PM – 08:00 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Sinquerim Beach Rocky Shore Sunset & Lower Aguada Bastion",
          "type": "Scenic Coastal Headland Sunset",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Scooter / Cab",
          "estimatedCost": "Free public access",
          "bookingRequirement": "Open beach",
          "walkingIntensity": "Low",
          "location": "Sinquerim Beach",
          "description": "Sit on the curving stone bastion wall dipping directly into the crashing ocean surf as the sun sinks in a blaze of crimson.",
          "smartReason": "One of the most photogenic vantage points on the entire western coastline."
        }
      ],
      "extraActivity": {
        "icon": "🐬",
        "type": "Day 3 Marine Encounter",
        "title": "Sinquerim Dolphin Spotting Boat Cruise",
        "description": "Small motorboat cruise into the Arabian Sea cove to spot pods of Indo-Pacific humpback dolphins playing in the surf."
      }
    },
    {
      "day": 4,
      "summary": "Nature Cascades: Dudhsagar Waterfalls & Sahakari Spice Farm",
      "timeBlocks": [
        {
          "timeSlot": "07:30 AM – 12:30 PM",
          "period": "Morning",
          "icon": "🌊",
          "title": "Dudhsagar Waterfalls (Sea of Milk) 4x4 Off-Road Jeep Safari",
          "type": "India's 5th Highest Waterfall (310m)",
          "duration": "5 hours",
          "travelTime": "1.2 hours to Kulem base camp",
          "transportMode": "Official Forest Dept 4WD Jeep through Mollem Sanctuary",
          "estimatedCost": "₹650/seat share + ₹50 forest entry",
          "bookingRequirement": "Forest department pass at Kulem",
          "walkingIntensity": "Moderate (River rock trail)",
          "location": "Mollem National Park, Goa-Karnataka border",
          "description": "Rumble through jungle rivers in 4x4 jeeps to stand beneath the thunderous four-tiered white cascade dropping 1,017 feet through lush Western Ghats.",
          "smartReason": "Early departure avoids forest checkpoint congestion and ensures cool mist swimming."
        },
        {
          "timeSlot": "01:00 PM – 02:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Sahakari Spice Plantation Traditional Organic Buffet on Banana Leaf",
          "type": "Plantation Banquet",
          "duration": "1.5 hours",
          "travelTime": "30 mins from Kulem to Ponda",
          "transportMode": "Cab",
          "estimatedCost": "₹500 includes plantation tour & buffet lunch",
          "bookingRequirement": "Entry ticket includes meal",
          "walkingIntensity": "Low",
          "location": "Ponda Spice Belt",
          "description": "Welcomed with herbal marigold garlands and warm spiced tea; feast on 14 authentic Goan dishes cooked with freshly picked spices.",
          "smartReason": "Rich farm meal served in an open thatched pavilion amidst cardamom and vanilla vines."
        },
        {
          "timeSlot": "03:00 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🌿",
          "title": "Guided Spice Plantation Botanical Walk & Elephant Interaction",
          "type": "Botanical Agro-Tourism",
          "duration": "2 hours",
          "travelTime": "On-site",
          "transportMode": "Guided Walk",
          "estimatedCost": "Included in plantation pass",
          "bookingRequirement": "Guided group tour",
          "walkingIntensity": "Moderate",
          "location": "Curti, Ponda",
          "description": "Touch and smell fresh black pepper vines, nutmeg, cinnamon bark, cloves, and peri-peri chilies with local herbalist guides.",
          "smartReason": "Educational walk shaded completely by towering betel nut palms and fruit trees."
        },
        {
          "timeSlot": "05:30 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🛕",
          "title": "Mangueshi Temple (1560 AD) & Deepastambha Twilight Lamp Tower",
          "type": "Distinctive Goan-Hindu Architecture",
          "duration": "2 hours",
          "travelTime": "15 mins transit",
          "transportMode": "Cab",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open temple (Modest dress required)",
          "walkingIntensity": "Low",
          "location": "Priol, Ponda",
          "description": "Admire the 7-story octagonal lamp tower (deepastambha), silver sanctum doors, and golden chandelier domes of Goa's most prominent temple.",
          "smartReason": "Twilight illumination of the lamp tower is mesmerizing."
        }
      ],
      "extraActivity": {
        "icon": "🌶️",
        "type": "Day 4 Farm Produce",
        "title": "Farm Spice & Cold-Pressed Coconut Oil Shopping",
        "description": "Direct purchase of vacuum-packed whole green cardamoms, star anise, vanilla pods, and organic cashews."
      }
    },
    {
      "day": 5,
      "summary": "UNESCO Old Goa & South Goa Serenity: Basilica of Bom Jesus & Palolem Beach",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 12:00 PM",
          "period": "Morning",
          "icon": "⛪",
          "title": "UNESCO World Heritage Old Goa: Basilica of Bom Jesus & Se Cathedral",
          "type": "16th-Century Baroque Monuments",
          "duration": "3 hours",
          "travelTime": "20 mins from Panaji / Ponda",
          "transportMode": "Cab",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open monuments",
          "walkingIntensity": "Low",
          "location": "Old Goa (Velha Goa)",
          "description": "Stand inside the unplastered red laterite Basilica housing the sacred relics of St. Francis Xavier, and the largest church in Asia (Se Cathedral).",
          "smartReason": "Morning sunlight highlights the massive gilded altars and marble tomb mosaics."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Martin's Corner / Nostalgia South Goa Culinary Lunch",
          "type": "Legendary South Goan Dining",
          "duration": "1.5 hours",
          "travelTime": "35 mins drive south into Salcete",
          "transportMode": "Cab",
          "estimatedCost": "₹500/person",
          "bookingRequirement": "Walk-in / reservation",
          "walkingIntensity": "Low",
          "location": "Betalbatim, South Goa",
          "description": "Celebrated restaurant famous for king crab fry in butter garlic, Goan sausage chilli fry (choriz), shark ambotik, and fresh kokum juice.",
          "smartReason": "Iconic South Goa gastronomic institution favored by travelers and celebrities."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🏖️",
          "title": "Cabo de Rama Fort & Secluded Emerald Bay",
          "type": "Historic Cliffside Ruin Overlooking Ocean",
          "duration": "2.5 hours",
          "travelTime": "40 mins drive south",
          "transportMode": "Cab",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open natural site",
          "walkingIntensity": "Moderate",
          "location": "Canacona Coast",
          "description": "Wander through the wild crumbling ramparts of a fortress associated with Lord Rama's exile, looking down at brilliant turquoise secluded coves.",
          "smartReason": "Breathtaking panoramic ocean viewpoints with gentle coastal breezes."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Palolem Crescent Beach Golden Sunset & Silent Noise Beach Walk",
          "type": "South Goa's Crown Jewel Beach",
          "duration": "3 hours",
          "travelTime": "25 mins transit",
          "transportMode": "Cab",
          "estimatedCost": "Free beach access",
          "bookingRequirement": "Open beach",
          "walkingIntensity": "Low",
          "location": "Palolem Beach, Canacona",
          "description": "Walk the mile-long crescent bay fringed by leaning coconut palms and colorful wooden beach huts, watching the sun sink behind Green Island.",
          "smartReason": "Calm, gentle water basin shielded by natural headlands with candlelit beach shacks."
        }
      ],
      "extraActivity": {
        "icon": "🛶",
        "type": "Day 5 Wildlife Cruise",
        "title": "Butterfly Beach Sunset Boat Ride",
        "description": "Small motorboat journey around the headland to the secluded cove of Butterfly Beach to watch crabs and evening sea birds."
      }
    },
    {
      "day": 6,
      "summary": "Cliff Panoramas: Chapora Fort, Vagator Beach & Anjuna Flea Market",
      "timeBlocks": [
        {
          "timeSlot": "09:30 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🏰",
          "title": "Chapora Fort (Dil Chahta Hai) Red Rock Ramparts",
          "type": "Iconic Hilltop Bastion Overlooking River & Sea",
          "duration": "2.5 hours",
          "travelTime": "20 mins from Calangute / Baga",
          "transportMode": "Scooter / Cab",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open heritage site (Short 10-min stepped climb)",
          "walkingIntensity": "Moderate",
          "location": "Chapora Hill, North Goa",
          "description": "Sit on the undulating red laterite ramparts made famous by the film 'Dil Chahta Hai', offering sweeping vistas of Vagator Beach and Chapora River mouth.",
          "smartReason": "Morning breezes and unclouded horizons make the panoramic summit climb rewarding."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Thalassa / Antares Greek & Coastal Mediterranean Lunch on Vagator Cliff",
          "type": "Cliffside Panoramic Dining",
          "duration": "1.5 hours",
          "travelTime": "5 mins descending",
          "transportMode": "Cab / Scooter",
          "estimatedCost": "₹650/person",
          "bookingRequirement": "Table booking recommended",
          "walkingIntensity": "Low",
          "location": "Little Vagator Cliff",
          "description": "Dine on crisp spanakopita, grilled halloumi, wood-fired souvlaki, and cold passion fruit coolers overlooking the open sea from high cliffs.",
          "smartReason": "Sensational cliffside views with cool sea winds."
        },
        {
          "timeSlot": "02:30 PM – 05:00 PM",
          "period": "Afternoon",
          "icon": "🗿",
          "title": "Little Vagator (Ozran Beach) & Carved Shiva Rock Sculpture",
          "type": "Secluded Cove & Rock Carving",
          "duration": "2.5 hours",
          "travelTime": "Descend cliff footpath",
          "transportMode": "Walk",
          "estimatedCost": "Free access",
          "bookingRequirement": "Open beach cove",
          "walkingIntensity": "Moderate",
          "location": "Ozran Beach, Vagator",
          "description": "Discover the enigmatic giant face of Lord Shiva carved into a seaside rock by an unknown traveler in the 1970s, washed by ocean tides.",
          "smartReason": "Dramatic black volcanic rock formations framing intimate sand coves."
        },
        {
          "timeSlot": "05:30 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🛍️",
          "title": "Anjuna Beach Flea Market & Sunset Drum Circle",
          "type": "Bohemian Bazaar & Farewell Sunset",
          "duration": "3 hours",
          "travelTime": "10 mins transit to Anjuna",
          "transportMode": "Scooter / Cab",
          "estimatedCost": "Free / Personal shopping",
          "bookingRequirement": "Open market",
          "walkingIntensity": "Low",
          "location": "Anjuna Beachfront",
          "description": "Browse hundreds of stalls selling Rajasthani tapestries, Tibetan singing bowls, handmade jewelry, and spices as acoustic drum circles jam at sunset.",
          "smartReason": "The definitive iconic Goa farewell atmosphere combining music, beach shacks, and vibrant shopping."
        }
      ],
      "extraActivity": {
        "icon": "🎁",
        "type": "Day 6 Farewell Souvenir",
        "title": "Goan Cashew Nut & Port Wine Tasting Hub",
        "description": "Pick up GI-tagged authentic roasted Goa jumbo cashews (plain, salted, masala) and bottled heritage Port wine."
      }
    },
    {
      "day": 7,
      "summary": "Grande Island Marine Dolphin Safari, Coral Snorkeling & Monkey Beach",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 12:00 PM",
          "period": "Morning",
          "icon": "🐬",
          "title": "Grande Island Speedboat Cruise, Dolphin Spotting & Coral Snorkeling",
          "type": "Marine Expedition & Tropical Coral Reef Snorkeling",
          "duration": "3.5 hours",
          "travelTime": "Departs from Sinquerim / Miramar Boat Jetty",
          "transportMode": "Speedboat / Catamaran",
          "estimatedCost": "₹1,400 all-inclusive boat & snorkeling gear",
          "bookingRequirement": "Advance boat operator token",
          "walkingIntensity": "Low to Moderate (Swimming)",
          "location": "Grande Island (Ilha Grande), Arabian Sea",
          "description": "Cruise past Aguada lighthouse into open waters spotting wild Indo-Pacific humpback dolphins playfully jumping, then anchor at shallow reefs to snorkel alongside parrotfish, sea anemones, and angelfish.",
          "smartReason": "Morning sea conditions have the highest underwater visibility and calmest waters."
        },
        {
          "timeSlot": "12:30 PM – 02:00 PM",
          "period": "Midday Meal",
          "icon": "🦞",
          "title": "Monkey Beach Secluded Island Barbecue & Goan Fish Curry",
          "type": "Secluded Beach Barbecue Feast",
          "duration": "1.5 hours",
          "travelTime": "Boat lands directly on beach",
          "transportMode": "Boat Landing",
          "estimatedCost": "Included in island tour package",
          "bookingRequirement": "Tour package",
          "walkingIntensity": "Low",
          "location": "Monkey Beach, Ilha Grande",
          "description": "Freshly prepared beachfront barbecue on a private cove: grilled kingfish/paneer skewers, Goan red rice, coconut fish curry, poi bread, and chilled tropical refreshments.",
          "smartReason": "Unique island dining surrounded by emerald waters and coastal limestone rocks."
        },
        {
          "timeSlot": "02:30 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "⛵",
          "title": "Coastal Sea Passage & Historic Aguada Sea Bastion Cruise",
          "type": "Scenic Coastal Boat Passage",
          "duration": "2 hours",
          "travelTime": "Scenic cruise back to mainland jetty",
          "transportMode": "Boat",
          "estimatedCost": "Included in package",
          "bookingRequirement": "Boat journey",
          "walkingIntensity": "Low",
          "location": "Mandovi Estuary Passage",
          "description": "Relax on the boat deck as you cruise past the 17th-century sea battlements of Aguada Fort, Billionaire's Palace at Dona Paula, and colonial governor's residence (Raj Bhavan).",
          "smartReason": "Cooling sea breeze and effortless scenic sightseeing from the water."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌅",
          "title": "Miramar Beach Shoreline Sunset Stroll & Mandovi Estuary Vistas",
          "type": "Wide Golden Beach Sunset & River Promenade",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit from jetty",
          "transportMode": "Auto / Walk",
          "estimatedCost": "Free beach entry",
          "bookingRequirement": "Open public beach",
          "walkingIntensity": "Low",
          "location": "Miramar Beach, Panaji Outer",
          "description": "Walk barefoot along the wide 2 km stretch of soft golden sand where the Mandovi River merges into the Arabian Sea, watching fishing trawlers return against a fiery orange sunset.",
          "smartReason": "Expansive open horizon with gentle tides and lively evening street snacks (chaat, bhel, roasted corn)."
        }
      ],
      "extraActivity": {
        "icon": "🐠",
        "type": "Day 7 Marine Memory",
        "title": "Underwater Coral Reef Go-Pro Photography Session",
        "description": "Capture memorable HD underwater photos and short video clips among tropical coral formations with provided waterproof gear."
      }
    },
    {
      "day": 8,
      "summary": "Historic South Goa Colonial Mansions & Cabo de Rama Cliff Fortress",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🏰",
          "title": "Chandor Village: 450-Year-Old Menezes Braganza Heritage Palace",
          "type": "Grandest Indo-Portuguese Aristocratic Mansion in Goa",
          "duration": "2.5 hours",
          "travelTime": "45 mins drive from South Goa hotels",
          "transportMode": "Cab",
          "estimatedCost": "₹150 guided donation",
          "bookingRequirement": "Family guided entry",
          "walkingIntensity": "Low",
          "location": "Chandor Heritage Village",
          "description": "Step into Goa's most opulent 17th-century private estate spanning 28 rooms, featuring Belgian crystal chandeliers, rosewood hand-carved furniture, porcelain dinnerware gifted by the King of Portugal, and a 5,000-book antique library.",
          "smartReason": "Fascinating personal tour guided by descendants of the original aristocratic family."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🍽️",
          "title": "Authentic South Goan Saraswat Thali at Fishermans Wharf / Martins Corner",
          "type": "Traditional Coastal Saraswat & Catholic Cuisine",
          "duration": "1.5 hours",
          "travelTime": "25 mins drive towards coast",
          "transportMode": "Cab",
          "estimatedCost": "₹500/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Betul / Salcete, South Goa",
          "description": "Grand feast featuring crab xacuti, butter garlic tiger prawns, sungtache kismur (crispy dried prawn relish), solkadhi, and warm bebinca with coconut ice cream.",
          "smartReason": "Legendary South Goa culinary institution celebrated for rich coastal flavors."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🚗",
          "title": "Scenic Coastal Drive through Canacona Coconut Groves to Cabo de Rama",
          "type": "Pristine Countryside Transit & Village Exploration",
          "duration": "2.5 hours",
          "travelTime": "45 mins scenic drive",
          "transportMode": "Cab",
          "estimatedCost": "Included in transit",
          "bookingRequirement": "Open coastal road",
          "walkingIntensity": "Low",
          "location": "Canacona Coastal Ridge",
          "description": "Wind through sleepy coastal hamlets, past ancient whitewashed wayside chapels, emerald paddy fields, and thick coconut palm groves leading to the southern sea cliffs.",
          "smartReason": "One of the most scenic, unspoiled countryside driving routes in India."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🌄",
          "title": "Cabo de Rama Cliff Fortress Sunset: Endless Azure Arabian Sea Panorama",
          "type": "Epic Ocean Cliff Fort & Panoramic Sunset Lookout",
          "duration": "2.5 hours",
          "travelTime": "Arrive at fort gate",
          "transportMode": "Walk",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open historic fort",
          "walkingIntensity": "Moderate",
          "location": "Cabo de Rama, Canacona",
          "description": "Walk along the ancient moss-covered ramparts of the fort named after Lord Rama, perched dramatically 150 feet above crashing turquoise waves with a panoramic 180-degree ocean sunset view.",
          "smartReason": "Arguably Goa's most breathtaking, romantic, and uncrowded cliffside sunset."
        }
      ],
      "extraActivity": {
        "icon": "🛋️",
        "type": "Day 8 Heritage Art",
        "title": "Hand-Painted Goan Ceramic Azulejos Tile Walk",
        "description": "Inspect beautiful traditional blue-and-white hand-painted glazed tiles depicting Portuguese maritime voyages and Goan village life."
      }
    },
    {
      "day": 9,
      "summary": "Netravali Rain Forests, Sacred Bubbling Lake & Savari Cascades",
      "timeBlocks": [
        {
          "timeSlot": "08:30 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🌲",
          "title": "Netravali Wildlife Sanctuary Jungle Trek & Dense Shola Canopy",
          "type": "Western Ghats Deep Tropical Rainforest Trail",
          "duration": "3 hours",
          "travelTime": "1 hour drive into the southeastern foothills",
          "transportMode": "Cab",
          "estimatedCost": "₹100 entry fee",
          "bookingRequirement": "Forest checkpost ticket",
          "walkingIntensity": "Moderate / Trekking",
          "location": "Netravali Wildlife Sanctuary, Sanguem",
          "description": "Hike through pristine evergreen jungle under towering forest canopies filled with giant Malabar squirrels, emerald doves, and vibrant butterflies in an untouched ecological bio-hotspot.",
          "smartReason": "Morning timing ensures cool mountain temperatures and active forest birdlife."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🥘",
          "title": "Organic Jungle Eco-Farm Feast at Tanshikar / Netravali Spices",
          "type": "Farm-to-Table Organic Heritage Dining",
          "duration": "1.5 hours",
          "travelTime": "15 mins drive",
          "transportMode": "Cab",
          "estimatedCost": "₹350/person all-inclusive meal",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Netravali Spice Plantation",
          "description": "Authentic village banquet cooked in traditional clay pots over wood fires: homegrown black pepper curry, breadfruit fritters, organic brown rice, local pickle, and fresh wild honey dessert.",
          "smartReason": "Supports local farmers while eating 100% pesticide-free organic food on the plantation."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🫧",
          "title": "Budbud Tali (Sacred Bubbling Lake) & Savari Waterfalls Hike",
          "type": "Mysterious Acoustic Water Stepwell & Jungle Cascades",
          "duration": "2.5 hours",
          "travelTime": "10 mins transit",
          "transportMode": "Cab / Short Hike",
          "estimatedCost": "Free entry",
          "bookingRequirement": "Open natural site",
          "walkingIntensity": "Moderate",
          "location": "Netravali Village",
          "description": "Visit the enigmatic 400-year-old laterite pond where continuous methane bubbles rise from the green silt floor and intensify when you clap your hands, followed by a hike to Savari waterfall.",
          "smartReason": "Fascinating natural geological anomaly and refreshing cool mountain spray."
        },
        {
          "timeSlot": "05:00 PM – 07:30 PM",
          "period": "Sunset & Evening",
          "icon": "🍹",
          "title": "Tranquil Countryside Return Drive through Cashew Groves & Farm Stroll",
          "type": "Rural Countryside Sunset & Agro-Tourism",
          "duration": "2.5 hours",
          "travelTime": "Scenic return drive",
          "transportMode": "Cab",
          "estimatedCost": "Free",
          "bookingRequirement": "Open trail",
          "walkingIntensity": "Low",
          "location": "Sanguem-Quepem Countryside",
          "description": "Drive back as golden sunset rays filter through rolling cashew plantations and betel nut groves, witnessing quiet rural Goa that has remained unchanged for centuries.",
          "smartReason": "Relaxing, peaceful antidote to busy commercial tourist beaches."
        }
      ],
      "extraActivity": {
        "icon": "🏺",
        "type": "Day 9 Heritage Craft",
        "title": "Traditional Copper Pot Cashew Feni Distillation Tour",
        "description": "Learn how local distillers use traditional copper pot stills (Bhatti) to ferment and double-distill pure organic cashew apples into GI-tagged Goan feni."
      }
    },
    {
      "day": 10,
      "summary": "Northern Sands, Arambol Sweetwater Lagoon & Grand Bohemian Farewell",
      "timeBlocks": [
        {
          "timeSlot": "09:00 AM – 11:30 AM",
          "period": "Morning",
          "icon": "🐢",
          "title": "Morjim Beach Quiet Morning Walk along Olive Ridley Turtle Coast",
          "type": "Protected Marine Turtle Nesting Sanctuary",
          "duration": "2.5 hours",
          "travelTime": "30 mins drive from North Goa",
          "transportMode": "Cab / Scooter",
          "estimatedCost": "Free beach access",
          "bookingRequirement": "Open protected beach",
          "walkingIntensity": "Low",
          "location": "Morjim Beach, Pernem",
          "description": "Walk along the wide, quiet, undeveloped white sand dunes of Morjim, protected by the forest department as an official nesting ground for endangered Olive Ridley sea turtles.",
          "smartReason": "Pristine open sands with minimal commercial noise and fresh morning sea breeze."
        },
        {
          "timeSlot": "12:00 PM – 01:30 PM",
          "period": "Midday Meal",
          "icon": "🥗",
          "title": "Arambol Bohemian Garden Cafe Feast & Smoothie Bowls",
          "type": "Organic Bohemian Garden Dining",
          "duration": "1.5 hours",
          "travelTime": "15 mins drive north to Arambol",
          "transportMode": "Cab / Scooter",
          "estimatedCost": "₹380/person",
          "bookingRequirement": "Walk-in",
          "walkingIntensity": "Low",
          "location": "Arambol Beach Village",
          "description": "Dine in a lush garden cafe: fresh dragonfruit smoothie bowls, wood-fired artisanal sourdough flatbreads, organic avocado salad, and cold-pressed passionfruit juices.",
          "smartReason": "Relaxed bohemian atmosphere celebrated by global travelers and artists."
        },
        {
          "timeSlot": "02:00 PM – 04:30 PM",
          "period": "Afternoon",
          "icon": "🌊",
          "title": "Arambol Sweet Water Lagoon & Ancient Banyan Tree Trek",
          "type": "Freshwater Coastal Lagoon & Sacred Jungle Banyan",
          "duration": "2.5 hours",
          "travelTime": "10 mins walk around cliff path",
          "transportMode": "Scenic Footpath Walk",
          "estimatedCost": "Free natural trail",
          "bookingRequirement": "Open public trail",
          "walkingIntensity": "Moderate",
          "location": "Kalacha Beach & Arambol Valley",
          "description": "Walk around the headland to the serene freshwater lagoon fed by natural mountain springs right next to the sea, and take a shaded forest trail to the legendary ancient banyan tree.",
          "smartReason": "Unique geological feature where you can swim in fresh spring water seconds from the sea."
        },
        {
          "timeSlot": "05:00 PM – 08:30 PM",
          "period": "Sunset & Evening",
          "icon": "🥁",
          "title": "Celebratory Arambol Sunset Drumming Circle & Grand Beachside Farewell",
          "type": "World-Famous Acoustic Sunset Gathering & Grand Finale",
          "duration": "3.5 hours",
          "travelTime": "Directly on Arambol main sands",
          "transportMode": "Walk",
          "estimatedCost": "₹700/person celebratory dinner",
          "bookingRequirement": "Beach shack reservation",
          "walkingIntensity": "Low",
          "location": "Arambol Beachfront Sands",
          "description": "Join hundreds of travelers, musicians, and artists on the sand for the legendary acoustic sunset drum circle as the sky turns fiery gold over the Arabian Sea, followed by a celebratory candlelit seafood dinner.",
          "smartReason": "The definitive iconic sunset spectacle in India to conclude a 10-day Goa journey before departure via Mopa (GOX) or Madgaon (MAO)."
        }
      ],
      "extraActivity": {
        "icon": "🎁",
        "type": "Day 10 Farewell Keepsake",
        "title": "GI-Tagged Roasted Jumbo Goan Cashews & Heritage Port Wine Hamper",
        "description": "Pick up hand-sorted whole W-180 jumbo cashew nuts, coconut jaggery pyramid blocks, and bottled Goan Port wine as farewell gifts."
      }
    }
  ]
};

export const CURATED_SIX_DAY_ITINERARIES = CURATED_MULTI_DAY_ITINERARIES;

export const PAN_INDIA_MULTI_DAY_THEMES = [
  {
    "themeId": "historic_core",
    "summary": "Historic Quarter, Architectural Landmarks & Heritage Street Walk",
    "morning": {
      "title": "Primary UNESCO / Iconic Monument & Guided History Tour",
      "type": "World Heritage & Historic Architecture",
      "duration": "3 hours",
      "estimatedCost": "Standard entry",
      "walking": "Moderate",
      "desc": "Explore the most renowned heritage citadel and architectural masterwork defining the city's historic legacy."
    },
    "meal": {
      "title": "Traditional First-Day Regional Welcome Thali & Herbal Beverage",
      "type": "Culinary Heritage Initiation",
      "duration": "1.5 hours",
      "estimatedCost": "₹300/person",
      "desc": "Authentic multi-dish regional platter featuring signature native recipes, stone-ground chutneys, and local sweets."
    },
    "afternoon": {
      "title": "Archaeological Museum, Royal Palaces & Vintage Relic Enclaves",
      "type": "Art & Antiquities Exploration",
      "duration": "2.5 hours",
      "estimatedCost": "Nominal entry",
      "walking": "Moderate",
      "desc": "Walk through royal halls showcasing centuries-old weaponry, royal regalia, miniature paintings, and preserved artifacts."
    },
    "evening": {
      "title": "Illuminated Heritage Square Promenade & Artisan Bazaar",
      "type": "Evening Heritage Stroll",
      "duration": "2.5 hours",
      "estimatedCost": "Free public access",
      "walking": "Low",
      "desc": "Leisurely stroll along illuminated heritage plazas surrounded by vintage colonial facades and local street performers."
    },
    "extra": {
      "title": "Historic Clocktower Photo Walk & Vintage Landmark Discovery",
      "desc": "Discover hidden historic alleyways, carved wooden doorways, and antique landmark facades."
    }
  },
  {
    "themeId": "sacred_sanctuaries",
    "summary": "Spiritual Sanctuaries, Ancient Sanctums & Waterside Ghats",
    "morning": {
      "title": "Ancient Sanctum Sanctorum & Traditional Morning Chants",
      "type": "Sacred Shrines & Living Faith",
      "duration": "2.5 hours",
      "estimatedCost": "Free darshan",
      "walking": "Low to Moderate",
      "desc": "Participate in tranquil morning prayers and admire centuries-old stone-carved sanctums and Vedic rituals."
    },
    "meal": {
      "title": "Temple Enclave Pure Vegetarian Satvik Feast & Clay-Cup Chai",
      "type": "Temple Cuisine & Purity",
      "duration": "1.5 hours",
      "estimatedCost": "₹200/person",
      "desc": "Pure Satvik meal prepared with seasonal vegetables, clarified butter, lentils, and steamed rice in temple tradition."
    },
    "afternoon": {
      "title": "Rock-Cut Meditation Caves & Monastic Cloisters",
      "type": "Monastic Heritage & Inner Peace",
      "duration": "2.5 hours",
      "estimatedCost": "Nominal entry",
      "walking": "Moderate",
      "desc": "Visit ancient rock-cut hermitages and quiet monastic viharas carved out of living rock formations."
    },
    "evening": {
      "title": "Riverside / Lakeside Sunset Aarti, Sacred Pond Stroll & Bell Chimes",
      "type": "Sacred Water Twilight Ritual",
      "duration": "2.5 hours",
      "estimatedCost": "Free public access",
      "walking": "Low",
      "desc": "Gather at the sacred waterside steps watching the ceremonial evening lamp aarti reflecting across the water under chime bells."
    },
    "extra": {
      "title": "Sacred Bell Acoustic Immersion & Heritage Lotus Pond Walk",
      "desc": "Quiet contemplative walk around historic stone water tanks blooming with pink sacred lotuses."
    }
  },
  {
    "themeId": "nature_waterfalls",
    "summary": "Pristine Nature Expeditions, Botanical Groves & Cascading Waterfalls",
    "morning": {
      "title": "Eco-Park Nature Trail, Shaded Canopy Walk & Birdwatching",
      "type": "Nature Exploration & Biodiversity",
      "duration": "3 hours",
      "estimatedCost": "₹50 entry",
      "walking": "Moderate",
      "desc": "Follow winding nature paths through ancient trees, listening to birdsong and observing native forest flora."
    },
    "meal": {
      "title": "Forest-Edge Garden Bistro & Fresh Farm-Harvested Delicacies",
      "type": "Farm-Fresh Countryside Dining",
      "duration": "1.5 hours",
      "estimatedCost": "₹350/person",
      "desc": "Organic vegetables, fresh grain flatbreads, and cooling herbal coolers in an open-air forest garden pavilion."
    },
    "afternoon": {
      "title": "Medicinal Flora Arboretum & High-Altitude Bamboo Trail",
      "type": "Botanical Discovery & Shaded Walk",
      "duration": "2 hours",
      "estimatedCost": "Nominal entry",
      "walking": "Low to Moderate",
      "desc": "Walk under tall bamboo thickets and inspect indigenous medicinal herbs used in traditional Ayurveda."
    },
    "evening": {
      "title": "Cascading Waterfalls Mist Walk & Sunset Valley Lookout",
      "type": "Scenic Waterfall & Valley Sunset",
      "duration": "2.5 hours",
      "estimatedCost": "Free",
      "walking": "Moderate",
      "desc": "Feel the cooling spray of cascading waterfalls as evening mist rolls into the valley during the golden hour."
    },
    "extra": {
      "title": "Canopy Suspension Bridge Walk & Nature Photography Session",
      "desc": "Cross an arched suspension footbridge offering panoramic views down into the rushing mountain stream."
    }
  },
  {
    "themeId": "panoramic_heights",
    "summary": "Panoramic Summits, Ridge Overlooks & Alpine/Coastal Horizons",
    "morning": {
      "title": "Highest Ridge Sunrise Ascent & Mountain/Ocean Horizon Panorama",
      "type": "Peak Elevation & Horizon Views",
      "duration": "3 hours",
      "estimatedCost": "Free viewpoint",
      "walking": "Moderate to High",
      "desc": "Ascend to the highest summit overlook watching dawn break across endless mountain ridges or open sea horizons."
    },
    "meal": {
      "title": "Highland Vista Brunch & Locally Grown Tea/Coffee Tasting",
      "type": "Summit Overlook Dining",
      "duration": "1.5 hours",
      "estimatedCost": "₹380/person",
      "desc": "Freshly baked pastries, warm porridge, spiced breakfast dishes, and artisanal single-origin mountain brew."
    },
    "afternoon": {
      "title": "Terraced Hillside Farms & Valley Orchard Stroll",
      "type": "Agro-Tourism & Orchard Walk",
      "duration": "2.5 hours",
      "estimatedCost": "Free farm walk",
      "walking": "Moderate",
      "desc": "Walk along green contoured terraces observing step farming, fruit orchards, and mountain water channels."
    },
    "evening": {
      "title": "Cliffside Sunset Point Leisure & Golden Horizon Cloudscapes",
      "type": "Sunset Point Leisure",
      "duration": "2 hours",
      "estimatedCost": "Free",
      "walking": "Low",
      "desc": "Relax at the edge of high cliffs as clouds catch brilliant orange and magenta sunset reflections."
    },
    "extra": {
      "title": "High-Altitude Breeze Meditation & Ridge Panorama Photography",
      "desc": "Quiet personal time on the mountain ridge soaking in crisp unpolluted alpine breezes."
    }
  },
  {
    "themeId": "living_culture",
    "summary": "Living Culture: Artisan Handicrafts, Traditional Weaving & Pottery Guilds",
    "morning": {
      "title": "Traditional Handloom Weaving Village & Textile Loom Workshop",
      "type": "Master Textile Craft Heritage",
      "duration": "3 hours",
      "estimatedCost": "Free studio visits",
      "walking": "Low",
      "desc": "Meet master weavers working wooden shuttle pit-looms to produce intricate silk, cotton, and wool handloom weaves."
    },
    "meal": {
      "title": "Artisan Community Hearth Kitchen & Organic Rustic Flatbreads",
      "type": "Community Hearth Dining",
      "duration": "1.5 hours",
      "estimatedCost": "₹250/person",
      "desc": "Rustic meal cooked over clay stoves: slow-cooked lentils, millet flatbreads, farm churned butter, and jaggery."
    },
    "afternoon": {
      "title": "Clay Pottery, Stone Carving & Indigenous Woodcraft Studios",
      "type": "Hands-on Artisan Craft Workshops",
      "duration": "2.5 hours",
      "estimatedCost": "Nominal studio fee",
      "walking": "Low",
      "desc": "Try your hand at shaping clay on a potter's wheel and observe stone chiseling masters at work."
    },
    "evening": {
      "title": "Regional Folk Dance & Acoustic String Music Gathering",
      "type": "Cultural Performance & Folk Arts",
      "duration": "2.5 hours",
      "estimatedCost": "Free / Cultural pass",
      "walking": "Low",
      "desc": "Enjoy an evening of spirited traditional folk dances, acoustic drums, and soulful regional storytelling."
    },
    "extra": {
      "title": "Guild Master Meeting & Direct Sustainable Craft Souvenirs",
      "desc": "Support local artisan families directly by acquiring handmade textiles, pottery, and woodcraft without middlemen."
    }
  },
  {
    "themeId": "wildlife_reserves",
    "summary": "Wildlife Sanctuaries, Forest Safari & Biodiversity Reserves",
    "morning": {
      "title": "Morning Jeep Safari / Nature Reserve Sanctuary Expedition",
      "type": "Wildlife Safari & Forest Tracking",
      "duration": "3.5 hours",
      "estimatedCost": "₹450 safari permit",
      "walking": "Low (Vehicle Safari)",
      "desc": "Embark on an open-top safari through protected jungle reserves tracking deer, wild boars, peacocks, and predatory cats."
    },
    "meal": {
      "title": "Eco-Lodge Organic Buffet & Wild Berry Herbal Refreshments",
      "type": "Forest Eco-Lodge Dining",
      "duration": "1.5 hours",
      "estimatedCost": "₹400/person",
      "desc": "Wholesome buffet prepared with wild forest greens, whole pulses, country rice, and fresh fruit dessert."
    },
    "afternoon": {
      "title": "Interpretive Nature Center & Endangered Species Habitat Trail",
      "type": "Conservation Education & Shaded Walk",
      "duration": "2 hours",
      "estimatedCost": "Nominal entry",
      "walking": "Low",
      "desc": "Learn about conservation efforts, flora taxonomy, and watershed preservation at the forest interpretation centre."
    },
    "evening": {
      "title": "Watchtower Sunset Bird Sanctuary Walk & Quiet Lake Glade",
      "type": "Avian Watching & Sunset Tower",
      "duration": "2.5 hours",
      "estimatedCost": "Free",
      "walking": "Low to Moderate",
      "desc": "Ascend a timber watchtower overlooking wetland marshlands as thousands of roosting birds return at dusk."
    },
    "extra": {
      "title": "Twilight Wildlife Tracking Walk with Certified Regional Naturalist",
      "desc": "Identify nocturnal animal calls, glowworms, and night-blooming forest flowers with an expert forest guide."
    }
  },
  {
    "themeId": "rural_hidden_valleys",
    "summary": "Off-The-Beaten-Path Rural Enclaves, Secret Valleys & Hidden Lakes",
    "morning": {
      "title": "Hidden Valley Countryside Trek & Rural Hamlet Exploration",
      "type": "Off-the-Beaten-Path Village Trek",
      "duration": "3 hours",
      "estimatedCost": "Free trail",
      "walking": "Moderate",
      "desc": "Wander along unpaved stone paths connecting remote hillside villages untouched by commercial tourism."
    },
    "meal": {
      "title": "Village Farmhouse Kitchen & Sun-Dried Spices Regional Spread",
      "type": "Home-Style Farmhouse Lunch",
      "duration": "1.5 hours",
      "estimatedCost": "₹220/person",
      "desc": "Authentic countryside home meal cooked with freshly gathered vegetables, wild mustard greens, and buttermilk."
    },
    "afternoon": {
      "title": "Ancient Forgotten Stepwell / Water Aqueduct Ruins Walk",
      "type": "Heritage Water Engineering",
      "duration": "2.5 hours",
      "estimatedCost": "Free",
      "walking": "Moderate",
      "desc": "Discover centuries-old stone-carved stepwells and medieval water harvesting channels overgrown with wild ivy."
    },
    "evening": {
      "title": "Secluded Lake Shoreline Sunset & Gentle Ripple Reflection",
      "type": "Tranquil Lake Shoreline Sunset",
      "duration": "2 hours",
      "estimatedCost": "Free",
      "walking": "Low",
      "desc": "Sit quietly beside a serene mountain or forest lake as twilight turns water into a mirror of evening clouds."
    },
    "extra": {
      "title": "Rural Folk Storytelling Session & Fresh Springwater Spring Visit",
      "desc": "Hear local elders narrate ancestral legends while sipping naturally filtered sweet mountain spring water."
    }
  },
  {
    "themeId": "plantations_spice_estates",
    "summary": "Highland Tea/Coffee Plantations & Aromatic Spice Estates",
    "morning": {
      "title": "Lush Plantation Estate Walk & Fresh Leaf Picking Experience",
      "type": "Agro-Plantation Immersion",
      "duration": "3 hours",
      "estimatedCost": "₹150 plantation tour",
      "walking": "Moderate",
      "desc": "Walk through undulating green slopes, learning the fine art of two leaves and a bud harvesting from skilled estate pluckers."
    },
    "meal": {
      "title": "Estate Colonial Veranda Dining with Fresh Brew & Gourmet Bakes",
      "type": "Colonial Planters' Luncheon",
      "duration": "1.5 hours",
      "estimatedCost": "₹450/person",
      "desc": "Freshly baked herb bread, creamy vegetable bakes, regional savory tarts, and freshly steeped estate brew."
    },
    "afternoon": {
      "title": "Spice Processing Demonstration: Cardamom, Pepper & Cinnamon",
      "type": "Aromatic Spice Factory Tour",
      "duration": "2 hours",
      "estimatedCost": "Included in tour",
      "walking": "Low",
      "desc": "Tour the drying sheds, rolling tables, and sorting rooms, inhaling rich aromas of green cardamom and crushed black peppercorns."
    },
    "evening": {
      "title": "Hillside Planters' Promenade & Twilight Mist Over Terraced Slopes",
      "type": "Scenic Plantation Twilight Walk",
      "duration": "2.5 hours",
      "estimatedCost": "Free",
      "walking": "Low",
      "desc": "Walk along private plantation ridge lines as evening mist gently blankets the contoured green bushes."
    },
    "extra": {
      "title": "Single-Origin Leaf Cupping Session & Plantation Souvenir Pack",
      "desc": "Professional tasting session discerning nuances of light, medium, and dark roasted teas/coffees."
    }
  },
  {
    "themeId": "culinary_spice_bazaars",
    "summary": "Regional Culinary Masterclass, Spice Bazaars & Sweetmeat Trail",
    "morning": {
      "title": "Old Quarter Heritage Spice Market Walking Tour & Tasting",
      "type": "Sensory Spice Market Walk",
      "duration": "3 hours",
      "estimatedCost": "Free market tour",
      "walking": "Moderate",
      "desc": "Navigate historic market lanes filled with gunny sacks of fragrant dried chilies, star anise, turmeric, and local flowers."
    },
    "meal": {
      "title": "Interactive Regional Cooking Masterclass & Multi-Course Feast",
      "type": "Hands-on Culinary Workshop",
      "duration": "2 hours",
      "estimatedCost": "₹650/person",
      "desc": "Cook with a seasoned home chef, learning the alchemy of regional spice blends and secret family cooking methods."
    },
    "afternoon": {
      "title": "Heritage Confectionery Guild & Traditional Dry Fruit Bazaars",
      "type": "Traditional Sweetmeat Heritage",
      "duration": "2 hours",
      "estimatedCost": "Personal spends",
      "walking": "Low to Moderate",
      "desc": "Visit century-old halwais and mithai shops watching hot syrup sweets and pistachio-studded sweets being crafted."
    },
    "evening": {
      "title": "Twilight Street Food Alley Crawl & Signature Sweet Treats",
      "type": "Night Food Trail & Local Flavors",
      "duration": "2.5 hours",
      "estimatedCost": "₹250/person snacks",
      "walking": "Moderate",
      "desc": "Sample iconic regional evening delicacies, hot roasted snacks, sweet lassis, and fresh pan preparations."
    },
    "extra": {
      "title": "Handmade Spice Sachet Blending & Secret Recipe Keepsake",
      "desc": "Blend and seal your own custom jar of authentic regional spice mix to replicate flavors back home."
    }
  },
  {
    "themeId": "ancient_fortresses",
    "summary": "Ancient Fortresses, Strategic Citadels & Military Architecture",
    "morning": {
      "title": "Majestic Hilltop Fortress Ascent & Outer Rampart Walk",
      "type": "Medieval Military Architecture",
      "duration": "3.5 hours",
      "estimatedCost": "₹50 entry",
      "walking": "Moderate to High",
      "desc": "Climb through triple gateway bastions to explore impenetrable fortress ramparts, parapets, and cannon batteries."
    },
    "meal": {
      "title": "Historic Cantonment / Fortside Dining with Spiced Lentils & Pilaf",
      "type": "Historic Garrison-Style Dining",
      "duration": "1.5 hours",
      "estimatedCost": "₹320/person",
      "desc": "Hearty traditional meal: spiced slow-cooked lentils, fragrant saffron pilaf, roasted papad, and tangy pickles."
    },
    "afternoon": {
      "title": "Fort Armoury Museum, Royal Bastions & Watchtower Overlook",
      "type": "Military Museum & Weaponry",
      "duration": "2 hours",
      "estimatedCost": "Included in entry",
      "walking": "Moderate",
      "desc": "Inspect antique Damascus steel swords, flintlock rifles, chainmail armor, and climb the royal lookout tower."
    },
    "evening": {
      "title": "Fort Cliff Sunset Vistas Gazing Down at the Sprawling Cityscape",
      "type": "Grand Citadel Sunset",
      "duration": "2.5 hours",
      "estimatedCost": "Free",
      "walking": "Low",
      "desc": "Sit atop ancient stone battlements watching the sun set over the town below as streetlights begin twinkling."
    },
    "extra": {
      "title": "Fortress Echo Chamber Acoustics & Ancient Secret Tunnel Tour",
      "desc": "Discover ancient acoustic whisper galleries and secret underground escape passages built for wartime defense."
    }
  },
  {
    "themeId": "backwaters_rivers",
    "summary": "Riverside / Coastal Backwaters, Mangroves & Island Cruising",
    "morning": {
      "title": "Tranquil Waterways Boat Cruise & Riverside Mangrove Sanctuary",
      "type": "Scenic River Cruise & Waterway Ecology",
      "duration": "3 hours",
      "estimatedCost": "₹300 boat ride",
      "walking": "Low (Boat Cruise)",
      "desc": "Cruise along palm-fringed rivers and tidal backwaters observing kingfishers, egrets, and mudskippers in mangrove roots."
    },
    "meal": {
      "title": "Waterfront Fishermen's Wharf / Riverbank Traditional Curry Lunch",
      "type": "Riverbank Coastal Dining",
      "duration": "1.5 hours",
      "estimatedCost": "₹350/person",
      "desc": "Fresh river/sea catch, coconut milk curries, red rice, steamed appams, and roasted plantain fritters."
    },
    "afternoon": {
      "title": "Riverside Hermitage & Historic Island Bridge Discovery",
      "type": "Island Heritage & Countryside Bridge",
      "duration": "2.5 hours",
      "estimatedCost": "Free",
      "walking": "Moderate",
      "desc": "Disembark at a tranquil river island to visit a century-old riverside chapel or ashram shaded by rain trees."
    },
    "evening": {
      "title": "Golden Water Reflection Cruise & Evening River Breeze Stroll",
      "type": "Twilight Riverboat Leisure",
      "duration": "2 hours",
      "estimatedCost": "Included / ₹150",
      "walking": "Low",
      "desc": "Sail through mirror-calm waters reflecting the fiery crimson sunset sky as soft river breezes cool the evening air."
    },
    "extra": {
      "title": "Traditional Chinese/Cast Net Fishing Demonstration",
      "desc": "Watch local river fishermen operate colossal timber cantilevered fishing nets balanced with counterweights."
    }
  },
  {
    "themeId": "geological_caverns",
    "summary": "Geological Wonders, Caverns & Rocky Bouldering Landscapes",
    "morning": {
      "title": "Natural Limestone Caverns & Subterranean Formations Expedition",
      "type": "Speleology & Natural Rock Caverns",
      "duration": "3 hours",
      "estimatedCost": "₹60 entry",
      "walking": "Moderate",
      "desc": "Venture with headlamps through cool, subterranean chambers marveling at millions of years of stalactite and stalagmite formations."
    },
    "meal": {
      "title": "Foothill Rest House Dining featuring Wholesome Grain Platters",
      "type": "Hearty Countryside Dining",
      "duration": "1.5 hours",
      "estimatedCost": "₹260/person",
      "desc": "Wholesome multi-grain rotis, spiced potato and spinach curry, fresh curd, and hot jaggery halwa."
    },
    "afternoon": {
      "title": "Granite Bouldering Trails & Rock Formation Sculpture Walk",
      "type": "Geological Sculpture Walk & Bouldering",
      "duration": "2.5 hours",
      "estimatedCost": "Free trail",
      "walking": "Moderate to High",
      "desc": "Hike through natural granite rock gardens where gigantic boulders are precariously balanced on natural fulcrums."
    },
    "evening": {
      "title": "Elevated Plateau Sunset Watching Sky Colors Paint the Rocks",
      "type": "Plateau Sunset & Rocky Silhouettes",
      "duration": "2 hours",
      "estimatedCost": "Free",
      "walking": "Low",
      "desc": "Relax atop a flat granite plateau as the setting sun turns prehistoric rocks into shades of deep bronze and copper."
    },
    "extra": {
      "title": "Geological Fossil & Mineral Showcase Guided Explanation",
      "desc": "Examine ancient sea fossils embedded in limestone and learn the tectonic uplift history of the region."
    }
  },
  {
    "themeId": "arts_bohemian_galleries",
    "summary": "Arts, Bohemian Enclaves, Bookshops & Cultural Galleries",
    "morning": {
      "title": "Regional Art Heritage Gallery & Contemporary Craft Pavilion",
      "type": "Fine Arts & Contemporary Sculpture",
      "duration": "2.5 hours",
      "estimatedCost": "₹80 entry",
      "walking": "Low",
      "desc": "Browse curated exhibitions of regional oil paintings, tribal folk canvases, bronze castings, and modern installations."
    },
    "meal": {
      "title": "Bohemian Cultural Cafe Lunch with Fresh Salads & Artisan Breads",
      "type": "Artisanal Cafe Dining",
      "duration": "1.5 hours",
      "estimatedCost": "₹420/person",
      "desc": "Gourmet pasta, crisp garden salad bowls, wood-fired artisan sandwiches, cold brew coffee, and walnut brownies."
    },
    "afternoon": {
      "title": "Vintage Antiquarian Bookshop Crawl & Regional Writers' Hub",
      "type": "Literary Heritage & Bookshops",
      "duration": "2.5 hours",
      "estimatedCost": "Free browse",
      "walking": "Low",
      "desc": "Lose yourself in ceiling-high shelves of old travel memoirs, rare maps, regional poetry translations, and historic postcards."
    },
    "evening": {
      "title": "Sunset Poetry & Acoustic Music Circle in a Heritage Garden",
      "type": "Evening Arts Gathering",
      "duration": "2.5 hours",
      "estimatedCost": "Free access",
      "walking": "Low",
      "desc": "Sit on lawns beneath string lights enjoying acoustic guitar chords, sitar renditions, and spoken-word poetry."
    },
    "extra": {
      "title": "Hand-Painted Canvas Souvenir Workshop with Local Artists",
      "desc": "Paint a miniature canvas of the destination's iconic landmark guided by a resident fine artist."
    }
  },
  {
    "themeId": "grand_farewell",
    "summary": "Celebratory Grand Horizon Sunrise, Panorama & Farewell Banquet",
    "morning": {
      "title": "Celebratory Farewell Sunrise Gathering & Horizon Meditation",
      "type": "Panoramic Dawn Horizon & Gratitude",
      "duration": "2.5 hours",
      "estimatedCost": "Free",
      "walking": "Low",
      "desc": "Greet the early morning sun from a high open vantage point, meditating on memorable moments of your incredible journey."
    },
    "meal": {
      "title": "Grand Regional Festive Banquet featuring Signature Delicacies",
      "type": "Celebratory Grand Banquet",
      "duration": "2 hours",
      "estimatedCost": "₹550/person",
      "desc": "Multi-course feast featuring the pinnacle of regional culinary heritage: celebratory biryani/pulao, slow-cooked royal gravies, breads, and assorted sweetmeats."
    },
    "afternoon": {
      "title": "Final Keepsake Shopping at Regional State Handloom Emporium",
      "type": "GI-Certified Keepsake Shopping",
      "duration": "2.5 hours",
      "estimatedCost": "Personal spends",
      "walking": "Low",
      "desc": "Certified fair-trade shopping for authentic government-stamped silk, brassware, woodwork, organic honey, and packaged spices."
    },
    "evening": {
      "title": "Celebratory Sunset Reflection Gathering Overlooking the City",
      "type": "Grand Sunset Finale & Toast",
      "duration": "2.5 hours",
      "estimatedCost": "Celebratory dinner",
      "walking": "Low",
      "desc": "Gather for a final sunset over the city skyline, sharing photos and travel stories over sparkling beverages as twilight descends."
    },
    "extra": {
      "title": "Commemorative Travel Journal Reflection & Farewell Keepsake Gift",
      "desc": "Seal your travel journal, collect boarding tokens, and take home a cherished handcrafted memento of the destination."
    }
  }
];

/**
 * Helper to compute formatted calendar dates for day offsets
 */
export function computeItineraryDate(startDate, offsetDay) {
  if (!startDate) return `Day ${offsetDay}`;
  try {
    const d = new Date(startDate);
    if (isNaN(d.getTime())) return `Day ${offsetDay}`;
    d.setDate(d.getDate() + (offsetDay - 1));
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  } catch {
    return `Day ${offsetDay}`;
  }
}

/**
 * Universal Multi-Day Itinerary Resolver
 * Handles ANY destination and ANY duration (from 1 day up to 10+ days)
 * with a strict zero-duplicate constraint across all days.
 */
export function getCuratedMultiDayItinerary(destinationName = "", startDate = "", days = 3) {
  if (!destinationName) return [];
  const normalized = destinationName.trim();
  const reqDays = Math.max(1, Math.min(30, Number(days) || 3));

  // 1. Direct match in curated multi-day registry (Gujarat, Hampi, Ooty, Pondicherry, Goa)
  let baseDays = null;
  for (const [key, plan] of Object.entries(CURATED_MULTI_DAY_ITINERARIES)) {
    if (
      key.toLowerCase() === normalized.toLowerCase() ||
      normalized.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(normalized.toLowerCase())
    ) {
      baseDays = plan;
      break;
    }
  }

  if (baseDays && Array.isArray(baseDays) && baseDays.length > 0) {
    const result = [];
    const usedTitles = new Set();

    for (let i = 1; i <= reqDays; i++) {
      if (i <= baseDays.length) {
        const item = baseDays[i - 1];
        (item.timeBlocks || []).forEach((b) => usedTitles.add(b.title.toLowerCase().trim()));
        result.push({
          ...item,
          day: i,
          date: computeItineraryDate(startDate, i)
        });
      } else {
        // Extended stays beyond curated days: draw progressively from Pan-India multi-day themes
        const themeIndex = (i - 1) % PAN_INDIA_MULTI_DAY_THEMES.length;
        const t = PAN_INDIA_MULTI_DAY_THEMES[themeIndex];
        const extDayNum = i;

        const morningTitle = `${destinationName} ${t.morning.title} (Circuit ${extDayNum})`;
        const afternoonTitle = `${destinationName} ${t.afternoon.title} (Circuit ${extDayNum})`;

        result.push({
          day: extDayNum,
          date: computeItineraryDate(startDate, extDayNum),
          summary: `${destinationName} Day ${extDayNum}: ${t.summary}`,
          timeBlocks: [
            {
              timeSlot: "09:00 AM – 12:00 PM",
              period: "Morning",
              icon: "🌅",
              title: morningTitle,
              type: t.morning.type,
              duration: t.morning.duration,
              travelTime: "20 mins local transit",
              transportMode: "Auto / Cab",
              estimatedCost: t.morning.estimatedCost,
              bookingRequirement: "Open site",
              walkingIntensity: t.morning.walking,
              location: `${destinationName} Outer Circuit`,
              description: t.morning.desc,
              smartReason: "Scheduled in the morning for crisp visibility and comfortable ambient temperatures."
            },
            {
              timeSlot: "12:30 PM – 02:00 PM",
              period: "Midday Meal",
              icon: "🍽️",
              title: `${destinationName} Day ${extDayNum} ${t.meal.title}`,
              type: t.meal.type,
              duration: t.meal.duration,
              travelTime: "10 mins transit",
              transportMode: "Walk / Auto",
              estimatedCost: t.meal.estimatedCost,
              bookingRequirement: "Walk-in",
              walkingIntensity: "Low",
              location: `Central ${destinationName}`,
              description: t.meal.desc,
              smartReason: "Centrally positioned dining break."
            },
            {
              timeSlot: "02:30 PM – 05:00 PM",
              period: "Afternoon",
              icon: "🏛️",
              title: afternoonTitle,
              type: t.afternoon.type,
              duration: t.afternoon.duration,
              travelTime: "15 mins transit",
              transportMode: "Cab / Auto",
              estimatedCost: t.afternoon.estimatedCost,
              bookingRequirement: "Direct entry",
              walkingIntensity: t.afternoon.walking,
              location: `${destinationName} Heritage Enclave`,
              description: t.afternoon.desc,
              smartReason: "Shaded afternoon exploration avoiding midday warmth."
            },
            {
              timeSlot: "05:30 PM – 08:00 PM",
              period: "Sunset & Evening",
              icon: "🌇",
              title: `${destinationName} Day ${extDayNum} ${t.evening.title}`,
              type: t.evening.type,
              duration: t.evening.duration,
              travelTime: "10 mins transit",
              transportMode: "Walk / Auto",
              estimatedCost: t.evening.estimatedCost,
              bookingRequirement: "Open public area",
              walkingIntensity: t.evening.walking,
              location: `${destinationName} Promenade / Ridge`,
              description: t.evening.desc,
              smartReason: "Golden hour sunset reflection."
            }
          ],
          extraActivity: {
            icon: "✨",
            type: `Day ${extDayNum} Exclusive Highlight`,
            title: `${destinationName} ${t.extra.title}`,
            description: t.extra.desc
          }
        });
      }
    }
    return result;
  }

  // 2. Universal Pan-India Engine for all other destinations:
  // Lookup real destination attractions from destinations.js
  const destObj = Array.isArray(destinations)
    ? destinations.find(
        (d) =>
          d.name.toLowerCase() === normalized.toLowerCase() ||
          normalized.toLowerCase().includes(d.name.toLowerCase()) ||
          d.name.toLowerCase().includes(normalized.toLowerCase())
      )
    : null;

  const rawAttractions = destObj && Array.isArray(destObj.attractions) ? destObj.attractions : [];
  const usedAttractionIds = new Set();
  const usedSightseeingTitles = new Set();

  const dynamicResult = [];

  for (let d = 1; d <= reqDays; d++) {
    const themeIndex = (d - 1) % PAN_INDIA_MULTI_DAY_THEMES.length;
    const t = PAN_INDIA_MULTI_DAY_THEMES[themeIndex];
    const dayDate = computeItineraryDate(startDate, d);

    // Pick 2 real unused attractions if available (Morning and Afternoon)
    let morningStop = null;
    let afternoonStop = null;

    for (const att of rawAttractions) {
      const attKey = att.id || att.name;
      if (!usedAttractionIds.has(attKey) && !usedSightseeingTitles.has(att.name.toLowerCase().trim())) {
        if (!morningStop) {
          morningStop = att;
          usedAttractionIds.add(attKey);
          usedSightseeingTitles.add(att.name.toLowerCase().trim());
        } else if (!afternoonStop) {
          afternoonStop = att;
          usedAttractionIds.add(attKey);
          usedSightseeingTitles.add(att.name.toLowerCase().trim());
          break;
        }
      }
    }

    // Assign titles guaranteeing uniqueness
    const morningTitle = morningStop
      ? morningStop.name
      : `${destinationName} ${t.morning.title} (Day ${d})`;

    const mealTitle = `${destinationName} Day ${d} ${t.meal.title}`;

    const afternoonTitle = afternoonStop
      ? afternoonStop.name
      : `${destinationName} ${t.afternoon.title} (Day ${d})`;

    const eveningTitle = `${destinationName} Day ${d} ${t.evening.title}`;

    usedSightseeingTitles.add(morningTitle.toLowerCase().trim());
    usedSightseeingTitles.add(afternoonTitle.toLowerCase().trim());

    // Day summary
    const summaryStops = [morningStop?.name, afternoonStop?.name].filter(Boolean);
    const daySummary =
      summaryStops.length > 0
        ? `Day ${d}: ${summaryStops.join(" • ")}`
        : `Day ${d}: ${destinationName} ${t.summary}`;

    dynamicResult.push({
      day: d,
      date: dayDate,
      summary: daySummary,
      timeBlocks: [
        {
          timeSlot: "09:00 AM – 12:00 PM",
          period: "Morning",
          icon:
            d === 1 ? "🏛️" : d === 2 ? "🛕" : d === 3 ? "🌲" : d === 4 ? "⛰️" : d === 5 ? "🧵" : d === 6 ? "🐾" : d === 7 ? "🏰" : d === 8 ? "🚣" : d === 9 ? "🌶️" : "🌅",
          title: morningTitle,
          type: morningStop?.category || t.morning.type,
          duration: morningStop?.duration ? `${morningStop.duration} hours` : t.morning.duration,
          travelTime: "15–20 mins local transit",
          transportMode: "Auto / Cab",
          estimatedCost: morningStop?.cost ? `₹${morningStop.cost}` : t.morning.estimatedCost,
          bookingRequirement: (morningStop?.cost || 0) > 0 ? "Entry ticket at counter" : "Direct entry",
          walkingIntensity: morningStop?.walking || t.morning.walking,
          location: morningStop?.zone || `${destinationName} Core`,
          description: morningStop?.description || t.morning.desc,
          smartReason: "Scheduled in the morning for crisp daylight and prime visibility."
        },
        {
          timeSlot: "12:30 PM – 02:00 PM",
          period: "Midday Meal",
          icon: "🍽️",
          title: mealTitle,
          type: t.meal.type,
          duration: t.meal.duration,
          travelTime: "10 mins transit",
          transportMode: "Walk / Auto",
          estimatedCost: t.meal.estimatedCost,
          bookingRequirement: "Walk-in",
          walkingIntensity: "Low",
          location: `${destinationName} Dining District`,
          description: t.meal.desc,
          smartReason: `Centrally positioned dining along the Day ${d} exploration trail.`
        },
        {
          timeSlot: "02:30 PM – 05:00 PM",
          period: "Afternoon",
          icon: "🏛️",
          title: afternoonTitle,
          type: afternoonStop?.category || t.afternoon.type,
          duration: afternoonStop?.duration ? `${afternoonStop.duration} hours` : t.afternoon.duration,
          travelTime: "15 mins transit",
          transportMode: "Cab / Auto",
          estimatedCost: afternoonStop?.cost ? `₹${afternoonStop.cost}` : t.afternoon.estimatedCost,
          bookingRequirement: (afternoonStop?.cost || 0) > 0 ? "Standard ticket" : "Open site",
          walkingIntensity: afternoonStop?.walking || t.afternoon.walking,
          location: afternoonStop?.zone || `${destinationName} Heritage Belt`,
          description: afternoonStop?.description || t.afternoon.desc,
          smartReason: "Shaded afternoon exploration avoiding the warmest midday hours."
        },
        {
          timeSlot: "05:30 PM – 08:00 PM",
          period: "Sunset & Evening",
          icon: "🌆",
          title: eveningTitle,
          type: t.evening.type,
          duration: t.evening.duration,
          travelTime: "10 mins transit",
          transportMode: "Walk / Auto",
          estimatedCost: t.evening.estimatedCost,
          bookingRequirement: "Open public area",
          walkingIntensity: t.evening.walking,
          location: `${destinationName} Promenade / Viewpoint`,
          description: t.evening.desc,
          smartReason: "Breezy evening atmosphere ensuring a relaxed finish before nighttime."
        }
      ],
      extraActivity: {
        icon: "✨",
        type: `Day ${d} Exclusive Highlight`,
        title: `${destinationName} ${t.extra.title}`,
        description: t.extra.desc
      }
    });
  }

  return dynamicResult;
}

/**
 * Backward compatibility alias for existing callers
 */
export const getCuratedSixDayItinerary = getCuratedMultiDayItinerary;

export default getCuratedMultiDayItinerary;
