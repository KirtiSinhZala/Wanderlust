// use to validate for server side 
//for client side validate (in forms) we use form validator of bootstrap
// we also use error handling
// SO NOW IN SERVER SIDE DATA ,WE MUST CHECK DATA IS VALID THEREFOR WE USE JOI -------

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({url:Joi.string()}).allow("",null),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});