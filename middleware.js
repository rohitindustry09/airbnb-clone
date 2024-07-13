const Listings = require("./models/listing.js");
const Review = require("./models/reviews.js");
const User = require("./models/user.js");
const { isSameDate } = require("./CheckDate.js");

//passport login check if he/she can login first
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be Login first!");
    res.redirect("/login");
  }
   next();
};

//saves url that user had before; - then redirect on that after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
   next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You doesn't have permissions for that!");
    res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You doesn't have permission for other review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.checkBookingExpiration = async (req, res, next) => {
     let { id } = req.params;
  if (req.user) {
    const user = await User.findById(req.user._id);
    if (req.user && user.bookings.length) {
      
      let userView = user.bookings.find(booking => booking.rooms.equals(id));
      
      if (userView) {
        const expirationDate = new Date(userView.booking_at);
        let expires = expirationDate.setDate(expirationDate.getDate() + userView.nights);
        
        req.session.bookingOverview = {
          roomId: userView.rooms,
          booking_at: userView.booking_at,
          expire_at: new Date(expires),
        };
        
        let currentDate = new Date(Date.now());
        let expired = new Date(expires);
        
        if (currentDate >= expired) {
          await User.updateOne(
            { _id: user._id },
            { $pull: { bookings: { _id: userView._id } } }
          );
        }
      }
    }
  }
    next(); // Call the next middleware or route handler
};

