const mongoose = require('mongoose');
const Log = require('../models/log');
const dbName = 'project-2';
mongoose.connect(`mongodb://localhost/${dbName}`);


const log = [
  {
    machine: "M01",
    date: "2019-03-14",
    synthesis: "AA",
    otherTechnician: "ZZ",
    description: "DD"
  },
  {
    machine: "M03",
    date: "2019-08-08",
    synthesis: "A11A",
    otherTechnician: "Z11Z",
    description: "D11D"
  },
]


Log.create(log, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${log.length} `)
  mongoose.connection.close();
});