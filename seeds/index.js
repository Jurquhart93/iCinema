const mongoose = require("mongoose");
const filmSeeds = require("./filmSeeds");
const Film = require("../models/film");

// CONNECTING TO MONGOOSE DATABASE
mongoose
  .connect("mongodb://127.0.0.1:27017/iCinema")
  .then(() => {
    console.log("DB CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("OH NO DB ERROR!!");
    console.log(err);
  });

const seedDB = async () => {
  await Film.deleteMany({});
  await Film.insertMany(filmSeeds);
};

seedDB().then(() => {
  mongoose.connection.close();
});
