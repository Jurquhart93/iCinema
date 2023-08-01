const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware");
const admins = require("../controllers/admin");

router.get("/", isLoggedIn, isAdmin, admins.adminPanel);
router.get("/films", isLoggedIn, isAdmin, admins.films);
router.get("/members", isLoggedIn, isAdmin, admins.allMembers);

module.exports = router;
