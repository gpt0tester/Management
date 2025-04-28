// // const User = require("../models/User");
// // const Role = require("../models/Role");
// // const Permission = require("../models/Permission");

// // // Create a new user
// // exports.createUser = async (req, res) => {
// //   try {
// //     const { username, email, password, roles } = req.body;
// //     // Hash password and save user
// //     const user = new User({ username, email, password, roles });
// //     await user.save();
// //     res.status(201).json({ message: "User created successfully", user });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error creating user", error });
// //   }
// // };

// // // Create a new role
// // exports.createRole = async (req, res) => {
// //   try {
// //     const { name, permissions } = req.body;
// //     const role = new Role({ name, permissions });
// //     await role.save();
// //     res.status(201).json({ message: "Role created successfully", role });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error creating role", error });
// //   }
// // };

// // // Create a new permission
// // exports.createPermission = async (req, res) => {
// //   try {
// //     const { name, description } = req.body;
// //     const permission = new Permission({ name, description });
// //     await permission.save();
// //     res
// //       .status(201)
// //       .json({ message: "Permission created successfully", permission });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error creating permission", error });
// //   }
// // };

// // // More functions for updating, deleting users, roles, and permissions can be added here

// // ==================================================================================================

// const User = require("../models/User");
// const Role = require("../models/Role");
// const Permission = require("../models/Permission");

// // Create a new user
// exports.createUser = async (req, res) => {
//   try {
//     const { username, email, password, roles } = req.body;
//     const user = new User({ username, email, password, roles });
//     await user.save();
//     res.status(201).json({ message: "User created successfully", user });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating user", error });
//   }
// };

// // Get all users
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().populate("roles");
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users", error });
//   }
// };

// // Update user
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const updatedUser = await User.findByIdAndUpdate(id, updates, {
//       new: true,
//     });
//     res.status(200).json({ message: "User updated successfully", updatedUser });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating user", error });
//   }
// };

// // Delete user
// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await User.findByIdAndDelete(id);
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting user", error });
//   }
// };

// // Create a new role
// exports.createRole = async (req, res) => {
//   try {
//     const { name, permissions } = req.body;
//     const role = new Role({ name, permissions });
//     await role.save();
//     res.status(201).json({ message: "Role created successfully", role });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating role", error });
//   }
// };

// // Get all roles
// exports.getAllRoles = async (req, res) => {
//   try {
//     const roles = await Role.find().populate("permissions");
//     res.status(200).json(roles);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching roles", error });
//   }
// };

// // Update role
// exports.updateRole = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const updatedRole = await Role.findByIdAndUpdate(id, updates, {
//       new: true,
//     });
//     res.status(200).json({ message: "Role updated successfully", updatedRole });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating role", error });
//   }
// };

// // Delete role
// exports.deleteRole = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Role.findByIdAndDelete(id);
//     res.status(200).json({ message: "Role deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting role", error });
//   }
// };

// // Create a new permission
// exports.createPermission = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const permission = new Permission({ name, description });
//     await permission.save();
//     res
//       .status(201)
//       .json({ message: "Permission created successfully", permission });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating permission", error });
//   }
// };

// // Get all permissions
// exports.getAllPermissions = async (req, res) => {
//   try {
//     const permissions = await Permission.find();
//     res.status(200).json(permissions);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching permissions", error });
//   }
// };

// // Update permission
// exports.updatePermission = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const updatedPermission = await Permission.findByIdAndUpdate(id, updates, {
//       new: true,
//     });
//     res
//       .status(200)
//       .json({ message: "Permission updated successfully", updatedPermission });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating permission", error });
//   }
// };

// // Delete permission
// exports.deletePermission = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Permission.findByIdAndDelete(id);
//     res.status(200).json({ message: "Permission deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting permission", error });
//   }
// };

// =================================================================================================

// controllers/userController.js 
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Validate roles and fetch from DB
    const roleDocuments = await Role.find({ _id: { $in: roles } });

    if (!roleDocuments || roleDocuments.length !== roles.length) {
      return res.status(400).json({ message: "Invalid role(s) selected." });
    }

    // Create the user with roles
    const user = new User({ username, email, password, roles: roleDocuments });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate({
      path: "roles",
      populate: { path: "permissions" }, // Ensure permissions within roles are populated
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Update user (UserController.js)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Avoid re-hashing the password if it's not being updated
    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      updates.password = hashedPassword;
    } else {
      delete updates.password; // Ensure password is not modified if not provided
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, // Ensure validation runs on updates
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // Verify if permissions exist using their IDs directly
    const permissionIds = await Permission.find({
      _id: { $in: permissions },
    }).select("_id");

    if (permissionIds.length !== permissions.length) {
      return res
        .status(400)
        .json({ message: "Some permissions are invalid or do not exist." });
    }

    // Create a new role with the valid permissions
    const role = new Role({ name, permissions: permissionIds });
    await role.save();
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Error creating role", error });
  }
};

// Update an existing role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    // Fetch permissions using their IDs to validate them
    const permissionIds = await Permission.find({
      _id: { $in: permissions },
    }).select("_id");

    if (permissionIds.length !== permissions.length) {
      return res
        .status(400)
        .json({ message: "Some permissions are invalid or do not exist." });
    }

    // Update the role with the provided permissions
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name, permissions: permissionIds },
      { new: true, runValidators: true }
    ).populate("permissions");

    res.status(200).json({ message: "Role updated successfully", updatedRole });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role", error });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Error fetching roles", error });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    await Role.findByIdAndDelete(id);
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Error deleting role", error });
  }
};

// Create a new permission
exports.createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const permission = new Permission({ name, description });
    await permission.save();
    res.status(201).json({
      message: "Permission created successfully",
      permission,
    });
  } catch (error) {
    console.error("Error creating permission:", error);
    res.status(500).json({ message: "Error creating permission", error });
  }
};

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Error fetching permissions", error });
  }
};

// Update permission
exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedPermission = await Permission.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json({
      message: "Permission updated successfully",
      updatedPermission,
    });
  } catch (error) {
    console.error("Error updating permission:", error);
    res.status(500).json({ message: "Error updating permission", error });
  }
};

// Delete permission
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    await Permission.findByIdAndDelete(id);
    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    console.error("Error deleting permission:", error);
    res.status(500).json({ message: "Error deleting permission", error });
  }
};
