const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  film: {
    type: Schema.Types.ObjectId,
    ref: "Film",
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
