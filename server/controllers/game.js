const Game = require("../models/Game");

// Get all games
const getGames = async () => {
  return await Game.find()
    .populate("genre", "name") // populate only the name field
    .sort({ createdAt: -1 });
};

// Get single game by ID
const getGame = async (id) => {
  return await Game.findById(id).populate("genre", "name");
};

// Add games
const addGame = async ({
  title,
  description,
  genre,
  platform,
  image,
  createdBy,
}) => {
  const imagePath = image || null;

  const newGame = new Game({
    title,
    description,
    genre,
    platform,
    image: imagePath,
    createdBy,
  });

  await newGame.save();
  return await newGame.populate("genre", "name");
};

// Update a game
const updateGame = async (id, data) => {
  const game = await Game.findByIdAndUpdate(id, data, { new: true }).populate(
    "genre",
    "name"
  );
  return game;
};

// Delete a game
const deleteGame = async (id) => {
  await Game.findByIdAndDelete(id);
};

const likeGame = async (req, res) => {
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
};

module.exports = {
  addGame,
  getGames,
  getGame,
  updateGame,
  deleteGame,
  likeGame,
};
