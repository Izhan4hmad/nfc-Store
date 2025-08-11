const crypto             = require('crypto')
const nodemailer         = require("nodemailer")
const config             = require('../_config')
const ejs                = require('ejs')
const { Types }          = require('mongoose')

const getUniqueId = (length = 8) => {
  return crypto.randomBytes(length/2).toString('hex')
}

const booleanHasValue = (field) => {
  return typeof field == 'boolean'
}

const hasAnyValue = (value) => {
  const undeclarations = [null, undefined, '']
  return !undeclarations.includes(value)
}

const sendMail = async ({tos, subject, text, html}) => {

  let transporter = nodemailer.createTransport({
    service : "gmail",
    auth    : {
      user : config.email,   // generated ethereal user
      pass : config.pass,    // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from    : '"Display Gallery" <displaycnft@gmail.com>',   // sender address
    to      : tos.join(','),                                 // list of receivers
    subject : subject,                                       // Subject line
    text    : text,                                          // plain text body
    html    : html,                                          // html body
  })

  return info.messageId
}

/**
 * @param {Object} fields - The fields that are required to generate ejs string
 * @param {string} fields.directory - Ejs file directory that needs to be render
 * @param {string} fields.fileName - Ejs file that needs to be render
 * @param {Object} fields.data - The data object that needs to be set for sending email
 * 
 */

 const Html = (fields) => {
  const {directory, fileName, data} = fields
  return new Promise((resolve, reject) => {
    ejs.renderFile('./views/'+directory+'/'+fileName+'.ejs', data, function (err, str) {
      str && resolve(str)
      err && reject(err)
    })
  })
}

const emptyObject = obj => JSON.stringify(obj) == '{}'

const createMongooseDocID = () => new Types.ObjectId().toHexString()

async function delay(duration){
  return new Promise(resolve=>{
      setTimeout(resolve, duration * 1000)
  })
}

module.exports = {
    getUniqueId,
    booleanHasValue,
    sendMail,
    Html,
    hasAnyValue,
    emptyObject,
    createMongooseDocID,
    delay,
}