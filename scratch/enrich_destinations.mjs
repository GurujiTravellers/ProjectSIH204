import fs from "fs";
import path from "path";

const filePath = path.resolve("./src/data/destinations.js");
let content = fs.readFileSync(filePath, "utf-8");

// Load existing destinations
const startIndex = content.indexOf("const destinations = [");
const endIndex = content.lastIndexOf("];");

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find destinations array");
  process.exit(1);
}

// Import existing destinations
const destinationsModule = await import("../src/data/destinations.js");
const destinations = JSON.parse(JSON.stringify(destinationsModule.default));

// 1. Manali Attractions (15 items)
const manaliAttractions = [
  { id: "manali_hadimba", name: "🛕 Hadimba Devi Temple", zone: "Old Manali & Hadimba", category: "Heritage & Spiritual", duration: 2, cost: 50, walking: "low", rating: 9.6, description: "Ancient wooden temple surrounded by tall deodar cedar forests, featuring intricate pagoda-style wood carving." },
  { id: "manali_manu_temple", name: "🛕 Manu Temple", zone: "Old Manali & Hadimba", category: "Heritage & Spiritual", duration: 1.5, cost: 0, walking: "medium", rating: 9.2, description: "Historical temple dedicated to sage Manu located on a scenic hilltop in Old Manali." },
  { id: "manali_old_manali", name: "🌲 Old Manali Village & Cafes", zone: "Old Manali & Hadimba", category: "Culture & Dining", duration: 2.5, cost: 0, walking: "medium", rating: 9.4, description: "Quaint village featuring rustic wooden houses, apple orchards, live music cafes, and vibrant culture." },
  { id: "manali_mall_road", name: "🛍️ Mall Road & Tibetan Monastery", zone: "Town Center & Mall", category: "Shopping & Culture", duration: 2, cost: 0, walking: "low", rating: 9.1, description: "Lively pedestrian promenade filled with woolen handicrafts, Tibetan market stalls, and local Himachali food." },
  { id: "manali_van_vihar", name: "🌿 Van Vihar National Park", zone: "Town Center & Mall", category: "Nature & Leisure", duration: 1.5, cost: 30, walking: "low", rating: 8.8, description: "Peaceful cedar forest park along the Beas River with a small boating pond and shaded walking trails." },
  { id: "manali_beas_river", name: "🌊 Beas River Nature Walk", zone: "Town Center & Mall", category: "Nature & Leisure", duration: 1.5, cost: 0, walking: "low", rating: 9.0, description: "Scenic walking trails along the sparkling mountain river offering stunning Himalayan views." },
  { id: "manali_vashisht", name: "♨️ Vashisht Hot Springs & Temple", zone: "Vashisht & East Bank", category: "Heritage & Wellness", duration: 2, cost: 0, walking: "medium", rating: 9.1, description: "Natural sulfur hot mineral springs with traditional stone baths and an ancient Rishi Vashisht shrine." },
  { id: "manali_jogini_falls", name: "🌊 Jogini Waterfall Trek", zone: "Vashisht & East Bank", category: "Nature & Trekking", duration: 3, cost: 0, walking: "high", rating: 9.7, description: "Breathtaking cascade through pine forests and apple orchards with panoramic views of the Kullu valley." },
  { id: "manali_solang", name: "🏔️ Solang Valley Adventure Park", zone: "Solang & North Valley", category: "Adventure & Scenic", duration: 3.5, cost: 500, walking: "medium", rating: 9.8, description: "Famous mountain valley offering paragliding, zorbing, quad biking, and winter ski slopes." },
  { id: "manali_rohtang", name: "🏞️ Rohtang Pass Snow Crest", zone: "Solang & North Valley", category: "Scenic & Snow", duration: 4, cost: 550, walking: "medium", rating: 9.9, description: "Spectacular 13,058 ft Himalayan pass with year-round snow fields and panoramic views of Pir Panjal peaks." },
  { id: "manali_atal_tunnel", name: "🚇 Atal Tunnel & Sissu Valley", zone: "Solang & North Valley", category: "Scenic & Engineering", duration: 3.5, cost: 0, walking: "low", rating: 9.8, description: "World's longest highway tunnel above 10,000 ft connecting Manali to the surreal landscapes of Lahaul." },
  { id: "manali_nehru_kund", name: "💧 Nehru Kund Natural Spring", zone: "Solang & North Valley", category: "Nature", duration: 1, cost: 0, walking: "low", rating: 8.7, description: "Clear spring of cold mountain water named after Pandit Jawaharlal Nehru, set along the Manali-Keylong highway." },
  { id: "manali_naggar_castle", name: "🏰 Naggar Castle Heritage", zone: "Naggar & Left Bank", category: "Heritage & Architecture", duration: 2, cost: 100, walking: "low", rating: 9.5, description: "Historic 15th-century wood and stone castle overlooking the Kullu valley with traditional Kathkuni architecture." },
  { id: "manali_nicholas_roerich", name: "🎨 Nicholas Roerich Art Gallery", zone: "Naggar & Left Bank", category: "Art & Culture", duration: 1.5, cost: 50, walking: "low", rating: 9.3, description: "Estate and gallery of the renowned Russian painter displaying majestic Himalayan landscape masterpieces." },
  { id: "manali_jana_falls", name: "🌊 Jana Waterfall & Dhaba Trail", zone: "Naggar & Left Bank", category: "Nature & Food", duration: 2.5, cost: 0, walking: "medium", rating: 9.2, description: "Hidden waterfall surrounded by deodar groves, renowned for authentic traditional Himachali food like Siddu." },
];

