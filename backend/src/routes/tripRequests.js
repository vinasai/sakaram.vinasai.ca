const express = require("express");
const { body, validationResult } = require("express-validator");
const TripRequest = require("../models/TripRequest");
const requireAuth = require("../middleware/auth");
const getPagination = require("../utils/pagination");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const { skip, limit, sort, page } = getPagination(req.query);
  const [items, total] = await Promise.all([
    TripRequest.find(filter).sort(sort).skip(skip).limit(limit),
    TripRequest.countDocuments(filter),
  ]);

  return res.json({ items, total, page, limit });
});

router.post(
  "/",
  [
    body("tourId").notEmpty(),
    body("startDate").isISO8601(),
    body("travellers").isInt({ min: 1 }),
    body("accommodationType").trim().notEmpty(),
    body("fullName").trim().notEmpty(),
    body("email").isEmail(),
    body("phone").optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const startDate = new Date(req.body.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({ message: "Start date cannot be in the past" });
    }

    const request = await TripRequest.create({
      tourId: req.body.tourId,
      startDate,
      travellers: req.body.travellers,
      accommodationType: req.body.accommodationType,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      status: req.body.status || "pending",
    });

    return res.status(201).json(request);
  }
);

router.put(
  "/:id",
  requireAuth,
  [body("status").optional().trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const request = await TripRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!request) {
      return res.status(404).json({ message: "Trip request not found" });
    }

    return res.json(request);
  }
);

module.exports = router;
