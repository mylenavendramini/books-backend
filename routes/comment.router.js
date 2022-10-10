const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

router.get("/", commentController.getComments);
router.post("/", commentController.postComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
