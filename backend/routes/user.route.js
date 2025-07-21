import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/register", registerUser);

// Protected routes (require authentication)
router.use(authMiddleware);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

export default router;
