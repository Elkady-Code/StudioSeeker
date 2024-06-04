const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  bookingDate: { type: Date, default: Date.now },
  duration: { type: Number, required: true }, 
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
