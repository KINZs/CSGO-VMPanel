/* Vip-Management-System-By-SUMMER_SOLDIER
*
* Copyright (C) 2020 SUMMER SOLDIER
*
* This file is part of Vip-Management-System-By-SUMMER_SOLDIER
*
* Vip-Management-System-By-SUMMER_SOLDIER is free software: you can redistribute it and/or modify it
* under the terms of the GNU General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option)
* any later version.
*
* Vip-Management-System-By-SUMMER_SOLDIER is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with
* Vip-Management-System-By-SUMMER_SOLDIER. If not, see http://www.gnu.org/licenses/.
*/

'use strict';

const mysql = require('mysql');
const config = require('../config/config.json')
const dbConfig = config.db;

var pool;
const sqlOptions = {
    connectionLimit: 20, //important
    host: dbConfig.db_host,
    user: dbConfig.db_user,
    password: dbConfig.db_password,
    database: dbConfig.db_name,
    port: dbConfig.db_port,
    multipleStatements: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    // debug: true
}

try {
    pool = mysql.createPool(sqlOptions);
} catch (error) {
    console.log("Connection Pool Error : ", error);
}

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }

    if (connection) {
        console.log("MYSQL connection Stablished")
        connection.release();
    }

    return;
});

module.exports = pool;