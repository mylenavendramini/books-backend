const Book = require("../model/book.model");

exports.getBooks = async (request, response) => {
  try {
    const limit = parseInt(request.query.limit);
    const skip = parseInt(request.query.page) * limit;
    // query is used for get
    const { page, userId, search } = request.query;
    // page, limit, userId are in the URL, eg. ?name=...
    if (page && limit && !userId && search) {
      const books = await Book.find(
        {},
        {
          name: { $regex: `.*${search}.*`, $options: "i" },
        },
        { skip: skip, limit: limit, sort: { _id: -1 } }
      );
      if (books) {
        response
          .status(202)
          .send({
            message: "with page, limit, search, but no user",
            data: books,
          })
          .populate({
            path: "comments",
            select: "description",
            model: "Comment",
          });
      } else {
        response.status(400).send("Error! 1");
      }
    } else if (page && limit && userId && !search) {
      const books = await Book.find(
        {},
        { user: userId },
        { skip: skip, limit: limit, sort: { _id: -1 } }
      )
        .populate({
          path: "user",
          model: "User",
        })
        .populate({
          path: "comments",
          select: "description",
          model: "Comment",
        });

      if (books) {
        response.status(202).send({
          message: "with page, limit, user and no search",
          data: books,
        });
      } else {
        response.status(400).send("Error! 2");
      }
    } else {
      const books = await Book.find(
        {},
        {},
        { skip: skip, limit: limit, sort: { _id: -1 } }
      ).populate({
        path: "comments",
        select: "description",
        model: "Comment",
      });

      if (books) {
        response.status(202).send({ message: "with no user", data: books });
      } else {
        response.status(400).send("Error! 3");
      }
    }
  } catch (error) {
    console.log(error.message);
    response.status(400).send("There was an error showing the books.");
  }
};

exports.postBook = async (request, response) => {
  try {
    const {
      name,
      category,
      description,
      imageUrl,
      pages,
      price,
      date,
      firstCap,
      reviews,
      comments,
      status,
      show,
    } = request.body;
    const book = Book.create({
      name,
      category,
      description,
      imageUrl,
      pages,
      price,
      date,
      firstCap,
      reviews,
      comments,
      status,
      show,
    });
    if (book) {
      response.send({ message: "Book created.", data: book });
    } else {
      response.status(400).send("Error! Book not created.");
    }
  } catch (error) {
    console.log(error.message);
    response.status(400).send("There was an error creating the book.");
  }
};

exports.putBook = async (request, response) => {
  try {
    const { id } = request.params;
    const book = request.body;
    const bookUpdated = await Book.findByIdAndUpdate(
      id,
      {
        $set: book,
      },
      {
        new: true,
      }
    );
    if (bookUpdated) {
      response.status(202).json({ message: "Book updated", data: bookUpdated });
    } else {
      response.status(400).send("Error! Book not updated.");
    }
  } catch (error) {
    console.log(error.message);
    response.status(400).send("There was an error updating the book.");
  }
};

exports.deleteBook = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedBook = await Book.deleteOne({ _id: id });
    if (deletedBook.deletedCount > 0) {
      response.status(200).json({ message: "Book deleted." });
    } else {
      response.status(400).send("Error! User not deleted.");
    }
  } catch (error) {
    console.log(error.message);
    response.status(400).send("There was an error deleting the book.");
  }
};
