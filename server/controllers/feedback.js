const Feedback = require("../models/Feedback");

// Create a new feedback
const createFeedback = async (req, res) => {
  try {
    const { message, rating } = req.body;
    if (!message || !rating) {
      return res
        .status(400)
        .json({ error: "Message and rating are required." });
    }
    const feedback = await Feedback.create({
      user: req.user._id,
      message,
      rating,
    });
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all feedbacks
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "username email role")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createFeedback, getFeedbacks };
