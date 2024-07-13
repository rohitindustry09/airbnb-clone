
const User = require("../models/user.js");

module.exports.renderSignUpPage = (req, res) => {
  res.render("users/signup.ejs")
};

module.exports.saveNewUser = async (req, res, next) => {
  try {
     let { username, email, password } = req.body;
     let user = new User({ email, username });
     let registeredUser = await User.register(user, password);
     req.login(registeredUser, (err)=> {
       if (err) {
         return next(err);
       }
       req.flash("success", "User registed successfully !");
       let redirectUrl = res.locals.redirectUrl || "/listings";
       res.redirect(redirectUrl);
     })
  }
  catch (err) {
    req.flash("error", "User already registed !");
    res.redirect("/signup");
  }
};

module.exports.renderLoginPage = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.LoggedInUser = async (req, res) => {
  req.flash("success", "You've login to Wonderlust !");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next)=> {
  //logout is predefined method of passport - maje kar bhai !
  req.logout((err)=> {
    if (err) {
      return next(err);
    }
    req.flash("success", "You've Logout !");
    res.redirect("/listings");
  });
};
