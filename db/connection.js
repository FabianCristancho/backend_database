const oracledb = require('oracledb')
const dbConfig = require('../config/dbconfig');


var connection = oracledb.getConnection(dbConfig);




module.exports = connection;

// async function run() {

//     let connection;
  
//     try {
//       // Get a non-pooled connection
//       connection = await oracledb.getConnection(dbConfig);
  
//       console.log('Connection was successful!');

//       sql = "select * from taccount";
//       connection.execute(sql, {}, { outFormat: oracledb.OBJECT }, // or oracledb.ARRAY
//         function(err, result)
//         {
//             if (err) {
//                 console.error(err.message);
                
//                 return;
//             }
//             console.log(result.metaData);
//             console.log(result.rows);
            
//         });
  
//     } catch (err) {
//       console.error(err);
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     }
//   }