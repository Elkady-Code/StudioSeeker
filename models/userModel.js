const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  number: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  accessToken: { type: String, default: null },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 8);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing, can't compare");
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Error while comparing password!", error.message);
    return false;
  }
};

userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Invalid Email");
  try {
    const user = await this.findOne({ email });
    return !user;
  } catch (error) {
    console.log("Error inside isThisEmailInUse method", error.message);
    return false;
  }
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiration

  console.log("Generated reset token (plain):", resetToken);
  console.log("Generated reset token (hashed):", this.passwordResetToken);
  return resetToken; // Return plain token
};



module.exports = mongoose.model("SignUp", userSchema);
