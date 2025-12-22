const express = require("express");
const HeroBanner = require("../models/HeroBanner");
const Deal = require("../models/Deal");
const Tour = require("../models/Tour");
const Inquiry = require("../models/Inquiry");
const TripRequest = require("../models/TripRequest");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/stats", requireAuth, async (req, res) => {
  const [
    totalBanners,
    totalDeals,
    activeDeals,
    totalTours,
    inquiries,
    tripRequests,
    tourDurations,
  ] = await Promise.all([
    HeroBanner.countDocuments(),
    Deal.countDocuments(),
    Deal.countDocuments({ isActive: true }),
    Tour.countDocuments(),
    Inquiry.countDocuments(),
    TripRequest.countDocuments(),
    Tour.aggregate([{ $group: { _id: null, totalDuration: { $sum: "$duration" } } }]),
  ]);

  const totalTourDays = tourDurations[0]?.totalDuration || 0;

  return res.json({
    totalBanners,
    totalDeals,
    activeDeals,
    totalTours,
    totalTourDays,
    totalInquiries: inquiries,
    totalTripRequests: tripRequests,
  });
});

module.exports = router;
