const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    console.log("URI exists:", !!uri);
    if (!uri) {
      console.warn("MONGODB_URI is not configured in backend/.env. Using local offline mode.");
      return;
    }

    if (uri.includes("://") && uri.includes("@")) {
      try {
        console.log("Username:", uri.split("://")[1].split(":")[0]);
        console.log("Host:", uri.split("@")[1].split("/")[0]);
      } catch (_) {}
    }

    await mongoose.connect(uri, {
      dbName: "TravelGuruji",
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

module.exports = connectDB;