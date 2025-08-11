const multer = require('multer')

const uploader = multer({
    storage     : multer.memoryStorage(),
    limits      : {
        fileSize    :   60 * 1024 * 1024 // limiting files size to 60 MB
    }

})

module.exports = uploader