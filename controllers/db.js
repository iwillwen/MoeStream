var exec = require('child_process').exec;
module.exports = function (web) {
    var db = exec('mongod --dbpath=/home/node --port 20088', function () {});
};
