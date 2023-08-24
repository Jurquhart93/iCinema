const Film = require("../models/film");
const User = require("../models/user");
const Booking = require("../models/booking");
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

    res.render("films/index", { films, userAge });
  } else {
    res.render("films/index", { films, userAge: null });
  }
};

module.exports.newFilmForm = (req, res) => {
  const timeSlots = ["12:00", "15:00", "17:00", "21:00"];
  res.render("films/new", { timeSlots });
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
  const currentDate = new Date();
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const currentTime = `${currentHours}:${currentMinutes}`;

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
  const selectedTimeSlot = req.body.timeslot;

  // if no film is found then flash the error
  if (!film) {
    req.flash("error", "Sorry, this film doesn't exist");
    res.redirect("/films");
  }

  res.render("films/show", { film, selectedTimeSlot, currentTime });
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

module.exports.createBooking = async (req, res) => {
  try {
    const film = await Film.findOne({ titleSlug: req.params.titleSlug });
    const user = await User.findById(req.user.id); // Simplified

    if (!film || !user) {
      req.flash("error", "Sorry, something went wrong!");
      return res.redirect(`/films/${film ? film.titleSlug : ""}`);
    }

    const { timeslot, quantity } = req.body;

    if (film.stock <= 0) {
      req.flash(
        "error",
        "Sorry, there are no available tickets for this film! Please check back soon."
      );
      return res.redirect(`/films/${film.titleSlug}`);
    }

    if (quantity > film.stock) {
      req.flash(
        "error",
        "Sorry, you have tried to purchase more tickets than available."
      );
      return res.redirect(`/films/${film.titleSlug}`);
    }

    const booking = new Booking({
      user: user._id,
      film: film._id,
      timeslot: timeslot,
      quantity: quantity,
    });

    film.stock -= quantity;
    film.bookings.push(booking);
    user.bookings.push(booking);

    await film.save();
    await user.save();
    await booking.save(); // Don't forget to save the booking

    req.flash("success", "Film successfully booked.");
    res.redirect(`/films/${film.titleSlug}`);
  } catch (error) {
    console.error("Error creating booking:", error);
    req.flash("error", "An error occurred while creating the booking.");
    res.redirect(`/films/${req.params.titleSlug}`);
  }
};
