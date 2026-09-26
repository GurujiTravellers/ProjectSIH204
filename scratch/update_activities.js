import fs from 'fs';
import path from 'path';
import localBusinessData from '../src/data/localBusinessData.js';

const destinationActivities = {
  Shimla: [
    {
      name: "Viceregal Lodge & British Gaiety Heritage Walk",
      detail: "Colonial architecture tour with local historian through Ridge, Christ Church, and Viceregal Lodge",
      price: "₹350–₹700",
      tag: "Heritage Walk"
    },
    {
      name: "Jakhoo Hill Pine Forest Nature Hike & Sunset",
      detail: "Scenic forest trail amidst giant deodars leading to Hanuman temple and panoramic sunset ridge",
      price: "Free / ₹200 Cable Car",
      tag: "Nature & Sunset"
    }
  ],
  Manali: [
    {
      name: "Old Manali Riverside Trout Trail & Cafe Jamming",
      detail: "Stroll along Manalsu river, sample fresh Himalayan trout, and experience live acoustic indie music",
      price: "₹300–₹650",
      tag: "Local Culture"
    },
    {
      name: "Solang Valley Paragliding & Alpine Meadow Adventure",
      detail: "Tandem paragliding glide over lush alpine meadows with breathtaking views of snow-capped peaks",
      price: "₹1,500–₹3,200",
      tag: "Adventure Experience"
    }
  ],
  "Rohtang Pass": [
    {
      name: "High-Altitude Snow Sledge & Ski Experience",
      detail: "Snow sliding and ski runs at 13,058 ft altitude overlooking eternal Himalayan glaciers",
      price: "₹600–₹1,500",
      tag: "Snow Adventure"
    },
    {
      name: "Pir Panjal Mountain Panorama Photography Walk",
      detail: "Guided high-altitude photo walk capturing Pir Panjal peaks, Beas Kund source, and glacial valleys",
      price: "From ₹500",
      tag: "Photography"
    }
  ],
  Kasol: [
    {
      name: "Parvati River Pine Walk & Chalal Village Trail",
      detail: "Gentle riverside hike crossing suspension bridges to the tranquil hippie hamlets of Chalal and Katagla",
      price: "Free Trail / ₹300 Guide",
      tag: "Riverside Trail"
    },
    {
      name: "Traditional Israeli Shakshuka & Herbal Tea Workshop",
      detail: "Learn authentic hummus and pita making paired with fresh Himalayan chamomile and rhododendron tea",
      price: "₹400–₹800",
      tag: "Culinary Activity"
    }
  ],
  Chitkul: [
    {
      name: "Hindustan Ka Aakhri Dhabha & Indo-Tibetan Border Walk",
      detail: "Scenic hike to India's last frontier border post along the crystal-clear Baspa river bank",
      price: "Free Walking Trail",
      tag: "Border Experience"
    },
    {
      name: "Kinnauri Wooden Architecture & Pebble Art Tour",
      detail: "Explore 500-year-old wooden Mathi temple carvings, slate roofs, and Baspa river pebble painting",
      price: "From ₹300",
      tag: "Cultural Immersion"
    }
  ],
  Kalpa: [
    {
      name: "Kinnaur Kailash Golden Sunrise Glow View",
      detail: "Witness the sacred Shivling peak change color from fiery gold to crimson pink at daybreak",
      price: "Free Experience",
      tag: "Spiritual Sunrise"
    },
    {
      name: "Roghi Village Cliffside & Apple Orchard Walk",
      detail: "Walk along sheer dramatic drop cliff roads through heritage wooden houses and juicy Kinnauri apple orchards",
      price: "From ₹400",
      tag: "Village Walk"
    }
  ],
  Sissu: [
    {
      name: "Sissu Waterfall Suspension Bridge Hike",
      detail: "Cross the swinging bridge over Chandra river to reach the thundering 50-meter waterfall mist pool",
      price: "Free / ₹50 Entry",
      tag: "Waterfall Hike"
    },
    {
      name: "Lahauli Campfire Tales & Starlight Astrophotography",
      detail: "Gather around traditional Bukhari wood stoves for Lahauli folk legends under zero-light-pollution night skies",
      price: "₹400–₹900",
      tag: "Stargazing & Culture"
    }
  ],
  Kaza: [
    {
      name: "Key Monastery Morning Chanting with Tibetan Monks",
      detail: "Sit in silent meditation inside 1,000-year-old prayer halls while monks chant and share warm butter tea",
      price: "Donation based",
      tag: "Monastic Immersion"
    },
    {
      name: "Langza Prehistoric Fossil Hunting & Hikkim Postcard Trail",
      detail: "Find marine Tethys Sea ammonite fossils and mail a postcard home from the world's highest post office",
      price: "From ₹600",
      tag: "Spiti Heritage"
    }
  ],
  "Chandratal Lake": [
    {
      name: "Crescent Moon Lake Holy Parikrama Walk",
      detail: "Scenic high-altitude circumambulation of the sacred turquoise crescent lake surrounded by Himalayan crags",
      price: "Free Walk",
      tag: "Sacred Lake Walk"
    },
    {
      name: "Spiti Milky Way Stargazing & High-Altitude Lake Camping",
      detail: "Marvel at the dazzling galactic core of the Milky Way galaxy mirrored across glacial waters",
      price: "₹1,200–₹2,500",
      tag: "Astrophotography"
    }
  ],
  Haridwar: [
    {
      name: "Har Ki Pauri Evening Maha Ganga Aarti Experience",
      detail: "Witness thousands of floating flower diyas, resounding conch shells, and Vedic chants along the sacred ghats",
      price: "Free Spiritual Seva",
      tag: "Spiritual Immersion"
    },
    {
      name: "Mansa Devi & Chandi Devi Cable Car Mountain Pilgrimage",
      detail: "Scenic ropeway trolley ride soaring high above the holy Ganges river to hilltop Shakti temples",
      price: "₹250–₹450",
      tag: "Ropeway Pilgrimage"
    }
  ],
  Rishikesh: [
    {
      name: "Sacred Ganga River White Water Rafting & Cliff Jump",
      detail: "Exhilarating 16 km rapid run from Shivpuri through Roller Coaster and Golf Course rapids to NIM Beach",
      price: "₹650–₹1,500",
      tag: "Adventure Thrill"
    },
    {
      name: "Beatles Ashram (Chaurasi Kutia) & Sound Healing Meditation",
      detail: "Explore psychedelic graffiti meditation caves and join a Himalayan singing bowl sunset sound bath",
      price: "₹150–₹600",
      tag: "Wellness & Art"
    }
  ],
  Dehradun: [
    {
      name: "Robber's Cave (Guchhupani) Cold Stream Wading Trail",
      detail: "Wade through ankle-deep natural cold springs inside narrow limestone gorge caves",
      price: "₹40–₹100",
      tag: "Nature Adventure"
    },
    {
      name: "Mindrolling Monastery Garden Meditation & Tibetan Stupa Tour",
      detail: "Admire the 185-foot Great Stupa, spin prayer wheels, and walk among peaceful landscaped Japanese gardens",
      price: "Free Entry",
      tag: "Peace & Heritage"
    }
  ],
  Mussoorie: [
    {
      name: "Camel's Back Road Mist Walk & Ruskin Bond Literary Trail",
      detail: "Scenic 3 km deodar tree walk overlooking the Doon valley with stops at vintage bookshops and author cottages",
      price: "Free / ₹300 Guide",
      tag: "Heritage & Literature"
    },
    {
      name: "George Everest Peak Sunset Hike & Cloud's End Trail",
      detail: "Hike to the historic observatory house of Sir George Everest for 360-degree views of Aglar Valley peaks",
      price: "₹200–₹500",
      tag: "Sunset Hike"
    }
  ],
  Srinagar: [
    {
      name: "Sunset Shikara Cruise on Dal Lake & Char Chinar",
      detail: "Gliding across lotus blossoms on a cushioned wooden Shikara while sipping steaming saffron Kahwa tea",
      price: "₹500–₹1,200",
      tag: "Iconic Experience"
    },
    {
      name: "Pashmina Weaving & Walnut Woodcarving Artisan Studio",
      detail: "Private demonstration of intricate Kani shawl weaving and centuries-old Kashmiri paper-mache art",
      price: "Free / Workshop ₹400",
      tag: "Artisan Craft"
    }
  ],
  Gulmarg: [
    {
      name: "Gulmarg Gondola Phase 2 Ride to Apharwat Peak (13,780 ft)",
      detail: "World's highest operating cable car carrying passengers above the clouds into pristine high-altitude snowfields",
      price: "₹1,050–₹1,850",
      tag: "Must Experience"
    },
    {
      name: "Pine Forest Nordic Snowshoeing & Skiing Masterclass",
      detail: "Beginner and advanced ski sessions on powdery Himalayan slopes guided by certified mountaineers",
      price: "₹1,200–₹3,000",
      tag: "Winter Sport"
    }
  ],
  Pahalgam: [
    {
      name: "Baisaran ('Mini Switzerland') Pine Meadow Pony Trail",
      detail: "Scenic horseback ride through dense deodar forests opening onto boundless emerald alpine meadows",
      price: "₹800–₹1,600",
      tag: "Scenic Meadow"
    },
    {
      name: "Betaab Valley & Lidder River Trout Stream Angling",
      detail: "Catch-and-release rainbow trout angling and riverside nature picnics beneath snow-capped Himalayan peaks",
      price: "₹500–₹1,200",
      tag: "River & Leisure"
    }
  ],
  Digha: [
    {
      name: "Red Crab Beach Sunrise Walk & Marine Center Visit",
      detail: "Watch thousands of red ghost crabs scuttle along golden sands during low tide and tour marine biodiversity",
      price: "Free / ₹50 Entry",
      tag: "Coastal Nature"
    },
    {
      name: "Udaipur Beach Sunset Coconut Grove Stroll & Fresh Catch",
      detail: "Relax under shade of casuarina and palm groves while savoring fire-grilled pomfret and sweet tender coconut",
      price: "₹200–₹500",
      tag: "Beach Relaxation"
    }
  ],
  Darjeeling: [
    {
      name: "UNESCO Darjeeling Himalayan Toy Train Joy Ride",
      detail: "Ride the historic 1881 steam locomotive through Batasia Loop with stunning views of Mt. Kanchenjunga",
      price: "₹600–₹1,400",
      tag: "UNESCO Joyride"
    },
    {
      name: "Happy Valley Tea Estate Plucking & Tasting Masterclass",
      detail: "Pluck two leaves and a bud in terraced tea gardens followed by first-flush Muscatel tea cupping",
      price: "₹300–₹600",
      tag: "Tea Tasting"
    }
  ],
  Kolkata: [
    {
      name: "Heritage Electric Tram Ride & College Street Boi Para Walk",
      detail: "Rattle through vintage streets on Asia's oldest electric tram and browse world's largest secondhand book market",
      price: "₹30–₹250",
      tag: "Heritage Immersion"
    },
    {
      name: "Kumartuli Clay Idol Artisan Alleyways Culture Trail",
      detail: "Walk through labyrinthine potter workshops where master sculptors handcraft clay idols of Goddess Durga",
      price: "₹300–₹600",
      tag: "Art & Culture"
    }
  ],
  Puri: [
    {
      name: "Golden Beach Sunrise Sand Art Workshop with Local Masters",
      detail: "Learn sculpting delicate sand figures on Puri's Blue Flag certified beach alongside renowned local sculptors",
      price: "₹300–₹600",
      tag: "Sand Art Workshop"
    },
    {
      name: "Raghurajpur Heritage Village Pattachitra Painting Tour",
      detail: "Visit living artisan village where every home produces palm-leaf engravings and traditional Pattachitra scrolls",
      price: "₹400–₹800",
      tag: "Living Craft Village"
    }
  ],
  Bhubaneswar: [
    {
      name: "Old Town Ekamra Kshetra 1,000-Year Temple Walk",
      detail: "Guided morning exploration of Lingaraj, Mukteshvara, and Rajarani sandstone temple architectural mastery",
      price: "₹300–₹600",
      tag: "Temple Heritage"
    },
    {
      name: "Dhauli Shanti Stupa Buddhist Meditation & Sunset Pagoda",
      detail: "Contemplate peace at the site of Emperor Ashoka's historical conversion with sweeping river plain views",
      price: "Free / ₹100 Guide",
      tag: "Spiritual History"
    }
  ],
  Konark: [
    {
      name: "Sun Temple Stone Chariot Wheel Celestial Calculation Walk",
      detail: "Expert guide explains the astronomical sundial accuracy and erotic stone iconography of 13th-century chariot",
      price: "₹300–₹600",
      tag: "UNESCO Wonder"
    },
    {
      name: "Chandrabhaga Beach Morning Surfing & Casuarina Cycling",
      detail: "Catch tranquil morning waves or cycle along marine drive flanked by dense whispering casuarina woods",
      price: "₹250–₹800",
      tag: "Beach Adventure"
    }
  ],
  Shillong: [
    {
      name: "Umiam Lake (Barapani) Kayaking & Water Sports Morning",
      detail: "Paddle through tranquil emerald inlets surrounded by Khasi pine ridges with morning hill mist",
      price: "₹350–₹900",
      tag: "Lake Watersports"
    },
    {
      name: "Laitlum Canyons Misty Edge Trek & Khasi Folk Music",
      detail: "Hike along dramatic gorges nicknamed 'End of the World' followed by live acoustic rock at hill cafes",
      price: "₹400–₹800",
      tag: "Canyon Trek & Music"
    }
  ],
  "Mawlynnong Village": [
    {
      name: "Bamboo Sky Walk Canopy Tower overlooking Bangladesh Plains",
      detail: "Climb an 85-foot eco-bamboo tower engineered over treetops for endless panoramic border views",
      price: "₹50–₹100",
      tag: "Eco Canopy View"
    },
    {
      name: "Riwai Living Root Bridge Nature Hike & Bio-Village Tour",
      detail: "Trek over centuries-old living Ficus elastica root bridge intertwining across jungle streams",
      price: "₹100–₹300",
      tag: "Living Bio-Wonder"
    }
  ],
  Dawki: [
    {
      name: "Umngot River Glass Boat Ride & Pebble Beach Snorkeling",
      detail: "Glide on water so crystal clear the wooden country boats appear to float mid-air over river bed stones",
      price: "₹500–₹1,000",
      tag: "Floating Boat Trail"
    },
    {
      name: "Shnongpdeng Riverside Cliff Jumping & Starlit Camping",
      detail: "Leap from natural river rocks into emerald waters and sleep under canvas tents on riverside white pebbles",
      price: "₹800–₹1,800",
      tag: "River Adventure"
    }
  ],
  Jaipur: [
    {
      name: "Hot Air Balloon Safari over Amber Fort & Aravalli Ridges",
      detail: "Float peacefully over hilltop forts, royal desert palaces, and historic village stepwells at sunrise",
      price: "₹8,500–₹12,000",
      tag: "Aerial Splendour"
    },
    {
      name: "Bagru Handblock Printing & Natural Indigo Dyeing Workshop",
      detail: "Carve your own wooden stamp, mix natural plant dyes, and handprint a souvenir cotton scarf with artisans",
      price: "₹600–₹1,400",
      tag: "Royal Craft"
    }
  ],
  Jaisalmer: [
    {
      name: "Sam Sand Dunes Sunset Camel Safari & Kalbelia Folk Night",
      detail: "Trek golden desert dunes on camelback, watch fiery sunsets, and enjoy live desert gypsy fire dancing",
      price: "₹800–₹2,200",
      tag: "Thar Desert Magic"
    },
    {
      name: "Sonar Qila Living Fort Rooftop Haveli Heritage Walk",
      detail: "Explore the golden sandstone bastions, 12th-century Jain temples, and rooftop tea stalls inside India's only living fort",
      price: "₹400–₹800",
      tag: "Medieval Living Fort"
    }
  ],
  Ajmer: [
    {
      name: "Dargah Sharif Evening Qawwali Spiritual Immersion",
      detail: "Listen to devotional Sufi qawwali singers under marble domes while offering red roses and velvet chadar",
      price: "Donation based",
      tag: "Sufi Devotion"
    },
    {
      name: "Ana Sagar Lake Sunset Boating & Daulat Bagh Stroll",
      detail: "Paddle across scenic artificial lake built in 1150 AD and wander through Emperor Jahangir's marble pavilions",
      price: "₹150–₹350",
      tag: "Mughal Garden Leisure"
    }
  ],
  Delhi: [
    {
      name: "Old Delhi Heritage Cycle/Rickshaw & Sensory Street Food Safari",
      detail: "Early morning cycling through Chandni Chowk, Asia's largest spice market rooftop, and paratha gallis",
      price: "₹600–₹1,500",
      tag: "Heritage & Gastronomy"
    },
    {
      name: "Nizamuddin Dargah Thursday Night Sufi Qawwali Gathering",
      detail: "Soulful Nizami brother Sufi poetry, burning loban incense, and centuries of mystic Delhi devotion",
      price: "Free Experience",
      tag: "Sufi Musical Gathering"
    }
  ],
  Agra: [
    {
      name: "Mehtab Bagh Sunset Taj Reflection & Yamuna Boat View",
      detail: "Photograph the silhouette of the Taj Mahal bathed in golden hour light mirrored in the calm river waters",
      price: "₹150–₹400",
      tag: "Iconic Sunset View"
    },
    {
      name: "Mughal Pietra Dura (Parchin Kari) Marble Inlay Craft Workshop",
      detail: "Watch descendants of Taj Mahal artisans hand-cut semi-precious lapis lazuli and onyx into white Makrana marble",
      price: "Free Demo / ₹500 Class",
      tag: "Mughal Art Masterclass"
    }
  ]
};

// Apply activities to all destinations in localBusinessData
let updatedCount = 0;
for (const [dest, activities] of Object.entries(destinationActivities)) {
  if (localBusinessData[dest]) {
    localBusinessData[dest].activities = activities;
    updatedCount++;
  } else {
    console.warn(`Destination ${dest} not found in localBusinessData!`);
  }
}

console.log(`Updated ${updatedCount} destinations with activities.`);

// Format output as JavaScript file
const fileContent = `const localBusinessData = ${JSON.stringify(localBusinessData, null, 2)};\n\nexport default localBusinessData;\n`;

fs.writeFileSync(path.resolve('src/data/localBusinessData.js'), fileContent, 'utf-8');
console.log('Successfully wrote updated localBusinessData.js!');

