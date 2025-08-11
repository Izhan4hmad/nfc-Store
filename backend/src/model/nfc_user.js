const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const NFC_User = new Schema(
  {
    name: { type: String, },
    email: {type: String, required: true, unique: true, lowercase: true, trim: true, },
    role: { type: String, required: true, enum: ["Merchant", "Agency", "Location"], default: "Location" },
    passcode: { type: String },
    password: { type: String, },
    company_id: { type: String, required: false, default: null, },
    cardIds: { type: [String], default: [], },
  },
  { timestamps: true }
);

module.exports = model("NFC_User", NFC_User);
