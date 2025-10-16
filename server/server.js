require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static uploads
// app.use("/uploads", express.static("uploads"));
// app.use("/api/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL + "/ggreviews");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
  }
}

// Routes
app.use("/api/users", require("./routes/user")); // signup/login
app.use("/api/games", require("./routes/game")); // games CRUD
app.use("/api/games/:gameId/reviews", require("./routes/review")); // nested reviews
app.use("/api/reviews", require("./routes/review"));
app.use("/api/comments", require("./routes/comment"));
app.use("/api/genres", require("./routes/genre"));
app.use("/api/feedbacks", require("./routes/feedback"));

// Default route
app.get("/api/", (req, res) => {
  res.send("Welcome to GGReviews 🎮");
});

// Start server
connectToMongoDB();
app.listen(8888, () => {
  console.log("🚀 Server running at http://localhost:8888");
});
