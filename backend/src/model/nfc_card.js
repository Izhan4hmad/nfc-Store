const { Schema, model } = require("mongoose");

// Function to generate a unique code
const generateUniqueCode = () => {
  return Math.random().toString(36).substr(2, 10).toUpperCase(); // Generates a 10-character random string
};

const NFC_Card = new Schema(
{
  code: { type: String, required: true, unique: true, default: generateUniqueCode },
  associatedId: { type: String, default: null },
  userId: { type: String, default: null },
  actionId: { type: String, default: null },
  associatedVariantIndex: { type: Number, default: null },
  passcode: { type: String, required: true },
  url: { type: String, required: true },
  domain: { type: String, required: true },
  islock: { type: Boolean, required: true, default: false },
  agencyId: { type: String, required: false, default: null },
  company_id: { type: String, required: false, default: null },
  type: { type: String, required: false },
  bundleId: { type: String, required: false }
},
{ timestamps: true }
);

module.exports = model("NFC_Card", NFC_Card);
