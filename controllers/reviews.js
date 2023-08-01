const Film = require("../models/film");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  // querying the database for the current film
  const film = await Film.findOne({ titleSlug: req.params.titleSlug });

  // creating a new review based on the review model schema
  const review = new Review(req.body.review);
  // setting the review author to the current user who is logged in
  review.author = req.user._id;

  // pushing the review onto the film array that was
  // defined in the campground model schema
  film.reviews.push(review);

  await review.save();
  await film.save();

  req.flash("success", "Successfully posted a review.");
  res.redirect(`/films/${film.titleSlug}`);
};

module.exports.deleteReview = async (req, res) => {
  const { titleSlug, id } = req.params;
  await Film.findOneAndUpdate(
    { titleSlug: titleSlug },
    { $pull: { reviews: id } }
  );
  await Review.findByIdAndDelete(id);

  req.flash("success", "Successfully deleted a review.");
  res.redirect(`/films/${titleSlug}`);
};
