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
  Log.find()
    .then(allLogsFromDB => {
      // Backend requesting data from Mongo
      //console.log("Retrieve all books from DB: ", allBooksFromDB);
      res.render("list", { logs: allLogsFromDB });
      //Backend is responding to the front end with the data that was got from mongo
    })
    .catch(error => {
      //console.log("Error while retrieving the books");
    });
});
/*
router.get('/home', (req, res, next) => {
  res.render('home');
});
*/
router.get('/list', (req, res, next) => {
  res.render('list');
});
/*
router.get('/details', (req, res, next) => {
  res.render('details');
});*/

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
      //console.log("The Book", theBook);
      res.render("details", { logs: theLog });
    })
    .catch(error => {
      console.log("Error: ", error);
    });
});


router.get('/add', (req, res, next) => {
  res.render('add');
});

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


router.get('/machine', (req, res, next) => {
  res.render('machine');
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
  newMachine.save()
    .then((newMachine) => {
      res.redirect('/add');
    })
    .catch((error) => {
      console.log(error);
    });
});

/*
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});
*/

module.exports = router;
