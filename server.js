const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors()); // Allow cross-origin requests from frontend

const uri = process.env.MONGODB_URI;

// Create a single MongoClient instance to reuse for better performance
const client = new MongoClient(uri);

app.get("/api/menu", async (req, res) => {
  try {
    // Connect only once and reuse connection
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
    }

    const db = client.db("DessertShop");           // ✅ Database name
    const collection = db.collection("MenuItems"); // ✅ Collection name
    const items = await collection.find({}).toArray();

    res.json(items);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
