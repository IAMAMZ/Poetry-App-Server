const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and Password are required" });
  }

  try {
    // Check for duplicate usernames in the db
    const existingUser = await User.findOne({ username: username });

    if (existingUser)
      return res.status(409).json({ message: "Username already exists" }); // Conflict

    // Encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Store the new user
    const newUser = new User({
      username: username,
      password: hashedPwd,
    });

    await newUser.save();

    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { handleNewUser };
