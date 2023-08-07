const mongoose = require("mongoose");

const poemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  lines: [String],
});

module.exports = mongoose.model("Poems", poemSchema);
