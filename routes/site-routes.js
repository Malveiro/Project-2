const express = require("express");
const router = express.Router();
const Log = require("../models/log");
const Machine = require("../models/machine");

router.get("/", (req, res, next) => {
  res.render("home");
});

router.use((req, res, next) => {
  console.log(req.session)
  if (req.session.currentUser) {
    // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {
    //    |
    res.redirect("/"); //    |
  } //    |
}); // ------------------------------------
//     |
//     V
router.get("/machine", (req, res, next) => {
  res.render("machine");
});

router.get("/add", (req, res, next) => {
  Machine.find()
    .then(machines => {
      res.render("add", {
        machines
      });
    })
    .catch(err => {
      console.log(err);
      res.render("error", {
        errorMessage: err.message
      });
    });
});

router.get("/edit", (req, res, next) => {
  let logID = req.query.log_id;
  //Fetch the book using Mongoose using findById
  console.log(logID);
  Promise.all([Log.findById(logID).populate("machine"), Machine.find()])
    .then(([log, machines]) => {
      console.log(log);
      res.render("edit", {
        log,
        machines
      });
    })
    .catch(error => {
      console.log("Error", error);
    });
});

router.post("/edit", (req, res) => {
  let logID = req.query.log_id;
  const { machine, date, synthesis, otherTechnician, description } = req.body;
  //Find author by name Author.find
  Log.update({ _id: req.query.log_id }, { $set: { machine, date, synthesis, otherTechnician, description } })
    .then(() => {
      res.redirect("/list");
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
