const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

console.log("Profile routes loaded");

// GET PROFILE
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    res.status(500).json({
      message: "Server error while getting profile",
    });
  }
});


// UPDATE PROFILE
router.put("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bio,
      profileImage,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Check whether another user already uses this email
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.userId },
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          "This email is already used by another account",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update user information
    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    user.phone = phone || "";
    user.bio = bio || "";

    // Save profile photo
    if (typeof profileImage === "string") {
      user.profileImage = profileImage;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.error(
      "Update profile error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
});


module.exports = router;