const express = require('express');
const getV4UploadSignedUrl = require('../lib/generate-v4-upload-signed-url');
const generateBucketFileName = require('../lib/generate-bucket-file-name');
const { requireAuth } = require('../lib/auth');
// const bodyParser = require('body-parser');

// let jsonBodyParser = bodyParser.json();

/**
 * Get GCP Cloud Storage upload URL route
 * requires {auth user object, filename}
 * returns {URL}
 */
let getCloudStorageUploadURLRoute = async (req, res) => {
    const userID = req.user.userID;
    const bucketfileName = generateBucketFileName(req.params.filename);
    let url;
    try {
        url = await getV4UploadSignedUrl(userID, bucketfileName);
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message});
    }
    res.status(201).send({url});
};

let uploadsRouter = express.Router();

uploadsRouter.route('/static/:filename')
    .get(requireAuth, getCloudStorageUploadURLRoute);

module.exports = uploadsRouter;