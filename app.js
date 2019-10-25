require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');

const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

require('./configs/passport');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
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
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Express View engine setup

app.use(express.static(path.join(__dirname, 'public')));

// ADD SESSION SETTINGS HERE:

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24
  })
}));

app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = 'Final Project';

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'] // <== this will be the URL of our React app (it will be running on port 3000)
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/house', require('./routes/house'));
app.use('/api/user', require('./routes/user'));
app.use('/api/review', require('./routes/review'));


app.use((req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});


module.exports = app;