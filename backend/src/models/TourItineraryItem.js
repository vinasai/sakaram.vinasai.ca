const mongoose = require("mongoose");

const tourItineraryItemSchema = new mongoose.Schema(
  {
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    dayNumber: { type: Number, required: true },
    activity: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TourItineraryItem", tourItineraryItemSchema);
