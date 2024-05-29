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
    location: req.body.location,
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
  try {
    // Save post data to MongoDB
    const newPost = new Post(postData);
    await newPost.save(); // Save the new post
    // const token = generateToken(userId);
    return res.json({
      // token,
      message: "Post created",
    });
  } catch (error) {
    return res.json({ success: false, message: "Internal server error" });
  }
};

exports.viewPosts = async (req, res) => {
  // const userId = req.user._id;
  // try {
  // Fetch posts from MongoDB
  try {
    // Fetch posts from MongoDB
    const posts = await Post.find({});
    console.log(posts);

    // If user ID is not needed for generating the token, you can skip the token generation part
    // Otherwise, ensure req.user is properly set up by middleware or adjust the logic accordingly

    // If you still need to generate a token, you might consider using a static or default user ID
    // const userId = "defaultUserId"; // Replace with actual logic if needed
    // const token = generateToken(userId);

    return res.json({
      success: true,
      // token, // Include this only if you are generating a token
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
  // } catch (error) {
  //   return res.json({ success: false, message: "Internal server error" });
  // }
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
