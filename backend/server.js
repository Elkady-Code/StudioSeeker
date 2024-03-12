const express = require("express");
const app = express();
const User = require("./models/user");
const userRouter = require("./routes/user");
require("dotenv").config();
require("./models/db");
app.use(express.json());
app.use(userRouter);

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.get("/", (req, res) => {
  res.send('<h1 style="color: red;">Hello World!</h1>');
});

app.listen(8081, () => {
  console.log("Server is up and running!");
});

/* const test = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("User not found for email:", email);
      return;
    }
    const result = await user.comparePassword(password);
    console.log("Password comparison result:", result);
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
};

test("ibrahimallie905@icloud.com", "12345678"); */