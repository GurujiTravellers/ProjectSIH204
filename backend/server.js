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
const { startRealtimeSyncScheduler } = require("./services/realtimeWeatherSyncService");

const app = express();

const PORT =
  process.env.PORT || 5000;

connectDB();
// Start automated background synchronization for real-time weather & natural disaster database
startRealtimeSyncScheduler();

// CORS Configuration - Environment Aware & Production Hardened
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL.trim())) {
  allowedOrigins.push(process.env.CLIENT_URL.trim());
}
if (process.env.CLIENT_ORIGIN && !allowedOrigins.includes(process.env.CLIENT_ORIGIN.trim())) {
  allowedOrigins.push(process.env.CLIENT_ORIGIN.trim());
}

const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // In local development, permit localhost, 127.0.0.1, and private LAN IPs
      if (!isProduction) {
        return callback(null, true);
      }

      // In production, strictly match configured allowed origins if specified
      if (allowedOrigins.length > 0) {
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("CORS policy does not allow access from the specified origin."), false);
      }

      // Default safe fallback if allowedOrigins is not explicitly set in production
      return callback(null, true);
    },
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

// Fallback all non-API GET routes to React SPA index.html (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    const indexPath = path.join(distPath, "index.html");
    return res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(200).send("Travel Guruji API is running. Build the frontend with 'npm run build' to display the web application.");
      }
    });
  }
  next();
});

// Global Express Error Handler (Production-hardened, no stack trace or internal leak)
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  // Sanitize message: avoid leaking internal system details in production 500s
  let safeMessage = err.message || "An unexpected server error occurred";
  if (isProd && statusCode === 500) {
    safeMessage = "Internal Server Error";
  }

  // Safe error logging without sensitive data
  console.error(`[Error] [${req.method}] ${req.originalUrl} - Status ${statusCode}: ${safeMessage}`);

  res.status(statusCode).json({
    success: false,
    error: safeMessage,
    ...(isProd ? {} : { stack: err.stack }),
  });
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