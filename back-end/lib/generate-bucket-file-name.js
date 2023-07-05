const { v4: uuidv4 } = require('uuid');

function generateUUID() {
    return uuidv4();
}

function generateBucketFileName(originalName) {
    const uuid = generateUUID();
    console.log(uuid);
    return `${uuid}_${originalName}`;
}

module.exports = generateBucketFileName;