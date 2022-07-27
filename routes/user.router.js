const express = require("express");
const route = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

route.get("/", authMiddleware(["ADMIN"]), userController.getUsers);
// route.get("/",  userController.getUsers);

route.post("/", userController.postUsers);

route.post("/login", userController.login);

route.put("/:id", userController.putUsers);

route.delete("/:id", userController.deleteUsers);

module.exports = route;
