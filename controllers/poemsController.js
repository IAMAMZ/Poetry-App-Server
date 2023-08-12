const mongoose = require("mongoose");
const Poem = require("../models/Poem");

const getAllPoems = async (req, res) => {
  try {
    const result = await Poem.find();
    res.status(200).json({ poems: result });
  } catch (e) {
    res.status(500).json({ error: e.messege });
  }
};

module.exports = { getAllPoems };
