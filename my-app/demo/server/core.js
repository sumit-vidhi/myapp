const mysql = require("mysql");
const nodemailer = require("nodemailer");
const config = require("./config");

// Uncomment if mysql has not been properly promisified yet
var Promise = require("bluebird");
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
Promise.promisifyAll(require("nodemailer"));

var pool  = mysql.createPool(config.db);

function getSqlConnection() {
    return pool.getConnectionAsync().disposer(function(connection) {
        connection.release();
    });
}

function getNodeMailer() {
    return nodemailer.createTransport(config.email);
}

exports.getSqlConnection = getSqlConnection;
exports.Mailer =  getNodeMailer();