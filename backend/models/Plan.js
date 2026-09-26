const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planType: {
      type: String,
      enum: ["Full", "Student"],
      required: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    origin: {
      type: String,
      default: "",
      trim: true,
    },
    startDate: {
      type: String,
      default: "",
      trim: true,
    },
    endDate: {
      type: String,
      default: "",
      trim: true,
    },
    hotel: {
      type: String,
      default: "",
      trim: true,
    },
    persons: {
      type: Number,
      default: 1,
      min: 1,
    },
    adults: {
      type: Number,
      default: 1,
      min: 1,
    },
    children: {
      type: Number,
      default: 0,
      min: 0,
    },
    days: {
      type: Number,
      default: 1,
      min: 1,
    },
    budget: {
      type: Number,
      default: 0,
      min: 0,
    },
    tripType: {
      type: String,
      default: "Friends",
      trim: true,
    },
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    itinerary: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    costBreakdown: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    studentCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    localExperiences: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    status: {
      type: String,
      enum: ["Confirmed"],
      default: "Confirmed",
    },
    confirmedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
