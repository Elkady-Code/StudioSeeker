// settingsController.js
const User = require("../models/userModel");

// Update user email
exports.updateEmail = async (req, res) => {
  const { userId, newEmail } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true }
    );
    res.json({ success: true, message: "Email updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update email",
        error: error.message,
      });
  }
};

// Update user phone number
exports.updatePhoneNumber = async (req, res) => {
  const { userId, newPhoneNumber } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { number: newPhoneNumber },
      { new: true }
    );
    res.json({
      success: true,
      message: "Phone number updated successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update phone number",
        error: error.message,
      });
  }
};

exports.deletePhoneNumber = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { number: "" },
      { new: true }
    );
    res.json({
      success: true,
      message: "Phone number deleted successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete phone number",
        error: error.message,
      });
  }
};

// Update user address
exports.updateAddress = async (req, res) => {
  const { userId, newAddress } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { address: newAddress },
      { new: true }
    );
    res.json({ success: true, message: "Address updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update address",
        error: error.message,
      });
  }
};

// Delete user address
exports.deleteAddress = async (req, res) => {
  const { userId, addressId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { address: { _id: addressId } } },
      { new: true }
    );
    res.json({ success: true, message: "Address deleted successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete address",
        error: error.message,
      });
  }
};
