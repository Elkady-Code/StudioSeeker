const User = require("../models/signup");
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
  res.json({ success: true, user });
};
