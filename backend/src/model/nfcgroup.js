const { Schema, model } = require('mongoose')

const NfcGroup = new Schema({
  groupName: { type: String, required: true, trim: true },
  codes: { type: [String], required: true, default: [] },
  company_id: { type: String, required: true }
}, { timestamps: true });

module.exports = model('NfcGroup', NfcGroup)
