const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String },
    duration: { type: String },
    inclusions: { type: [String], default: [] },
    price: { type: Number },
    discount: { type: Number },
    imageUrl: { type: String, required: true },
    spotsLeft: { type: Number },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);
