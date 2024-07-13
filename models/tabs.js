const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tabSchema = new Schema({
  category: {
    type: String,
  },
  icon: {
    type: String,
  }
});

const Tabs = mongoose.model("Tab", tabSchema);

module.exports = Tabs;
