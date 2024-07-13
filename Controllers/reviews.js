const Listings = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.saveReview = async (req, res)=>{
 let listing = await Listings.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
   listing.reviews.push(newReview);
 //save
   await newReview.save();
   await listing.save();
  req.flash("success", "New Review saved!");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res)=> {
  let { id, reviewId } = req.params;
  let listing = await Listings.findByIdAndUpdate(id, {$pull : { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  req.flash("del_success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
}

module.exports.likedReviewRoute = async (req, res)=> {
  
  if (req.user) { 
   let { id, reviewId } = req.params;
   let review = await Review.findById(reviewId);
    if(!review.likes.users.includes(req.user._id)) {
      let userId = req.user._id;
      if (review.dislikes.users.includes(req.user._id)) {
        await Review.updateOne({ _id: reviewId }, { $pull: { "dislikes.users": userId }});
     } 
         review.likes.users.push(userId);
         await review.save();
         req.flash("success", "You liked.");
         res.redirect(`/listings/${id}`);
    } else {
      req.flash("del_success", "Not twice!");
      res.redirect(`/listings/${id}`);
    }
  } 
};

module.exports.dislikedReviewRoute = async (req, res)=> {
  if (req.user) {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.dislikes.users.includes(req.user._id)) {
     let userId = req.user._id;
     if (review.likes.users.includes(req.user._id)) {
        await Review.updateOne({ _id: reviewId }, { $pull: { "likes.users": userId }});
     } 
        review.dislikes.users.push(userId);
        await review.save();
        req.flash("success", "You disliked.");
        res.redirect(`/listings/${id}`);
    } else {
      req.flash("del_success", "Not twice!");
      res.redirect(`/listings/${id}`);
    }
  }
};
