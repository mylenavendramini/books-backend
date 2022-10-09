const express = require("express");
const route = express.Router();
const bookController = require("../controllers/book.controller");

route.get("/", bookController.getBooks);

// route.get("/", bookController.getBookWithUser);

route.post("/", bookController.postBook);

route.put("/:id", bookController.putBook);

route.delete("/:id", bookController.deleteBook);

module.exports = route;
