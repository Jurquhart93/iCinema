const Film = require("../models/film");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  // finding all the films in the database
  const films = await Film.find({});

  if (req.user) {
    const { id } = req.user;
    const user = await User.findOne({ _id: id });

    // function to change users DOB
    // into an int
    function calculateAge(birthdate) {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    }

    const userAge = calculateAge(user.age);
    console.log(userAge);

    res.render("films/index", { films, userAge });
  } else {
    res.render("films/index", { films, userAge: null });
  }
};

module.exports.newFilmForm = (req, res) => {
  res.render("films/new");
};

module.exports.createFilm = async (req, res, next) => {
  // creating new film with req.body.film
  // req.body has been parsed
  const film = new Film(req.body.film);

  film.image = {
    url: req.file.path,
    filename: req.file.filename,
  };

  await film.save(); // saving film to the database

  req.flash("success", "You have successfully made a new film.");
  res.redirect(`/films/${film.titleSlug}`);
};

module.exports.renderFilm = async (req, res) => {
  // finding the film by searching the database for
  // the unique title slug and storing the data into the film variable
  const film = await Film.findOne({
    titleSlug: req.params.titleSlug,
  }).populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  });

  // if no film is found then flash the error
  if (!film) {
    req.flash("error", "Sorry, this film doesn't exist");
    res.redirect("/films");
  }

  res.render("films/show", { film });
};

module.exports.editFilmForm = async (req, res) => {
  // finding the film by searching the database for
  // the unique title slug and storing the data into the film variable
  const film = await Film.findOne({ titleSlug: req.params.titleSlug });

  // if no film is found then flash the error
  if (!film) {
    req.flash("error", "Sorry, this film doesn't exist.");
    res.redirect("/films");
  }

  res.render("films/edit", { film });
};

module.exports.updateFilm = async (req, res) => {
  console.log(req.body);
  // checking if req.body.films has all its data
  if (!req.body.film) throw new ExpressError("Invalid Film Data", 400);

  const film = await Film.findOneAndUpdate(
    { titleSlug: req.params.titleSlug }, // finding the relevant film with the titleSlug
    { ...req.body.film } // spreading the new film data and updating the database
  );

  // checking to see if there was a new film
  // uploaded, if true then replace with the new data
  if (req.file) {
    film.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  film.save();

  cloudinary.uploader.destroy(req.body.deleteImage);

  req.flash("success", "Successfully updated the film.");
  res.redirect(`/films/${film.titleSlug}`);
};

module.exports.deleteFilm = async (req, res) => {
  // finding a film based on the unique title slug
  // and deleting it from the database
  await Film.findOneAndDelete({ titleSlug: req.params.titleSlug });

  req.flash("success", "Successfully deleted the film.");
  res.redirect("/films");
};
