const express = require("express");
const router =  express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
//using of multer it automatically create destination file that is uploads.  it was local storage

const listingController = require("../controllers/listing.js");


router.route("/")
//index route
.get( wrapAsync(listingController.index))
//create Route
.post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))


//New Route  -> :id route na uper rakhyo kem k niche rakhiye to /new route par request mokl ta tene id tarike jovama avse 
router.get("/new", isLoggedIn, listingController.renderNewForm)


router.route("/:id")
// Show Route
.get(wrapAsync(listingController.showListing))
//Update Route
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
//Delete Route
.delete(isLoggedIn ,isOwner, wrapAsync(listingController.destroyListing))


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router ;