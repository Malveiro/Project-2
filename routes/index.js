const express = require('express');
const router  = express.Router();
const Machine = require('../models/machine');
const Log = require('../models/log');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get("/list", (req, res) => {
  // allows the front-end to get info from the front end - entry point
 Machine.find()
  .then((allMachinesFromDB) => {
    Log.find()
    .populate('machine')
    .then(allLogsFromDB => {
      // Backend requesting data from Mongo
      res.render("list", { logs: allLogsFromDB, machines: allMachinesFromDB });
      //Backend is responding to the front end with the data that was got from mongo
    })
    .catch(error => {
      console.log("Error while retrieving the books", error);
    });
  });
 
});


router.get("/details", (req, res) => {
  // allows the front-end to get info from the front end - entry point
  Log.find()
    .then(allLogsFromDB => {
      // Backend requesting data from Mongo
      //console.log("Retrieve all books from DB: ", allBooksFromDB);
      res.render("details", { logs: allLogsFromDB });
      //Backend is responding to the front end with the data that was got from mongo
    })
    .catch(error => {
      //console.log("Error while retrieving the books");
    });
});


router.get("/details/:logId", (req, res, next) => {
  //console.log("The ID from the URL is: ", req.params.bookId);
  Log.findById({ _id: req.params.logId })
    .populate("log")
    .then(theLog => {
      console.log("The Log", theLog);
      res.render("details", { logs: theLog });
    })
    .catch(error => {
      console.log("Error: ", error);
    });
});

// router.get("/find", (req, res, next) => {
//   Log.find({machine})
//   .then...
// })


router.post('/list', (req, res) => {
  const {
    machine,
    date,
    synthesis,
    otherTechnician,
    description
  } = req.body;
  const newLog = new Log({
    machine,
    date,
    synthesis,
    otherTechnician,
    description
  });
  newLog.save()
    .then((newLog) => {
      res.redirect('/list');
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/add', (req, res) => {
  const {
    machine,
    model,
    info
  } = req.body;
  const newMachine = new Machine({
    machine,
    model,
    info
  });

  Machine.findOne({
    "machine": machine
  })
    .then(machine => {
      if (machine !== null) {
        
        res.render("machine", {
          errorMessage: "That machine already exists!"
        });
        return;
      }  else {
      
        newMachine.save()
        .then((newMachine) => {
          res.redirect('/add');
        })
        .catch((error) => {
          console.log(error);
        });
      }
    })
    .catch(error => {
      next(error);
    });
});



module.exports = router;
