const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/user-classes", {
  useNewUrlParser: true,
});

module.exports = mongoose.connection;
