const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// MongoDB Atlas Connection
mongoose
  .connect(
    "mongodb+srv://admin:admin@myapp.wcyhr.mongodb.net/?retryWrites=true&w=majority&appName=myApp",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Schema and model for Mood
const MoodSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, required: true },
});
const Mood = mongoose.model("Mood", MoodSchema);

// Routes

// GET /api/moods - Fetch all moods
app.get("/api/moods", async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (error) {
    console.error("Error fetching moods:", error);
    res.status(500).send("Error fetching moods");
  }
});

// POST /api/moods - Add a new mood
app.post("/api/moods", async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    const newMood = new Mood({ imageUrl, caption });
    await newMood.save();
    res.json(newMood);
  } catch (error) {
    console.error("Error saving mood:", error);
    res.status(500).send("Error saving mood");
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
