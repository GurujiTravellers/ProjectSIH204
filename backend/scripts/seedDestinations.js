const fs = require("fs");
const path = require("path");
const vm = require("vm");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const mongoose = require("mongoose");

const Destination = require(
  "../models/Destination"
);


// ==========================================
// READ FRONTEND DESTINATION DATA
// ==========================================

const dataFilePath = path.join(
  __dirname,
  "../../src/data/destinations.js"
);

const fileContent = fs.readFileSync(
  dataFilePath,
  "utf8"
);


// Get only the array part
const startIndex =
  fileContent.indexOf("const destinations = [");

const endIndex =
  fileContent.lastIndexOf("];");

if (startIndex === -1 || endIndex === -1) {
  throw new Error(
    "Could not find destinations array"
  );
}

let arrayCode = fileContent.slice(
  startIndex +
    "const destinations = ".length,
  endIndex + 1
);


// Some image URLs in the frontend file
// may use url("...").
// Convert url("...") to "...".
arrayCode = arrayCode.replace(
  /url\(/g,
  "("
);


// Convert JavaScript array into real data
const destinations =
  vm.runInNewContext(
    `(${arrayCode})`
  );


// ==========================================
// CONNECT MONGODB
// ==========================================

async function seedDestinations() {
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


    // Remove old destination data
    await Destination.deleteMany({});

    console.log(
      "Old destination data removed"
    );


    // Convert frontend IDs into
    // database destinationId
    const destinationData =
      destinations.map((destination) => ({
        destinationId: destination.id,
        name: destination.name,
        state: destination.state,
        category: destination.category,
        description:
          destination.description || "",
        image:
          destination.image || "",
        images:
          destination.images || [],
        rating:
          destination.rating || 0,
        bestTime:
          destination.bestTime || "",
        attractions:
          destination.attractions || [],
      }));


    // Insert all destinations
    const inserted =
      await Destination.insertMany(
        destinationData
      );


    console.log(
      `${inserted.length} destinations inserted successfully`
    );


    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed"
    );

    process.exit(0);

  } catch (error) {
    console.error(
      "Destination seed error:",
      error.message
    );

    await mongoose.connection.close();

    process.exit(1);
  }
}


seedDestinations();