const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  rentPerHour: { type: Number, required: true },
  images: [{ type: String, required: false }],
  description: { type: String, required: true },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
