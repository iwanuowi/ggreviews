const Comment = require("../models/Comment");
const Review = require("../models/Review");

// Add a comment
exports.addComment = async ({ review, user, content, image }) => {
  // create the comment
  const newComment = await Comment.create({ review, user, content, image });

  // Add 1 to the number of comments on that review.
  await Review.findByIdAndUpdate(review, { $inc: { commentCount: 1 } });

  return newComment;
};

// Get all comments for a review
exports.getCommentsByReview = async (reviewId) => {
  // populate 'user' to show username etc.
  const comments = await Comment.find({ review: reviewId })
    .populate("user", "name _id")
    .sort({ createdAt: -1 }); // newest first
  return comments;
};

// Get a single comment by ID
exports.getCommentById = async (commentId) => {
  const Comment = require("../models/Comment");
  const comment = await Comment.findById(commentId).populate(
    "user",
    "name _id"
  );
  if (!comment) throw new Error("Comment not found");
  return comment;
};

// Delete comment
exports.deleteComment = async (commentId, user) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");
  // Check if owner or admin
  if (
    comment.user.toString() !== user._id.toString() &&
    user.role !== "admin"
  ) {
    throw new Error("Not authorized to delete this comment");
  }
  const reviewId = comment.review;
  await Comment.findByIdAndDelete(commentId);
  const review = await Review.findById(reviewId);
  if (review && review.commentCount > 0) {
    review.commentCount -= 1;
    await review.save();
  }
  return { message: "Comment deleted" };
};

// Update a comment
exports.updateComment = async (commentId, userId, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");

  // Ensure the user owns the comment
  if (comment.user.toString() !== userId.toString()) {
    throw new Error("Not authorized to update this comment");
  }

  comment.content = content;
  await comment.save();

  return comment;
};
