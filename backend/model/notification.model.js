import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g. "order", "user"
  message: { type: String, required: true },
  data: { type: Object }, // extra info (orderId, userId, etc)
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
