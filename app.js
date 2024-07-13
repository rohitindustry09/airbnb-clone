if (process.env.NODE_ENV != "production") {
  require("dotenv").config()
}
const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const Listings = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError.js");
const { listingSchema } = require("./joi-error.js");
const { reviewSchema } = require("./joi-error.js");
const Review = require("./models/reviews.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./Router/listings.js");
const reviewsRouter = require("./Router/review.js");
const userRouter = require("./Router/user.js");

const DbUrl = process.env.ATLAS_URL;

const store = MongoStore.create({
  mongoUrl: DbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", ()=>{
  console.log("error on store");
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
  res.locals.success = req.flash("success");
  res.locals.del_success = req.flash("del_success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  next();
});

main().then(()=> {
  console.log("connected to the database...");
}).catch((err)=> {
  console.log(err);
});

async function main() {
  await mongoose.connect(DbUrl);
}

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);

//root route
app.get("/", (req, res)=> {
  res.redirect("/listings")
});

//error handlers;
app.all("*", (req, res, next)=> {
  next (new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next)=> {
  let { status = 500, message = "Something went wrong!" } = err;
  res.render("Error Template/error.ejs", { message });
});

app.listen(port, ()=> {
  console.log(`server listening on port ${port}...`);
});
