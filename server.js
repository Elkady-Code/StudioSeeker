const express = require("express");
const path = require("path");
const app = express();
const User = require("./models/userModel");
const userRouter = require("./routes/userRouter");
const recordsController = require('./controllers/userController');
const rbacMiddleware = require('./middleware/validation/rbacMiddleware');
require("dotenv").config();
require("./models/db");

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the user router
app.use(userRouter);

// Set up the view engine and views directory
app.set('views', path.join(__dirname, '/src/screens'));
app.set('view engine', 'ejs');

// Define a simple route
app.get("/", (req, res) => res.send("Express on Vercel"));

// Route to render the reset password form
app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.render('reset-password', { token });
});

console.log(app.get('views'));

// Start the server
const server = app.listen(3005, () => console.log("Server is up and running on " + server.address().port));

module.exports = app;
