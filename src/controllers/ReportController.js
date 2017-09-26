'user strict';

const fs = require('fs');

module.exports = class ReportController {
    index () {
        return fs.readFileSync('./reports/app-crash.txt');
    }
}
