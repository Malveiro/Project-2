const mongoose = require('mongoose');
const Log = require('../models/log');
const dbName = 'project-2';
mongoose.connect(`mongodb://localhost/${dbName}`);


const log = [
  {
    machine: "M1",
    date: "2019-05-05",
    synthesis: "repair",
    otherTechnician: "none",
    description: "many things"
  },
  {
    machine: "M2",
    date: "2019-05-05",
    synthesis: "repair",
    otherTechnician: "none",
    description: "many things"
  },
  {
    machine: "M3",
    date: "2019-05-05",
    synthesis: "repair",
    otherTechnician: "none",
    description: "many things"
  },
]


Log.create(log, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${log.length} `)
  mongoose.connection.close();
});