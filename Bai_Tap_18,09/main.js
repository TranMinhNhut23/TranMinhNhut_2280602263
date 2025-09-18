let http = require('http');
let fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url.includes('home')) {
        let data = fs.readFileSync("./home.html");
        console.log(data);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    } else {
        let data = fs.readFileSync("./home.html");
        console.log(data);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    }
});

// starts a simple http server locally on port 3000
server.listen(5500, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:5500');
});

// run with `node server.mjs`
