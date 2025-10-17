const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://sriramravichandran2006_db_user:Sriram023@contactform.hbpa4wr.mongodb.net/portfolioDB?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let contacts;

// Function to connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected ✅");

    const database = client.db("portfolioDB");
    contacts = database.collection("contacts");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

connectDB();

// ✅ Test route (for debugging)
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running fine!");
});

// ✅ Contact form POST route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("📥 Received form data:", req.body);

    if (!name || !email || !message) {
      console.log("❌ Missing field(s)");
      return res.status(400).json({ error: "All fields required!" });
    }

    const result = await contacts.insertOne({
      name,
      email,
      message,
      date: new Date(),
    });

    console.log("✅ Inserted document ID:", result.insertedId);
    res.status(200).json({ message: "Message saved successfully!", id: result.insertedId });

  } catch (err) {
    console.error("🔥 ERROR DETAIL:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
