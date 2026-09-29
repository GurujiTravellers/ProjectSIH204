const mongoose = require("mongoose");

// Disable buffering globally so requests never hang when connection is pending or offline
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://apcfriend123_db_user:Sounava2005@travelguruji.2lvhyea.mongodb.net/?appName=TravelGuruji";

    if (!uri) {
      console.warn("MONGODB_URI is not configured. Running in offline resilient mode.");
      return;
    }

    await mongoose.connect(uri, {
      dbName: "TravelGuruji",
      family: 4,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection notice (resilient mode active):", error.message);
  }
};

module.exports = connectDB;