const Review = require("../models/Review");

// Add review
const addReview = async (data) => {
  const review = new Review(data);
  const savedReview = await review.save();
  // populate user name before returning
  return await savedReview.populate("user", "name email");
};

// Get all reviews for a game
const getReviewsByGame = async (gameId) => {
  return await Review.find({ game: gameId })
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
};

// Get single review
const getReviewById = async (id) => {
  return await Review.findById(id).populate("user", "name email role _id");
};

// Update review
const updateReview = async (id, userId, updateData, isAdmin) => {
  const review = await Review.findById(id);
  if (!review) return null;

  // Allow only owner or admin
  if (review.user.toString() !== userId.toString() && !isAdmin) {
    throw new Error("Not authorized");
  }

  Object.assign(review, updateData);
  const updated = await review.save();
  return await updated.populate("user", "name email");
};

// Delete review
const deleteReview = async (id) => {
  return await Review.findByIdAndDelete(id);
};

module.exports = {
  addReview,
  getReviewsByGame,
  getReviewById,
  updateReview,
  deleteReview,
};
