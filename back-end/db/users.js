const { DuplicateUsernameError, UserDoesNotExistError, UserReceiptArrayUpdateFailureError } = require('../lib/errors');
const {createConnection} = require('../tidb/config.js'); 
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');

async function registerUserInDB(username, password) {
    try {
      const connection = await createConnection();
      const sql = 'INSERT INTO user (_id, username, password) VALUES (?, ?, ?)';
      const result = await new Promise((resolve, reject) => {
        connection.query(sql, [uuidv4(), username, password], function (err, result) {
          if (err) reject(err);
          resolve(result);
        });
      });
    //   await connection.end();
      return result.insertId.toString();
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new DuplicateUsernameError(`Username already exists: ${username}`);
      } else {
        throw new Error('Unexpected error in registerUserInDB()!');
      }
    }
  }
  
  

  async function checkUsernameExistenceInDB(username) {
    try {
      const connection = await createConnection();
      const sql = 'SELECT COUNT(*) AS count FROM user WHERE username = ?';
      const result = await new Promise((resolve, reject) => {
        connection.query(sql, [username], function (err, result) {
          if (err) reject(err);
          resolve(result);
        });
      });
    //   await connection.end();
      return result[0].count > 0;
    } catch (error) {
      console.log(error);
      throw new Error("Unexpected error in checkUsernameExistenceInDB()!");
    }
  }
  

  async function getUserByUsernameInDB(un) {
    try {
      const connection = await createConnection();
      const sql = 'SELECT * FROM user WHERE username = ?';
      const result = await new Promise((resolve, reject) => {
        connection.query(sql, [un], function (err, result) {
          if (err) reject(err);
          resolve(result);
        });
      });
    //   await connection.end();
      if (result.length === 0) {
        throw new UserDoesNotExistError(`Username does not exist: ${un}`);
      }
      const { _id, userName, password } = result[0];
      return { userID: _id, username: userName, password };
    } catch (error) {
      console.log(error);
      if (error instanceof UserDoesNotExistError) {
        throw error;
      } else {
        throw new Error("Unexpected error in getUserByUsernameInDB()!");
      }
    }
  }
  
// todo: add receipt to user  

//   async function addReceiptToUserInDB(userID, receiptID) {
//     try {
//       const connection = await createConnection();
      
//       // Insert the mapping of userID and receiptID into the receipt table
//       const insertQuery = 'UPDATE receipt SET userID = ? WHERE _id = ?';
//       const insertResult = await new Promise((resolve, reject) => {
//         connection.query(insertQuery, [userID, receiptID], function (err, result) {
//           if (err) reject(err);
//           resolve(result);
//         });
//       });
      
//       if (insertResult.affectedRows !== 1) {
//         throw new UserReceiptArrayUpdateFailureError(`Failed to add receipt ID ${receiptID} to user ${userID}.`);
//       }
      
//       // Retrieve the updated user information along with the associated receipt
//       const selectQuery = `
//         SELECT u.*, r.*
//         FROM user u
//         JOIN receipt r ON u._id = r.userID
//         WHERE u._id = ? AND r._id = ?
//       `;
//       const selectResult = await new Promise((resolve, reject) => {
//         connection.query(selectQuery, [userID, receiptID], function (err, result) {
//           if (err) reject(err);
//           resolve(result);
//         });
//       });
      
//       await connection.end();
      
//       if (selectResult.length === 0) {
//         throw new UserReceiptArrayUpdateFailureError(`Failed to retrieve user and receipt information after adding receipt ID ${receiptID} to user ${userID}.`);
//       }
      
//       // Extract the relevant data from the result
//       const user = {
//         userID: selectResult[0]._id,
//         username: selectResult[0].userName,
//         password: selectResult[0].password
//         // Include other user fields as needed
//       };
//       const receipt = {
//         receiptID: selectResult[0]._id,
//         // Include other receipt fields as needed
//       };
      
//       return { user, receipt };
//     } catch (error) {
//       console.log(error);
//       if (error instanceof UserReceiptArrayUpdateFailureError) {
//         throw error;
//       } else {
//         throw new Error("Unexpected error in addReceiptToUserInDB()!");
//       }
//     }
//   }
  
  
  

// async function removeReceiptFromUserInDB(userID, receiptID) {
//   try {
//     const connection = await client.createConnection();
//     const result = await connection.execute(
//       `UPDATE user SET receiptIDs = JSON_REMOVE(receiptIDs, JSON_UNQUOTE(JSON_SEARCH(receiptIDs, 'one', ?))) WHERE _id = ?`,
//       [receiptID, userID]
//     );
//     await connection.end();
//     if (result.affectedRows !== 1) {
//       throw new UserReceiptArrayUpdateFailureError(`Failed to remove receipt ID ${receiptID} from user ${userID}.`);
//     }
//     return result.insertId.toString();
//   } catch (error) {
//     console.log(error);
//     if (error instanceof UserReceiptArrayUpdateFailureError) {
//       throw error;
//     } else {
//       throw new Error("Unexpected error in removeReceiptFromUserInDB()!");
//     }
//   }
// }

module.exports = {
  registerUserInDB,
  checkUsernameExistenceInDB,
  getUserByUsernameInDB,
//   addReceiptToUserInDB,
//   removeReceiptFromUserInDB
};


// async function exampleUsage() {
//     try {
//       // Call the functions
//       await registerUserInDB('johnhhh', 'password123');
//       console.log("Registered user!");
//       await getUserByUsernameInDB('johnhhh');
//     } catch (error) {
//       console.log(error);
//       // Handle the error
//       // ...
//     }
//   }
  
//   exampleUsage();