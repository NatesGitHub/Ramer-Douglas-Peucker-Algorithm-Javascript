const express = require('express');
const bodyParser = require('body-parser');
const mariaDB = require('mariadb/promise');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listen on port ${port}`));

// MariaDB Code
const pool = mariaDB.createPool({
    host: '*********************************************************************',
    user: '*********************************************************************',
    password: '*****************************************************************',
    database: '*****************************************************************',
    connectionLimit: 5
});

app.get('', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    pool.getConnection()
        .then((conn) => {
            conn.query('SELECT *********************************************************************')
                .then((rows) => {
                    var json = JSON.parse(JSON.stringify(rows));
                    res.send(json);
                })
                .then((res) => {
                    conn.end();
                })
                .catch((err) => {
                    console.log(err); 
                    conn.end();
                });

    }).catch((err) => {
        console.log(err);
    });
});