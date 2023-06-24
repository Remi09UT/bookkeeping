const express = require('express');
const { requireAuth } = require('../lib/auth');
const bodyParser = require('body-parser');
const { userAddReceiptInDB } = require('../db/receipts');
const getV4ReadSignedUrl = require('../lib/generate-v4-read-signed-url');

const bucketName = process.env.BUCKET_NAME;

let jsonBodyParser = bodyParser.json();

let userAddReceiptRoute = async (req, res) => { // Probably add a middleware to process the record metadata.
    const userID = req.user.userID;
    const requestBody = req.body;
    const bucketFileName = requestBody.bucketFileName;
    const fileName = bucketFileName.substring(37);
    const dateAdded = new Date();
    const dateLastModified = dateAdded;
    const imageURL = `https://storage.cloud.google.com/${bucketName}/${userID}/${bucketFileName}`; // Incorrect URL leads to 404 not found!
    const receiptContent = {}; // Call Document AI!
    const doc = {userID, fileName, bucketFileName, imageURL, receiptContent, dateAdded, dateLastModified};
    try {
        const receiptID = await userAddReceiptInDB(doc);
        const clientGetImageURL = await getV4ReadSignedUrl(userID, bucketFileName); // check if necessary, or return to client an image processed by the Document AI
        res.status(201).send({...doc, receiptID, clientGetImageURL, message: "TO BE MODIFIED!"}); // check receiptID repetition in doc
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message});
    }
};

let receiptsRouter = express.Router();

receiptsRouter.route('/')
    .post(requireAuth, jsonBodyParser, userAddReceiptRoute);


module.exports = receiptsRouter;