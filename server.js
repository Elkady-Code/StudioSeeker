const express = require("express");
const app = express();
const User = require("./models/user");
const userRouter = require("./routes/user");
require("dotenv").config();
require("./models/db");
app.use(express.json());
app.use(userRouter);

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server is up and running on port 3000!"));

module.exports = app;