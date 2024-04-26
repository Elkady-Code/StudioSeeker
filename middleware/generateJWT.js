const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config()


exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_TOKEN);
      const user = await User.findById(decode.userId);
      if (!user) {
        return res.json({ success: false, message: "Unauthorized Access!" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.json({ success: false, message: "Unauthorized Access!" });
      }
      if (error.name === "TokenExpiredError") {
        return res.json({
          success: false,
          message: "Session Expire, kindly sign in again!",
        });
      }
      res.json({ success: false, message: "Internal server error" });
    }
  } else {
    res.json({ success: false, message: "Unauthorized Access!" });
  }
};

exports.generateJWT = async (username)=>{
 try {
  const payload = {username};
  const token = await jwt.sign(payload, process.env.JWT_SECRET, options);
    return { error: false, token };
 } catch (error) {
  return { error: true };
 }
}