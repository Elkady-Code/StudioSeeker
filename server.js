const express = require("express");
const app = express();
const User = require("./models/user");
const userRouter = require("./routes/user");
require("dotenv").config();
require("./models/db");
app.use(express.json());
app.use(userRouter);

app.get("/", (req, res) => res.send("Express on Vercel"));

const server = app.listen(3005, () => console.log("Server is up and running on " + server.address().port));


module.exports = app;