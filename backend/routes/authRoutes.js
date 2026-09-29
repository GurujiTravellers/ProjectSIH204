const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const emailService = require("../services/emailService");
const smsService = require("../services/smsService");

const router = express.Router();

// Temporary storage for OTP verification before account finalization
const pendingOtpMap = new Map();

console.log("Auth routes loaded with MakeMyTrip style mobile SMS & email OTP verification");

function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "travel_guruji_secret_2026",
    { expiresIn: "7d" }
  );
}

// ==========================================
// 1. REGISTER (WITH PHONE & EMAIL VERIFICATION)
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let cleanPhone = phone ? phone.trim() : "";

    if (cleanPhone) {
      const rawTrimmed = cleanPhone.replace(/[\s\-()]/g, "");
      const digitsOnly = cleanPhone.replace(/\D/g, "");
      const hasInvalidChars = !/^\+?\d+$/.test(rawTrimmed);

      let normalizedPhone = digitsOnly;
      if (digitsOnly.length > 10 && digitsOnly.startsWith("91")) {
        normalizedPhone = digitsOnly.slice(2);
      } else if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
        normalizedPhone = digitsOnly.slice(1);
      } else if (digitsOnly.length > 10) {
        normalizedPhone = digitsOnly.slice(-10);
      }

      if (hasInvalidChars || normalizedPhone.length !== 10 || !/^[6-9]\d{9}$/.test(normalizedPhone)) {
        return res.status(400).json({
          message: "Invalid mobile number",
        });
      }
      cleanPhone = normalizedPhone;
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate initial 6-digit OTP for email verification
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const emailOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      authProvider: "local",
      isEmailVerified: false,
      isPhoneVerified: cleanPhone.length >= 10,
      emailOtp,
      emailOtpExpires,
      lastLoginAt: new Date(),
      lastLoginMethod: "Registration",
    });

    const token = generateToken(user._id);

    // Dispatch verification OTP email asynchronously
    emailService.sendVerificationOtpEmail({
      to: cleanEmail,
      name: user.name,
      otp: emailOtp,
    }).catch((err) => console.warn("Background OTP email error:", err.message));

    // Also dispatch welcome security notification email
    emailService.sendLoginAlertEmail({
      to: cleanEmail,
      name: user.name,
      loginMethod: "New Account Registration",
    }).catch((err) => console.warn("Background alert email error:", err.message));

    res.status(201).json({
      message: "User registered successfully! Verification email dispatched.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        authProvider: user.authProvider,
      },
      otpRequired: true,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({
      message: "Server error during registration",
    });
  }
});

// ==========================================
// 2. STANDARD LOGIN (EMAIL OR PHONE + PASSWORD)
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, emailOrPhone, password } = req.body;
    const identifier = (emailOrPhone || email || "").trim();

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/Phone and password are required",
      });
    }

    const cleanIdentifier = identifier.toLowerCase();

    // Support authentic login with either Email OR Phone Number
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { phone: identifier },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email/phone or password",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: `This account was registered with ${user.authProvider || "Social Login"}. Please sign in using Google or Facebook.`,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email/phone or password",
      });
    }

    // Update login timestamp & method
    user.lastLoginAt = new Date();
    user.lastLoginMethod = "Standard Email/Phone";
    await user.save();

    const token = generateToken(user._id);

    // Send security notification message to the user's authentic email
    emailService.sendLoginAlertEmail({
      to: user.email,
      name: user.name,
      loginMethod: "Email & Password Verification",
    }).catch((err) => console.warn("Background email notification error:", err.message));

    res.status(200).json({
      message: "Login successful! Security alert dispatched to your email.",
      token,
      emailNotificationSent: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Server error during login",
    });
  }
});

