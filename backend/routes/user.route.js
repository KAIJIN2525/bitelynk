import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  resetAdminPassword,
  getAllUsers,
  getUserTotalSpent,
  getUserStatusCounts,
  getNewUsersThisMonth,
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
router.put("/reset-password", resetAdminPassword); // Add password reset route
router.get("/", getAllUsers);
router.get("/total-spent/:id", getUserTotalSpent);
router.get("/status-counts", getUserStatusCounts);
router.get("/new-this-month", getNewUsersThisMonth);

export default router;
