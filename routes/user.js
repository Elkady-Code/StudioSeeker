const express = require("express");
const router = express.Router();
const User = require("../models/user");
const sharp = require("sharp");
const multer = require("multer");
const storage = multer.memoryStorage();
const postController = require("../controllers/post");
const Post = require("../models/post");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const userController = require("../controllers/userController");
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid Image File, try again!", false);
  }
};
const uploads = multer({ storage, fileFilter });
const { createUser, userSignIn } = require("../controllers/userController");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/user");
const { isAuth } = require("../middleware/generateJWT");

router.post("/create-user", validateUserSignUp, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
router.post(
  "/upload-profile", // <-- Corrected route path
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

router.post("/user/post", isAuth, postController.addPost);
router.get("/posts", isAuth, postController.viewPosts);
router.delete("/post/:postId", isAuth, postController.deletePost);

router.post("/forgotPassword", userController.forgotPassword);
router.patch("/resetPassword/:token", userController.resetPassword);

module.exports = router;
