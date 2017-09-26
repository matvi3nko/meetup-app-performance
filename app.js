'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const CrashController = require('./src/controllers/CrashController');
const ApiService = require('./src/services/ApiService');

const crashController = new CrashController(new ApiService());

function bodyParserMiddleware (req, res, next) {
    let body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        req.body = JSON.parse(body);
        next();
    });
}

function defaulRequestHandler (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Processed');
}

let server = http.createServer(function (req, res) {
    let requestUrl = url.parse(req.url);

    //routing
    if ('POST /crash/real' === `${req.method} ${requestUrl.pathname}`) {
        let handler = crashController.real.bind(crashController, req, res)
        bodyParserMiddleware(req, res, handler);
    } if ('POST /crash' === `${req.method} ${requestUrl.pathname}`) {
        let handler = crashController.index.bind(crashController, req, res)
        bodyParserMiddleware(req, res, handler);
    } if (req.method == 'POST') {
        let handler = defaulRequestHandler.bind(crashController, req, res)
        bodyParserMiddleware(req, res, handler);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('Processed');
    }
});

server.listen(3000);
console.log(`This process pid is ${process.pid}`);

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
    process.abort();
  });
