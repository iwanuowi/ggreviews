const { Schema, model } = require("mongoose");

const feedbackSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

const Feedback = model("Feedback", feedbackSchema);
module.exports = Feedback;
