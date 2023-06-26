const { ReceiptDoesNotExistError } = require('../lib/errors.js');
const client = require('../lib/mongodb-atlas-client.js');
const { ObjectId } = require('mongodb');

async function addReceiptInDB(doc) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("receipts");
        const result = await collection.insertOne(doc);
        return result.insertedId.toString();
    } finally {
        await client.close();
    }
};

async function getReceiptInDB(receiptID) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("receipts");
        const query = {_id: new ObjectId(receiptID)};
        const result = await collection.findOne(query);
        if (! result) {
            throw new ReceiptDoesNotExistError(`No receipt found for receiptID ${receiptID}!`);
        }
        return result;
    } finally {
        await client.close();
    }
};

async function removeReceiptInDB(receiptID) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("receipts");
        const query = {_id: new ObjectId(receiptID)}
        const result = await collection.deleteOne(query);
        if (result.deletedCount !== 1) {
            throw new ReceiptDoesNotExistError(`No deletion occured for deleting ${receiptID}!`);
        }
    } finally {
        await client.close();
    }
};

module.exports = {addReceiptInDB, getReceiptInDB, removeReceiptInDB};