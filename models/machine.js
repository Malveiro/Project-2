const mongoose = require("mongoose");
const Schema   = mongoose.Schema;


const machineSchema = new Schema({
  machine: String,
  model: String,
  info: String
  });
const Machine = mongoose.model("Machine", machineSchema);
module.exports = Machine;