const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.jwt);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const { user, pwd } = req.body;

  const foundUser = await User.findOne({ username: user });

  if (!foundUser) {
    console.log("second 403 executed");
    return res.sendStatus(403); //send Forbidden
  }
  Object.values(foundUser.roles);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign(
      { Userinfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
