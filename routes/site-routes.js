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
router.get("/machine", (req, res) => {
  res.render("machine", { user: req.session.user, message: "Good morning" });
});

router.get("/add", (req, res) => {
  Machine.find()
    .then(machines => {
      res.render("add", {
        machines,
        user: req.session.user,
        message: "Good morning"
      });
    })
    .catch(err => {
      console.log(err);
      res.render("error", {
        errorMessage: err.message,
        user: req.session.user,
        message: "Good morning"
      });
    });
});

router.get("/edit", (req, res) => {
  let logID = req.query.log_id;

  console.log(logID);
  Promise.all([
    Log.findById(logID)
      .populate("machine")
      .populate("technician"),
    Machine.find()
  ])
    .then(([log, machines]) => {
      console.log(log);
      res.render("edit", {
        log,
        machines,
        user: req.session.user,
        message: "Good morning"
      });
    })
    .catch(error => {
      console.log("Error", error);
    });
});

router.post("/edit", (req, res) => {
  const { machine, date, synthesis, otherTechnician, description } = req.body;
  Log.update({ _id: req.query.log_id }, { $set: { machine, date, synthesis, otherTechnician, description } })
    .then(() => {
      res.redirect(`/details/${req.query.log_id}`);
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/machine/:machineId/edit", (req, res) => {
  Machine.findById({ _id: req.params.machineId })
    .then(machine => {
      res.render("machine-edit", {
        machine,
        user: req.session.user,
        message: "Good morning"
      });
    })
    .catch(error => {
      res.render("error", {
        errorMessage: `Error while retrieving the details of the machine: ${error.message}`,
        user: req.session.user,
        message: "Good morning"
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
        errorMessage: `Error while editing the details of the machine: ${error.message}`,
        user: req.session.user,
        message: "Good morning"
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
        errorMessage: `Error while deleting the machine: ${error.message}`,
        user: req.session.user,
        message: "Good morning"
      });
    });
});

router.post("/details/:logId/delete", (req, res, next) => {
  Log.findByIdAndRemove({ _id: req.params.logId })
    .then(theLog => {
      res.redirect("/list");
    })
    .catch(error => {
      console.log("Error: ", error);
    });
});

module.exports = router;
