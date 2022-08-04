const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const authConfig = require("../config/config");

const tokenBlacklistSchema = Schema({
  date: {
    type: Date,
    default: Date.now,
    expires: authConfig.timer,
  },
  token: {
    type: String,
    required: true,
  },
});

const tokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
module.exports = tokenBlacklist;
