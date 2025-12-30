const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    location: { type: String, required: true, maxlength: 80 },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isHotDeal: { type: Boolean, default: false },
    description: { type: String, required: true },
    tagline: { type: String, required: true, maxlength: 80 },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tour", tourSchema);
