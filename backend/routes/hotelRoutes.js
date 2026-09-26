const express = require("express");
const Hotel = require("../models/Hotel");

const router = express.Router();

console.log("Hotel routes loaded");

// GET ALL HOTELS
router.get("/", async (req, res) => {
  try {
    const {
      search,
      destination,
    } = req.query;

    const filter = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      filter.$or = [
        { name: searchRegex },
        { destination: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }

    if (
      destination &&
      destination.trim()
    ) {
      filter.destination = new RegExp(
        `^${destination.trim()}$`,
        "i"
      );
    }

    const hotels = await Hotel.find(filter)
      .sort({ hotelId: 1 });

    res.status(200).json({
      count: hotels.length,
      hotels,
    });
  } catch (error) {
    console.error(
      "Get hotels error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while getting hotels",
    });
  }
});

// GET SINGLE HOTEL
router.get("/:id", async (req, res) => {
  try {
    const hotelId = Number(
      req.params.id
    );

    if (Number.isNaN(hotelId)) {
      return res.status(400).json({
        message:
          "Hotel ID must be a number",
      });
    }

    const hotel = await Hotel.findOne({
      hotelId,
    });

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.status(200).json({
      hotel,
    });
  } catch (error) {
    console.error(
      "Get hotel error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while getting hotel",
    });
  }
});

module.exports = router;