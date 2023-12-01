console.clear();

const Express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const config = require('./config.js');

let app = Express();
let port = config.dotenv.HTTP_PORT;

http.createServer(app).listen(port, function() {
    console.log(`HTTP Server running on port ${port}`);
});


if (config.dotenv.NODE_ENV == "production")
{
    let sslPort = config.dotenv.HTTPS_PORT;
    const optionSSL = {
        key: fs.readFileSync('./ssl/privkeyCF.pem'),
        cert: fs.readFileSync('./ssl/fullchainCF.pem'),
    };
    
    https.createServer(optionSSL, app).listen(sslPort, function() {
        console.log(`HTTPS Server running on port ${sslPort}`);
    });
}

/*
//Enable this for SSL when SSL is not from CloudFlare
app.all("*", function(req, res, next) {
    if (config.dotenv.NODE_ENV == "production" && req.secure == false)
    {
        res.redirect("https://" + req.headers.host + req.path);
        return;
    }
    next();
});*/

app.get('/test', function(req, res) {
    res.send("Test");
    return;
});

app.get('/discord', function(req, res) {
    res.redirect("https://discord.gg/pBewnuaV4U");
    return;
});

app.get('/steam', function(req, res) {

    let utm_source = req.query.utm_source;

    if (utm_source == undefined)
    {
        utm_source = "website";
    }

    res.redirect("https://store.steampowered.com/app/2113200?utm_source="  + utm_source);
    //res.redirect("https://store.steampowered.com/app/2113200?utm_source=website");
    return;
});

/*
app.all('/', function(req, res) {
    res.redirect("https://celal1387.itch.io/1387mmo");
    return;
});*/

app.use('/', Express.static(path.join(__dirname, '/client')));

app.all('*', function(req, res) {
    res.redirect('/');
    return;
});

// FUNCTIONS

const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

const memoryData = process.memoryUsage();

const memoryUsage = {
  rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
  heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
  heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
  external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
};

setInterval(() => {
    console.log(new Date().toISOString());
    console.log(memoryUsage);
}, 5 * 1000);