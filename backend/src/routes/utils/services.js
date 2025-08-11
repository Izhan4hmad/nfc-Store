const AWS = require('aws-sdk')
const { generateToken, verifyPass } = require('../../_utils/guard')
const utils = require('../../_utils')
const Responses = require('./responses')
const config = require('../../_config')

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_KEY,
})
const spacesEndpoint = new AWS.Endpoint(config.DO_ENDPOINT)
const s3 = new AWS.S3({
    endpoint: spacesEndpoint
})

const Upload = async ({ file }) => {
    var name = file.originalname
    const file_name = name.substring(0, name.length - 4)


    const key = file_name + '-' + Math.floor(Math.random() * 110000);

    const params = {
        Bucket: config.AWS_BUCKET,
        ContentType: file.mimetype,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read'
    }

    return await new Promise(resolve => {
        s3.upload(params, (err, data) => {
            if (err) resolve({
                success: false,
                message: Responses.UploadImage.ERROR,
                error: err
            })
            if (data) resolve({
                success: true,
                message: Responses.UploadImage.UPLOADED,
                data: data.Location
            })
        })
    })

}


module.exports = {
    Upload
}