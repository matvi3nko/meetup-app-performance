'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const CrashController = require('./src/controllers/CrashController');

let policy = { id: 777 };
let crashController = new CrashController(policy);

function bodyParserMiddleware (req, res, next) {
    let body = '';
    req.on('data', function (data) {
        body += data;
        console.log("Partial body: " + body);
    });
    req.on('end', function () {
        console.log("Body: " + body);
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

    if ('POST /crash' === `${req.method} ${requestUrl.pathname}`) {
        let handler = crashController.index.bind(crashController, req, res)
        bodyParserMiddleware(req, res, handler);
    } if (req.method == 'POST') {
        let handler = defaulRequestHandler.bind(crashController, req, res)
        bodyParserMiddleware(req, res, handler);
    } else {
        //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
        var html = fs.readFileSync('index.html');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }

});


server.listen(3000);
console.log(`This process is pid ${process.pid}`);
