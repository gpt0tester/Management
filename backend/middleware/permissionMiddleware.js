// middleware/permissionMiddleware.js 
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkPermissions = (requiredPermissions) => {
  return async (req, res, next) => {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user with their roles and permissions
      const user = await User.findById(decoded.userId).populate({
        path: "roles",
        populate: {
          path: "permissions",
          model: "Permission",
        },
      });

      // Check if the user exists
      if (!user) {
        console.error("User not found for ID:", decoded.userId);
        return res.status(404).json({ message: "User not found." });
      }

      // Create a set of all permissions from the user's roles
      const userPermissions = new Set();
      user.roles.forEach((role) => {
        if (role.permissions) {
          role.permissions.forEach((perm) => {
            userPermissions.add(perm.name);
          });
        }
      });

      // Check if the user has the required permissions
      const hasPermission = requiredPermissions.every((perm) =>
        userPermissions.has(perm)
      );

      if (!hasPermission) {
        console.error(
          `User ${user.username} does not have required permissions:`,
          requiredPermissions
        );
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
      }

      next(); // Proceed if permissions are sufficient
    } catch (error) {
      console.error("Error in permission middleware:", error);
      res.status(403).json({ message: "Invalid token. Access denied.", error });
    }
  };
};

module.exports = checkPermissions;
