// models/Order.js

const { Schema, model } = require("mongoose");

const OrderItemSchema = new Schema({
    // --- Product Information (Snapshot at time of order) ---
    productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'ProductsPage', 
        required: true 
    },
    productName: { type: String, required: true },
    variantId: { 
        type: Schema.Types.ObjectId, // This will be the _id of the specific variant in the product's `variants` array
        required: true 
    },
    variantTitle: { type: String, required: true },
    
    // --- Fulfillment Information ---
    manufacturerId: { // The user ID of the manufacturer who needs to ship this item
        type: Schema.Types.ObjectId,
        ref: 'NFC_User',
        required: true
    },

    // --- Pricing & Quantity ---
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true }, // The Manufacturer's original unit price
    resellingPrice: { type: Number, required: true }, // The price the Location paid per item
    
    // --- NFC Tag Assignment (Post-Fulfillment) ---
    // This can be populated by the manufacturer when they ship the order
    assignedNfcTags: [{ type: String }] // Array of NFC_Card.code

}, { _id: false });


const OrderSchema = new Schema({
    // --- Core Order Details ---
    orderNumber: { // A human-friendly, unique order ID
        type: String, 
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: [
            'Pending Payment', 
            'Processing',       // Payment received, awaiting fulfillment
            'Shipped',          // Fulfilled by manufacturer
            'Delivered',        // Confirmed received by location
            'Completed',        // Final state after delivery
            'Cancelled'
        ],
        default: 'Pending Payment'
    },
    
    // --- Actor Relationships ---
    locationId: { // The User (role: Location) who placed the order
        type: Schema.Types.ObjectId, 
        ref: 'NFC_User', 
        required: true 
    },
    agencyId: { // The Agency through which the order was placed
        type: Schema.Types.ObjectId, 
        ref: 'Agency', 
        required: true 
    },

    // --- Order Contents ---
    items: [OrderItemSchema],

    // --- Financials ---
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentDetails: {
        paymentIntentId: { type: String }, // e.g., Stripe Payment Intent ID
        paymentStatus: { 
            type: String, 
            enum: ['unpaid', 'paid', 'refunded'], 
            default: 'unpaid' 
        },
        paidAt: { type: Date }
    },

    // --- Shipping & Tracking ---
    shippingAddress: {
        name: { type: String, required: true },
        street1: { type: String, required: true },
        street2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    trackingNumber: { type: String },
    carrier: { type: String }, // e.g., 'FedEx', 'UPS'

    // --- Status History ---
    statusHistory: [{
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
        notes: { type: String } // e.g., "Shipped via FedEx", "Customer requested cancellation"
    }]

}, { timestamps: true });

// Middleware to add initial status to history
OrderSchema.pre('save', function(next) {
    if (this.isNew) {
        this.statusHistory.push({ status: this.status, notes: 'Order created.' });
    }
    next();
});


module.exports = model("Order", OrderSchema);