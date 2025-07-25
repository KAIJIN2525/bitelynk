import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  setSpecialOffer, // NEW
  getSpecialOffers, // NEW
} from "../controllers/product.controller.js";
import { uploadSingleImage, handleMulterError } from "../lib/upload.js";

const router = express.Router();

// POST /api/products - Create product with image upload
router.post("/", uploadSingleImage, handleMulterError, createProduct);

// DELETE /api/products/:id - Delete product
router.delete("/:id", deleteProduct);

// GET /api/products - Get all products
router.get("/", getAllProducts);

// GET /api/products/special-offers - Get all special offer products
router.get("/special-offers", getSpecialOffers);

// GET /api/products/:id - Get product by ID
router.get("/:id", getProductById);

// PUT /api/products/:id - Update product with optional image upload
router.put("/:id", uploadSingleImage, handleMulterError, updateProduct);

// PATCH /api/products/:id/special-offer - Set/unset special offer
router.patch("/:id/special-offer", setSpecialOffer);

export default router;
