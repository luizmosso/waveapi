// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var cron = require('node-cron');
var { DisableFamiliesByEndOfAttendance } = require('./jobs/familia');
require('dotenv').config();

// MongoDB
mongoose.connect(
  `mongodb://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}/mandela`
);

// Express
var app = express();
app.use(cors());

// Habilitando o Cross Domain
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );

  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));

// Start Server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('API is running fine!');
});

// Job diário
cron.schedule('*/30 * * * * *', () => {
  DisableFamilyByCriteria();
});
