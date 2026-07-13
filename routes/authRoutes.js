const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");



// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);



// Get Logged In User Profile
router.get("/profile", authMiddleware, getProfile);

module.exports = router;