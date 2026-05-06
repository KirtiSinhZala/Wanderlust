const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,  reviewSchema } = require("./schema.js");

 
module.exports.validateListing = (req, res, next) => { // aa fnx ne middleware tarike badha path ma use karsu
    let { error } = listingSchema.validate(req.body); //user input ma je data mokle listing mate te server ma store thay a pehla joi tene detect karse te valid chhe k nai 
// console.log(result);    //listing ma koi field no data missing hase to DB ma save to thase pan joi tene detect kari teni error batavse

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => { // aa fnx ne middleware tarike badha path ma use karsu
    let { error } = reviewSchema.validate(req.body); //user input ma je data mokle listing na REVIEW mate te server ma store thay a pehla joi tene detect karse te valid chhe k nai 
      //listing na REVIEW ma koi field no data missing hase to DB ma save to thase pan joi tene detect kari teni error batavse

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


 module.exports.isLoggedIn = (req, res, next) => {
    console.log(req);
      if(!req.isAuthenticated()) {   
        //redirect url save
         req.session.redirectUrl = req.originalUrl;
          req.flash("error", "Please login first!");
          return res.redirect("/login");
        }
        next();
    }

    module.exports.saveRedirectUrl = (req,res, next) => {
        if(req.session.redirectUrl) {
             res.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
    };

    module.exports.isOwner = async(req, res, next) => {
      let {id} = req.params;
      let listing = await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not owner of this listing");
        return res.redirect(`/listings/${id}`);
      }

      next();
    };


    
    module.exports.isReviewAuthor = async(req, res, next) => {
      let {id,reviewId} = req.params;
      let review = await Review.findById(reviewId);
      if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you  are not author of this review");
        return res.redirect(`/listings/${id}`);
      }

      next();
    };

