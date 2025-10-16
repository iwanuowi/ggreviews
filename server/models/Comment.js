const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    review: { type: Schema.Types.ObjectId, ref: "Review", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;