// 2. Shimla Attractions (14 items)
const shimlaAttractions = [
  { id: "shimla_ridge", name: "🏛️ The Ridge", zone: "Mall & Heritage Core", category: "Scenic & Leisure", duration: 2, cost: 0, walking: "medium", rating: 9.6, description: "Shimla's iconic open promenade offering spectacular mountain views and connecting major colonial landmarks." },
  { id: "shimla_christ_church", name: "⛪ Christ Church", zone: "Mall & Heritage Core", category: "Heritage", duration: 1, cost: 0, walking: "low", rating: 9.3, description: "Gothic church on The Ridge dating back to 1857, famous for stained glass windows and neo-Gothic facade." },
  { id: "shimla_mall_road", name: "🛍️ Mall Road Shimla", zone: "Mall & Heritage Core", category: "Shopping & Dining", duration: 2, cost: 0, walking: "low", rating: 9.2, description: "Pedestrian street lined with heritage colonial buildings, cafes, bookshops, and Himachali emporiums." },
  { id: "shimla_lakkar_bazaar", name: "🪵 Lakkar Bazaar Woodcrafts", zone: "Mall & Heritage Core", category: "Shopping & Culture", duration: 1.5, cost: 0, walking: "low", rating: 8.9, description: "Charming traditional market specializing in handcrafted wooden artifacts, walking sticks, and dry fruits." },
  { id: "shimla_jakhu_temple", name: "🌿 Jakhu Temple & Giant Hanuman Statue", zone: "Jakhu Hill & Ridge", category: "Spiritual & Scenic", duration: 2, cost: 0, walking: "medium", rating: 9.4, description: "Perched on Shimla's highest hill at 8,054 ft, featuring a colossal 108 ft Hanuman statue and panoramic views." },
  { id: "shimla_jakhu_ropeway", name: "🚡 Jakhu Ropeway Cable Car", zone: "Jakhu Hill & Ridge", category: "Adventure & View", duration: 1, cost: 500, walking: "low", rating: 9.1, description: "Scenic aerial cableway traveling between The Ridge and Jakhu Hill above pine forests." },
  { id: "shimla_viceregal_lodge", name: "🏛️ Viceregal Lodge (IIAS)", zone: "Observatory Hill", category: "Heritage & History", duration: 2.5, cost: 100, walking: "low", rating: 9.6, description: "Stately Jacobethan mansion on Observatory Hill that served as the summer capital residence of British Viceroys." },
  { id: "shimla_annandale", name: "🎖️ Annandale Ground & Army Heritage Museum", zone: "Annandale Valley", category: "History & Leisure", duration: 2, cost: 0, walking: "low", rating: 9.0, description: "Flat green glade in a forested valley with a golf course, helipad, and an inspiring military heritage museum." },
  { id: "shimla_chadwick_falls", name: "🌊 Chadwick Falls", zone: "Summer Hill", category: "Nature & Trekking", duration: 2, cost: 0, walking: "medium", rating: 8.8, description: "Crystal-clear waterfall dropping 86 meters through dense deodar and pine woods in Summer Hill." },
  { id: "shimla_tara_devi", name: "🛕 Tara Devi Temple Hilltop", zone: "South Ridge Outskirts", category: "Spiritual & Scenic", duration: 2.5, cost: 0, walking: "low", rating: 9.3, description: "Serene hilltop shrine dedicated to Goddess Tara offering 360-degree views of Shimla town and Shivalik range." },
  { id: "shimla_kufri", name: "🌲 Kufri Fun World & Mahasu Peak", zone: "Kufri & Higher Hills", category: "Adventure & Snow", duration: 3.5, cost: 300, walking: "medium", rating: 9.3, description: "High-altitude winter playground known for tobogganing, horseback rides, and views from Mahasu Peak." },
  { id: "shimla_green_valley", name: "🌄 Green Valley Scenic Viewpoint", zone: "Kufri & Higher Hills", category: "Scenic", duration: 1, cost: 0, walking: "low", rating: 9.1, description: "Famous photography viewpoint surrounded by dense evergreen pine forests along the Hindustan-Tibet road." },
  { id: "shimla_mashobra", name: "🌿 Mashobra Apple Orchards & Craignano", zone: "Mashobra & Naldehra", category: "Nature & Peace", duration: 2.5, cost: 50, walking: "low", rating: 9.2, description: "Tranquil hamlet surrounded by cedar forests, apple orchards, and the historic Craignano nature park." },
  { id: "shimla_toy_train", name: "🚂 Kalka-Shimla Toy Train Heritage Ride", zone: "Railway Heritage", category: "Heritage & Scenic", duration: 2, cost: 300, walking: "low", rating: 9.7, description: "UNESCO World Heritage narrow-gauge railway crossing 102 tunnels and 864 bridges with dramatic vistas." },
];

