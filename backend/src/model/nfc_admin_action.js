const { Schema, model } = require('mongoose')

const NFC_ADMIN_ACTION = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    expiry: { type: Date, required: true, default: null },
    redirect_url: String,
    vcf_data: Object,
  },
  { timestamps: true }
)

module.exports = model('NFC_ADMIN_ACTION', NFC_ADMIN_ACTION)
