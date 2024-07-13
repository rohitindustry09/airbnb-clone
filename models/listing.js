const mongoose = require("mongoose");
const Review = require("./reviews.js");

const listingSchema = new mongoose.Schema({
  title: { type: String, required : true },
  description: String,
  image: {
    url: String, 
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: [String],
    enum: ["Trending", "Rooms", "Iconic cities", "Mountains", "Castles", "Amazing pools", "Camping", "Farms", "Arctic",  "Domes", "Boats"],
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
     await Review.deleteMany({ _id: { $in : listing.reviews }});
  }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
