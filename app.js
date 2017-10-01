'use strict';

const http = require('http');
const url = require('url');
const CrashController = require('./src/controllers/CrashController');
const ReportController = require('./src/controllers/ReportController');
const MemoryLeakController = require('./src/controllers/MemoryLeakController');
const ApiService = require('./src/services/ApiService');
const nodeReport = require('node-report');
nodeReport.setDirectory('./reports');

const crashController = new CrashController(new ApiService());
const reportController = new ReportController();
const memoryLeakController = new MemoryLeakController();

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
    } if ('GET /report' === `${req.method} ${requestUrl.pathname}`) {
        reportController.index(req, res);
    } if ('GET /leak/newspace' === `${req.method} ${requestUrl.pathname}`) {
        memoryLeakController.newSpace(req, res);
    } if ('GET /leak/oldspace' === `${req.method} ${requestUrl.pathname}`) {
        memoryLeakController.oldSpace(req, res);
    }

    else {
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

process.on('uncaughtException', (err) => {
    console.error(err);
    process.abort();
});



process.on('uncaughtException', function (err) {
    //Production troubleshooting
    console.log(err);
});


