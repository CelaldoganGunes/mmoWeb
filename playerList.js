const config = require('./config.js');
const DatabaseModule = require('./database.js');

let playerList = [];
let playerListLastUpdated = new Date();

function updatePlayerList()
{
    let sqlUpdatePlayerList = `SELECT player_id, username FROM player_data`; 
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
        setTimeout(updatePlayerList, 10 * 1000);
    });
}

updatePlayerList();

function getPlayerData(playerID)
{
    return new Promise((resolve, reject) => 
    {
        let sqlLoadPlayerData = `SELECT player_id, username, data FROM player_data WHERE player_id = ? LIMIT 1`;
        let variableArray = [playerID];

        DatabaseModule.databaseObject.query(sqlLoadPlayerData, variableArray, async function (err, rows, fields) 
        {

            if (err) {
                console.log(`Error | playerList.js getPlayerData() | ID = ${playerID} | Error = ${err}`);
                return resolve(false);
            }
            if (rows.length == 0)
            {
                return resolve(null); 
            }
            else
            {
                return resolve(rows[0]);
            }
        });
    })
}

function getPlayerList()
{
    return playerList;
}


module.exports = {getPlayerList, getPlayerData};