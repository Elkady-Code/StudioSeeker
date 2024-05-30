const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const CustomError = require("../Utils/CustomError");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const UserOTPVerification = require("../models/userOTPVerification");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const Role = require("../models/role");
const sharp = require("sharp");
const uploadcare = require("uploadcare")(
  process.env.UPLOADCARE_PUBLIC_KEY,
  process.env.UPLOADCARE_SECRET_KEY
);

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
    confirmPassword, // confirmPassword is included in the request body
    number,
    address,
    role,
    avatar,
  } = req.body;

  try {
    // Check if email is already in use
    const isNewUser = await User.isThisEmailInUse(email);
    if (!isNewUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already in use, please try again",
      });
    }

    // Create a new user instance
    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password,
      confirmPassword, // confirmPassword is included in the user object
      number,
      address,
      role,
      avatar,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "30d",
    });

    // Assign the token to the user's accessToken field
    user.accessToken = token; // Assign the token here
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
      token, // Optionally, you can send the token in the response
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

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  });

  // Update the user's accessToken field
  user.accessToken = token;
  await user.save();

  res.json({ success: true, user, token });
};

exports.uploadProfileImage = async (req, res) => {
  const { user } = req;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access!" });
  try {
    const file = req.file;

    // Upload image to Uploadcare
    const uploadedFile = await uploadcare.file.upload(file.path);

    // Construct the profile image URL
    const profileImageUrl = uploadedFile.cdnUrl;

    // Update the user's avatar field with the profile image URL
    await User.findByIdAndUpdate(user._id, { avatar: profileImageUrl });

    res.status(201).json({
      success: true,
      message: "Your profile image has been updated",
      profileImageUrl: profileImageUrl,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error, try again later" });
    console.log("Error uploading profile image", error.message);
  }
};


exports.userLogout = async (req, res) => {
  try {
    // Extract the user ID from the request body or from the authenticated user session
    const userId = req.user._id; // Assuming you have middleware that extracts the user from the request

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Invalidate the access token (remove it or mark it as expired)
    user.accessToken = ""; // Assuming accessToken is stored in the user document
    await user.save();

    return res.json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    console.error(error);
    return res.json({
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

  // Log user document before setting the reset token
  console.log("User before setting reset token:", user);

  // Generate password reset token and save it to the database
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Log user document after setting the reset token
  console.log("User after setting reset token:", user);

  // Construct password reset URL
  const resetUrl = `https://studioseeker-h2vx.onrender.com/reset-password/${resetToken}`;

  // Email template
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

  // Create a Nodemailer transporter using SendGrid
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
    tls: {
      rejectUnauthorized: false, // Disable certificate validation (not recommended in production)
    },
  });

  // Send password reset email
  await transporter.sendMail({
    from: "studioseekerbusiness@gmail.com",
    to: email,
    subject: "Password Reset Request",
    html: emailTemplate,
  });

  return res.status(200).json({
    status: "success",
    message: "Password reset link has been sent to your email",
    resetUrl: resetUrl, // Pass the reset URL back in the response for the client to navigate
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

    // Check if password and confirmPassword are present
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      const error = new CustomError(
        "Password and confirmPassword are required",
        400
      );
      return next(error);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      const error = new CustomError("Passwords do not match", 400);
      return next(error);
    }

    // Reset the user's password
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangeAt = Date.now();

    await user.save();

    const loginToken = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "30d",
    });

    // Send success response with message
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
