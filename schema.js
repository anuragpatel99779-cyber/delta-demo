const Joi = require("joi");

// Listing Validation
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        category: Joi.string().required(),

        description: Joi.string().required(),

        image: Joi.object({
            url: Joi.string().allow("", null)
        }),

        price: Joi.number().required().min(0),

        location: Joi.string().required(),

        country: Joi.string().required()
    }).required()
});


// Review Validation
const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),

        rating: Joi.number()
            .required()
            .min(1)
            .max(5)
    }).required()
});


// Export both
module.exports = {
    listingSchema,
    reviewSchema
};