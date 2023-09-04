const mongoose = require("mongoose");
const Poem = require("../models/Poem");
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

const getAllPoems = async (req, res) => {
  const [paramsUsername, jwtUsername, IsAuthorized] = checkParamUser(req, res);

  if (IsAuthorized) {
    try {
      const result = await User.findOne({ username: jwtUsername }).populate(
        "poems"
      );
      res.status(200).json({ poems: result.poems });
    } catch (e) {
      res.status(500).json({ error: e });
      console.log(e);
    }
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
  const [paramsUsername, jwtUsername, IsAuthorized] = checkParamUser(req, res);

  if (IsAuthorized) {
    try {
      // Check if the poem already exists based on its title and author
      let poem = await Poem.findOne({
        title: req.body.title,
        author: req.body.author,
      });

      // If the poem doesn't exist, create and save it
      if (!poem) {
        poem = new Poem(req.body);
        await poem.save();
      }

      // Find the user by their username and push the poem ObjectId into their poems array
      await User.findOneAndUpdate(
        { username: jwtUsername },
        { $addToSet: { poems: poem._id } } // $addToSet ensures no duplicate ObjectIds
      );

      res.status(201).json({ poem });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e.message });
    }
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

const deletePoemFromUser = async (req, res) => {
  const [paramsUsername, jwtUsername, IsAuthorized] = checkParamUser(req, res);

  if (IsAuthorized) {
    try {
      // Check if the poem exists based on its title and author
      let poem = await Poem.findOne({
        title: req.body.title,
        author: req.body.author,
      });

      // If the poem doesn't exist, return an error
      if (!poem) {
        return res.status(404).json({ error: "Poem not found" });
      }

      // Remove the poem ObjectId from the user's poems array
      await User.findOneAndUpdate(
        { username: jwtUsername },
        { $pull: { poems: poem._id } }
      );

      res.status(200).json({ message: "Poem removed from user successfully" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e.message });
    }
  }
};

module.exports = {
  getAllPoems,
  getPoemById,
  postPoem,
  deletePoem,
  deletePoemFromUser,
};
