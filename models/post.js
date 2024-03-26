const mongoose = require("mongoose");

// Define the schema for the Post model
const postSchema = new mongoose.Schema({
  location: {type: String, required: true,},
  rentPerHour: {type: Number, required: true,},
  images: [{type: String,required: true,},],
  description: {type: String,required: true,},
});

module.exports = mongoose.model("Post", postSchema);
