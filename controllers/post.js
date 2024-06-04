const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Post = require("../models/postModel");
const User = require("./userController");

function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "1h",
  });
  return token;
}

exports.addPost = async (req, res) => {
  try {
    const userId = req.user._id;

    const newPost = new Post({
      userId: userId,
      location: req.body.location,
      rentPerHour: req.body.rentPerHour,
      description: req.body.desc,
      images: req.body.img,
      createdAt: new Date(),
    });

    // Save the new post
    await newPost.save();

    return res.json({
      message: "Post created",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.viewPosts = async (req, res) => {
  try {
    const posts = await Post.find({});

    return res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  const userId = req.user._id;
  try {
    // Delete post from MongoDB
    const result = await Post.deleteOne({
      _id: req.params.postId,
      userId: userId,
    });
    if (result.deletedCount > 0) {
      const token = generateToken(userId);
      return res.json({
        token,
        message: "Post deleted!",
      });
    } else {
      return res.json("You can't delete this post");
    }
  } catch (error) {
    return res.json({ success: false, message: "Internal server error" });
  }
};

exports.algoliaViewPosts = async (req, res) => {
  try {
    const posts = await Post.find({});

    return res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
