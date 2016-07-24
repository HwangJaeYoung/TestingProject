/**
 * Created by HwangJaeYoung
 * forest62590@gmail.com
 */

var mysql = require('mysql');

// Database common information
var client = mysql.createConnection({
    user : 'root',
    password : 'blossom',
    database : 'blossom'
});

var pool  = mysql.createPool({
    connectionLimit : 20,
    user            : 'root',
    password        : 'blossom',
    database        : 'blossom'
});

// return Database connection client
exports.getDBClient = function( ) {
    return client;
};

exports.getDBPool = function( ) {
    return pool;
}