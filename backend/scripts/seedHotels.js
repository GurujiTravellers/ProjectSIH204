const fs = require("fs");
const path = require("path");
const vm = require("vm");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const Hotel = require("../models/Hotel");

const dataFilePath = path.join(
  __dirname,
  "../../src/data/hotels.js"
);

const fileContent = fs.readFileSync(
  dataFilePath,
  "utf8"
);

/*
 * Read hotelImages array
 */
const imagesStart =
  fileContent.indexOf("const hotelImages = [");

const imagesEnd =
  fileContent.indexOf("];", imagesStart);

if (
  imagesStart === -1 ||
  imagesEnd === -1
) {
  throw new Error(
    "Could not find hotelImages array"
  );
}

const imagesCode = fileContent.slice(
  imagesStart + "const hotelImages = ".length,
  imagesEnd + 1
);

/*
 * Convert hotelImages into normal array
 */
const hotelImages =
  vm.runInNewContext(
    `(${imagesCode})`
  );

/*
 * Read hotels array
 */
const hotelsStart =
  fileContent.indexOf("const hotels = [");

const hotelsEnd =
  fileContent.indexOf("];", hotelsStart);

if (
  hotelsStart === -1 ||
  hotelsEnd === -1
) {
  throw new Error(
    "Could not find hotels array"
  );
}

const hotelsCode = fileContent.slice(
  hotelsStart + "const hotels = ".length,
  hotelsEnd + 1
);

/*
 * Convert hotels array into normal JavaScript data
 *
 * hotelImages is provided to the VM because
 * hotels.js uses values such as hotelImages[0].
 */
const hotels =
  vm.runInNewContext(
    `(${hotelsCode})`,
    {
      hotelImages,
    }
  );

/*
 * Seed hotels into MongoDB
 */
async function seedHotels() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName: "TravelGuruji",
      }
    );

    console.log(
      "MongoDB connected successfully"
    );

    /*
     * Remove old hotel data
     */
    await Hotel.deleteMany({});

    console.log(
      "Old hotel data removed"
    );

    /*
     * Convert frontend hotel structure
     * into MongoDB structure
     */
    const hotelData = hotels.map(
      (hotel) => ({
        hotelId: hotel.id,
        name: hotel.name,
        destination: hotel.destination,
        contact: hotel.contact || "",
        location: hotel.location || "",
        description: hotel.description || "",
        image: hotel.image || "",
        images: hotel.images || (hotel.image ? [hotel.image] : []),
        rating: hotel.rating || 0,
        price: hotel.price || hotel.pricePerNight || 0,
        pricePerNight: hotel.pricePerNight || hotel.price || 0,
        studentRecommended: Boolean(hotel.studentRecommended),
        studentPerks: Array.isArray(hotel.studentPerks) ? hotel.studentPerks : [],
        amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
      })
    );

    /*
     * Insert all hotels
     */
    const inserted =
      await Hotel.insertMany(
        hotelData
      );

    console.log(
      `${inserted.length} hotels inserted successfully`
    );

    /*
     * Close MongoDB connection
     */
    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Hotel seed error:",
      error.message
    );

    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedHotels();