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

const getPoemById = async (req, res) => {
  console.log({ requestParams: req.params, requestQuery: req.query });
  try {
    const { id: poemId } = req.params;
    console.log(poemId);
    const poem = await Poem.findById(poemId);
    if (!poem) {
      res.status(404).json({ error: "poem Not Found" });
    } else {
      res.json({ poem });
    }
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const postPoem = async (req, res) => {
  const poem = new Poem(req.body);

  try {
    console.log(req.body);
    await poem.save();
    res.status(201).json({ poem });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.messege });
  }
};

const deletePoem = async (req, res) => {
  try {
    const poemId = req.params.id;
    const result = await Poem.deleteOne({ _id: poemId });
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.messege });
  }
};

module.exports = { getAllPoems, getPoemById, postPoem, deletePoem };