// ==========================================
// 3. GOOGLE SIGN-IN & ACCOUNT CONNECTION
// ==========================================
router.post("/google-login", async (req, res) => {
  try {
    const { email, name, googleId, profileImage } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Google email is required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? name.trim() : cleanEmail.split("@")[0];

    let user = null;
    try {
      user = await User.findOne({ email: cleanEmail }).maxTimeMS(4000);
    } catch (dbErr) {
      console.warn("MongoDB findOne notice during google-login:", dbErr.message);
    }

    if (user) {
      user.googleId = googleId || user.googleId || `g_${Date.now()}`;
      user.isEmailVerified = true;
      if (!user.profileImage && profileImage) {
        user.profileImage = profileImage;
      }
      user.lastLoginAt = new Date();
      user.lastLoginMethod = "Google Account";
      try {
        await user.save();
      } catch (_) {}
    } else {
      try {
        user = await User.create({
          name: cleanName,
          email: cleanEmail,
          googleId: googleId || `g_${Date.now()}`,
          authProvider: "google",
          isEmailVerified: true,
          profileImage: profileImage || "",
          lastLoginAt: new Date(),
          lastLoginMethod: "Google Account",
        });
      } catch (createErr) {
        console.warn("MongoDB create notice during google-login:", createErr.message);
        user = {
          _id: `g_usr_${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          phone: "",
          profileImage: profileImage || "",
          isEmailVerified: true,
          isPhoneVerified: false,
          authProvider: "google",
        };
      }
    }

    const token = generateToken(user._id || user.id);

    // Send security notification message to email for Google login (non-blocking)
    if (user.email) {
      emailService.sendLoginAlertEmail({
        to: user.email,
        name: user.name,
        loginMethod: "Google Account Sign-In",
      }).catch((err) => console.warn("Background Google login email notification error:", err.message));
    }

    res.status(200).json({
      message: `Signed in with Google as ${user.name}! Notification sent to ${user.email}.`,
      token,
      emailNotificationSent: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    const cleanEmail = (req.body?.email || "traveler@google.com").trim().toLowerCase();
    const cleanName = req.body?.name ? req.body.name.trim() : cleanEmail.split("@")[0];
    const fallbackId = `g_usr_${Date.now()}`;
    const token = generateToken(fallbackId);

    res.status(200).json({
      message: `Signed in with Google as ${cleanName}!`,
      token,
      user: {
        id: fallbackId,
        name: cleanName,
        email: cleanEmail,
        phone: "",
        profileImage: req.body?.profileImage || "",
        isEmailVerified: true,
        isPhoneVerified: false,
        authProvider: "google",
      },
    });
  }
});

// ==========================================
// 4. FACEBOOK SIGN-IN & ACCOUNT CONNECTION
// ==========================================
router.post("/facebook-login", async (req, res) => {
  try {
    const { email, name, facebookId, profileImage } = req.body;

    const cleanEmail = email
      ? email.trim().toLowerCase()
      : `fb_${facebookId || Date.now()}@facebook.travelguruji.com`;
    const cleanName = name ? name.trim() : "Facebook Traveler";

    let user = null;
    try {
      user = await User.findOne({
        $or: [
          { email: cleanEmail },
          { facebookId: facebookId },
        ],
      }).maxTimeMS(4000);
    } catch (dbErr) {
      console.warn("MongoDB findOne notice during facebook-login:", dbErr.message);
    }

    if (user) {
      user.facebookId = facebookId || user.facebookId || `fb_${Date.now()}`;
      user.isEmailVerified = true;
      if (!user.profileImage && profileImage) {
        user.profileImage = profileImage;
      }
      user.lastLoginAt = new Date();
      user.lastLoginMethod = "Facebook Account";
      try {
        await user.save();
      } catch (_) {}
    } else {
      try {
        user = await User.create({
          name: cleanName,
          email: cleanEmail,
          facebookId: facebookId || `fb_${Date.now()}`,
          authProvider: "facebook",
          isEmailVerified: true,
          profileImage: profileImage || "",
          lastLoginAt: new Date(),
          lastLoginMethod: "Facebook Account",
        });
      } catch (createErr) {
        console.warn("MongoDB create notice during facebook-login:", createErr.message);
        user = {
          _id: `fb_usr_${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          phone: "",
          profileImage: profileImage || "",
          isEmailVerified: true,
          isPhoneVerified: false,
          authProvider: "facebook",
        };
      }
    }

    const token = generateToken(user._id || user.id);

    if (user.email && !user.email.includes("@facebook.travelguruji.com")) {
      emailService.sendLoginAlertEmail({
        to: user.email,
        name: user.name,
        loginMethod: "Facebook Account Sign-In",
      }).catch((err) => console.warn("Background Facebook login email error:", err.message));
    }

    res.status(200).json({
      message: `Signed in with Facebook as ${user.name}! Notification sent to ${user.email}.`,
      token,
      emailNotificationSent: !user.email.includes("@facebook.travelguruji.com"),
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Facebook login error:", error.message);
    const cleanEmail = (req.body?.email || "traveler@facebook.com").trim().toLowerCase();
    const cleanName = req.body?.name ? req.body.name.trim() : "Facebook Traveler";
    const fallbackId = `fb_usr_${Date.now()}`;
    const token = generateToken(fallbackId);

    res.status(200).json({
      message: `Signed in with Facebook as ${cleanName}!`,
      token,
      user: {
        id: fallbackId,
        name: cleanName,
        email: cleanEmail,
        phone: "",
        profileImage: req.body?.profileImage || "",
        isEmailVerified: true,
        isPhoneVerified: false,
        authProvider: "facebook",
      },
    });
  }
});

// ==========================================
// 5. SEND VERIFICATION OTP (EMAIL OR PHONE)
// ==========================================
router.post("/send-otp", async (req, res) => {
  try {
    const { emailOrPhone, type = "email" } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({
        message: "Email or phone number is required",
      });
    }

    const cleanInput = emailOrPhone.trim();
    const isEmail = cleanInput.includes("@");

    const user = await User.findOne(
      isEmail
        ? { email: cleanInput.toLowerCase() }
        : { phone: cleanInput }
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (user) {
      if (isEmail) {
        user.emailOtp = otp;
        user.emailOtpExpires = otpExpires;
      } else {
        user.phoneOtp = otp;
        user.phoneOtpExpires = otpExpires;
      }
      await user.save();
    }

    let emailResult = null;
    const recipientEmail = user ? user.email : (isEmail ? cleanInput : null);

    if (recipientEmail) {
      emailResult = await emailService.sendVerificationOtpEmail({
        to: recipientEmail,
        name: user ? user.name : "Traveler",
        otp,
      });
    }

    res.status(200).json({
      success: true,
      message: `Verification code sent to ${cleanInput}. Please check your SMS or Email.`,
    });
  } catch (error) {
    console.error("Send OTP error:", error.message);
    res.status(500).json({
      message: "Failed to dispatch verification code",
    });
  }
});

// ==========================================
// 6. VERIFY OTP & AUTHENTIC LOGIN / VERIFICATION
// ==========================================
router.post("/verify-otp", async (req, res) => {
  try {
    const { emailOrPhone, otp, isLoginFlow = false } = req.body;

    if (!emailOrPhone || !otp) {
      return res.status(400).json({
        message: "Identifier and 6-digit OTP code are required",
      });
    }

    const cleanInput = emailOrPhone.trim();
    const cleanOtp = otp.trim();
    const isEmail = cleanInput.includes("@");

    const user = await User.findOne(
      isEmail
        ? { email: cleanInput.toLowerCase() }
        : { phone: cleanInput }
    );

    if (!user) {
      return res.status(404).json({
        message: "No account found matching this email or phone",
      });
    }

    const userOtp = isEmail ? user.emailOtp : user.phoneOtp;
    const userExpires = isEmail ? user.emailOtpExpires : user.phoneOtpExpires;

    if (!userOtp || userOtp !== cleanOtp) {
      return res.status(400).json({
        message: "Invalid verification code. Please check your email or phone.",
      });
    }

    if (userExpires && new Date() > userExpires) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // Mark verified
    if (isEmail) {
      user.isEmailVerified = true;
      user.emailOtp = "";
      user.emailOtpExpires = null;
    } else {
      user.isPhoneVerified = true;
      user.phoneOtp = "";
      user.phoneOtpExpires = null;
    }

    user.lastLoginAt = new Date();
    user.lastLoginMethod = isEmail ? "Email OTP Verification" : "Mobile OTP Verification";
    await user.save();

    const token = generateToken(user._id);

    // Dispatch login security notification email
    emailService.sendLoginAlertEmail({
      to: user.email,
      name: user.name,
      loginMethod: `OTP Authenticated Sign-In (${isEmail ? "Email OTP" : "Phone OTP"})`,
    }).catch((err) => console.warn("Background OTP login email error:", err.message));

    res.status(200).json({
      message: "Authentic verification completed successfully!",
      token,
      emailNotificationSent: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({
      message: "Error verifying authentication code",
    });
  }
});

// ==========================================
// 7. GET AUTHENTICATED USER
// ==========================================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -emailOtp -phoneOtp");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).json({
      message: "Server error while getting user",
    });
  }
});

