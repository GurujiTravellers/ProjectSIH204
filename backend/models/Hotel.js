const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    hotelId: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      default: 0,
    },

    pricePerNight: {
      type: Number,
      default: 0,
    },

    studentRecommended: {
      type: Boolean,
      default: false,
    },

    studentPerks: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model(
  "Hotel",
  hotelSchema
);

module.exports = Hotel;