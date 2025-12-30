const express = require("express");
const { body, validationResult } = require("express-validator");
const Tour = require("../models/Tour");
const TourInclusionExclusion = require("../models/TourInclusionExclusion");
const TourItineraryItem = require("../models/TourItineraryItem");
const TourImage = require("../models/TourImage");
const requireAuth = require("../middleware/auth");
const upload = require("../middleware/upload");
const getPagination = require("../utils/pagination");

const router = express.Router();

router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.hot === "true") {
    filter.isHotDeal = true;
  }
  if (req.query.search) {
    filter.$or = [
      { name: new RegExp(req.query.search, "i") },
      { location: new RegExp(req.query.search, "i") },
    ];
  }

  const { skip, limit, sort, page } = getPagination(req.query);
  const [items, total] = await Promise.all([
    Tour.find(filter).sort(sort).skip(skip).limit(limit),
    Tour.countDocuments(filter),
  ]);

  return res.json({ items, total, page, limit });
});

router.get("/:id", async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return res.status(404).json({ message: "Tour not found" });
  }

  const [inclusions, exclusions, itinerary, images] = await Promise.all([
    TourInclusionExclusion.find({ tourId: tour._id, type: "included" }),
    TourInclusionExclusion.find({ tourId: tour._id, type: "excluded" }),
    TourItineraryItem.find({ tourId: tour._id }).sort({ dayNumber: 1 }),
    TourImage.find({ tourId: tour._id }),
  ]);

  return res.json({ tour, inclusions, exclusions, itinerary, images });
});

router.post(
  "/",
  requireAuth,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Tour name is required")
      .isLength({ max: 80 })
      .withMessage("Tour name must be at most 80 characters"),
    body("location")
      .trim()
      .notEmpty()
      .withMessage("Location is required")
      .isLength({ max: 80 })
      .withMessage("Location must be at most 80 characters"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("duration")
      .trim()
      .notEmpty()
      .withMessage("Duration is required")
      .matches(/^[1-9]\d*(?:\s*-\s*[1-9]\d*)?\s*(hour|hours)$/i)
      .withMessage("Duration must start with a non-zero number and end with 'hour' or 'hours' (e.g., '3-5 hours')"),
    body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
    body("reviewsCount").optional().isInt({ min: 0 }).withMessage("Reviews count must be a positive number"),
    body("isHotDeal").optional().isBoolean(),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("tagline")
      .trim()
      .notEmpty()
      .withMessage("Tagline is required")
      .isLength({ max: 80 })
      .withMessage("Tagline must be less than 80 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tour = await Tour.create({
      name: req.body.name,
      location: req.body.location,
      price: req.body.price,
      duration: req.body.duration,
      rating: req.body.rating || 0,
      reviewsCount: req.body.reviewsCount || 0,
      isHotDeal: req.body.isHotDeal || false,
      description: req.body.description,
      tagline: req.body.tagline,
    });

    return res.status(201).json(tour);
  }
);

router.put(
  "/:id",
  requireAuth,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Tour name cannot be empty")
      .isLength({ max: 80 })
      .withMessage("Tour name must be at most 80 characters"),
    body("location")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Location cannot be empty")
      .isLength({ max: 80 })
      .withMessage("Location must be at most 80 characters"),
    body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("duration")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Duration cannot be empty")
      .matches(/^[1-9]\d*(?:\s*-\s*[1-9]\d*)?\s*(hour|hours)$/i)
      .withMessage("Duration must start with a non-zero number and end with 'hour' or 'hours' (e.g., '3-5 hours')"),
    body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
    body("reviewsCount").optional().isInt({ min: 0 }).withMessage("Reviews count must be a positive number"),
    body("isHotDeal").optional().isBoolean(),
    body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
    body("tagline")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Tagline cannot be empty")
      .isLength({ max: 80 })
      .withMessage("Tagline must be less than 80 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    return res.json(tour);
  }
);

router.delete("/:id", requireAuth, async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return res.status(404).json({ message: "Tour not found" });
  }

  await Promise.all([
    TourInclusionExclusion.deleteMany({ tourId: req.params.id }),
    TourItineraryItem.deleteMany({ tourId: req.params.id }),
    TourImage.deleteMany({ tourId: req.params.id }),
  ]);

  return res.status(204).send();
});

router.post(
  "/:id/inclusions",
  requireAuth,
  [body("description").trim().notEmpty().isLength({ max: 80 }).withMessage("Inclusion must be 80 characters or fewer")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inclusion = await TourInclusionExclusion.create({
      tourId: req.params.id,
      description: req.body.description,
      type: "included",
    });

    return res.status(201).json(inclusion);
  }
);

router.post(
  "/:id/exclusions",
  requireAuth,
  [body("description").trim().notEmpty().isLength({ max: 80 }).withMessage("Exclusion must be 80 characters or fewer")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const exclusion = await TourInclusionExclusion.create({
      tourId: req.params.id,
      description: req.body.description,
      type: "excluded",
    });

    return res.status(201).json(exclusion);
  }
);

router.delete("/:id/inclusions/:itemId", requireAuth, async (req, res) => {
  const inclusion = await TourInclusionExclusion.findOneAndDelete({
    _id: req.params.itemId,
    tourId: req.params.id,
    type: "included",
  });

  if (!inclusion) {
    return res.status(404).json({ message: "Inclusion not found" });
  }

  return res.status(204).send();
});

router.delete("/:id/exclusions/:itemId", requireAuth, async (req, res) => {
  const exclusion = await TourInclusionExclusion.findOneAndDelete({
    _id: req.params.itemId,
    tourId: req.params.id,
    type: "excluded",
  });

  if (!exclusion) {
    return res.status(404).json({ message: "Exclusion not found" });
  }

  return res.status(204).send();
});

router.post(
  "/:id/itinerary",
  requireAuth,
  [
    body("dayNumber").isInt({ min: 1 }),
    body("activity").trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await TourItineraryItem.create({
      tourId: req.params.id,
      dayNumber: req.body.dayNumber,
      activity: req.body.activity,
    });

    return res.status(201).json(item);
  }
);

router.delete("/:id/itinerary/:itemId", requireAuth, async (req, res) => {
  const item = await TourItineraryItem.findOneAndDelete({
    _id: req.params.itemId,
    tourId: req.params.id,
  });

  if (!item) {
    return res.status(404).json({ message: "Itinerary item not found" });
  }

  return res.status(204).send();
});

router.post(
  "/:id/images",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    // Accept either a file upload OR an imageUrl in the request body
    let imageUrl;

    if (req.file) {
      // File was uploaded
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      // Image URL was provided
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ message: "Image file or imageUrl is required" });
    }

    const image = await TourImage.create({
      tourId: req.params.id,
      imageUrl: imageUrl,
    });

    const tour = await Tour.findById(req.params.id);
    if (tour && !tour.imageUrl) {
      tour.imageUrl = imageUrl;
      await tour.save();
    }

    return res.status(201).json(image);
  }
);

router.delete("/:id/images/:imageId", requireAuth, async (req, res) => {
  const image = await TourImage.findOneAndDelete({
    _id: req.params.imageId,
    tourId: req.params.id,
  });

  if (!image) {
    return res.status(404).json({ message: "Tour image not found" });
  }

  const tour = await Tour.findById(req.params.id);
  // If the deleted image was the main one, set a new main image
  if (tour && tour.imageUrl === image.imageUrl) {
    const nextImage = await TourImage.findOne({ tourId: req.params.id });
    tour.imageUrl = nextImage ? nextImage.imageUrl : null;
    await tour.save();
  }

  return res.status(204).send();
});

module.exports = router;
