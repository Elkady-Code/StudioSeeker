const jwt = require("jsonwebtoken");
const User = require("../models/user");
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
  } = req.body;
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser)
    return res.json({
      success: false,
      message: "This email is already in use, please try again",
    });
  const user = await User({
    username,
    firstName,
    lastName,
    email,
    password,
    number,
    address,
    avatar,
  });
  await user.save();
  res.json(user);
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

exports.userLogout = async (req, res) =>{
  try {
    const { username } = req.decoded;
    let user = await User.findOne({ username });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }
    user.accessToken = "";
    await user.save();
    return res.json({
      success: true,
      message: "User logged out"
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Error logging out user"
    });
  }
}
