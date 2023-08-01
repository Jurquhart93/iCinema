const Film = require("../models/film");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

module.exports.adminPanel = (req, res) => {
  res.render("admin/panel");
};

module.exports.films = catchAsync(async (req, res) => {
  // finding all the films in the database
  const films = await Film.find({});

  res.render("admin/films", { films });
});

module.exports.allMembers = catchAsync(async (req, res) => {
  const users = await User.find({});
  res.render("admin/members", { users });
});
