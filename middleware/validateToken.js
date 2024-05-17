const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

exports.validateToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    console.log("Authorization header is missing");
    return res.status(401).json({
      error: true,
      message: "Access token is missing",
    });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    console.log("Token is missing from the authorization header");
    return res.status(401).json({
      error: true,
      message: "Access token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use JWT_SECRET
    const user = await User.findById(decoded.userId); // Find user by ID extracted from the token

    if (!user) {
      return res.status(403).json({
        error: true,
        message: "Authorization error",
      });
    }

    req.decoded = decoded;
    req.user = user; // Attach user object to the request for later use if needed
    next();
  } catch (error) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        error: true,
        message: "Token expired",
      });
    }

    return res.status(403).json({
      error: true,
      message: "Authentication error",
    });
  }
};
