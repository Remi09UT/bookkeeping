var mysql = require('mysql2');

var connection = mysql.createConnection({
  host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3tct5ZhdBXiMUDP.root',
  password: 'FaZ24NgO4jZfQnWu',
  database: 'recipt',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

function createConnection() {
    return new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(connection);
        console.log("connected to tidb");
      });
    });
  }

// function createConnection() {
//     const connection = mysql.createConnection({
//       host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
//       port: 4000,
//       user: '3tct5ZhdBXiMUDP.root',
//       password: 'FaZ24NgO4jZfQnWu',
//       database: 'recipt',
//       ssl: {
//         minVersion: 'TLSv1.2',
//         rejectUnauthorized: true
//       }
//     });
  
//     return connection.promise();
//   }
  
  
  module.exports = {
    createConnection,
  };