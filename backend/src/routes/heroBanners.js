const express = require("express");
const { body, validationResult } = require("express-validator");
const HeroBanner = require("../models/HeroBanner");
const requireAuth = require("../middleware/auth");
const upload = require("../middleware/upload");
const getPagination = require("../utils/pagination");

const router = express.Router();

router.get("/", async (req, res) => {
  const { includeInactive } = req.query;
  const filter = includeInactive === "true" ? {} : { isActive: true };
  const { skip, limit, sort, page } = getPagination(req.query);
  const [items, total] = await Promise.all([
    HeroBanner.find(filter).sort(sort).skip(skip).limit(limit),
    HeroBanner.countDocuments(filter),
  ]);

  return res.json({ items, total, page, limit });
});

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("subtitle").trim().notEmpty().withMessage("Subtitle is required"),
    body("order").optional().isInt({ min: 0 }).withMessage("Order must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const banner = await HeroBanner.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      order: req.body.order || 0,
      isActive: req.body.isActive !== "false",
      imageUrl: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json(banner);
  }
);

router.put(
  "/:id",
  requireAuth,
  upload.single("image"),
  [
    body("title").optional().trim().notEmpty(),
    body("subtitle").optional().trim().notEmpty(),
    body("order").optional().isInt({ min: 0 }),
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

    const banner = await HeroBanner.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!banner) {
      return res.status(404).json({ message: "Hero banner not found" });
    }

    return res.json(banner);
  }
);

router.delete("/:id", requireAuth, async (req, res) => {
  const banner = await HeroBanner.findByIdAndDelete(req.params.id);
  if (!banner) {
    return res.status(404).json({ message: "Hero banner not found" });
  }
  return res.status(204).send();
});

module.exports = router;
