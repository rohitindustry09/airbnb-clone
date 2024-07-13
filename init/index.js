const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config()
}

const DbUrl = process.env.ATLAS_URL;

main().then(()=>{
  console.log("connected to the database...");
}).catch((err)=> { console.log(err); });

async function main() {
  await mongoose.connect(DbUrl);
}

let initDb = async() => {
 await Listing.deleteMany({});
 initdata.data = initdata.data.map((obj)=> ({...obj, owner: "6690d054ce6150b69fee5d26"}));
// initdata.data = initdata.data.map((obj)=> ({...obj, geometry: }));
 
 let lists = await Listing.insertMany(initdata.data);
 
 console.log("data inserted !");
 console.log(lists);
}

initDb();