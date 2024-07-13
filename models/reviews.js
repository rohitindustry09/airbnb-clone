const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
let reviewSchema = new Schema({
  ratings : {
    type: Number,
    min: 1,
    max: 5
  },
    likes: {
     users: [{
       type: Schema.Types.ObjectId, ref: "User",
     }],
    },
    dislikes: { 
     users: [{
       type: Schema.Types.ObjectId, ref: "User",
     }],
    },
  comments : { type: String },
  created_at : { type: Date, default : Date.now() },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

const Review = mongoose.model("Review", reviewSchema);

 module.exports = Review;
