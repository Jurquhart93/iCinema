const cron = require("node-cron");
const Film = require("../models/film");
const availableTimeSlots = ["12:00", "15:00", "17:00", "21:00"];

function scheduleTasks() {
  cron.schedule("34 8 * * * *", async () => {
    console.log("INSIDE CRON");
    try {
      const films = await Film.find({});

      for (let film of films) {
        await Film.findByIdAndUpdate(film._id, { stock: 30 });

        const randomIndex = Math.floor(
          Math.random() * availableTimeSlots.length
        );
        const randomTimeSlot = availableTimeSlots[randomIndex];
        await Film.findByIdAndUpdate(film._id, { timeslot: randomTimeSlot });
      }

      console.log("Stock counts and time slots updated.");
    } catch (err) {
      console.error("Error updating stock count and time slots", err);
    }
  });
}

module.exports = { scheduleTasks };
