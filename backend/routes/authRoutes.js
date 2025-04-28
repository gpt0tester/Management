// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware"); // Import permission middleware if needed

// Route to register a new user
// Optional: Add permissionMiddleware if you want to restrict registration to certain roles
router.post(
  "/register",
  authMiddleware, // Ensure the user is authenticated (optional, remove if not needed for open registration)
  permissionMiddleware(["CREATE_USER"]), // Optional: Require permission to create a user
  authController.register
);

// Route to login a user
router.post("/login", authController.login);

module.exports = router;
