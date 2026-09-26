import fs from 'fs';
import path from 'path';
import localBusinessData from '../src/data/localBusinessData.js';

const newLocalData = {
  Udaipur: {
    food: [
      {
        name: "Ambrai & Waterfront Rooftop Restaurants",
        detail: "Fine dining overlooking Lake Pichola and City Palace serving authentic Mewari Laal Maas and Ker Sangri",
        price: "₹400–₹1,200",
        tag: "Top Pick"
      },
      {
        name: "Sukhadia Circle & Old City Food Street",
        detail: "Famous crisp Pyaaz Kachoris, butter Pav Bhaji, Kulhad Rabdi, and chilled rose Falooda",
        price: "₹50–₹200",
        tag: "Local Favourite"
      }
    ],
    guides: [
      {
        name: "Mewar Royal Heritage & City Palace Guide",
        detail: "Official historian narrating stories of Maharana Pratap, mirrored palace courtyards, and Mewar bravery",
        price: "From ₹600",
        tag: "Top Pick"
      },
      {
        name: "Lake Pichola & Ghat Walking Tour Guide",
        detail: "Sunset exploration of historic bathing ghats, Havelis, and hidden medieval alleyways",
        price: "From ₹450",
        tag: "Walking Tour"
      }
    ],
    shopping: [
      {
        name: "Bada Bazaar & Hathi Pol Market",
        detail: "Intricate Mewar miniature paintings on silk, Pichwai art, camel leather mojaris, and bandhani sarees",
        price: "Mixed",
        tag: "Top Pick"
      },
      {
        name: "Rajasthali Government Handicrafts Emporium",
        detail: "Certified silver meenakari jewelry, marble carvings, and traditional Rajasthani puppets",
        price: "Fixed price",
        tag: "Certified Quality"
      }
    ],
    activities: [
      {
        name: "Lake Pichola Sunset Royal Boat Cruise",
        detail: "Glide past Taj Lake Palace and Jag Mandir island under golden twilight mountain reflections",
        price: "₹450–₹850",
        tag: "Iconic Cruise"
      },
      {
        name: "Bagore Ki Haveli Dharohar Evening Folk Dance Show",
        detail: "Vibrant live Chari pot-balancing and Kalbelia fire dances in a 138-room 18th-century waterfront mansion",
        price: "₹100–₹250",
        tag: "Cultural Show"
      }
    ]
  },

  Ooty: {
    food: [
      {
        name: "King Star & Modern Bakery Delicacies",
        detail: "World-famous homemade artisan chocolates, dark almond truffles, and warm honey cakes since 1942",
        price: "₹100–₹350",
        tag: "Top Pick"
      },
      {
        name: "Sidewalk Cafe & Nilgiri Hill Dhabas",
        detail: "Wood-fired stone pizzas, hot vegetable stew, and aromatic filter coffee amidst misty hill views",
        price: "₹150–₹450",
        tag: "Local Favourite"
      }
    ],
    guides: [
      {
        name: "Nilgiri Mountain UNESCO Railway Guide",
        detail: "Expert in 1903 Swiss rack-and-pinion engineering history, vintage steam locomotives, and hill stations",
        price: "From ₹400",
        tag: "Top Pick"
      },
      {
        name: "Shola Forest & Tribal Heritage Naturalist",
        detail: "Guided nature walk through ancient Shola pine ecosystems and Toda tribal village settlements",
        price: "From ₹650",
        tag: "Eco & Wildlife"
      }
    ],
    shopping: [
      {
        name: "Commercial Road & Charing Cross Bazaar",
        detail: "100% pure cold-pressed eucalyptus oil, Nilgiri orthodox black tea, Toda embroidered shawls, and wild spices",
        price: "Budget friendly",
        tag: "Top Pick"
      },
      {
        name: "Nilgiri Co-operative Tea & Honey Outlets",
        detail: "Organic tribal forest honey, first-flush green tea, and clove-cinnamon essential oils",
        price: "Fair Price",
        tag: "Organic & Pure"
      }
    ],
    activities: [
      {
        name: "UNESCO Nilgiri Mountain Toy Train Steam Journey",
        detail: "Ride through 208 curves and misty mountain ravines from Ooty to Coonoor overlooking tea terraces",
        price: "₹200–₹500",
        tag: "UNESCO Joyride"
      },
      {
        name: "Dodabetta Tea Estate Plucking & Tasting Masterclass",
        detail: "Hand-pick tender tea leaves with local pluckers and sample single-estate orthodox teas in factory rooms",
        price: "₹150–₹350",
        tag: "Tea Masterclass"
      }
    ]
  },

  Pondicherry: {
    food: [
      {
        name: "Baker Street & Cafe des Arts",
        detail: "Authentic French baguettes, butter croissants, croque-monsieurs, ratatouille, and artisanal gelato",
        price: "₹200–₹600",
        tag: "French Dining"
      },
      {
        name: "Surguru & Heritage Tamil Canteen",
        detail: "Golden ghee roast paper dosas, filter coffee, idli-vada combos, and multi-dish Chettinad thalis",
        price: "₹80–₹250",
        tag: "Local Favourite"
      }
    ],
    guides: [
      {
        name: "White Town French Quarter Architectural Guide",
        detail: "Walking tour through 18th-century French colonial streetscapes, bougainvillea gates, and courtyards",
        price: "From ₹450",
        tag: "Top Pick"
      },
      {
        name: "Auroville Universal Township & Sustainability Guide",
        detail: "Guided immersion into green energy, organic farming, and the philosophy behind the Matrimandir",
        price: "From ₹550",
        tag: "Spiritual & Eco"
      }
    ],
    shopping: [
      {
        name: "Mission Street & Casablanca Boutique",
        detail: "Chic linen clothing, handmade aromatherapy candles, ceramic pottery, and leather craft goods",
        price: "Mixed",
        tag: "Top Pick"
      },
      {
        name: "Sri Aurobindo Ashram Handmade Paper & Incense",
        detail: "Traditional hand-milled rag paper journals, pure botanical incenses, and silk scarves",
        price: "Budget friendly",
        tag: "Artisan Craft"
      }
    ],
    activities: [
      {
        name: "White Town French Heritage Vintage Bicycle Tour",
        detail: "Early morning cycling through French and Tamil Quarters with seaside breakfast stop at Promenade Beach",
        price: "₹300–₹600",
        tag: "Heritage Cycling"
      },
      {
        name: "Auroville Matrimandir Concentration & Meditation",
        detail: "Sit in silent meditation beneath the golden geodesic dome in the serene amphitheater of human unity",
        price: "Free (Advance Pass)",
        tag: "Peace Immersion"
      }
    ]
  },

  Mumbai: {
    food: [
      {
        name: "Britannia & Co. & Heritage Irani Cafes",
        detail: "Famous Parsi Mutton Berry Pulao, Salli Boti, Brun Maska with sweet chai, and Caramel Custard since 1923",
        price: "₹250–₹700",
        tag: "Iconic Heritage"
      },
      {
        name: "Girgaon Chowpatty & Juhu Beach Street Food",
        detail: "Butter-drenched Pav Bhaji, crispy Bhel Puri, spicy Pani Puri, and rabdi-topped Kulfi on the sand",
        price: "₹80–₹250",
        tag: "Local Favourite"
      }
    ],
    guides: [
      {
        name: "South Mumbai Victorian Gothic & Art Deco Guide",
        detail: "Guided heritage walk through CST railway terminus, Oval Maidan, High Court, and Marine Drive Art Deco",
        price: "From ₹550",
        tag: "Top Pick"
      },
      {
        name: "Dharavi & Mumbai Coastal Culture Naturalist",
        detail: "Inspiring walking tour of local pottery guilds, leather workshops, recycling enterprise, and Koli fishing villages",
        price: "From ₹600",
        tag: "Cultural Walk"
      }
    ],
    shopping: [
      {
        name: "Colaba Causeway & Fashion Street",
        detail: "Bustling sidewalk market for bohemian brass jewelry, vintage books, antique watches, and trendy clothes",
        price: "Budget friendly",
        tag: "Top Pick"
      },
      {
        name: "Crawford Market (Mahatma Jyotiba Phule Mandai)",
        detail: "Historic 1869 Norman-Gothic indoor bazaar brimming with fragrant Alphonso mangoes, dry fruits, and spices",
        price: "Wholesale & Retail",
        tag: "Historic Bazaar"
      }
    ],
    activities: [
      {
        name: "Marine Drive Queen's Necklace Sunset Bicycle Ride",
        detail: "Pedal along the Arabian Sea shoreline with cool sea breezes as the city skyline lights up like pearls",
        price: "₹200–₹500",
        tag: "Sunset Coastal Ride"
      },
      {
        name: "Elephanta Caves UNESCO Rock-Cut Harbor Ferry Excursion",
        detail: "Cruise across Mumbai Harbor on a wooden ferry to explore the 1,500-year-old rock-cut Shiva Trimurti sculpture",
        price: "₹260–₹600",
        tag: "UNESCO Wonder"
      }
    ]
  },

  Hampi: {
    food: [
      {
        name: "Mango Tree & Riverside Open-Air Dining",
        detail: "Multi-course South Indian banana-leaf meals, wood-fired pizzas, and fresh fruit smoothies overlooking banana groves",
        price: "₹150–₹450",
        tag: "Top Pick"
      },
      {
        name: "Hampi Bazaar Traditional Tiffin Centers",
        detail: "Crispy Mysore Masala Dosas, hot Vada-Sambar, Paddu, and piping hot South Indian filter coffee",
        price: "₹40–₹120",
        tag: "Local Favourite"
      }
    ],
    guides: [
      {
        name: "Vijayanagara Empire Archaeological Master Guide",
        detail: "Certified ASI historian decoding the musical stone pillars, Queen's bath engineering, and Royal Enclosure ruins",
        price: "From ₹600",
        tag: "Top Pick"
      },
      {
        name: "Hampi Bouldering & Tungabhadra Nature Naturalist",
        detail: "Boulder climbing guidance, wildlife birdwatching, and sunset viewpoints along the sacred river",
        price: "From ₹500",
        tag: "Adventure Guide"
      }
    ],
    shopping: [
      {
        name: "Hampi Bazaar & Virupaksha Temple Street",
        detail: "Handmade Lambani gypsy mirror-work bags, carved granite stone statues, leather-bound diaries, and antique coins",
        price: "Budget friendly",
        tag: "Top Pick"
      },
      {
        name: "Anegundi Rural Women's Banana Fiber Cooperative",
        detail: "Eco-friendly handwoven bags, table runners, and coasters made from sustainable banana plant stem fibers",
        price: "Fair Trade",
        tag: "Eco-Friendly Craft"
      }
    ],
    activities: [
      {
        name: "Tungabhadra River Circular Coracle Boat Ride",
        detail: "Drift in traditional circular bamboo basket boats across granite boulder gorges near Kodanda Rama temple",
        price: "₹250–₹600",
        tag: "Sacred River Float"
      },
      {
        name: "Matanga Hill 360-Degree Sunrise Meditation",
        detail: "Climb ancient stone steps before dawn for the most legendary golden sunrise across 16 square miles of ruins",
        price: "Free Trail",
        tag: "Golden Sunrise"
      }
    ]
  },

  Andaman: {
    food: [
      {
        name: "Full Moon Cafe & Havelock Beach Shacks",
        detail: "Fresh catch grilled fish, tiger prawns in coconut curry, fresh crab roast, and tropical juices on the sand",
        price: "₹350–₹950",
        tag: "Top Pick"
      },
      {
        name: "New Lighthouse Restaurant Port Blair",
        detail: "Famous waterfront seafood center serving butter garlic lobster, fish curry, and tandoori coastal fare",
        price: "₹250–₹750",
        tag: "Local Favourite"
      }
    ],
    guides: [
      {
        name: "PADI Certified Coral Reef Scuba Diving Master",
        detail: "Certified dive instruction and guided underwater exploration of Andaman's rich coral gardens and marine life",
        price: "From ₹1,200",
        tag: "Certified Diver"
      },
      {
        name: "Cellular Jail National Memorial Freedom Historian",
        detail: "Profound historical narrative of India's freedom fighters, Veer Savarkar, and the penal settlement saga",
        price: "From ₹400",
        tag: "Historic Heritage"
      }
    ],
    shopping: [
      {
        name: "Aberdeen Bazaar Port Blair",
        detail: "Authentic mother-of-pearl jewelry, polished seashell lamps, carved coconut bowls, and island timber crafts",
        price: "Budget friendly",
        tag: "Top Pick"
      },
      {
        name: "Sagarika Government Cottage Industries Emporium",
        detail: "Government-certified Padauk wood artifacts, natural pearl necklaces, and tribal handicraft souvenirs",
        price: "Fixed price",
        tag: "Government Certified"
      }
    ],
    activities: [
      {
        name: "Elephant Beach Coral Reef Snorkeling & Sea Walking",
        detail: "Walk on the sea bed wearing specialized helmet oxygen hoods amidst vibrant corals and schools of reef fish",
        price: "₹1,000–₹2,500",
        tag: "Underwater Wonder"
      },
      {
        name: "Cellular Jail Sound & Light Patriotic Memorial Show",
        detail: "Poignant evening multimedia light show narrated under the historic Banyan tree honoring freedom martyrs",
        price: "₹100–₹250",
        tag: "Must Experience"
      }
    ]
  }
};

for (const [name, data] of Object.entries(newLocalData)) {
  localBusinessData[name] = data;
}

const fileContent = `const localBusinessData = ${JSON.stringify(localBusinessData, null, 2)};\n\nexport default localBusinessData;\n`;
fs.writeFileSync(path.resolve('src/data/localBusinessData.js'), fileContent, 'utf-8');
console.log(`Successfully updated localBusinessData.js! Total count: ${Object.keys(localBusinessData).length}`);

