const mysql = require('mysql2/promise');

const mySqlPool = mysql.createPool({
    host: 'localhost',  
    user: 'root',   
    password: 'sai@2002',
    database: 'db_benefits'
});

module.exports = mySqlPool;