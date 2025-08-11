const { Schema, model } = require('mongoose')

const BUY_PACKAGE = new Schema(
  {
    couponId: { type: String, required: true, unique: true },
    bundleId: { type: String, required: true },
    agencyId: { type: String },
    customerName: { type: String },
    customerEmail: { type: String },
  },
  { timestamps: true }
)

module.exports = model('BUY_PACKAGE', BUY_PACKAGE)
