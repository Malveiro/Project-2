const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/home', (req, res, next) => {
  res.render('home');
});

router.get('/list', (req, res, next) => {
  res.render('list');
});

router.get('/details', (req, res, next) => {
  res.render('list');
});

router.get('/add', (req, res, next) => {
  res.render('add');
});
/*
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});
*/

module.exports = router;
