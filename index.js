const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded());
app.use(express.json());
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '224Ardmore',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);












app.listen(PORT, () => { console.log(`Working on ${PORT}`); });