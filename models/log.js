const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const logSchema = new Schema({
  machine: String,
  model: String,
  info: String,
  date: Date,
  synthesis: String,
  technician: String,
  description: String
  //pictureUrl: String
});
const Log = mongoose.model("Log", logSchema);
module.exports = Log;