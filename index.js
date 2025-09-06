console.clear();

const Express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const config = require('./config.js');

let app = Express();
let port = config.dotenv.HTTP_PORT;

app.set('trust proxy', true);

http.createServer(app).listen(port, function() {
    console.log(`HTTP Server running on port ${port}`);
});

app.all("*", function(req, res, next) {
    console.log(__dirname);
    logRequest(req);
    next()
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

const memoryUsage = `rss: ${formatMemoryUsage(memoryData.rss)} | heapTotal: ${formatMemoryUsage(memoryData.heapTotal)} | heapUsed: ${formatMemoryUsage(memoryData.heapUsed)} | external V8: ${formatMemoryUsage(memoryData.external)}`

setInterval(() => {
    console.log("");
    console.log(new Date().toISOString());
    console.log(memoryUsage);
    console.log("");
}, 5 * 1000);

function logRequest(req)
{
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(req.headers['x-forwarded-for'])
    console.log(req.socket.remoteAddress)
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
    
    console.log(`${ip} - ${fullUrl} - ${req.method}`);
}