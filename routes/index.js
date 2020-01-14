const express = require("express");
const router = express.Router();
const Machine = require("../models/machine");
const Log = require("../models/log");
const axios = require("axios");

router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/list", (req, res) => {
  Promise.all([
    Log.distinct("machine").then(machineIds => Machine.find({ _id: { $in: machineIds } }).sort("machine")),

    Log.find(req.query)
      .sort("-date")
      .populate("machine")
      .populate("technician")
  ]).then(([machines, logs]) => {
    let apiKey = process.env.WEATHER_API_KEY;
    let city = "Lisbon";
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    axios
      .get(url)
      .then(response => {
        let data = response.data;
        let weatherIcon = data.weather[0].icon;
        let temperature = parseFloat(data.main.temp).toFixed(1);
        res.render("list", {
          logs,
          machines,
          selectedMachineId: req.query.machine,
          user: req.session.user,
          message: "Good morning",
          weatherIcon,
          temperature
        });
      })
      .catch(error => {
        res.render("error", {
          errorMessage: `Error while retrieving the list of logs: ${error.message}`,
          user: req.session.user,
          message: "Good morning"
        });
      });
  });
});

router.get("/machine-list", (req, res) => {
  Machine.find()
    .sort("machine")

    .then(machines => {
      res.render("machine-list", {
        machines,
        user: req.session.user,
        message: "Good morning"
      });
    })
    .catch(error => {
      res.render("error", {
        errorMessage: `Error while retrieving the list of machines: ${error.message}`,
        user: req.session.user,
        message: "Good morning"
      });
    });
});

router.get("/machine/:machineId", (req, res) => {
  Machine.findById({ _id: req.params.machineId })
    .then(machine => {
      res.render("machine-details", {
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

router.get("/details/:logId", (req, res) => {
  Log.findById({ _id: req.params.logId })
    .populate("machine")
    .populate("technician")

    .then(logs => {
      res.render("details", {
        logs,
        user: req.session.user,
        message: "Good morning"
      });
    })
    .catch(error => {
      res.render("error", {
        errorMessage: `Error while retrieving the log details: ${error.message}`,
        user: req.session.user,
        message: "Good morning"
      });
    });
});

router.post("/list", (req, res) => {
  const { machine, date, synthesis, otherTechnician, description } = req.body;
  const newLog = new Log({
    machine,
    date,
    synthesis,
    technician: req.session.user._id,
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
          errorMessage: "That machine already exists!",
          user: req.session.user,
          message: "Good morning"
        });
      } else {
        return newMachine.save().then(newMachine => {
          res.redirect("/add");
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
