const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const emailOptions = require("../Utils/email");
const sendEmail = require("../Utils/email");

exports.createUser = async (req, res) => {
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    number,
    address,
    avatar,
    confirmPassword, // Make sure confirmPassword is included in the request body
  } = req.body;

  // Check if email is already in use
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser) {
    return res.json({
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
    confirmPassword, // Make sure confirmPassword is included in the user object
    number,
    address,
    avatar,
  });

  // Save the user to the database
  try {
    await user.save();
    return res.json(user);
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

  res.json({ success: true, user, token });
};

exports.userLogout = async (req, res) => {
  try {
    const { username } = req.decoded;
    let user = await User.findOne({ username });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    user.accessToken = "";
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
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found with given email',
    });
  }

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `We have received a request to reset your password.Please use the link below to create a new password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes for security reasons.`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password change request received',
      message: message,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Password reset link has been sent to your email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error('Error sending password reset email:', error);
    return res.status(500).json({
      status: 'error',
      message: 'There was an error sending the password reset email. Please try again later',
    });
  }
});

exports.forgotPassword = (req , res , next) =>{
  
}