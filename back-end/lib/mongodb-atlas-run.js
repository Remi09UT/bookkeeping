const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_DB_ATLAS_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    const myDB = client.db("admin");
    // const myColl = myDB.collection("books");
    await myDB.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}

module.exports = run;
