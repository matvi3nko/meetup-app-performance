'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const factoryRouter = require('./routes/factoryRouter');
const CrashController = require('./src/controllers/CrashController');
const ApiService = require('./src/services/ApiService');

//routing
let router = factoryRouter(new CrashController(new ApiService()));

//app initialization
const app = express();
app.use(bodyParser.json());
app.use('/', router);
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        //1) check is --abort-on-uncaught-exception is enabled
        //2) use strategy - is abort allowed for current situation
        console.error(err);
        process.abort();
    } else {
        //handle logic of core dump cretion.
        res.status(500).send('Something broke!');
        next();
    }
});

app.listen(3000);

console.log(`This process is pid ${process.pid}`);

process.on('unhandledRejection', (reason, p) => {
    // application specific logging, throwing an error, or other logic here
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
    process.abort();
  });
