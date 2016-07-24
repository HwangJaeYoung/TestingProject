/**
 * Created by HwangJaeYoung
 * forest62590@gmail.com
 */

var requestToServer = require('request');

function requestGetDelete(requestObject, requestCallBack) {
    var urlInformation = requestObject['urlInformation'];
    var headerInformation = requestObject['headerInformation'];

    var jsonObject  = new Object( );
    var headerChecking = false;

    // Creating the dynamic body set
    for(var i = 0; i < headerInformation.length; i++) {
        jsonObject[headerInformation[i]['headerName']] = headerInformation[i]['headerValue'];

        if(headerInformation[i]['headerName'].toUpperCase() == "ACCEPT")
            headerChecking = true;
    }

    if(headerChecking == false)
        jsonObject["Accept"] = "*/*";

    requestToServer({
        url : urlInformation,
        method : requestObject['methodInformation'],
        headers : jsonObject,
        timeout : 10000
    }, function(error, response ,body) {
        if(error) {
            console.log(error);

            if(error.code === 'ETIMEDOUT') {
                var responseObject = Object();
                responseObject.status = "601";
                requestCallBack(responseObject);
            }
        } else {
            console.log(typeof(response.statusCode));
            var responseObject = Object();
            responseObject.status = response.statusCode;
            responseObject.headers = response.headers;
            responseObject.body = body;
            requestCallBack(responseObject);
        }
    });
}

function requestPostPut(requestObject, requestCallBack) {
    var urlInformation = requestObject['urlInformation'];
    var headerInformation = requestObject['headerInformation'];

    var jsonObject  = new Object( );
    var headerChecking = false;

    // Creating the dynamic body set
    for(var i = 0; i < headerInformation.length; i++) {
        jsonObject[headerInformation[i]['headerName']] = headerInformation[i]['headerValue'];

        if(headerInformation[i]['headerName'].toUpperCase() == "ACCEPT")
            headerChecking = true;
    }

    if(headerChecking == false)
        jsonObject["Accept"] = "*/*";

    requestToServer({
        url : urlInformation,
        method : requestObject['methodInformation'],
        headers : jsonObject,
        body : requestObject['bodyInformation'],
        timeout : 10000
    }, function(error, response ,body) {
        if(error) {
            console.log(error);

            if(error.code === 'ETIMEDOUT') {
                var responseObject = Object();
                responseObject.status = "601";
                requestCallBack(responseObject);
            }
        } else {
            var responseObject = Object();
            responseObject.status = response.statusCode;
            responseObject.headers = response.headers;
            responseObject.body = body;
            requestCallBack(responseObject);
        }
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