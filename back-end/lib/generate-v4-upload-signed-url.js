/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = process.env.BUCKET_NAME;

// The full path of your file inside the GCS bucket, e.g. 'yourFile.jpg' or 'folder1/folder2/yourFile.jpg'
// const fileName = 'your-file-name';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

const { V4SignedURLUnavailableError } = require('../lib/errors');


// Creates a client
const storage = new Storage();

async function generateV4UploadSignedUrl(filePath, contentType = 'application/octet-stream') {
  // These options will allow temporary uploading of the file with outgoing
  // Content-Type: application/octet-stream header.
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: contentType,
  };

  // Get a v4 signed URL for uploading file
  const [url] = await storage
    .bucket(bucketName)
    .file(filePath)
    .getSignedUrl(options);

  return url;
}

async function getV4UploadSignedUrl(userID, fileName, contentType = 'application/octet-stream') {
    const filePath = `${userID}/${fileName}`;
    let url = '';
    try {
        url = await generateV4UploadSignedUrl(filePath, contentType);
    } catch (error) {
        console.log(error);
        throw new V4SignedURLUnavailableError(error.message || "Failed to get V4 upload signed URL (1)!");
    }
    if (! url) {
        throw new V4SignedURLUnavailableError("Failed to get V4 upload signed URL (2)!");
    }
    return url;
};

module.exports = getV4UploadSignedUrl;