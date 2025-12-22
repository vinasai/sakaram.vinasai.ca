require('dotenv').config();
const jwt = require('jsonwebtoken');
const requireAuth = require('./src/middleware/auth');

// Token from the user's error log
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDczNDQxMGZlMTljYjJkYTk3ZDJjMiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NjYyNzQyNDMsImV4cCI6MTc2NjMxNzQ0M30.Oha0ID5nKUIlpfC1Tj0xDhQt3Se0tC-1WHHfDhkbD1w";

console.log("Testing Token Verification...");

// 1. Direct verify
try {
    if (!process.env.JWT_SECRET) {
        console.error("FATAL: JWT_SECRET is missing from environment!");
    } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("1. Direct jwt.verify: SUCCESS");
        console.log("   Decoded:", decoded);
    }
} catch (error) {
    console.log("1. Direct jwt.verify: FAILED");
    console.log("   Error:", error.message);
}

// 2. Mocking middleware
const req = {
    headers: {
        authorization: "Bearer " + token
    }
};
const res = {
    status: (code) => ({
        json: (data) => console.log(`2. Middleware response: Status ${code}`, data)
    })
};
const next = () => console.log("2. Middleware next() called: SUCCESS");

console.log("\nTesting Middleware...");
try {
    requireAuth(req, res, next);
} catch (e) {
    console.log("Middleware threw error:", e);
}
