import express from "express";
import {
  createOrder,
  verifyPayment,
  paystackWebhook,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateOrder,
  getAllOrders,
} from "../controllers/order.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public webhook route (no auth required)
router.post("/webhook/paystack", paystackWebhook);

// Protected routes (authentication required)
router.use(authMiddleware);

// USER ORDER ROUTES
router.get("/user/my-orders", getUserOrders); // Users get their own orders
router.post("/create", createOrder); // Users create new orders
router.get("/user/:id", getOrderById); // Users get specific order

// ADMIN ORDER ROUTES
router.get("/admin/all", getAllOrders); // Admin gets all orders
router.put("/admin/:id/status", updateOrderStatus); // Admin updates order status
router.put("/admin/:id", updateOrder); // Admin updates order details

// PAYMENT ROUTES
router.get("/verify/:reference", verifyPayment); // Verify payment status

export default router;
