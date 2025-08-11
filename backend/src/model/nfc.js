const { Schema, model } = require('mongoose')

const NFC = new Schema({
  code: { type: Array },
  passcode: { type: String },
  company_id: { type: String },
  location_id: { type: String },
  type: { type: String },
  configuration: { type: Object }
}, { timestamps: true });

module.exports = model('NFC', NFC)
