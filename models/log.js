const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const logSchema = new Schema({
  machine: String,
  date: Date,
  synthesis: String,
  otherTechnician: String,
  description: String
  //pictureUrl: String
});
const Log = mongoose.model("Log", logSchema);
module.exports = Log;