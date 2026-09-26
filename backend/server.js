const express = require("express");
const cors = require("cors");
const path = require("path");
const os = require("os");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const travelPlanRoutes = require("./routes/travelPlanRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const transportRoutes = require("./routes/transportRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");

const app = express();

const PORT =
  process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(
  express.json({
    limit: "15mb",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/plans", travelPlanRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/emergency", emergencyRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Travel_Guruji Backend",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// SERVE FRONTEND (PRODUCTION / DEPLOYMENT)
// ==========================================
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Fallback all non-API GET routes to React SPA index.html
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    const indexPath = path.join(distPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(200).send("Travel Guruji API is running. Build the frontend with 'npm run build' to display the web application.");
      }
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  const interfaces = os.networkInterfaces();
  const lanIps = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        lanIps.push(net.address);
      }
    }
  }

  console.log(`\n==================================================`);
  console.log(`🚀 Travel Guruji Backend running on port ${PORT}`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  lanIps.forEach((ip) => {
    console.log(`   - Network: http://${ip}:${PORT}`);
  });
  console.log(`==================================================\n`);
});