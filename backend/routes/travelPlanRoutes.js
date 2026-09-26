const express = require("express");
const Plan = require("../models/Plan");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Save a confirmed plan for the logged-in user.
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      planType,
      destination,
      origin,
      startDate,
      endDate,
      hotel,
      persons,
      adults,
      children,
      days,
      budget,
      tripType,
      preferences,
      itinerary,
      costBreakdown,
      studentCost,
      localExperiences,
    } = req.body;

    if (!destination) {
      return res.status(400).json({
        message: "Destination is required",
      });
    }

    if (!planType || !["Full", "Student"].includes(planType)) {
      return res.status(400).json({
        message: "Plan type must be Full or Student",
      });
    }

    const calculatedPersons =
      Number(persons) || (Number(adults || 0) + Number(children || 0)) || 1;

    const plan = await Plan.create({
      userId: req.userId,
      planType,
      destination,
      origin: origin || "",
      startDate: startDate || "",
      endDate: endDate || "",
      hotel: hotel || "",
      persons: calculatedPersons,
      adults: Number(adults) || calculatedPersons,
      children: Number(children) || 0,
      days: Number(days) || 1,
      budget: Number(budget) || 0,
      tripType: tripType || "Friends",
      preferences: preferences || {},
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      costBreakdown: costBreakdown || {},
      studentCost: Number(studentCost) || 0,
      localExperiences: Array.isArray(localExperiences)
        ? localExperiences
        : [],
      status: "Confirmed",
    });

    return res.status(201).json({
      message: "Plan saved successfully",
      plan,
    });
  } catch (error) {
    console.error("Plan save error:", error);
    return res.status(500).json({
      message: "Could not save plan",
    });
  }
});

// Get all confirmed plans for the logged-in user.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.userId })
      .sort({ confirmedAt: -1 })
      .lean();

    return res.json({
      plans,
    });
  } catch (error) {
    console.error("Plan history loading error:", error);
    return res.status(500).json({
      message: "Could not load plan history",
    });
  }
});

// Delete one plan owned by the logged-in user.
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedPlan = await Plan.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedPlan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    return res.json({
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("Plan delete error:", error);
    return res.status(500).json({
      message: "Could not delete plan",
    });
  }
});

module.exports = router;
