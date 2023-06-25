const downloadFile = require('./cloud-storage-file-download');
const { CloudStorageFileDoesNotExistError, LocalStorageFileDoesNotExistError } = require('./errors');

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_PROJECT_LOCATION; // Format is 'us' or 'eu'
const processorId = process.env.DOCUMENT_AI_PROCESSOR_ID; // Create processor in Cloud Console

const {DocumentProcessorServiceClient} =
  require('@google-cloud/documentai').v1;

// Instantiates a client
// apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
// const client = new DocumentProcessorServiceClient({apiEndpoint: 'eu-documentai.googleapis.com'});
const client = new DocumentProcessorServiceClient({apiEndpoint: 'us-documentai.googleapis.com'});

const tempFilePath = process.env.TEMP_FILE_PATH;

async function analyzeFileByDocumentAI(userID, fileName, contentType) {
  // The full resource name of the processor, e.g.:
  // projects/project-id/locations/location/processor/processor-id
  // You must create new processors in the Cloud Console first
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  try {
    await downloadFile(userID, fileName);
  } catch (error) {
    if (error.code === 404) {
        throw new CloudStorageFileDoesNotExistError(error);
    } else {
        throw new Error("Unexpected error in downloadFile() in analyzeFileByDocumentAI()!");
    }
  }
  // Read the file into memory.
  const fs = require('fs').promises;
  let imageFile;
  try {
    imageFile = await fs.readFile(tempFilePath+userID+fileName);
  } catch (error) {
    if (error.errno === -2 && error.code === 'ENOENT') {
      throw new LocalStorageFileDoesNotExistError(`Cloud Storage downloaded file ${userID+fileName} is missing in readFile() in analyzeFileByDocumentAI()!`);
    } else {
      throw new Error("Unexpected error in readFile() in analyzeFileByDocumentAI()!");
    }
  }

  // Convert the image data to a Buffer and base64 encode it.
  const encodedImage = Buffer.from(imageFile).toString('base64');

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: contentType,
    },
  };

  // Recognizes text entities in the PDF document
  let result;
  try {
    [result] = await client.processDocument(request);
  } catch (error) {
    console.log(error);
    throw new Error("Error in processDocument() in analyzeFileByDocumentAI()!");
  }
  const {document} = result;

  // Get all of the document text as one big string
  const {text} = document;

  // Extract shards from the text field
  const getText = textAnchor => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return '';
    }

    // First shard in document doesn't have startIndex property
    const startIndex = textAnchor.textSegments[0].startIndex || 0;
    const endIndex = textAnchor.textSegments[0].endIndex;

    return text.substring(startIndex, endIndex);
  };

  // Read the text recognition output from the processor
  console.log('The document contains the following paragraphs:');
  const [page1] = document.pages;
  const {paragraphs} = page1;
  let anaRes = [];

  for (const paragraph of paragraphs) {
    const paragraphText = getText(paragraph.layout.textAnchor);
    anaRes.push(paragraphText);
  }

  try {
    fs.unlink(tempFilePath+userID+fileName, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log(`Deleted ${userID+fileName}.`);
    });
  } catch (error) {
    console.log(error);
    console.log("WARNING: failed to delete temporary file!");
  }

  return {anaRes};
}

module.exports = analyzeFileByDocumentAI;