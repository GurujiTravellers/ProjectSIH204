const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },

    itemType: {
      type: String,
      enum: ["Hotel", "Transport", "Activity", "TripPlan", "StudentPlan", "ComboItinerary"],
      default: "Hotel",
      required: true,
    },

    hotelDetails: {
      hotelId: { type: Number },
      name: { type: String, trim: true },
      destination: { type: String, trim: true },
      roomType: { type: String, default: "Standard Room" },
      roomsCount: { type: Number, default: 1, min: 1 },
      nights: { type: Number, default: 1, min: 1 },
      pricePerNight: { type: Number, default: 0 },
      checkIn: { type: String, default: "" },
      checkOut: { type: String, default: "" },
      guests: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 },
      },
    },

    transportDetails: {
      type: { type: String, enum: ["Flight", "Train", "Bus", "Connecting", "Multimodal", ""], default: "" },
      operator: { type: String, default: "" },
      identifier: { type: String, default: "" },
      origin: { type: String, default: "" },
      destination: { type: String, default: "" },
      departureTime: { type: String, default: "" },
      arrivalTime: { type: String, default: "" },
      travelDate: { type: String, default: "" },
      seatClass: { type: String, default: "" },
      passengersCount: { type: Number, default: 1 },
    },

    activityDetails: {
      activityName: { type: String, default: "" },
      category: { type: String, default: "" },
      location: { type: String, default: "" },
      date: { type: String, default: "" },
      timeSlot: { type: String, default: "" },
      ticketsCount: { type: Number, default: 1 },
    },

    tripPlanDetails: {
      destination: { type: String, default: "" },
      startDate: { type: String, default: "" },
      days: { type: Number, default: 1 },
      persons: { type: Number, default: 1 },
      hotelName: { type: String, default: "" },
    },

    guestDetails: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, default: "", trim: true },
      specialRequests: { type: String, default: "", trim: true },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partially Paid", "Refunded", "Failed"],
      default: "Paid",
    },

    paymentPlan: {
      type: String,
      enum: ["FULL", "INSTALLMENT_ADVANCE", "PARTIAL_HOTEL"],
      default: "FULL",
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    razorpayOrderId: {
      type: String,
      default: "",
      trim: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      trim: true,
    },

    paymentMethod: {
      type: String,
      default: "Razorpay",
      trim: true,
    },

    installmentNote: {
      type: String,
      default: "",
      trim: true,
    },

    comboItems: [
      {
        itemType: { type: String, default: "" },
        title: { type: String, default: "" },
        price: { type: Number, default: 0 },
        details: { type: mongoose.Schema.Types.Mixed, default: {} },
      },
    ],

    bookingStatus: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Completed"],
      default: "Confirmed",
    },

    cancellationPolicy: {
      type: String,
      default: "Free cancellation up to 24 hours before check-in.",
    },

    isDemoMode: {
      type: Boolean,
      default: true,
    },

    confirmedAt: {
      type: Date,
      default: Date.now,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

