// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Create HTTPS server
const fs = require("fs");
const https = require("https");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { createInitialAdminUser } = require("./utils/adminSetup"); // Import the function

const app = express();
app.use(cors());
app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     createInitialAdminUser(); // Call this function after DB connection is established
//   })
//   .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB connection with retry logic

// Retrieve environment variables
const username = process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const host = process.env.MONGO_HOST;
const ports = process.env.MONGO_PORTS.split(","); // Convert string to array
const replicaSetName = process.env.REPLICA_SET_NAME;
const authSource = process.env.AUTH_SOURCE;
const readPreference = process.env.READ_PREFERENCE;
const database = process.env.MONGO_INITDB_DATABASE;

// Optional TLS/SSL variables
// const useTLS = process.env.MONGO_TLS === "true";
// const tlsCAFile = process.env.MONGO_TLS_CA_FILE;
// const tlsCertFile = process.env.MONGO_TLS_CERT_FILE;
// const tlsKeyFile = process.env.MONGO_TLS_KEY_FILE;

// Construct the MongoDB URI
let mongoURI = `mongodb://${username}:${password}@${host}:${ports[0]},${host}:${ports[1]},${host}:${ports[2]}/${database}?replicaSet=${replicaSetName}&authSource=${authSource}&readPreference=${readPreference}`;
const connectWithRetry = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
    createInitialAdminUser(); // Call this function after DB connection is established
  } catch (err) {
    console.log("MongoDB connection error:", err);
    console.log("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};
connectWithRetry();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE), // Path to your private key
  cert: fs.readFileSync(process.env.SSL_CRT_FILE), // Path to your certificate
};

// Basic GET request for testing
app.get("/", (req, res) => {
  res.send("Hello HTTPS!");
});

// Start the HTTPS server
const PORT = process.env.PORT || 443; // Default to 443 if PORT is not defined
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
