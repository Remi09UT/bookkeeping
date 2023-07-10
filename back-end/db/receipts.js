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

async function getReceiptsInDB(userID) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collectionReceipts = database.collection("receipts");
        const collectionUsers = database.collection("users");
        const getUserReceiptsQuery = { _id: new ObjectId(userID) };
        const getUserReceiptsProjection = { projection: { receiptIDs: 1 }};
        let {receiptIDs} = await collectionUsers.findOne(getUserReceiptsQuery, getUserReceiptsProjection);
        receiptIDs = receiptIDs.map((receiptID) => {
            return new ObjectId(receiptID);
        });
        const query = { _id : { $in : receiptIDs }, userID: userID };
        const result = await collectionReceipts.find(query).sort({"analyzedResults.invoice_date": -1, "dateAdded": -1}).toArray();
        return result;
    } finally {
        await client.close();
    }
};

async function getReceiptByUserIDAndBucketFileNameInDB(userID, bucketFileName) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("receipts");
        const query = {userID: userID, bucketFileName: bucketFileName};
        const result = await collection.findOne(query);
        if (! result) {
            throw new ReceiptDoesNotExistError(`No receipt found for userID ${userID} and bucketFileName ${bucketFileName}!`);
        }
        return result;
    } finally {
        await client.close();
    }
};

async function updateReceiptInDB(receiptID, updatedFieldsDoc) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("receipts");
        const filter = { _id: new ObjectId(receiptID) };
        const options = { 
            upsert: false,
            returnDocument: 'after'
        };
        const updateDoc = {
            $set: updatedFieldsDoc
        };
        const result = await collection.findOneAndUpdate(filter, updateDoc, options);
        if (! result) {
            throw new ReceiptDoesNotExistError(`No receipt found for receiptID ${receiptID}!`);
        }
        return result.value;
    } finally {
        await client.close();
    }
};

module.exports = {addReceiptInDB, getReceiptInDB, removeReceiptInDB, getReceiptsInDB, getReceiptByUserIDAndBucketFileNameInDB, updateReceiptInDB};