const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const Review = require("./review");
const Schema = mongoose.Schema;

// function to asign a value to the film rating
function ratingToNumber(rating) {
  switch (rating) {
    case "U":
      return 0;
    case "PG":
      return 10;
    case "12":
      return 12;
    case "12A":
      return 12;
    case "15":
      return 15;
    case "18":
      return 18;
    default:
      return null;
  }
}

const FilmSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  titleSlug: {
    type: String,
    unique: true,
  },
  rating: {
    type: String,
    enum: ["U", "PG", "12", "12A", "15", "18"],
    required: true,
  },
  ratingAge: {
    type: Number,
    required: true,
    default: 0,
  },
  runtime: {
    type: Number,
    required: true,
  },
  releasedate: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    enum: [
      "Action",
      "Adventure",
      "Animation",
      "Comedy",
      "Crime",
      "Documentary",
      "Drama",
      "Family",
      "Fantasy",
      "Horror",
      "Mystery",
      "Romance",
      "Science Fiction",
      "Thriller",
      "War",
      "Western",
      "Biography",
      "History",
      "Musical",
      "Sports",
    ],
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// middleware to generate a slug for the title of the film
FilmSchema.pre("save", function (next) {
  this.titleSlug = slugify(this.title, { lower: true });
  next();
});

FilmSchema.pre("save", function (next) {
  this.ratingAge = ratingToNumber(this.rating);
  next();
});

// query middleware to delete the reviews that are associated
// with the Film if the film is deleted
FilmSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Film", FilmSchema);
