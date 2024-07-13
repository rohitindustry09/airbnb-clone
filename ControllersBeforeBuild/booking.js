const Listings = require("../models/listing.js");
const User = require("../models/user.js");



module.exports.addBooking = async (req, res)=> {
   let { id } = req.params;
   let { nights } = req.body;
   
    let user = await User.findByIdAndUpdate(req.user._id,
    { $push: { bookings: { rooms: id, nights: nights }} });
    
   if (user) {
    req.flash("success", "Room booked!");
    res.redirect(`/listings/${id}`);
   } else {
    req.flash("error", "Something went wrong!");
    res.redirect(`/listings/${id}`);
   }
};

module.exports.renderPageQuery = (req, res) => {
  let { id } = req.params;
  res.render("Query/query.ejs", { id });
}

module.exports.destroyBooking = async (req, res)=> {
  let { cancel } = req.body;
  let { id } = req.params;
  
  let listing = await Listings.findById(id);
  if (cancel == 1) {
    let user = await User.findByIdAndUpdate(req.user._id,
    { $pull: { bookings: { rooms: id } } });
    
    // await user.save();
     req.flash("success", "Booking successfully cancelled.");
     res.redirect(`/listings/${id}`);
  } else {
    req.flash("del_success", "Booking rejection failed.");
    res.redirect(`/listings/${id}`);
  }
};
module.exports.renderBookingPage = async (req, res)=> {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  res.render("users/rent.ejs", { listing });
};