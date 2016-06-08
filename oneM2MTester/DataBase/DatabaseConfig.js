/**
 * Created by Blossom on 2016-06-08.
 */

var mysql = require('mysql');

// Database common information
var client = mysql.createConnection({
    user : 'root',
    password : 'blossom',
    database : 'blossom'
});

// return Database connection client
exports.getDBClient = function( ) {
    return client;
};