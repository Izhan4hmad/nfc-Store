const { Schema, model } = require("mongoose");

const NFC_PACKAGE = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: String },
    merchantId: { type: String },
    customerId: { type: String },
    associatedAgencyId: { type: String },
    companyId: [{ type: String }],
    bundleId: { type: String, required: true, unique: true },
    resellingPrice: { type: String },
    agencyOnly: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "draft"], default: "draft" },
    imageUrls: [{ type: String, required: true }],
    products: [
      {
        productId: { type: String, required: true },
        productName: { type: String },
        variants: [
          {
            variantId: { type: String, required: true },
            title: { type: String },
            imageUrls: [{ type: String, required: true }],
            quantity: { type: Number, required: true },
            unitPrice: { type: Number, required: true },
            resellingPrice: { type: Number },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("NFC_PACKAGE", NFC_PACKAGE);
