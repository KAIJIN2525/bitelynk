import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Notification from "../model/notification.model.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";

// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id, user.email, user.role);
    res.status(200).json({
      success: true,
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE TOKEN
const createToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "2d", // Token expiration time
  });
};

// REGISTER USER
export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    // Create a validation for email and password strength
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    const user = await User.create({
      username,
      email,
      password, // This will be automatically hashed by the pre-save hook
      role: role || "user",
    });

    // Create admin notification for new user
    await Notification.create({
      type: "user",
      message: `New user registered: ${username}`,
      data: { userId: user._id, email },
    });

    const token = createToken(user._id, user.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Handle migration from string to structured address
    let userAddress = user.address;
    if (typeof userAddress === "string") {
      userAddress = {
        street: userAddress || "",
        city: "",
        state: "",
        postalCode: "",
      };
    } else if (!userAddress) {
      userAddress = {
        street: "",
        city: "",
        state: "",
        postalCode: "",
      };
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.username, // Use username as name for now
        phone: user.phone || "",
        address: userAddress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, phone, address } = req.body;
    const userId = req.user._id;

    // Validation
    if (email && !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
    }

    // Prepare update object
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) {
      // Handle both string and structured address
      if (typeof address === "string") {
        updateData.address = {
          street: address,
          city: "",
          state: "",
          postalCode: "",
        };
      } else {
        updateData.address = address;
      }
    }
    updateData.updatedAt = new Date();

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Handle response address format
    let responseAddress = updatedUser.address;
    if (typeof responseAddress === "string") {
      responseAddress = {
        street: responseAddress || "",
        city: "",
        state: "",
        postalCode: "",
      };
    } else if (!responseAddress) {
      responseAddress = {
        street: "",
        city: "",
        state: "",
        postalCode: "",
      };
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        name: updatedUser.username,
        phone: updatedUser.phone || "",
        address: responseAddress,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// RESET ADMIN PASSWORD
export const resetAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Old password is incorrect" });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 8 characters",
        });
    }
    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL USERS (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET USER TOTAL SPENT
export const getUserTotalSpent = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalSpent: { $sum: "$total" } } },
    ]);
    res.status(200).json({
      success: true,
      totalSpent: result[0]?.totalSpent || 0,
    });
  } catch (error) {
    console.error("Get user total spent error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET USER STATUS COUNTS
export const getUserStatusCounts = async (req, res) => {
  try {
    const counts = await User.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const result = counts.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});
    res.status(200).json({ success: true, counts: result });
  } catch (error) {
    console.error("Get user status counts error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET NEW USERS FOR THE MONTH
export const getNewUsersThisMonth = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const users = await User.find({ createdAt: { $gte: startOfMonth } });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
