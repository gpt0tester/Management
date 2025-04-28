// middleware/authMiddleware.js 
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure User model is imported to fetch user details

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if Authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token not provided or formatted incorrectly.",
    });
  }

  // Extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database
    const user = await User.findById(decoded.userId).populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach the user object with roles and permissions to the request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(403).json({ message: "Invalid token. Access denied." });
  }
};

module.exports = authMiddleware;
