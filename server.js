// Multi Modules fs will return appropriate file response, url will prase the type of URL
const http = require('http'),
    fs = require('fs'),
    url = require('url');

// Module is being used to create a new server
http.createServer((request, response) => {
    let addr = request.url,
        q = new URL(addr, 'http://localhost:8080'),
        //  This will be where you store the path of the file
        filePath = ''; 

    // Whenever a request is made to the server, adds the visited URL, as well as the timestamp to log.txt
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });

    // Checks what the exact pathname of the entered URL is, if it doesn't include “documentation”, statement returns “index.html”
    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    // Grabs the appropriate file from the server, if not throw error
    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();

    });

}).listen(8080);
console.log('My test server is running on Port 8080.');