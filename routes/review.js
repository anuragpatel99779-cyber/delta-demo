
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const controller = require("../controler/review.js");

const {
    validateReview,
    isLoggedIn,
    isReviewAuthor
} = require("../middleware.js");

// Create review
router.route("/:id/reviews")
    .post(
        isLoggedIn,
        validateReview,
        wrapAsync(controller.create)
    );

// Delete review
router.route("/:id/reviews/:reviewid")
    .delete(
        isLoggedIn,
        isReviewAuthor,
        wrapAsync(controller.deletreview)
    );

module.exports = router;
