import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const router = express.Router();

// User routes
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;