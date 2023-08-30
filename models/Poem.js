const mongoose = require("mongoose");

const poemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  lines: { type: [String], required: true },
});

module.exports = mongoose.model("Poems", poemSchema);
