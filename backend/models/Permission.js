// models/Permission.js
const mongoose = require("mongoose");

// Define the schema for permissions
const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Name of the permission, e.g., 'view_users'
  description: { type: String }, // Optional description of what the permission does
});

// Export the Permission model
module.exports = mongoose.model("Permission", permissionSchema);
