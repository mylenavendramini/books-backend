const mongoose = require("mongoose");
const Comment = require("../model/comment.model");

exports.getComments = async (request, response) => {
  try {
    const limit = parseInt(request.query.limit);
    const skip = parseInt(request.query.page) * limit;
    const { page, userId, bookId } = request.query;

    if (page && limit && userId && !bookId) {
      const comments = await Comment.find(
        {},
        { user: userId },
        {
          limit: limit,
          skip: skip,
          sort: { _id: -1 },
        }
      ).populate({
        path: "user",
        model: "User",
      });
      if (comments) {
        response.status(202).send({
          message: "with page, limit, user, but no book",
          data: comments,
        });
      } else {
        response.status(400).send("Error! 1");
      }
    } else if (limit && page && userId && bookId) {
      const comments = await Comment.find(
        {},
        { book: bookId, user: userId },
        { limit: limit, skip: skip, sort: { _id: -1 } }
      )
        .populate({
          path: "book",
          model: "Book",
        })
        .populate({
          path: "user",
          model: "User",
        });
      if (comments) {
        response
          .status(202)
          .send({ message: "with page, limit, user and book", data: comments });
      } else {
        response.status(400).send("Error! 2");
      }
    } else if (limit && page && !userId && bookId) {
      const comments = await Comment.find(
        {},
        { book: bookId },
        { limit: limit, skip: skip, sort: { _id: -1 } }
      ).populate({
        path: "book",
        model: "Book",
      });
      if (comments) {
        response.status(202).send({ message: "with no user", data: comments });
      } else {
        response.status(400).send("Error! 3");
      }
    } else {
      const comments = await Comment.find(
        {},
        {},
        { limit: limit, skip: skip, sort: { _id: -1 } }
      );
      if (comments) {
        response
          .status(202)
          .send({ message: "with no user or book", data: comments });
      } else {
        response.status(400).send("Error! 4");
      }
    }
  } catch (error) {
    console.log(error.message);
    response.status(400).send("There was an error showing the comments.");
  }
};

exports.postComment = async (request, response) => {
  try {
    const { description } = request.body;
    const comment = await Comment.create({ description });
    if (comment) {
      response.status(200).send({ message: "Comment created.", data: comment });
    } else {
      response.status(400).send("Error! Comment not created.");
    }
  } catch (error) {
    console.log(error.message);
    response.status(400).send("There was an error creating the comments.");
  }
};

exports.deleteComment = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedComment = await Comment.deleteOne({ _id: id });
    if (deletedComment.deletedCount > 0) {
      response.status(200).send({ message: "Commente deleted." });
    } else {
      response.stauts(400).send("Error! Comment not deleted.");
    }
  } catch (error) {
    console.log(error.message);
    response.stauts(400).send("There was an error creating the comments.");
  }
};
