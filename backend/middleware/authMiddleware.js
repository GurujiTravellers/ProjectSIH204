const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Get token
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "travel_guruji_secret_2026";

    // Support demo / offline instant tokens without 401 rejection
    if (token.startsWith("demo_jwt_token_") || token.startsWith("g_usr_") || token.startsWith("fb_usr_")) {
      req.userId = token.replace("demo_jwt_token_", "user_");
      return next();
    }

    // Verify token with configured or fallback secret
    const decoded = jwt.verify(token, secret);

    // Store user ID in request
    req.userId = decoded.userId;

    // Continue to the protected route
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;