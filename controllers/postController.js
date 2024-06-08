const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Post = require("../models/studioModel");
const User = require("./userController");
const NewInstrument = require("../models/newInstruments");
const { body, validationResult } = require("express-validator");

function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "1h",
  });
  return token;
}

exports.addPost = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("Request Body:", req.body); // Debug log

    const newPost = new Post({
      userId: userId,
      name: req.body.name,
      location: req.body.location,
      rentPerHour: req.body.rentPerHour,
      description: req.body.desc,
      images: req.body.img,
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

exports.createNewInstrument = [
  // Validate and sanitize inputs
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("brand").isString().notEmpty().withMessage("Brand is required"),
  body("rentPrice").isString().notEmpty().withMessage("rentPrice is required"),
  body("type").isString().notEmpty().withMessage("Type is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is required"),
  body("location").isString().notEmpty().withMessage("Location is required"),
  body("images")
    .optional()
    .isArray()
    .withMessage("Images should be an array of strings"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, name, brand, rentPrice, type, description, images } =
      req.body;

    try {
      const newInstrument = new NewInstrument({
        userId,
        name,
        brand,
        rentPrice,
        type,
        description,
        location,
        images,
      });

      const savedInstrument = await newInstrument.save();

      return res.status(201).json({
        success: true,
        data: savedInstrument,
      });
    } catch (error) {
      console.error("Error creating new instrument:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

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
    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }
    res.json(studio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
