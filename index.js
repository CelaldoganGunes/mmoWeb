console.clear();

const Express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const config = require('./config.js');
let playerList = require('./playerList.js');

let app = Express();
let port = config.dotenv.HTTP_PORT;

http.createServer(app).listen(port, function() {
    console.log(`HTTP Server running on port ${port}`);
});

if (config.dotenv.NODE_ENV == "production")
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
    if (config.dotenv.NODE_ENV == "production" && req.secure == false)
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

app.get('/alphaWorld', function(req, res) {
    res.send(playerList.getPlayerList());
    return;
});

app.get('/alphaWorld/playerCount', function(req, res) {
    let arr = playerList.getPlayerList();
    let playerCount = arr.length;
    let obj = {playerCount};
    res.send(obj);
    return;
});

app.get('/alphaWorld/:playerID', async function(req, res) {
    let playerID = req.params.playerID;

    let playerAllData = await playerList.getPlayerData(playerID);

    if (playerAllData == null)
    {
        return res.send(false);
    }

    let playerData =  JSON.parse(playerAllData.data);
    let inventory = playerData.inventory;
    let food = inventory.food * 25 / 100;
    let gold = inventory.gold * 25 / 100;

    let obj = {
        player_id : playerAllData.player_id,
        username : playerAllData.username,
        food : food,
        gold : gold

    }

    res.send(obj);
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