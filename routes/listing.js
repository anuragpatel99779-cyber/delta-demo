
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const controller = require("../controler/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// NEW LISTING FORM
router.route("/new")
    .get(isLoggedIn, controller.renderNewForm);

// CREATE LISTING AND SHOW ALL LISTINGS
router.route("/")
    .get(wrapAsync(controller.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(controller.createListing)
    );

// SHOW, UPDATE, DELETE LISTING
router.route("/:id")
    .get(wrapAsync(controller.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(controller.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(controller.destroyListing)
    );

// EDIT LISTING FORM
router.route("/:id/edit")
    .get(
        isLoggedIn,
        isOwner,
        wrapAsync(controller.renderEditForm)
    );

module.exports = router;
