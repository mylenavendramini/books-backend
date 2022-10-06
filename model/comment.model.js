const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSquema = new Schema({
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    Ref: "User",
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    Ref: "Book",
  },
});

const Comment = mongoose.model("Comment", CommentSquema);
module.exports = Comment;
