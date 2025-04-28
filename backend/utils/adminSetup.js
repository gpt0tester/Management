// utils/adminSetup.js
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

// Administrator credentials
const Username = process.env.ADMIN_USERNAME;
const Email = process.env.ADMIN_EMAIL;
const Password = process.env.ADMIN_PASSWORD;

// Function to create default permissions if none exist
const createDefaultPermissions = async () => {
  // Define your default permissions (customize as needed)
  const defaultPermissions = [
    // Users Manager Permissions
    { name: "CREATE_USER", description: "Can create a user" },
    { name: "READ_USERS", description: "Can view users" },
    { name: "UPDATE_USER", description: "Can update a user" },
    { name: "DELETE_USER", description: "Can delete a user" },
    // Roles Manager Permissions
    { name: "CREATE_ROLE", description: "Can create a role" },
    { name: "READ_ROLES", description: "Can view roles" },
    { name: "UPDATE_ROLE", description: "Can update a role" },
    { name: "DELETE_ROLE", description: "Can delete a role" },
    // Permissions Manager Permissions
    { name: "CREATE_PERMISSION", description: "Can create a permission" },
    { name: "READ_PERMISSIONS", description: "Can view permissions" },
    { name: "UPDATE_PERMISSION", description: "Can update a permission" },
    { name: "DELETE_PERMISSION", description: "Can delete a permission" },
    // Files Manager Permissions
    { name: "UPLOAD_FILE", description: "Can upload a file" },
    { name: "READ_FILES", description: "Can view files" },
    { name: "OPEN_FILE", description: "Can open a file" },
    // Reports Manager Permissions
    { name: "SUBMIT_REPORT", description: "Can create a report" },
    { name: "READ_REPORT", description: "Can view report" },
    { name: "UPDATE_REPORT", description: "Can edit a report" },
  ];

  // Insert default permissions into the database
  const createdPermissions = await Permission.insertMany(defaultPermissions);
  console.log("Default permissions created.");
  return createdPermissions;
};

const createInitialAdminUser = async () => {
  try {
    // Check if an admin role exists
    let adminRole = await Role.findOne({ name: "Administrator" });
    if (!adminRole) {
      // Fetch all permissions
      let allPermissions = await Permission.find();

      // If no permissions exist, create default ones
      if (!allPermissions || allPermissions.length === 0) {
        allPermissions = await createDefaultPermissions();
      }
      const allPermissionIds = allPermissions.map((perm) => perm._id);

      // Create the admin role with all permissions
      adminRole = new Role({
        name: "Administrator",
        permissions: allPermissionIds,
      });
      await adminRole.save();
      console.log("Administrator role created.");
    }

    // Check if an admin user exists
    const adminUser = await User.findOne({ email: Email });
    if (!adminUser) {
      // Create the admin user with the Administrator role
      const newAdminUser = new User({
        username: Username,
        email: Email,
        password: Password, // Your pre-save hook in the User model will hash this
        roles: [adminRole._id],
      });
      await newAdminUser.save();
      console.log("Administrator user created");
    } else {
      console.log("Administrator user already exists.");
    }
  } catch (error) {
    console.error("Error creating initial administrator user:", error);
  }
};

module.exports = { createInitialAdminUser };
