// Import necessary modules
const express = require("express");         // Express framework for building the backend API
const { MongoClient } = require("mongodb"); // MongoDB client to connect to the database
const cors = require("cors");                // Middleware to enable CORS (Cross-Origin Resource Sharing)
require("dotenv").config();                   // Load environment variables from .env file

const app = express();                        // Initialize Express app
const PORT = process.env.PORT || 5000;       // Use port from environment or default to 5000

app.use(cors());                             // Enable CORS for all routes

// Retrieve MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI;

// Check if the MongoDB URI exists, exit process if missing
if (!uri) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

// Create a new MongoClient instance
const client = new MongoClient(uri);

// Async function to connect to MongoDB and start the server
async function startServer() {
  try {
    // Connect to MongoDB cluster
    await client.connect();
    console.log("Connected to MongoDB");

    // Define API route to get menu items
    app.get("/api/menu", async (req, res) => {
      try {
        const db = client.db("DessertShop");           // Select the DessertShop database
        const collection = db.collection("MenuItems"); // Select the MenuItems collection

        // Fetch all documents from MenuItems collection
        const items = await collection.find({}).toArray();

        // Respond with JSON array of menu items
        res.json(items);
      } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" }); // Send error response if DB query fails
      }
    });

    // Start Express server and listen on the specified port
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (err) {
    // Log and exit if unable to connect to MongoDB
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

// Run the async startServer function
startServer();
