const { ReceiptDoesNotExistError } = require('../lib/errors.js');
const client = require('../tidb/config.js'); // Replace with your TiDB client module
const { v4: uuidv4 } = require('uuid');

async function addReceiptInDB(doc) {
    try {
        const connection = await client.createConnection();
        const result = await connection.execute(`
      INSERT INTO receipt (
        _id, userID, contentType, fileName, bucketFileName, imageURL, dateAdded, dateLastModified, analyzedResults
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
            [
                uuidv4(), doc.userID, doc.contentType, doc.fileName, doc.bucketFileName,
                doc.imageURL, doc.dateAdded, doc.dateLastModified, JSON.stringify(doc.analyzedResults)
            ]
        );
        // await connection.end();
        return result.insertId;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getReceiptInDB(receiptID) {
    try {
        const connection = await client.createConnection();
        const sql = 'SELECT * FROM receipt WHERE _id = ?';
        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [receiptID], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
        // await connection.end();

        if (result.length === 0) {
            throw new ReceiptDoesNotExistError(`No receipt found for receiptID ${receiptID}!`);
        }

        const receipt = result[0];
        //   console.log(receipt);
        // Handle the receipt data as needed
        return receipt;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function removeReceiptInDB(receiptID) {
    try {
        const connection = await client.createConnection();
        const sql = 'DELETE FROM receipt WHERE _id = ?';
        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [receiptID], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
        // await connection.end();

        if (result.affectedRows !== 1) {
            throw new ReceiptDoesNotExistError(`No deletion occurred for deleting ${receiptID}!`);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getReceiptsByUserIdInDB(userID) {
    try {
        const connection = await client.createConnection();

        const getReceiptsQuery = `
        SELECT r.*
        FROM receipt r
        JOIN user ur ON r.userID = ur._id
        WHERE ur._id = ?
      `;
        const getReceiptsParams = [userID];
        const receiptsResult = await new Promise((resolve, reject) => {
            connection.query(getReceiptsQuery, getReceiptsParams, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });

        // await connection.end();

        return receiptsResult;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function getReceiptByUserIDAndBucketFileNameInDB(userID, bucketFileName) {
    try {
        const connection = await client.createConnection();

        const query = 'SELECT * FROM receipt WHERE userID = ? AND bucketFileName = ?';
        const params = [userID, bucketFileName];

        const result = await new Promise((resolve, reject) => {
            connection.query(query, params, function (err, rows) {
                if (err) reject(err);
                resolve(rows);
            });
        });

        // await connection.end();

        if (result.length === 0) {
            throw new ReceiptDoesNotExistError(`No receipt found for userID ${userID} and bucketFileName ${bucketFileName}!`);
        }

        return result[0]
      
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function updateReceiptInDB(receiptID, updatedFieldsDoc) {
    try {
      const connection = await client.createConnection();
  
      const query = 'UPDATE receipt SET dateLastModified = ?, analyzedResults = ? WHERE _id = ?';
      const params = [
        updatedFieldsDoc.dateLastModified,
        JSON.stringify(updatedFieldsDoc.analyzedResults),
        receiptID
      ];
  
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, function (err, rows) {
          if (err) reject(err);
          resolve(rows);
        });
      });
  
    //   await connection.end();
  
      if (result.affectedRows !== 1) {
        throw new ReceiptDoesNotExistError(`No receipt found for receiptID ${receiptID}!`);
      }
  
      return {
        ...updatedFieldsDoc,
        _id: receiptID,
        analyzedResults: updatedFieldsDoc.analyzedResults,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  

module.exports = {
    addReceiptInDB,
    getReceiptInDB,
    removeReceiptInDB,
    getReceiptsByUserIdInDB,
    getReceiptByUserIDAndBucketFileNameInDB,
    updateReceiptInDB,
};



