// // routes/userRoutes.js
// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");
// const authMiddleware = require("../middleware/authMiddleware");
// const checkPermissions = require("../middleware/permissionMiddleware");

// // Secure routes with permissions

// // Create a new user - Requires 'create_user' permission
// router.post(
//   "/create",
//   authMiddleware, // Ensures the user is authenticated
//   checkPermissions(["CREATE_USER"]), // Ensures the user has 'create_user' permission
//   userController.createUser
// );

// // Get all users - Requires 'view_users' permission
// router.get(
//   "/list",
//   authMiddleware,
//   checkPermissions(["READ_USERS"]),
//   userController.getAllUsers
// );

// // Update user details - Requires 'update_user' permission
// router.put(
//   "/update/:id",
//   authMiddleware,
//   checkPermissions(["UPDATE_USER"]),
//   userController.updateUser
// );

// // Delete a user - Requires 'delete_user' permission
// router.delete(
//   "/delete/:id",
//   authMiddleware,
//   checkPermissions(["DELETE_USER"]),
//   userController.deleteUser
// );

// // Role Management

// // Create a new role - Requires 'create_role' permission
// router.post(
//   "/role/create",
//   authMiddleware,
//   checkPermissions(["CREATE_ROLE"]),
//   userController.createRole
// );

// // Get all roles - Requires 'view_roles' permission
// router.get(
//   "/role/list",
//   authMiddleware,
//   checkPermissions(["READ_ROLES"]),
//   userController.getAllRoles
// );

// // Update a role - Requires 'update_role' permission
// router.put(
//   "/role/update/:id",
//   authMiddleware,
//   checkPermissions(["UPDATE_ROLE"]),
//   userController.updateRole
// );

// // Delete a role - Requires 'delete_role' permission
// router.delete(
//   "/role/delete/:id",
//   authMiddleware,
//   checkPermissions(["DELETE_ROLE"]),
//   userController.deleteRole
// );

// // Permission Management

// // Create a new permission - Requires 'create_permission' permission
// router.post(
//   "/permission/create",
//   authMiddleware,
//   checkPermissions(["CREATE_PERMISSION"]),
//   userController.createPermission
// );

// // Get all permissions - Requires 'view_permissions' permission
// router.get(
//   "/permission/list",
//   authMiddleware,
//   checkPermissions(["READ_PERMISSIONS"]),
//   userController.getAllPermissions
// );

// // Update a permission - Requires 'update_permission' permission
// router.put(
//   "/permission/update/:id",
//   authMiddleware,
//   checkPermissions(["UPDATE_PERMISSION"]),
//   userController.updatePermission
// );

// // Delete a permission - Requires 'delete_permission' permission
// router.delete(
//   "/permission/delete/:id",
//   authMiddleware,
//   checkPermissions(["DELETE_PERMISSION"]),
//   userController.deletePermission
// );

// module.exports = router;

// =============================================================================================

// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const checkPermissions = require("../middleware/permissionMiddleware");

// Secure routes with permissions

// GET endpoint to fetch the current logged-in user's profile
router.get(
  '/me',
  authMiddleware, // Protect the route
  (req, res) => {
    // req.user is populated by authMiddleware with roles and permissions
    if (!req.user) {
       return res.status(404).json({ message: 'User data not found in request.' });
    }
    // Send the user data back (password is not selected by default)
    res.status(200).json(req.user);
  }
);

// Create a new user - Requires 'create_user' permission
router.post(
  "/create",
  authMiddleware, // Ensures the user is authenticated
  checkPermissions(["CREATE_USER"]), // Ensures the user has 'create_user' permission
  userController.createUser
);

// Get all users - Requires 'view_users' permission
router.get(
  "/list",
  authMiddleware,
  checkPermissions(["READ_USERS"]),
  userController.getAllUsers
);

// Update user details - Requires 'update_user' permission
router.put(
  "/update/:id",
  authMiddleware,
  checkPermissions(["UPDATE_USER"]),
  userController.updateUser
);

// Delete a user - Requires 'delete_user' permission
router.delete(
  "/delete/:id",
  authMiddleware,
  checkPermissions(["DELETE_USER"]),
  userController.deleteUser
);

// Role Management

// Create a new role - Requires 'create_role' permission
router.post(
  "/role/create",
  authMiddleware,
  checkPermissions(["CREATE_ROLE"]),
  userController.createRole
);

// Get all roles - Requires 'view_roles' permission
router.get(
  "/role/list",
  authMiddleware,
  checkPermissions(["READ_ROLES"]),
  userController.getAllRoles
);

// Update a role - Requires 'update_role' permission
router.put(
  "/role/update/:id",
  authMiddleware,
  checkPermissions(["UPDATE_ROLE"]),
  userController.updateRole
);

// Delete a role - Requires 'delete_role' permission
router.delete(
  "/role/delete/:id",
  authMiddleware,
  checkPermissions(["DELETE_ROLE"]),
  userController.deleteRole
);

// Permission Management

// Create a new permission - Requires 'create_permission' permission
router.post(
  "/permission/create",
  authMiddleware,
  checkPermissions(["CREATE_PERMISSION"]),
  userController.createPermission
);

// Get all permissions - Requires 'view_permissions' permission
router.get(
  "/permission/list",
  authMiddleware,
  checkPermissions(["READ_PERMISSIONS"]),
  userController.getAllPermissions
);

// Update a permission - Requires 'update_permission' permission
router.put(
  "/permission/update/:id",
  authMiddleware,
  checkPermissions(["UPDATE_PERMISSION"]),
  userController.updatePermission
);

// Delete a permission - Requires 'delete_permission' permission
router.delete(
  "/permission/delete/:id",
  authMiddleware,
  checkPermissions(["DELETE_PERMISSION"]),
  userController.deletePermission
);

module.exports = router;
