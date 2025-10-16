const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 10, required: true },
    image: { type: String },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);
module.exports = Review;
