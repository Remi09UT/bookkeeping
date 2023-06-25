/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The ID of your GCS file
// const fileName = 'your-file-name';

// The path to which the file should be downloaded
// const destFileName = '/local/path/to/file.txt';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const tempFilePath = process.env.TEMP_FILE_PATH;

const bucketName = process.env.BUCKET_NAME;

async function downloadFile(userID, fileName) {
  const options = {
    destination: tempFilePath+userID+fileName,
  };

  // Downloads the file
  await storage.bucket(bucketName).file(`${userID}/${fileName}`).download(options);

  console.log(
    `Downloaded ${userID+fileName}.`
  );
}

module.exports = downloadFile;