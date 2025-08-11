const { Schema, model } = require("mongoose");

const generateUniqueCode = () => {
  return Math.random().toString(36).substr(2, 10).toUpperCase(); // Generates a 10-character random string
};


const productsPage = new Schema({
  productName: { type: String, required: true, trim: true },
  productId: { type: String, required: true, unique: true, default: generateUniqueCode  },
  productDescription: { type: String, required: true, trim: true },
  merchantId: { type: String, default: null },
  customerId: { type: String, default: null },
  companyId: [{ type: String }],
  customizable: {type: Boolean, default: false},
  status: { type: String, default: "draft" },
  imageUrls: [{ type: String, required: true }],
  variants: [{
    title: { type: String, required: true, trim: true },
    height: { type: String, required: true, trim: true },
    width: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    logo: { type: String, required: true, trim: true },
    shape:{ type: String, required: true, trim: true },
    imageUrls: [{ type: String, required: true }],
    agencyCreated: { type: Boolean, default: false },
    createdBy: { type: String, required: false },
    quantity: { type: Number, required: true, min: [0, "Quantity cannot be negative"] },
    unitPrice: { type: Number, required: true, min: [0, "Unit price cannot be negative"] },
    resellingPrice: { type: Number, required: true, min: [0, "Reselling price cannot be negative"] }
  }]
}, { timestamps: true });

module.exports = model("ProductsPage", productsPage);

