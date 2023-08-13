const mongoose = require("mongoose");
const User = require("../models/User");

const bycrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ messege: "Username and Password are required" });
  }
  const foundUser = await User.findOne({ username: user });

  if (!foundUser) {
    return res.sendStatus(401); //send Unauthorized 401 code
  }
  //if user found evaluate password
  const match = await bycrypt.compare(pwd, foundUser.password);

  if (match) {
    //create JWT
    const accessToken = jwt.sign(
      { UserInfo: { username: foundUser.username } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    //saving the refreshToken with current user

    const userRefresh = await User.findOneAndUpdate(
      { username: user },
      { refreshToken: refreshToken }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
