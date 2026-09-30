const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.warn("MONGODB_URI is not configured. Running in offline resilient mode.");
      return;
    }

    await mongoose.connect(uri, {
      dbName: "TravelGuruji",
      family: 4,
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection notice (resilient mode active):", error.message);
  }
};

module.exports = connectDB;