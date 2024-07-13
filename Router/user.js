const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../Controllers/users.js");
const { asyncWrap } = require("../middlewares-validation/middleware.js");

//render signup page
router.route("/signup")
.get(userController.renderSignUpPage)
.post(saveRedirectUrl, asyncWrap(userController.saveNewUser));

//login get
router.route("/login")
.get(userController.renderLoginPage)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.LoggedInUser);

router.get("/logout", userController.logoutUser);

module.exports = router;
