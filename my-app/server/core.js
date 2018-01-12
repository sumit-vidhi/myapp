const mysql = require("mysql");
var sql = require('mssql');
const nodemailer = require("nodemailer");
const config = require("./config");

// Uncomment if mysql has not been properly promisified yet
// var Promise = require("bluebird");
// Promise.promisifyAll(mysql);
// Promise.promisifyAll(require("mysql/lib/Connection").prototype);
// Promise.promisifyAll(require("mysql/lib/Pool").prototype);
// Promise.promisifyAll(require("nodemailer"));

// var pool  = mysql.createPool(config.db);

// function getSqlConnection() {
//     return pool.getConnectionAsync().disposer(function(connection) {
//         connection.release();
//     });
// }

// var db= sql.connect(config.db,function(){
//     console.log("connected");
// });


// function getNodeMailer() {
//     return nodemailer.createTransport(config.email);
// }

// exports.connect=function(){
//   return  new sql.Request();;
// }
var transport= nodemailer.createTransport(config.email);
//exports.getSqlConnection = db;
exports.Mailer =transport;