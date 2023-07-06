const express = require('express');
const { requireAuth } = require('../lib/auth');
const bodyParser = require('body-parser');
const { addReceiptInDB, getReceiptInDB, removeReceiptInDB, getReceiptsInDB, getReceiptByUserIDAndBucketFileNameInDB, updateReceiptInDB } = require('../db/receipts');
const getV4ReadSignedUrl = require('../lib/generate-v4-read-signed-url');
const {analyzeFileByDocumentAI, matchEntityTypes, lineItemEntityTypes, numberEntityTypes, priceEntityTypes} = require('../lib/document-ai');
const {fileTypeChecker, getContentType} = require('../lib/support-file-type');
const { addReceiptToUserInDB, removeReceiptFromUserInDB } = require('../db/users');
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

let modifiedReceiptContentFilter = (req, res, next) => {
    const requestBody = req.body;
    const analyzedResults = requestBody.analyzedResults;
    remove_key = [];
    for (const key in analyzedResults) {
        const value = analyzedResults[key];
        if (! matchEntityTypes.includes(key) && key !== 'line_items') {
            remove_key.push(key);
        }
        if (key === 'line_items') {
            for (const line_item of value) {
                line_item_remove_key = [];
                for (const line_item_key in line_item) {
                    const line_item_value = line_item[line_item_key];
                    if (! lineItemEntityTypes.includes(line_item_key) && line_item_key !== 'line_string') {
                        line_item_remove_key.push(line_item_key);
                    }
                    if (numberEntityTypes.includes(line_item_key) && ! isNumericOrNull(line_item_value)) {
                        res.status(422).send({message: `Entity ${line_item_key} for line_item shoule be either a number or null, but ${line_item_value} is given!`, entity: line_item_key, value: line_item_value});
                        return;
                    }
                    if (priceEntityTypes.includes(line_item_key) && line_item_value) {
                        line_item[line_item_key] = parseFloat(line_item_value).toFixed(2).toString();
                    }
                }
                line_item_remove_key.forEach((line_item_key) => {
                    delete line_item[line_item_key];
                });
            }
        }
        if (numberEntityTypes.includes(key) && ! isNumericOrNull(value)) {
            res.status(422).send({message: `Entity ${key} shoule be either a number or null, but ${value} is given!`, entity: key, value: value});
            return;
        }
        if (priceEntityTypes.includes(key) && value) {
            analyzedResults[key] = parseFloat(value).toFixed(2).toString();
        }
    }
    remove_key.forEach((key) => {
        delete analyzedResults[key];
    });
    req.modifiedAnalyzedResults = analyzedResults;
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
    const doc = {userID, contentType, fileName, bucketFileName, imageURL, dateAdded, dateLastModified, analyzedResults: receiptContent['selectedEntities']};
    res.status(201).send({...doc, message: "The receipt record will appear on your account in a few seconds."}); // check receiptID key repetition in returned doc
    try {
        const receiptID = await addReceiptInDB({...doc, analyzedResults: receiptContent});
        const receiptIDs = await addReceiptToUserInDB(userID, receiptID);
        // const clientGetImageURL = await getV4ReadSignedUrl(userID, bucketFileName); // check if necessary, or return to client an image processed by the Document AI
    } catch (error) {
        console.log({...error, message: error.message});
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
        const receiptIDs = await removeReceiptFromUserInDB(userID, receiptID);
        res.status(200).send({receiptIDs});
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message || `Error in userRemoveReceiptRoute() for user ${userID} removing record ${receiptID} in DB!`});
    }
};

let userGetReceiptRoute = async (req, res) => {
    const userID = req.user.userID;
    const receiptID = req.params.receipt_id;
    // Get document from MongoDB Atlas
    let receiptRecord;
    try {
        receiptRecord = await getReceiptInDB(receiptID);
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message || `Error in userGetReceiptRoute() for user ${userID} retrieving record ${receiptID} in DB!`});
        return;
    }
    if (userID !== receiptRecord.userID) {
        res.status(404).send({"message": `User ${userID} does not have receipt record ${receiptID}!`});
        return;
    }
    res.status(200).send({...receiptRecord, analyzedResults: receiptRecord.analyzedResults['selectedEntities']});
};

