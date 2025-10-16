// routes/reviews.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { isValidUser } = require("../middleware/auth");
const multer = require("multer");

const {
  addReview,
  getReviewsByGame,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/review");

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // folder to save review images
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// POST /games/:gameId/reviews
router.post("/", isValidUser, upload.single("image"), async (req, res) => {
  try {
    const { title, content, rating } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const review = await addReview({
      game: req.params.gameId,
      user: req.user._id,
      title,
      content,
      rating,
      image,
    });

    // prepend full URL for frontend
    const reviewWithFullImage = {
      ...review._doc,
      image: review.image
        ? `${req.protocol}://${req.get("host")}${review.image}`
        : null,
    };

    res.status(201).json(reviewWithFullImage);
  } catch (err) {
    console.error("Error adding review:", err);
    res
      .status(500)
      .json({ message: "Error adding review", error: err.message });
  }
});

// GET /games/:gameId/reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await getReviewsByGame(req.params.gameId);

    // make image URLs absolute
    const cleanedReviews = reviews.map((review) => ({
      ...review._doc,
      image: review.image
        ? `${req.protocol}://${req.get("host")}${review.image}`
        : null,
    }));

    res.status(200).json(cleanedReviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
});

// GET /reviews/:id
router.get("/:id", async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const reviewWithFullImage = {
      ...review._doc,
      image: review.image
        ? `${req.protocol}://${req.get("host")}${review.image}`
        : null,
    };

    res.status(200).json(reviewWithFullImage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching review", error: err.message });
  }
});

// PUT /reviews/:id
router.put("/:id", isValidUser, upload.single("image"), async (req, res) => {
  try {
    const { title, content, rating } = req.body;
    const updateData = { title, content, rating };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedReview = await updateReview(
      req.params.id,
      req.user._id,
      updateData,
      req.user.isAdmin
    );

    if (!updatedReview)
      return res.status(404).json({ message: "Review not found" });

    const reviewWithFullImage = {
      ...updatedReview._doc,
      image: updatedReview.image
        ? `${req.protocol}://${req.get("host")}${updatedReview.image}`
        : null,
    };

    res.status(200).json(reviewWithFullImage);
  } catch (err) {
    console.error("Error updating review:", err);
    res
      .status(500)
      .json({ message: "Error updating review", error: err.message });
  }
});

// DELETE /reviews/:id
router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const review = await getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      userRole !== "admin" &&
      review.user._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to delete this review",
      });
    }

    await deleteReview(reviewId);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res
      .status(500)
      .json({ message: "Error deleting review", error: err.message });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { isValidUser, isAdmin } = require("../middleware/auth");

// const {
//   addReview,
//   getReviewsByGame,
//   getReviewById,
//   deleteReview,
// } = require("../controllers/review");

// // Add a review (logged-in users)
// router.post("/:gameId", isValidUser, async (req, res) => {
//   try {
//     const { title, content, rating } = req.body;
//     const review = await addReview({
//       game: req.params.gameId,
//       user: req.user._id,
//       title,
//       content,
//       rating,
//     });
//     res.status(201).json(review);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error adding review", error: err.message });
//   }
// });

// // Get all reviews for a game
// router.get("/:gameId", async (req, res) => {
//   try {
//     const reviews = await getReviewsByGame(req.params.gameId);
//     res.json(reviews);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error fetching reviews", error: err.message });
//   }
// });

// // Delete review (admin only)
// router.delete("/:id", isAdmin, async (req, res) => {
//   try {
//     await deleteReview(req.params.id);
//     res.json({ message: "Review deleted" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error deleting review", error: err.message });
//   }
// });

// module.exports = router;
