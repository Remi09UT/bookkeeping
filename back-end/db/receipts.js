const client = require('../lib/mongodb-atlas-client.js');

async function userAddReceiptInDB(doc) {
    try {
        await client.connect();
        const database = client.db("bookkeeping");
        const collection = database.collection("receipts");
        const result = await collection.insertOne(doc);
        return result.insertedId;
    } catch (error) {
        console.log(error);
        // throw new Error("Unexpected error in userAddReceiptInDB()!");
    } finally {
        await client.close();
    }
};

module.exports = {userAddReceiptInDB};