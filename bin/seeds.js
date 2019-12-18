const mongoose = require('mongoose');
const Log = require('../models/log');
const dbName = 'project-2';
mongoose.connect(`mongodb://localhost/${dbName}`);


const log = [
  {
<<<<<<< HEAD
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
=======
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
>>>>>>> 2f8fca781b1fef96a5512d6b1dac783fec8814b9
  },
]


Log.create(log, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${log.length} `)
  mongoose.connection.close();
});