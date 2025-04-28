// middleware/adminMiddleware.js 
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // Check if the Authorization header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token not provided or formatted incorrectly.",
      });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    // Fetch the user and populate roles
    const user = await User.findById(decoded.userId).populate("roles");

    // Check if the user exists
    if (!user) {
      console.error("User not found with ID:", decoded.userId); // Debug log
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user has the 'admin' role
    const isAdmin = user.roles.some(
      (role) => role.name.toLowerCase() === "admin"
    );

    if (!isAdmin) {
      console.warn(`Access denied for user ${user.username}. Admins only.`); // Debug log
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // Allow access if the user is an admin
  } catch (error) {
    console.error("Error in admin middleware:", error.message); // Log the error for debugging
    res.status(403).json({ message: "Invalid token. Access denied.", error });
  }
};

module.exports = checkAdmin;
