const mysql = require('mysql');
const config = require('./config.js');

let databaseObject = mysql.createPool({
    host: config.dotenv.DATABASE_HOST,
    user: config.dotenv.DATABASE_USER,
	password: config.dotenv.DATABASE_PASSWORD,
    database : config.dotenv.DATABASE_NAME,
    multipleStatements: true
});

function checkConnection(){

    return new Promise((resolve, reject) => {
        //Promise starts here.
        databaseObject.getConnection((error,connection)=> {
            if (error)
            {
                console.log(`database.js ||| checkConnection() ||| ${error}`);
                return resolve(false);
            }
            
            connection.release();
            return resolve(true);
        });
    })
}

checkConnection()
.then(value => {console.log(`Database connection = ${value}`)});


module.exports = {databaseObject, mysql, checkConnection};