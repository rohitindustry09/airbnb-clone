const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String, required: true },
  bookings: [{
     rooms: { type: Schema.Types.ObjectId, ref: "Listings" },
     nights: { type: Number },
     booking_at: { type: Date, default: Date.now() },
  }],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
