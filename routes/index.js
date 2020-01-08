const express = require("express");
const router = express.Router();
const Machine = require("../models/machine");
const Log = require("../models/log");
const weather = require("openweather-apis");
weather.setLang("pt");
weather.setCity("Lisbon");
weather.setUnits("metric");
weather.setAPPID("f56f8d4ec36f3c9e29631c3c465879f8");

router.get("/", (req, res, next) => {
  weather.getTemperature((err, temp) => {
    res.render("home", { temp });
  });
});

router.get("/list", (req, res) => {
  Promise.all([
    Machine.find(),
    Log.find(req.query)
      .sort("-date")
      .populate("machine")
  ])
    .then(([machines, logs]) => {
      weather.getTemperature((err, temp) => {
        res.render("list", { logs, machines, user: req.session.user, temp });
      });
    })
    .catch(error => {
      console.log("Error while retrieving the logs", error);
    });
});

router.get("/details", (req, res) => {
  Log.find()
  .populate("machine")
    .then(allLogsFromDB => {
      let userAuthenticated = req.session.currentUser ? true : false;
      res.render("details", { logs: allLogsFromDB, userAuthenticated });
    })
    .catch(error => {
    });
});

router.get("/details/:logId", (req, res, next) => {
  Log.findById({ _id: req.params.logId })
    .populate("machine")
    .then(theLog => {
      console.log("The Log", theLog);
      res.render("details", { logs: theLog });
    })
    .catch(error => {
      console.log("Error: ", error);
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




router.post("/list", (req, res) => {
  const { machine, date, synthesis, otherTechnician, description } = req.body;
  const newLog = new Log({
    machine,
    date,
    synthesis,
    otherTechnician,
    description
  });
  newLog
    .save()
    .then(newLog => {
      res.redirect("/list");
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/add", (req, res) => {
  const { machine, model, info } = req.body;
  const newMachine = new Machine({
    machine: machine.toUpperCase(),
    model,
    info
  });

  Machine.findOne({
    machine: machine.toUpperCase()
  })
    .then(machine => {
      if (machine !== null) {
        res.render("machine", {
          errorMessage: "That machine already exists!"
        });
        return;
      } else {
        newMachine
          .save()
          .then(newMachine => {
            res.redirect("/add");
          })
          .catch(error => {
            console.log(error);
          });
      }
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
