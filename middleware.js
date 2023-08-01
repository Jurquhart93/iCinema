const { filmSchema, reviewSchema, userSchema } = require("./joiSchemas");
const ExpressError = require("./utils/ExpressError");
// const Film = require("./models/film");
const Review = require("./models/review");
const User = require("./models/user");

// middleware to validate the review data server side with Joi
module.exports.validateUser = (req, res, next) => {
  //destructering error from req.body
  const { error } = userSchema.validate(req.body);
  if (error) {
    // error message is in an array so mapping over it
    // and joining together as a string
    console.log(error);
    const msg = error.details.map((err) => err.message).join(",");
    req.flash("error", msg);
    res.redirect("/register");
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  // Checking to see if the user is authenticated
  // before they can submit a new campground
  if (!req.isAuthenticated()) {
    // storing the original URL in a variable on the
    // current session called return to so that we
    // can redirect the user to the page they were on
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

// middleware to validate the film data server side with Joi
module.exports.validateFilm = (req, res, next) => {
  // destructering error from req.body
  const { error } = filmSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!(user._id.equals(req.user._id) || req.user.isAdmin)) {
    req.flash("error", "Sorry you do not have permission to do that!");
    return res.redirect("/");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, titleSlug } = req.params;
  const review = await Review.findById(id);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/films/${titleSlug}`);
  }
  next();
};

// middleware to validate the review data server side with Joi
module.exports.validateReview = (req, res, next) => {
  //destructering error from req.body
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// middleware to see if the user is an admin or not
module.exports.isAdmin = (req, res, next) => {
  // checking if isAdmin is NOT true
  if (!req.user.isAdmin) {
    req.flash("error", "Sorry, You don't have access to that!");
    res.redirect("/");
  } else {
    next();
  }
};
