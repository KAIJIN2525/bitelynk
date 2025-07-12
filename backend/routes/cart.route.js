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

router.route("/").get(getCartItems).post(addItemToCart);
router.route("/clear").post(clearCart);
router.route("/:id").put(updateCartItemQuantity).delete(removeItemFromCart);

export default router;
