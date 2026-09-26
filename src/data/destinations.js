const destinations = [
  {
    "id": 1,
    "name": "Shimla",
    "state": "Himachal Pradesh",
    "category": "Hill Station",
    "rating": 9,
    "bestTime": "October - November, December - February ",
    "image": "https://www.orchidhotel.com/static/website/images/home/shimla/blog/cityscape-of-shimla-himachal-pradesh-city_slider.webp",
    "images": [
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpbWxhJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D",
      "https://www.sterlingholidays.com/activities/shimla/the%20ridge.jpg.imgw.1280.1280.jpeg",
      "https://plus.unsplash.com/premium_photo-1697729439457-85d4b9d3a2cb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hpbWxhJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D",
      "https://www.authenticindiatours.com/app/uploads/2022/03/The-Queen-of-Hills-Shimla-Himachal-Pradesh-1400x550-c-default.jpg"
    ],
    "description": "Shimla is a beautiful hill station known for its pleasant weather, colonial architecture, and Himalayan views.\nMarch to June is ideal for sightseeing, nature walks, outdoor activities, and escaping the summer heat.\nOctober and November offer crisp weather, clear mountain views, and a peaceful atmosphere with fewer crowds.\nDecember–February is best for snow lovers, while the monsoon months can bring heavy rain and occasional travel disruptions.",
    "attractions": [
      {
        "id": "shimla_ridge",
        "name": "🏛️ The Ridge",
        "rating": 9.6,
        "category": "Scenic & Leisure",
        "zone": "Mall & Heritage Core",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Shimla's iconic open promenade offering spectacular mountain views and connecting major colonial landmarks."
      },
      {
        "id": "shimla_christ_church",
        "name": "⛪ Christ Church",
        "rating": 9.3,
        "category": "Heritage",
        "zone": "Mall & Heritage Core",
        "duration": 1,
        "cost": 0,
        "walking": "low",
        "description": "Gothic church on The Ridge dating back to 1857, famous for stained glass windows and neo-Gothic facade."
      },
      {
        "id": "shimla_mall_road",
        "name": "🛍️ Mall Road Shimla",
        "rating": 9.2,
        "category": "Shopping & Dining",
        "zone": "Mall & Heritage Core",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "description": "Pedestrian street lined with heritage colonial buildings, cafes, bookshops, and Himachali emporiums."
      },
      {
        "id": "shimla_lakkar_bazaar",
        "name": "🪵 Lakkar Bazaar Woodcrafts",
        "rating": 8.9,
        "category": "Shopping & Culture",
        "zone": "Mall & Heritage Core",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "description": "Charming traditional market specializing in handcrafted wooden artifacts, walking sticks, and dry fruits."
      },
      {
        "id": "shimla_jakhu_temple",
        "name": "🌿 Jakhu Temple & Giant Hanuman Statue",
        "rating": 9.4,
        "category": "Spiritual & Scenic",
        "zone": "Jakhu Hill & Ridge",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Perched on Shimla's highest hill at 8,054 ft, featuring a colossal 108 ft Hanuman statue and panoramic views."
      },
      {
        "id": "shimla_jakhu_ropeway",
        "name": "🚡 Jakhu Ropeway Cable Car",
        "rating": 9.1,
        "category": "Adventure & View",
        "zone": "Jakhu Hill & Ridge",
        "duration": 1,
        "cost": 500,
        "walking": "low",
        "description": "Scenic aerial cableway traveling between The Ridge and Jakhu Hill above pine forests."
      },
      {
        "id": "shimla_viceregal_lodge",
        "name": "🏛️ Viceregal Lodge (IIAS)",
        "rating": 9.6,
        "category": "Heritage & History",
        "zone": "Observatory Hill",
        "duration": 2.5,
        "cost": 100,
        "walking": "low",
        "description": "Stately Jacobethan mansion on Observatory Hill that served as the summer capital residence of British Viceroys."
      },
      {
        "id": "shimla_annandale",
        "name": "🎖️ Annandale Ground & Army Heritage Museum",
        "rating": 9,
        "category": "History & Leisure",
        "zone": "Annandale Valley",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "description": "Flat green glade in a forested valley with a golf course, helipad, and an inspiring military heritage museum."
      },
      {
        "id": "shimla_chadwick_falls",
        "name": "🌊 Chadwick Falls",
        "rating": 8.8,
        "category": "Nature & Trekking",
        "zone": "Summer Hill",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Crystal-clear waterfall dropping 86 meters through dense deodar and pine woods in Summer Hill."
      },
      {
        "id": "shimla_tara_devi",
        "name": "🛕 Tara Devi Temple Hilltop",
        "rating": 9.3,
        "category": "Spiritual & Scenic",
        "zone": "South Ridge Outskirts",
        "duration": 2.5,
        "cost": 0,
        "walking": "low",
        "description": "Serene hilltop shrine dedicated to Goddess Tara offering 360-degree views of Shimla town and Shivalik range."
      },
      {
        "id": "shimla_kufri",
        "name": "🌲 Kufri Fun World & Mahasu Peak",
        "rating": 9.3,
        "category": "Adventure & Snow",
        "zone": "Kufri & Higher Hills",
        "duration": 3.5,
        "cost": 300,
        "walking": "medium",
        "description": "High-altitude winter playground known for tobogganing, horseback rides, and views from Mahasu Peak."
      },
      {
        "id": "shimla_green_valley",
        "name": "🌄 Green Valley Scenic Viewpoint",
        "rating": 9.1,
        "category": "Scenic",
        "zone": "Kufri & Higher Hills",
        "duration": 1,
        "cost": 0,
        "walking": "low",
        "description": "Famous photography viewpoint surrounded by dense evergreen pine forests along the Hindustan-Tibet road."
      },
      {
        "id": "shimla_mashobra",
        "name": "🌿 Mashobra Apple Orchards & Craignano",
        "rating": 9.2,
        "category": "Nature & Peace",
        "zone": "Mashobra & Naldehra",
        "duration": 2.5,
        "cost": 50,
        "walking": "low",
        "description": "Tranquil hamlet surrounded by cedar forests, apple orchards, and the historic Craignano nature park."
      },
      {
        "id": "shimla_toy_train",
        "name": "🚂 Kalka-Shimla Toy Train Heritage Ride",
        "rating": 9.7,
        "category": "Heritage & Scenic",
        "zone": "Railway Heritage",
        "duration": 2,
        "cost": 300,
        "walking": "low",
        "description": "UNESCO World Heritage narrow-gauge railway crossing 102 tunnels and 864 bridges with dramatic vistas."
      }
    ]
  },
  {
    "id": 2,
    "name": "Manali",
    "state": "Himachal Pradesh",
    "category": "Hill Station",
    "rating": 9.4,
    "bestTime": "March - June, October - November",
    "image": "https://www.tourmyindia.com/socialimg/kullu-manali-tour.jpg",
    "images": [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/b2/79/37/solang-valley-manali.jpg?w=1200&h=-1&s=1",
      "https://t4.ftcdn.net/jpg/03/04/01/79/360_F_304017914_06ibltT3eX4UID80q0dSUybLsrfzUubL.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpyqHCPZXLQJTTe9jz2tUGcJMWfxz50XX8d-pzSrFT-yM6qLlKulImOu_&s=10",
      "https://s7ap1.scene7.com/is/image/incredibleindia/hidimba-temple-manali-himachal-pradesh-5-musthead-hero?qlt=82&ts=1726730757462"
    ],
    "description": "Manali is a spectacular Himalayan destination surrounded by snow-capped mountains, pine forests, rivers, and lush valleys.\nMarch to June offers pleasant weather and is excellent for sightseeing, adventure activities, trekking, and exploring nearby valleys.\nOctober and November provide crisp weather, beautiful autumn landscapes, and relatively peaceful surroundings.\nDecember to February is ideal for experiencing snowfall and winter activities, especially around Solang Valley.\nManali is perfect for couples, families, adventure seekers, nature lovers, and travelers looking for a scenic mountain escape.",
    "attractions": [
      {
        "id": "manali_hadimba",
        "name": "🛕 Hadimba Devi Temple",
        "rating": 9.6,
        "category": "Heritage & Spiritual",
        "zone": "Old Manali & Hadimba",
        "duration": 2,
        "cost": 50,
        "walking": "low",
        "description": "Ancient wooden temple surrounded by tall deodar cedar forests, featuring intricate pagoda-style wood carving."
      },
      {
        "id": "manali_manu_temple",
        "name": "🛕 Manu Temple",
        "rating": 9.2,
        "category": "Heritage & Spiritual",
        "zone": "Old Manali & Hadimba",
        "duration": 1.5,
        "cost": 0,
        "walking": "medium",
        "description": "Historical temple dedicated to sage Manu located on a scenic hilltop in Old Manali."
      },
      {
        "id": "manali_old_manali",
        "name": "🌲 Old Manali Village & Cafes",
        "rating": 9.4,
        "category": "Culture & Dining",
        "zone": "Old Manali & Hadimba",
        "duration": 2.5,
        "cost": 0,
        "walking": "medium",
        "description": "Quaint village featuring rustic wooden houses, apple orchards, live music cafes, and vibrant culture."
      },
      {
        "id": "manali_mall_road",
        "name": "🛍️ Mall Road & Tibetan Monastery",
        "rating": 9.1,
        "category": "Shopping & Culture",
        "zone": "Town Center & Mall",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "description": "Lively pedestrian promenade filled with woolen handicrafts, Tibetan market stalls, and local Himachali food."
      },
      {
        "id": "manali_van_vihar",
        "name": "🌿 Van Vihar National Park",
        "rating": 8.8,
        "category": "Nature & Leisure",
        "zone": "Town Center & Mall",
        "duration": 1.5,
        "cost": 30,
        "walking": "low",
        "description": "Peaceful cedar forest park along the Beas River with a small boating pond and shaded walking trails."
      },
      {
        "id": "manali_beas_river",
        "name": "🌊 Beas River Nature Walk",
        "rating": 9,
        "category": "Nature & Leisure",
        "zone": "Town Center & Mall",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "description": "Scenic walking trails along the sparkling mountain river offering stunning Himalayan views."
      },
      {
        "id": "manali_vashisht",
        "name": "♨️ Vashisht Hot Springs & Temple",
        "rating": 9.1,
        "category": "Heritage & Wellness",
        "zone": "Vashisht & East Bank",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Natural sulfur hot mineral springs with traditional stone baths and an ancient Rishi Vashisht shrine."
      },
      {
        "id": "manali_jogini_falls",
        "name": "🌊 Jogini Waterfall Trek",
        "rating": 9.7,
        "category": "Nature & Trekking",
        "zone": "Vashisht & East Bank",
        "duration": 3,
        "cost": 0,
        "walking": "high",
        "description": "Breathtaking cascade through pine forests and apple orchards with panoramic views of the Kullu valley."
      },
      {
        "id": "manali_solang",
        "name": "🏔️ Solang Valley Adventure Park",
        "rating": 9.8,
        "category": "Adventure & Scenic",
        "zone": "Solang & North Valley",
        "duration": 3.5,
        "cost": 500,
        "walking": "medium",
        "description": "Famous mountain valley offering paragliding, zorbing, quad biking, and winter ski slopes."
      },
      {
        "id": "manali_rohtang",
        "name": "🏞️ Rohtang Pass Snow Crest",
        "rating": 9.9,
        "category": "Scenic & Snow",
        "zone": "Solang & North Valley",
        "duration": 4,
        "cost": 550,
        "walking": "medium",
        "description": "Spectacular 13,058 ft Himalayan pass with year-round snow fields and panoramic views of Pir Panjal peaks."
      },
      {
        "id": "manali_atal_tunnel",
        "name": "🚇 Atal Tunnel & Sissu Valley",
        "rating": 9.8,
        "category": "Scenic & Engineering",
        "zone": "Solang & North Valley",
        "duration": 3.5,
        "cost": 0,
        "walking": "low",
        "description": "World's longest highway tunnel above 10,000 ft connecting Manali to the surreal landscapes of Lahaul."
      },
      {
        "id": "manali_nehru_kund",
        "name": "💧 Nehru Kund Natural Spring",
        "rating": 8.7,
        "category": "Nature",
        "zone": "Solang & North Valley",
        "duration": 1,
        "cost": 0,
        "walking": "low",
        "description": "Clear spring of cold mountain water named after Pandit Jawaharlal Nehru, set along the Manali-Keylong highway."
      },
      {
        "id": "manali_naggar_castle",
        "name": "🏰 Naggar Castle Heritage",
        "rating": 9.5,
        "category": "Heritage & Architecture",
        "zone": "Naggar & Left Bank",
        "duration": 2,
        "cost": 100,
        "walking": "low",
        "description": "Historic 15th-century wood and stone castle overlooking the Kullu valley with traditional Kathkuni architecture."
      },
      {
        "id": "manali_nicholas_roerich",
        "name": "🎨 Nicholas Roerich Art Gallery",
        "rating": 9.3,
        "category": "Art & Culture",
        "zone": "Naggar & Left Bank",
        "duration": 1.5,
        "cost": 50,
        "walking": "low",
        "description": "Estate and gallery of the renowned Russian painter displaying majestic Himalayan landscape masterpieces."
      },
      {
        "id": "manali_jana_falls",
        "name": "🌊 Jana Waterfall & Dhaba Trail",
        "rating": 9.2,
        "category": "Nature & Food",
        "zone": "Naggar & Left Bank",
        "duration": 2.5,
        "cost": 0,
        "walking": "medium",
        "description": "Hidden waterfall surrounded by deodar groves, renowned for authentic traditional Himachali food like Siddu."
      }
    ]
  },
  {
    "id": 3,
    "name": "Rohtang Pass",
    "state": "Himachal Pradesh",
    "category": "Mountain Pass",
    "rating": 9.7,
    "bestTime": "May - June, September - October",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/rohtang-pass-manali-himachal-pradesh-2-attr-hero?qlt=82&ts=1726730662558",
    "images": [
      "https://thewildcone.com/wp-content/uploads/2022/09/rohtang-pass-view.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy5P-1Lv9rGUcecwQ3dMwEBafkvW94EUsHLFfQMUnCv_D-jeKA0wHe2Ak&s=10",
      "https://i0.wp.com/oneday.travel/wp-content/uploads/one-day-manali-to-rohtang-pass-sightseeing-tour-package-by-taxi-glimpse-header.jpg?resize=1920%2C1280&ssl=1",
      "https://etimg.etb2bimg.com/photo/87883151.cms"
    ],
    "description": "Rohtang Pass is a spectacular high-altitude mountain pass connecting the Kullu Valley with the Lahaul and Spiti regions.\nIt is famous for breathtaking snow-covered mountains, glaciers, vast valleys, and dramatic Himalayan landscapes.\nMay to June is ideal for experiencing snow and enjoying the scenic mountain roads after the pass opens for visitors.\nSeptember and October offer clearer skies, stunning landscapes, and comparatively less snow with excellent mountain views.\nThe pass is perfect for adventure seekers, nature lovers, photographers, and travelers looking for an unforgettable Himalayan experience.",
    "attractions": [
      {
        "id": "rohtang_pass_attr_1",
        "name": "🏔️ Rohtang Pass Viewpoint",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Rohtang Pass Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The main viewpoint provides spectacular panoramic views of snow-covered Himalayan peaks and surrounding valleys.\nIt is the perfect place for photography, enjoying snow, and experiencing the dramatic high-altitude landscape."
      },
      {
        "id": "rohtang_pass_attr_2",
        "name": "❄️ Snow Point",
        "rating": 9.7,
        "category": "Sightseeing",
        "zone": "Rohtang Pass Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A popular area where visitors can experience snow and enjoy various seasonal winter activities.\nThe pristine white landscape creates an unforgettable experience for families, couples, and adventure lovers."
      },
      {
        "id": "rohtang_pass_attr_3",
        "name": "🏞️ Lahaul Valley",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Rohtang Pass Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The stunning Lahaul Valley lies beyond Rohtang Pass and features rugged mountains, rivers, monasteries, and unique Himalayan scenery.\nIts remote landscapes provide an excellent experience for travelers seeking nature and adventure."
      },
      {
        "id": "rohtang_pass_attr_4",
        "name": "🌊 Chandra River",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Rohtang Pass Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The Chandra River flows through the dramatic mountain landscapes of the Lahaul region.\nIts turquoise waters, rocky surroundings, and towering peaks make it a beautiful location for photography and sightseeing."
      },
      {
        "id": "rohtang_pass_attr_5",
        "name": "🏔️ Gulaba",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Rohtang Pass Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Gulaba is a scenic mountain destination on the route toward Rohtang Pass, surrounded by forests and magnificent Himalayan peaks.\nIt is a popular alternative for enjoying snow and mountain scenery when Rohtang Pass access is restricted."
      }
    ]
  },
  {
    "id": 4,
    "name": "Kasol",
    "state": "Himachal Pradesh",
    "category": "Nature & Backpacking",
    "rating": 9.1,
    "bestTime": "March - June, October - November",
    "image": "https://hblimg.mmtcdn.com/content/hubble/img/new_dest_imagemar/mmt/activities/m_Kasol_3_l_800_1200.jpg",
    "images": [
      "https://media1.thrillophilia.com/filestore/6e08h3dc2hm7gkxbliscs6ilw03g_dest_wiki_6702.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdDKYqpsAQe-8qRRCbeFfzdU6MpQ0fG6R4011_T8eCcQ2PHpHdOdfuIFj4&s=10",
      "https://upload.wikimedia.org/wikipedia/commons/8/88/The_village_of_Tosh_in_Himachal_Pradesh%2C_India_%28photo_by_Jim_Ankan_Deka%29.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
      "https://backpackersunited.in/_next/image?url=https%3A%2F%2Fbpu-images-v1.s3.eu-north-1.amazonaws.com%2Fuploads%2F1722049813650_Chala%20Village%202%20.png&w=1920&q=75"
    ],
    "description": "Kasol is a charming village in the Parvati Valley surrounded by mountains, pine forests, and the beautiful Parvati River.\nIt is famous for its relaxed atmosphere, scenic landscapes, cafés, trekking routes, and backpacker culture.\nMarch to June offers pleasant weather for trekking, sightseeing, camping, and exploring nearby villages.\nOctober and November bring cool temperatures, clear mountain views, and a peaceful atmosphere.\nKasol is ideal for backpackers, young travelers, nature lovers, photographers, and adventure seekers.",
    "attractions": [
      {
        "id": "kasol_attr_1",
        "name": "🌊 Parvati River",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Kasol Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The beautiful Parvati River flows through Kasol and creates a peaceful Himalayan riverside landscape.\nIt is perfect for relaxing, photography, riverside walks, and enjoying the surrounding mountains."
      },
      {
        "id": "kasol_attr_2",
        "name": "🥾 Kheerganga Trek",
        "rating": 9.7,
        "category": "Sightseeing",
        "zone": "Kasol Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of the most popular trekking experiences in the Parvati Valley, passing through forests and mountain villages.\nThe trek is famous for its scenic views and natural hot-water spring at the top."
      },
      {
        "id": "kasol_attr_3",
        "name": "🏘️ Malana Village",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Kasol Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "An ancient remote village known for its distinctive culture, traditions, and dramatic Himalayan surroundings.\nThe journey to Malana is itself an adventurous experience for trekkers and explorers."
      },
      {
        "id": "kasol_attr_4",
        "name": "🌲 Tosh Village",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Kasol Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A picturesque mountain village located at the end of the Parvati Valley, surrounded by dramatic peaks.\nIts traditional houses, cafés, trekking routes, and peaceful atmosphere attract nature lovers."
      },
      {
        "id": "kasol_attr_5",
        "name": "🏕️ Chalal Village",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Kasol Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A peaceful village near Kasol accessible by a scenic forest trail across the Parvati Valley.\nIt is ideal for travelers looking for quiet mountain views, village life, and riverside relaxation."
      }
    ]
  },
  {
    "id": 5,
    "name": "Chitkul",
    "state": "Himachal Pradesh",
    "category": "Offbeat & Village",
    "rating": 9.2,
    "bestTime": "May - October",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/10/81/18/chitkul.jpg?w=1200&h=-1&s=1",
    "images": [
      "https://cdn.raachotrekkers.com/wp-content/uploads/2021/02/Chitkul-in-October-month-1.jpg",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/70/c9/a6/chhitkul.jpg?w=1200&h=-1&s=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjl6vFaKHvEt4CW-k917IF59rvS69m5w5punux-IqsOsp_0S7lsYjTtDuj&s=10",
      "https://www.nitworldwideholidays.com/offbeat-destinations-india/himachal-pradesh/img/rakcham/Rakcham2.jpg"
    ],
    "description": "Chitkul is a remote and picturesque village in Himachal Pradesh's Kinnaur district near the Indo-Tibetan border.\nIt is known for traditional wooden houses, apple orchards, the Baspa River, and spectacular Himalayan scenery.\nMay to June is excellent for exploring the village, trekking, and enjoying pleasant mountain weather.\nSeptember and October offer crisp weather, clear skies, and beautiful autumn landscapes.\nChitkul is perfect for offbeat travelers, photographers, nature lovers, and those seeking peaceful Himalayan experiences.",
    "attractions": [
      {
        "id": "chitkul_attr_1",
        "name": "🏘️ Chitkul Village",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Chitkul Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The village offers a beautiful combination of traditional architecture, mountain scenery, and peaceful Himalayan life.\nWalking through its narrow paths provides an authentic experience of Kinnauri culture."
      },
      {
        "id": "chitkul_attr_2",
        "name": "🌊 Baspa River",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Chitkul Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The crystal-clear Baspa River flows beside Chitkul through a spectacular mountain valley.\nIts peaceful surroundings are perfect for photography, nature walks, and relaxation."
      },
      {
        "id": "chitkul_attr_3",
        "name": "🛕 Mathi Temple",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Chitkul Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "This historic temple dedicated to Goddess Mathi is an important cultural and religious landmark in Chitkul.\nIts traditional wooden architecture beautifully reflects the heritage of the Kinnaur region."
      },
      {
        "id": "chitkul_attr_4",
        "name": "🌄 Rakcham",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Chitkul Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Rakcham is a scenic village surrounded by forests, meadows, and towering Himalayan peaks.\nIt is an excellent place for peaceful walks, camping, and experiencing rural mountain life."
      },
      {
        "id": "chitkul_attr_5",
        "name": "🏔️ Baspa Valley",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Chitkul Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The Baspa Valley is famous for its dramatic mountains, green meadows, forests, and flowing river.\nIts untouched landscapes make it one of the most beautiful regions around Chitkul."
      }
    ]
  },
  {
    "id": 6,
    "name": "Kalpa",
    "state": "Himachal Pradesh",
    "category": "Scenic & Heritage",
    "rating": 9.1,
    "bestTime": "April - June, September - November",
    "image": "https://images.unsplash.com/photo-1640035209336-df638dd26c4d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2FscGF8ZW58MHx8MHx8fDA%3D",
    "images": [
      "https://hblimg.mmtcdn.com/content/hubble/img/maingalleryimgs/mmt/activities/m_Kalpa_1_l_668_1000.jpg",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/a8/a5/2e/temple.jpg?w=1200&h=-1&s=1",
      "https://img.indianholidaytrip.com/place/2023/Apr/Img_7650_202326120943_Roghi_village.jpg",
      "https://static.toiimg.com/thumb/93246424/Kalpa.jpg?width=1200&height=900"
    ],
    "description": "Kalpa is a peaceful Himalayan village in Kinnaur famous for magnificent views of the Kinner Kailash range.\nThe village is surrounded by apple orchards, pine forests, traditional houses, and beautiful mountain landscapes.\nApril to June provides pleasant weather and is ideal for sightseeing and exploring the surrounding villages.\nSeptember to November offers clear skies and spectacular views of the snow-covered Himalayan peaks.\nKalpa is ideal for nature lovers, photographers, couples, and travelers seeking a peaceful mountain retreat.",
    "attractions": [
      {
        "id": "kalpa_attr_1",
        "name": "🏔️ Kinner Kailash Viewpoint",
        "rating": 9.7,
        "category": "Sightseeing",
        "zone": "Kalpa Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The viewpoint offers breathtaking views of the majestic Kinner Kailash mountain range.\nIt is particularly beautiful during sunrise and sunset when the peaks change colors."
      },
      {
        "id": "kalpa_attr_2",
        "name": "🛕 Narayan Nagini Temple",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Kalpa Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A traditional temple known for its intricate wooden architecture and religious significance.\nIt provides visitors with an opportunity to experience the unique cultural heritage of Kinnaur."
      },
      {
        "id": "kalpa_attr_3",
        "name": "🍎 Kalpa Apple Orchards",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Kalpa Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Kalpa's beautiful apple orchards cover the surrounding hillsides and create stunning seasonal landscapes.\nVisitors can enjoy peaceful walks while experiencing the agricultural traditions of the region."
      },
      {
        "id": "kalpa_attr_4",
        "name": "🏘️ Roghi Village",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Kalpa Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A traditional Kinnauri village offering spectacular views of deep valleys and surrounding mountains.\nIts wooden houses and quiet atmosphere make it excellent for photography and cultural exploration."
      },
      {
        "id": "kalpa_attr_5",
        "name": "🌄 Suicide Point",
        "rating": 8.7,
        "category": "Sightseeing",
        "zone": "Kalpa Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A dramatic cliffside viewpoint near Roghi known for its spectacular views over the valley.\nVisitors should remain behind designated safety barriers while enjoying the impressive scenery."
      }
    ]
  },
  {
    "id": 7,
    "name": "Sissu",
    "state": "Himachal Pradesh",
    "category": "Scenic Valley",
    "rating": 9.3,
    "bestTime": "May - June, September - October",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpMK8XHTSgrBse7zcGM2ads9ujQZrGeqmiQcT6cqitlQ4hAMOXcwvhQGs&s=10",
    "images": [
      "https://captureatrip-cms-storage.s3.ap-south-1.amazonaws.com/Photography_and_Nature_Walk_aa9bbc4481.webp",
      "https://external-preview.redd.it/sissu-helipad-is-open-for-tourists-till-june-after-that-it-v0-xdF8tXsX7I7NCOISPu1takZzEGX1NVhTUT4u94DCBCs.png?format=pjpg&auto=webp&s=987c3603146375ea2bea953d95e084050ab4eadc",
      "https://media.assettype.com/outlooktraveller/2025-07-02/htmv4qvx/shutterstock2360489943.jpg?w=1200&ar=40%3A21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk76BukBsIAbb0BfY6xhZTaL1i5VakdJ2TQKlTc66L7Meh_i46CwRUuh5L&s=10"
    ],
    "description": "Sissu is a spectacular village in Lahaul Valley surrounded by towering mountains, waterfalls, and green landscapes.\nIt has become popular for its dramatic Himalayan scenery and peaceful atmosphere.\nMay and June are excellent for enjoying green valleys, pleasant weather, and accessible mountain roads.\nSeptember and October offer clear skies, autumn colors, and excellent conditions for photography.\nSissu is ideal for nature lovers, photographers, families, couples, and road-trip travelers.",
    "attractions": [
      {
        "id": "sissu_attr_1",
        "name": "💦 Sissu Waterfall",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Sissu Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A beautiful waterfall descends dramatically from the surrounding mountain slopes near Sissu.\nIt is one of the most popular photography and sightseeing spots in the valley."
      },
      {
        "id": "sissu_attr_2",
        "name": "🌊 Chandra River",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Sissu Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The Chandra River flows through the Lahaul landscape with spectacular mountains rising on both sides.\nIts turquoise waters and rugged surroundings create a memorable Himalayan setting."
      },
      {
        "id": "sissu_attr_3",
        "name": "🏔️ Sissu Lake",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Sissu Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A peaceful water body surrounded by dramatic mountains and natural scenery.\nIt is an excellent place for photography and enjoying the quiet atmosphere of Lahaul."
      },
      {
        "id": "sissu_attr_4",
        "name": "🚠 Sissu Gondola",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Sissu Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The gondola provides an exciting way to experience panoramic views of the surrounding Himalayan landscape.\nIt is especially attractive for visitors who want scenic views without a long trek."
      },
      {
        "id": "sissu_attr_5",
        "name": "🏘️ Sissu Village",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Sissu Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The village offers beautiful views of mountains, traditional houses, and the Chandra River valley.\nIt is an excellent stop for experiencing the peaceful lifestyle of the Lahaul region."
      }
    ]
  },
  {
    "id": 8,
    "name": "Kaza",
    "state": "Himachal Pradesh",
    "category": "High Altitude Town",
    "rating": 9.2,
    "bestTime": "June - September",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnibw7Ssmf9Cg1961iv_zmDbc3NpmPsEU0h_emMmnz0iPgVs1Aa2Sy6d4&s=10",
    "images": [
      "https://assets.justwravel.in/blog-media/2025/02/1c573b36-key-monastery-in-spiti.jpg",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/a7/0d/33/img-0886-largejpg.jpg?w=900&h=-1&s=1",
      "https://static2.tripoto.com/media/filter/tst/img/1356436/TripDocument/1626980636_spiti_trailer_00_02_18_03_still003_01.jpg",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/8d/45/d5/what-a-colourful-place.jpg?w=900&h=-1&s=1"
    ],
    "description": "Kaza is the largest town and cultural center of the remote and spectacular Spiti Valley.\nIt is surrounded by barren mountains, ancient monasteries, high-altitude villages, and dramatic desert-like landscapes.\nJune to September is the best period to explore Kaza because roads are generally more accessible and the weather is comparatively favorable.\nThe region becomes extremely cold during winter and many routes can become inaccessible because of heavy snowfall.\nKaza is perfect for adventure travelers, bikers, photographers, trekkers, and explorers seeking remote Himalayan landscapes.",
    "attractions": [
      {
        "id": "kaza_attr_1",
        "name": "🛕 Key Monastery",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Kaza Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of the most famous Buddhist monasteries in Spiti, dramatically perched above the Spiti River.\nIts ancient architecture, spiritual atmosphere, and mountain views make it a must-visit."
      },
      {
        "id": "kaza_attr_2",
        "name": "🏘️ Kibber Village",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Kaza Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A high-altitude village surrounded by rugged mountains and spectacular Spiti landscapes.\nIt is known for its traditional houses, wildlife, and dramatic Himalayan scenery."
      },
      {
        "id": "kaza_attr_3",
        "name": "🏔️ Hikkim",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Kaza Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A remote high-altitude village famous for its location and spectacular mountain surroundings.\nIt is a popular stop for travelers exploring the unique villages of Spiti Valley."
      },
      {
        "id": "kaza_attr_4",
        "name": "📮 Langza Village",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Kaza Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A scenic fossil-rich village dominated by enormous Himalayan peaks and traditional homes.\nThe famous Buddha statue and panoramic landscape make Langza particularly photogenic."
      },
      {
        "id": "kaza_attr_5",
        "name": "🛕 Tabo Monastery",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Kaza Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "An ancient Buddhist monastery complex known for its historic murals, sculptures, and spiritual significance.\nIts remarkable heritage makes it one of the most important cultural attractions in Spiti."
      }
    ]
  },
  {
    "id": 9,
    "name": "Chandratal Lake",
    "state": "Himachal Pradesh",
    "category": "Nature & Trekking",
    "rating": 9.6,
    "bestTime": "June - September",
    "image": "https://res.cloudinary.com/kmadmin/image/upload/v1723550885/kiomoi/chandratal_lake_2732.jpg",
    "images": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16P2YnIiIwvNZSaV-2TPybSFB9SmMqFvhLo0HRZkRQ0ma5jmlYj6MgBS2&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFzvbRHHly5IxDNZwWHifFLHbiRQ6HtdBbs1l7bGC31wuIuXgTHg55Lj8&s=10",
      "https://scontent.fccu2-1.fna.fbcdn.net/v/t39.30808-6/686946684_3703021119840071_5453274324911044368_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1287&ctp=s2048x1287&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=bzZ1ZYPpURoQ7kNvwGRIXAX&_nc_oc=Adq9eil88_1zu7KbUSgs8501pnK_o_WTT9wD59PMzmBW1xeJ1ZQ2cKX6__tI4v4wzxbpFCOgp98DQ22OfTVtt_rQ&_nc_zt=23&_nc_ht=scontent.fccu2-1.fna&_nc_gid=OkehNCcKjbiGo-H8oYaKew&_nc_ss=7b289&oh=00_AQJ1zJA8xQ2EO63IKc8yPkBkHwPGyICoH7NewG2Mx8F73g&oe=6AA347C1",
      "https://storage.googleapis.com/stateless-www-justwravel-com/2019/03/Spiti-Road-Trip-JustWravel-7.jpg"
    ],
    "description": "Chandratal Lake is a breathtaking crescent-shaped high-altitude lake located in the Spiti region of Himachal Pradesh.\nThe lake is surrounded by barren mountains, meadows, and spectacular Himalayan landscapes.\nJune to September is the main visiting season when the access route is generally open and the weather is more suitable.\nThe lake becomes extremely cold outside the summer season and access can be restricted by snow.\nIt is an excellent destination for trekkers, campers, photographers, nature lovers, and adventure enthusiasts.",
    "attractions": [
      {
        "id": "chandratal_lake_attr_1",
        "name": "🌙 Chandratal Lake",
        "rating": 10,
        "category": "Sightseeing",
        "zone": "Chandratal Lake Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The stunning crescent-shaped lake is famous for its changing shades of blue surrounded by dramatic mountains.\nIts pristine landscape makes it one of the most beautiful high-altitude lakes in India."
      },
      {
        "id": "chandratal_lake_attr_2",
        "name": "🏕️ Chandratal Camps",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Chandratal Lake Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Camping near the lake provides an unforgettable experience beneath the clear Himalayan night sky.\nThe remote location offers spectacular stargazing and peaceful natural surroundings."
      },
      {
        "id": "chandratal_lake_attr_3",
        "name": "🏔️ Kunzum Pass",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Chandratal Lake Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A spectacular high-altitude mountain pass connecting the Lahaul and Spiti regions.\nIt offers dramatic views of snow-covered peaks and rugged Himalayan terrain."
      },
      {
        "id": "chandratal_lake_attr_4",
        "name": "🌄 Bara-lacha La",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Chandratal Lake Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of the famous high mountain passes on the Manali-Leh route surrounded by magnificent Himalayan landscapes.\nIt is particularly popular among road-trip and motorcycle travelers."
      },
      {
        "id": "chandratal_lake_attr_5",
        "name": "🏞️ Spiti Valley",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Chandratal Lake Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The surrounding Spiti Valley is famous for remote villages, monasteries, barren mountains, and unique landscapes.\nIt provides an extraordinary adventure experience for travelers seeking untouched Himalayan scenery."
      }
    ]
  },
  {
    "id": 10,
    "name": "Haridwar",
    "state": "Uttarakhand",
    "category": "Spiritual",
    "rating": 9.1,
    "bestTime": "October - March",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/ganga-ghat-haridwar1-attr-hero?qlt=82&ts=1726645870499",
    "images": [
      "https://clubmahindra.gumlet.io/blog/images/haridwar-image.jpg?w=376&dpr=2.6",
      "https://s7ap1.scene7.com/is/image/incredibleindia/chandi-devi-temple-haridwar-uttarakhand-1-musthead-hero?qlt=82&ts=1726646011851",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVFsgpuvB6Xt3gwO0RRY_4m8JvxB2DkfrtN3bW796L4IGKKlMJHOqL1h7p&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3gyMIRnu_HUMyeFK04NPBy7UX9RhS0vWv12BbQoP2WfkxMTmlKMgSRj7V&s=10"
    ],
    "description": "Haridwar is one of India's most important spiritual cities, situated on the banks of the sacred Ganges River.\nThe city is famous for ancient temples, vibrant ghats, religious ceremonies, and the spectacular Ganga Aarti.\nOctober to March offers cooler and more comfortable weather for sightseeing and exploring the city's spiritual landmarks.\nSummer can be hot, while the monsoon season may bring heavy rainfall and higher river levels.\nHaridwar is ideal for pilgrims, families, spiritual travelers, photographers, and visitors interested in Indian culture.",
    "attractions": [
      {
        "id": "haridwar_attr_1",
        "name": "🪔 Har Ki Pauri",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Haridwar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Har Ki Pauri is Haridwar's most famous ghat and one of the city's most sacred locations.\nThe evening Ganga Aarti creates a spectacular spiritual experience with lamps, prayers, and devotional music."
      },
      {
        "id": "haridwar_attr_2",
        "name": "🛕 Mansa Devi Temple",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Haridwar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A revered hilltop temple dedicated to Goddess Mansa Devi overlooking Haridwar.\nThe ropeway journey and panoramic views of the city and Ganges add to the experience."
      },
      {
        "id": "haridwar_attr_3",
        "name": "🙏 Chandi Devi Temple",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Haridwar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A famous temple located on Neel Parvat and dedicated to Goddess Chandi Devi.\nVisitors can reach the temple by trekking or ropeway while enjoying beautiful views of Haridwar."
      },
      {
        "id": "haridwar_attr_4",
        "name": "🧘 Sapt Rishi Ashram",
        "rating": 8.8,
        "category": "Sightseeing",
        "zone": "Haridwar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A peaceful spiritual ashram associated with the seven ancient sages of Hindu tradition.\nIts tranquil riverside setting makes it suitable for meditation and quiet reflection."
      },
      {
        "id": "haridwar_attr_5",
        "name": "🌊 Ganga Ghat",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Haridwar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The ghats along the Ganges provide a deeply spiritual atmosphere throughout the day.\nVisitors can experience rituals, prayers, river views, and the cultural traditions of Haridwar."
      }
    ]
  },
  {
    "id": 11,
    "name": "Rishikesh",
    "state": "Uttarakhand",
    "category": "Spiritual & Adventure",
    "rating": 9.5,
    "bestTime": "September - November, February - May",
    "image": "https://himalayanoutback.com/wp-content/uploads/2022/04/Interesting-Facts-About-Rishikesh.jpg",
    "images": [
      "https://captureatrip-cms-storage.s3.ap-south-1.amazonaws.com/Best_Time_to_Visit_Laxman_Jhula_fa2b5c527f.webp",
      "https://d1kxjw4xo8k4dx.cloudfront.net/uploads/images/1778438058886-wsc91b5g-WhatsApp_Image_2026-05-11_at_00.03.46.jpeg",
      "https://www.timelesstrails.in/wp-content/uploads/2023/05/Writer-at-Beatles-Ashram-at-Rishikesh.jpg",
      "https://static.toiimg.com/photo/msid-50847763,width-96,height-65.cms"
    ],
    "description": "Rishikesh is a famous spiritual and adventure destination situated along the sacred Ganges River.\nIt is known for yoga, meditation, ancient ashrams, suspension bridges, rafting, and beautiful Himalayan surroundings.\nSeptember to November and February to May offer pleasant conditions for sightseeing, rafting, trekking, and outdoor activities.\nThe monsoon season can bring heavy rainfall and river rafting is generally seasonal.\nRishikesh is perfect for adventure seekers, spiritual travelers, families, backpackers, and wellness enthusiasts.",
    "attractions": [
      {
        "id": "rishikesh_attr_1",
        "name": "🌉 Laxman Jhula",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Rishikesh Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The iconic suspension bridge area is surrounded by temples, cafés, ashrams, and beautiful views of the Ganges.\nIt is a popular place to experience the spiritual and lively atmosphere of Rishikesh."
      },
      {
        "id": "rishikesh_attr_2",
        "name": "🌉 Ram Jhula",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Rishikesh Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A famous suspension bridge crossing the Ganges and connecting important spiritual areas.\nThe bridge offers excellent river and mountain views while providing access to nearby temples and ashrams."
      },
      {
        "id": "rishikesh_attr_3",
        "name": "🚣 River Rafting",
        "rating": 9.7,
        "category": "Sightseeing",
        "zone": "Rishikesh Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Rishikesh is one of India's best-known destinations for white-water rafting on the Ganges.\nThe activity combines thrilling rapids with spectacular Himalayan scenery."
      },
      {
        "id": "rishikesh_attr_4",
        "name": "🧘 Beatles Ashram",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Rishikesh Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The former ashram became internationally famous after The Beatles visited it in the 1960s.\nIts meditation halls, murals, and peaceful forest setting make it a fascinating cultural attraction."
      },
      {
        "id": "rishikesh_attr_5",
        "name": "🪔 Triveni Ghat",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Rishikesh Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of Rishikesh's most important riverfront ghats, famous for its evening Ganga Aarti.\nThe combination of devotional music, lamps, and the flowing Ganges creates a memorable experience."
      }
    ]
  },
  {
    "id": 12,
    "name": "Dehradun",
    "state": "Uttarakhand",
    "category": "City & Nature",
    "rating": 8.7,
    "bestTime": "March - June, September - November",
    "image": "https://maharanacabs.in/wp-content/uploads/2024/04/Untitled-design-77.jpg",
    "images": [
      "https://images.pexels.com/photos/32074585/pexels-photo-32074585.jpeg?cs=srgb&dl=pexels-amisha-bhatnagar-845323269-32074585.jpg&fm=jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Amazing_view_of_Robber_Cave_Dehradun_Uttarakhand_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
      "https://s7ap1.scene7.com/is/image/incredibleindia/shiv-mandir-dehradun-tri-hero?qlt=82&ts=1727167297652",
      "https://srgholiday.com/wp-content/uploads/2026/01/Malsi-Deer-Park-Dehradun1.webp"
    ],
    "description": "Dehradun is the capital of Uttarakhand and a gateway to several famous Himalayan destinations.\nThe city combines pleasant valley landscapes, educational institutions, temples, caves, and natural attractions.\nMarch to June provides comfortable weather for exploring the city and nearby attractions.\nSeptember to November offers cooler temperatures, clear skies, and beautiful surrounding landscapes.\nDehradun is ideal for families, students, nature lovers, weekend travelers, and visitors exploring Uttarakhand.",
    "attractions": [
      {
        "id": "dehradun_attr_1",
        "name": "💧 Robber's Cave",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Dehradun Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A fascinating natural cave formation where a stream flows through a narrow rocky passage.\nIts unusual landscape and cool surroundings make it one of Dehradun's most popular attractions."
      },
      {
        "id": "dehradun_attr_2",
        "name": "🌊 Sahastradhara",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Dehradun Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A scenic waterfall and natural spring area surrounded by lush hills near Dehradun.\nIt is popular for relaxing, enjoying nature, and experiencing the area's natural beauty."
      },
      {
        "id": "dehradun_attr_3",
        "name": "🏛️ Forest Research Institute",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Dehradun Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A magnificent colonial-era institution surrounded by extensive gardens and beautiful architecture.\nIts grand buildings and museum collections make it an excellent destination for history and architecture lovers."
      },
      {
        "id": "dehradun_attr_4",
        "name": "🛕 Tapkeshwar Temple",
        "rating": 8.9,
        "category": "Sightseeing",
        "zone": "Dehradun Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A unique Shiva temple located inside a natural cave beside a seasonal stream.\nThe peaceful surroundings and distinctive cave setting make it a popular spiritual attraction."
      },
      {
        "id": "dehradun_attr_5",
        "name": "🌳 Malsi Deer Park",
        "rating": 8.5,
        "category": "Sightseeing",
        "zone": "Dehradun Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A small nature park situated near the foothills of the Himalayas and surrounded by greenery.\nIt is a family-friendly destination for enjoying nature and observing wildlife."
      }
    ]
  },
  {
    "id": 13,
    "name": "Mussoorie",
    "state": "Uttarakhand",
    "category": "Hill Station",
    "rating": 9.2,
    "bestTime": "March - June, September - November",
    "image": "https://images.pexels.com/photos/2070307/pexels-photo-2070307.jpeg?cs=srgb&dl=pexels-being-the-traveller-579914-2070307.jpg&fm=jpg",
    "images": [
      "https://i.guim.co.uk/img/media/66a6192a449c3f3e9e6b5f0ed28c86c8b3f33339/0_0_4500_3600/master/4500.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=94b441f48faf0af8f51a46c313aebeb9",
      "https://s7ap1.scene7.com/is/image/incredibleindia/gun-hill-top-mussourie-uttarakhand-1-attr-hero?qlt=82&ts=1727352381893",
      "https://assets.cntraveller.in/photos/60ba0408e1b212c19a8170f2/16:9/w_2560%2Cc_limit/landourlead.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAYy1p-aKQFNG7x655Yyf2BFKU4zp_a7-xv3LiPUI2Ub6QzxJ7fC6pZc0&s=10"
    ],
    "description": "Mussoorie is one of Uttarakhand's most popular hill stations, known for its beautiful valleys and Himalayan views.\nThe town features colonial architecture, waterfalls, viewpoints, cafés, and scenic walking routes.\nMarch to June offers pleasant temperatures and is ideal for sightseeing and escaping the summer heat.\nSeptember to November brings clearer skies, fresh mountain air, and excellent views after the monsoon.\nMussoorie is perfect for couples, families, nature lovers, photographers, and weekend travelers.",
    "attractions": [
      {
        "id": "mussoorie_attr_1",
        "name": "🛍️ Mall Road",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Mussoorie Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The lively central promenade is filled with shops, restaurants, cafés, and mountain views.\nIt is ideal for evening walks, shopping, local food, and experiencing Mussoorie's atmosphere."
      },
      {
        "id": "mussoorie_attr_2",
        "name": "🏔️ Gun Hill",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Mussoorie Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of Mussoorie's most famous viewpoints offering panoramic views of the surrounding mountains and valleys.\nThe ropeway ride to the hill adds an enjoyable element to the sightseeing experience."
      },
      {
        "id": "mussoorie_attr_3",
        "name": "💦 Kempty Falls",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Mussoorie Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A spectacular waterfall surrounded by rocky hills and lush greenery near Mussoorie.\nIt is a popular attraction for families and visitors looking to enjoy the area's natural beauty."
      },
      {
        "id": "mussoorie_attr_4",
        "name": "🌄 Lal Tibba",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Mussoorie Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of Mussoorie's highest and most scenic viewpoints with expansive views of Himalayan peaks.\nThe peaceful surroundings and clear mountain vistas make it especially attractive to photographers."
      },
      {
        "id": "mussoorie_attr_5",
        "name": "🌲 Landour",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Mussoorie Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A peaceful colonial-era hill area known for old buildings, pine forests, cafés, and scenic walking trails.\nIts relaxed atmosphere makes it perfect for travelers wanting to escape the busy parts of Mussoorie."
      }
    ]
  },
  {
    "id": 14,
    "name": "Srinagar",
    "state": "Jammu & Kashmir",
    "category": "Nature",
    "rating": 9.7,
    "bestTime": "April - October",
    "image": "https://assets.cntraveller.in/photos/60ba1148a1a415b43b10b8a0/master/pass/Getaways-Lead.jpg",
    "images": [
      "https://travelsolution.dukekashmirtravels.com/sphoto/40/dal-lake.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/India_-_Srinagar_-_023_-_Nishat_Bagh_Mughal_Gardens.jpg/1280px-India_-_Srinagar_-_023_-_Nishat_Bagh_Mughal_Gardens.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
      "https://assets.cntraveller.in/photos/61eff70d4d495b4b023dc466/16:9/w_2560%2Cc_limit/parimahal%2520lead.jpg",
      "https://images.pexels.com/photos/29090768/pexels-photo-29090768/free-photo-of-scenic-view-of-srinagar-s-historic-architecture.jpeg?h=1000&w=1500&fit=crop"
    ],
    "description": "Srinagar is the scenic summer capital of Jammu and Kashmir, famous for Dal Lake, gardens, houseboats, and Himalayan landscapes.\nThe city combines natural beauty with rich Kashmiri culture, traditional crafts, cuisine, and historic landmarks.\nApril to June is excellent for gardens, sightseeing, pleasant weather, and enjoying the blooming landscapes.\nSeptember and October offer crisp weather, beautiful autumn colors, and clear mountain views.\nSrinagar is ideal for couples, families, photographers, nature lovers, and cultural travelers.",
    "attractions": [
      {
        "id": "srinagar_attr_1",
        "name": "🚣 Dal Lake",
        "rating": 10,
        "category": "Sightseeing",
        "zone": "Srinagar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The iconic Dal Lake is surrounded by mountains and famous for colorful shikaras and traditional houseboats.\nA peaceful shikara ride is one of the essential experiences when visiting Srinagar."
      },
      {
        "id": "srinagar_attr_2",
        "name": "🌷 Mughal Gardens",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Srinagar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Srinagar's historic Mughal gardens are famous for terraced lawns, fountains, flowers, and beautiful mountain views.\nShalimar Bagh, Nishat Bagh, and Chashme Shahi are particularly popular."
      },
      {
        "id": "srinagar_attr_3",
        "name": "🛕 Hazratbal Shrine",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Srinagar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A revered Islamic shrine situated beside Dal Lake with beautiful views of the surrounding mountains.\nIts peaceful setting and religious significance make it an important cultural landmark."
      },
      {
        "id": "srinagar_attr_4",
        "name": "🏘️ Old Srinagar",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Srinagar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The historic areas of Srinagar showcase traditional wooden architecture, old mosques, markets, and local life.\nExploring the old city provides a deeper understanding of Kashmiri culture and heritage."
      },
      {
        "id": "srinagar_attr_5",
        "name": "🌸 Pari Mahal",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Srinagar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A historic terraced garden located on a hill overlooking Srinagar and Dal Lake.\nIt is particularly beautiful around sunset when the city and mountains create a spectacular panorama."
      }
    ]
  },
  {
    "id": 15,
    "name": "Gulmarg",
    "state": "Jammu & Kashmir",
    "category": "Hill Station & Skiing",
    "rating": 9.6,
    "bestTime": "March - June, December - March",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr19zKiJq0RGA7ojARNag-lbLyuiBVb_3MMPZv9jdwRTBka95XQnpDT4w&s=10",
    "images": [
      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=1800&q=80",
      "https://www.oyorooms.com/blog/wp-content/uploads/2019/06/Getaway-to-Gulmarg-8-Attractions-that-make-it-a-worthy-destination.jpg",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/3e/46/2a/received-2144678579094115.jpg?w=900&h=500&s=1",
      "https://www.4moles.com/pictures/3/e/3ed4c5bc51b0ce6fc8c217ee6780474f.jpg?v=1500375738"
    ],
    "description": "Gulmarg is a spectacular alpine destination famous for green meadows, snow-covered mountains, and world-class skiing opportunities.\nThe town is surrounded by the Pir Panjal range and offers breathtaking Himalayan scenery throughout the year.\nMarch to June is ideal for enjoying meadows, flowers, sightseeing, and outdoor activities.\nDecember to March transforms Gulmarg into a winter wonderland and is the best period for skiing and snow activities.\nGulmarg is perfect for couples, adventure enthusiasts, families, photographers, and snow lovers.",
    "attractions": [
      {
        "id": "gulmarg_attr_1",
        "name": "🚠 Gulmarg Gondola",
        "rating": 9.9,
        "category": "Sightseeing",
        "zone": "Gulmarg Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of the world's highest and most famous cable cars, offering spectacular views of the Himalayan landscape.\nThe ride reaches higher alpine areas and is especially stunning when surrounded by snow."
      },
      {
        "id": "gulmarg_attr_2",
        "name": "⛷️ Skiing",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Gulmarg Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Gulmarg is one of India's premier skiing destinations, attracting beginners and experienced winter-sports enthusiasts.\nThe surrounding powder snow and mountain terrain create excellent seasonal conditions."
      },
      {
        "id": "gulmarg_attr_3",
        "name": "🌿 Gulmarg Meadows",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Gulmarg Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The vast green meadows are surrounded by dramatic mountains and become especially beautiful during spring and summer.\nThey are perfect for walking, photography, horse riding, and enjoying nature."
      },
      {
        "id": "gulmarg_attr_4",
        "name": "🏔️ Apharwat Peak",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Gulmarg Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A high-altitude peak accessible by the Gulmarg Gondola and surrounded by spectacular mountain scenery.\nIt is particularly popular for snow sports, photography, and panoramic Himalayan views."
      },
      {
        "id": "gulmarg_attr_5",
        "name": "⛳ Gulmarg Golf Course",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Gulmarg Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A scenic high-altitude golf course spread across beautiful meadows surrounded by mountains.\nEven non-golfers can appreciate its spectacular landscapes and peaceful atmosphere."
      }
    ]
  },
  {
    "id": 16,
    "name": "Pahalgam",
    "state": "Jammu & Kashmir",
    "category": "Nature & Adventure",
    "rating": 9.5,
    "bestTime": "April - October",
    "image": "https://i.pinimg.com/736x/33/69/8d/33698dd0ef0703874c15e4e8b0469935.jpg",
    "images": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbdev297gHoXFHJhYO5Xn4zXBt1bJ0OzumOk7U9BbJ2DbRUvSpWOYOtdA&s=10",
      "https://kashmirhiddenwonders.com/kashmirtours/wp-content/uploads/2022/12/snow-frozen-himalayas-glacier.jpg",
      "https://media1.thrillophilia.com/filestore/wqji1fq7st4vk3y2uanw2wrnftpc_Shutterstock_1435773446%20(1).jpg?w=400&dpr=2",
      "https://media.assettype.com/outlooktraveller/2025-04-26/vllbo89p/shutterstock2490099303-1.jpg?w=1200&auto=format%2Ccompress&fit=max&format=webp&dpr=1.0?rect=0,0,2102,1136"
    ],
    "description": "Pahalgam is a breathtaking valley destination surrounded by pine forests, rivers, meadows, and snow-covered mountains.\nIt is one of the most scenic places in Kashmir and serves as a gateway to several trekking routes.\nApril to June offers pleasant weather, green landscapes, and excellent conditions for sightseeing and outdoor activities.\nSeptember and October bring crisp air, beautiful autumn colors, and clear mountain views.\nPahalgam is ideal for families, couples, trekkers, photographers, and nature lovers.",
    "attractions": [
      {
        "id": "pahalgam_attr_1",
        "name": "🏞️ Betaab Valley",
        "rating": 9.7,
        "category": "Sightseeing",
        "zone": "Pahalgam Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A stunning valley surrounded by snow-capped mountains, green meadows, and flowing streams.\nIts cinematic scenery makes it one of the most popular sightseeing locations near Pahalgam."
      },
      {
        "id": "pahalgam_attr_2",
        "name": "🌲 Aru Valley",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Pahalgam Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A peaceful mountain valley surrounded by lush forests, meadows, and towering Himalayan peaks.\nIt is excellent for trekking, horse riding, photography, and enjoying Kashmir's natural beauty."
      },
      {
        "id": "pahalgam_attr_3",
        "name": "🌊 Lidder River",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Pahalgam Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The beautiful Lidder River flows through Pahalgam with clear water and spectacular mountain surroundings.\nIts banks are ideal for peaceful walks, photography, and enjoying the valley scenery."
      },
      {
        "id": "pahalgam_attr_4",
        "name": "🏔️ Baisaran Valley",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Pahalgam Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Often called the 'Mini Switzerland of Kashmir', Baisaran is surrounded by lush meadows and dense pine forests.\nThe panoramic mountain scenery makes it a fantastic location for photography and outdoor activities."
      },
      {
        "id": "pahalgam_attr_5",
        "name": "🥾 Pahalgam Trekking Routes",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Pahalgam Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The region offers numerous scenic trekking routes through forests, meadows, and mountain valleys.\nThese trails provide an excellent way to experience the peaceful landscapes of Kashmir."
      }
    ]
  },
  {
    "id": 17,
    "name": "Digha",
    "state": "West Bengal",
    "category": "Beach",
    "rating": 8.6,
    "bestTime": "October - February",
    "image": "https://images.pexels.com/photos/13308467/pexels-photo-13308467.jpeg?cs=srgb&dl=pexels-krishclicknature-13308467.jpg&fm=jpg&_gl=1*1vdwh4z*_ga*MTM2NTM4MDIxMi4xNzg4NDQ4Mzc3*_ga_8JE65Q40S6*czE3ODg0NDgzNzckbzEkZzEkdDE3ODg0NDk0MjQkajYwJGwwJGgw",
    "images": [
      "https://images.trvl-media.com/place/6355627/98dcceb0-6117-4a53-8714-9ed49cde05b3.jpg",
      "https://i.ytimg.com/vi/iTYyJud3qmU/maxresdefault.jpg",
      "https://newsarenaindia.com/_next/image?url=https%3A%2F%2Fimages.newsarenaindia.com%2Funtitled-design-20250429t170949166jpg_1745926817705.jpg&w=1920&q=75",
      "https://d26dp53kz39178.cloudfront.net/media/uploads/Location_Based_Travel_Guide_Images/Amarabati_Park_result-1752483123210.webp"
    ],
    "description": "Digha is one of West Bengal's most popular seaside destinations, known for its long sandy beaches and relaxing atmosphere.\nThe coastal town offers beautiful sunrises, seafood, local markets, and family-friendly attractions.\nOctober to February provides cooler and more comfortable weather for beach walks and sightseeing.\nThe summer months can be hot, while the monsoon season may bring rough seas and heavy rainfall.\nDigha is ideal for families, couples, weekend travelers, beach lovers, and budget tourists.",
    "attractions": [
      {
        "id": "digha_attr_1",
        "name": "🏖️ New Digha Beach",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Digha Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A popular sandy beach offering beautiful sea views, sunrise experiences, and a lively atmosphere.\nIt is one of the best places in Digha for families and evening beach walks."
      },
      {
        "id": "digha_attr_2",
        "name": "🌊 Old Digha Beach",
        "rating": 8.5,
        "category": "Sightseeing",
        "zone": "Digha Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The traditional Digha beach area offers a lively coastal atmosphere with shops and local food.\nIt is especially enjoyable during sunrise and sunset."
      },
      {
        "id": "digha_attr_3",
        "name": "🔬 Marine Aquarium",
        "rating": 8.3,
        "category": "Sightseeing",
        "zone": "Digha Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A family-friendly attraction showcasing marine life and aquatic species found in the region.\nIt provides an educational experience, especially for children and families."
      },
      {
        "id": "digha_attr_4",
        "name": "🛕 Jagannath Temple",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Digha Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The Jagannath Temple, Digha is a grand coastal shrine in West Bengal built as a magnificent replica of the famous Puri temple.Crafted from pink sandstone in traditional Kalinga architecture."
      },
      {
        "id": "digha_attr_5",
        "name": "🌳 Amarabati Park",
        "rating": 8.2,
        "category": "Sightseeing",
        "zone": "Digha Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A landscaped park featuring greenery, gardens, boating, and recreational facilities.\nIt is a pleasant place for families to relax away from the busy beach areas."
      }
    ]
  },
  {
    "id": 18,
    "name": "Darjeeling",
    "state": "West Bengal",
    "category": "Hill Station",
    "rating": 9.6,
    "bestTime": "March - May, October - December",
    "image": "https://plus.unsplash.com/premium_photo-1697729733902-f8c92710db07?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://netatagency.com/crm/package_image/premium_photo-1697730314165-2cd71dc3a6a41750430644.jpeg",
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/BATASIA_LOOP_IN_DARJEELING.jpg/3840px-BATASIA_LOOP_IN_DARJEELING.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
      "https://getbengal.com/wp-content/uploads/2019/06/darjeeling-toy-train.jpg",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80"
    ],
    "description": "Darjeeling is a world-famous Himalayan hill station known for tea gardens, colonial heritage, and spectacular mountain views.\nThe town is particularly famous for the Darjeeling Himalayan Railway and panoramic views of Kanchenjunga.\nMarch to May offers pleasant temperatures, blooming flowers, and excellent sightseeing conditions.\nOctober to December generally provides clear skies and some of the best Himalayan mountain views.\nDarjeeling is perfect for families, couples, photographers, tea lovers, and mountain enthusiasts.",
    "attractions": [
      {
        "id": "darjeeling_tiger_hill",
        "name": "🌅 Tiger Hill Kanchenjunga Sunrise",
        "rating": 9.9,
        "category": "Scenic Viewpoint",
        "zone": "Ghoom & Tiger Hill",
        "duration": 2.5,
        "cost": 50,
        "walking": "low",
        "description": "Legendary vantage point offering sunrise panoramas over Mount Kanchenjunga and Himalayan peaks."
      },
      {
        "id": "darjeeling_ghoom_monastery",
        "name": "☸️ Ghoom Yiga Choeling Monastery",
        "rating": 9.3,
        "category": "Heritage & Spiritual",
        "zone": "Ghoom & Tiger Hill",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "description": "One of the oldest Tibetan Buddhist monasteries in Darjeeling, enshrining a 15-foot statue of Maitreya Buddha."
      },
      {
        "id": "darjeeling_batasia_loop",
        "name": "🏯 Batasia Loop & Gorkha War Memorial",
        "rating": 9.5,
        "category": "Heritage & Scenic",
        "zone": "Ghoom & Tiger Hill",
        "duration": 1.5,
        "cost": 20,
        "walking": "low",
        "description": "Famous spiraling railway loop surrounded by manicured landscaped gardens with views of Kanchenjunga."
      },
      {
        "id": "darjeeling_toy_train",
        "name": "🚂 Darjeeling Himalayan Railway Joyride",
        "rating": 9.8,
        "category": "Heritage & Joyride",
        "zone": "Town Core & Railway",
        "duration": 2,
        "cost": 1000,
        "walking": "low",
        "description": "Historic UNESCO World Heritage steam locomotive ride chugging from Darjeeling to Ghoom and back."
      },
      {
        "id": "darjeeling_mall_chowrasta",
        "name": "🛍️ Chowrasta & The Mall",
        "rating": 9.4,
        "category": "Leisure & Promenade",
        "zone": "Town Core & Railway",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Vibrant pedestrian square atop the ridge for leisure strolling, heritage bookstores, and open valley views."
      },
      {
        "id": "darjeeling_observatory_hill",
        "name": "🛕 Observatory Hill & Mahakal Temple",
        "rating": 9.1,
        "category": "Spiritual & View",
        "zone": "Town Core & Railway",
        "duration": 1.5,
        "cost": 0,
        "walking": "medium",
        "description": "Sacred hilltop where Hindu temple bells and Buddhist prayer flags flutter harmoniously in the mountain breeze."
      },
      {
        "id": "darjeeling_hmi",
        "name": "🏔️ Himalayan Mountaineering Institute (HMI)",
        "rating": 9.6,
        "category": "Museum & History",
        "zone": "Jawahar Parbat Area",
        "duration": 2,
        "cost": 110,
        "walking": "medium",
        "description": "Premier mountaineering training institute founded in 1954 featuring an inspiring Everest expedition museum."
      },
      {
        "id": "darjeeling_zoo",
        "name": "🐾 Padmaja Naidu Himalayan Zoological Park",
        "rating": 9.5,
        "category": "Wildlife & Nature",
        "zone": "Jawahar Parbat Area",
        "duration": 2,
        "cost": 110,
        "walking": "medium",
        "description": "Internationally acclaimed high-altitude zoo breeding Red Pandas, Snow Leopards, and Himalayan wolves."
      },
      {
        "id": "darjeeling_peace_pagoda",
        "name": "🕊️ Japanese Peace Pagoda & Temple",
        "rating": 9.4,
        "category": "Peace & Spiritual",
        "zone": "Jalapahar Area",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "description": "Serene Buddhist stupa designed to foster world peace, showcasing four avatars of Buddha in white stone."
      },
      {
        "id": "darjeeling_happy_valley",
        "name": "🍃 Happy Valley Tea Estate & Factory",
        "rating": 9.5,
        "category": "Tea & Experience",
        "zone": "Tea Garden Valley",
        "duration": 2,
        "cost": 100,
        "walking": "medium",
        "description": "Historic 1854 tea plantation offering guided factory tasting tours amidst undulating emerald hillside terraces."
      },
      {
        "id": "darjeeling_rock_garden",
        "name": "🌊 Barbotey Rock Garden & Chunnu Falls",
        "rating": 9.1,
        "category": "Nature & Cascades",
        "zone": "Valley Falls Area",
        "duration": 2.5,
        "cost": 50,
        "walking": "medium",
        "description": "Multi-tiered terraced picnic park carved around a natural tumbling mountain cascade."
      },
      {
        "id": "darjeeling_ganga_maya",
        "name": "🚣 Ganga Maya Boating Park",
        "rating": 8.8,
        "category": "Nature & Leisure",
        "zone": "Valley Falls Area",
        "duration": 1.5,
        "cost": 30,
        "walking": "low",
        "description": "Scenic valley park with paddle boating, mountain stream gardens, and traditional Gorkha cultural performances."
      },
      {
        "id": "darjeeling_nightingale_park",
        "name": "🌺 Nightingale Shrubbery Park",
        "rating": 8.9,
        "category": "Garden & Sunset",
        "zone": "Town Core & Railway",
        "duration": 1.5,
        "cost": 20,
        "walking": "low",
        "description": "Beautiful landscaped garden park with shaded benches, music fountain, and sunset views."
      },
      {
        "id": "darjeeling_ropeway",
        "name": "🚡 Rangeet Valley Passenger Cable Car",
        "rating": 9.3,
        "category": "Adventure & Panorama",
        "zone": "Tea Garden Valley",
        "duration": 1.5,
        "cost": 250,
        "walking": "low",
        "description": "Thrilling cable car ride soaring over terraced tea gardens from Singamari down to the Little Rangeet River."
      }
    ]
  },
  {
    "id": 19,
    "name": "Kolkata",
    "state": "West Bengal",
    "category": "City & Culture",
    "rating": 9.1,
    "bestTime": "October - March",
    "image": "https://upload.wikimedia.org/wikipedia/commons/7/72/Victoria_Memorial_situated_in_Kolkata.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    "images": [
      "https://images.unsplash.com/photo-1593847794002-a67998d742fc?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHVyZ2ElMjBwdWphJTIwa29sa2F0YXxlbnwwfHwwfHx8MA%3D%3D",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnE2jEPZ1hlcuCZ_Wju6Wo-oev1ay4A7nN6ydS_UHqyI3f5EKMgYRShvA&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSyr1ss41U_i429KJ1TGq5wIVeqo-XoLBVZAYJLOtlZQcx29NWAAkRPgXR&s=10",
      "https://neptuneholidays.com/blog/images/blog/howrah-bridge-attraction-of-kolkata.jpg"
    ],
    "description": "Kolkata is the cultural capital of India, celebrated for literature, art, architecture, festivals, and distinctive cuisine.\nThe city blends colonial heritage with vibrant neighborhoods, historic temples, museums, and modern cultural spaces.\nOctober to March provides relatively pleasant weather for walking tours, sightseeing, and exploring outdoor attractions.\nThe city becomes especially vibrant during Durga Puja, one of India's most celebrated festivals.\nKolkata is ideal for culture lovers, food enthusiasts, history buffs, photographers, and urban explorers.",
    "attractions": [
      {
        "id": "kolkata_attr_1",
        "name": "🏛️ Victoria Memorial",
        "rating": 9.7,
        "category": "Sightseeing",
        "zone": "Kolkata Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A magnificent marble monument surrounded by landscaped gardens and built in the colonial era.\nIts architecture, museum collections, and gardens make it one of Kolkata's most iconic landmarks."
      },
      {
        "id": "kolkata_attr_2",
        "name": "🌉 Howrah Bridge",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Kolkata Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The historic cantilever bridge over the Hooghly River is one of Kolkata's most recognizable symbols.\nIts massive structure and bustling surroundings provide excellent opportunities for photography."
      },
      {
        "id": "kolkata_attr_3",
        "name": "🛕 Dakshineswar Kali Temple",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Kolkata Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A famous Hindu temple complex dedicated to Goddess Kali located beside the Hooghly River.\nIts architecture, spiritual atmosphere, and riverside setting make it a major attraction."
      },
      {
        "id": "kolkata_attr_4",
        "name": "🏛️ Indian Museum",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Kolkata Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of India's oldest and largest museums, featuring extensive collections of art, archaeology, fossils, and history.\nIt is an excellent destination for visitors interested in India's rich cultural heritage."
      },
      {
        "id": "kolkata_attr_5",
        "name": "🌳 Maidan",
        "rating": 8.9,
        "category": "Sightseeing",
        "zone": "Kolkata Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A vast green urban space in central Kolkata surrounded by important landmarks and colonial-era architecture.\nIt is popular for walking, relaxing, photography, and experiencing the city's open-air atmosphere."
      }
    ]
  },
  {
    "id": 20,
    "name": "Puri",
    "state": "Odisha",
    "category": "Beach & Spiritual",
    "rating": 9.2,
    "bestTime": "October - February",
    "image": "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVyaXxlbnwwfHwwfHx8MA%3D%3D",
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/5/5b/Jagannath_Temple_View%2CPuri.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
      "https://s7ap1.scene7.com/is/image/incredibleindia/puri-beach-puri-odisha-1-attr-hero?qlt=82&ts=1726663799757",
      "https://kevinstandagephotography.wordpress.com/wp-content/uploads/2020/04/ksp_8730.jpg",
      "https://s7ap1.scene7.com/is/image/incredibleindia/gundicha-puri-attr-about?qlt=82&ts=1742171608223"
    ],
    "description": "Puri is a famous coastal pilgrimage destination in Odisha, renowned for the sacred Jagannath Temple and beautiful beaches.\nThe city combines spirituality, coastal scenery, traditional crafts, and delicious Odia cuisine.\nOctober to February provides comfortable weather for sightseeing, temple visits, and enjoying the beach.\nThe city becomes especially significant during the annual Rath Yatra festival.\nPuri is ideal for pilgrims, families, beach lovers, cultural travelers, and food enthusiasts.",
    "attractions": [
      {
        "id": "puri_attr_1",
        "name": "🛕 Jagannath Temple",
        "rating": 10,
        "category": "Sightseeing",
        "zone": "Puri Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of India's most revered Hindu temples and the spiritual heart of Puri.\nIts grand architecture and religious traditions make it an essential cultural landmark."
      },
      {
        "id": "puri_attr_2",
        "name": "🏖️ Puri Beach",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Puri Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A long sandy beach along the Bay of Bengal known for beautiful sunrises and lively coastal activity.\nIt is perfect for relaxing, walking, enjoying local snacks, and watching the sea."
      },
      {
        "id": "puri_attr_3",
        "name": "🎨 Raghurajpur Heritage Village",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Puri Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A traditional artisan village famous for Pattachitra paintings and other handicrafts.\nVisitors can meet local artists and experience Odisha's distinctive artistic traditions."
      },
      {
        "id": "puri_attr_4",
        "name": "🌊 Swargadwar Beach",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Puri Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A culturally significant beach area located near central Puri and known for its lively atmosphere.\nIt is popular for evening walks, sea views, and experiencing local coastal life."
      },
      {
        "id": "puri_attr_5",
        "name": "🛕 Gundicha Temple",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Puri Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "An important temple associated with Lord Jagannath and the famous Rath Yatra tradition.\nIts historical and religious significance makes it an important stop for cultural travelers."
      }
    ]
  },
  {
    "id": 21,
    "name": "Bhubaneswar",
    "state": "Odisha",
    "category": "Heritage",
    "rating": 9,
    "bestTime": "October - March",
    "image": "https://lct-production.s3.amazonaws.com/trip/plan/images/pexels-ravi-mittal-107469583-29064614.jpg",
    "images": [
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0b/19/a6/47.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Ram_Mandir%2C_Bhubaneswar._Odisha.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
      "https://kevinstandagephotography.wordpress.com/wp-content/uploads/2020/03/ksp_9784.jpg?w=1024",
      "https://s7ap1.scene7.com/is/image/incredibleindia/lingaraj-temple-bhubaneshwar-odisha-1-attr-hero?qlt=82&ts=1742165306173"
    ],
    "description": "Bhubaneswar is the capital of Odisha and one of India's most important historic temple cities.\nThe city is famous for ancient architecture, beautifully carved temples, caves, museums, and rich cultural traditions.\nOctober to March offers comfortable weather for exploring the city's heritage sites and surrounding attractions.\nThe city forms part of the famous Golden Triangle of Odisha along with Puri and Konark.\nBhubaneswar is ideal for history lovers, architecture enthusiasts, pilgrims, photographers, and cultural travelers.",
    "attractions": [
      {
        "id": "bhubaneswar_attr_1",
        "name": "🛕 Lingaraj Temple",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Bhubaneswar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of Odisha's most magnificent ancient temples and a masterpiece of Kalinga architecture.\nIts towering structure and intricate stone carvings showcase the extraordinary heritage of Bhubaneswar."
      },
      {
        "id": "bhubaneswar_attr_2",
        "name": "🪨 Udayagiri & Khandagiri Caves",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Bhubaneswar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Ancient rock-cut caves featuring inscriptions, sculptures, and historic religious significance.\nThe caves provide fascinating insights into Odisha's early history and Jain heritage."
      },
      {
        "id": "bhubaneswar_attr_3",
        "name": "🛕 Mukteshwar Temple",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Bhubaneswar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A beautifully decorated temple celebrated for its intricate carvings and distinctive architectural style.\nIt is often regarded as one of the finest examples of Odisha's temple architecture."
      },
      {
        "id": "bhubaneswar_attr_4",
        "name": "🏛️ Odisha State Museum",
        "rating": 8.9,
        "category": "Sightseeing",
        "zone": "Bhubaneswar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A museum containing important archaeological, artistic, and cultural collections from Odisha.\nIt is an excellent place to understand the state's long and diverse history."
      },
      {
        "id": "bhubaneswar_attr_5",
        "name": "🛕 Rajarani Temple",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Bhubaneswar Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A striking temple known for its detailed sandstone carvings and elegant architectural design.\nIts sculptures and peaceful surroundings make it a favorite among architecture and history enthusiasts."
      }
    ]
  },
  {
    "id": 22,
    "name": "Konark",
    "state": "Odisha",
    "category": "Heritage",
    "rating": 9.6,
    "bestTime": "October - March",
    "image": "https://www.dailyartmagazine.com/wp-content/uploads/2024/06/Cover-Photo-scaled.jpg",
    "images": [
      "https://m.media-amazon.com/images/I/81Y+eh20z8L.jpg",
      "https://www.trawell.in/admin/images/upload/403298814Konark_Chandrabhaga_Beach.jpg",
      "https://odishatourism.gov.in/content/dam/tourism/home/upcoming-events/konark_dance_festival/stb/img1.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz9D98z7wq63td35ol_edbQuhWaHnpIE467Jd3y0Y86TOaGSNpmlw9IUI&s=10"
    ],
    "description": "Konark is a historic coastal town famous for the magnificent Sun Temple, a UNESCO World Heritage Site.\nThe temple is renowned for its extraordinary stone carvings, massive chariot design, and remarkable medieval architecture.\nOctober to March offers pleasant weather for exploring the temple and nearby coastal attractions.\nThe town also hosts cultural events and festivals celebrating Odisha's classical arts and traditions.\nKonark is perfect for history lovers, architecture enthusiasts, photographers, and cultural travelers.",
    "attractions": [
      {
        "id": "konark_attr_1",
        "name": "☀️ Konark Sun Temple",
        "rating": 10,
        "category": "Sightseeing",
        "zone": "Konark Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The magnificent 13th-century temple is designed as the colossal chariot of the Sun God with intricately carved wheels.\nIts extraordinary architecture and sculptures make it one of India's greatest heritage monuments."
      },
      {
        "id": "konark_attr_2",
        "name": "🏖️ Chandrabhaga Beach",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Konark Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A beautiful beach near Konark known for its peaceful atmosphere and spectacular sunrise views.\nIt is an excellent place to relax after exploring the historic temple."
      },
      {
        "id": "konark_attr_3",
        "name": "🎭 Konark Dance Festival",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Konark Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A renowned cultural festival showcasing India's classical dance traditions against the backdrop of the Sun Temple.\nIt offers a spectacular combination of music, dance, architecture, and heritage."
      },
      {
        "id": "konark_attr_4",
        "name": "🏛️ Archaeological Museum",
        "rating": 8.8,
        "category": "Sightseeing",
        "zone": "Konark Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The museum displays sculptures and architectural fragments associated with the Konark Sun Temple.\nIt provides valuable context for understanding the temple's history and artistic traditions."
      },
      {
        "id": "konark_attr_5",
        "name": "🌊 Ramachandi Beach",
        "rating": 8.9,
        "category": "Sightseeing",
        "zone": "Konark Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A scenic coastal destination located near the Kushabhadra River and Bay of Bengal.\nIts relatively peaceful setting makes it suitable for nature lovers and travelers seeking a quieter beach."
      }
    ]
  },
  {
    "id": 23,
    "name": "Shillong",
    "state": "Meghalaya",
    "category": "Hill Station",
    "rating": 9.3,
    "bestTime": "October - April",
    "image": "https://images.safarcabby.com/car-rentals/explore-shillong-tours-and-tra-shillong-meghalaya-42893-18009.jpg",
    "images": [
      "https://netatagency.com/crm/package_image/photo-1625826415766-001bd75aaf521748622075.jpeg",
      "https://captureatrip-cms-storage.s3.ap-south-1.amazonaws.com/Relax_and_Enjoy_the_Weather_in_Shillong_Peak_bd6340f01a.webp",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/59/ed/ee/umiam-lake.jpg?w=1200&h=-1&s=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHs3irYe-F1HnL8tP9iJGImSU7D6XORAuv7EKa1w-4ekfoIAvNfKSxuVU&s=10"
    ],
    "description": "Shillong is the capital of Meghalaya and a beautiful hill city surrounded by forests, waterfalls, lakes, and rolling hills.\nIt is often called the Scotland of the East because of its green landscapes and pleasant climate.\nOctober to April offers relatively comfortable weather for sightseeing and exploring the surrounding attractions.\nThe monsoon season brings spectacular greenery and waterfalls but also heavy rainfall.\nShillong is ideal for families, couples, nature lovers, photographers, music enthusiasts, and adventure travelers.",
    "attractions": [
      {
        "id": "shillong_attr_1",
        "name": "🌊 Elephant Falls",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Shillong Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A beautiful multi-tiered waterfall surrounded by lush greenery just outside Shillong.\nIt is easily accessible and especially impressive during and after the monsoon."
      },
      {
        "id": "shillong_attr_2",
        "name": "🏞️ Umiam Lake",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Shillong Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A vast scenic reservoir surrounded by green hills north of Shillong.\nIts peaceful waters and panoramic landscapes make it excellent for photography and relaxation."
      },
      {
        "id": "shillong_attr_3",
        "name": "🌄 Shillong Peak",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Shillong Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The highest point in Shillong offering panoramic views of the city and surrounding hills.\nOn clear days, the viewpoint provides spectacular long-distance vistas."
      },
      {
        "id": "shillong_attr_4",
        "name": "🌳 Ward's Lake",
        "rating": 8.9,
        "category": "Sightseeing",
        "zone": "Shillong Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A beautiful man-made lake surrounded by gardens and walking paths in central Shillong.\nIt is a peaceful destination for boating, photography, and leisurely walks."
      },
      {
        "id": "shillong_attr_5",
        "name": "🏛️ Don Bosco Museum",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Shillong Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A fascinating museum showcasing the cultures, traditions, crafts, and lifestyles of Northeast India's indigenous communities.\nIts extensive exhibits make it an excellent cultural experience."
      }
    ]
  },
  {
    "id": 24,
    "name": "Mawlynnong Village",
    "state": "Meghalaya",
    "category": "Nature",
    "rating": 9.2,
    "bestTime": "October - April",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/mawlynnong-village-cherrapunjee-meghalaya-1-attr-hero?qlt=82&ts=1751460276883",
    "images": [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/27/0d/50/meghalaya-s-mawlynnong.jpg?w=1200&h=-1&s=1",
      "https://wanderon-images.gumlet.io/blogs/new/2024/03/travel-to-mawlynnong-village.jpeg",
      "https://www.captureatrip.com/_next/image?url=https%3A%2F%2Fd1zvcmhypeawxj.cloudfront.net%2Flocation%2FMeghalaya%2Fblogs%2Fthings-to-do-in-shillong-daa490f55f-0rmboy-webp-355d0bbc1d-1752060380652.webp&w=3840&q=75",
      "https://www.trawell.in/admin/images/upload/64576125Mawlynnong_Living_Root_Bridge_%20Main.jpg"
    ],
    "description": "Mawlynnong is a picturesque village in Meghalaya famous for its cleanliness, greenery, and peaceful natural environment.\nThe village is surrounded by lush forests, traditional homes, gardens, and scenic viewpoints.\nOctober to April provides comfortable conditions for walking through the village and exploring nearby attractions.\nThe monsoon months bring extremely lush greenery but also frequent and heavy rainfall.\nMawlynnong is ideal for eco-tourism, families, photographers, nature lovers, and travelers seeking peaceful village experiences.",
    "attractions": [
      {
        "id": "mawlynnong_village_attr_1",
        "name": "🌉 Living Root Bridge",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Mawlynnong Village Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The region is home to remarkable living root bridges created by guiding the roots of rubber trees over streams.\nThese unique natural structures demonstrate the traditional ecological knowledge of Meghalaya's communities."
      },
      {
        "id": "mawlynnong_village_attr_2",
        "name": "🌄 Mawlynnong Viewpoint",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Mawlynnong Village Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A scenic viewpoint offering wide views across the surrounding green landscapes and neighboring Bangladesh plains.\nIt is particularly beautiful during clear weather and early morning."
      },
      {
        "id": "mawlynnong_village_attr_3",
        "name": "🏘️ Mawlynnong Village Walk",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Mawlynnong Village Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Walking through the village reveals beautifully maintained paths, gardens, traditional homes, and local life.\nIt is a peaceful way to experience the village's famous community-based cleanliness practices."
      },
      {
        "id": "mawlynnong_village_attr_4",
        "name": "🌳 Balancing Rock",
        "rating": 8.5,
        "category": "Sightseeing",
        "zone": "Mawlynnong Village Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A naturally balanced rock formation surrounded by greenery and local legends.\nIt provides a short and interesting stop while exploring the surrounding village area."
      },
      {
        "id": "mawlynnong_village_attr_5",
        "name": "🌊 Mawlynnong Waterfall",
        "rating": 8.7,
        "category": "Sightseeing",
        "zone": "Mawlynnong Village Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A small scenic waterfall surrounded by the lush forests of the region.\nThe peaceful setting makes it a pleasant stop for nature lovers and photographers."
      }
    ]
  },
  {
    "id": 25,
    "name": "Dawki",
    "state": "Meghalaya",
    "category": "Nature & River",
    "rating": 9.5,
    "bestTime": "November - May",
    "image": "https://newsarenaindia.com/_next/image?url=https%3A%2F%2Fimages.newsarenaindia.com%2Fdawkijpg_1772178224024.jpg&w=1920&q=75",
    "images": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFHmLsZZe9Vh5yWt94vmydOa96zMr95nt8sFnapXLxiCWJ7lPnIzBqNiVI&s=10",
      "https://res.cloudinary.com/kmadmin/image/upload/v1622652199/kiomoi/Dawki__1622652197706.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLnNrRa3V5CLwMavvCO4cLFqtZIf1jUP3D5exnWVAfKz59kNN-raHMMA&s=10",
      "https://www.naturediary.in/wp-content/uploads/2021/06/India-Bangladesh-border-at-Dawki.jpg"
    ],
    "description": "Dawki is a scenic border town in Meghalaya famous for the crystal-clear Umngot River and surrounding hills.\nThe river becomes remarkably transparent during favorable weather, creating spectacular views of its rocky bed.\nNovember to May generally provides better conditions for river activities and sightseeing.\nThe monsoon season brings heavy rainfall and changes the river's water clarity and flow.\nDawki is perfect for nature lovers, photographers, adventure seekers, couples, and road-trip travelers.",
    "attractions": [
      {
        "id": "dawki_attr_1",
        "name": "💎 Umngot River",
        "rating": 10,
        "category": "Sightseeing",
        "zone": "Dawki Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The crystal-clear Umngot River is Dawki's most famous natural attraction and one of Meghalaya's iconic landscapes.\nBoating on the transparent water provides an unforgettable experience."
      },
      {
        "id": "dawki_attr_2",
        "name": "🌉 Dawki Bridge",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Dawki Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The historic suspension bridge crosses the Umngot River and provides beautiful views of the surrounding landscape.\nIt is an excellent place for photography and experiencing the area's border-town atmosphere."
      },
      {
        "id": "dawki_attr_3",
        "name": " India-Bangladesh Border",
        "rating": 8.8,
        "category": "Sightseeing",
        "zone": "Dawki Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "Dawki lies close to the international border and offers a unique opportunity to see the border landscape.\nVisitors should follow local security regulations and designated viewing areas."
      },
      {
        "id": "dawki_attr_4",
        "name": "🏕️ Shnongpdeng",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Dawki Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A beautiful riverside village near Dawki known for camping, boating, kayaking, and crystal-clear waters.\nIt is one of the best places in the region for combining adventure with natural scenery."
      },
      {
        "id": "dawki_attr_5",
        "name": "🌊 Umngot Boating",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Dawki Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A traditional boat ride along the clear waters of the Umngot River provides spectacular views of the riverbed.\nThe experience is especially memorable during the dry season when visibility is excellent."
      }
    ]
  },
  {
    "id": 26,
    "name": "Jaipur",
    "state": "Rajasthan",
    "category": "Heritage City",
    "rating": 9.4,
    "bestTime": "October - March",
    "image": "https://plus.unsplash.com/premium_photo-1661963054563-ce928e477ff3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amFpcHVyfGVufDB8fDB8fHww",
    "images": [
      "https://images.unsplash.com/photo-1649073868642-bcbbd06239d8?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YW1iZXIlMjBmb3J0fGVufDB8fDB8fHww",
      "https://miro.medium.com/1*fYA-b-KA9UUqPL2OsDYkQw.png",
      "https://static.toiimg.com/thumb/msid-113165265,width-1070,height-580,resizemode-75/113165265,pt-32,y_pad-40/113165265.jpg",
      "https://t4.ftcdn.net/jpg/05/28/58/53/360_F_528585313_ePj7WnYtyl6tNO6xqspWvKvLfz8hgi12.jpg"
    ],
    "description": "Jaipur, the Pink City, is famous for magnificent forts, royal palaces, colorful markets, and rich Rajput heritage.\nThe city forms an important part of India's Golden Triangle and offers a remarkable combination of history and culture.\nOctober to March provides cooler weather and is ideal for exploring the city's outdoor monuments.\nThe city becomes particularly vibrant during festivals, cultural events, and traditional celebrations.\nJaipur is perfect for history lovers, families, couples, photographers, shoppers, and food enthusiasts.",
    "attractions": [
      {
        "id": "jaipur_attr_1",
        "name": "🏰 Amber Fort",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Jaipur Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A magnificent hilltop fort featuring grand courtyards, palaces, gates, and intricate artistic details.\nIts combination of Rajput and Mughal architecture makes it one of Jaipur's essential attractions."
      },
      {
        "id": "jaipur_attr_2",
        "name": "🏯 Hawa Mahal",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Jaipur Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The iconic Palace of Winds is famous for its distinctive honeycomb façade and hundreds of small windows.\nIts unique architecture and central Jaipur location make it a must-see landmark."
      },
      {
        "id": "jaipur_attr_3",
        "name": "🏛️ City Palace",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Jaipur Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A grand royal complex featuring palaces, courtyards, museums, and ornate gateways in the heart of Jaipur.\nIt offers fascinating insights into the city's royal history and artistic traditions."
      },
      {
        "id": "jaipur_attr_4",
        "name": "🔭 Jantar Mantar",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Jaipur Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A UNESCO World Heritage astronomical observatory containing enormous historic scientific instruments.\nIts remarkable architecture demonstrates the advanced astronomical knowledge of the period."
      },
      {
        "id": "jaipur_attr_5",
        "name": "🛍️ Johari Bazaar",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Jaipur Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A colorful traditional market famous for jewelry, textiles, handicrafts, and Rajasthani products.\nIt is ideal for shopping and experiencing Jaipur's lively local culture."
      }
    ]
  },
  {
    "id": 27,
    "name": "Jaisalmer",
    "state": "Rajasthan",
    "category": "Heritage & Desert",
    "rating": 9.5,
    "bestTime": "October - March",
    "image": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1IGfAIHOZBK0h5isAxk2xYfAUChzkv65e7eKfYthuboqSmfN-jsd8NHJCwrNdISTqVCLPvi9jt-8PrZ_w11Kehp1WYrezn2NEdXsJqkbQyNP7PBqwbNfx1MDwg-x2lM5iaV3l33gKtys/w1200-h630-p-k-no-nu/Gadi_Sagar_Temple_Jaisalmer.jpg.jpg",
    "images": [
      "https://cdn.kimkim.com/files/a/images/233007152994a35a72134fa4769060eb1b3a80bb/big-078a409136abede4f48cf2482c04a0b0.jpg",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/c6/09/6d/sand-dunes.jpg?w=1200&h=-1&s=1",
      "https://obms-tourist.rajasthan.gov.in/uploads/image11496408334_1ea54bff16.jpg",
      "https://images.trvl-media.com/place/553248621532739632/3a77db18-37f4-4a7b-9a3b-5c79c3151db3.jpg"
    ],
    "description": "Jaisalmer is the famous Golden City of Rajasthan, known for its golden sandstone architecture and vast Thar Desert landscapes.\nThe city is centered around the magnificent Jaisalmer Fort, surrounded by ornate havelis and historic streets.\nOctober to March offers cooler temperatures and is the best period for desert exploration and sightseeing.\nWinter evenings in the desert can become surprisingly cold, so warm clothing is recommended for overnight camps.\nJaisalmer is perfect for heritage lovers, couples, photographers, adventure seekers, and cultural travelers.",
    "attractions": [
      {
        "id": "jaisalmer_attr_1",
        "name": "🏰 Jaisalmer Fort",
        "rating": 9.9,
        "category": "Sightseeing",
        "zone": "Jaisalmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of the world's few living forts, built from golden sandstone and rising dramatically above the desert city.\nIts palaces, temples, shops, and narrow streets create an extraordinary heritage experience."
      },
      {
        "id": "jaisalmer_attr_2",
        "name": "🐪 Sam Sand Dunes",
        "rating": 9.7,
        "category": "Sightseeing",
        "zone": "Jaisalmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The iconic desert dunes provide spectacular sunset views and traditional camel safari experiences.\nDesert camping, folk performances, and stargazing make the area especially popular."
      },
      {
        "id": "jaisalmer_attr_3",
        "name": "🏛️ Patwon Ki Haveli",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Jaisalmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A magnificent collection of intricately carved sandstone havelis showcasing the wealth and craftsmanship of historic Jaisalmer.\nIts detailed façades and interiors are excellent for architecture enthusiasts."
      },
      {
        "id": "jaisalmer_attr_4",
        "name": "🏛️ Salim Singh Ki Haveli",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Jaisalmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A distinctive historic haveli known for its elaborate architecture and unusual upper structure.\nIts detailed carvings provide a glimpse into the lifestyle of Jaisalmer's merchant families."
      },
      {
        "id": "jaisalmer_attr_5",
        "name": "🛕 Gadisar Lake",
        "rating": 9.1,
        "category": "Sightseeing",
        "zone": "Jaisalmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A historic artificial lake surrounded by temples, shrines, and sandstone structures.\nIt is particularly beautiful around sunrise and sunset and offers a peaceful break from the desert."
      }
    ]
  },
  {
    "id": 28,
    "name": "Ajmer",
    "state": "Rajasthan",
    "category": "Spiritual & Heritage",
    "rating": 8.9,
    "bestTime": "October - March",
    "image": "https://upload.wikimedia.org/wikipedia/commons/8/89/Jama_Masjid%2C_Facade%2C_Domes_and_minarets%2C_Delhi%2C_India.jpg?utm_source=gu.wikipedia.org&utm_campaign=index&utm_content=original",
    "images": [
      "https://c8.alamy.com/comp/2K5JW8H/ajmer-india-09th-oct-2022-illuminated-ajmer-sharif-dargah-on-the-occasion-of-eid-e-milad-un-nabi-in-ajmer-photo-by-shaukat-ahmedpacific-press-credit-pacific-press-media-production-corpalamy-live-news-2K5JW8H.jpg",
      "https://s7ap1.scene7.com/is/image/incredibleindia/2-taragarh-fort-rajasthan-ajmer-attr-hero?qlt=82&ts=1726675399841",
      "https://s7ap1.scene7.com/is/image/incredibleindia/2-adhai-din-ka-jhonpda-ajmer-rajasthan-attr-hero?qlt=82&ts=1726659570993",
      "https://static.toiimg.com/photo/26212164.cms"
    ],
    "description": "Ajmer is a historic city in Rajasthan famous for the revered Ajmer Sharif Dargah and its rich cultural heritage.\nThe city is surrounded by the Aravalli Hills and has a fascinating blend of religious and architectural traditions.\nOctober to March offers cooler weather and comfortable conditions for exploring the city's attractions.\nThe city becomes particularly vibrant during important religious occasions and festivals.\nAjmer is ideal for spiritual travelers, history lovers, families, photographers, and cultural explorers.",
    "attractions": [
      {
        "id": "ajmer_attr_1",
        "name": "🕌 Ajmer Sharif Dargah",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Ajmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of India's most important Sufi pilgrimage sites dedicated to Khwaja Moinuddin Chishti.\nThe shrine attracts visitors from across the country and offers a deeply spiritual cultural experience."
      },
      {
        "id": "ajmer_attr_2",
        "name": "🏞️ Ana Sagar Lake",
        "rating": 9,
        "category": "Sightseeing",
        "zone": "Ajmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A historic artificial lake surrounded by hills and scenic waterfront areas.\nIt is a pleasant location for evening walks, photography, and enjoying peaceful views."
      },
      {
        "id": "ajmer_attr_3",
        "name": "🏰 Taragarh Fort",
        "rating": 8.9,
        "category": "Sightseeing",
        "zone": "Ajmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A historic hilltop fort offering panoramic views over Ajmer and the surrounding Aravalli landscape.\nIts ruins and strategic location provide an interesting glimpse into the city's military history."
      },
      {
        "id": "ajmer_attr_4",
        "name": "🏛️ Adhai Din Ka Jhonpra",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Ajmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A remarkable historic monument known for its distinctive Indo-Islamic architecture and intricate stonework.\nIts layered history makes it particularly fascinating for architecture and heritage enthusiasts."
      },
      {
        "id": "ajmer_attr_5",
        "name": "🏘️ Pushkar",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Ajmer Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The nearby sacred town of Pushkar is famous for its lake, temples, ghats, and vibrant cultural atmosphere.\nIt is an excellent addition to an Ajmer trip and is easily accessible from the city."
      }
    ]
  },
  {
    "id": 29,
    "name": "Delhi",
    "state": "Delhi",
    "category": "City & Heritage",
    "rating": 9.3,
    "bestTime": "October - March",
    "image": "https://media2.thrillophilia.com/images/photos/000/044/480/original/1524478881_shutterstock_418380280.jpg?w=753&h=450&dpr=1.5",
    "images": [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1800&q=80",
      "https://www.thedelhitours.com/blog/wp-content/uploads/2024/09/Qutub-Minar.jpg",
      "https://www.shopkhoj.com/wp-content/uploads/2018/05/Chandni-Chowk.jpg",
      "https://s7ap1.scene7.com/is/image/incredibleindia/lotus-temple-delhi-1-attr-hero?qlt=82&ts=1742182268849"
    ],
    "description": "Delhi is India's capital and a remarkable city where ancient history, colonial heritage, and modern urban life come together.\nIt is home to magnificent forts, monuments, museums, markets, temples, and diverse culinary traditions.\nOctober to March provides relatively comfortable weather for exploring the city's extensive outdoor attractions.\nWinter mornings can sometimes be affected by fog and air pollution, so visitors should plan sightseeing accordingly.\nDelhi is perfect for history lovers, food enthusiasts, families, shoppers, photographers, and cultural travelers.",
    "attractions": [
      {
        "id": "delhi_attr_1",
        "name": "🏰 Red Fort",
        "rating": 9.7,
        "category": "Sightseeing",
        "zone": "Delhi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The magnificent Mughal-era fort is one of India's most important historic monuments and a UNESCO World Heritage Site.\nIts massive red sandstone walls, palaces, and museums showcase Delhi's imperial history."
      },
      {
        "id": "delhi_attr_2",
        "name": "🕌 India Gate",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Delhi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A monumental war memorial standing prominently along one of New Delhi's major avenues.\nThe surrounding lawns and illuminated monument make it particularly popular during evening visits."
      },
      {
        "id": "delhi_attr_3",
        "name": "🕌 Qutub Minar",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Delhi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The towering UNESCO World Heritage monument is one of Delhi's most recognizable historic landmarks.\nIts intricate carvings and surrounding archaeological complex showcase centuries of architectural history."
      },
      {
        "id": "delhi_attr_4",
        "name": "🪷 Lotus Temple",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Delhi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A striking modern temple designed in the shape of a lotus flower and open to people of all faiths.\nIts distinctive architecture and peaceful atmosphere make it one of Delhi's most visited landmarks."
      },
      {
        "id": "delhi_attr_5",
        "name": "🛍️ Chandni Chowk",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Delhi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of Old Delhi's oldest and busiest markets, famous for street food, traditional shops, and historic lanes.\nExploring the area offers an immersive experience of Delhi's food and commercial culture."
      }
    ]
  },
  {
    "id": 30,
    "name": "Agra",
    "state": "Uttar Pradesh",
    "category": "Heritage",
    "rating": 9.7,
    "bestTime": "October - March",
    "image": "https://boomers-daily.com/wp-content/uploads/2022/09/taj-mahal-india.jpg",
    "images": [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=80",
      "https://plus.unsplash.com/premium_photo-1661930618375-aafabc2bf3e7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWdyYSUyMGZvcnR8ZW58MHx8MHx8fDA%3D",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRORS_VPIMkrC3d3qa8oy4wnKAmyRE4Ufo2O2mdfITXCeSTtb-0VKjy3NU&s=10",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/7b/57/01/caption.jpg?w=1200&h=-1&s=1"
    ],
    "description": "Agra is one of India's most famous heritage destinations and home to the magnificent Taj Mahal.\nThe city preserves remarkable Mughal architecture, historic forts, gardens, and traditional handicrafts.\nOctober to March provides cooler weather and is the most comfortable period for exploring the city's monuments.\nEarly mornings are especially pleasant for visiting major attractions and can provide beautiful light for photography.\nAgra is perfect for couples, families, history lovers, photographers, and international travelers.",
    "attractions": [
      {
        "id": "agra_attr_1",
        "name": "🤍 Taj Mahal",
        "rating": 10,
        "category": "Sightseeing",
        "zone": "Agra Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "The world-famous marble mausoleum is a UNESCO World Heritage Site and one of the world's most recognizable monuments.\nIts exquisite architecture and changing appearance under different light make it an unforgettable experience."
      },
      {
        "id": "agra_attr_2",
        "name": "🏰 Agra Fort",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Agra Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A magnificent red sandstone fort containing palaces, courtyards, mosques, and historic royal chambers.\nIts architecture and connection to the Mughal emperors make it an essential Agra attraction."
      },
      {
        "id": "agra_attr_3",
        "name": "🏛️ Itmad-ud-Daulah",
        "rating": 9.2,
        "category": "Sightseeing",
        "zone": "Agra Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A beautifully decorated marble tomb often regarded as an architectural precursor to the Taj Mahal.\nIts intricate inlay work and peaceful riverside setting make it particularly attractive to photographers."
      },
      {
        "id": "agra_attr_4",
        "name": "🌳 Mehtab Bagh",
        "rating": 9.3,
        "category": "Sightseeing",
        "zone": "Agra Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A historic Mughal garden located across the Yamuna River from the Taj Mahal.\nIt provides a spectacular alternative viewpoint, especially around sunset."
      },
      {
        "id": "agra_attr_5",
        "name": "🏘️ Fatehpur Sikri",
        "rating": 9.5,
        "category": "Sightseeing",
        "zone": "Agra Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A remarkable abandoned Mughal city featuring grand palaces, courtyards, gates, and religious structures.\nIts architecture and fascinating history make it one of the best excursions from Agra."
      }
    ]
  },
  {
    "id": 31,
    "name": "Varanasi",
    "state": "Uttar Pradesh",
    "category": "Spiritual & Heritage",
    "rating": 9.8,
    "bestTime": "October - March",
    "image": "https://images.pexels.com/photos/18215017/pexels-photo-18215017/free-photo-of-sea-and-illuminated-city-at-night.jpeg",
    "images": [
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1800&q=80",
      "https://vrindavanmathuratourism.com/images/varanasi_1782416556.webp",
      "https://images.staybook.in/things-to-do/varanasi-sarnath-buddhist-temple-skip-the-line-ticket/1.jpeg",
      "https://www.stayvista.com/blog/wp-content/uploads/2026/02/145.jpg"
    ],
    "description": "Varanasi is one of India's oldest continuously inhabited cities and one of the country's most important spiritual destinations.\nThe city is famous for the sacred Ganges, ancient temples, colorful ghats, spiritual ceremonies, and traditional culture.\nOctober to March provides cooler weather for exploring the ghats, temples, markets, and historic neighborhoods.\nThe city is particularly atmospheric during festivals when the ghats and temples become filled with lights and celebrations.\nVaranasi is ideal for spiritual travelers, photographers, history lovers, culture enthusiasts, and explorers.",
    "attractions": [
      {
        "id": "varanasi_attr_1",
        "name": "🪔 Dashashwamedh Ghat",
        "rating": 9.9,
        "category": "Sightseeing",
        "zone": "Varanasi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of Varanasi's most famous ghats and the main location for the spectacular evening Ganga Aarti.\nThe combination of lamps, prayers, music, and the sacred river creates an unforgettable atmosphere."
      },
      {
        "id": "varanasi_attr_2",
        "name": "🛕 Kashi Vishwanath Temple",
        "rating": 9.9,
        "category": "Sightseeing",
        "zone": "Varanasi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "One of the most revered Hindu temples dedicated to Lord Shiva and a major pilgrimage destination.\nIts spiritual significance makes it one of the most important landmarks in Varanasi."
      },
      {
        "id": "varanasi_attr_3",
        "name": "🚣 Ganges Boat Ride",
        "rating": 9.8,
        "category": "Sightseeing",
        "zone": "Varanasi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A sunrise or sunset boat ride along the Ganges offers a unique perspective of Varanasi's historic ghats.\nThe experience combines river views, ancient architecture, rituals, and everyday life along the waterfront."
      },
      {
        "id": "varanasi_attr_4",
        "name": "🌅 Assi Ghat",
        "rating": 9.4,
        "category": "Sightseeing",
        "zone": "Varanasi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A popular southern ghat known for morning rituals, yoga, cultural events, and riverside activities.\nIt provides a comparatively relaxed atmosphere for experiencing Varanasi's spiritual traditions."
      },
      {
        "id": "varanasi_attr_5",
        "name": "🛕 Sarnath",
        "rating": 9.6,
        "category": "Sightseeing",
        "zone": "Varanasi Central",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "description": "A major Buddhist pilgrimage site near Varanasi where Gautama Buddha is traditionally believed to have delivered his first sermon.\nIts stupas, archaeological remains, and museums provide a fascinating historical experience."
      }
    ]
  },
  {
    "id": 32,
    "name": "Goa",
    "state": "Goa",
    "category": "Beach & Heritage",
    "rating": 9.7,
    "bestTime": "October - April",
    "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      "/images/attractions/goa_aguada.jpg",
      "/images/attractions/goa_bom_jesus.jpg",
      "/images/attractions/goa_dudhsagar.jpg"
    ],
    "description": "Goa is India's premier coastal paradise, celebrated for golden sandy beaches, Portuguese colonial architecture, UNESCO heritage churches, vibrant beach shacks, and tropical spice plantations. October to April brings ideal sunny beach weather, water sports, vibrant flea markets, and sunset river cruises.",
    "attractions": [
      {
        "id": "goa_fort_aguada",
        "name": "🏰 Fort Aguada & 17th-Century Lighthouse",
        "zone": "North Goa Coastal",
        "category": "Heritage & Scenic",
        "duration": 2,
        "cost": 50,
        "walking": "medium",
        "rating": 9.6,
        "description": "Well-preserved 17th-century Portuguese fortress overlooking Sinquerim Beach and the Arabian Sea."
      },
      {
        "id": "goa_baga_beach",
        "name": "🏖️ Baga Beach & Watersports Hub",
        "zone": "North Goa Coastal",
        "category": "Beach & Watersports",
        "duration": 3,
        "cost": 0,
        "walking": "low",
        "rating": 9.4,
        "description": "Famous shoreline renowned for parasailing, jet skiing, vibrant beach shacks, and evening nightlife."
      },
      {
        "id": "goa_calangute_beach",
        "name": "🏖️ Calangute Beach & Seaside Shacks",
        "zone": "North Goa Coastal",
        "category": "Beach & Dining",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.1,
        "description": "The 'Queen of Beaches' with wide golden sands, souvenir markets, and seaside seafood restaurants."
      },
      {
        "id": "goa_anjuna_flea_market",
        "name": "🛍️ Anjuna Beach & Flea Market",
        "zone": "North Goa Heritage",
        "category": "Shopping & Vibe",
        "duration": 2.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.3,
        "description": "Iconic bohemian beach famous for coconut palms, red laterite rocks, and colorful craft bazaars."
      },
      {
        "id": "goa_chapora_fort",
        "name": "🏰 Chapora Fort (Dil Chahta Hai Point)",
        "zone": "North Goa Heritage",
        "category": "Scenic & Sunset",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "rating": 9.5,
        "description": "Dramatic clifftop fortress ruins offering sweeping panoramas of Vagator Beach and the Chapora River mouth."
      },
      {
        "id": "goa_vagator_beach",
        "name": "🌅 Vagator Beach & Red Cliff Viewpoint",
        "zone": "North Goa Heritage",
        "category": "Beach & Sunset",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.4,
        "description": "Stunning cove beach split into Big and Little Vagator, framed by dramatic red cliffs and swaying palms."
      },
      {
        "id": "goa_basilica_bom_jesus",
        "name": "⛪ Basilica of Bom Jesus (UNESCO Heritage)",
        "zone": "Old Goa Heritage",
        "category": "UNESCO Heritage & History",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.8,
        "description": "Baroque 16th-century church holding the mortal remains of St. Francis Xavier, a masterpiece of Jesuit architecture."
      },
      {
        "id": "goa_se_cathedral",
        "name": "⛪ Se Cathedral & Golden Bell",
        "zone": "Old Goa Heritage",
        "category": "Heritage & Architecture",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.5,
        "description": "One of the largest churches in Asia, dedicated to St. Catherine, featuring Corinthian interiors and majestic bell tower."
      },
      {
        "id": "goa_fontainhas",
        "name": "🎨 Fontainhas Latin Quarter Heritage Walk",
        "zone": "Panaji Central",
        "category": "Culture & Architecture",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.6,
        "description": "Picturesque heritage quarter in Panaji lined with terracotta-tiled roofs, pastel-painted villas, and art galleries."
      },
      {
        "id": "goa_mandovi_cruise",
        "name": "🚢 Mandovi River Sunset Folk Cruise",
        "zone": "Panaji Central",
        "category": "Culture & Cruise",
        "duration": 2,
        "cost": 500,
        "walking": "low",
        "rating": 9.3,
        "description": "Delightful evening boat cruise along the Mandovi River featuring Goan folk dances, music, and sunset vistas."
      },
      {
        "id": "goa_sahakari_spice",
        "name": "🌿 Sahakari Spice Farm Tour & Goan Buffet",
        "zone": "Central Ponda",
        "category": "Agro-Tourism & Food",
        "duration": 3,
        "cost": 500,
        "walking": "low",
        "rating": 9.5,
        "description": "Aromatic plantation tour discovering cardamom, vanilla, cinnamon, and pepper, followed by authentic Goan lunch."
      },
      {
        "id": "goa_dudhsagar",
        "name": "🌊 Dudhsagar Waterfalls & Jungle Jeep Safari",
        "zone": "Mollem Western Ghats",
        "category": "Adventure & Waterfall",
        "duration": 5,
        "cost": 650,
        "walking": "medium",
        "rating": 9.9,
        "description": "Four-tiered milky white cascade tumbling 310 meters down the Western Ghats inside Bhagwan Mahavir Wildlife Sanctuary."
      },
      {
        "id": "goa_palolem_beach",
        "name": "🏖️ Palolem Beach & Butterfly Island",
        "zone": "South Goa Coastal",
        "category": "Scenic & Calm Beach",
        "duration": 3,
        "cost": 0,
        "walking": "low",
        "rating": 9.7,
        "description": "Idyllic crescent bay in South Goa with calm swimming waters, colorful beach huts, and dolphin boat trips."
      },
      {
        "id": "goa_cabo_de_rama",
        "name": "🏰 Cabo de Rama Fort Clifftop",
        "zone": "South Goa Coastal",
        "category": "History & Ocean View",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "rating": 9.4,
        "description": "Secluded southern promontory fort offering romantic views across endless blue horizons of the Arabian Sea."
      },
      {
        "id": "goa_colva_beach",
        "name": "🏖️ Colva Beach & Watersports",
        "zone": "South Goa Coastal",
        "category": "Beach & Leisure",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9,
        "description": "Vast powdery white sand beach stretching along South Goa's coastal belt, ideal for relaxing evening walks."
      }
    ]
  },
  {
    "id": 33,
    "name": "Kalka",
    "state": "Haryana",
    "category": "Heritage & Gateway",
    "rating": 9.1,
    "bestTime": "September - March",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Kalka is the historic gateway to the Himachal Himalayas and the starting terminus of the UNESCO World Heritage Kalka-Shimla Toy Train. Nestled in the Shivalik foothills, it features ancient spiritual shrines, Mughal terraced gardens, and scenic cable car adventures.",
    "attractions": [
      {
        "id": "kalka_unesco_railway",
        "name": "🚂 Kalka UNESCO Heritage Railway Station",
        "zone": "Kalka Heritage Station",
        "category": "Heritage & Rail",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.7,
        "description": "Historic 1903 railway terminus housing the narrow-gauge mountain train workshop and heritage locomotives."
      },
      {
        "id": "kalka_kali_mata",
        "name": "🛕 Kali Mata Historic Mandir",
        "zone": "Kalka Heritage Station",
        "category": "Spiritual & Ancient",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.5,
        "description": "Ancient temple dating back to the Mahabharata era, dedicated to Goddess Kali from whom Kalka derives its name."
      },
      {
        "id": "kalka_pinjore_gardens",
        "name": "⛲ Yadavindra Pinjore Mughal Gardens",
        "zone": "Pinjore Valley",
        "category": "Heritage & Gardens",
        "duration": 2.5,
        "cost": 25,
        "walking": "low",
        "rating": 9.6,
        "description": "Magnificent 17th-century terraced Mughal gardens with cascading fountains, water channels, and illuminated pavilions."
      },
      {
        "id": "kalka_bhima_devi",
        "name": "🏛️ Bhima Devi Temple Complex (Khajuraho of North)",
        "zone": "Pinjore Valley",
        "category": "Archaeology & History",
        "duration": 1.5,
        "cost": 15,
        "walking": "low",
        "rating": 9.2,
        "description": "Ancient 8th-11th century stone temple complex and open-air sculpture museum reflecting Gurjara-Pratihara art."
      },
      {
        "id": "kalka_timber_trail",
        "name": "🚡 Timber Trail Cable Car & Shivalik View",
        "zone": "Parwanoo Heights",
        "category": "Adventure & Panorama",
        "duration": 2.5,
        "cost": 1250,
        "walking": "low",
        "rating": 9.4,
        "description": "Exhilarating aerial ropeway gliding 1.8 km across deep gorges between two mountain ridges in Parwanoo."
      },
      {
        "id": "kalka_kaushalya_dam",
        "name": "🌊 Kaushalya Dam & Birdwatching Trail",
        "zone": "Pinjore Valley",
        "category": "Nature & Lake",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "rating": 8.9,
        "description": "Serene reservoir surrounded by Shivalik greenery, popular for morning walks and migratory birdwatching."
      },
      {
        "id": "kalka_pinjore_heritage_bazaar",
        "name": "🛍️ Pinjore Heritage Craft Bazaar",
        "zone": "Pinjore Valley",
        "category": "Shopping & Local Food",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 8.8,
        "description": "Traditional market famous for local sweet shops, handicrafts, and Punjabi/Himachali snacks."
      },
      {
        "id": "kalka_subathu_fort",
        "name": "🏰 Subathu Gorkha Historical Fortress",
        "zone": "Shivalik Foothills",
        "category": "History",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "rating": 8.7,
        "description": "19th-century Gorkha cantonment hill outpost rich in military history and mountain vistas."
      },
      {
        "id": "kalka_manki_point_nearby",
        "name": "🌄 Manki Point Panorama Trail",
        "zone": "Parwanoo Heights",
        "category": "Scenic",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "rating": 9,
        "description": "Scenic vantage point offering sweeping views of the Sutlej River valley and surrounding mountain spurs."
      },
      {
        "id": "kalka_dagshai_heritage",
        "name": "🏛️ Dagshai Jail Museum & Heritage Walk",
        "zone": "Shivalik Foothills",
        "category": "Heritage",
        "duration": 2,
        "cost": 30,
        "walking": "low",
        "rating": 9.1,
        "description": "One of India's oldest cantonment towns with a preserved colonial military prison museum."
      }
    ]
  },
  {
    "id": 34,
    "name": "Leh Ladakh",
    "state": "Ladakh",
    "category": "High Altitude & Adventure",
    "rating": 9.9,
    "bestTime": "May - September",
    "image": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
      "/images/attractions/leh_pangong.jpg",
      "/images/attractions/leh_thiksey.jpg",
      "/images/attractions/leh_nubra.jpg"
    ],
    "description": "Leh Ladakh is India's crown jewel of high-altitude trans-Himalayan wilderness. Perched over 11,500 feet above sea level, it enchants travelers with azure glacial lakes like Pangong Tso, dramatic snowbound passes like Khardung La, ancient Tibetan Buddhist gompas, white sand dunes with double-humped Bactrian camels in Nubra Valley, and legendary road trip corridors favored by backpackers and student squads worldwide.",
    "attractions": [
      {
        "id": "leh_pangong_lake",
        "name": "🌊 Pangong Tso Glacial Lake",
        "zone": "Changthang High Plateau",
        "category": "Nature & Lake",
        "duration": 4,
        "cost": 20,
        "walking": "low",
        "rating": 9.9,
        "description": "Breathtaking 134-km long endorheic lake at 14,270 ft, famous for color shifts from turquoise to indigo."
      },
      {
        "id": "leh_khardung_la",
        "name": "🏔️ Khardung La Mountain Pass",
        "zone": "Ladakh Mountain Range",
        "category": "Adventure & High Pass",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.8,
        "description": "One of the world's highest motorable passes at 17,982 ft, offering jaw-dropping views of Karakoram peaks."
      },
      {
        "id": "leh_nubra_valley",
        "name": "🐪 Nubra Valley & Hunder Sand Dunes",
        "zone": "Nubra Valley",
        "category": "Desert & Valley",
        "duration": 3.5,
        "cost": 300,
        "walking": "medium",
        "rating": 9.8,
        "description": "High-altitude cold desert surrounded by jagged snow peaks, famous for double-humped Bactrian camel rides."
      },
      {
        "id": "leh_thiksey_monastery",
        "name": "🏛️ Thiksey Gompa (Mini Potala)",
        "zone": "Indus Valley Belt",
        "category": "Spiritual & Heritage",
        "duration": 2.5,
        "cost": 50,
        "walking": "medium",
        "rating": 9.7,
        "description": "12-story hilltop monastery housing a magnificent 49-foot statue of Maitreya Buddha and chanting prayer halls."
      },
      {
        "id": "leh_magnetic_hill",
        "name": "🧲 Magnetic Hill & Gravity Defiance",
        "zone": "Indus Highway NH-1",
        "category": "Geographic Wonder",
        "duration": 1,
        "cost": 0,
        "walking": "low",
        "rating": 9.2,
        "description": "Optical illusion phenomenon on NH-1 where vehicles appear to roll uphill against gravity on neutral gear."
      },
      {
        "id": "leh_shanti_stupa",
        "name": "🕊️ Shanti Stupa & Sunset Panorama",
        "zone": "Leh Town Heights",
        "category": "Spiritual & Panorama",
        "duration": 1.5,
        "cost": 0,
        "walking": "medium",
        "rating": 9.6,
        "description": "White-domed Buddhist stupa on Changspa ridge inaugurated by the Dalai Lama, with 360-degree views of Leh."
      },
      {
        "id": "leh_sangam_confluence",
        "name": "🌊 Sangam (Indus & Zanskar Confluence)",
        "zone": "Indus Valley Belt",
        "category": "Nature & Adventure",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.5,
        "description": "Spectacular visual convergence of turquoise Indus and muddy-green Zanskar rivers, with river rafting."
      },
      {
        "id": "leh_hall_of_fame",
        "name": "🎖️ Hall of Fame War Museum",
        "zone": "Leh Town",
        "category": "History & Patriotism",
        "duration": 2,
        "cost": 250,
        "walking": "low",
        "rating": 9.6,
        "description": "Moving Indian Army museum documenting Siachen heroism, Kargil bravery, and Ladakhi cultural history."
      },
      {
        "id": "leh_leh_palace",
        "name": "🏰 Leh Royal Palace",
        "zone": "Leh Old Town",
        "category": "Heritage & Architecture",
        "duration": 2,
        "cost": 50,
        "walking": "medium",
        "rating": 9.3,
        "description": "9-story 17th-century royal palace modeled after Lhasa's Potala Palace, commanding views of the old city."
      },
      {
        "id": "leh_diskit_monastery",
        "name": "🪷 Diskit Monastery & Colossal Maitreya",
        "zone": "Nubra Valley",
        "category": "Heritage & Viewpoint",
        "duration": 2,
        "cost": 30,
        "walking": "medium",
        "rating": 9.7,
        "description": "Oldest monastery in Nubra Valley crowned with an iconic 106-foot vibrant statue of Jampa Buddha."
      }
    ]
  },
  {
    "id": 35,
    "name": "Kerala",
    "state": "Kerala",
    "category": "Backwaters, Hills & Nature",
    "rating": 9.8,
    "bestTime": "September - March",
    "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      "/images/attractions/kerala_munnar.jpg",
      "/images/attractions/kerala_chinese_nets.jpg",
      "/images/attractions/kerala_athirappilly.jpg"
    ],
    "description": "Known as God's Own Country, Kerala is a tropical paradise of emerald tea-carpeted mountains in Munnar, tranquil palm-fringed backwater canals in Alleppey, historic spice trading ports in Fort Kochi, and roaring rainforest waterfalls at Athirappilly. With super-affordable student state water ferries (as low as ₹4), pristine hill homestays, and Ayurvedic coastal retreats, Kerala is one of the highest-rated student and nature travel havens in South Asia.",
    "attractions": [
      {
        "id": "kerala_alleppey_backwaters",
        "name": "🛶 Alleppey Backwaters & Canal Cruise",
        "zone": "Vembanad Lake Basin",
        "category": "Backwaters & Cruise",
        "duration": 3.5,
        "cost": 400,
        "walking": "low",
        "rating": 9.9,
        "description": "Interconnected network of lagoons, palm-fringed canals, and traditional kettuvallam houseboats."
      },
      {
        "id": "kerala_munnar_tea_gardens",
        "name": "🌿 Munnar Tea Plantations & Kolukkumalai",
        "zone": "High Range Munnar",
        "category": "Nature & Scenic",
        "duration": 3,
        "cost": 0,
        "walking": "medium",
        "rating": 9.8,
        "description": "Endless rolling green carpet of tea estates at 5,000+ ft, fresh aroma, and misty morning viewpoints."
      },
      {
        "id": "kerala_fort_kochi_nets",
        "name": "⛵ Fort Kochi Chinese Fishing Nets & Jew Town",
        "zone": "Coastal Kochi",
        "category": "Heritage & Culture",
        "duration": 2.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.6,
        "description": "Historic cantilevered fishing nets, colonial Portuguese bungalows, cafes, and spice-scented Jew Town."
      },
      {
        "id": "kerala_athirappilly_falls",
        "name": "🌊 Athirappilly Waterfalls (Niagara of India)",
        "zone": "Chalakudy River Basin",
        "category": "Waterfall & Nature",
        "duration": 2.5,
        "cost": 50,
        "walking": "medium",
        "rating": 9.7,
        "description": "Thundering 80-foot waterfall cascading through lush Sholayar rainforests, featured in Bahubali."
      },
      {
        "id": "kerala_eravikulam_park",
        "name": "🦌 Eravikulam National Park (Anamudi)",
        "zone": "High Range Munnar",
        "category": "Wildlife & Trekking",
        "duration": 3,
        "cost": 200,
        "walking": "medium",
        "rating": 9.6,
        "description": "Home to the endangered Nilgiri Tahr mountain goat and the blooming Neelakurinji flower shrubs."
      },
      {
        "id": "kerala_varkala_cliff",
        "name": "🏖️ Varkala Red Cliff Beach & Helipad",
        "zone": "South Kerala Coast",
        "category": "Beach & Sunset",
        "duration": 2.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.7,
        "description": "Dramatic geological red laterite cliffs bordering the Arabian Sea with chilled-out bohemian cafes."
      },
      {
        "id": "kerala_mattupetty_dam",
        "name": "🚤 Mattupetty Dam & Echo Point",
        "zone": "High Range Munnar",
        "category": "Lake & Boating",
        "duration": 2,
        "cost": 50,
        "walking": "low",
        "rating": 9.3,
        "description": "Scenic reservoir flanked by tea gardens and mist-clad hills, famous for speedboating and natural echo effects."
      },
      {
        "id": "kerala_periyar_sanctuary",
        "name": "🐘 Periyar Wildlife Sanctuary & Lake",
        "zone": "Thekkady Spice Hills",
        "category": "Wildlife & Jungle",
        "duration": 3,
        "cost": 300,
        "walking": "medium",
        "rating": 9.5,
        "description": "Dense cardamom hill sanctuary famous for wild elephant herds, boat safaris, and bamboo rafting."
      },
      {
        "id": "kerala_marari_beach",
        "name": "🌴 Marari Serene Fishermen's Beach",
        "zone": "Vembanad Lake Basin",
        "category": "Beach & Leisure",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.4,
        "description": "Pristine white sand beach lined with swaying coconut palms, offering peaceful village tranquility."
      },
      {
        "id": "kerala_kalaripayattu_centre",
        "name": "⚔️ Kadathanadan Kalari & Kathakali Centre",
        "zone": "Thekkady & Kochi",
        "category": "Culture & Martial Arts",
        "duration": 2,
        "cost": 250,
        "walking": "low",
        "rating": 9.6,
        "description": "Ancient martial art performances and classical Kathakali masked dance storytelling."
      }
    ]
  },
  {
    "id": 36,
    "name": "Vizag",
    "state": "Andhra Pradesh",
    "category": "Coastal & Hill Valley & Beach",
    "rating": 9.5,
    "bestTime": "October - March",
    "image": "/images/destinations/vizag.png",
    "images": [
      "/images/destinations/vizag.png",
      "/images/attractions/vizag_submarine.jpg",
      "/images/attractions/vizag_borra.jpg",
      "/images/attractions/vizag_kailasagiri.jpg"
    ],
    "description": "Visakhapatnam, popularly called Vizag and 'The Jewel of the East Coast', is a stunning maritime city where the azure Bay of Bengal meets the rolling Eastern Ghats. Famous for Blue Flag certified Rishikonda Beach, Asia's only operational Submarine Museum (INS Kursura), the iconic hilltop panorama of Kailasagiri, and the scenic Vistadome train ride climbing into the tribal coffee valleys of Araku and ancient million-year-old Borra Caves.",
    "attractions": [
      {
        "id": "vizag_ins_kursura",
        "name": "⚓ INS Kursura Submarine Museum",
        "zone": "RK Beach Promenade",
        "category": "Maritime & History",
        "duration": 1.5,
        "cost": 70,
        "walking": "low",
        "rating": 9.8,
        "description": "Decommissioned Soviet-built submarine preserved right on the sands of RK Beach, India's pride."
      },
      {
        "id": "vizag_rishikonda_beach",
        "name": "🏖️ Rishikonda Blue Flag Beach",
        "zone": "North Coastal Corridor",
        "category": "Beach & Surfing",
        "duration": 3,
        "cost": 0,
        "walking": "low",
        "rating": 9.6,
        "description": "Golden sand beach awarded international Blue Flag certification, premier hub for surfing, kayaking, and jet-skiing."
      },
      {
        "id": "vizag_kailasagiri",
        "name": "🚡 Kailasagiri Hilltop Park & Ropeway",
        "zone": "Central Coastal Hills",
        "category": "Panorama & Theme Park",
        "duration": 2.5,
        "cost": 100,
        "walking": "low",
        "rating": 9.5,
        "description": "Scenic hilltop commanding 360-degree views of Vizag city and the coast, featuring giant Shiva-Parvati statues and ropeway."
      },
      {
        "id": "vizag_araku_valley",
        "name": "☕ Araku Valley Coffee Plantations",
        "zone": "Eastern Ghats Araku",
        "category": "Hills & Nature",
        "duration": 4,
        "cost": 0,
        "walking": "medium",
        "rating": 9.7,
        "description": "Picturesque hill valley at 3,000 ft renowned for indigenous tribal coffee, bamboo chicken, and waterfalls."
      },
      {
        "id": "vizag_borra_caves",
        "name": "🦇 Borra Million-Year Caves",
        "zone": "Ananthagiri Hills",
        "category": "Geology & Wonder",
        "duration": 2,
        "cost": 80,
        "walking": "medium",
        "rating": 9.6,
        "description": "Spectacular limestone karst caves with natural stalactite and stalagmite formations illuminated with colorful LEDs."
      },
      {
        "id": "vizag_tu142_museum",
        "name": "✈️ TU-142 Aircraft Museum",
        "zone": "RK Beach Promenade",
        "category": "Aviation & Defence",
        "duration": 1.5,
        "cost": 70,
        "walking": "low",
        "rating": 9.4,
        "description": "Massive long-range maritime anti-submarine reconnaissance aircraft converted into an interactive museum."
      },
      {
        "id": "vizag_yarada_beach",
        "name": "🌊 Yarada Beach & Dolphin's Nose",
        "zone": "South Vizag Coast",
        "category": "Scenic & Nature",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "rating": 9.5,
        "description": "Secluded golden beach surrounded by hills on three sides and the towering Dolphin's Nose lighthouse promontory."
      },
      {
        "id": "vizag_simhachalam_temple",
        "name": "🛕 Simhachalam Varaha Narasimha Temple",
        "zone": "Simhachalam Hills",
        "category": "Spiritual & Heritage",
        "duration": 2,
        "cost": 0,
        "walking": "medium",
        "rating": 9.4,
        "description": "11th-century hilltop temple dedicated to Lord Narasimha, featuring intricate Kalinga architectural carvings."
      },
      {
        "id": "vizag_ross_hill",
        "name": "⛪ Ross Hill Three-Faiths Sanctuary",
        "zone": "Port Area",
        "category": "Heritage & Harmony",
        "duration": 1.5,
        "cost": 0,
        "walking": "medium",
        "rating": 9.1,
        "description": "Three adjacent hilltops holding a church, a mosque, and a Hindu temple overlooking the bustling Vizag sea port."
      },
      {
        "id": "vizag_tenneti_park",
        "name": "🌅 Tenneti Beach Park & Sea Viewpoint",
        "zone": "North Coastal Corridor",
        "category": "Sunset & Scenic",
        "duration": 1.5,
        "cost": 20,
        "walking": "low",
        "rating": 9.2,
        "description": "Sea-facing cliffside park famous for sunset views, beach stairs, and the stranded merchant vessel viewpoint."
      }
    ]
  },
  {
    "id": 37,
    "name": "Gujarat",
    "state": "Gujarat",
    "category": "Heritage & White Desert",
    "rating": 9.7,
    "bestTime": "October - March",
    "image": "/images/destinations/gujarat.png",
    "images": [
      "/images/destinations/gujarat.png",
      "/images/attractions/gujarat_rann.jpg",
      "/images/attractions/gujarat_gir.jpg",
      "/images/attractions/gujarat_rani_ki_vav.jpg"
    ],
    "description": "Gujarat is the vibrant land of legend and contrast, stretching from the surreal white salt expanse of the Great Rann of Kutch to the colossal 597-foot Statue of Unity—the tallest statue in the world. Visitors experience the thrill of tracking wild Asiatic lions in Sasan Gir, stepping into Mahatma Gandhi's birthplace and peaceful Sabarmati Ashram, exploring UNESCO stepwells at Rani Ki Vav, and feasting on legendary Gujarati thalis and street delicacies.",
    "attractions": [
      {
        "id": "gujarat_rann_of_kutch",
        "name": "✨ Great Rann of Kutch White Salt Desert",
        "zone": "Kutch Border Desert",
        "category": "Natural Wonder & Salt Desert",
        "duration": 4,
        "cost": 100,
        "walking": "medium",
        "rating": 9.9,
        "description": "World's largest salt desert shimmering under full-moon skies, host to the vibrant cultural Rann Utsav."
      },
      {
        "id": "gujarat_statue_of_unity",
        "name": "🗽 Statue of Unity & Observation Deck",
        "zone": "Kevadia Narmada Basin",
        "category": "Monument & Wonder",
        "duration": 3.5,
        "cost": 380,
        "walking": "low",
        "rating": 9.8,
        "description": "Colossal 182-meter tribute to Sardar Vallabhbhai Patel with high-speed elevators to the chest observation deck."
      },
      {
        "id": "gujarat_sabarmati_ashram",
        "name": "🕊️ Sabarmati Gandhi Ashram & Museum",
        "zone": "Ahmedabad Central",
        "category": "History & Peace",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.7,
        "description": "Historic headquarters where Mahatma Gandhi lived and launched the historic 1930 Dandi Salt March."
      },
      {
        "id": "gujarat_gir_national_park",
        "name": "🦁 Gir National Park (Asiatic Lion Safari)",
        "zone": "Sasan Gir Junagadh",
        "category": "Wildlife & Safari",
        "duration": 3.5,
        "cost": 800,
        "walking": "low",
        "rating": 9.8,
        "description": "The only natural sanctuary on planet Earth where the endangered Asiatic Lion roams freely in the wild."
      },
      {
        "id": "gujarat_rani_ki_vav",
        "name": "🏛️ Rani Ki Vav Stepwell (UNESCO World Heritage)",
        "zone": "Patan Heritage",
        "category": "Architecture & UNESCO",
        "duration": 2,
        "cost": 40,
        "walking": "medium",
        "rating": 9.7,
        "description": "Subterranean multi-tiered stepwell temple built in 1063 AD with over 500 principal sculptures."
      },
      {
        "id": "gujarat_modhera_sun_temple",
        "name": "☀️ Modhera Sun Temple & Surya Kund",
        "zone": "Mehsana Heritage Belt",
        "category": "Architecture & History",
        "duration": 2,
        "cost": 25,
        "walking": "medium",
        "rating": 9.6,
        "description": "Architectural masterpiece aligned so the first rays of the rising sun illuminate the deity sanctum."
      },
      {
        "id": "gujarat_somnath_temple",
        "name": "🛕 Somnath Jyotirlinga Shore Temple",
        "zone": "Saurashtra Coast",
        "category": "Spiritual & Coast",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.7,
        "description": "The first among the twelve holy Shiva Jyotirlingas, perched on the shore of the Arabian Sea."
      },
      {
        "id": "gujarat_sabarmati_riverfront",
        "name": "🌊 Sabarmati Riverfront & Atal Footbridge",
        "zone": "Ahmedabad Central",
        "category": "Leisure & Urban Walk",
        "duration": 2,
        "cost": 30,
        "walking": "low",
        "rating": 9.4,
        "description": "Modern urban riverfront promenade featuring cycling tracks, parks, and the colorful glass Atal pedestrian bridge."
      },
      {
        "id": "gujarat_adalaj_stepwell",
        "name": "🏰 Adalaj Ni Vav Indo-Islamic Stepwell",
        "zone": "Gandhinagar Belt",
        "category": "Heritage & Design",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.3,
        "description": "Five-story deep intricately carved sandstone stepwell built in 1498 with stunning octagonal geometry."
      },
      {
        "id": "gujarat_bhujodi_crafts",
        "name": "🧶 Bhujodi Textile & Handicraft Artisans Village",
        "zone": "Kutch Central",
        "category": "Art & Shopping",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.5,
        "description": "Artisan hamlet famous for handloom shawls, Rogan art, Kutchi mirror-work embroidery, and tie-dye bandhani."
      }
    ]
  },
  {
    "id": 38,
    "name": "Punjab",
    "state": "Punjab",
    "category": "Spiritual, Heritage & Food",
    "rating": 9.8,
    "bestTime": "October - March",
    "image": "/images/destinations/punjab.png",
    "images": [
      "/images/destinations/punjab.png",
      "/images/attractions/punjab_wagah.jpg",
      "/images/attractions/punjab_jallianwala.jpg",
      "/images/attractions/punjab_gobindgarh.jpg"
    ],
    "description": "Punjab, the spirited Land of Five Rivers, is celebrated worldwide for its overwhelming warmth, deep spiritual traditions, and legendary cuisine. At its heart lies Amritsar's sacred Golden Temple (Sri Harmandir Sahib), where the community kitchen (Guru Ka Langar) feeds over 100,000 pilgrims and students free every day. Combined with the electric national pride of the Wagah Border Ceremony, the historic solemnity of Jallianwala Bagh, and iconic butter-loaded Amritsari Kulchas, Punjab is an unforgettable, high-energy travel experience.",
    "attractions": [
      {
        "id": "punjab_golden_temple",
        "name": "✨ Sri Harmandir Sahib (The Golden Temple & Langar)",
        "zone": "Amritsar Old Core",
        "category": "Spiritual & Sanctuary",
        "duration": 3.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.9,
        "description": "Holiest Gurdwara of Sikhism plated in pure gold, surrounded by the Amrit Sarovar holy pool and 24/7 free langar."
      },
      {
        "id": "punjab_wagah_border",
        "name": "🇮🇳 Wagah Border Beating Retreat Ceremony",
        "zone": "Grand Trunk Road Attari",
        "category": "Patriotism & Spectacle",
        "duration": 3,
        "cost": 0,
        "walking": "low",
        "rating": 9.9,
        "description": "Electrifying daily military flag-lowering drill between the Indian BSF and Pakistan Rangers with loud cheers."
      },
      {
        "id": "punjab_jallianwala_bagh",
        "name": "🕊️ Jallianwala Bagh Memorial & Martyrs Well",
        "zone": "Amritsar Old Core",
        "category": "History & Memorial",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.7,
        "description": "National historic memorial garden preserving bullet marks on walls and the martyrs' well from the 1919 massacre."
      },
      {
        "id": "punjab_partition_museum",
        "name": "🏛️ The Partition Museum (Town Hall)",
        "zone": "Heritage Street Amritsar",
        "category": "History & Stories",
        "duration": 2,
        "cost": 10,
        "walking": "low",
        "rating": 9.6,
        "description": "World's first museum dedicated to the 1947 Partition, housing oral histories, refugee artifacts, and photographs."
      },
      {
        "id": "punjab_gobindgarh_fort",
        "name": "🏰 Gobindgarh Fort & 7D Whispering Walls",
        "zone": "Amritsar City Ring",
        "category": "Heritage & Show",
        "duration": 2.5,
        "cost": 150,
        "walking": "low",
        "rating": 9.5,
        "description": "Historic fortress built by Maharaja Ranjit Singh featuring Sikh martial arts (Gatka), coin museums, and laser shows."
      },
      {
        "id": "punjab_sadda_pind",
        "name": "🌾 Sadda Pind Cultural Village & Folk Feast",
        "zone": "Guru Nanak Dev University Belt",
        "category": "Culture & Traditional Food",
        "duration": 3.5,
        "cost": 850,
        "walking": "low",
        "rating": 9.6,
        "description": "Authentic 12-acre Punjabi living village with live Bhangra, pottery, weaving, Sarson ka Saag, and Makki di Roti."
      },
      {
        "id": "punjab_durgiana_temple",
        "name": "🛕 Durgiana Temple (Silver Temple)",
        "zone": "Near Hathi Gate",
        "category": "Spiritual & Architecture",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.2,
        "description": "Centuries-old Hindu temple dedicated to Goddess Durga, set in a holy lake and styled like the Golden Temple."
      },
      {
        "id": "punjab_heritage_street_food",
        "name": "🍲 Heritage Street Food & Hall Bazaar Trail",
        "zone": "Heritage Street Amritsar",
        "category": "Food & Shopping",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.7,
        "description": "Pedestrian marble avenue famous for piping hot Amritsari Kulcha, creamy lassi, jalebis, and Phulkari embroidery."
      },
      {
        "id": "punjab_harike_wetland",
        "name": "🦆 Harike Pattan Ramsar Wetland",
        "zone": "Beas-Sutlej Confluence",
        "category": "Nature & Birdwatching",
        "duration": 3,
        "cost": 0,
        "walking": "medium",
        "rating": 9.3,
        "description": "Northern India's largest freshwater wetland, sanctuary to thousands of migratory birds and endangered Indus dolphins."
      },
      {
        "id": "punjab_ram_tirath",
        "name": "🌿 Sri Ram Tirath Ashram & Valmiki Temple",
        "zone": "Amritsar Outskirts",
        "category": "Spiritual & Mythology",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.1,
        "description": "Ancient ashram where Sage Valmiki wrote the Ramayana and where Luv and Kush were raised."
      }
    ]
  },
  {
    "id": 39,
    "name": "Udaipur",
    "state": "Rajasthan",
    "category": "Royal Heritage & Lakes",
    "rating": 9.7,
    "bestTime": "October - March",
    "image": "/images/destinations/udaipur.jpg",
    "images": [
      "/images/destinations/udaipur.jpg",
      "/images/attractions/udaipur_city_palace.jpg",
      "/images/attractions/udaipur_lake_pichola.jpg",
      "/images/attractions/udaipur_monsoon_palace.jpg",
      "/images/attractions/udaipur_saheliyon.jpg"
    ],
    "description": "Udaipur, the fabled 'City of Lakes' and 'Venice of the East', is nestled around azure lakes against the rugged Aravalli Hills. Crowned by the colossal marble City Palace and floating Jag Mandir, Udaipur enchants visitors with romantic boat rides on Lake Pichola, historic Havelis, sunset rooftop dining, and centuries of Mewar royal valor.",
    "attractions": [
      {
        "id": "udaipur_city_palace",
        "name": "🏰 City Palace Complex & Museum",
        "zone": "Lake Pichola East Bank",
        "category": "Royal Heritage & Architecture",
        "duration": 3,
        "cost": 300,
        "walking": "medium",
        "rating": 9.8,
        "description": "Rajasthan's largest royal palace complex with mirrored courtyards, marble balconies, and sweeping lake panoramas."
      },
      {
        "id": "udaipur_lake_pichola",
        "name": "🚤 Lake Pichola Sunset Boat Cruise & Jag Mandir",
        "zone": "Lake Pichola",
        "category": "Scenic & Boating",
        "duration": 2,
        "cost": 450,
        "walking": "low",
        "rating": 9.8,
        "description": "Iconic boat ride across sparkling waters, cruising past the Taj Lake Palace island and docking at Jag Mandir gardens."
      },
      {
        "id": "udaipur_sajjangarh",
        "name": "🏯 Sajjangarh (Monsoon Palace) Sunset Ridge",
        "zone": "Bansdara Peak Aravallis",
        "category": "Panoramic Sunset & History",
        "duration": 2.5,
        "cost": 110,
        "walking": "low",
        "rating": 9.5,
        "description": "Hilltop palace built in 1884 to view monsoon clouds, offering breathtaking 360-degree sunset views of Udaipur."
      },
      {
        "id": "udaipur_saheliyon_bari",
        "name": "🌿 Saheliyon Ki Bari (Garden of the Royal Maids)",
        "zone": "Fateh Sagar Belt",
        "category": "Gardens & Fountains",
        "duration": 1.5,
        "cost": 50,
        "walking": "low",
        "rating": 9.3,
        "description": "Historic ornamental garden with lotus pools, marble elephant fountains, and fragrant flower boulevards."
      },
      {
        "id": "udaipur_jagdish_temple",
        "name": "🛕 Jagdish Temple & Gangaur Ghat Aarti",
        "zone": "Old City Core",
        "category": "Spiritual & Ghat Heritage",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.4,
        "description": "Majestic 1651 AD Indo-Aryan temple with carved stone pillars, leading down to the spiritual steps of Gangaur Ghat."
      },
      {
        "id": "udaipur_bagore_ki_haveli",
        "name": "🎭 Bagore Ki Haveli Dharohar Folk Dance Show",
        "zone": "Gangaur Ghat",
        "category": "Cultural Dance & Heritage",
        "duration": 2,
        "cost": 100,
        "walking": "low",
        "rating": 9.7,
        "description": "18th-century waterfront mansion hosting colorful evening Rajasthani Chari and Kalbelia fire dances with 138 rooms."
      }
    ]
  },
  {
    "id": 40,
    "name": "Ooty",
    "state": "Tamil Nadu",
    "category": "Hill Station & Tea Gardens",
    "rating": 9.4,
    "bestTime": "October - June",
    "image": "/images/destinations/ooty.jpg",
    "images": [
      "/images/destinations/ooty.jpg",
      "/images/attractions/ooty_toy_train.jpg",
      "/images/attractions/ooty_lake.jpg",
      "/images/attractions/ooty_doddabetta.jpg"
    ],
    "description": "Ooty (Udhagamandalam), the 'Queen of Hill Stations', sits high in the Nilgiri Hills of Tamil Nadu at 7,350 feet. Renowned for its UNESCO Mountain Toy Train, rolling emerald tea estates, misty blue eucalyptus groves, and pleasant cool breezes year-round, Ooty is South India's premier mountain retreat.",
    "attractions": [
      {
        "id": "ooty_toy_train",
        "name": "🚂 Nilgiri Mountain Railway (UNESCO Toy Train)",
        "zone": "Ooty - Coonoor Rail Corridor",
        "category": "UNESCO Heritage Joyride",
        "duration": 3,
        "cost": 200,
        "walking": "low",
        "rating": 9.8,
        "description": "Historic rack-and-pinion steam railway chugging through 208 curves, 16 tunnels, and breathtaking Nilgiri ravines."
      },
      {
        "id": "ooty_botanical_garden",
        "name": "🌺 Government Botanical Gardens & Rose Garden",
        "zone": "Doddabetta Foothills",
        "category": "Flora & Nature Walks",
        "duration": 2,
        "cost": 40,
        "walking": "medium",
        "rating": 9.4,
        "description": "55-acre terraced gardens established in 1848, featuring exotic Himalayan pines, a 20-million-year-old fossil tree, and rare orchids."
      },
      {
        "id": "ooty_doddabetta_peak",
        "name": "🏔️ Doddabetta Peak & Telescope House",
        "zone": "Nilgiri Crest",
        "category": "Highest Viewpoint & Panorama",
        "duration": 2,
        "cost": 20,
        "walking": "low",
        "rating": 9.5,
        "description": "The highest mountain in the Nilgiris (8,652 ft), offering sweeping panoramic views across Tamil Nadu and Kerala borders."
      },
      {
        "id": "ooty_lake_boating",
        "name": "🚣 Ooty Lake & Boat House",
        "zone": "Town Center",
        "category": "Boating & Leisure",
        "duration": 1.5,
        "cost": 180,
        "walking": "low",
        "rating": 9.1,
        "description": "Scenic 65-acre artificial lake framed by eucalyptus trees, popular for pedal boating and lakeside cycling."
      },
      {
        "id": "ooty_pykara_falls",
        "name": "🌲 Pykara Waterfalls & Lake Speedboat",
        "zone": "Pykara Valley",
        "category": "Waterfalls & Pine Woods",
        "duration": 2.5,
        "cost": 150,
        "walking": "medium",
        "rating": 9.5,
        "description": "Cascading sacred river waterfalls dropping through rocky ledges, surrounded by dense shola forests and peaceful speedboat cruises."
      },
      {
        "id": "ooty_tea_factory",
        "name": "🍵 Dodabetta Tea Factory & Chocolate Museum",
        "zone": "Kotagiri Road",
        "category": "Tea Tasting & Workshop",
        "duration": 1.5,
        "cost": 30,
        "walking": "low",
        "rating": 9.3,
        "description": "Live orthodox tea CTC processing demonstration with complimentary warm cardamom tea and homemade artisan chocolates."
      }
    ]
  },
  {
    "id": 41,
    "name": "Pondicherry",
    "state": "Puducherry",
    "category": "Coastal & French Heritage",
    "rating": 9.3,
    "bestTime": "October - March",
    "image": "/images/destinations/pondicherry.jpg",
    "images": [
      "/images/destinations/pondicherry.jpg",
      "/images/attractions/pondicherry_white_town.jpg",
      "/images/attractions/pondicherry_auroville.jpg",
      "/images/attractions/pondicherry_sacred_heart.jpg"
    ],
    "description": "Pondicherry (Puducherry), affectionately called the 'French Riviera of the East', is a charming coastal enclave with mustard-yellow colonial villas, bougainvillea-draped balconies, and serene seaside promenades. Home to the international spiritual community of Auroville and world-class French patisseries, it is a haven for mindful travel and bohemian coastal bliss.",
    "attractions": [
      {
        "id": "pondicherry_white_town",
        "name": "🥐 White Town French Quarters & Heritage Cycling",
        "zone": "French Quarter",
        "category": "Colonial Architecture & Cafés",
        "duration": 2.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.7,
        "description": "Grid-planned French streets with pastel yellow villas, chic boutiques, Parisian-style bistros, and vintage bicycles."
      },
      {
        "id": "pondicherry_promenade",
        "name": "🌊 Promenade Beach (Rock Beach) & Gandhi Memorial",
        "zone": "Seaside Boulevard",
        "category": "Sea Promenade & Sunsets",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.6,
        "description": "1.5 km vehicle-free coastal promenade lined with black volcanic rocks, historic lighthouses, and crashing ocean waves."
      },
      {
        "id": "pondicherry_auroville",
        "name": "🧘 Auroville Universal City & Matrimandir",
        "zone": "Auroville Township",
        "category": "Spiritual Community & Peace Dome",
        "duration": 3.5,
        "cost": 0,
        "walking": "medium",
        "rating": 9.7,
        "description": "Global experimental township featuring the golden metallic geodesic sphere Matrimandir dedicated to human unity."
      },
      {
        "id": "pondicherry_paradise_beach",
        "name": "🏖️ Paradise Beach & Chunnambar Boat Cruise",
        "zone": "Chunnambar Estuary",
        "category": "Isolated Beach & Water Sports",
        "duration": 3,
        "cost": 250,
        "walking": "low",
        "rating": 9.5,
        "description": "Secluded golden sand spit reached via a scenic backwater boat ride, famous for soft sands and cool ocean breezes."
      },
      {
        "id": "pondicherry_sacred_heart",
        "name": "⛪ Basilica of the Sacred Heart of Jesus",
        "zone": "South Boulevard",
        "category": "Gothic Church Architecture",
        "duration": 1,
        "cost": 0,
        "walking": "low",
        "rating": 9.2,
        "description": "Stunning 1907 neo-Gothic Catholic church famous for French stained glass panels depicting 28 saints."
      },
      {
        "id": "pondicherry_serenity_beach",
        "name": "🏄 Serenity Beach & Coastal Surf School",
        "zone": "East Coast Road North",
        "category": "Surfing & Fishermen Village",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.3,
        "description": "Gentle Atlantic-style beach breaks ideal for beginner surfing lessons, beach volleyball, and fresh coconut water."
      }
    ]
  },
  {
    "id": 42,
    "name": "Mumbai",
    "state": "Maharashtra",
    "category": "Metropolis & Coastal Heritage",
    "rating": 9.6,
    "bestTime": "November - February",
    "image": "/images/destinations/mumbai.jpg",
    "images": [
      "/images/attractions/mumbai_gateway.jpg",
      "/images/attractions/mumbai_marine_drive.jpg",
      "/images/attractions/mumbai_sea_link.jpg",
      "/images/attractions/mumbai_cst.jpg"
    ],
    "description": "Mumbai, the vibrant financial capital and pulsating 'City of Dreams', stands on the Arabian Sea coast. Blending grand Victorian Gothic UNESCO architecture with the glitz of Bollywood, bustling coastal street food at Chowpatty, and sunset strolls along Marine Drive, Mumbai radiates an infectious, unstoppable 24/7 energy.",
    "attractions": [
      {
        "id": "mumbai_gateway_of_india",
        "name": "🏛️ Gateway of India & Taj Mahal Palace Hotel",
        "zone": "Colaba Waterfront",
        "category": "Iconic Monument & History",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.8,
        "description": "Grand 26-meter basalt arch overlooking Mumbai harbour, flanked by the historic 1903 flagship Taj Mahal Palace hotel."
      },
      {
        "id": "mumbai_marine_drive",
        "name": "🌊 Marine Drive (Queen's Necklace) Sunset Walk",
        "zone": "South Mumbai Promenade",
        "category": "Coastal Promenade & Art Deco",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.8,
        "description": "3.6 km C-shaped seaside boulevard framed by Art Deco buildings, gleaming like a string of pearls at twilight."
      },
      {
        "id": "mumbai_elephanta_caves",
        "name": "🗿 Elephanta Caves UNESCO Rock-Cut Temples",
        "zone": "Elephanta Island (Ferry from Gateway)",
        "category": "UNESCO Ancient Sculpture",
        "duration": 4,
        "cost": 260,
        "walking": "medium",
        "rating": 9.6,
        "description": "5th-century rock-cut cave temples dedicated to Lord Shiva, famous for the magnificent 20-foot three-headed Trimurti statue."
      },
      {
        "id": "mumbai_bandra_sea_link",
        "name": "🌉 Bandra-Worli Sea Link & Bandstand Walk",
        "zone": "Bandra West",
        "category": "Modern Engineering & Bollywood",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.4,
        "description": "Cable-stayed bridge spanning the Arabian Sea, leading to the coastal promenade outside Bollywood superstar residences."
      },
      {
        "id": "mumbai_cst_heritage",
        "name": "🚉 Chhatrapati Shivaji Maharaj Terminus (CSTM)",
        "zone": "Fort Heritage Precinct",
        "category": "UNESCO Victorian Gothic",
        "duration": 1,
        "cost": 0,
        "walking": "low",
        "rating": 9.5,
        "description": "Architectural masterpiece of Victorian Italianate Gothic revival style built in 1887 with gargoyles and stained glass."
      },
      {
        "id": "mumbai_chowpatty_food",
        "name": "🍲 Girgaon Chowpatty Pav Bhaji & Kulfi Trail",
        "zone": "Girgaon Beach",
        "category": "Street Food & Beach Life",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.6,
        "description": "Bustling beach promenade famous for butter-drenched Pav Bhaji, crispy Bhel Puri, and rabdi-topped Kulfi."
      }
    ]
  },
  {
    "id": 43,
    "name": "Hampi",
    "state": "Karnataka",
    "category": "UNESCO Heritage & Ancient Ruins",
    "rating": 9.8,
    "bestTime": "October - March",
    "image": "/images/destinations/hampi.jpg",
    "images": [
      "/images/destinations/hampi.jpg",
      "/images/attractions/hampi_virupaksha.jpg",
      "/images/attractions/hampi_matanga.jpg",
      "/images/attractions/hampi_lotus_mahal.jpg"
    ],
    "description": "Hampi, a spellbinding UNESCO World Heritage site in Karnataka, was the opulent capital of the 14th-century Vijayanagara Empire. Set amidst an otherworldly landscape of giant granite boulders, banana plantations, and the rushing Tungabhadra River, Hampi showcases over 1,600 surviving monuments, musical stone pillars, and monoliths.",
    "attractions": [
      {
        "id": "hampi_virupaksha_temple",
        "name": "🛕 Virupaksha Temple (7th-Century Living Shrine)",
        "zone": "Hampi Bazaar",
        "category": "Sacred Living Temple",
        "duration": 2,
        "cost": 50,
        "walking": "low",
        "rating": 9.9,
        "description": "Ancient temple dedicated to Lord Shiva with a 160-foot Gopuram gateway and pinhole inverted shadow optical marvel."
      },
      {
        "id": "hampi_vittala_chariot",
        "name": "🛞 Vijaya Vittala Temple & Iconic Stone Chariot",
        "zone": "Vittala Complex",
        "category": "UNESCO Monumental Sculpture",
        "duration": 2.5,
        "cost": 40,
        "walking": "medium",
        "rating": 9.9,
        "description": "The crown jewel of Vijayanagara architecture, featuring musical stone pillars and the iconic monolithic Garuda stone chariot."
      },
      {
        "id": "hampi_matanga_hill",
        "name": "🌅 Matanga Hill Sunrise & Tungabhadra Panorama",
        "zone": "Central Hills",
        "category": "Hiking & 360 Viewpoint",
        "duration": 2,
        "cost": 0,
        "walking": "high",
        "rating": 9.8,
        "description": "The highest point in Hampi reached via stone steps, offering mesmerizing sunrise views across the boulder-strewn landscape."
      },
      {
        "id": "hampi_lotus_mahal",
        "name": "👑 Lotus Mahal & Royal Elephant Stables",
        "zone": "Royal Center",
        "category": "Indo-Islamic Architecture",
        "duration": 2,
        "cost": 40,
        "walking": "low",
        "rating": 9.6,
        "description": "Two-story secular summer pavilion designed like a blooming lotus, adjacent to 11 domed stables for royal war elephants."
      },
      {
        "id": "hampi_sanapur_lake",
        "name": "🚣 Sanapur Lake Coracle Ride & Cliff Bouldering",
        "zone": "Anegundi (Hippie Side)",
        "category": "Coracle Boating & Nature",
        "duration": 2.5,
        "cost": 300,
        "walking": "medium",
        "rating": 9.7,
        "description": "Pristine reservoir surrounded by granite cliffs, popular for circular coracle boat rides and world-class boulder climbing."
      },
      {
        "id": "hampi_queen_bath",
        "name": "🏊 Queen's Bath & Stepped Pushkarani Tank",
        "zone": "Royal Enclosure",
        "category": "Water Architecture & Engineering",
        "duration": 1.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.4,
        "description": "Elaborate royal swimming pavilion with carved Indo-Saracenic balconies and perfectly symmetrical geometric stepped tank."
      }
    ]
  },
  {
    "id": 44,
    "name": "Andaman",
    "state": "Andaman & Nicobar",
    "category": "Islands & Coral Marine Life",
    "rating": 9.8,
    "bestTime": "October - May",
    "image": "/images/destinations/andaman.jpg",
    "images": [
      "/images/destinations/andaman.jpg",
      "/images/attractions/andaman_radhanagar.jpg",
      "/images/attractions/andaman_cellular_jail.jpg",
      "/images/attractions/andaman_elephant_beach.jpg",
      "/images/attractions/andaman_neil_island.jpg"
    ],
    "description": "The Andaman & Nicobar archipelago is an idyllic tropical paradise in the Bay of Bengal, blessed with sparkling turquoise waters, pristine white-sand beaches, and vibrant coral reefs. From the historic colonial ramparts of Cellular Jail to Asia's finest Radhanagar Beach on Havelock Island and world-class scuba diving, Andaman is India's premier island haven.",
    "attractions": [
      {
        "id": "andaman_radhanagar_beach",
        "name": "🏝️ Radhanagar Beach (Beach No. 7, Havelock)",
        "zone": "Swaraj Dweep (Havelock)",
        "category": "World-Class Beach & Sunset",
        "duration": 3.5,
        "cost": 0,
        "walking": "low",
        "rating": 9.9,
        "description": "Crowned Asia's best beach by Time Magazine, celebrated for powder-white sands, gentle azure surf, and lush rainforest canopy."
      },
      {
        "id": "andaman_cellular_jail",
        "name": "⛓️ Cellular Jail National Memorial & Light Show",
        "zone": "Port Blair",
        "category": "Freedom Struggle Memorial",
        "duration": 2.5,
        "cost": 30,
        "walking": "low",
        "rating": 9.8,
        "description": "Historic colonial prison ('Kaala Paani') where brave Indian freedom fighters were exiled, featuring a moving evening sound-and-light show."
      },
      {
        "id": "andaman_elephant_beach",
        "name": "🤿 Elephant Beach Coral Reef Snorkeling & Sea Walk",
        "zone": "Havelock North",
        "category": "Scuba, Snorkeling & Corals",
        "duration": 3,
        "cost": 1200,
        "walking": "medium",
        "rating": 9.7,
        "description": "Crystal-clear shallow waters teeming with brain corals, clownfish, turtles, and underwater helmet sea-walking adventures."
      },
      {
        "id": "andaman_neil_island",
        "name": "🚤 Neil Island (Shaheed Dweep) Natural Rock Bridge",
        "zone": "Neil Island",
        "category": "Natural Wonder & Low Tide Reef",
        "duration": 3,
        "cost": 0,
        "walking": "medium",
        "rating": 9.6,
        "description": "Naturally formed living coral rock bridge exposed at low tide, with starfish and sea anemones in tidal rock pools."
      },
      {
        "id": "andaman_chidiya_tapu",
        "name": "🦜 Chidiya Tapu Sunset Point & Munda Pahad",
        "zone": "South Andaman",
        "category": "Birdwatching & Golden Sunset",
        "duration": 2,
        "cost": 0,
        "walking": "low",
        "rating": 9.5,
        "description": "The southernmost tip of South Andaman Island, renowned for indigenous tropical birds and stunning sunset silhouettes."
      },
      {
        "id": "andaman_ross_island",
        "name": "🚢 Ross Island (Netaji Subhash Bose Dweep) Ruins",
        "zone": "Port Blair Harbor",
        "category": "Island Ruins & Peacocks",
        "duration": 2.5,
        "cost": 50,
        "walking": "medium",
        "rating": 9.5,
        "description": "Former British administrative capital reclaimed by giant banyan tree roots, with friendly deer and peacocks roaming freely."
      }
    ]
  }
];

export default destinations;
