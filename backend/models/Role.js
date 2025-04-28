// models/Role.js
const mongoose = require("mongoose");

// Define the schema for roles
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Role name, e.g., 'admin', 'user'
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }], // Array of permissions associated with this role
});

// Export the Role model
module.exports = mongoose.model("Role", roleSchema);
