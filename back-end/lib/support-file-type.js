
const EXTENSION = {
    "pdf": "application/pdf",
    "gif": "image/gif",
    "tiff": "image/tiff",
    "tif": "image/tiff",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "bmp": "image/bmp",
    "webp": "image/webp"
}

// const MIME_TYPE = ["application/pdf", "image/gif", "image/tiff", "image/jpeg", "image/png", "image/bmp", "image/webp"];

let fileTypeChecker = (req, res, next) => {
    let fileType = req.body.fileType;
    if (! fileType) {
        fileName = req.body.bucketFileName || req.params.filename;
        if (! fileName) {
            res.status(500).send({message: "Either fileName not in URI or bucketFileName is not in request body!"});
            return;
        }
        fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
        req.body = {...req.body, fileType};
    }
    fileType = fileType.toLowerCase();
    if (! fileType in EXTENSION) {
        res.status(422).send({message: `Given fileType ${fileType} is not supported! Please upload one of: ${Object.keys(EXTENSION)}`});
        return;
    }  
    next();
};

let getContentType = (ext) => {
    return EXTENSION[ext];
};

module.exports = {fileTypeChecker, getContentType};