const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require("./userController");

function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "1h",
  });
  return token;
}

exports.addPost = async (req, res) => {
  // const userId = req.user._id;
  const postData = {
    location:req.body.location,
    rentPerHour: req.body.rentPerHour,
    description: req.body.desc,
    images: req.body.img,
    userId: 1,
    createdAt: new Date(),
  };
  // userId: {type: Number, required: true},
  // location: {type: String, required: true,},
  // rentPerHour: {type: Number, required: true,},
  // images: [{type: String,required: false,},],
  // description: {type: String,required: true,},
  // try {
    // Save post data to MongoDB
    const newPost = new Post(postData);
    await newPost.save(); // Save the new post
    // const token = generateToken(userId);
    return res.json({
      // token,
      message: "Post created",
    });
  // } catch (error) {
//     return res.json({ success: false, message: "Internal server error" });
//   }
};

exports.viewPosts = async (req, res) => {
  const userId = req.user._id;
  try {
    // Fetch posts from MongoDB
    const posts = await Post.find({
      $or: [{ userId: userId }, { userId: { $in: req.user.followedIds } }],
    });
    const token = generateToken(userId);
    return res.json({
      token,
      data: posts,
    });
  } catch (error) {
    return res.json({ success: false, message: "Internal server error" });
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
