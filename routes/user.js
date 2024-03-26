const express = require("express");
const router = express.Router();
const User = require("../models/user");
const sharp = require("sharp");
const multer = require("multer");
const storage = multer.memoryStorage();
const postController = require('../controllers/post');
const Post = require ('../models/post');
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid Image File, try again!", false);
  }
};
const uploads = multer({ storage, fileFilter });
const { createUser, userSignIn } = require("../controllers/user");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/user");
const { isAuth } = require("../middleware/auth");

router.post("/create-user", validateUserSignUp, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
router.post(
  "upload-profile",
  isAuth,
  uploads.single("profile"),
  async (req, res) => {
    const { user } = req;
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access!" });

    try {
      const profileBuffer = req.file.buffer;
      const { width, height } = await sharp(profileBuffer).metadata();
      const avatar = await sharp(profileBuffer)
        .resize(Math.round(width * 0.5), Math.round(height * 0.5))
        .toBuffer();
      await User.findByIdAndUpdate(user._id, { avatar });
      res.status(201).json({
        success: true,
        message: "Your profile image has been updated",
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server error, try again later" });
      console.log("Error uploading profile image", error.message);
    }
  }
);

router.post('/post', postController.addPost);
router.get('/posts', postController.viewPosts);
router.delete('/post/:postId', postController.deletePost);

module.exports = router;
