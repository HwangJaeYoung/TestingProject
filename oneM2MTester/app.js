/**
 * Created by HwangJaeYoung
 * forest62590@gmail.com
 */

var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var requestFunctions = require('./RequestFuntions');
var dbClient = require('./DataBase/DatabaseConfig');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('Javascript'));
app.use(express.static('CSS'));

// Connecting the oneM2M Web Tester page.
app.get('/', function (request, response) {

    var client = dbClient.getDBClient(); // Getting Database information.

    client.query('SELECT * FROM onem2m ORDER BY time ASC', function (error, results, fields) {
        if (error) { // error
            console.log("MySQL : Database resource retrieve error : " + error);
            response.status(500).end();
        } else { // success
            var jsonObject = new Object();
            var jsonArray = new Array();

            // Creating the jsonArray to save the resourceName and resourceTitle
            for (var i = 0; i < results.length; i++) {
                var resourceName = results[i].resourceName;
                var resourceTitle = results[i].resourceTitle;

                var tempObject = new Object();
                tempObject.resourceName = resourceName;
                tempObject.resourceTitle = resourceTitle;

                jsonArray.push(tempObject);
            }
            jsonObject.resourceInfo = jsonArray;

            console.log('MySQL : Success retrieving the resource');

            fs.readFile('TestingView.ejs', 'utf-8', function (error, data) {
                response.status(200).end(ejs.render(data, {resourceConfig: JSON.stringify(jsonObject)}));
            });
        }
    });
});

// Retrieving the request form information from MySQL
app.get('/getSelectedResource/:resourceName', function (request, response) {

    var resourceName = request.params.resourceName;
    var client = dbClient.getDBClient(); // Getting Database information.

    client.query('SELECT * FROM onem2m WHERE resourceName=?', [resourceName], function (error, results, fields) {
        if (error) { // error
            console.log("MySQL : Database resource retrieve error : " + error);
            response.status(500).end();
        } else { // success
            // Formatting the JSON Object
            var jsonObject = new Object();
            var jsonArray = new Array();

            jsonObject.requestInfo = new Object();
            jsonObject.requestInfo.urlInformation = results[0].urlInformation;
            jsonObject.requestInfo.methodInformation = results[0].methodInformation;
            jsonObject.requestInfo.bodyInformation = results[0].resourceBody;

            // Creating the JSONArray to save the request information
            jsonArray.push(results[0].header1); jsonArray.push(results[0].header2); jsonArray.push(results[0].header3); jsonArray.push(results[0].header4);
            jsonArray.push(results[0].header5); jsonArray.push(results[0].header6); jsonArray.push(results[0].header7); jsonArray.push(results[0].header8);
            jsonObject.requestInfo.headerInformation = jsonArray;

            response.status(200).send(jsonObject);
            console.log('MySQL : Success retrieving the resource');
        }
    });
});

// Deleting the selected resource list
app.delete('/deleteResource/:resourceName', function (request, response) {

    var resourceName = request.params.resourceName;
    var client = dbClient.getDBClient(); // Getting Database information.

    client.query('DELETE FROM onem2m WHERE resourceName=?', [resourceName], function (error, results, fields) {
        if (error) { // error
            console.log("MySQL : Database resource delete error : " + error);
            response.status(500).end();
        } else { // success
            client.query('SELECT * FROM onem2m ORDER BY time ASC', function (error, results, fields) {
                if (error) { // error
                    console.log("MySQL : Database resource delete error : " + error);
                    response.status(500).end();
                } else { // success
                    console.log('MySQL : Success deleting the resource');

                    var jsonObject = new Object();
                    var jsonArray = new Array();

                    // Creating the jsonArray to save the resourceName and resourceTitle
                    for (var i = 0; i < results.length; i++) {
                        var resourceName = results[i].resourceName;
                        var resourceTitle = results[i].resourceTitle;

                        var tempObject = new Object();
                        tempObject.resourceName = resourceName;
                        tempObject.resourceTitle = resourceTitle;

                        jsonArray.push(tempObject);
                    }
                    jsonObject.resourceInfo = jsonArray;
                    response.status(200).send(jsonObject);
                }
            });
        }
    });
});

// Creating a resource such as CSE_Retrieve, AE_Create, etc
app.post('/createResource', function (request, response) {

    var resourceName = request.body.resourceName;
    var resourceTitle = request.body.resourceTitle;

    var client = dbClient.getDBClient(); // Getting Database information.

    var time = timestamp( );

    client.query('INSERT INTO onem2m (resourceName, resourceTitle, time) VALUES (?, ?, ?)', [resourceName, resourceTitle, time], function (error, results, fields) {
        if (error) { // error
            console.log("MySQL : Database resource creation error : " + error);
            response.status(500).end();
        } else { // success
            console.log('MySQL : Success creating the resource : ' + resourceName);
            response.status(201).end();
        }
    });
});

// Saving the request information
app.post('/saveResource', function (request, response) {

    var resultObj = request.body;
    var requestInfoObject = resultObj['requestInfo'];

    var resourceName = requestInfoObject['resourceName'];
    var urlInformation = requestInfoObject['urlInformation'];
    var methodInformation = requestInfoObject['methodInformation'];
    var boyInformation = requestInfoObject['bodyInformation'];
    var headerInformation = requestInfoObject['headerInformation'];

    // Arranging the header values
    var headerArray = new Array();
    for(var i = 0; i < headerInformation.length; i++) {
        var tempHeaderValue = headerInformation[i]['headerName'] + ":" + headerInformation[i]['headerValue'];
        headerArray[i] = tempHeaderValue;
    }

    for(var i = headerInformation.length; i < 8; i++) // Setting the null to MySQL header value
        headerArray[i] = null;

    var client = dbClient.getDBClient(); // Getting Database information.

    // Updating the user request format
    client.query('UPDATE onem2m SET urlInformation=?, methodInformation=?, header1=?, header2=?, header3=?, header4=?, header5=?, header6=?, header7=?, header8=?, resourceBody=? WHERE resourceName=?',
        [urlInformation, methodInformation, headerArray[0], headerArray[1], headerArray[2], headerArray[3], headerArray[4], headerArray[5], headerArray[6], headerArray[7], boyInformation, resourceName], function (error, results, fields) {
            if (error) { // error
                console.log("MySQL : Database resource update error : " + error);
                response.status(500).end();
            } else { // success
                console.log('MySQL : Success updating the resource : ' + resourceName);
                response.status(200).end();
            }
        });
});

app.post('/requestManage', function (request, response) {
    var resultObj = request.body;
    var requestInfoObject = resultObj['requestInfo'];

    requestFunctions.requestController(requestInfoObject, function(responseObject){
        var status = responseObject['status'];
        response.status(status).send(responseObject);
    });
});

// Updating the resource list index
app.put('/updatingResourceList', function (request, response) {
    // todo
    // update query




});

// Server start
http.createServer(app).listen(62590, function () {
    console.log('Server running port at ' + 'http://127.0.0.1:62590');
});

function timestamp( ) {
    var cur_d = new Date();

    var msec = '';

    if ((parseInt(cur_d.getMilliseconds(), 10) < 10)) {
        msec = ('00' + cur_d.getMilliseconds());
    } else if ((parseInt(cur_d.getMilliseconds(), 10) < 100)) {
        msec = ('0' + cur_d.getMilliseconds());
    } else {
        msec = cur_d.getMilliseconds();
    }

    var time = "" + cur_d.getFullYear() + (cur_d.getMonth() + 1) + cur_d.getDate() + cur_d.getHours() + cur_d.getMinutes() + cur_d.getSeconds() + msec;

    return time;
}