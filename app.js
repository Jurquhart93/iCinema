// checking to see if the app is in development mode
// require the dotenv package
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Film = require("./models/film");
const cron = require("node-cron");
const scheduler = require("./utils/scheduler");

const filmRoutes = require("./routes/films");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const catchAsync = require("./utils/catchAsync");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/iCinema";
const secret = process.env.SECRET || "thisshouldbeasecret";
const port = process.env.PORT || 3000;

// CONNECTING TO MONGOOSE DATABASE
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("DB CONNECTION OPEN");

    // SETING UP A PORT
    // app.listen(3000, () => {
    //   console.log("LISTENING ON PORT: 3000");
    // });
  })
  .catch((err) => {
    console.log("OH NO DB ERROR!!");
    console.log(err);
  });

const app = express();

// configuring the views directory to display our ejs templates
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// parsing req.body
app.use(express.urlencoded({ extended: true }));
// using method override middleware to change POST routes to PUT and DELETE
app.use(methodOverride("_method"));
// serving the public directory
app.use(express.static(path.join(__dirname, "public")));

// setting up mongoStore
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR!!", e);
});

// setting up a session
// used for authentication and flash
const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // equates to 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// setting up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to set up local variables that can be
// passed to our ejs templates instead of passing
// them in through the routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ROUTES
app.use("/films", filmRoutes);
app.use("/films/:titleSlug/reviews", reviewRoutes);
app.use("/", userRoutes);
app.use("/admin", adminRoutes);

// route to render the index page
app.get(
  "/",
  catchAsync(async (req, res) => {
    const films = await Film.find({});
    res.render("index", { films });
  })
);

// error handlers
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`SERVING ON PORT: ${port}`);

  // Initilalize the scheduler
  scheduler.scheduleTasks();
});
