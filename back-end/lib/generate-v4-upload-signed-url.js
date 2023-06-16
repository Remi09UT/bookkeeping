/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = 'bookkeeping_bucket_0';

// The full path of your file inside the GCS bucket, e.g. 'yourFile.jpg' or 'folder1/folder2/yourFile.jpg'
// const fileName = 'your-file-name';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

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
    }
    return url;
};

module.exports = getV4UploadSignedUrl;