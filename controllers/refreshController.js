const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.jwt);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken: refreshToken });

  if (!foundUser) {
    console.log(username);
    console.log("second 403 executed");
    return res.sendStatus(403); //send Forbidden
  }
  const roles = Object.values(foundUser.roles);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }
    console.log("The decoded username is >>>", decoded.username);
    const accessToken = jwt.sign(
      { UserInfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
