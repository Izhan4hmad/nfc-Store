const { Schema, model } = require('mongoose')

const NFC_ACTION = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'nfc_user' },
    redirect_url: String,
    vcf_data: Object,
  },
  { timestamps: true }
)

module.exports = model('NFC_ACTION', NFC_ACTION)
