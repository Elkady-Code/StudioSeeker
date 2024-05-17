require('dotenv').config();
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
const { isAuth } = require("../middleware/generateJWT");
const UserOTPVerification = require("../models/userOTPVerification");
const { createUser, userSignIn } = require("../controllers/userController");
const { userLogout } = require("../controllers/userController");
const { validateToken } = require("../middleware/validateToken");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/userValidation");
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid Image File, try again!", false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post("/user/post", isAuth, postController.addPost); //upload up a post API

router.get("/posts", isAuth, postController.viewPosts); //get a post

router.delete("/post/:postId", isAuth, postController.deletePost); //delete a post

router.post("/forgotPassword", userController.forgotPassword); //forgotPassword API

router.patch("/resetPassword/:token", userController.resetPassword); //resetPassword API using given token in MailTrap

router.post(
  "/create-user",
  validateUserSignUp,
  userValidation,
  userController.createUser
); //Create-user API with authentication

router.post(
  "/sign-in",
  validateUserSignIn,
  userValidation,
  userController.userSignIn
); //Sign-in API with authentication

router.post('/sign-out', validateToken, userLogout); //Sign-out API

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
); //uploading profile photo API

/* router.post("/verifyOTP", async (req, res) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed");
    } else {
      const userOTPVerificationRecord = await UserOTPVerification.find({
        userId,
      });
      if (userOTPVerificationRecord.length <= 0) {
        throw new Error(
          "Account record doesn't exist or has been verified already. Please sign up or log in."
        );
      } else {
        const { expiresAt } = userOTPVerificationRecord[0];
        const hashedOTP = userOTPVerificationRecord[0].otp;
        if (expiresAt < Date.now()) {
          UserOTPVerification.deleteMany({ userId });
          throw new Error("Code has expired. Please request again.");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            throw new Error("Invalid code passed. Check your inbox.");
          } else {
            await user.updateOne({ _id: userId }, { verified: true });
            await userOTPVerification.deleteMany({ userId });
            res.json({
              status: "Verified",
              message: `User email verified successfully.`,
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});


router.post("/resendOTPVerificationCode", async(req,res)=>{
  try {
    let {userId, email} = req.body;
    if(!userID || !email){
    throw Error("Empty user details are not allowed")
  }else{
    await userOTPVerification.deleteMany({userId});
    sendOTPVerificationEmail({_id: userId, email}, res);
  }
  } catch (error) {
    res.json({
      status:"Failed",
      message: error.message,
    });
  }
}) */

module.exports = router;
