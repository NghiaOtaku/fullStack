require("dotenv").config();
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const Post = require("../models/Posts");
router.post("/", async (req, res) => {
  const { title, description, url, status } = req.body;

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });

  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("http://") ? url : `http://${url}`,
      status: status || "TO LEARN",
      user: "647873a70b07f0ea8f5b0a63",
    });

    await newPost.save();

    res.json({
      success: true,
      message: "Happy learning!!!",
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
