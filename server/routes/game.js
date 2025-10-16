const express = require("express");
const multer = require("multer");
const router = express.Router();
const Game = require("../models/Game");
const { isAdmin, isValidUser } = require("../middleware/auth");
const {
  addGame,
  getGames,
  getGame,
  updateGame,
  deleteGame,
} = require("../controllers/game");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // folder to save images
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Get all games
router.get("/", async (req, res) => {
  try {
    const games = await getGames();

    const cleanedGames = games.map((game) => ({
      ...game._doc,
      image: game.image
        ? `${req.protocol}://${req.get("host")}/api${game.image}`
        : null,
    }));

    res.status(200).json(cleanedGames);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching games", error: err.message });
  }
});

// Add a new game (admin only)
router.post("/", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, genre, platform } = req.body;
    if (!title || !description || !genre || !platform) {
      return res
        .status(400)
        .json({ message: "Title, description, and genre are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const game = await addGame({
      title,
      description,
      genre,
      platform,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: "Error adding game", error: err.message });
  }
});

// Update a game (admin only)
router.put("/:id", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, genre, platform } = req.body;

    const updateData = { title, description, genre, platform };

    // Only update image if a new file was uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const game = await updateGame(req.params.id, updateData);

    // Prepend full URL to image for frontend
    const gameWithFullImage = {
      ...game._doc,
      image: game.image
        ? `${req.protocol}://${req.get("host")}${game.image}`
        : null,
    };

    res.status(200).json(gameWithFullImage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating game", error: err.message });
  }
});

// Delete a game (admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await deleteGame(req.params.id);
    res
      .status(200)
      .json({ message: `Game with ID ${req.params.id} has been deleted` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting game", error: err.message });
  }
});

// Find game ID
router.get("/:id", async (req, res) => {
  try {
    const game = await getGame(req.params.id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // prepend full URL to image
    const gameWithFullImage = {
      ...game._doc,
      image: game.image
        ? `${req.protocol}://${req.get("host")}${game.image}`
        : null,
    };

    res.status(200).json(gameWithFullImage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching game", error: err.message });
  }
});

// Like or Unlike
router.post("/:id/like", isValidUser, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const userId = req.user._id;
    const alreadyLiked = game.likes.includes(userId);

    if (alreadyLiked) {
      game.likes.pull(userId);
    } else {
      game.likes.push(userId);
    }

    await game.save();

    res.json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likesCount: game.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    console.error("Error liking game:", err);
    res.status(500).json({ message: "Error liking game", error: err.message });
  }
});

module.exports = router;