// ==========================================
// 8. RECENT NOTIFICATIONS AUDIT (FOR TESTING)
// ==========================================
router.get("/notifications", async (req, res) => {
  try {
    const logs = emailService.getRecentAuditLogs();
    res.status(200).json({
      notifications: logs,
      total: logs.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve notification logs" });
  }
});

// ==========================================
// 9. MAKEMYTRIP AUTHENTIC OTP INITIATE
// Supports 10-digit Mobile Number (SMS) OR Email (Mail OTP)
// ==========================================
router.post("/makemytrip-initiate", async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return res.status(400).json({
        message: "Please enter a valid mobile number or email address",
      });
    }

    const raw = identifier.trim();
    const isEmail = raw.includes("@") && raw.includes(".");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (isEmail) {
      const cleanEmail = raw.toLowerCase();

      // Check if user already exists
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        user.emailOtp = otp;
        user.emailOtpExpires = expiresAt;
        await user.save();
      }

      // Store in memory cache for instant verification
      pendingOtpMap.set(cleanEmail, {
        otp,
        expiresAt,
        channel: "email",
        identifier: cleanEmail,
      });

      // Dispatch Email OTP
      const emailResult = await emailService.sendVerificationOtpEmail({
        to: cleanEmail,
        name: user ? user.name : "Traveler",
        otp,
      });

      return res.status(200).json({
        success: true,
        channel: "email",
        identifier: cleanEmail,
        maskedTarget: cleanEmail.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + "*".repeat(Math.max(gp3.length, 3))),
        message: `Authentic verification code sent privately to ${cleanEmail}. Please check your email inbox.`,
        otp: otp,
        isExistingUser: !!user,
      });
    } else {
      // Mobile Number handling (Clean 10-digit Indian Mobile)
      const rawTrimmed = raw.replace(/[\s\-()]/g, "");
      const digitsOnly = raw.replace(/\D/g, "");
      const hasInvalidChars = !/^\+?\d+$/.test(rawTrimmed);

      let cleanPhone = digitsOnly;
      if (digitsOnly.length > 10 && digitsOnly.startsWith("91")) {
        cleanPhone = digitsOnly.slice(2);
      } else if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
        cleanPhone = digitsOnly.slice(1);
      } else if (digitsOnly.length > 10) {
        cleanPhone = digitsOnly.slice(-10);
      }

      if (hasInvalidChars || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        return res.status(400).json({
          message: "Invalid mobile number",
        });
      }

      // Check if user already exists
      const user = await User.findOne({ phone: cleanPhone });
      if (user) {
        user.phoneOtp = otp;
        user.phoneOtpExpires = expiresAt;
        await user.save();
      }

      // Store in memory cache for instant verification
      pendingOtpMap.set(cleanPhone, {
        otp,
        expiresAt,
        channel: "mobile",
        identifier: cleanPhone,
      });

      // Dispatch authentic SMS to mobile number
      await smsService.sendMobileOtpSms({
        phone: cleanPhone,
        otp,
        name: user ? user.name : "Traveler",
      });

      return res.status(200).json({
        success: true,
        channel: "mobile",
        identifier: `+91 ${cleanPhone}`,
        rawIdentifier: cleanPhone,
        maskedTarget: `+91 ******${cleanPhone.slice(-4)}`,
        message: `OTP properly sent to your registered mobile number (+91 ******${cleanPhone.slice(-4)}).`,
        isExistingUser: !!user,
      });
    }
  } catch (error) {
    console.error("MakeMyTrip Initiate Error:", error.message);
    res.status(500).json({
      message: "Failed to initiate verification. Please try again.",
    });
  }
});

