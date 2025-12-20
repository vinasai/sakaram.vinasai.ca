const express = require("express");
const { body, validationResult } = require("express-validator");
const Inquiry = require("../models/Inquiry");
const requireAuth = require("../middleware/auth");
const getPagination = require("../utils/pagination");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const { skip, limit, sort, page } = getPagination(req.query);
  const [items, total] = await Promise.all([
    Inquiry.find().sort(sort).skip(skip).limit(limit),
    Inquiry.countDocuments(),
  ]);

  return res.json({ items, total, page, limit });
});

router.post(
  "/",
  [
    body("fullName").trim().notEmpty(),
    body("email").isEmail(),
    body("message").trim().notEmpty(),
    body("phone").optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inquiry = await Inquiry.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    });

    return res.status(201).json(inquiry);
  }
);

module.exports = router;
