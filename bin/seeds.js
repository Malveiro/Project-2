const mongoose = require('mongoose');
const Log = require('../models/log');
const dbName = 'project-2';
mongoose.connect(`mongodb://localhost/${dbName}`);


const log = [
  {
  machine: "MO1",
  model: 'GT',
  info: 'comprada em janeiro',
  date: '2018-05-05',
  synthesis: 'vvvvfvfv',
  technician: 'ze',
  description: 'descrip da manut'
  }
]


Log.create(log, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${log.length} `)
  mongoose.connection.close();
});