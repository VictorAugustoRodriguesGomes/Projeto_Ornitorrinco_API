import mysql, { PoolOptions } from "mysql2/promise";


const access: PoolOptions = {
    host: process.env.MySQL_HOST,
    user: process.env.MySQL_USER,
    password: process.env.MySQL_PASSWORD,
    database: process.env.MySQL_DB
};


const connection = mysql.createPool(access);


export default connection;