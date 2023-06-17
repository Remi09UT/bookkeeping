const express = require('express');
const getV4UploadSignedUrl = require('../lib/generate-v4-upload-signed-url');
const generateBucketFileName = require('../lib/generate-bucket-file-name');
// const bodyParser = require('body-parser');

// let jsonBodyParser = bodyParser.json();

let getCloudStorageUploadURLRoute = async (req, res) => {
    const userID = 'wuwenglei';
    const bucketfileName = generateBucketFileName(req.params.filename);
    const url = await getV4UploadSignedUrl(userID, bucketfileName);
    if (! url) {res.sendStatus(400)};
    res.status(200);
    res.send({url});
};

let uploadsRouter = express.Router();

uploadsRouter.route('/static/:filename')
    .get(getCloudStorageUploadURLRoute);

module.exports = uploadsRouter;