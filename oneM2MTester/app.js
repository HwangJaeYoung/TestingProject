/**
 * Created by HwangJaeYoung on 2016-06-05.
 * forest62590@gmail.com
 */
var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var dbClient = require('./DataBase/DatabaseConfig');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Connecting the oneM2M Web Tester page.
app.get('/', function (reqeust, response) {

    var client = dbClient.getDBClient(); // Getting Database information.

    client.query('SELECT * FROM onem2m', function (error, results, fields) {
        if (error) { // error
            console.log("Database resource retrieve error : " + error);
            response.writeHead(500, {'Content-Type': 'text.html'});
            response.end();
        } else { // success

            var jsonObject = new Object();
            var jsonArray = new Array();

            // Creating the jsonArry to save the resourceName and resourceTitle
            for (var i = 0; i < results.length; i++) {
                var resourceName = results[i].resourceName;
                var resourceTitle = results[i].resourceTitle;

                var tempObject = new Object();
                tempObject.resourceName = resourceName;
                tempObject.resourceTitle = resourceTitle;

                jsonArray.push(tempObject);
            }
            jsonObject.resourceInfo = jsonArray;

            console.log('Success retrieving the resource');

            fs.readFile('TestingView.ejs', 'utf-8', function (error, data) {
                response.writeHead(200, {'Content-Type': 'text.html'});
                response.end(ejs.render(data, { resoruceConfig : JSON.stringify(jsonObject) }));
            });
        }
    });
});

// Creating a resource such as CSE_Retrieve, AE_Create, etc
app.post('/createResource', function (request, response) {

    var resourceName = request.body.resourceName;
    var resourceTitle = request.body.resourceTitle;

    var client = dbClient.getDBClient(); // Getting Database information.

    client.query('INSERT INTO onem2m (resourceName, resourceTitle) VALUES (?, ?)', [resourceName, resourceTitle], function (error, results, fields) {
        if (error) { // error
            console.log("Database resource creation error : " + error);
            response.writeHead(500, {'Content-Type': 'text.html'});
            response.end();
        } else { // success
            console.log('Success creating the resource : ' + resourceName);
            response.writeHead(201, {'Content-Type': 'text.html'});
            response.end();
        }
    });
});

// Server start
http.createServer(app).listen(62590, function () {
    console.log('Server running port at ' + 'http://127.0.0.1:62590');
});