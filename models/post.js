const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: {type: Number, required: true},
  location: {type: String, required: true,},
  rentPerHour: {type: Number, required: true,},
  images: [{type: String,required: false,},],
  description: {type: String,required: true,},
});

module.exports = mongoose.model("Post", postSchema);
