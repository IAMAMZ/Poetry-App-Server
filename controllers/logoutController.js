const mongoose = require("mongoose");
const User = require("../models/User");

const handleLogout = async (req, res) => {
  //On client also delete the access token
  const cookies = req.cookies;
  console.log("Cookies ........", cookies);
  console.log("cookies jwt ....", cookies.jwt);
  if (!cookies?.jwt) return res.sendStatus(204); //No content sent back when no cookies are there
  const refreshToken = cookies.jwt;

  //check if refreshToken in db

  const foundUser = await User.findOne({ refreshToken: refreshToken });

  console.log(foundUser);

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204); //successful but no contnet if there is no result
  }
  await User.findOneAndUpdate(
    { refreshToken: refreshToken },
    { refreshToken: "" }
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure:true -- only servers on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
