const express = require("express");
const { body, validationResult } = require("express-validator");
const HeroBanner = require("../models/HeroBanner");
const requireAuth = require("../middleware/auth");
const upload = require("../middleware/upload");
const getPagination = require("../utils/pagination");

const router = express.Router();

// Custom validation functions
const validateTitle = (value) => {
  if (!value) return true; // Let required validator handle empty values
  
  // Check character restrictions (letters, numbers, spaces only)
  const allowedCharsRegex = /^[a-zA-Z0-9\s]+$/;
  if (!allowedCharsRegex.test(value)) {
    throw new Error('Title can only contain letters, numbers, and spaces');
  }
  
  // Check character count (max 80 characters)
  if (value.length > 80) {
    throw new Error(`Title cannot exceed 80 characters. Current: ${value.length} characters`);
  }
  
  return true;
};

const validateSubtitle = (value) => {
  if (!value) return true; // Subtitle is optional
  
  // Check character count (max 80 characters)
  if (value.length > 80) {
    throw new Error(`Subtitle cannot exceed 80 characters. Current: ${value.length} characters`);
  }
  
  return true;
};

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
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .custom(validateTitle),
    body("subtitle")
      .optional()
      .custom(validateSubtitle),
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
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .custom(validateTitle),
    body("subtitle")
      .optional()
      .custom(validateSubtitle),
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
