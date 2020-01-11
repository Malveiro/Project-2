const express = require("express");
const router = express.Router();
const Machine = require("../models/machine");
const Log = require("../models/log");
// const weather = require("openweather-apis");
// weather.setLang("pt");
// weather.setCity("Lisbon");
// weather.setUnits("metric");
// weather.setAPPID("f56f8d4ec36f3c9e29631c3c465879f8");
const axios = require("axios");
	

router.get("/", (req, res, next) => {
    res.render("home");
});

router.get("/list", (req, res) => {
  Promise.all([
    Log.distinct("machine")
    .then(machineIds => 
      Machine.find({"_id": { $in: machineIds }})
      .sort("machine")),

    Log.find(req.query)
      .sort("-date")
      .populate("machine")
  ])
    .then(([machines, logs]) => {
      let apiKey = process.env.WEATHER_API_KEY;
      let city = 'Lisbon';
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      
      axios.get(url).then((response) => {
        let data = response.data;
        let weatherIcon =  data.weather[0].icon;
        let temperature = parseFloat(data.main.temp).toFixed(1);
        res.render("list", { logs, machines, selectedMachineId: req.query.machine, user: req.session.user, message: 'Good morning' , weatherIcon, temperature });
    })
    .catch(error => {
      console.log("Error while retrieving the logs", error);
    });
  });
});


router.get("/machine-list", (req, res) => {
  
    Machine.find()
      .sort("machine")
  
    .then( machines => {
        res.render("machine-list", { machines });
    })
    .catch(error => {
      res.render("error", {
        errorMessage: `Error while retrieving the list of machines: ${error.message}`
      });
    });
});

router.get("/machine/:machineId", (req, res) => {
  Machine.findById({ _id: req.params.machineId })
    .then(machine => {
      res.render("machine-details", { machine });
    })
    .catch(error => {
      res.render("error", {
        errorMessage: `Error while retrieving the details of the machine: ${error.message}`
      });
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
