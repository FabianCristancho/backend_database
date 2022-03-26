var express = require('express');
var router = express.Router()
const oracledb = require('oracledb');

const dbConfig = require('../config/dbconfig.js');


router.get('/', async (req, res) => {
    connection = await oracledb.getConnection(dbConfig);
    sql = "select * from tcustomer";
    connection.execute(sql, {}, { outFormat: oracledb.OBJECT }, // or oracledb.ARRAY
        function(err, result)
        {
            if (err) {
                console.error(err.message);
                return;
            }
            res.send(result.rows);
        });
})


module.exports = router;