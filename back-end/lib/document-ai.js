const { cloudStorageEncodedFileProvider } = require('./file-processor');

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_PROJECT_LOCATION; // Format is 'us' or 'eu'
const processorId = process.env.DOCUMENT_AI_PROCESSOR_ID; // Create processor in Cloud Console

// The full resource name of the processor, e.g.:
// projects/project-id/locations/location/processor/processor-id
// You must create new processors in the Cloud Console first
const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

const {DocumentProcessorServiceClient} =
  require('@google-cloud/documentai').v1;

// Instantiates a client
// apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
// const client = new DocumentProcessorServiceClient({apiEndpoint: 'eu-documentai.googleapis.com'});
const client = new DocumentProcessorServiceClient({apiEndpoint: 'us-documentai.googleapis.com'});

async function analyzeFileByDocumentAI(userID, fileName, contentType) {
  const encodedImage = await cloudStorageEncodedFileProvider(userID, fileName);

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
  const {entities} = document;

  return {entities, selectedEntities: extractEntities(entities)};
}

const matchEntityTypes = ['supplier_name', 'supplier_address', 'supplier_phone', 'invoice_date', 'net_amount', 'total_tax_amount', 'total_amount', 'currency', 'invoice_type'];
const lineItemEntityTypes = ['line_item', 'line_item/description', 'line_item/amount', 'line_item/quantity', 'line_item/unit_price'];

function extractEntities(entities) {
  let selectedEntities = {};
  let lineItemEntities = [];
  for (const entity of entities) {
      const type = entity.type;
      if (! matchEntityTypes.includes(type) && ! lineItemEntityTypes.includes(type)) {
        continue;
      } else if (type === 'invoice_date' || type === 'invoice_type') {
        selectedEntities[type] = entity.normalizedValue.text;
      } else if (matchEntityTypes.includes(type)) {
        selectedEntities[type] = entity.mentionText || entity.normalizedValue.text;
      } else if (lineItemEntityTypes.includes(type)) {
        lineItemEntities.push({
            lineItemString: entity.mentionText || entity.normalizedValue.text,
            lineItemProperties: entity.properties
        });
      } else {
        console.log(`Unhandled entity ${entity}.`)
      }
  }
  selectedEntities['line_items'] = [];
  for (const entity of lineItemEntities) {
      let currentLineItemEntity = getNullLineItemObject();
      const lineItemString = entity.lineItemString;
      const lineItemProperties = entity.lineItemProperties;
      currentLineItemEntity['line_string'] = lineItemString;
      for (const property of lineItemProperties) {
          const type = property.type;
          const value = property.mentionText || property.normalizedValue.text;
          switch (type) {
              case "line_item/quantity":
                  currentLineItemEntity['quantity'] = value;
                  break;
              case "line_item/description":
                  if (currentLineItemEntity['description']) {
                      currentLineItemEntity['description'] += ' ';
                  }
                  currentLineItemEntity['description'] += value;
                  break;
              case "line_item/unit_price":
                  currentLineItemEntity['unit_price'] = value;
                  break;
              case "line_item/amount":
                  currentLineItemEntity['amount'] = value;
                  break;
          }
      }
      selectedEntities['line_items'].push(currentLineItemEntity);
  }
  return selectedEntities;
}

function getNullLineItemObject() {
  return {
    "line_string": null,
    "quantity": null,
    "description": "",
    "unit_price": null,
    "amount": null
  };
}

module.exports = analyzeFileByDocumentAI;