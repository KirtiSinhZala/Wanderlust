const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews",populate : {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error","Listing does not exist");
      return res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing })
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New listing created successfully");
    res.redirect("/listings");

};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing) {
        req.flash("error","Listing does not Exist!");
       return res.redirect("/listings");
      }
      let originalImageUrl = listing.image.url;
      originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250,q_auto,f_auto");
   res.render("listings/edit.ejs", { listing, originalImageUrl});
};

module.exports.updateListing = async(req, res) => {

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {  //ahi aa code ne if ni condition ma atla mate lakhyo che kmk jo edit karta samaye image ne khali rakhva ma ave to file.path & file.filename ma undefined avse 
          let url = req.file.path;
         let filename = req.file.filename;
          listing.image = {url, filename};
          await listing.save();
    }
  
    req.flash("success", "Your listing is updated");
   res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
      req.flash("success", "Your listing is deleted");
    res.redirect("/listings");
};