let userGetAllReceiptsRoute = async (req, res) => {
    const userID = req.user.userID;
    // Get document from MongoDB Atlas
    let receiptRecords;
    try {
        receiptRecords = await getReceiptsInDB(userID);
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message || `Error in userGetAllReceiptsRoute() for user ${userID} retrieving record ${receiptID} in DB!`});
        return;
    }
    receiptRecords = receiptRecords.map((record) => {
        return {...record, analyzedResults: record.analyzedResults['selectedEntities']};
    });
    res.status(200).send({expenseSummary: calculateExpenseSummary(receiptRecords), receiptRecords});
};

let userModifyReceiptRoute = async (req, res) => {
    const userID = req.user.userID;
    const modifiedAnalyzedResults = req.modifiedAnalyzedResults;
    let receiptID;
    try {
        receiptID = req.params.receipt_id || (((await getReceiptByUserIDAndBucketFileNameInDB(userID, req.body.bucketFileName))?._id || '').toString());
        if (! receiptID) {
            res.status(404).send({message: `Cannot find receipt: either receipt_id ${req.params.receipt_id} is missing in URL, or user ${userID} does not have receipt with bucketFileName ${req.body.bucketFileName}. If the receipt has been just added, please wait for a few more seconds and re-try.`});
            return;
        }
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message || `Error in userModifyReceiptRoute() for user ${userID} retrieving record by bucketFileName ${req.body.bucketFileName} in DB!`});
        return;
    }
    try {
        const updatedReceipt = await updateReceiptInDB(receiptID, {dateLastModified: new Date(), "analyzedResults.selectedEntities": modifiedAnalyzedResults});
        res.status(200).send({...updatedReceipt, analyzedResults: updatedReceipt.analyzedResults['selectedEntities']});
    } catch (error) {
        res.status(error.status || 400).send({...error, message: error.message || `Error in userModifyReceiptRoute() for user ${userID} updating receipt ${receiptID} in DB!`});
    }
};

let calculateExpenseSummary = (receiptRecords) => {
    let expenseSummary = {
        expenseSum: 0,
        years: {}
    };
    for (const record of receiptRecords) {
        const date = record.analyzedResults.invoice_date || record.dateAdded.toISOString().substring(0, 10);
        const year = parseInt(date.substring(0, 4));
        const month = parseInt(date.substring(5, 7));
        const expense = parseFloat(record.analyzedResults.total_amount || 0) || 0;
        expenseSummary['expenseSum'] += expense;
        if (! expenseSummary['years'][year]) {
            expenseSummary['years'][year] = {
                yearlyExpenseSum: 0,
                months: {}
            };
        }
        expenseSummary['years'][year]['yearlyExpenseSum'] += expense;
        if (! expenseSummary['years'][year]['months'][month]) {
            expenseSummary['years'][year]['months'][month] = {
                monthlyExpenseSum: 0,
            };
        }
        expenseSummary['years'][year]['months'][month]['monthlyExpenseSum'] += expense;
    }
    return expenseSummary;
};

function isNumericOrNull(str) {
    if (str === null) return true;
    return !isNaN(str) && !isNaN(parseFloat(str));
};

let receiptsRouter = express.Router();

receiptsRouter.route('/')
    .get(requireAuth, userGetAllReceiptsRoute)
    .post(requireAuth, jsonBodyParser, bucketFileNameChecker, fileTypeChecker, userAddReceiptRoute)
    .patch(requireAuth, jsonBodyParser, bucketFileNameChecker, modifiedReceiptContentFilter, userModifyReceiptRoute);

receiptsRouter.route('/:receipt_id')
    .get(requireAuth, userGetReceiptRoute)
    .delete(requireAuth, userRemoveReceiptRoute)
    .patch(requireAuth, jsonBodyParser, modifiedReceiptContentFilter, userModifyReceiptRoute);


module.exports = receiptsRouter;