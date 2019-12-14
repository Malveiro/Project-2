const mongoose = require('mongoose');
const Machine = require('../models/machine');
const dbName = 'project-2';
mongoose.connect(`mongodb://localhost/${dbName}`);


const machine = [
  {
    machine: 'm1',
    model: '12',
    info: 'none'
  }
]


Machine.create(machine, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${machine.length} `)
  mongoose.connection.close();
});