// 3. Darjeeling Attractions (14 items)
const darjeelingAttractions = [
  { id: "darjeeling_tiger_hill", name: "🌅 Tiger Hill Kanchenjunga Sunrise", zone: "Ghoom & Tiger Hill", category: "Scenic Viewpoint", duration: 2.5, cost: 50, walking: "low", rating: 9.9, description: "Legendary vantage point offering sunrise panoramas over Mount Kanchenjunga and Himalayan peaks." },
  { id: "darjeeling_ghoom_monastery", name: "☸️ Ghoom Yiga Choeling Monastery", zone: "Ghoom & Tiger Hill", category: "Heritage & Spiritual", duration: 1.5, cost: 0, walking: "low", rating: 9.3, description: "One of the oldest Tibetan Buddhist monasteries in Darjeeling, enshrining a 15-foot statue of Maitreya Buddha." },
  { id: "darjeeling_batasia_loop", name: "🏯 Batasia Loop & Gorkha War Memorial", zone: "Ghoom & Tiger Hill", category: "Heritage & Scenic", duration: 1.5, cost: 20, walking: "low", rating: 9.5, description: "Famous spiraling railway loop surrounded by manicured landscaped gardens with views of Kanchenjunga." },
  { id: "darjeeling_toy_train", name: "🚂 Darjeeling Himalayan Railway Joyride", zone: "Town Core & Railway", category: "Heritage & Joyride", duration: 2, cost: 1000, walking: "low", rating: 9.8, description: "Historic UNESCO World Heritage steam locomotive ride chugging from Darjeeling to Ghoom and back." },
  { id: "darjeeling_mall_chowrasta", name: "🛍️ Chowrasta & The Mall", zone: "Town Core & Railway", category: "Leisure & Promenade", duration: 2, cost: 0, walking: "medium", rating: 9.4, description: "Vibrant pedestrian square atop the ridge for leisure strolling, heritage bookstores, and open valley views." },
  { id: "darjeeling_observatory_hill", name: "🛕 Observatory Hill & Mahakal Temple", zone: "Town Core & Railway", category: "Spiritual & View", duration: 1.5, cost: 0, walking: "medium", rating: 9.1, description: "Sacred hilltop where Hindu temple bells and Buddhist prayer flags flutter harmoniously in the mountain breeze." },
  { id: "darjeeling_hmi", name: "🏔️ Himalayan Mountaineering Institute (HMI)", zone: "Jawahar Parbat Area", category: "Museum & History", duration: 2, cost: 110, walking: "medium", rating: 9.6, description: "Premier mountaineering training institute founded in 1954 featuring an inspiring Everest expedition museum." },
  { id: "darjeeling_zoo", name: "🐾 Padmaja Naidu Himalayan Zoological Park", zone: "Jawahar Parbat Area", category: "Wildlife & Nature", duration: 2, cost: 110, walking: "medium", rating: 9.5, description: "Internationally acclaimed high-altitude zoo breeding Red Pandas, Snow Leopards, and Himalayan wolves." },
  { id: "darjeeling_peace_pagoda", name: "🕊️ Japanese Peace Pagoda & Temple", zone: "Jalapahar Area", category: "Peace & Spiritual", duration: 1.5, cost: 0, walking: "low", rating: 9.4, description: "Serene Buddhist stupa designed to foster world peace, showcasing four avatars of Buddha in white stone." },
  { id: "darjeeling_happy_valley", name: "🍃 Happy Valley Tea Estate & Factory", zone: "Tea Garden Valley", category: "Tea & Experience", duration: 2, cost: 100, walking: "medium", rating: 9.5, description: "Historic 1854 tea plantation offering guided factory tasting tours amidst undulating emerald hillside terraces." },
  { id: "darjeeling_rock_garden", name: "🌊 Barbotey Rock Garden & Chunnu Falls", zone: "Valley Falls Area", category: "Nature & Cascades", duration: 2.5, cost: 50, walking: "medium", rating: 9.1, description: "Multi-tiered terraced picnic park carved around a natural tumbling mountain cascade." },
  { id: "darjeeling_ganga_maya", name: "🚣 Ganga Maya Boating Park", zone: "Valley Falls Area", category: "Nature & Leisure", duration: 1.5, cost: 30, walking: "low", rating: 8.8, description: "Scenic valley park with paddle boating, mountain stream gardens, and traditional Gorkha cultural performances." },
  { id: "darjeeling_nightingale_park", name: "🌺 Nightingale Shrubbery Park", zone: "Town Core & Railway", category: "Garden & Sunset", duration: 1.5, cost: 20, walking: "low", rating: 8.9, description: "Beautiful landscaped garden park with shaded benches, music fountain, and sunset views." },
  { id: "darjeeling_ropeway", name: "🚡 Rangeet Valley Passenger Cable Car", zone: "Tea Garden Valley", category: "Adventure & Panorama", duration: 1.5, cost: 250, walking: "low", rating: 9.3, description: "Thrilling cable car ride soaring over terraced tea gardens from Singamari down to the Little Rangeet River." },
];

