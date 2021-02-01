const AWS = require('aws-sdk');
const keys = require('../config/keys');
const { v1: uuidv1 } = require('uuid');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    signatureVersion: "v4",
    region: "eu-central-1"
});

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res, next) => {
        const key = `${req.user.id}/${uuidv1()}.jpeg`;

        s3.getSignedUrl('putObject', {
            Bucket: 'leawn-node-app-ci-bucket',
            ContentType: 'image/jpeg',
            Key: key
        }, (err, url) => res.send({ key, url }));
    });
}