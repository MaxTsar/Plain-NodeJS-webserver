const   http = require('http'),
        fs = require('fs');

function getMIME(req) {
    let dot = req.lastIndexOf('.');
    let mime = req.slice(dot+1);
    if(req == '/') return 'text/html';
    switch(mime) {
        case 'html': return 'text/html';
        case 'css': return 'text/css';
        case 'js': return 'text/javascript';
        case 'png': return 'image/png';
        case 'jpg': return 'image/jpeg';
        case 'svg': return 'image/svg+xml';
        default: return 'text/plain';
    }
}
let server = http.createServer().listen(8082, function() {console.log('starting 8082')});

server.on('request', function(req, res) {

    let fileName = req.url;
    let file = __dirname + fileName;
    let mime = getMIME(fileName);
    if(fileName.indexOf('..') != -1) {
        fs.readFile('404.html', function(err, content) {
            res.writeHead(404);
            res.write(content);
            res.end();
        });
    }
    else if(fileName == '/') {
        fs.readFile('i.html', 'utf-8', function(err, content) {
            res.writeHead(200, {'Content-type':'text/html; charset=utf-8'});
            res.write(content);
            res.end();
        });
    }
    else if(fs.existsSync(file)) {
        fs.readFile(file, function(err, content) {
            res.writeHead(200, {'Content-type': mime + '; charset=utf-8'});
            res.write(content);
            res.end();
        });
    }
    else {
        fs.readFile('404.html', function(err, content) {
            res.writeHead(404);
            res.write(content);
            res.end();
        });
    }
});