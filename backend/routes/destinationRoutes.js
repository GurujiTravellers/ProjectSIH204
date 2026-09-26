const express = require("express");
const Destination = require("../models/Destination");

const router = express.Router();

console.log("Destination routes loaded");


router.get("/", async (req, res) => {
  try {
    const {
      search,
      state,
      category,
    } = req.query;

    const filter = {};
    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      filter.$or = [
        { name: searchRegex },
        { state: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ];
    }

    
    if (state && state.trim()) {
      filter.state = new RegExp(
        `^${state.trim()}$`,
        "i"
      );
    }

    
    if (category && category.trim()) {
      filter.category = new RegExp(
        category.trim(),
        "i"
      );
    }

    const destinations =
      await Destination.find(filter)
        .sort({ destinationId: 1 });

    res.status(200).json({
      count: destinations.length,
      destinations,
    });

  } catch (error) {
    console.error(
      "Get destinations error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while getting destinations",
    });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const destinationId =
      Number(req.params.id);

    if (Number.isNaN(destinationId)) {
      return res.status(400).json({
        message:
          "Destination ID must be a number",
      });
    }

    const destination =
      await Destination.findOne({
        destinationId,
      });

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.status(200).json({
      destination,
    });

  } catch (error) {
    console.error(
      "Get destination error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while getting destination",
    });
  }
});


module.exports = router;