const express = require("express");
const path = require("path");
const app = express();
const User = require("./models/userModel");
const userRouter = require("./routes/userRouter");
const recordsController = require("./controllers/userController");
const rbacMiddleware = require("./middleware/validation/rbacMiddleware");
const { default: mongoose } = require("mongoose");
const { v2: cloudinary } = require("cloudinary");

(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: "dparm0mf1",
    api_key: "472455823749357",
    api_secret: "OFna2i210iUY7Wgj-QMM11H2-tk", // Click 'View Credentials' below to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
      },
    )
    .catch(error => {
      console.log(error);
    });

  console.log(uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("shoes", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url("shoes", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
})();

require("dotenv").config();
require("./models/db");

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the user router
app.use(userRouter);

// Set up the view engine and views directory
app.set("views", path.join(__dirname, "/src/screens"));
app.set("view engine", "ejs");

// Define a simple route
app.get("/", (req, res) => res.send("Express on Vercel"));

// Route to render the reset password form
app.get("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  res.render("reset-password", { token });
});

console.log(app.get("views"));

// Start the server
const server = app.listen(3005, () =>
  console.log("Server is up and running on " + server.address().port),
);

module.exports = app;
