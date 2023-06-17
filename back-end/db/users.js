const client = require('../lib/mongodb-atlas-client.js')

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
        return "";
    } finally {
        await client.close();
    }
}

module.exports = registerUserInDB;