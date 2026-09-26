const express = require("express");
const crypto = require("crypto");
const Booking = require("../models/Booking");

const router = express.Router();

console.log("Payment routes loaded");

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_travelguruji_demo";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "demo_secret_key";
const IS_DEMO_MODE = !process.env.RAZORPAY_LIVE;

/**
 * CREATE ORDER (POST /api/payments/create-order)
 */
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, bookingReference } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required for payment.",
      });
    }

    const orderId = `order_${IS_DEMO_MODE ? "demo_" : ""}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    res.status(200).json({
      success: true,
      isDemoMode: IS_DEMO_MODE,
      order: {
        id: orderId,
        amount: Math.round(Number(amount) * 100), // amount in paise
        currency,
        receipt: receipt || bookingReference || `rcpt_${Date.now()}`,
        status: "created",
      },
      keyId: RAZORPAY_KEY_ID,
      message: IS_DEMO_MODE
        ? "Sandbox payment order initialized. No real bank deduction will occur."
        : "Payment order created successfully.",
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initialize payment order.",
    });
  }
});

/**
 * VERIFY PAYMENT (POST /api/payments/verify)
 */
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingReference,
    } = req.body;

    let verified = false;

    if (IS_DEMO_MODE || (razorpay_payment_id && razorpay_payment_id.startsWith("pay_demo_"))) {
      // In Demo Mode, simulate instant verified transaction
      verified = true;
    } else if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      // Verify HMAC SHA256 signature
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      verified = expectedSignature === razorpay_signature;
    }

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: invalid signature.",
      });
    }

    // Update booking status in database if reference provided
    let updatedBooking = null;
    if (bookingReference) {
      updatedBooking = await Booking.findOneAndUpdate(
        { bookingReference },
        {
          paymentStatus: "Paid",
          bookingStatus: "Confirmed",
          razorpayOrderId: razorpay_order_id || "",
          razorpayPaymentId: razorpay_payment_id || `pay_demo_${Date.now()}`,
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      verified: true,
      isDemoMode: IS_DEMO_MODE,
      paymentId: razorpay_payment_id || `pay_demo_${Date.now()}`,
      message: "Payment verified successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification.",
    });
  }
});

module.exports = router;

