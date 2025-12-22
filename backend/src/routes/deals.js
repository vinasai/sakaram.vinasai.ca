const express = require("express");
const { body, validationResult } = require("express-validator");
const Deal = require("../models/Deal");
const requireAuth = require("../middleware/auth");
const upload = require("../middleware/upload");
const getPagination = require("../utils/pagination");

const router = express.Router();

router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.isActive) {
    filter.isActive = req.query.isActive === "true";
  }
  const { skip, limit, sort, page } = getPagination(req.query);
  const [items, total] = await Promise.all([
    Deal.find(filter).sort(sort).skip(skip).limit(limit),
    Deal.countDocuments(filter),
  ]);

  return res.json({ items, total, page, limit });
});

router.get("/:id", async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) {
    return res.status(404).json({ message: "Deal not found" });
  }
  return res.json(deal);
});

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("tagline").trim().notEmpty().withMessage("Tagline is required"),
    body("duration").trim().notEmpty().withMessage("Duration is required"),
    body("inclusions").toArray().optional().isArray(),
    body("price").isFloat({ min: 0 }).withMessage("Price is required"),
    body("discount").optional().isFloat({ min: 0, max: 100 }),
    body("spotsLeft").optional().isInt({ min: 0 }),
    body("expiryDate").isISO8601().withMessage("Expiry Date is required"),
    body("isActive").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const deal = await Deal.create({
      title: req.body.title,
      tagline: req.body.tagline,
      duration: req.body.duration,
      inclusions: req.body.inclusions,
      price: req.body.price,
      discount: req.body.discount,
      imageUrl: `/uploads/${req.file.filename}`,
      spotsLeft: req.body.spotsLeft,
      expiryDate: req.body.expiryDate,
      isActive: req.body.isActive !== "false",
    });

    return res.status(201).json(deal);
  }
);

router.put(
  "/:id",
  requireAuth,
  upload.single("image"),
  [
    body("title").optional().trim().notEmpty(),
    body("tagline").optional().trim(),
    body("duration").optional().trim(),
    body("inclusions").toArray().optional().isArray(),
    body("price").optional().isFloat({ min: 0 }),
    body("discount").optional().isFloat({ min: 0, max: 100 }),
    body("spotsLeft").optional().isInt({ min: 0 }),
    body("expiryDate").optional().isISO8601(),
    body("isActive").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    const deal = await Deal.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    return res.json(deal);
  }
);

router.delete("/:id", requireAuth, async (req, res) => {
  const deal = await Deal.findByIdAndDelete(req.params.id);
  if (!deal) {
    return res.status(404).json({ message: "Deal not found" });
  }
  return res.status(204).send();
});

module.exports = router;
