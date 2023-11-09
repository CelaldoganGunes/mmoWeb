const config = require('./config.js');
const DatabaseModule = require('./database.js');

let playerList = [];
let playerListLastUpdated = new Date();

function updatePlayerList()
{
    let sqlUpdatePlayerList = `SELECT player_id, username, battle_prize FROM player_data`; 
    let variableArray = [];

    DatabaseModule.databaseObject.query(sqlUpdatePlayerList, variableArray, async function (err, rows, fields) 
    {
        if (err) {
            console.log(`Error | playerList.js updatePlayerList() | Error = ${err}`);    
            return false;
        }

        playerListLastUpdated = new Date();
        playerList = rows;
        
        console.log(`Updated Player List Cache on ${playerListLastUpdated.toISOString()}`);
        console.log(`Player Count = ${playerList.length}`);
    });

    setInterval(updatePlayerList, 30 * 1000);
}

updatePlayerList();

function getPlayerList()
{
    return playerList;
}


module.exports = {getPlayerList};