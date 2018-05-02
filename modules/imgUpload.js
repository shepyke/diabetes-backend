'use strict';
const storage = require('@google-cloud/storage');
const fs = require('fs')

const gcs = storage({
    projectId: 'diabetes-93dcc',
    keyFilename: './diabetes-d4e9c520b48d.json'
});

const bucketName = 'diabetes-93dcc.appspot.com'
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {};

ImgUpload.uploadToGcs = (req, res, next) => {
    if(!req.file) return next();

    const gcsname = req.file.originalname;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    stream.on('error', (err) => {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname;
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        next();
    });

    stream.end(req.file.buffer);
}

module.exports = ImgUpload;