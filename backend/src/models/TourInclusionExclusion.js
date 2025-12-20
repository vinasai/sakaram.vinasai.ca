const mongoose = require("mongoose");

const tourInclusionExclusionSchema = new mongoose.Schema(
  {
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["included", "excluded"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TourInclusionExclusion", tourInclusionExclusionSchema);
