const express = require("express");
const { body, validationResult } = require("express-validator");
const GalleryPhoto = require("../models/GalleryPhoto");
const requireAuth = require("../middleware/auth");
const upload = require("../middleware/upload");
const getPagination = require("../utils/pagination");

const router = express.Router();

router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.search) {
    filter.title = new RegExp(req.query.search, "i");
  }

  const { skip, limit, sort, page } = getPagination(req.query);
  const [items, total] = await Promise.all([
    GalleryPhoto.find(filter).sort(sort).skip(skip).limit(limit),
    GalleryPhoto.countDocuments(filter),
  ]);

  return res.json({ items, total, page, limit });
});

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  [
    body("title").trim().notEmpty(),
    body("category").trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const photo = await GalleryPhoto.create({
      title: req.body.title,
      category: req.body.category,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json(photo);
  }
);

router.put(
  "/:id",
  requireAuth,
  upload.single("image"),
  [body("title").optional().trim().notEmpty(), body("category").optional().trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    const photo = await GalleryPhoto.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    return res.json(photo);
  }
);

router.delete("/:id", requireAuth, async (req, res) => {
  const photo = await GalleryPhoto.findByIdAndDelete(req.params.id);
  if (!photo) {
    return res.status(404).json({ message: "Photo not found" });
  }
  return res.status(204).send();
});

module.exports = router;
