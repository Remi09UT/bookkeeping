/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The ID of your GCS file
// const fileName = 'your-file-name';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const bucketName = process.env.BUCKET_NAME;

// Optional:
// Set a generation-match precondition to avoid potential race conditions
// and data corruptions. The request to delete is aborted if the object's
// generation number does not match your precondition. For a destination
// object that does not yet exist, set the ifGenerationMatch precondition to 0
// If the destination object already exists in your bucket, set instead a
// generation-match precondition using its generation number.
// const deleteOptions = {
//   ifGenerationMatch: generationMatchPrecondition,
// };

async function deleteFile(userID, fileName) {
  await storage.bucket(bucketName).file(`${userID}/${fileName}`).delete();

//   console.log(`gs://${bucketName}/${fileName} deleted`);
}

module.exports = deleteFile;
