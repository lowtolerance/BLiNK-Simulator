var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var url = require('url');
var fs = require('fs');

app.listen(81);

function handler (req, rs) {
    var path = url.parse(req.url).pathname;

    if (path == '/') {
        index = fs.readFile(__dirname + '/public/index.html',
            function(error, data) {
                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load index.html");
                }

                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            });
    } else if( /\.(js)$/.test(path) ) {
        index = fs.readFile(__dirname + '/public' + path,
            function(error, data) {
                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load " + path);
                }

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(data);
            });
    } else {
        res.writeHead(404);
        res.end("Error: 404 - File not found.");
    }
}