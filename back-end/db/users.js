const client = require('../lib/mongodb-atlas-client.js')
const {DuplicateUsernameError, UserDoesNotExistError} = require('../lib/errors');

async function registerUserInDB(username, password) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("users");
        const doc = { username, password };
        const result = await collection.insertOne(doc);
        return result.insertedId;
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

async function checkUsernameExistenceInDB(username) {
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

module.exports = {registerUserInDB, checkUsernameExistenceInDB, getUserByUsernameInDB};