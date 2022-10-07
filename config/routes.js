const express = require("express");
const router = express.Router();

const userRouter = require("../routes/user.router");
const bookRouter = require("../routes/book.router");
const commentRouter = require("../routes/comment.router");

// create function - export
module.exports = (app) => {
  app.use("/api/users", userRouter);
  app.use("/api/books", bookRouter);
  app.use("/api/comments", commentRouter);
};
