const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    platform: {
      type: String,
      enum: ["PC", "Mobile", "PC & Mobile", "Consoles", "Consoles + PC"],
      required: true,
    },
    image: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Game = model("Game", gameSchema);
module.exports = Game;
