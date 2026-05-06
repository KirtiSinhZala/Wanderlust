const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);  //je listing par user click karse tene access karyu
    let newReview = new Review(req.body.review);    //Review model ma user a send karelu newReview te model mujab new instance banse

    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview); //access pachhi tena reviews array ma newReview ne push karyu

    
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review created successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req, res) => {     // /:review is child route  
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};

