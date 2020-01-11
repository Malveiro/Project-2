const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const logSchema = new Schema({
  machine: { 
    type : Schema.Types.ObjectId, 
    ref: 'Machine',
  required: true
 },
  date: Date,
  synthesis: String,
  otherTechnician: String,
  description: String
  //pictureUrl: String
});
const Log = mongoose.model("Log", logSchema);
module.exports = Log;