/**
 * Created by HwangJaeYoung on 2016-06-05.
 * forest62590@gmail.com
 */
var fs = require('fs');
var http = require('http');

http.createServer(function (request, response) {
    fs.readFile('TestView.html', function(error, data) {
        response.writeHead(200, {'Content-Type': 'text.html'});
        response.end(data);
    });
}).listen(62590, function ( ) {
    console.log('Server running at http://127.0.0.1:62590');
})