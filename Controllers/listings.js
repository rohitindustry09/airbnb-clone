const Listings = require("../models/listing.js");
const Tabs = require("../models/tabs.js");
const { isSameDate } = require("../CheckDate.js");

module.exports.index = async (req, res, next)=> {
  const allListings = await Listings.find();
  const tabs = await Tabs.find();
  
   req.session.searchedCategory = { category: "You", icon: "fa-solid fa-person-biking" };
  
   res.render("listings/index.ejs", { allListings, tabs });
}

module.exports.renderNewListing = (req, res)=> {
  res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
  const fetch = (await import('node-fetch')).default;
  
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listings(req.body.listing);
   listing.owner = req.user._id;
   listing.image = { url, filename };
   
  //map coordinates finder
   const placeName = listing.location;
   
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`);
    const data = await response.json();
    
    if (data.length > 0) {
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      
      listing.geometry.type = "Point";
      listing.geometry.coordinates = [latitude, longitude];
    } else {
       req.flash("error", "Place not found on the map.");
    }
  } catch (error) {
    console.error('Error:', error);
  }
   await listing.save(); 
  req.flash("success", "Listing added successfully!");
  res.redirect("/listings"); //to index listings
}

module.exports.showRenderListing = async (req, res)=> {
  let { id } = req.params;
  //nested populate
  const listing = await Listings.findById(id).populate({ 
    path: "reviews", 
    populate: { path: "author" },
  }).populate("owner");
  if (!listing) {
    req.flash("error", "Requested Listing doesn't exists!");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.editRenderListing = async (req, res)=> {
  let { id } = req.params;
  const listing = await Listings.findById(id);
  if (!listing) {
    req.flash("error", "Requested Listing doesn't exists!");
    res.redirect("/listings");
  }
  let originalImage = listing.image.url;
 // originalImage = originalImage.replace("/upload", "/upload");
  
  res.render("listings/edit.ejs", { listing, originalImage });
}

module.exports.updateListing = async (req, res)=> {
  let { id } = req.params;
  if (!req.body.listing) {
     throw new ExpressError(404* "please insert valid data.");
  }
 const listing = await Listings.findByIdAndUpdate(id, {...req.body.listing}, { runValidators: true, new: true });
 
 if (typeof req.file !== "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
}
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}

module.exports.ListingCategory = async (req, res)=> {
  let { category } = req.params;
  let tabs = await Tabs.find();
  const allListings = await Listings.find({ category : category });
  let data = tabs.map(item => ( item.category ));
     if (!data.includes(category)) { //finding if string is in a given array (data)
       req.flash("del_success", "Didn't find any rooms !");
       res.redirect("/listings");
     }
     let searched = data.find(item => item === category);
     let searchedCategory = await Tabs.findOne({ category: searched });
      req.session.searchedCategory = searchedCategory;
     tabs = await Tabs.find({ category: { $ne: searched }});
  res.render("listings/index.ejs", { allListings, tabs });
};

module.exports.destroyListing = async (req, res, next)=>{
  let { id } = req.params;
  const deletedListing = await Listings.findByIdAndDelete(id);
  req.flash("del_success", "Listing deleted successfully!");
  res.redirect("/listings");
};

