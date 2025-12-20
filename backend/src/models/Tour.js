const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isHotDeal: { type: Boolean, default: false },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tour", tourSchema);
