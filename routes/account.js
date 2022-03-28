var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');

const dbConfig = require('../config/dbconfig.js');


router.get('/', async (req, res) => {
    connection = await oracledb.getConnection(dbConfig);
    sql = "select * from taccount";
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

router.post('/', async (req, res) => {
    account = {
        accountType: req.body.accountType,
        coin: req.body.coin,
        customerId: req.body.customerId,
        mode_of_use: req.body.mode_of_use
    }

    console.log(account);

    connection = await oracledb.getConnection(dbConfig);

    const sql = 'SELECT id FROM TACCOUNT';

    connection.execute(sql, {}, { outFormat: oracledb.OBJECT }, // or oracledb.ARRAY
    (err, result) =>
    {
        if (err) {
            console.error(err.message);
            return;
        }

        let arrayIndex = result.rows.map(acc => acc.ID);
        arrayIndex = arrayIndex.map(id => parseInt(id.substring(5,8)));
        arrayIndex.sort();
        let lastIndex=(arrayIndex.length==0)?1:arrayIndex[arrayIndex.length - 1] + 1;

        const block = 
        `
        BEGIN
            pr_create_account('${lastIndex}','${account.customerId}','${account.accountType}','${(account.coin)=="USD"? '01': '02'}',0,'${account.mode_of_use}','005');
            COMMIT;
        END;
        `
        console.log(block);
        connection.execute(block, 
            function(err, result)
            {
                if (err) {
                    console.error(err.message);
                    return;
                }

                res.json({
                    ok: true,
                    message: 'La cuenta se ha agregado con éxito'
                })
            })
    })
})

router.post('/transfer', async (req, res) => {
    transfer = {
        account_number: req.body.account_number,
        amount: req.body.amount,
        origin_account: req.body.origin_account
    }

    connection = await oracledb.getConnection(dbConfig);

    const block = 
    `
        declare 
        v_account account;
        begin 
            SELECT VALUE(e) INTO v_account FROM TACCOUNT e WHERE e.id = '${transfer.origin_account}';
            DBMS_OUTPUT.put_line(v_account.id);
            v_account.transfer_money(${transfer.amount},'${transfer.account_number}');
        COMMIT;
        end;
    `
    console.log(block);
    connection.execute(block,
    function(err, result) {
        if(err){
            console.log(err);
            res.json({
                ok: false,
                message: 'No se pudo hacer la transferencia!'
            })
            return;
        }

        res.json({
            ok: true,
            message: 'Se ha realizado la transferencia con éxito!'
        })
    })
})


module.exports = router;