import fs from 'fs';
import path from 'path';
import destinations from '../src/data/destinations.js';

const newDestinations = [
  {
    id: 39,
    name: "Udaipur",
    state: "Rajasthan",
    category: "Royal Heritage & Lakes",
    rating: 9.7,
    bestTime: "October - March",
    image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609137144820-221e7d8f375c?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Udaipur, the fabled 'City of Lakes' and 'Venice of the East', is nestled around azure lakes against the rugged Aravalli Hills. Crowned by the colossal marble City Palace and floating Jag Mandir, Udaipur enchants visitors with romantic boat rides on Lake Pichola, historic Havelis, sunset rooftop dining, and centuries of Mewar royal valor.",
    attractions: [
      {
        id: "udaipur_city_palace",
        name: "🏰 City Palace Complex & Museum",
        zone: "Lake Pichola East Bank",
        category: "Royal Heritage & Architecture",
        duration: 3,
        cost: 300,
        walking: "medium",
        rating: 9.8,
        description: "Rajasthan's largest royal palace complex with mirrored courtyards, marble balconies, and sweeping lake panoramas."
      },
      {
        id: "udaipur_lake_pichola",
        name: "🚤 Lake Pichola Sunset Boat Cruise & Jag Mandir",
        zone: "Lake Pichola",
        category: "Scenic & Boating",
        duration: 2,
        cost: 450,
        walking: "low",
        rating: 9.8,
        description: "Iconic boat ride across sparkling waters, cruising past the Taj Lake Palace island and docking at Jag Mandir gardens."
      },
      {
        id: "udaipur_sajjangarh",
        name: "🏯 Sajjangarh (Monsoon Palace) Sunset Ridge",
        zone: "Bansdara Peak Aravallis",
        category: "Panoramic Sunset & History",
        duration: 2.5,
        cost: 110,
        walking: "low",
        rating: 9.5,
        description: "Hilltop palace built in 1884 to view monsoon clouds, offering breathtaking 360-degree sunset views of Udaipur."
      },
      {
        id: "udaipur_saheliyon_bari",
        name: "🌿 Saheliyon Ki Bari (Garden of the Royal Maids)",
        zone: "Fateh Sagar Belt",
        category: "Gardens & Fountains",
        duration: 1.5,
        cost: 50,
        walking: "low",
        rating: 9.3,
        description: "Historic ornamental garden with lotus pools, marble elephant fountains, and fragrant flower boulevards."
      },
      {
        id: "udaipur_jagdish_temple",
        name: "🛕 Jagdish Temple & Gangaur Ghat Aarti",
        zone: "Old City Core",
        category: "Spiritual & Ghat Heritage",
        duration: 1.5,
        cost: 0,
        walking: "low",
        rating: 9.4,
        description: "Majestic 1651 AD Indo-Aryan temple with carved stone pillars, leading down to the spiritual steps of Gangaur Ghat."
      },
      {
        id: "udaipur_bagore_ki_haveli",
        name: "🎭 Bagore Ki Haveli Dharohar Folk Dance Show",
        zone: "Gangaur Ghat",
        category: "Cultural Dance & Heritage",
        duration: 2,
        cost: 100,
        walking: "low",
        rating: 9.7,
        description: "18th-century waterfront mansion hosting colorful evening Rajasthani Chari and Kalbelia fire dances with 138 rooms."
      }
    ]
  },
  {
    id: 40,
    name: "Ooty",
    state: "Tamil Nadu",
    category: "Hill Station & Tea Gardens",
    rating: 9.4,
    bestTime: "October - June",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Ooty (Udhagamandalam), the 'Queen of Hill Stations', sits high in the Nilgiri Hills of Tamil Nadu at 7,350 feet. Renowned for its UNESCO Mountain Toy Train, rolling emerald tea estates, misty blue eucalyptus groves, and pleasant cool breezes year-round, Ooty is South India's premier mountain retreat.",
    attractions: [
      {
        id: "ooty_toy_train",
        name: "🚂 Nilgiri Mountain Railway (UNESCO Toy Train)",
        zone: "Ooty - Coonoor Rail Corridor",
        category: "UNESCO Heritage Joyride",
        duration: 3,
        cost: 200,
        walking: "low",
        rating: 9.8,
        description: "Historic rack-and-pinion steam railway chugging through 208 curves, 16 tunnels, and breathtaking Nilgiri ravines."
      },
      {
        id: "ooty_botanical_garden",
        name: "🌺 Government Botanical Gardens & Rose Garden",
        zone: "Doddabetta Foothills",
        category: "Flora & Nature Walks",
        duration: 2,
        cost: 40,
        walking: "medium",
        rating: 9.4,
        description: "55-acre terraced gardens established in 1848, featuring exotic Himalayan pines, a 20-million-year-old fossil tree, and rare orchids."
      },
      {
        id: "ooty_doddabetta_peak",
        name: "🏔️ Doddabetta Peak & Telescope House",
        zone: "Nilgiri Crest",
        category: "Highest Viewpoint & Panorama",
        duration: 2,
        cost: 20,
        walking: "low",
        rating: 9.5,
        description: "The highest mountain in the Nilgiris (8,652 ft), offering sweeping panoramic views across Tamil Nadu and Kerala borders."
      },
      {
        id: "ooty_lake_boating",
        name: "🚣 Ooty Lake & Boat House",
        zone: "Town Center",
        category: "Boating & Leisure",
        duration: 1.5,
        cost: 180,
        walking: "low",
        rating: 9.1,
        description: "Scenic 65-acre artificial lake framed by eucalyptus trees, popular for pedal boating and lakeside cycling."
      },
      {
        id: "ooty_pykara_falls",
        name: "🌲 Pykara Waterfalls & Lake Speedboat",
        zone: "Pykara Valley",
        category: "Waterfalls & Pine Woods",
        duration: 2.5,
        cost: 150,
        walking: "medium",
        rating: 9.5,
        description: "Cascading sacred river waterfalls dropping through rocky ledges, surrounded by dense shola forests and peaceful speedboat cruises."
      },
      {
        id: "ooty_tea_factory",
        name: "🍵 Dodabetta Tea Factory & Chocolate Museum",
        zone: "Kotagiri Road",
        category: "Tea Tasting & Workshop",
        duration: 1.5,
        cost: 30,
        walking: "low",
        rating: 9.3,
        description: "Live orthodox tea CTC processing demonstration with complimentary warm cardamom tea and homemade artisan chocolates."
      }
    ]
  },
  {
    id: 41,
    name: "Pondicherry",
    state: "Puducherry",
    category: "Coastal & French Heritage",
    rating: 9.3,
    bestTime: "October - March",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Pondicherry (Puducherry), affectionately called the 'French Riviera of the East', is a charming coastal enclave with mustard-yellow colonial villas, bougainvillea-draped balconies, and serene seaside promenades. Home to the international spiritual community of Auroville and world-class French patisseries, it is a haven for mindful travel and bohemian coastal bliss.",
    attractions: [
      {
        id: "pondicherry_white_town",
        name: "🥐 White Town French Quarters & Heritage Cycling",
        zone: "French Quarter",
        category: "Colonial Architecture & Cafés",
        duration: 2.5,
        cost: 0,
        walking: "low",
        rating: 9.7,
        description: "Grid-planned French streets with pastel yellow villas, chic boutiques, Parisian-style bistros, and vintage bicycles."
      },
      {
        id: "pondicherry_promenade",
        name: "🌊 Promenade Beach (Rock Beach) & Gandhi Memorial",
        zone: "Seaside Boulevard",
        category: "Sea Promenade & Sunsets",
        duration: 2,
        cost: 0,
        walking: "low",
        rating: 9.6,
        description: "1.5 km vehicle-free coastal promenade lined with black volcanic rocks, historic lighthouses, and crashing ocean waves."
      },
      {
        id: "pondicherry_auroville",
        name: "🧘 Auroville Universal City & Matrimandir",
        zone: "Auroville Township",
        category: "Spiritual Community & Peace Dome",
        duration: 3.5,
        cost: 0,
        walking: "medium",
        rating: 9.7,
        description: "Global experimental township featuring the golden metallic geodesic sphere Matrimandir dedicated to human unity."
      },
      {
        id: "pondicherry_paradise_beach",
        name: "🏖️ Paradise Beach & Chunnambar Boat Cruise",
        zone: "Chunnambar Estuary",
        category: "Isolated Beach & Water Sports",
        duration: 3,
        cost: 250,
        walking: "low",
        rating: 9.5,
        description: "Secluded golden sand spit reached via a scenic backwater boat ride, famous for soft sands and cool ocean breezes."
      },
      {
        id: "pondicherry_sacred_heart",
        name: "⛪ Basilica of the Sacred Heart of Jesus",
        zone: "South Boulevard",
        category: "Gothic Church Architecture",
        duration: 1,
        cost: 0,
        walking: "low",
        rating: 9.2,
        description: "Stunning 1907 neo-Gothic Catholic church famous for French stained glass panels depicting 28 saints."
      },
      {
        id: "pondicherry_serenity_beach",
        name: "🏄 Serenity Beach & Coastal Surf School",
        zone: "East Coast Road North",
        category: "Surfing & Fishermen Village",
        duration: 2,
        cost: 0,
        walking: "low",
        rating: 9.3,
        description: "Gentle Atlantic-style beach breaks ideal for beginner surfing lessons, beach volleyball, and fresh coconut water."
      }
    ]
  },
  {
    id: 42,
    name: "Mumbai",
    state: "Maharashtra",
    category: "Metropolis & Coastal Heritage",
    rating: 9.6,
    bestTime: "November - February",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566552881560-0be86c53210f?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Mumbai, the vibrant financial capital and pulsating 'City of Dreams', stands on the Arabian Sea coast. Blending grand Victorian Gothic UNESCO architecture with the glitz of Bollywood, bustling coastal street food at Chowpatty, and sunset strolls along Marine Drive, Mumbai radiates an infectious, unstoppable 24/7 energy.",
    attractions: [
      {
        id: "mumbai_gateway_of_india",
        name: "🏛️ Gateway of India & Taj Mahal Palace Hotel",
        zone: "Colaba Waterfront",
        category: "Iconic Monument & History",
        duration: 2,
        cost: 0,
        walking: "low",
        rating: 9.8,
        description: "Grand 26-meter basalt arch overlooking Mumbai harbour, flanked by the historic 1903 flagship Taj Mahal Palace hotel."
      },
      {
        id: "mumbai_marine_drive",
        name: "🌊 Marine Drive (Queen's Necklace) Sunset Walk",
        zone: "South Mumbai Promenade",
        category: "Coastal Promenade & Art Deco",
        duration: 2,
        cost: 0,
        walking: "low",
        rating: 9.8,
        description: "3.6 km C-shaped seaside boulevard framed by Art Deco buildings, gleaming like a string of pearls at twilight."
      },
      {
        id: "mumbai_elephanta_caves",
        name: "🗿 Elephanta Caves UNESCO Rock-Cut Temples",
        zone: "Elephanta Island (Ferry from Gateway)",
        category: "UNESCO Ancient Sculpture",
        duration: 4,
        cost: 260,
        walking: "medium",
        rating: 9.6,
        description: "5th-century rock-cut cave temples dedicated to Lord Shiva, famous for the magnificent 20-foot three-headed Trimurti statue."
      },
      {
        id: "mumbai_bandra_sea_link",
        name: "🌉 Bandra-Worli Sea Link & Bandstand Walk",
        zone: "Bandra West",
        category: "Modern Engineering & Bollywood",
        duration: 1.5,
        cost: 0,
        walking: "low",
        rating: 9.4,
        description: "Cable-stayed bridge spanning the Arabian Sea, leading to the coastal promenade outside Bollywood superstar residences."
      },
      {
        id: "mumbai_cst_heritage",
        name: "🚉 Chhatrapati Shivaji Maharaj Terminus (CSTM)",
        zone: "Fort Heritage Precinct",
        category: "UNESCO Victorian Gothic",
        duration: 1,
        cost: 0,
        walking: "low",
        rating: 9.5,
        description: "Architectural masterpiece of Victorian Italianate Gothic revival style built in 1887 with gargoyles and stained glass."
      },
      {
        id: "mumbai_chowpatty_food",
        name: "🍲 Girgaon Chowpatty Pav Bhaji & Kulfi Trail",
        zone: "Girgaon Beach",
        category: "Street Food & Beach Life",
        duration: 1.5,
        cost: 0,
        walking: "low",
        rating: 9.6,
        description: "Bustling beach promenade famous for butter-drenched Pav Bhaji, crispy Bhel Puri, and rabdi-topped Kulfi."
      }
    ]
  },
  {
    id: 43,
    name: "Hampi",
    state: "Karnataka",
    category: "UNESCO Heritage & Ancient Ruins",
    rating: 9.8,
    bestTime: "October - March",
    image: "https://images.unsplash.com/photo-1600100397608-f010f4438363?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010f4438363?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609137144820-221e7d8f375c?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Hampi, a spellbinding UNESCO World Heritage site in Karnataka, was the opulent capital of the 14th-century Vijayanagara Empire. Set amidst an otherworldly landscape of giant granite boulders, banana plantations, and the rushing Tungabhadra River, Hampi showcases over 1,600 surviving monuments, musical stone pillars, and monoliths.",
    attractions: [
      {
        id: "hampi_virupaksha_temple",
        name: "🛕 Virupaksha Temple (7th-Century Living Shrine)",
        zone: "Hampi Bazaar",
        category: "Sacred Living Temple",
        duration: 2,
        cost: 50,
        walking: "low",
        rating: 9.9,
        description: "Ancient temple dedicated to Lord Shiva with a 160-foot Gopuram gateway and pinhole inverted shadow optical marvel."
      },
      {
        id: "hampi_vittala_chariot",
        name: "🛞 Vijaya Vittala Temple & Iconic Stone Chariot",
        zone: "Vittala Complex",
        category: "UNESCO Monumental Sculpture",
        duration: 2.5,
        cost: 40,
        walking: "medium",
        rating: 9.9,
        description: "The crown jewel of Vijayanagara architecture, featuring musical stone pillars and the iconic monolithic Garuda stone chariot."
      },
      {
        id: "hampi_matanga_hill",
        name: "🌅 Matanga Hill Sunrise & Tungabhadra Panorama",
        zone: "Central Hills",
        category: "Hiking & 360 Viewpoint",
        duration: 2,
        cost: 0,
        walking: "high",
        rating: 9.8,
        description: "The highest point in Hampi reached via stone steps, offering mesmerizing sunrise views across the boulder-strewn landscape."
      },
      {
        id: "hampi_lotus_mahal",
        name: "👑 Lotus Mahal & Royal Elephant Stables",
        zone: "Royal Center",
        category: "Indo-Islamic Architecture",
        duration: 2,
        cost: 40,
        walking: "low",
        rating: 9.6,
        description: "Two-story secular summer pavilion designed like a blooming lotus, adjacent to 11 domed stables for royal war elephants."
      },
      {
        id: "hampi_sanapur_lake",
        name: "🚣 Sanapur Lake Coracle Ride & Cliff Bouldering",
        zone: "Anegundi (Hippie Side)",
        category: "Coracle Boating & Nature",
        duration: 2.5,
        cost: 300,
        walking: "medium",
        rating: 9.7,
        description: "Pristine reservoir surrounded by granite cliffs, popular for circular coracle boat rides and world-class boulder climbing."
      },
      {
        id: "hampi_queen_bath",
        name: "🏊 Queen's Bath & Stepped Pushkarani Tank",
        zone: "Royal Enclosure",
        category: "Water Architecture & Engineering",
        duration: 1.5,
        cost: 0,
        walking: "low",
        rating: 9.4,
        description: "Elaborate royal swimming pavilion with carved Indo-Saracenic balconies and perfectly symmetrical geometric stepped tank."
      }
    ]
  },
  {
    id: 44,
    name: "Andaman",
    state: "Andaman & Nicobar",
    category: "Islands & Coral Marine Life",
    rating: 9.8,
    bestTime: "October - May",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?fm=jpg&q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?fm=jpg&q=80&w=1200&auto=format&fit=crop"
    ],
    description: "The Andaman & Nicobar archipelago is an idyllic tropical paradise in the Bay of Bengal, blessed with sparkling turquoise waters, pristine white-sand beaches, and vibrant coral reefs. From the historic colonial ramparts of Cellular Jail to Asia's finest Radhanagar Beach on Havelock Island and world-class scuba diving, Andaman is India's premier island haven.",
    attractions: [
      {
        id: "andaman_radhanagar_beach",
        name: "🏝️ Radhanagar Beach (Beach No. 7, Havelock)",
        zone: "Swaraj Dweep (Havelock)",
        category: "World-Class Beach & Sunset",
        duration: 3.5,
        cost: 0,
        walking: "low",
        rating: 9.9,
        description: "Crowned Asia's best beach by Time Magazine, celebrated for powder-white sands, gentle azure surf, and lush rainforest canopy."
      },
      {
        id: "andaman_cellular_jail",
        name: "⛓️ Cellular Jail National Memorial & Light Show",
        zone: "Port Blair",
        category: "Freedom Struggle Memorial",
        duration: 2.5,
        cost: 30,
        walking: "low",
        rating: 9.8,
        description: "Historic colonial prison ('Kaala Paani') where brave Indian freedom fighters were exiled, featuring a moving evening sound-and-light show."
      },
      {
        id: "andaman_elephant_beach",
        name: "🤿 Elephant Beach Coral Reef Snorkeling & Sea Walk",
        zone: "Havelock North",
        category: "Scuba, Snorkeling & Corals",
        duration: 3,
        cost: 1200,
        walking: "medium",
        rating: 9.7,
        description: "Crystal-clear shallow waters teeming with brain corals, clownfish, turtles, and underwater helmet sea-walking adventures."
      },
      {
        id: "andaman_neil_island",
        name: "🚤 Neil Island (Shaheed Dweep) Natural Rock Bridge",
        zone: "Neil Island",
        category: "Natural Wonder & Low Tide Reef",
        duration: 3,
        cost: 0,
        walking: "medium",
        rating: 9.6,
        description: "Naturally formed living coral rock bridge exposed at low tide, with starfish and sea anemones in tidal rock pools."
      },
      {
        id: "andaman_chidiya_tapu",
        name: "🦜 Chidiya Tapu Sunset Point & Munda Pahad",
        zone: "South Andaman",
        category: "Birdwatching & Golden Sunset",
        duration: 2,
        cost: 0,
        walking: "low",
        rating: 9.5,
        description: "The southernmost tip of South Andaman Island, renowned for indigenous tropical birds and stunning sunset silhouettes."
      },
      {
        id: "andaman_ross_island",
        name: "🚢 Ross Island (Netaji Subhash Bose Dweep) Ruins",
        zone: "Port Blair Harbor",
        category: "Island Ruins & Peacocks",
        duration: 2.5,
        cost: 50,
        walking: "medium",
        rating: 9.5,
        description: "Former British administrative capital reclaimed by giant banyan tree roots, with friendly deer and peacocks roaming freely."
      }
    ]
  }
];

// Append new destinations if not already present
for (const newDest of newDestinations) {
  if (!destinations.some(d => d.name.toLowerCase() === newDest.name.toLowerCase())) {
    destinations.push(newDest);
  }
}

const fileContent = `const destinations = ${JSON.stringify(destinations, null, 2)};\n\nexport default destinations;\n`;
fs.writeFileSync(path.resolve('src/data/destinations.js'), fileContent, 'utf-8');
console.log(`Successfully updated destinations.js! Total count: ${destinations.length}`);

