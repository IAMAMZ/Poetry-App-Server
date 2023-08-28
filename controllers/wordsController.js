const mongoose = require("mongoose");
const Word = require("../models/Word");
const User = require("../models/User");

const checkParamUser = (req, res) => {
  const paramsUsername = req.params.username;
  const jwtUsername = req.user;
  if (paramsUsername != jwtUsername) {
    res.sendStatus(401);
    return [paramsUsername, jwtUsername, false]; //unauthorized
  }
  return [paramsUsername, jwtUsername, true];
};

const getAllWords = async (req, res) => {
  const [paramsUsername, jwtUsername, IsAuthorized] = checkParamUser(req, res);

  if (IsAuthorized) {
    try {
      const result = await User.findOne({ username: jwtUsername }).populate(
        "words"
      );
      res.status(200).json({ poems: result.words });
    } catch (e) {
      res.status(500).json({ error: e });
      console.log(e);
    }
  }
};

const postWord = async (req, res) => {
  const [paramsUsername, jwtUsername, IsAuthorized] = checkParamUser(req, res);

  if (IsAuthorized) {
    try {
      // Check if the word already exists based on its title and author
      let word = await Word.findOne({
        word: req.body.word,
      });

      // If the poem doesn't exist, create and save it
      if (!word) {
        word = new Word(req.body);
        await word.save();
      }

      // Find the user by their username and push the poem ObjectId into their poems array
      await User.findOneAndUpdate(
        { username: jwtUsername },
        { $addToSet: { words: word._id } } // $addToSet ensures no duplicate ObjectIds
      );

      res.status(201).json({ word });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e.message });
    }
  }
};

const deleteWord = async (req, res) => {
  try {
    const poemId = req.params.id;
    const result = await Word.deleteOne({ _id: wordId });
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.messege });
  }
};

module.exports = { getAllWords, postWord, deleteWord };
