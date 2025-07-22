import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/register", registerUser);

// Protected routes (require authentication)
router.use(authMiddleware);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

// Admin routes
router.get("/all", admin, getAllUsers);


export default router;
