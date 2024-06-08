require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
// const multer = require("multer");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const { isAuth } = require("../middleware/generateJWT");
const settingsController = require("../controllers/settingsController");

const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/userValidation");

// Configure Multer storage
// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// Initialize Multer upload
// const upload = multer({ dest: "/uploads" });

// Route for adding a new post
router.post("/user/post", isAuth, postController.addPost); // Handles adding a new post
router.get("/user", isAuth, postController.getUser); // Handles adding a new post
router.post("/createNewInstrument", isAuth, postController.createNewInstrument);
// route for adding a post to your favorites
router.post("/favorites", isAuth, postController.Favorites);

// Route for viewing all posts
router.get("/viewNewStudios", isAuth, postController.viewNewStudios); // Handles viewing all posts
router.get("/viewTrendingStudios", isAuth, postController.viewTrendingStudios); // Handles viewing all posts
router.get("/viewNewInstruments", isAuth, postController.viewNewInstruments); // Handles viewing all posts
router.get("/algoliaStudio", postController.algoliaViewStudio); // Handles viewing all posts
router.get("/algoliaInstrument", postController.algoliaViewInstrument);
router.get("/studios/:studioId", postController.getStudioById);

// Route for deleting a post by ID
router.delete("/post/:postId", isAuth, postController.deletePost); // Handles deleting a post

// Route for initiating the forgot password process
router.post("/forgotPassword", userController.forgotPassword); // Handles initiating forgot password process

// Route for requesting password reset
router.post("/request-password-reset", userController.forgotPassword); // Handles requesting password reset

// Route for resetting password
router.patch("/reset-password/:token", userController.resetPassword); // Handles resetting password

router.post("/create-booking", isAuth, userController.createBooking);
router.get("/user-bookings/:userId", userController.getUserBookings);

//Settings API
router.post("/email", settingsController.updateEmail);
router.post("/phone", settingsController.updatePhoneNumber);
router.post("/address", settingsController.updateAddress);
router.delete("/address", settingsController.deleteAddress);

// Route for rendering the reset password page
router.get("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  res.render("reset-password", { token });
});

// Route for updating password after reset
router.post("/reset-password/:token", userController.resetPassword); // Handles updating password after reset

// Route for creating a new user
router.post(
  "/create-user",
  validateUserSignUp,
  userValidation,
  userController.createUser
); // Handles creating a new user

// Route for user sign-in
router.post(
  "/sign-in",
  validateUserSignIn,
  userValidation,
  userController.userSignIn
); // Handles user sign-in

// Route for user sign-out
router.post("/sign-out", isAuth, userController.userLogout); // Handles user sign-out

// Route for uploading profile picture
router.post(
  "/upload-profile-image",
  isAuth,
  // upload.single("image"),
  userController.uploadProfileImage
);

module.exports = router;
