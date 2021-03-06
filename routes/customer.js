var express = require('express');
var router = express.Router()
const oracledb = require('oracledb');

const dbConfig = require('../config/dbconfig.js');
const connection = require('../db/connection.js');


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
});

router.post('/', async (req, res) => {
    customer = {
        address: req.body.address,
        description: req.body.description,
        documentType: req.body.documentType,
        firstName: req.body.firstName,
        houseNumber: req.body.houseNumber,
        id: req.body.id,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        neighboorhood: req.body.neighboorhood
    }

    console.log(customer);

    let idAddress = new Date().getMilliseconds();

    
    const block = 
    `
    BEGIN
        INSERT INTO TADDRESS VALUES(ADDRESS(${idAddress},'${customer.address}','${customer.houseNumber}','${customer.neighboorhood}','${customer.description}'));
        INSERT INTO TPERSON VALUES(PERSON('${customer.firstName}' ,'${customer.lastName}','${customer.documentType}','${customer.id}'));
        pr_create_customer('${customer.id}',${idAddress},'${customer.nationality}');
        COMMIT;
    END;
    `;

    console.log(block);

    connection = await oracledb.getConnection(dbConfig);
    connection.execute(block, function(err, result)
        {
            if (err) {
                console.error(err);
                res.json({
                    ok: false,
                    message: 'No fue posible registrar al cliente!'
                })
                return;
            }
            res.json({
                ok: true,
                message: 'El cliente se ha registrado con ??xito!'
            })
            console.log('El cliente se registr?? con ??xito!');
        })
    
});

router.post('/associated', async (req, res) => {
    associated = {
        accountNumber: req.body.accountNumber,
        documentType: req.body.documentType,
        firstName: req.body.firstName,
        id: req.body.id,
        lastName: req.body.lastName,
        idCustomer: req.body.idCustomer
    }

    connection = await oracledb.getConnection(dbConfig);

    const sql =
    `
        SELECT id FROM TPERSON WHERE id = ${associated.id}
    `

    let insertQuery = '';

    await connection.execute(sql, function(err, result){
        if(err){
            console.error(err);
                res.json({
                    ok: false,
                    message: 'No fue posible registrar al asociado!'
            })
            return;
        }

        if(result.rows.length == 0){
            insertQuery = `INSERT INTO TPERSON VALUES(PERSON('${associated.firstName}' ,'${associated.lastName}','${associated.documentType}','${associated.id}'));`;
        }
    })

    console.log(insertQuery);

    const block = 
    `
    BEGIN
        ${insertQuery}
        pr_create_associated('${associated.id}','${associated.idCustomer}','${associated.accountNumber}');
    COMMIT;
    END ;
    `
    console.log(block);
    
    await connection.execute(block, function(err, result)
        {
            if (err) {
                console.error(err);
                res.json({
                    ok: false,
                    message: 'No fue posible registrar al asociado!'
                })
                return;
            }
            res.json({
                ok: true,
                message: 'El asociado se ha registrado con ??xito!'
            })
            console.log('El asociado se registr?? con ??xito!');
        })
})


module.exports = router;