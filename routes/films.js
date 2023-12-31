const express = require("express");
const router = express.Router();
const films = require("../controllers/films");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateFilm, isAdmin } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(films.index))
  .post(
    isLoggedIn,
    isAdmin,
    upload.single("film[image]"),
    validateFilm,
    catchAsync(films.createFilm)
  );

// route to render the NEW film page
router.get("/new", isLoggedIn, isAdmin, films.newFilmForm);

// route to handle the booking of films
router.post("/:titleSlug", isLoggedIn, catchAsync(films.createBooking));

router
  .route("/:titleSlug")
  .get(catchAsync(films.renderFilm))
  .put(
    isLoggedIn,
    isAdmin,
    upload.single("film[image]"),
    validateFilm,
    catchAsync(films.updateFilm)
  )
  .delete(isLoggedIn, isAdmin, catchAsync(films.deleteFilm));

// route to render the EDIT film page
router.get(
  "/:titleSlug/edit",
  isLoggedIn,
  isAdmin,
  catchAsync(films.editFilmForm)
);

module.exports = router;
