const downloadFile = require('./cloud-storage-file-download');
const { CloudStorageFileDoesNotExistError, LocalStorageFileDoesNotExistError } = require('./errors');

const tempFilePath = process.env.TEMP_FILE_PATH;

const fs = require('fs').promises;

const cloudStorageEncodedFileProvider = async (userID, fileName) => {
    let encodedImage;
    try {
        await downloadFile(getCloudStorageFilePath(userID, fileName), getTemporaryFilePath(userID, fileName));
        encodedImage = await localFileEncoder(userID, fileName);
    } catch (error) {
        if (error.code === 404) {
            throw new CloudStorageFileDoesNotExistError(error);
        } else {
            throw new Error("Unexpected error in in localFileEncoder()!");
        }
    } finally {
        await localFileRemover(userID, fileName);
    }
    if (! encodedImage) {
        throw new Error("Encoded image is still undefined in cloudStorageEncodedFileProvider()!");
    }
    return encodedImage;
};

const localFileEncoder = async (userID, fileName) => {
    // Read the file into memory.
    let imageFile;
    try {
        imageFile = await fs.readFile(getTemporaryFilePath(userID, fileName));
    } catch (error) {
        if (error.errno === -2 && error.code === 'ENOENT') {
            throw new LocalStorageFileDoesNotExistError(`Local file ${getTemporaryFilePath(userID, fileName)} is missing in readFile() in localFileEncoder()!`);
        } else {
            throw new Error("Unexpected error in readFile() in localFileEncoder()!");
        }
    }

    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = Buffer.from(imageFile).toString('base64');
    return encodedImage;
};

const localFileRemover = async (userID, fileName) => {
    try {
        await fs.unlink(getTemporaryFilePath(userID, fileName));
        console.log(`Deleted ${getTemporaryFilePath(userID, fileName)}.`);
    } catch (error) {
        console.log(error);
        console.log(`WARNING: failed to delete temporary file ${getTemporaryFilePath(userID, fileName)} or temporary file does not exist in localFileRemover()!`);
    }
};

const getTemporaryFilePath = (userID, fileName) => {
    return `${tempFilePath}${userID}${fileName}`;
};

const getCloudStorageFilePath = (userID, buckerFileName) => {
    return `${userID}/${buckerFileName}`;
};

module.exports = {cloudStorageEncodedFileProvider};