// 4. Goa Destination (New ID 32 - 15 items)
const goaDestination = {
  id: 32,
  name: "Goa",
  state: "Goa",
  category: "Beach & Heritage",
  rating: 9.7,
  bestTime: "October - April",
  image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
  images: [
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80"
  ],
  description: "Goa is India's premier coastal paradise, celebrated for golden sandy beaches, Portuguese colonial architecture, UNESCO heritage churches, vibrant beach shacks, and tropical spice plantations. October to April brings ideal sunny beach weather, water sports, vibrant flea markets, and sunset river cruises.",
  attractions: [
    { id: "goa_fort_aguada", name: "🏰 Fort Aguada & 17th-Century Lighthouse", zone: "North Goa Coastal", category: "Heritage & Scenic", duration: 2, cost: 50, walking: "medium", rating: 9.6, description: "Well-preserved 17th-century Portuguese fortress overlooking Sinquerim Beach and the Arabian Sea." },
    { id: "goa_baga_beach", name: "🏖️ Baga Beach & Watersports Hub", zone: "North Goa Coastal", category: "Beach & Watersports", duration: 3, cost: 0, walking: "low", rating: 9.4, description: "Famous shoreline renowned for parasailing, jet skiing, vibrant beach shacks, and evening nightlife." },
    { id: "goa_calangute_beach", name: "🏖️ Calangute Beach & Seaside Shacks", zone: "North Goa Coastal", category: "Beach & Dining", duration: 2, cost: 0, walking: "low", rating: 9.1, description: "The 'Queen of Beaches' with wide golden sands, souvenir markets, and seaside seafood restaurants." },
    { id: "goa_anjuna_flea_market", name: "🛍️ Anjuna Beach & Flea Market", zone: "North Goa Heritage", category: "Shopping & Vibe", duration: 2.5, cost: 0, walking: "low", rating: 9.3, description: "Iconic bohemian beach famous for coconut palms, red laterite rocks, and colorful craft bazaars." },
    { id: "goa_chapora_fort", name: "🏰 Chapora Fort (Dil Chahta Hai Point)", zone: "North Goa Heritage", category: "Scenic & Sunset", duration: 2, cost: 0, walking: "medium", rating: 9.5, description: "Dramatic clifftop fortress ruins offering sweeping panoramas of Vagator Beach and the Chapora River mouth." },
    { id: "goa_vagator_beach", name: "🌅 Vagator Beach & Red Cliff Viewpoint", zone: "North Goa Heritage", category: "Beach & Sunset", duration: 2, cost: 0, walking: "low", rating: 9.4, description: "Stunning cove beach split into Big and Little Vagator, framed by dramatic red cliffs and swaying palms." },
    { id: "goa_basilica_bom_jesus", name: "⛪ Basilica of Bom Jesus (UNESCO Heritage)", zone: "Old Goa Heritage", category: "UNESCO Heritage & History", duration: 2, cost: 0, walking: "low", rating: 9.8, description: "Baroque 16th-century church holding the mortal remains of St. Francis Xavier, a masterpiece of Jesuit architecture." },
    { id: "goa_se_cathedral", name: "⛪ Se Cathedral & Golden Bell", zone: "Old Goa Heritage", category: "Heritage & Architecture", duration: 1.5, cost: 0, walking: "low", rating: 9.5, description: "One of the largest churches in Asia, dedicated to St. Catherine, featuring Corinthian interiors and majestic bell tower." },
    { id: "goa_fontainhas", name: "🎨 Fontainhas Latin Quarter Heritage Walk", zone: "Panaji Central", category: "Culture & Architecture", duration: 2, cost: 0, walking: "low", rating: 9.6, description: "Picturesque heritage quarter in Panaji lined with terracotta-tiled roofs, pastel-painted villas, and art galleries." },
    { id: "goa_mandovi_cruise", name: "🚢 Mandovi River Sunset Folk Cruise", zone: "Panaji Central", category: "Culture & Cruise", duration: 2, cost: 500, walking: "low", rating: 9.3, description: "Delightful evening boat cruise along the Mandovi River featuring Goan folk dances, music, and sunset vistas." },
    { id: "goa_sahakari_spice", name: "🌿 Sahakari Spice Farm Tour & Goan Buffet", zone: "Central Ponda", category: "Agro-Tourism & Food", duration: 3, cost: 500, walking: "low", rating: 9.5, description: "Aromatic plantation tour discovering cardamom, vanilla, cinnamon, and pepper, followed by authentic Goan lunch." },
    { id: "goa_dudhsagar", name: "🌊 Dudhsagar Waterfalls & Jungle Jeep Safari", zone: "Mollem Western Ghats", category: "Adventure & Waterfall", duration: 5, cost: 650, walking: "medium", rating: 9.9, description: "Four-tiered milky white cascade tumbling 310 meters down the Western Ghats inside Bhagwan Mahavir Wildlife Sanctuary." },
    { id: "goa_palolem_beach", name: "🏖️ Palolem Beach & Butterfly Island", zone: "South Goa Coastal", category: "Scenic & Calm Beach", duration: 3, cost: 0, walking: "low", rating: 9.7, description: "Idyllic crescent bay in South Goa with calm swimming waters, colorful beach huts, and dolphin boat trips." },
    { id: "goa_cabo_de_rama", name: "🏰 Cabo de Rama Fort Clifftop", zone: "South Goa Coastal", category: "History & Ocean View", duration: 2, cost: 0, walking: "medium", rating: 9.4, description: "Secluded southern promontory fort offering romantic views across endless blue horizons of the Arabian Sea." },
    { id: "goa_colva_beach", name: "🏖️ Colva Beach & Watersports", zone: "South Goa Coastal", category: "Beach & Leisure", duration: 2, cost: 0, walking: "low", rating: 9.0, description: "Vast powdery white sand beach stretching along South Goa's coastal belt, ideal for relaxing evening walks." },
  ]
};

