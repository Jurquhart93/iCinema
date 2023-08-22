const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Film = require("./film");

const BookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  film: {
    type: Schema.Types.ObjectId,
    ref: "Film",
  },
  timeslot: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
  },
});

// middleware to set an expiry date based on the timeslot and runtime of the film
BookingSchema.pre("save", async function (next) {
  const film = await Film.findById(this.film._id);
  console.log(`Middleware film ${film}`);

  const [hours, minutes] = this.timeslot.split(":").map(Number);

  const timeSlotDate = new Date();
  timeSlotDate.setHours(hours);
  timeSlotDate.setMinutes(minutes);

  const filmRuntime = film.runtime;
  const expiryTime = new Date(timeSlotDate.getTime() + filmRuntime * 60 * 1000);

  this.expiresAt = expiryTime;

  next();
});

module.exports = mongoose.model("Booking", BookingSchema);
