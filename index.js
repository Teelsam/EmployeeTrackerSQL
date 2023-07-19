const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.urlencoded());
app.use(express.json());
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '224Ardmore',
        database: 'buisness_db'
    },
    console.log(`Connected to the buisness_db database.`)
);

db.query('SELECT * FROM department', function (err, res) {
    console.log(res);
});

app.listen(PORT, () => { console.log(`Working on ${PORT}`); });