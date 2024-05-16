import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

async function validateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      error: true,
      message: "Access token is missing",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  const options = {
    expiresIn: "24h",
  };

  try {
    let user = await User.findOne({
      accessToken: token,
    });

    if (!user) {
      return res.status(403).json({
        error: true,
        message: "Authorization error",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, options);

    if (user.username !== decoded.username) {
      return res.status(401).json({
        error: true,
        message: "Invalid token",
      });
    }

    req.decoded = decoded;

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
}

export default validateToken;
