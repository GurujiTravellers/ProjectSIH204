import fs from 'fs';
import path from 'path';
import hotels from '../src/data/hotels.js';

const newHotels = [
  // --- Udaipur ---
  {
    destination: "Udaipur",
    name: "Lake Pichola Heritage Haveli Stay",
    price: 2400,
    rating: 4.8,
    contact: "+91 94140 12345",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    isHomestay: false,
    studentRecommended: true,
    studentPerks: ["Rooftop Lake Pichola View", "Free Puppet Show Ticket", "Rooftop Mewari Thali"],
  },
  {
    destination: "Udaipur",
    name: "The Oberoi Udaivilas Luxury Palace",
    price: 18500,
    rating: 4.9,
    contact: "+91 94141 23456",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    isHomestay: false,
    studentRecommended: false,
    studentPerks: ["Private Pool Courtyards", "Private Boat Transfer", "Mewar Royal Dining"],
  },

  // --- Ooty ---
  {
    destination: "Ooty",
    name: "Nilgiri Tea Garden Heritage Bungalow",
    price: 2600,
    rating: 4.8,
    contact: "+91 94430 34567",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    isHomestay: true,
    studentRecommended: true,
    studentPerks: ["Private Tea Estate Walk", "Fresh Cardamom Tea on Tap", "Cozy Fireplace"],
  },
  {
    destination: "Ooty",
    name: "Sterling Ooty Fern Hill Resort",
    price: 3400,
    rating: 4.7,
    contact: "+91 94431 45678",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    isHomestay: false,
    studentRecommended: false,
    studentPerks: ["Panoramic Mountain View", "Nilgiri Toy Train Booking Desk", "Campfire Nights"],
  },

  // --- Pondicherry ---
  {
    destination: "Pondicherry",
    name: "Maison Perumal French Heritage Boutique",
    price: 2900,
    rating: 4.8,
    contact: "+91 94860 56789",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    isHomestay: false,
    studentRecommended: true,
    studentPerks: ["French Quarter Location", "Complimentary Vintage Bicycle", "Croissant Breakfast"],
  },
  {
    destination: "Pondicherry",
    name: "Promenade Seaside View Villa",
    price: 3800,
    rating: 4.9,
    contact: "+91 94861 67890",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    isHomestay: false,
    studentRecommended: false,
    studentPerks: ["Direct Rock Beach View", "Rooftop Lighthouse Lounge", "Seafood Grill"],
  },

  // --- Mumbai ---
  {
    destination: "Mumbai",
    name: "The Taj Mahal Palace Colaba (Heritage Waterfront)",
    price: 16500,
    rating: 4.9,
    contact: "+91 98200 78901",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    isHomestay: false,
    studentRecommended: false,
    studentPerks: ["Historic Gateway of India View", "Luxury Sea Lounge", "24x7 Butler Service"],
  },
  {
    destination: "Mumbai",
    name: "Marine Drive Bayview Hotel",
    price: 4200,
    rating: 4.7,
    contact: "+91 98201 89012",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    isHomestay: false,
    studentRecommended: true,
    studentPerks: ["Queen's Necklace View", "Walking Distance to CST", "Free High-Speed Wi-Fi"],
  },
  {
    destination: "Mumbai",
    name: "Bandra West Student & Youth Backpacker Hub",
    price: 650,
    rating: 4.8,
    contact: "+91 98202 90123",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    isHomestay: true,
    studentRecommended: true,
    studentPerks: ["Near Bandstand & Cafes", "AC Dorms & Lockers", "Shared Co-Working Space"],
  },

  // --- Hampi ---
  {
    destination: "Hampi",
    name: "Vijayanagara Boulders Heritage Resort",
    price: 3100,
    rating: 4.8,
    contact: "+91 94800 01234",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    isHomestay: false,
    studentRecommended: false,
    studentPerks: ["Cottages in Granite Boulders", "Natural Stream Pool", "Guided Ruins Walk"],
  },
  {
    destination: "Hampi",
    name: "Hampi Bazaar Riverview Student Homestay",
    price: 550,
    rating: 4.7,
    contact: "+91 94801 12345",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    isHomestay: true,
    studentRecommended: true,
    studentPerks: ["200m to Virupaksha Temple", "Rooftop Yoga & Sunset View", "Coracle Ride Assistance"],
  },

  // --- Andaman ---
  {
    destination: "Andaman",
    name: "Havelock Island Coral Reef Beach Resort",
    price: 4500,
    rating: 4.9,
    contact: "+91 94342 23456",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    isHomestay: false,
    studentRecommended: false,
    studentPerks: ["Private White Sand Beach", "In-House PADI Scuba Dive Center", "Beachside Candlelight Dinner"],
  },
  {
    destination: "Andaman",
    name: "Radhanagar Student Eco-Huts & Dive Homestay",
    price: 750,
    rating: 4.8,
    contact: "+91 94343 34567",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    isHomestay: true,
    studentRecommended: true,
    studentPerks: ["Walking Distance to Radhanagar Beach", "Free Snorkeling Gear Rental", "Fresh Island Coconut Water"],
  },
];

let nextId = Math.max(...hotels.map(h => h.id || 0)) + 1;

for (const h of newHotels) {
  hotels.push({
    id: nextId++,
    ...h
  });
}

// Format hotel file
const fileContent = `const hotelImages = [
  "https://media.assettype.com/robbreportindia%2F2026-02-17%2Fnkb7b8h4%2F2026_01_19T11_3A09_3A19_866Z_Chanel_20_286_29.jpg?w=640&auto=format%2Ccompress",
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f7/12/82/radisson-hotel-shimla.jpg?w=1200&h=-1&s=1",
  "https://img.jagranjosh.com/images/2025/09/05/article/image/taj-hotel-1757047376483.webp",
  "https://media-cdn.tripadvisor.com/media/photo-s/2a/a9/1a/66/swimming-pool.jpg",
  "https://media.istockphoto.com/id/106393587/photo/luxury-hotel.jpg?s=612x612&w=0&k=20&c=vbt66vTRaL4Dn-ZDHo_28jAg6rFon8Ezv5Ad9CtHppE=",
  "https://www.tourmyindia.com/blog//wp-content/uploads/2018/06/Hotels-in-India.jpg",
  "https://www.indianholiday.com/wordpress/wp-content/uploads/2025/06/the-oberoi-udaivilas.jpg",
  "https://www.experiencetravelgroup.com/wp-content/uploads/2025/06/Taj-Rambagh-Palace-India.jpg",
  "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1726/GOAGH-P027-Hotel-Facade.jpg/GOAGH-P027-Hotel-Facade.4x3.jpg"
];\n\nconst hotels = ${JSON.stringify(hotels, null, 2)};\n\nexport default hotels;\n`;

fs.writeFileSync(path.resolve('src/data/hotels.js'), fileContent, 'utf-8');
console.log(`Successfully updated hotels.js! Total hotels count: ${hotels.length}`);

