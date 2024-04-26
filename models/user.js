const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Password & Confirm Password does not match!",
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  number: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: false, unique: false },
  accessToken: { type: String, default: null },
  avatar: Buffer,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (!this.confirmPassword) {
      const error = new Error("Please confirm your password.");
      return next(error);
    }
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
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing password!", error.message);
    return false;
  }
};

userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Invalid Email");
  try {
    const user = await this.findOne({ email });
    if (user) return false;
    return true;
  } catch (error) {
    console.log("error inside isThisEmailInUse method", error.message);
    return false;
  }
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("SignUp", userSchema);
