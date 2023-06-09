require("dotenv").config();
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }

  try {
    const user = await User.findOne({ username });

    if (user)
      return res.status(400).json({
        success: false,
        message: "Username already in use",
      });

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "user created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//logon authentication
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });

    const passwordValid = await argon2.verify(user.password, password);

    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "user logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
