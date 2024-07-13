const express = require("express");
const router = express.Router();
const ExpressError = require("../ExpressError.js");
const flash = require("connect-flash");
const { isLoggedIn, isOwner, checkBookingExpiration } = require("../middleware.js");
const { RedirectUrlOfSearch, saveRedirectUrlSearch } = require("../middleware.js");
const listingController = require("../Controllers/listings.js");
const WholeController = require("../ControllersBeforeBuild/booking.js");
const { validateListing, asyncWrap } = require("../middlewares-validation/middleware.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index route and add router
router.route("/")
.get(asyncWrap( listingController.index ))
.post( isLoggedIn, upload.single("listing[image]"), validateListing, asyncWrap(listingController.createListing))

//new route
router.get("/new", isLoggedIn, listingController.renderNewListing);

//show - update - destroy
router.route("/:id")
.get(checkBookingExpiration, asyncWrap(listingController.showRenderListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, asyncWrap(listingController.updateListing))
.delete(isLoggedIn, isOwner, asyncWrap(listingController.destroyListing));

//edit route
router.get("/:id/edit", isLoggedIn, asyncWrap(listingController.editRenderListing));

router.get("/show/:category", asyncWrap(listingController.ListingCategory));
//render-page-rent
router.get("/rent-by/:id", isLoggedIn, WholeController.renderBookingPage);

//put-add
router.put("/rent-by/:id/book-now", isLoggedIn, WholeController.addBooking);
//cancel-or-not-page
router.get("/rent-by/:id/book-cancel", isLoggedIn, WholeController.renderPageQuery);
//delte
router.delete("/rent-by/:id/book-cancel", isLoggedIn, WholeController.destroyBooking);

module.exports = router;
