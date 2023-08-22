const User = require("../models/user");
const Film = require("../models/film");
const catchAsync = require("../utils/catchAsync");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      age,
      password,
      isAdmin,
      bookings,
    } = req.body;

    // Check if isAdmin checkbox is selected
    const isAdminChecked = isAdmin === "on";

    const user = new User({
      firstname,
      lastname,
      username,
      email,
      age,
      isAdmin: isAdminChecked,
      bookings,
    });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      // if (err) return next(err);
      if (err) {
        req.flash("error", err.message);
        res.redirect("/register");
      }
      req.flash("success", "Welcome to iCinema!");
      res.redirect("/");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  if (req.user.isAdmin) {
    req.flash(
      "success",
      "You have successfully logged in, welcome to the admin panel!"
    );
    res.redirect("/admin");
  } else {
    req.flash("success", "You have successfully logged in!");
    const redirectUrl = res.locals.returnTo || "/";
    delete req.session.returnTo; // deleting the contents of returnTo
    res.redirect(redirectUrl);
  }
};

module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have successfully logged out!");
    res.redirect("/");
  });
};

// module.exports.showUser = catchAsync(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   res.render("users/showUser", { user });
// });

module.exports.showUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).populate({
    path: "bookings",
    populate: {
      path: "film",
      model: "Film",
    },
  });

  res.render("users/showUser", { user });
});

module.exports.bookings = async (req, res) => {
  const isoDate = new Date();
  const currentDate = new Date(isoDate);

  const user = await User.findById(req.params.id).populate({
    path: "bookings",
    populate: {
      path: "film",
      model: "Film",
    },
  });
  // console.log(`USER: ${user}`);
  // console.log(`USER>BOOKINGS ${user.bookings}`);
  res.render("users/bookings", { user, currentDate });
};

module.exports.updateUserForm = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("users/editUser", { user });
});

module.exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, username, email, isAdmin } = req.body;

  // Check if isAdmin checkbox is selected
  const isAdminChecked = isAdmin === "on";

  const updatedFields = {
    firstname,
    lastname,
    username,
    email,
    isAdmin: isAdminChecked,
  };
  const user = await User.findByIdAndUpdate(id, updatedFields, {
    new: true, // Return the updated user after the update
    runValidators: true, // Validate the updates against the schema
  });

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/");
  }

  req.flash("success", "You have successfully updated your profile.");
  res.redirect(`/u/${id}`);
});

module.exports.deleteUser = async (req, res) => {
  // finding the user and deleting from the database
  const { id } = req.params;
  await User.findOneAndDelete({ _id: id });

  req.flash("success", "You have successfully delete a user.");
  res.redirect("/admin/members");
};
