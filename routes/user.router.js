const express = require("express");
const route = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

route.get("/", authMiddleware(["USER"]), userController.getUsers);
// route.get("/",  userController.getUsers);

route.post("/", userController.postUsers);

route.post("/login", userController.login);

route.put("/:id", authMiddleware(["USER"]), userController.putUsers);

route.delete("/:id", authMiddleware(["USER"]), userController.deleteUsers);

module.exports = route;
