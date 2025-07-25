import express from "express";
import Notification from "../model/notification.model.js";
const router = express.Router();

// Get latest notifications
router.get("/", async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, notifications });
});

// Mark notification as read
router.patch("/:id/read", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

export default router;
