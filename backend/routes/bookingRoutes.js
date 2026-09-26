const express = require("express");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");

const router = express.Router();

console.log("Booking routes loaded");

// Helper to optionally extract userId from Bearer token
function getOptionalUserId(req) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.userId || null;
    }
  } catch {
    // Ignore invalid/missing token
  }
  return null;
}

// Generate human-friendly unique booking reference
function generateReference(itemType = "Hotel") {
  const prefixMap = {
    Hotel: "HTL",
    Transport: "TRN",
    Activity: "ACT",
    TripPlan: "TRP",
    StudentPlan: "STU",
    ComboItinerary: "CMB",
  };
  const prefix = prefixMap[itemType] || "BKG";
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestampPart = Date.now().toString().slice(-4);
  return `TG-${prefix}-${randomPart}${timestampPart}`;
}

// ===================================================
// CREATE BOOKING (POST /api/bookings)
// ===================================================
router.post("/", async (req, res) => {
  try {
    const {
      itemType = "Hotel",
      hotelDetails,
      transportDetails,
      activityDetails,
      tripPlanDetails,
      guestDetails,
      totalAmount,
      currency = "INR",
      paymentStatus,
      paymentPlan = "FULL",
      amountPaid,
      remainingBalance,
      razorpayOrderId = "",
      razorpayPaymentId = "",
      paymentMethod = "Razorpay",
      installmentNote = "",
      comboItems = [],
      isDemoMode = true,
      cancellationPolicy,
    } = req.body;

    if (!guestDetails || !guestDetails.fullName || !guestDetails.email) {
      return res.status(400).json({
        success: false,
        message: "Guest full name and email are required for booking.",
      });
    }

    if (totalAmount === undefined || totalAmount === null || totalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid totalAmount is required.",
      });
    }

    const userId = req.body.userId || getOptionalUserId(req);
    const bookingReference = generateReference(itemType);

    const effAmountPaid = amountPaid !== undefined ? Number(amountPaid) : Number(totalAmount);
    const effRemainingBalance = remainingBalance !== undefined ? Number(remainingBalance) : Math.max(0, Number(totalAmount) - effAmountPaid);
    const effPaymentStatus = paymentStatus || (effRemainingBalance > 0 ? "Partially Paid" : "Paid");

    const newBooking = await Booking.create({
      bookingReference,
      userId: userId || null,
      itemType,
      hotelDetails: hotelDetails || {},
      transportDetails: transportDetails || {},
      activityDetails: activityDetails || {},
      tripPlanDetails: tripPlanDetails || {},
      guestDetails: {
        fullName: guestDetails.fullName.trim(),
        email: guestDetails.email.trim().toLowerCase(),
        phone: guestDetails.phone ? guestDetails.phone.trim() : "",
        specialRequests: guestDetails.specialRequests ? guestDetails.specialRequests.trim() : "",
      },
      totalAmount: Number(totalAmount),
      currency,
      paymentStatus: effPaymentStatus,
      paymentPlan,
      amountPaid: effAmountPaid,
      remainingBalance: effRemainingBalance,
      razorpayOrderId: String(razorpayOrderId || ""),
      razorpayPaymentId: String(razorpayPaymentId || ""),
      paymentMethod: String(paymentMethod || "Razorpay"),
      installmentNote: String(installmentNote || ""),
      comboItems: Array.isArray(comboItems) ? comboItems : [],
      bookingStatus: "Confirmed",
      cancellationPolicy:
        cancellationPolicy ||
        "Free cancellation up to 24 hours before check-in / departure date.",
      isDemoMode: Boolean(isDemoMode),
      confirmedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully.",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process booking.",
    });
  }
});

// ===================================================
// GET USER'S BOOKINGS (GET /api/bookings/my-bookings)
// ===================================================
router.get("/my-bookings", async (req, res) => {
  try {
    const userId = getOptionalUserId(req);
    const email = req.query.email ? req.query.email.trim().toLowerCase() : null;

    const query = {};

    if (userId && email) {
      query.$or = [{ userId }, { "guestDetails.email": email }];
    } else if (userId) {
      query.userId = userId;
    } else if (email) {
      query["guestDetails.email"] = email;
    } else {
      // Return latest public demo bookings (max 20) if neither token nor email provided
      const recentBookings = await Booking.find()
        .sort({ createdAt: -1 })
        .limit(20);
      return res.status(200).json({
        success: true,
        count: recentBookings.length,
        bookings: recentBookings,
      });
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings.",
    });
  }
});

// ===================================================
// GET SINGLE BOOKING (GET /api/bookings/:reference)
// ===================================================
router.get("/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    let booking = await Booking.findOne({ bookingReference: reference });

    if (!booking && reference.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(reference);
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found with reference: " + reference,
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get single booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking details.",
    });
  }
});

// ===================================================
// CANCEL BOOKING (POST /api/bookings/:reference/cancel)
// ===================================================
router.post("/:reference/cancel", async (req, res) => {
  try {
    const { reference } = req.params;

    let booking = await Booking.findOne({ bookingReference: reference });

    if (!booking && reference.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(reference);
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This booking is already cancelled.",
        booking,
      });
    }

    booking.bookingStatus = "Cancelled";
    booking.paymentStatus = "Refunded";
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${booking.bookingReference} cancelled successfully. Full refund initiated.`,
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking.",
    });
  }
});

module.exports = router;

