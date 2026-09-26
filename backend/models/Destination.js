const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      default: null,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);


const destinationSchema = new mongoose.Schema(
  {
    destinationId: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
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

    bestTime: {
      type: String,
      default: "",
    },

    attractions: {
      type: [attractionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


const Destination = mongoose.model(
  "Destination",
  destinationSchema
);

module.exports = Destination;