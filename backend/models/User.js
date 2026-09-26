const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    profileImage: {
      type: String,
      default: "",
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "phone", "otp"],
      default: "local",
    },

    googleId: {
      type: String,
      default: "",
    },

    facebookId: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: {
      type: String,
      default: "",
    },

    emailOtpExpires: {
      type: Date,
      default: null,
    },

    phoneOtp: {
      type: String,
      default: "",
    },

    phoneOtpExpires: {
      type: Date,
      default: null,
    },

    resetPasswordOtp: {
      type: String,
      default: "",
    },

    resetPasswordOtpExpires: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: Date.now,
    },

    lastLoginMethod: {
      type: String,
      default: "local",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;