// Dependencies
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

import { DisableFamilyByCriteria } from './src/jobs/familia';
import isAuth from './src/middlewares/is-auth';
import { usuarioRouter, familiaRouter, instituicaoRouter } from './src/routes';

// MongoDB
mongoose.set('useFindAndModify', false);
const connectString = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}/${process.env.DBSCHEMA}?retryWrites=true&w=majority`;
mongoose.connect(connectString, {
  useUnifiedTopology: true,
  useCreateIndex: true,
});

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
app.use('/api/usuario', isAuth, usuarioRouter);
app.use('/api/familia', isAuth, familiaRouter);
app.use('/api/instituicao', isAuth, instituicaoRouter);

// Start Server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('API is running fine!');
});

// Job diário
cron.schedule('0 0 * * *', () => {
  DisableFamilyByCriteria();
});
