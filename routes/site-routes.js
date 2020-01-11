const express = require("express");
const router = express.Router();
const Log = require("../models/log");
const Machine = require("../models/machine");

router.get("/", (req, res, next) => {
  res.render("home");
});

router.use((req, res, next) => {
  console.log(req.session);
  if (req.session.user) {
    // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {
    //    |
    res.redirect("/login"); //    |
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
  Log.update({ _id: req.query.log_id }, { $set: { machine, date, synthesis, otherTechnician, description } })
    .then(() => {
      res.redirect("/list");
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/machine/:machineId/edit", (req, res) => {
  Machine.findById({ _id: req.params.machineId })
    .then(machine => {
      res.render("machine-edit", { machine });
    })
    .catch(error => {
      res.render("error", {
        errorMessage: `Error while retrieving the details of the machine: ${error.message}`
      });
    });
});

router.post("/machine/:machineId/edit", (req, res) => {
  Machine.update({ _id: req.params.machineId }, { $set: req.body })
    .then(() => {
      res.redirect(`/machine/${req.params.machineId}`);
    })
    .catch(error => {
      res.render("error", {
        errorMessage: `Error while editing the details of the machine: ${error.message}`
      });
    });
});


router.post("/machine/:machineId/delete", (req, res) => {
  Machine.findByIdAndRemove({ _id: req.params.machineId })
    .then(machine => {
      res.redirect("/machine-list");
    })
    .catch(error => {
      res.render("error", {
        errorMessage: `Error while deleting the machine: ${error.message}`
      });
    });
});

module.exports = router;
