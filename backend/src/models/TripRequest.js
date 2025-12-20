const mongoose = require("mongoose");

const tripRequestSchema = new mongoose.Schema(
  {
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    startDate: { type: Date, required: true },
    travellers: { type: Number, required: true },
    accommodationType: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("TripRequest", tripRequestSchema);
