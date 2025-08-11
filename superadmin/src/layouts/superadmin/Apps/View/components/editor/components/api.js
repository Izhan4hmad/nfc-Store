const express = require('express')
const multer = require('multer')
var cors = require('cors')
const app = express()
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.split('.')
    ext = ext[ext.length - 1]
    cb(null, `${Date.now()}.${ext}`)
  },
})
const upload = multer({ storage: storage })
var corsOptions = {
  origin: 'https://77em4.sse.codesandbox.io',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use([express.static('public'), express.json(), cors(corsOptions), upload.array('files')])

app.post('/upload_files', (req, res) => {
  // console.log(req.body);
  if (req.files.length > 0) {
    res.json(req.files[0])
  }
})

app.listen(8080, () => {
  // console.log(`Server started...`);
})
