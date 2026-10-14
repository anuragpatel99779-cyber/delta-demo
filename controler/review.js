  const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.create=async (req, res) => {

        let listing = await Listing.findById(req.params.id);

        let newReview = new Review(req.body.review);

        newReview.author = req.user._id;

        console.log("AUTHOR:", newReview.author);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    }

    module.exports.deletreview=async (req, res) => {
    
            const { id, reviewid } = req.params;
    
            await Listing.findByIdAndUpdate(id, {
                $pull: {
                    reviews: reviewid
                }
            });
    
            await Review.findByIdAndDelete(reviewid);
    
            req.flash("success", "Review deleted successfully!");
    
            res.redirect(`/listings/${id}`);
        }