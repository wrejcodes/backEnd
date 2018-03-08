'use strict';
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config');
const experiment = require('./routes/expirement');
const target = require('./routes/target');

const env = process.env.NODE_ENV || 'development';

// Create the server for the API to run on
const app = express();

// View engine configs
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Set up middleware for the API server
app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Testing route to ensure server is up
app.get('/', (req, res) => {
  res.json({
    'Welcome to the CSC 424 API': '',
    'uptime': `${process.uptime()}`,
  });
});

app.use('/experiment', experiment);
app.use('/target', target);

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {},
  });
});

// Creating a section for dev configs and prod configs
if (env === 'development') {
  app.listen(config.devPort, () => {
    console.log(`API server started at http://localhost:${config.devPort}`);
  });
} else {
  app.listen(config.prodPort, () => {
    console.log(`API server started at http://localhost:${config.prodPort}`);
  });
}
