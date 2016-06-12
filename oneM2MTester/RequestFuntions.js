/**
 * Created by HwangJaeYoung
 * forest62590@gmail.com
 */

var requestToServer = require('request');

function requestGetDelete(requestObject, requestCallBack) {
    var urlInformation = requestObject['urlInformation'];
    var headerInformation = requestObject['headerInformation'];

    var jsonObject  = new Object( );

    // Creating the dynamic body set
    for(var i = 0; i < headerInformation.length; i++)
        jsonObject[headerInformation[i]['headerName']] = headerInformation[i]['headerValue'];

    requestToServer({
        url : urlInformation,
        method : requestObject['methodInformation'],
        headers : jsonObject
    }, function(error, response ,body) {
        var responseObject = Object();
        responseObject.status = response.statusCode;
        responseObject.headers = response.headers;
        responseObject.body = body;
        requestCallBack(responseObject);
    });
}

function requestPostPut(requestObject, requestCallBack) {
    var urlInformation = requestObject['urlInformation'];
    var headerInformation = requestObject['headerInformation'];

    var jsonObject  = new Object( );

    // Creating the dynamic body set
    for(var i = 0; i < headerInformation.length; i++)
        jsonObject[headerInformation[i]['headerName']] = headerInformation[i]['headerValue'];

    requestToServer({
        url : urlInformation,
        method : requestObject['methodInformation'],
        headers : jsonObject,
        body : requestObject['bodyInformation']
    }, function(error, response ,body) {
        var responseObject = Object();
        responseObject.status = response.statusCode;
        responseObject.headers = response.headers;
        responseObject.body = body;
        requestCallBack(responseObject);
    });
}

// Controlling the submitted request
exports.requestController = function(requestObject, controllerCallBack) {
    var method = requestObject['methodInformation'];

    // Selecting the method
    if(method == "GET" || method == "DELETE") {
        requestGetDelete(requestObject, function (resultObject) {
            controllerCallBack(resultObject);
        });
    } else if(method == "POST" || method == "PUT") {
        requestPostPut(requestObject, function (resultObject) {
            controllerCallBack(resultObject);
        });
    }
}