const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  pages: {
    type: Number,
  },
  price: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  firstCap: {
    type: String,
  },
  reviews: {
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  status: {
    type: Boolean,
  },
  show: {
    type: Boolean,
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
