const express = require("express");
const router = express.Router();
const Genre = require("../models/Genre");

// GET all genres
router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new genre
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newGenre = new Genre({ name });
    await newGenre.save();
    res.status(201).json(newGenre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a genre by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Genre.findByIdAndDelete(id);
    res.json({ message: "Genre deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
