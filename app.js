require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

hbs.registerHelper('isSelected', ( machine, logMachine ) => {
  console.log("machine", machine);
  console.log("logMachine", logMachine);
  if (machine === logMachine) {
    console.log("found it");
    return 'selected';
  } else {
    return '';
  }
});

mongoose
  .connect('mongodb://heroku_2h4c6whh:877ukk6dl6avd74umhb5sgpn3s@ds035016.mlab.com:35016/heroku_2h4c6whh', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable('etag');

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60 * 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

const index = require('./routes/index');
app.use('/', index);

app.use('/', require('./routes/auth-routes'));
app.use('/', require('./routes/site-routes'))

module.exports = app;
