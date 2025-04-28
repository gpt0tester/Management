// // controllers/authController.js
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// exports.register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const user = new User({ username, email, password });
//     await user.save();
//     res.status(201).json({ message: "User registered successfully." });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering user.", error });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the email is provided
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please provide email and password." });
//     }

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found." });
//     }

//     // Compare the provided password with the stored hash
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Incorrect password." });
//     }

//     // Check if JWT_SECRET is set in environment variables
//     if (!process.env.JWT_SECRET) {
//       console.error("JWT_SECRET is not defined in environment variables.");
//       return res.status(500).json({ message: "Server configuration error." });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.json({ token, message: "Login successful." });
//   } catch (error) {
//     console.error("Error during login:", error);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// };

// ===================================================================

// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Role = require("../models/Role"); // Assuming roles might be needed during registration
const dotenv = require("dotenv");

dotenv.config();

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email, and password." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create a new user instance
    const user = new User({ username, email, password });

    // Optionally, assign a default role here if needed
    const defaultRole = await Role.findOne({ name: "user" }); // Ensure a 'user' role exists in your roles collection
    if (defaultRole) {
      user.roles.push(defaultRole._id);
    }

    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user.", error });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    // Find the user by email
    const user = await User.findOne({ email })
      .select("+password")
      .populate("roles"); // Populate roles to ensure they are loaded
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Compare the provided password with the stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    // Check if JWT_SECRET is set in environment variables
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return res.status(500).json({ message: "Server configuration error." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, message: "Login successful." });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
