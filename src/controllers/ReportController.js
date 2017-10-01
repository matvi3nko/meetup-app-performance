'user strict';

const fs = require('fs');
module.exports = class ReportController {
    index (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let filename = './reports/app-crash.txt';
        let report = fs.readFileSync(filename);

        res.end(fs.readFileSync(report));
    }
}
