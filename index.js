console.clear();

const Express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

let app = Express();
let port = 443;

if (fs.existsSync('./ssl/privkey.pem'))
{
    
    const httpServer = http.createServer(app);

    httpServer.listen(80, () => {
        console.log('HTTP Server running on port 80');
    });

    const httpsServer = https.createServer({
        key: fs.readFileSync('./ssl/privkey.pem'),
        cert: fs.readFileSync('./ssl/fullchain.pem'),
    }, app);
    
    httpsServer.listen(port, () => {
        console.log(`HTTPS Server running on port ${port}`);
    });
}
else
{
    let apiServer = app.listen(port, function() {
        console.log(`Web Server is listening on port ${port}`)
    });
}

app.all('/discord', async function(req, res) {
    res.redirect("https://discord.gg/pBewnuaV4U");
    return;
});

app.all('/', async function(req, res) {
    res.redirect("https://celal1387.itch.io/1387mmo");
    return;
});

app.all('*', function(req, res) {
    res.redirect("http://1387mmo.net/");
});