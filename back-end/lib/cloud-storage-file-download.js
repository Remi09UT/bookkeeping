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

const bucketName = process.env.BUCKET_NAME;

async function downloadFile(cloudPath, localPath) {
  const options = {
    destination: localPath,
  };

  // Downloads the file
  await storage.bucket(bucketName).file(cloudPath).download(options);

  console.log(
    `Downloaded ${localPath}.`
  );
}

module.exports = downloadFile;