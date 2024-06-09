const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const CustomError = require("../Utils/CustomError");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const UserOTPVerification = require("../models/userOTPVerification");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const { v2: cloudinary } = require("cloudinary");
const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const { default: bufferToDataUrl } = require("buffer-to-data-url");
const Post = require("../models/studioModel");

// createUser function in userController.js
exports.createUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    username,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    number,
    address,
    role,
    avatar,
  } = req.body;

  try {
    const isNewUser = await User.isThisEmailInUse(email);
    if (!isNewUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already in use, please try again",
      });
    }

    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      number,
      address,
      role,
      avatar,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "30d",
    });

    user.accessToken = token;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: "User is not found!" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({
      success: false,
      message: "Email or Password is Incorrect!",
    });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  });

  user.accessToken = token;
  await user.save();

  res.json({ success: true, user, token });
};

exports.uploadProfileImage = async (req, res) => {
  // console.log(req.files.image);
  const { user } = req;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access!" });

  try {
    const file = req.files.image;
    const dataUrl = bufferToDataUrl("image/png", file.data);

    // console.log(dataUrl);
    const upload_preset = "ml_default";
    const uploadResult = await cloudinary.uploader.unsigned_upload(
      dataUrl,
      upload_preset,
      {
        public_id: new Date().toLocaleTimeString() + user._id,
      },
    );

    // Update user's avatar in MongoDB
    await User.findByIdAndUpdate(user._id, { avatar: uploadResult?.url });

    const profileImageUrl = `/profile-images/${user._id}`;

    res.status(201).json({
      success: true,
      message: "Your profile image has been updated",
      profileImageUrl: uploadResult?.url,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error, try again later" });
    // console.log("Error uploading profile image", error.message);
  }
};

exports.userLogout = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.accessToken = "";
    await user.save();

    return res.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging out user",
    });
  }
};

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required",
    });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "Account not linked to the given email",
    });
  }

  console.log("User before setting reset token:", user);

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  console.log("User after setting reset token:", user);

  const resetUrl = `https://studioseeker-h2vx.onrender.com/reset-password/${resetToken}`;

  const emailTemplate = `
    <html>
      <body>
        <h1>Password Reset Request</h1>
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      </body>
    </html>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: "studioseekerbusiness@gmail.com",
    to: email,
    subject: "Password Reset Request",
    html: emailTemplate,
  });

  return res.status(200).json({
    status: "success",
    message: "Password reset link has been sent to your email",
    resetUrl: resetUrl,
  });
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      const error = new CustomError("Token is invalid or expired", 400);
      return next(error);
    }

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      const error = new CustomError(
        "Password and confirmPassword are required",
        400,
      );
      return next(error);
    }

    if (password !== confirmPassword) {
      const error = new CustomError("Passwords do not match", 400);
      return next(error);
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangeAt = Date.now();

    await user.save();

    const loginToken = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "30d",
    });

    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
      token: loginToken,
    });
  } catch (error) {
    next(error);
  }
});

exports.navigateResetPassword = asyncErrorHandler(async (req, res, next) => {
  try {
    const token = req.params.token;

    res.send(`
      <form action="/reset-password/${token}" method="POST">
        <input type="password" name="password" placeholder="New Password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
        <button type="submit">Reset Password</button>
      </form>
    `);
  } catch (error) {
    next(error);
  }
});

exports.createBooking = asyncErrorHandler(async (req, res, next) => {
  try {
    const userr = req.user;
    const userId = userr._id; // Extract the user ID from the authenticated user

    const { postId, duration } = req.body;

    console.log("Received data:", { userId, postId, duration });

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId:", userId);
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.log("Invalid postId:", postId);
      return res
        .status(400)
        .json({ success: false, message: "Invalid postId" });
    }

    // Assuming you have User and Post models imported and defined
    // const User = require('../models/userModel');
    // const Post = require('../models/postModel');

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found:", postId);
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const newBooking = new Booking({ userId, postId, duration });
    await newBooking.save();

    console.log("Booking created successfully:", newBooking);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
});

exports.getUserBookings = async (req, res) => {
  const { userId } = req.user;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }

    const bookings = await Booking.find({ userId }).populate("postId");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

/* const sendOTPVerificationEmail = async () => {
    try {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "verify your Email",
        html: `<p> Enter <b>${otp}</b> in the app to verify your email address and complete
        </p><p>This code <b> expires in 1 hour </b>.</p>`,
      };
      const saltRounds = 10;
      const hashedOTP = await bcrypt.hash(otp, saltRounds);
      const newOTPVerification = await new UserOTPVerification({
        userId: _id,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 1000,
      });
      await newOTPVerification.save();
      await transporter.sendMail(mailOptions);
      res.json({
        status: "Pending",
        message: "Verification OTP Email has been sent",
        data: {
          userId: _id,
          email,
        },
      });
    } catch (error) {
      res.json({
        status: "Failed",
        message: error.message,
      });
    }
  }; */
