const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../ExpressError.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../Controllers/reviews.js");
const { validateReview, asyncWrap } = require("../middlewares-validation/middleware.js");

//review route - post
router.post("/", isLoggedIn, validateReview, asyncWrap(reviewController.saveReview));

//review DELETE - route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.destroyReview);

router.get("/:reviewId/liked-review", isLoggedIn, reviewController.likedReviewRoute);

router.get("/:reviewId/disliked-review", isLoggedIn, reviewController.dislikedReviewRoute);

module.exports = router;
