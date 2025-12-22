const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const AdminUser = require("./models/AdminUser");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sakaram";

const ensureUploadsFolder = () => {
  const uploadPath = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

const ensureAdminUser = async () => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return;
  }

  const existing = await AdminUser.findOne({ username });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await AdminUser.create({ username, passwordHash });
  console.log(`Seeded admin user: ${username}`);
};

const start = async () => {
  ensureUploadsFolder();
  await connectDB(MONGODB_URI);
  await ensureAdminUser();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
