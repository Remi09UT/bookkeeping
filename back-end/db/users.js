const client = require('../lib/mongodb-atlas-client.js');
const {DuplicateUsernameError, UserDoesNotExistError, UserReceiptArrayUpdateFailureError} = require('../lib/errors');
const { ObjectId } = require('mongodb');

async function registerUserInDB(username, password) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("users");
        const receiptIDs = [];
        const doc = { username, password, receiptIDs };
        const result = await collection.insertOne(doc);
        return result.insertedId.toString();
    } catch (error) {
        console.log(error);
        if (error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.username === username) {
            throw new DuplicateUsernameError(`Username already exist: ${username}`);
        } else {
            throw new Error("Unexpected error in registerUserInDB()!");
        }
    } finally {
        await client.close();
    }
}

async function checkUsernameExistenceInDB(username) { // result format unchecked
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("users");
        const doc = { username: {$eq: username} };
        const result = await collection.countDocuments(doc);
        return result > 0;
    } catch (error) {
        console.log(error);
        throw new Error("Unexpected error in checkUsernameExistenceInDB()!");
    } finally {
        await client.close();
    }
}

async function getUserByUsernameInDB(username) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("users");
        const doc = { username };
        const result = await collection.findOne(doc);
        if (! result) {
            throw new UserDoesNotExistError(`Username does not exist: ${username}`);
        }
        return {userID: result._id.toString(), username: result.username, password: result.password };
    } catch (error) {
        console.log(error);
        if (error.name === 'UserDoesNotExistError') {
            throw error;
        } else {
            throw new Error("Unexpected error in getUserByUsernameInDB()!");
        }
    } finally {
        await client.close();
    }
}

async function addReceiptToUserInDB(userID, receiptID) { // How to ensure receiptID uniqueness in receiptIDs array?
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("users");
        const filter = { _id: new ObjectId(userID) };
        const options = { 
            upsert: false,
            returnDocument: 'after',
            projection: {receiptIDs: 1}
        };
        const updateDoc = {
            $addToSet: { receiptIDs: receiptID } 
        };
        const result = await collection.findOneAndUpdate(filter, updateDoc, options);
        if (! result) {
            throw new UserDoesNotExistError(`userID does not exist: ${userID}.`);
        } else if (! result.value.receiptIDs.includes(receiptID)) {
            throw new UserReceiptArrayUpdateFailureError(`Failed to add receipt ID ${receiptID} to ${userID}.`);
        }
        return result.value.receiptIDs;
    } catch (error) {
        console.log(error);
        if (error.name === 'UserDoesNotExistError') {
            throw error;
        } else if (error.name === 'UserReceiptArrayUpdateFailureError') {
            throw error;
        } else {
            throw new Error("Unexpected error in addUserReceiptInDB()!");
        }
    } finally {
        await client.close();
    }
}

async function removeReceiptFromUserInDB(userID, receiptID) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("users");
        const filter = { _id: new ObjectId(userID) };
        const options = { 
            upsert: false,
            returnDocument: 'after',
            projection: {receiptIDs: 1}
        };
        const updateDoc = {
            $pull: { receiptIDs: receiptID } 
        };
        const result = await collection.findOneAndUpdate(filter, updateDoc, options);
        if (! result) {
            throw new UserDoesNotExistError(`userID does not exist: ${userID}.`);
        } else if (result.value.receiptIDs.includes(receiptID)) {
            throw new UserReceiptArrayUpdateFailureError(`Failed to remove receipt ID ${receiptID} from ${userID}.`);
        }
        return result.value.receiptIDs;
    } catch (error) {
        console.log(error);
        if (error.name === 'UserDoesNotExistError') {
            throw error;
        } else if (error.name === 'UserReceiptArrayUpdateFailureError') {
            throw error;
        } else {
            throw new Error("Unexpected error in removeReceiptFromUserInDB()!");
        }
    } finally {
        await client.close();
    }
}

module.exports = {registerUserInDB, checkUsernameExistenceInDB, getUserByUsernameInDB, addReceiptToUserInDB, removeReceiptFromUserInDB};