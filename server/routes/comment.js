const express = require("express");
const router = express.Router();
const { isValidUser } = require("../middleware/auth");
const multer = require("multer");
const {
  addComment,
  getCommentsByReview,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../controllers/comment");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Get single comment by ID
router.get("/single/:id", isValidUser, async (req, res) => {
  try {
    const comment = await getCommentById(req.params.id);
    res.json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching comment", error: err.message });
  }
});

// Add a comment
router.post(
  "/:reviewId",
  isValidUser,
  upload.single("image"),
  async (req, res) => {
    try {
      const { content } = req.body;
      const image = req.file ? req.file.filename : null;

      const comment = await addComment({
        review: req.params.reviewId,
        user: req.user._id,
        content,
        image,
      });

      res.status(201).json(comment);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error adding comment", error: err.message });
    }
  }
);

// Get all comments for a review
router.get("/:reviewId", async (req, res) => {
  try {
    const comments = await getCommentsByReview(req.params.reviewId);
    res.json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching comments", error: err.message });
  }
});

// Delete comment
router.delete("/:id", isValidUser, async (req, res) => {
  try {
    await deleteComment(req.params.id, req.user);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("❌ Backend delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update comment
router.put("/:id", isValidUser, async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await updateComment(req.params.id, req.user._id, content);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
