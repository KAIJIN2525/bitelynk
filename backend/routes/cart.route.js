import express from "express";
import {
  getCartItems,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

// Get cart items
router.get("/", getCartItems);

// Add item to cart
router.post("/add", addItemToCart);

// Update cart item quantity
router.put("/update", updateCartItemQuantity);

// Remove item from cart by product ID
router.delete("/remove/:productId", removeItemFromCart);

// Clear entire cart
router.delete("/clear", clearCart);

export default router;
