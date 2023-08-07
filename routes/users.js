const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const {
  storeReturnTo,
  validateUser,
  isLoggedIn,
  isAdmin,
  isUser,
} = require("../middleware");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

router
  .route("/register")
  .get(users.registerForm)
  .post(validateUser, catchAsync(users.createUser));

router
  .route("/login")
  .get(users.loginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

// route to SIGN OUT
router.get("/logout", users.logoutUser);

// route to show user
router.get("/u/:id", isLoggedIn, isUser, users.showUser);

// route to show user bookins
router.get("/u/:id/bookings", catchAsync(users.bookings));

//router to UPDATE user details
router.get("/u/:id/edit", isLoggedIn, isUser, users.updateUserForm);

router.put("/u/:id", isLoggedIn, isUser, users.updateUser);

router.delete("/u/:id", isLoggedIn, isAdmin, users.deleteUser);

module.exports = router;
