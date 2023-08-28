const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: String,
  meanings: [String],
});

module.exports = mongoose.model("Word", wordSchema);