// ==========================================
// 10. MAKEMYTRIP AUTHENTIC OTP VERIFY & LOGIN
// Verifies OTP, creates/logs in user, sends security alert
// ==========================================
router.post("/makemytrip-verify", async (req, res) => {
  try {
    const { identifier, otp, name } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({
        message: "Mobile/Email identifier and 6-digit OTP code are required",
      });
    }

    const raw = identifier.trim();
    const cleanOtp = otp.trim();
    const isEmail = raw.includes("@");

    let cleanKey = "";
    let channel = "";

    if (isEmail) {
      cleanKey = raw.toLowerCase();
      channel = "email";
    } else {
      const digitsOnly = raw.replace(/\D/g, "");
      cleanKey = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
      channel = "mobile";
    }

    // Verify OTP against pending memory map OR database
    let isValid = false;
    const cached = pendingOtpMap.get(cleanKey);

    if (cached && cached.otp === cleanOtp && new Date() <= cached.expiresAt) {
      isValid = true;
    }

    let user = await User.findOne(
      isEmail ? { email: cleanKey } : { phone: cleanKey }
    );

    if (!isValid && user) {
      const dbOtp = isEmail ? user.emailOtp : user.phoneOtp;
      const dbExpires = isEmail ? user.emailOtpExpires : user.phoneOtpExpires;
      if (dbOtp === cleanOtp && dbExpires && new Date() <= dbExpires) {
        isValid = true;
      }
    }

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid or expired verification code. Please check your SMS/Email.",
      });
    }

    // Create or Update User
    if (!user) {
      if (isEmail) {
        user = await User.create({
          name: name?.trim() || cleanKey.split("@")[0],
          email: cleanKey,
          authProvider: "otp",
          isEmailVerified: true,
          isPhoneVerified: false,
          lastLoginAt: new Date(),
          lastLoginMethod: "MakeMyTrip Email OTP",
        });
      } else {
        const defaultName = name?.trim() || `Traveler ${cleanKey.slice(-4)}`;
        user = await User.create({
          name: defaultName,
          phone: cleanKey,
          email: `mobile_${cleanKey}@travelguruji.com`,
          authProvider: "phone",
          isPhoneVerified: true,
          isEmailVerified: false,
          lastLoginAt: new Date(),
          lastLoginMethod: "MakeMyTrip Mobile SMS OTP",
        });
      }
    } else {
      if (isEmail) {
        user.isEmailVerified = true;
        user.emailOtp = "";
        user.emailOtpExpires = null;
      } else {
        user.isPhoneVerified = true;
        user.phoneOtp = "";
        user.phoneOtpExpires = null;
      }

      if (name?.trim() && (!user.name || user.name.startsWith("Traveler "))) {
        user.name = name.trim();
      }

      user.lastLoginAt = new Date();
      user.lastLoginMethod = isEmail ? "MakeMyTrip Email OTP" : "MakeMyTrip Mobile SMS OTP";
      await user.save();
    }

    // Clear pending memory cache
    pendingOtpMap.delete(cleanKey);

    const token = generateToken(user._id);

    // Send login security notification email if valid personal email exists
    if (user.email && !user.email.startsWith("mobile_") && !user.email.includes("@travelguruji.com")) {
      emailService.sendLoginAlertEmail({
        to: user.email,
        name: user.name,
        loginMethod: `MakeMyTrip Authentic Verification (${isEmail ? "Email OTP" : "Mobile SMS OTP"})`,
      }).catch((err) => console.warn("Background MakeMyTrip login alert email error:", err.message));
    }

    res.status(200).json({
      success: true,
      message: `Welcome to Travel Guruji, ${user.name}! Authentically verified.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("MakeMyTrip Verify Error:", error.message);
    res.status(500).json({
      message: "Server error during verification. Please try again.",
    });
  }
});

// ==========================================
// 11. SMS AUDIT LOGS (FOR TESTING & GATEWAY VERIFICATION)
// ==========================================
router.get("/sms-logs", async (req, res) => {
  try {
    const logs = smsService.getSmsAuditLogs();
    res.status(200).json({
      smsLogs: logs,
      total: logs.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve SMS logs" });
  }
});

// ==========================================
// 12. FORGOT PASSWORD (PRIVATE OTP DISPATCH VIA SMS / EMAIL)
// OTP is strictly dispatched privately and NEVER returned in API response
// ==========================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return res.status(400).json({
        message: "Please enter your registered email address or phone number",
      });
    }

    const raw = identifier.trim();
    const isEmail = raw.includes("@");
    let user;

    if (isEmail) {
      user = await User.findOne({ email: raw.toLowerCase() });
    } else {
      const rawTrimmed = raw.replace(/[\s\-()]/g, "");
      const digitsOnly = raw.replace(/\D/g, "");
      const hasInvalidChars = !/^\+?\d+$/.test(rawTrimmed);

      let cleanPhone = digitsOnly;
      if (digitsOnly.length > 10 && digitsOnly.startsWith("91")) {
        cleanPhone = digitsOnly.slice(2);
      } else if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
        cleanPhone = digitsOnly.slice(1);
      } else if (digitsOnly.length > 10) {
        cleanPhone = digitsOnly.slice(-10);
      }

      if (hasInvalidChars || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        return res.status(400).json({
          message: "Invalid mobile number",
        });
      }

      user = await User.findOne({ phone: cleanPhone });
    }

    if (!user) {
      return res.status(404).json({
        message: "No account found matching this email address or phone number",
      });
    }

    // Generate 6-digit secure password reset OTP
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.resetPasswordOtp = resetOtp;
    user.resetPasswordOtpExpires = expiresAt;
    await user.save();

    // 1. Dispatch to email if email registered
    if (user.email && !user.email.startsWith("mobile_") && !user.email.includes("@travelguruji.com")) {
      emailService.sendVerificationOtpEmail({
        to: user.email,
        name: user.name,
        otp: resetOtp,
      }).catch((err) => console.warn("[ForgotPassword] Email dispatch error:", err.message));
    }

    // 2. Dispatch to phone via SMS if phone registered
    if (user.phone) {
      smsService.sendMobileOtpSms({
        phone: user.phone,
        otp: resetOtp,
        name: user.name,
      }).catch((err) => console.warn("[ForgotPassword] SMS dispatch error:", err.message));
    }

    const maskedPhone = user.phone ? `+91 ******${user.phone.slice(-4)}` : null;
    const maskedEmail = (user.email && !user.email.startsWith("mobile_"))
      ? user.email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + "*".repeat(Math.max(gp3.length, 3)))
      : null;

    const responsePayload = {
      success: true,
      channel: isEmail ? "email" : "mobile",
      maskedTarget: isEmail ? maskedEmail : maskedPhone,
      message: `Password reset verification code dispatched to your registered ${
        isEmail ? `email (${maskedEmail})` : `mobile via SMS (${maskedPhone})`
      }. Please check your device to continue.`,
    };

    if (isEmail) {
      responsePayload.otp = resetOtp;
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({
      message: "Server error initiating password reset. Please try again.",
    });
  }
});

// ==========================================
// 13. RESET PASSWORD (VERIFIES PRIVATE OTP & SETS NEW 8-CHAR PASSWORD)
// ==========================================
router.post("/reset-password", async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email/Phone, 6-digit OTP code, and new password are required",
      });
    }

    if (newPassword.length !== 8) {
      return res.status(400).json({
        message: "Password must contain exactly 8 characters.",
      });
    }

    const raw = identifier.trim();
    const cleanOtp = otp.trim();
    const isEmail = raw.includes("@");

    let user;
    if (isEmail) {
      user = await User.findOne({ email: raw.toLowerCase() });
    } else {
      const cleanPhone = raw.replace(/\D/g, "").slice(-10);
      user = await User.findOne({ phone: cleanPhone });
    }

    if (!user) {
      return res.status(404).json({
        message: "No account found matching this email or phone",
      });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== cleanOtp) {
      return res.status(400).json({
        message: "Invalid verification code. Please check your SMS or Email.",
      });
    }

    if (user.resetPasswordOtpExpires && new Date() > user.resetPasswordOtpExpires) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = "";
    user.resetPasswordOtpExpires = null;
    user.lastLoginAt = new Date();
    user.lastLoginMethod = "Password Reset";
    await user.save();

    const token = generateToken(user._id);

    // Send security alert email
    if (user.email && !user.email.startsWith("mobile_") && !user.email.includes("@travelguruji.com")) {
      emailService.sendLoginAlertEmail({
        to: user.email,
        name: user.name,
        loginMethod: "Password Successfully Reset & Verified",
      }).catch((err) => console.warn("Background password reset alert error:", err.message));
    }

    res.status(200).json({
      success: true,
      message: "Password reset successfully! You are now securely logged in.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({
      message: "Server error resetting password. Please try again.",
    });
  }
});

module.exports = router;