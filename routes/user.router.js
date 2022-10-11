const express = require("express");
const route = express.Router();
const userController = require("../controllers/user.controller");

route.get("/", userController.getUsers);

route.post("/", userController.postUsers);

route.put("/:id", userController.putUsers);

route.delete("/:id", userController.deleteUsers);

module.exports = route;
