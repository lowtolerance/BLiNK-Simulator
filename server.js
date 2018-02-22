var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var url = require('url');
var fs = require('fs');
var BLiNK = require('BLiNK');

app.listen(5000);

function handler (req, res) {
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

io.sockets.on('connection', function (socket) {
    socket.on('example-ping', (data) => {
        console.log(data);
        BLiNK.stringParser(data["BLiNKString"]);
        delay = 2;
        setTimeout(function() {
            socket.emit("example-pong", { BLiNKString: '@0#0!@1#0!@2#0!@3#0!@4#0!@5#0!@6#0!@7#0!'} );
        }, delay*1000);
    });
});