// 5. Kalka Destination (New ID 33 - 10 items)
const kalkaDestination = {
  id: 33,
  name: "Kalka",
  state: "Haryana",
  category: "Heritage & Gateway",
  rating: 9.1,
  bestTime: "September - March",
  image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
  images: [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80"
  ],
  description: "Kalka is the historic gateway to the Himachal Himalayas and the starting terminus of the UNESCO World Heritage Kalka-Shimla Toy Train. Nestled in the Shivalik foothills, it features ancient spiritual shrines, Mughal terraced gardens, and scenic cable car adventures.",
  attractions: [
    { id: "kalka_unesco_railway", name: "🚂 Kalka UNESCO Heritage Railway Station", zone: "Kalka Heritage Station", category: "Heritage & Rail", duration: 1.5, cost: 0, walking: "low", rating: 9.7, description: "Historic 1903 railway terminus housing the narrow-gauge mountain train workshop and heritage locomotives." },
    { id: "kalka_kali_mata", name: "🛕 Kali Mata Historic Mandir", zone: "Kalka Heritage Station", category: "Spiritual & Ancient", duration: 1.5, cost: 0, walking: "low", rating: 9.5, description: "Ancient temple dating back to the Mahabharata era, dedicated to Goddess Kali from whom Kalka derives its name." },
    { id: "kalka_pinjore_gardens", name: "⛲ Yadavindra Pinjore Mughal Gardens", zone: "Pinjore Valley", category: "Heritage & Gardens", duration: 2.5, cost: 25, walking: "low", rating: 9.6, description: "Magnificent 17th-century terraced Mughal gardens with cascading fountains, water channels, and illuminated pavilions." },
    { id: "kalka_bhima_devi", name: "🏛️ Bhima Devi Temple Complex (Khajuraho of North)", zone: "Pinjore Valley", category: "Archaeology & History", duration: 1.5, cost: 15, walking: "low", rating: 9.2, description: "Ancient 8th-11th century stone temple complex and open-air sculpture museum reflecting Gurjara-Pratihara art." },
    { id: "kalka_timber_trail", name: "🚡 Timber Trail Cable Car & Shivalik View", zone: "Parwanoo Heights", category: "Adventure & Panorama", duration: 2.5, cost: 1250, walking: "low", rating: 9.4, description: "Exhilarating aerial ropeway gliding 1.8 km across deep gorges between two mountain ridges in Parwanoo." },
    { id: "kalka_kaushalya_dam", name: "🌊 Kaushalya Dam & Birdwatching Trail", zone: "Pinjore Valley", category: "Nature & Lake", duration: 2, cost: 0, walking: "medium", rating: 8.9, description: "Serene reservoir surrounded by Shivalik greenery, popular for morning walks and migratory birdwatching." },
    { id: "kalka_pinjore_heritage_bazaar", name: "🛍️ Pinjore Heritage Craft Bazaar", zone: "Pinjore Valley", category: "Shopping & Local Food", duration: 1.5, cost: 0, walking: "low", rating: 8.8, description: "Traditional market famous for local sweet shops, handicrafts, and Punjabi/Himachali snacks." },
    { id: "kalka_subathu_fort", name: "🏰 Subathu Gorkha Historical Fortress", zone: "Shivalik Foothills", category: "History", duration: 2, cost: 0, walking: "medium", rating: 8.7, description: "19th-century Gorkha cantonment hill outpost rich in military history and mountain vistas." },
    { id: "kalka_manki_point_nearby", name: "🌄 Manki Point Panorama Trail", zone: "Parwanoo Heights", category: "Scenic", duration: 2, cost: 0, walking: "medium", rating: 9.0, description: "Scenic vantage point offering sweeping views of the Sutlej River valley and surrounding mountain spurs." },
    { id: "kalka_dagshai_heritage", name: "🏛️ Dagshai Jail Museum & Heritage Walk", zone: "Shivalik Foothills", category: "Heritage", duration: 2, cost: 30, walking: "low", rating: 9.1, description: "One of India's oldest cantonment towns with a preserved colonial military prison museum." },
  ]
};

