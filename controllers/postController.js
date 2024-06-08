const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Post = require("../models/studioModel");
const User = require("./userController");
const NewInstrument = require("../models/newInstruments");
const { body, validationResult } = require("express-validator");
const { default: bufferToDataUrl } = require("buffer-to-data-url");
const { v2: cloudinary } = require("cloudinary");

function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "1h",
  });
  return token;
}

exports.getUser = async (req, res) => {
  try {
    const userId = req.user;

    console.log(userId);

    return res.json({
      message: "success",
      user: userId,
    });
  } catch (error) {
    console.error("Error:", error); // Debug log
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.addPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;

    console.log("Request Body:", req.body); // Debug log
    const file = req.files.images;
    if (file) {
      const dataUrl = bufferToDataUrl("image/png", file.data);

      // console.log(dataUrl);
      const upload_preset = "ml_default";
      var uploadResult = await cloudinary.uploader.unsigned_upload(
        dataUrl,
        upload_preset,
        {
          public_id: new Date().toLocaleTimeString() + user._id,
        },
      );
    }
    const newPost = new Post({
      userId: userId,
      name: req.body.name,
      location: req.body.location,
      rentPerHour: req.body.rentPerHour,
      description: req.body.desc,
      images: uploadResult.url,
      createdAt: new Date(),
    });

    console.log("New Post:", newPost); // Debug log

    // Save the new post
    await newPost.save();

    return res.json({
      message: "Post created",
    });
  } catch (error) {
    console.error("Error:", error); // Debug log
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.viewNewStudios = async (req, res) => {
  try {
    // Fetch posts sorted by createdAt field in descending order
    const posts = await Post.find({}).sort({ createdAt: -1 });

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

// Fetch trending studios
exports.viewTrendingStudios = async (req, res) => {
  try {
    // Assuming trending studios are determined by number of likes
    const trendingStudios = await Post.find({}).sort({ likes: -1 }).limit(10);

    return res.json({
      success: true,
      data: trendingStudios,
    });
  } catch (error) {
    console.error("Error fetching trending studios:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.viewNewInstruments = async (req, res) => {
  try {
    const instruments = await NewInstrument.find({}).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: instruments,
    });
  } catch (error) {
    console.error("Error fetching new instruments:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.createNewInstrument = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;

    console.log("Request Body:", req.body);
    const file = req.files.images;

    if (file) {
      const dataUrl = bufferToDataUrl("image/png", file.data);
      const upload_preset = "ml_default";
      var uploadResult = await cloudinary.uploader.unsigned_upload(
        dataUrl,
        upload_preset,
        {
          public_id: new Date().toLocaleTimeString() + user._id,
        },
      );
    }

    const newInstrument = new NewInstrument({
      userId: userId,
      name: req.body.name,
      brand: req.body.brand,
      rentPrice: req.body.rentPrice,
      type: req.body.type,
      description: req.body.description,
      location: req.body.location,
      images: uploadResult ? uploadResult.url : null,
      createdAt: new Date(),
    });

    console.log("New Instrument:", newInstrument); // Debug log

    // Save the new instrument
    await newInstrument.save();

    return res.status(201).json({
      message: "Instrument created",
      data: newInstrument,
    });
  } catch (error) {
    console.error("Error:", error); // Debug log
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

exports.algoliaViewStudio = async (req, res) => {
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

exports.algoliaViewInstrument = async (req, res) => {
  try {
    const posts = await NewInstrument.find({});

    return res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.Favorites = async (req, res) => {
  try {
    // Extract user ID and item ID from the request body
    const { userId, itemId } = req.body;

    // Check if the item already exists in the user's favorites
    const favorite = await Favorites.findOne({ userId, itemId });

    if (favorite) {
      // If the item exists, delete it
      await Favorites.deleteOne({ userId, itemId });
      res.status(200).json({ message: "Item removed from favorites" });
    } else {
      // If the item does not exist, add it to the user's favorites
      await Favorites.create({ userId, itemId });
      res.status(200).json({ message: "Item added to favorites" });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error processing favorites",
      error: error.message,
    });
  }
};

exports.deleteFavorites = async (req, res) => {
  try {
    // Extract user ID and item ID from the request body
    const { userId, itemId } = req.body;

    // Check if the item exists in the user's favorites
    const favorite = await Favorites.findOne({ userId, itemId });

    if (favorite) {
      // If the item exists, delete it
      await Favorites.deleteOne({ userId, itemId });
      res.status(200).json({ message: "Item removed from favorites" });
    } else {
      // If the item does not exist, return an error message
      res.status(404).json({ message: "Item not found in favorites" });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error removing item from favorites",
      error: error.message,
    });
  }
};

exports.getStudioById = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.studioId);
    console.log(studio);
    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }
    res.json(studio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
