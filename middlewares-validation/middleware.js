const { listingSchema } = require("../joi-error.js");
const { reviewSchema } = require("../joi-error.js");
const ExpressError = require("../ExpressError.js");

//middleware (error finder)
module.exports.asyncWrap = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err)=> { next(err); });
  }
};

//validation for listings
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((element) => element.message).join(", ");
    return next(new ExpressError(404, errMsg));
  }
  next();
};

//validation for reviews
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((element)=> element.message).join(", ");
    return next(new ExpressError(404, errMsg));
  }
  next();
};

