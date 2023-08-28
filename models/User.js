const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  refreshToken: String,
  roles: {
    type: Object,
    default: {
      User: 2001,
    },
  },
  poems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poems" }],
  words: [{ type: mongoose.Schema.Types.ObjectId, ref: "Words" }],
});

module.exports = mongoose.model("User", userSchema);
