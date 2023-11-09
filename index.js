console.clear();

const Express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const config = require('./config.js');

let app = Express();
let port = config.dotenv.HTTP_PORT;

http.createServer(app).listen(port, function() {
    console.log(`HTTP Server running on port ${port}`);
});

if (process.env.NODE_ENV == "production")
{
    let sslPort = config.dotenv.HTTPS_PORT;
    const optionSSL = {
        key: fs.readFileSync('./ssl/privkey.pem'),
        cert: fs.readFileSync('./ssl/fullchain.pem'),
    };
    
    https.createServer(optionSSL, app).listen(sslPort, function() {
        console.log(`HTTPS Server running on port ${sslPort}`);
    });
}

app.all("*", function(req, res, next) {
    if (req.secure == false)
    {
        res.redirect("https://" + req.headers.host + req.path);
        return;
    }
    next();
});

app.get('/test', function(req, res) {
    res.send("Test");
    return;
});

app.get('/discord', function(req, res) {
    res.redirect("https://discord.gg/pBewnuaV4U");
    return;
});

app.get('/steam', function(req, res) {
    res.redirect("https://store.steampowered.com/app/2113200/");
    return;
});

app.all('/', function(req, res) {
    res.redirect("https://celal1387.itch.io/1387mmo");
    return;
});

app.all('*', function(req, res) {
    res.redirect('/');
    return;
});