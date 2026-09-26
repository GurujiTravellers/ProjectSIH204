const hotelImages = [
  "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress",
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1",
  "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp",
  "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg",
  "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE=",
  "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg",
  "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg",
  "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg",
  "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
];

const hotels = [
  {
    "id": 1,
    "destination": "Shimla",
    "name": "Snow Valley Retreat",
    "price": 2800,
    "rating": 4.6,
    "contact": "+91 90000 00001",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 2,
    "destination": "Shimla",
    "name": "Himalayan Grand Stay",
    "price": 3500,
    "rating": 4.8,
    "contact": "+91 90000 00002",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 3,
    "destination": "Shimla",
    "name": "Pine View Hotel",
    "price": 2400,
    "rating": 4.5,
    "contact": "+91 90000 00003",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 4,
    "destination": "Manali",
    "name": "Mountain Bliss Resort",
    "price": 3200,
    "rating": 4.7,
    "contact": "+91 90000 00004",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 5,
    "destination": "Manali",
    "name": "Valley View Retreat",
    "price": 3800,
    "rating": 4.8,
    "contact": "+91 90000 00005",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 6,
    "destination": "Manali",
    "name": "Riverfront Manali Stay",
    "price": 2600,
    "rating": 4.5,
    "contact": "+91 90000 00006",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 7,
    "destination": "Rohtang Pass",
    "name": "Snow Peak Lodge",
    "price": 3000,
    "rating": 4.6,
    "contact": "+91 90000 00007",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 8,
    "destination": "Rohtang Pass",
    "name": "Himalayan Explorer Inn",
    "price": 3400,
    "rating": 4.7,
    "contact": "+91 90000 00008",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 9,
    "destination": "Rohtang Pass",
    "name": "Mountain Edge Resort",
    "price": 2700,
    "rating": 4.5,
    "contact": "+91 90000 00009",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 10,
    "destination": "Kasol",
    "name": "Parvati Valley Retreat",
    "price": 2200,
    "rating": 4.5,
    "contact": "+91 90000 00010",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 11,
    "destination": "Kasol",
    "name": "Riverside Kasol Stay",
    "price": 2600,
    "rating": 4.7,
    "contact": "+91 90000 00011",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 12,
    "destination": "Kasol",
    "name": "Forest View Inn",
    "price": 1900,
    "rating": 4.4,
    "contact": "+91 90000 00012",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 13,
    "destination": "Chitkul",
    "name": "Baspa Valley Lodge",
    "price": 2400,
    "rating": 4.7,
    "contact": "+91 90000 00013",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 14,
    "destination": "Chitkul",
    "name": "Himalayan Village Stay",
    "price": 2800,
    "rating": 4.8,
    "contact": "+91 90000 00014",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 15,
    "destination": "Chitkul",
    "name": "Mountain Cottage Retreat",
    "price": 2100,
    "rating": 4.5,
    "contact": "+91 90000 00015",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 16,
    "destination": "Kalpa",
    "name": "Kinner Valley Resort",
    "price": 2700,
    "rating": 4.7,
    "contact": "+91 90000 00016",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 17,
    "destination": "Kalpa",
    "name": "Apple Orchard Retreat",
    "price": 3100,
    "rating": 4.8,
    "contact": "+91 90000 00017",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 18,
    "destination": "Kalpa",
    "name": "Kinnaur View Hotel",
    "price": 2300,
    "rating": 4.5,
    "contact": "+91 90000 00018",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 19,
    "destination": "Sissu",
    "name": "Sissu Valley Resort",
    "price": 2900,
    "rating": 4.7,
    "contact": "+91 90000 00019",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 20,
    "destination": "Sissu",
    "name": "Lahaul Mountain Stay",
    "price": 3200,
    "rating": 4.8,
    "contact": "+91 90000 00020",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 21,
    "destination": "Sissu",
    "name": "Waterfall View Lodge",
    "price": 2500,
    "rating": 4.5,
    "contact": "+91 90000 00021",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 22,
    "destination": "Kaza",
    "name": "Spiti Valley Retreat",
    "price": 2600,
    "rating": 4.6,
    "contact": "+91 90000 00022",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 23,
    "destination": "Kaza",
    "name": "Himalayan Heights Inn",
    "price": 3000,
    "rating": 4.7,
    "contact": "+91 90000 00023",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 24,
    "destination": "Kaza",
    "name": "Spiti Explorer Lodge",
    "price": 2200,
    "rating": 4.5,
    "contact": "+91 90000 00024",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 25,
    "destination": "Chandratal Lake",
    "name": "Moon Lake Camp Retreat",
    "price": 2800,
    "rating": 4.8,
    "contact": "+91 90000 00025",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 26,
    "destination": "Chandratal Lake",
    "name": "Highland Adventure Stay",
    "price": 3200,
    "rating": 4.7,
    "contact": "+91 90000 00026",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 27,
    "destination": "Chandratal Lake",
    "name": "Mountain Camp Lodge",
    "price": 2500,
    "rating": 4.6,
    "contact": "+91 90000 00027",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 28,
    "destination": "Haridwar",
    "name": "Ganga View Hotel",
    "price": 2300,
    "rating": 4.6,
    "contact": "+91 90000 00028",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 29,
    "destination": "Haridwar",
    "name": "Holy Ganga Retreat",
    "price": 2800,
    "rating": 4.7,
    "contact": "+91 90000 00029",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 30,
    "destination": "Haridwar",
    "name": "Har Ki Pauri Stay",
    "price": 2000,
    "rating": 4.5,
    "contact": "+91 90000 00030",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 31,
    "destination": "Rishikesh",
    "name": "Ganges Riverside Resort",
    "price": 3000,
    "rating": 4.8,
    "contact": "+91 90000 00031",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 32,
    "destination": "Rishikesh",
    "name": "Yoga Valley Retreat",
    "price": 2700,
    "rating": 4.7,
    "contact": "+91 90000 00032",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 33,
    "destination": "Rishikesh",
    "name": "River Adventure Inn",
    "price": 2200,
    "rating": 4.5,
    "contact": "+91 90000 00033",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 34,
    "destination": "Dehradun",
    "name": "Doon Valley Hotel",
    "price": 2500,
    "rating": 4.5,
    "contact": "+91 90000 00034",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 35,
    "destination": "Dehradun",
    "name": "Green Valley Retreat",
    "price": 2900,
    "rating": 4.7,
    "contact": "+91 90000 00035",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 36,
    "destination": "Dehradun",
    "name": "City Comfort Stay",
    "price": 2100,
    "rating": 4.4,
    "contact": "+91 90000 00036",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 37,
    "destination": "Mussoorie",
    "name": "Misty Mountain Resort",
    "price": 3200,
    "rating": 4.7,
    "contact": "+91 90000 00037",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 38,
    "destination": "Mussoorie",
    "name": "Mall Road Retreat",
    "price": 3600,
    "rating": 4.8,
    "contact": "+91 90000 00038",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 39,
    "destination": "Mussoorie",
    "name": "Valley View Inn",
    "price": 2700,
    "rating": 4.5,
    "contact": "+91 90000 00039",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 40,
    "destination": "Srinagar",
    "name": "Dal Lake Retreat",
    "price": 3200,
    "rating": 4.8,
    "contact": "+91 90000 00040",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 41,
    "destination": "Srinagar",
    "name": "Kashmir Valley Hotel",
    "price": 3800,
    "rating": 4.9,
    "contact": "+91 90000 00041",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 42,
    "destination": "Srinagar",
    "name": "Garden View Stay",
    "price": 2700,
    "rating": 4.6,
    "contact": "+91 90000 00042",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 43,
    "destination": "Gulmarg",
    "name": "Alpine Snow Resort",
    "price": 4500,
    "rating": 4.9,
    "contact": "+91 90000 00043",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 44,
    "destination": "Gulmarg",
    "name": "Gulmarg Mountain Lodge",
    "price": 3900,
    "rating": 4.8,
    "contact": "+91 90000 00044",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 45,
    "destination": "Gulmarg",
    "name": "Snow Valley Stay",
    "price": 3500,
    "rating": 4.6,
    "contact": "+91 90000 00045",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 46,
    "destination": "Pahalgam",
    "name": "Pine Valley Resort",
    "price": 3000,
    "rating": 4.7,
    "contact": "+91 90000 00046",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 47,
    "destination": "Pahalgam",
    "name": "Lidder River Retreat",
    "price": 3400,
    "rating": 4.8,
    "contact": "+91 90000 00047",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 48,
    "destination": "Pahalgam",
    "name": "Mountain Meadow Inn",
    "price": 2600,
    "rating": 4.5,
    "contact": "+91 90000 00048",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 49,
    "destination": "Digha",
    "name": "Sea Breeze Resort",
    "price": 2200,
    "rating": 4.5,
    "contact": "+91 90000 00049",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 50,
    "destination": "Digha",
    "name": "Coastal Comfort Hotel",
    "price": 2600,
    "rating": 4.6,
    "contact": "+91 90000 00050",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 51,
    "destination": "Digha",
    "name": "Beach View Retreat",
    "price": 3000,
    "rating": 4.7,
    "contact": "+91 90000 00051",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 52,
    "destination": "Darjeeling",
    "name": "Himalayan Tea Estate Stay",
    "price": 3500,
    "rating": 4.8,
    "contact": "+91 90000 00052",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 53,
    "destination": "Darjeeling",
    "name": "Kanchenjunga View Hotel",
    "price": 4000,
    "rating": 4.9,
    "contact": "+91 90000 00053",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 54,
    "destination": "Darjeeling",
    "name": "Mountain Mist Retreat",
    "price": 3000,
    "rating": 4.6,
    "contact": "+91 90000 00054",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 55,
    "destination": "Kolkata",
    "name": "Heritage City Hotel",
    "price": 3000,
    "rating": 4.6,
    "contact": "+91 90000 00055",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 56,
    "destination": "Kolkata",
    "name": "Royal Bengal Stay",
    "price": 3500,
    "rating": 4.7,
    "contact": "+91 90000 00056",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 57,
    "destination": "Kolkata",
    "name": "City Centre Retreat",
    "price": 2500,
    "rating": 4.5,
    "contact": "+91 90000 00057",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 58,
    "destination": "Puri",
    "name": "Golden Beach Resort",
    "price": 2800,
    "rating": 4.7,
    "contact": "+91 90000 00058",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 59,
    "destination": "Puri",
    "name": "Jagannath Heritage Stay",
    "price": 2500,
    "rating": 4.6,
    "contact": "+91 90000 00059",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 60,
    "destination": "Puri",
    "name": "Ocean View Hotel",
    "price": 3200,
    "rating": 4.8,
    "contact": "+91 90000 00060",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 61,
    "destination": "Bhubaneswar",
    "name": "Temple City Hotel",
    "price": 2600,
    "rating": 4.6,
    "contact": "+91 90000 00061",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 62,
    "destination": "Bhubaneswar",
    "name": "Heritage Comfort Stay",
    "price": 3000,
    "rating": 4.7,
    "contact": "+91 90000 00062",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 63,
    "destination": "Bhubaneswar",
    "name": "City View Retreat",
    "price": 2300,
    "rating": 4.5,
    "contact": "+91 90000 00063",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 64,
    "destination": "Konark",
    "name": "Sun Temple Retreat",
    "price": 2400,
    "rating": 4.6,
    "contact": "+91 90000 00064",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 65,
    "destination": "Konark",
    "name": "Coastal Heritage Hotel",
    "price": 2800,
    "rating": 4.7,
    "contact": "+91 90000 00065",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 66,
    "destination": "Konark",
    "name": "Konark Comfort Stay",
    "price": 2100,
    "rating": 4.5,
    "contact": "+91 90000 00066",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 67,
    "destination": "Shillong",
    "name": "Pine Hills Resort",
    "price": 2800,
    "rating": 4.7,
    "contact": "+91 90000 00067",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 68,
    "destination": "Shillong",
    "name": "Shillong Valley Hotel",
    "price": 3200,
    "rating": 4.8,
    "contact": "+91 90000 00068",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 69,
    "destination": "Shillong",
    "name": "Cloud View Retreat",
    "price": 2400,
    "rating": 4.5,
    "contact": "+91 90000 00069",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 70,
    "destination": "Mawlynnong Village",
    "name": "Green Village Retreat",
    "price": 2200,
    "rating": 4.7,
    "contact": "+91 90000 00070",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 71,
    "destination": "Mawlynnong Village",
    "name": "Nature View Homestay",
    "price": 1900,
    "rating": 4.6,
    "contact": "+91 90000 00071",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 72,
    "destination": "Mawlynnong Village",
    "name": "Village Garden Stay",
    "price": 2100,
    "rating": 4.5,
    "contact": "+91 90000 00072",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 73,
    "destination": "Dawki",
    "name": "Umngot River Retreat",
    "price": 2500,
    "rating": 4.7,
    "contact": "+91 90000 00073",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 74,
    "destination": "Dawki",
    "name": "River Valley Resort",
    "price": 2900,
    "rating": 4.8,
    "contact": "+91 90000 00074",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 75,
    "destination": "Dawki",
    "name": "Border Valley Stay",
    "price": 2200,
    "rating": 4.5,
    "contact": "+91 90000 00075",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 76,
    "destination": "Jaipur",
    "name": "Royal Heritage Hotel",
    "price": 2500,
    "rating": 4.5,
    "contact": "+91 90000 00076",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 77,
    "destination": "Jaipur",
    "name": "City Palace Stay",
    "price": 3200,
    "rating": 4.7,
    "contact": "+91 90000 00077",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 78,
    "destination": "Jaipur",
    "name": "Pink City Retreat",
    "price": 2800,
    "rating": 4.6,
    "contact": "+91 90000 00078",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 79,
    "destination": "Jaisalmer",
    "name": "Golden Fort Retreat",
    "price": 3000,
    "rating": 4.8,
    "contact": "+91 90000 00079",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 80,
    "destination": "Jaisalmer",
    "name": "Desert Heritage Hotel",
    "price": 3500,
    "rating": 4.9,
    "contact": "+91 90000 00080",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 81,
    "destination": "Jaisalmer",
    "name": "Golden Sand Resort",
    "price": 2700,
    "rating": 4.6,
    "contact": "+91 90000 00081",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 82,
    "destination": "Ajmer",
    "name": "Heritage Ajmer Hotel",
    "price": 2200,
    "rating": 4.5,
    "contact": "+91 90000 00082",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 83,
    "destination": "Ajmer",
    "name": "Dargah View Retreat",
    "price": 2500,
    "rating": 4.6,
    "contact": "+91 90000 00083",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 84,
    "destination": "Ajmer",
    "name": "Aravali Comfort Stay",
    "price": 2000,
    "rating": 4.4,
    "contact": "+91 90000 00084",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 85,
    "destination": "Delhi",
    "name": "Capital Heritage Hotel",
    "price": 3200,
    "rating": 4.7,
    "contact": "+91 90000 00085",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg"
  },
  {
    "id": 86,
    "destination": "Delhi",
    "name": "Central Delhi Stay",
    "price": 3800,
    "rating": 4.8,
    "contact": "+91 90000 00086",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE="
  },
  {
    "id": 87,
    "destination": "Delhi",
    "name": "City Comfort Hotel",
    "price": 2700,
    "rating": 4.5,
    "contact": "+91 90000 00087",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg"
  },
  {
    "id": 88,
    "destination": "Agra",
    "name": "Taj View Retreat",
    "price": 3000,
    "rating": 4.8,
    "contact": "+91 90000 00088",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg"
  },
  {
    "id": 89,
    "destination": "Agra",
    "name": "Mughal Heritage Hotel",
    "price": 3500,
    "rating": 4.9,
    "contact": "+91 90000 00089",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg"
  },
  {
    "id": 90,
    "destination": "Agra",
    "name": "Agra Palace Stay",
    "price": 2600,
    "rating": 4.6,
    "contact": "+91 90000 00090",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
  },
  {
    "id": 91,
    "destination": "Varanasi",
    "name": "Ganges Heritage Hotel",
    "price": 2800,
    "rating": 4.8,
    "contact": "+91 90000 00091",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress"
  },
  {
    "id": 92,
    "destination": "Varanasi",
    "name": "Ghat View Retreat",
    "price": 3200,
    "rating": 4.9,
    "contact": "+91 90000 00092",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1"
  },
  {
    "id": 93,
    "destination": "Varanasi",
    "name": "Spiritual City Stay",
    "price": 2400,
    "rating": 4.6,
    "contact": "+91 90000 00093",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp"
  },
  {
    "id": 94,
    "destination": "Manali",
    "name": "Old Manali Backpackers & Student Homestay",
    "price": 850,
    "rating": 4.8,
    "contact": "+91 98160 12345",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Free High-Speed Wi-Fi",
      "Shared Kitchen & Chai",
      "Bonfire Nights",
      "College ID 10% Off"
    ]
  },
  {
    "id": 95,
    "destination": "Shimla",
    "name": "Himalayan Pines Student Homestay & Dorms",
    "price": 950,
    "rating": 4.7,
    "contact": "+91 98170 54321",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Walking distance to Mall Road",
      "Room Heater",
      "Free Breakfast",
      "Study Desks"
    ]
  },
  {
    "id": 96,
    "destination": "Rishikesh",
    "name": "Ganga Flow Student Eco Homestay & Hostel",
    "price": 800,
    "rating": 4.9,
    "contact": "+91 94120 98765",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "River View Rooftop",
      "Yoga Hall Access",
      "Free Wi-Fi",
      "Rafting Group Passes"
    ]
  },
  {
    "id": 97,
    "destination": "Goa",
    "name": "Anjuna Coconut Grove Student Villa & Homestay",
    "price": 990,
    "rating": 4.8,
    "contact": "+91 98221 11223",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Scooter Rental Help",
      "5 min to Beach",
      "Community Kitchen",
      "Squad Dorms Available"
    ]
  },
  {
    "id": 98,
    "destination": "Jaipur",
    "name": "Pink City Heritage Student Homestay",
    "price": 900,
    "rating": 4.8,
    "contact": "+91 94140 22334",
    "image": "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Rooftop Cafe",
      "College ID Concessions",
      "Luggage Cloakroom",
      "Free Morning Chai"
    ]
  },
  {
    "id": 99,
    "destination": "Varanasi",
    "name": "Assi Ghat Travellers & Student Homestay",
    "price": 750,
    "rating": 4.9,
    "contact": "+91 94500 33445",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "2 min Walk to Assi Ghat",
      "Sunrise Boat Tour Discount",
      "Filtered Water & High-speed Wi-Fi"
    ]
  },
  {
    "id": 100,
    "destination": "Darjeeling",
    "name": "Kanchenjunga View Student Homestay & Cafe",
    "price": 1100,
    "rating": 4.8,
    "contact": "+91 98320 44556",
    "image": "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Valley View Balcony",
      "Home Cooked Meals",
      "Book Exchange Corner",
      "Campfire"
    ]
  },
  {
    "id": 101,
    "destination": "Kasol",
    "name": "Parvati Valley Youth & Student Haven Homestay",
    "price": 850,
    "rating": 4.8,
    "contact": "+91 98050 55667",
    "image": "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE=",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Trek Guides Desk",
      "Riverside Cafe",
      "Co-working Setup",
      "Group Dorm Discounts"
    ]
  },
  {
    "id": 102,
    "destination": "Udaipur",
    "name": "Lake Breeze Student Heritage Homestay",
    "price": 950,
    "rating": 4.7,
    "contact": "+91 98290 66778",
    "image": "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Lake Pichola Rooftop View",
      "Puppet Show Passes",
      "Cycle Rentals",
      "Home Cooked Thali"
    ]
  },
  {
    "id": 103,
    "destination": "Pondicherry",
    "name": "French Quarter Student Haven Homestay",
    "price": 1150,
    "rating": 4.8,
    "contact": "+91 98400 77889",
    "image": "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Complimentary Bicycle",
      "Promenade Beach 500m",
      "Community Hall",
      "Free Wi-Fi"
    ]
  },
  {
    "id": 104,
    "destination": "Ooty",
    "name": "Nilgiri Mist Student Farmstay & Homestay",
    "price": 1050,
    "rating": 4.7,
    "contact": "+91 94430 88990",
    "image": "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Tea Garden Walks",
      "Campfire & Music",
      "Shared Kitchen",
      "Board Games Lounge"
    ]
  },
  {
    "id": 105,
    "destination": "Agra",
    "name": "Taj View Youth & Student Homestay",
    "price": 850,
    "rating": 4.8,
    "contact": "+91 98370 99001",
    "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Taj Mahal East Gate 800m",
      "Rooftop Restaurant",
      "Secure Luggage Lockers"
    ]
  },
  {
    "id": 106,
    "destination": "Puri",
    "name": "Golden Sands Student Beach Homestay",
    "price": 900,
    "rating": 4.7,
    "contact": "+91 94370 11223",
    "image": "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Sea Facing Rooftop",
      "Temple Guidance",
      "Student Group Kitchen",
      "Free Wi-Fi"
    ]
  },
  {
    "id": 107,
    "destination": "Digha",
    "name": "Coastal Breeze Student Villa & Homestay",
    "price": 820,
    "rating": 4.6,
    "contact": "+91 98310 99887",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "3 min to Beach",
      "Fresh Seafood Kitchen",
      "Group Concession",
      "AC & Non-AC Dorms"
    ]
  },
  {
    "id": 108,
    "destination": "Leh Ladakh",
    "name": "Zostel Leh Backpacker & Student Hostel",
    "price": 799,
    "rating": 4.8,
    "contact": "+91 98160 55441",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Rooftop Cafe & Star Gazing",
      "Bike Rental Desk",
      "Oxygen Cylinder Facility",
      "Free High-Speed Wi-Fi"
    ]
  },
  {
    "id": 109,
    "destination": "Leh Ladakh",
    "name": "Stok View Ladakhi Student Homestay",
    "price": 650,
    "rating": 4.7,
    "contact": "+91 94191 78901",
    "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Organic Ladakhi Meals",
      "Traditional Bukhari Heating",
      "Local Trek Guides",
      "Shared Kitchen"
    ]
  },
  {
    "id": 110,
    "destination": "Leh Ladakh",
    "name": "Pangong Lakefront Glamping & Camp Stay",
    "price": 2400,
    "rating": 4.8,
    "contact": "+91 94192 11223",
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Direct Pangong Lake View",
      "Attached Heated Tents",
      "Buffet Dinner Included"
    ]
  },
  {
    "id": 111,
    "destination": "Leh Ladakh",
    "name": "The Grand Dragon Ladakh Luxury Resort",
    "price": 6500,
    "rating": 4.9,
    "contact": "+91 1982 255266",
    "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Central Heating",
      "Mountain View Balconies",
      "Airport Shuttle"
    ]
  },
  {
    "id": 112,
    "destination": "Goa",
    "name": "Vagator Beach Backpacker Hostel & Pool Stay",
    "price": 650,
    "rating": 4.8,
    "contact": "+91 98221 44556",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Swimming Pool",
      "Scooter Rental ₹300/day",
      "Free Beach Shuttle",
      "Game Lounge"
    ]
  },
  {
    "id": 113,
    "destination": "Goa",
    "name": "Calangute Youth Paradise Beach Resort",
    "price": 1800,
    "rating": 4.6,
    "contact": "+91 98220 77889",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": true,
    "studentPerks": [
      "200m to Beach",
      "Multi-Cuisine Seafood Shack",
      "Watersports Booking Desk"
    ]
  },
  {
    "id": 114,
    "destination": "Goa",
    "name": "Palolem Oceanview Eco Beach Huts",
    "price": 1400,
    "rating": 4.7,
    "contact": "+91 98223 99001",
    "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Beachfront Huts",
      "Kayak Rentals",
      "Sunset Yoga Sessions"
    ]
  },
  {
    "id": 115,
    "destination": "Kerala",
    "name": "Munnar Backpacker Tea Garden Homestay",
    "price": 580,
    "rating": 4.8,
    "contact": "+91 94471 22334",
    "image": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Tea Garden Trekking",
      "Campfire & Barbecue",
      "Homecooked Kerala Meals",
      "Shared Kitchen"
    ]
  },
  {
    "id": 116,
    "destination": "Kerala",
    "name": "Alleppey Backwaters Student Hostel & Dorms",
    "price": 650,
    "rating": 4.7,
    "contact": "+91 94472 88990",
    "image": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Canal-Facing Hammocks",
      "Canoe & Kayak Rentals",
      "Student Houseboat Sharing",
      "Bicycle Free"
    ]
  },
  {
    "id": 117,
    "destination": "Kerala",
    "name": "Fort Kochi Colonial Heritage Inn",
    "price": 1600,
    "rating": 4.7,
    "contact": "+91 94473 44556",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": true,
    "studentPerks": [
      "Walk to Chinese Fishing Nets",
      "Art Cafe",
      "Kathakali Ticket Discounts"
    ]
  },
  {
    "id": 118,
    "destination": "Kerala",
    "name": "Wayanad Rainforest Treehouse Eco Resort",
    "price": 2800,
    "rating": 4.9,
    "contact": "+91 94474 11223",
    "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Canopy Treehouses",
      "Bamboo Rafting",
      "Forest Night Walks"
    ]
  },
  {
    "id": 119,
    "destination": "Vizag",
    "name": "Rishikonda Beach Surfers & Student Hostel",
    "price": 520,
    "rating": 4.8,
    "contact": "+91 98480 33445",
    "image": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Direct Beach Access",
      "Surfboard & Kayak Rentals",
      "Beach Volleyball",
      "Free High-Speed Wi-Fi"
    ]
  },
  {
    "id": 120,
    "destination": "Vizag",
    "name": "Araku Valley Tribal Eco Camp & Homestay",
    "price": 680,
    "rating": 4.7,
    "contact": "+91 98481 99001",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Coffee Plantation Tents",
      "Campfire & Dhimsa Dance",
      "Borra Caves Student Pass"
    ]
  },
  {
    "id": 121,
    "destination": "Vizag",
    "name": "The Park Visakhapatnam Beach Resort",
    "price": 3600,
    "rating": 4.8,
    "contact": "+91 891 3045678",
    "image": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Private Beach Front",
      "Infinity Pool",
      "Oceanfront Dining"
    ]
  },
  {
    "id": 122,
    "destination": "Vizag",
    "name": "RK Beach Sea Breeze Inn",
    "price": 1300,
    "rating": 4.5,
    "contact": "+91 98482 11223",
    "image": "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": true,
    "studentPerks": [
      "Walk to Submarine Museum",
      "Seaview Balconies",
      "Near Vizag Railway Station"
    ]
  },
  {
    "id": 123,
    "destination": "Gujarat",
    "name": "Sabarmati Student & Youth Hostel Ahmedabad",
    "price": 480,
    "rating": 4.7,
    "contact": "+91 98250 22334",
    "image": "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "1 km to Gandhi Ashram",
      "Bicycle Sharing Station",
      "Student Reading Lounge",
      "Rooftop Gujarati Snacks"
    ]
  },
  {
    "id": 124,
    "destination": "Gujarat",
    "name": "White Rann Mud Bhunga Traditional Homestay",
    "price": 890,
    "rating": 4.8,
    "contact": "+91 98251 77889",
    "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Traditional Kutchi Bhunga Cottages",
      "Rann Utsav Cultural Nights",
      "Authentic Kathiyawadi Thali"
    ]
  },
  {
    "id": 125,
    "destination": "Gujarat",
    "name": "Statue of Unity Riverfront Tent City",
    "price": 2600,
    "rating": 4.8,
    "contact": "+91 98252 44556",
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": true,
    "studentPerks": [
      "View of 182m Statue",
      "Free Narmada River Ferry",
      "Valley of Flowers Shuttle"
    ]
  },
  {
    "id": 126,
    "destination": "Gujarat",
    "name": "Gir Lion Safari Jungle Eco Resort",
    "price": 2400,
    "rating": 4.7,
    "contact": "+91 98253 99001",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Jeep Safari Booking Desk",
      "Mango Orchard Surroundings",
      "Wildlife Film Screenings"
    ]
  },
  {
    "id": 127,
    "destination": "Punjab",
    "name": "Amritsar Golden Temple Student Backpacker Hostel",
    "price": 450,
    "rating": 4.9,
    "contact": "+91 98760 11223",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "300m to Golden Temple",
      "24/7 Free Langar Guidance",
      "Wagah Border Shared Cab Desk",
      "AC Dorms"
    ]
  },
  {
    "id": 128,
    "destination": "Punjab",
    "name": "Heritage Haveli Student & Youth Homestay",
    "price": 590,
    "rating": 4.8,
    "contact": "+91 98761 44556",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Authentic 19th-Century Punjabi Haveli",
      "Unlimited Amritsari Kulcha Breakfast",
      "Free Wi-Fi"
    ]
  },
  {
    "id": 129,
    "destination": "Punjab",
    "name": "Sadda Pind Cultural Village Heritage Resort",
    "price": 2200,
    "rating": 4.8,
    "contact": "+91 98762 77889",
    "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": true,
    "studentPerks": [
      "Free Cultural Entry Ticket",
      "Live Bhangra & Gidda",
      "Village Folk Crafts Workshop"
    ]
  },
  {
    "id": 130,
    "destination": "Punjab",
    "name": "Wagah Gateway Grand Highway Hotel",
    "price": 1600,
    "rating": 4.6,
    "contact": "+91 98763 99001",
    "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Express Route to Border Parade",
      "Patriotic Souvenir Shop",
      "Family Suites"
    ]
  },
  {
    "id": 131,
    "destination": "Udaipur",
    "name": "Lake Pichola Heritage Haveli Stay",
    "price": 2400,
    "rating": 4.8,
    "contact": "+91 94140 12345",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": true,
    "studentPerks": [
      "Rooftop Lake Pichola View",
      "Free Puppet Show Ticket",
      "Rooftop Mewari Thali"
    ]
  },
  {
    "id": 132,
    "destination": "Udaipur",
    "name": "The Oberoi Udaivilas Luxury Palace",
    "price": 18500,
    "rating": 4.9,
    "contact": "+91 94141 23456",
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Private Pool Courtyards",
      "Private Boat Transfer",
      "Mewar Royal Dining"
    ]
  },
  {
    "id": 133,
    "destination": "Ooty",
    "name": "Nilgiri Tea Garden Heritage Bungalow",
    "price": 2600,
    "rating": 4.8,
    "contact": "+91 94430 34567",
    "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Private Tea Estate Walk",
      "Fresh Cardamom Tea on Tap",
      "Cozy Fireplace"
    ]
  },
  {
    "id": 134,
    "destination": "Ooty",
    "name": "Sterling Ooty Fern Hill Resort",
    "price": 3400,
    "rating": 4.7,
    "contact": "+91 94431 45678",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Panoramic Mountain View",
      "Nilgiri Toy Train Booking Desk",
      "Campfire Nights"
    ]
  },
  {
    "id": 135,
    "destination": "Pondicherry",
    "name": "Maison Perumal French Heritage Boutique",
    "price": 2900,
    "rating": 4.8,
    "contact": "+91 94860 56789",
    "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": true,
    "studentPerks": [
      "French Quarter Location",
      "Complimentary Vintage Bicycle",
      "Croissant Breakfast"
    ]
  },
  {
    "id": 136,
    "destination": "Pondicherry",
    "name": "Promenade Seaside View Villa",
    "price": 3800,
    "rating": 4.9,
    "contact": "+91 94861 67890",
    "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Direct Rock Beach View",
      "Rooftop Lighthouse Lounge",
      "Seafood Grill"
    ]
  },
  {
    "id": 137,
    "destination": "Mumbai",
    "name": "The Taj Mahal Palace Colaba (Heritage Waterfront)",
    "price": 16500,
    "rating": 4.9,
    "contact": "+91 98200 78901",
    "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Historic Gateway of India View",
      "Luxury Sea Lounge",
      "24x7 Butler Service"
    ]
  },
  {
    "id": 138,
    "destination": "Mumbai",
    "name": "Marine Drive Bayview Hotel",
    "price": 4200,
    "rating": 4.7,
    "contact": "+91 98201 89012",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": true,
    "studentPerks": [
      "Queen's Necklace View",
      "Walking Distance to CST",
      "Free High-Speed Wi-Fi"
    ]
  },
  {
    "id": 139,
    "destination": "Mumbai",
    "name": "Bandra West Student & Youth Backpacker Hub",
    "price": 650,
    "rating": 4.8,
    "contact": "+91 98202 90123",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Near Bandstand & Cafes",
      "AC Dorms & Lockers",
      "Shared Co-Working Space"
    ]
  },
  {
    "id": 140,
    "destination": "Hampi",
    "name": "Vijayanagara Boulders Heritage Resort",
    "price": 3100,
    "rating": 4.8,
    "contact": "+91 94800 01234",
    "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Cottages in Granite Boulders",
      "Natural Stream Pool",
      "Guided Ruins Walk"
    ]
  },
  {
    "id": 141,
    "destination": "Hampi",
    "name": "Hampi Bazaar Riverview Student Homestay",
    "price": 550,
    "rating": 4.7,
    "contact": "+91 94801 12345",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "200m to Virupaksha Temple",
      "Rooftop Yoga & Sunset View",
      "Coracle Ride Assistance"
    ]
  },
  {
    "id": 142,
    "destination": "Andaman",
    "name": "Havelock Island Coral Reef Beach Resort",
    "price": 4500,
    "rating": 4.9,
    "contact": "+91 94342 23456",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "isHomestay": false,
    "studentRecommended": false,
    "studentPerks": [
      "Private White Sand Beach",
      "In-House PADI Scuba Dive Center",
      "Beachside Candlelight Dinner"
    ]
  },
  {
    "id": 143,
    "destination": "Andaman",
    "name": "Radhanagar Student Eco-Huts & Dive Homestay",
    "price": 750,
    "rating": 4.8,
    "contact": "+91 94343 34567",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    "isHomestay": true,
    "studentRecommended": true,
    "studentPerks": [
      "Walking Distance to Radhanagar Beach",
      "Free Snorkeling Gear Rental",
      "Fresh Island Coconut Water"
    ]
  }
];

export default hotels;
