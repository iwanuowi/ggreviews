const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { isValidUser } = require("../middleware/auth");

// GET all feedbacks
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create a new post
router.post("/", isValidUser, async (req, res) => {
  try {
    const { message, rating } = req.body;

    if (!message || !rating) {
      return res.status(400).json({ error: "Message and rating are required" });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      message,
      rating,
    });

    const populatedFeedback = await Feedback.findById(feedback._id).populate(
      "user",
      "name email role"
    );

    res.status(201).json(populatedFeedback);
  } catch (err) {
    console.error("Error creating feedback:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE feedback
router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    // Check if user is admin or owner of feedback
    if (
      req.user.role !== "admin" &&
      feedback.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this feedback" });
    }
    await feedback.deleteOne();
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
