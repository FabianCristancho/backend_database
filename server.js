const express = require('express')
const oracledb = require('oracledb');
const bodyParser = require('body-parser')
const cors = require('cors');

const customerRoute = require('./routes/customer.js');
const accountRoute = require('./routes/account.js');
const transactionConnection = require('./routes/transaction.js');

const dbConfig = require('./config/dbconfig');

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//configurar cors
app.use(cors({ origin:true, credentials:true}));

// Routes
app.use('/customer', customerRoute);
app.use('/account', accountRoute);
app.use('/transaction', transactionConnection);

async function run() {

    let connection;
  
    try {
      connection = await oracledb.getConnection(dbConfig);
      console.log('Connection was successful!');
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }


run();





// function connExecute(err, connection){
//     if (err) {
//         console.error(err.message);
//         return;
//     }
//     sql = "select * from tcoin";
//     connection.execute(sql, {}, { outFormat: oracledb.OBJECT }, // or oracledb.ARRAY
//         function(err, result)
//         {
//             if (err) {
//                 console.error(err.message);
//                 connRelease(connection);
//                 return;
//             }
//             console.log(result.metaData);
//             console.log(result.rows);
//             connRelease(connection);
//         });
// }

// connExecute()



app.listen(port, () => console.log(`Example app listening on port ${port}!`))