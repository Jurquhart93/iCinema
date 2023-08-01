const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

// route to CREATE a new review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// route to DELETE a review
router.delete(
  "/:id",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
