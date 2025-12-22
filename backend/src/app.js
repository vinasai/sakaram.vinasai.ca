const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const heroBannerRoutes = require("./routes/heroBanners");
const dealRoutes = require("./routes/deals");
const tourRoutes = require("./routes/tours");
const galleryRoutes = require("./routes/gallery");
const inquiryRoutes = require("./routes/inquiries");
const tripRequestRoutes = require("./routes/tripRequests");
const dashboardRoutes = require("./routes/dashboard");
const dealRequestRoutes = require("./routes/dealRequestRoutes");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/hero-banners", heroBannerRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/trip-requests", tripRequestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/deal-requests", dealRequestRoutes);

app.use((err, req, res, next) => {
  if (err.message?.includes("Only image uploads")) {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
