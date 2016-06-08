/**
 * Created by HwangJaeYoung on 2016-06-05.
 * forest62590@gmail.com
 */
var fs = require('fs');
var http = require('http');
var express = require('express');

var app = express();

// Connecting the oneM2M Web Tester page.
app.get('/', function(reqeust, response) {
    fs.readFile('TestingView.html', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text.html'});
        response.end(data);

        // todo
        // ejs로 동적으로 리소스 리스트 생성
    });
});



app.get('/getBodyInfo', function(request, response) {




});

// Creating a resource such as CSE_Retrieve, AE_Create, etc
app.post('/createResource', function(request, response) {

    var aa = request.body.resourceName;

    console.log(aa);
    /*
    fs.open('./ResourceFormat/' + resourceName +'.json', 'a', function(err, fd) {
        if(err)
            console.log('FATAL An error occurred trying to write in the file: ' + err);

        // 리소스 이름으로 json생성하기
        var resourceInfo = "{" +
            "resourceName: " + resourceName +
        "}";

        var jsonObject = JSON.stringify(resourceInfo); // Creating the json format to save the resourceName

        fs.write(fd, jsonObject, function (err) {
            if (err)
                console.log('FATAL An error occurred trying to write in the file: ' + err);
            else {
                console.log('Success creating the resource file : ' + resourceName);
            }
        });
    });

    response.writeHead(200, {'Content-Type': 'text.html'});
    response.write(resourceName);
    */
});

// Server start
http.createServer(app).listen(62590, function () {
    console.log('Server running port at ' +  'http://127.0.0.1:62590');
});