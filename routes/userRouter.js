require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const multer = require("multer");
const storage = multer.diskStorage({});
const postController = require("../controllers/post");
const userController = require("../controllers/userController");
const { isAuth } = require("../middleware/generateJWT");

const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/userValidation");

// Middleware to filter file types for uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Accept image files
  } else {
    cb("Invalid Image File, try again!", false); 
  }
};

// Multer configuration for file uploads
const uploads = multer({ storage, fileFilter });

// Route for adding a new post
router.post("/user/post", isAuth, postController.addPost); // Handles adding a new post

// Route for viewing all posts
router.get("/posts", isAuth, postController.viewPosts); // Handles viewing all posts

// Route for deleting a post by ID
router.delete("/post/:postId", isAuth, postController.deletePost); // Handles deleting a post

// Route for initiating the forgot password process
router.post("/forgotPassword", userController.forgotPassword); // Handles initiating forgot password process

// Route for requesting password reset
router.post('/request-password-reset', userController.forgotPassword); // Handles requesting password reset

// Route for resetting password
router.patch('/reset-password/:token', userController.resetPassword); // Handles resetting password

// Route for rendering the reset password page
router.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  res.render('reset-password', { token }); 
});

// Route for updating password after reset
router.post('/reset-password/:token', userController.resetPassword); // Handles updating password after reset

// Route for creating a new user
router.post("/create-user", validateUserSignUp, userValidation, userController.createUser); // Handles creating a new user

// Route for user sign-in
router.post("/sign-in", validateUserSignIn, userValidation, userController.userSignIn); // Handles user sign-in

// Route for user sign-out
router.post('/sign-out', isAuth, userController.userLogout); // Handles user sign-out

// Route for uploading profile picture
router.post("/upload-profile", isAuth, uploads.single("profile"), userController.uploadProfileImage); // Handles uploading profile picture

module.exports = router;
