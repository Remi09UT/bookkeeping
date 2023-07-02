const express = require('express');
const { requireAuth } = require('../lib/auth');
const bodyParser = require('body-parser');
const { addReceiptInDB, getReceiptInDB, removeReceiptInDB } = require('../db/receipts');
const getV4ReadSignedUrl = require('../lib/generate-v4-read-signed-url');
const analyzeFileByDocumentAI = require('../lib/document-ai');
const {fileTypeChecker, getContentType} = require('../lib/support-file-type');
const { addReceiptToUserInDB, removeUserReceiptInDB } = require('../db/users');
const deleteFile = require('../lib/cloud-storage-file-delete');

const bucketName = process.env.BUCKET_NAME;

let jsonBodyParser = bodyParser.json();

let bucketFileNameChecker = (req, res, next) => {
    const bucketFileName = req.body.bucketFileName;
    if (! bucketFileName) {
        res.status(500).send({message: "bucketFileName is not in request body!"});
        return;
    }
    next();
};

let userAddReceiptRoute = async (req, res) => { // Probably add a middleware to process the record metadata.
    const userID = req.user.userID;
    const requestBody = req.body;
    const contentType = getContentType(requestBody.fileType);
    const bucketFileName = requestBody.bucketFileName;
    const fileName = bucketFileName.substring(37);
    const dateAdded = new Date();
    const dateLastModified = dateAdded;
    const imageURL = `https://storage.cloud.google.com/${bucketName}/${userID}/${bucketFileName}`; // Incorrect URL leads to 404 not found! // Check if necessary to record.
    // Document AI
    let receiptContent;
    try {
        receiptContent = await analyzeFileByDocumentAI(userID, bucketFileName, contentType); // Call Document AI!
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message});
        return;
    }
    // Add to MongoDB Atlas
    const doc = {userID, contentType, fileName, bucketFileName, imageURL, receiptContent, dateAdded, dateLastModified};
    try {
        const receiptID = await addReceiptInDB(doc);
        const receiptIDs = await addReceiptToUserInDB(userID, receiptID);
        // const clientGetImageURL = await getV4ReadSignedUrl(userID, bucketFileName); // check if necessary, or return to client an image processed by the Document AI
        res.status(201).send({...doc, receiptID, receiptIDs, message: "TO BE MODIFIED!"}); // check receiptID key repetition in returned doc
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message});
    }
};

let userRemoveReceiptRoute = async (req, res) => {
    const userID = req.user.userID;
    const receiptID = req.params.receipt_id;
    // Get document from MongoDB Atlas
    let receiptRecord;
    try {
        receiptRecord = await getReceiptInDB(receiptID);
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message || `Error in userRemoveReceiptRoute() for user ${userID} retrieving record ${receiptID} in DB!`});
        return;
    }
    if (userID !== receiptRecord.userID) {
        res.status(404).send({"message": `User ${userID} does not have receipt record ${receiptID}!`});
        return;
    }
    // Delete Cloud Storage File
    const bucketFileName = receiptRecord.bucketFileName;
    try {
        await deleteFile(userID, bucketFileName);
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message || `Error in userRemoveReceiptRoute() for user ${userID} deleting static content in Cloud Storage for receipt record ${receiptID}!`});
        return;
    }
    // Remove from MongoDB Atlas
    try {
        await removeReceiptInDB(receiptID);
        const receiptIDs = await removeUserReceiptInDB(userID, receiptID);
        res.status(200).send({receiptIDs});
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message || `Error in userRemoveReceiptRoute() for user ${userID} removing record ${receiptID} in DB!`});
    }
};

let userGetReceiptRoute = async (req, res) => {

};

let userGetAllReceiptsRoute = async (req, res) => {

};

let userModifyReceiptRoute = async (req, res) => {

};

let receiptsRouter = express.Router();

receiptsRouter.route('/')
    .post(requireAuth, jsonBodyParser, bucketFileNameChecker, fileTypeChecker, userAddReceiptRoute);

receiptsRouter.route('/:receipt_id')
    .delete(requireAuth, userRemoveReceiptRoute);


module.exports = receiptsRouter;