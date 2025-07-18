import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      imageUrl: { type: String, required: true },
      imagePublicId: { type: String, required: true }, // Added for Cloudinary
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: true, timestamps: true }
);

const orderSchema = new mongoose.Schema({
  // USER DETAILS
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: { type: String, required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  // ORDER DETAILS
  items: [orderItemSchema],

  // PAYMENT METHOD
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Credit Card", "paystack", "Cash on Delivery"],
    index: true,
  },
  paymentIntentId: { type: String },
  sessionId: { type: String, index: true },
  transactionId: { type: String },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
    index: true,
  },
  // ORDER CALCULATIONS
  subtotal: { type: Number, required: true, min: 0 },
  vat: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },

  // ORDER TRACKING
  orderStatus: {
    type: String,
    enum: [
      "pending",
      "processing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ],
    default: "processing",
    index: true,
  },
  expectedDeliveryDate: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  deliveryNotes: { type: String }, // For admin delivery instructions

  // TIMESTAMPS
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now, index: true },
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

orderSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
