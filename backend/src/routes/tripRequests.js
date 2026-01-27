const express = require("express");
const { body, validationResult } = require("express-validator");
const { Resend } = require("resend");
const TripRequest = require("../models/TripRequest");
const requireAuth = require("../middleware/auth");
const getPagination = require("../utils/pagination");

const router = express.Router();

// Resend API configuration
const resend = new Resend("re_j7zdvB2m_Fed7jm9UP4eWBQR1iGSHGLFa");

const sendTripRequestEmail = async (tripRequest) => {
  try {
    await resend.emails.send({
      from: "notifications@skaramtours.com",
      to: "sakaramtours@gmail.com",
      subject: `New Trip Request from ${tripRequest.fullName}`,
      html: `
        <h2>New Trip Request Received</h2>
        <p><strong>Name:</strong> ${tripRequest.fullName}</p>
        <p><strong>Email:</strong> ${tripRequest.email}</p>
        <p><strong>Phone:</strong> ${tripRequest.phone || "Not provided"}</p>
        <p><strong>Tour ID:</strong> ${tripRequest.tourId}</p>
        <p><strong>Start Date:</strong> ${new Date(tripRequest.startDate).toLocaleDateString()}</p>
        <p><strong>Number of Travellers:</strong> ${tripRequest.travellers}</p>
        <p><strong>Accommodation Type:</strong> ${tripRequest.accommodationType}</p>
        <p><strong>Status:</strong> ${tripRequest.status}</p>
      `,
    });
    console.log("Trip request email sent successfully");
  } catch (error) {
    console.error("Failed to send trip request email:", error);
  }
};

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
    body("fullName")
      .trim()
      .notEmpty()
      .custom((value) => {
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          throw new Error("Name must contain only letters");
        }
        return true;
      }),
    body("email")
      .isEmail()
      .custom((value) => {
        const allowedDomains = [
          "gmail.com",
          "yahoo.com",
          "outlook.com",
          "hotmail.com",
        ];
        const domain = value.split("@")[1];
        if (!allowedDomains.includes(domain)) {
          throw new Error(
            "Email must be from gmail, yahoo, outlook, or hotmail",
          );
        }
        return true;
      }),
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
      return res
        .status(400)
        .json({ message: "Start date cannot be in the past" });
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

    // Send email notification
    await sendTripRequestEmail(request);

    return res.status(201).json(request);
  },
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

    const request = await TripRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!request) {
      return res.status(404).json({ message: "Trip request not found" });
    }

    return res.json(request);
  },
);

module.exports = router;