// Update destinations array
const manaliIdx = destinations.findIndex(d => d.name === "Manali");
if (manaliIdx !== -1) {
  destinations[manaliIdx].attractions = manaliAttractions;
}

const shimlaIdx = destinations.findIndex(d => d.name === "Shimla");
if (shimlaIdx !== -1) {
  destinations[shimlaIdx].attractions = shimlaAttractions;
}

const darjeelingIdx = destinations.findIndex(d => d.name === "Darjeeling");
if (darjeelingIdx !== -1) {
  destinations[darjeelingIdx].attractions = darjeelingAttractions;
}

// Ensure all other existing destinations have unique IDs, zones, and categories on their attractions
destinations.forEach(dest => {
  if (Array.isArray(dest.attractions)) {
    dest.attractions = dest.attractions.map((attr, idx) => ({
      id: attr.id || `${dest.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_attr_${idx + 1}`,
      name: attr.name,
      rating: attr.rating || 9.2,
      category: attr.category || "Sightseeing",
      zone: attr.zone || `${dest.name} Central`,
      duration: attr.duration || 2,
      cost: attr.cost || 0,
      walking: attr.walking || "medium",
      description: attr.description
    }));
  }
});

// Check if Goa exists; if not, add
if (!destinations.some(d => d.name === "Goa")) {
  destinations.push(goaDestination);
}

// Check if Kalka exists; if not, add
if (!destinations.some(d => d.name === "Kalka")) {
  destinations.push(kalkaDestination);
}

// Format code output cleanly
const outputCode = `const destinations = ${JSON.stringify(destinations, null, 2)};\n\nexport default destinations;\n`;
fs.writeFileSync(filePath, outputCode, "utf-8");
console.log(`Successfully updated destinations.js with ${destinations.length} destinations.`);

