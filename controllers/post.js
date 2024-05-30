const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Post = require("../models/post");

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

exports.addPost = async (req, res) => {
  const userId = req.user._id; // Extract userId from authenticated user session
  const { location, rentPerHour, desc: description, img: images } = req.body;

  const postData = {
    location,
    rentPerHour,
    description,
    images,
    userId: mongoose.Types.ObjectId(userId), // Ensure userId is ObjectId
    createdAt: new Date(),
  };

  try {
    const newPost = new Post(postData);
    await newPost.save();

    const token = generateToken(userId);

    return res.json({
      success: true,
      token,
      message: "Post created",
      post: newPost,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
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
  const userId = req.user._id; // Ensure userId is extracted from authenticated user session
  try {
    const result = await Post.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.postId),
      userId: mongoose.Types.ObjectId(userId),
    });
    if (result.deletedCount > 0) {
      const token = generateToken(userId);
      return res.json({
        success: true,
        token,
        message: "Post deleted!",
      });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "You can't delete this post" });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.Favorites = (req, res) => {
  // Logic to add the item to the user's favorites
  // You can access the data from the request body using req.body
  try {
    // Perform the "add to favorites" logic here
    res.status(200).json({ message: "Item added to favorites" });
  } catch (error) {
    res.status(400).json({
      message: "Error adding item to favorites",
      error: error.message,
    });
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
