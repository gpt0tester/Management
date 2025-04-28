// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }], // Reference to roles
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error); // Pass error to next middleware
  }
});

// Hash password before updating the user
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Check if password is being updated
  if (update.password) {
    try {
      // Hash the new password
      update.password = await bcrypt.hash(update.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to add roles to the user
userSchema.methods.assignRole = async function (role) {
  if (!this.roles.includes(role._id)) {
    this.roles.push(role);
    await this.save();
  }
};

// Method to remove roles from the user
userSchema.methods.removeRole = async function (roleId) {
  this.roles = this.roles.filter(
    (role) => role.toString() !== roleId.toString()
  );
  await this.save();
};

// Export the User model
module.exports = mongoose.model("User", userSchema);
