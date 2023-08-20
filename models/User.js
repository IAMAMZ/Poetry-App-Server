const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  refreshToken: String,
  poems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poems" }],
});

module.exports = mongoose.model("User", userSchema);
