const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Error: MONGODB_URI environment variable not set.");
  process.exit(1);
}

const client = new MongoClient(uri);

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    app.get("/api/menu", async (req, res) => {
      try {
        const db = client.db("DessertShop");
        const collection = db.collection("MenuItems");
        const items = await collection.find({}).toArray();
        res.json(items);
      } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

startServer();
