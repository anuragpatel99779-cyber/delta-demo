const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {
    listingSchema,
    reviewSchema
} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {

    console.log("🔥 LOGIN MIDDLEWARE HIT");

    console.log("Authenticated:", req.isAuthenticated());

    if (!req.isAuthenticated()) {

        console.log("🔥 REDIRECTING TO LOGIN");

        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in!");

        return res.redirect("/login");
    }

    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }

    next();
};


module.exports.isOwner = async (req, res, next) => {

    let { id } = req.params;

    let listing = await Listing.findById(id);

    // current user owner nahi hai
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to edit this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);

    if (error) {

        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// ================= VALIDATE REVIEW =================

module.exports.validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if (error) {

        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewid } = req.params;

    const review = await Review.findById(reviewid);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to delete this review!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    next();
};