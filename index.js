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
app.use('/damla', Express.static(path.join(__dirname, '/damla')));
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

function getClientIp(req) {
  // 1) Cloudflare (tüm planlarda) – tek ve güvenilir header
  const cf = req.headers['cf-connecting-ip'];
  if (cf) return normalizeIp(cf);

  // 2) Enterprise varsa True-Client-IP gelebilir
  const trueClient = req.headers['true-client-ip'];
  if (trueClient) return normalizeIp(trueClient);

  // 3) Standart proxy zinciri
  const xff = req.headers['x-forwarded-for'];
  if (xff) return normalizeIp(xff.split(',')[0].trim());

  // 4) Express / Node socket
  if (req.ip) return normalizeIp(req.ip);
  return normalizeIp(req.socket?.remoteAddress);
}

function normalizeIp(ip) {
  // IPv6 ve IPv4-mapped IPv6'ları sadeleştir
  if (ip.startsWith('::ffff:')) return ip.substring(7);
  if (ip === '::1') return '127.0.0.1';
  return ip;
}

function logRequest(req) {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const ip = getClientIp(req);
  console.log(`${ip} - ${fullUrl} - ${req.method}`);
}