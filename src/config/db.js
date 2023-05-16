const mysql = require('mysql');
const config = require('./config.json');

//UTILIZA LOS PARAMETROS QUE TU LE PASES POR CONSOLA O LOS DEL JSON
const db_connection = mysql.createConnection({
    host: process.env.DB_HOST || config.host,
    user: process.env.DB_USER || config.user,
    password: process.env.DB_PASSWORD || config.password,
    database: process.env.DB_DATABASE || config.database
})

db_connection.connect((err) => {
    if (err) {
        console.error('[db-err]', err.message);
        if(err.code === 'ETIMEDOUT') {
            console.log('Can´t connect do DataBase...');
        }
        process.exit(1);
    }
    console.log("DATABASE CONNECTED");
})

//utilizamos el callback de  .query y lo convertimos en una promesa
const query = (queryString, params) => {
    return new Promise((resolve, reject) => {
        db_connection.query(queryString, params, (err, result, fields) => {
            if(err){
                reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = { query };