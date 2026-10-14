const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN
});

// ================= NEW LISTING FORM =================
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// ================= CREATE LISTING =================


module.exports.createListing = async (req, res, next) => {
    const response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();

    const geometry = response.body.features[0]?.geometry;

    if (!geometry) {
        req.flash("error", "Location not found!");
        return res.redirect("/listings/new");
    }

    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = geometry;

    let sa=await newListing.save();
    console.log(sa);

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
};


module.exports.index = async (req, res) => {
    const { category } = req.query;

    if (category) {
        const alllistings = await Listing.find({
            category: category
        });

        return res.render("listings/category.ejs", {
            alllistings,
            category
        });
    } else {
        const alllistings = await Listing.find({});

        return res.render("listings/index.ejs", {
            alllistings
        });
    }
};
// ================= SHOW ROUTE =================
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const newlisting = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        });

    if (!newlisting) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
        newlisting
    });
};

// ================= EDIT FORM =================

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const newlisting = await Listing.findById(id);

    if (!newlisting) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = newlisting.image.url;

    originalImageUrl = originalImageUrl.replace(
        "/upload",
        "/upload/w_300"
    );

    res.render("listings/edit.ejs", {
        newlisting,
        originalImageUrl
    });
};

// ================= UPDATE LISTING =================
module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }

    const { id } = req.params;

   let listing= await Listing.findByIdAndUpdate(id, req.body.listing);

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// ================= DELETE LISTING =================
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};