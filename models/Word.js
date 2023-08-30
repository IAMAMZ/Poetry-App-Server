const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: String,
  meanings: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "Meanings array cannot be empty!",
    },
  },
});

module.exports = mongoose.model("Words", wordSchema);
