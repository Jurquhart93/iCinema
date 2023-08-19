const Joi = require("joi");

// defining a Schema with Joi to validate on the server side
// before it is passed and saved to the database
module.exports.filmSchema = Joi.object({
  film: Joi.object({
    title: Joi.string().required(),
    rating: Joi.string().required(),
    runtime: Joi.number().required(),
    releasedate: Joi.number().min(1900).max(2023).required(),
    description: Joi.string().required(),
    genre: Joi.array()
      .items(
        Joi.string().valid(
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
          "Sports"
        )
      )
      .single()
      .required(),
    image: Joi.any(),
    stock: Joi.number().min(0).max(100).required(),
  }).required(),
  deleteImage: Joi.string(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().max(1000).required(),
  }).required(),
});

// defining that the user has to be
// 12 or older to register
const currentDate = new Date();
const minAge = new Date();
minAge.setFullYear(currentDate.getFullYear() - 12);

module.exports.userSchema = Joi.object({
  firstname: Joi.string()
    .min(3)
    .max(50)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.empty":
            err.message = "First Name can't be empty";
            break;
          case "string.min":
            err.message = "First Name must be at least 3 characters.";
            break;
          case "string.max":
            err.message = "First Name must not exceed 50 characters.";
            break;
          default:
            break;
        }
      });
      return errors;
    }),

  lastname: Joi.string()
    .min(3)
    .max(50)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.empty":
            err.message = "Last Name can't be empty";
            break;
          case "string.min":
            err.message = "Last Name must be at least 3 characters.";
            break;
          case "string.max":
            err.message = "Last Name must not exceed 50 characters.";
            break;
          default:
            break;
        }
      });
      return errors;
    }),

  username: Joi.string()
    .alphanum()
    .min(4)
    .max(15)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.empty":
            err.message = "Username can't be empty";
            break;
          case "string.alphanum":
            err.message = "Username contains characters that are not allowed.";
          case "string.min":
            err.message = "Username must be at least 4 characters.";
            break;
          case "string.max":
            err.message = "Username must not exceed 15 characters.";
            break;
          default:
            break;
        }
      });
      return errors;
    }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: [
          "com",
          "net",
          "org",
          "edu",
          "gov",
          "io",
          "co",
          "uk",
          "ca",
          "au",
          "de",
          "jp",
          "fr",
          "us",
          "it",
          "es",
        ],
      },
    })
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.empty":
            err.message = "Email can't be empty";
            break;
          case "string.minDomainSegments":
            err.message = "Invalid Email.";
            break;
          case "string.tlds":
            err.message = "Please use a valid TLD.";
            break;
          default:
            break;
        }
      });
      return errors;
    }),

  age: Joi.date()
    .max(minAge)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.empty":
            err.message = "Please use a valid date";
            break;
          case "date.max":
            err.message =
              "You must be at lease 12 years of age to create an accounts.";
            break;
          default:
            break;
        }
      });
      return errors;
    }),

  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .max(20)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.empty":
            err.message = "Password can't be left empty.";
            break;
          case "string.min":
            err.message = "Password must be at least 8 characters.";
            break;
          case "string.max":
            err.message = "Password must not exceed 20 characters.";
            break;
          default:
            break;
        }
      });
      return errors;
    }),

  repeatpassword: Joi.string().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match each other.",
  }),

  isAdmin: Joi.any(),
});
