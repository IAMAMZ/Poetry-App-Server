const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  pwd: String,
  poems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poem" }],
});

module.exports = mongoose.model("User", userSchema);
