import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors()
  //   {
  //     origin: (origin, callback) => {
  //       const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
  //       if (origin && allowedOrigins.includes(origin)) {
  //         callback(null, true);
  //       } else {
  //         callback(new Error("Not allowed by CORS"));
  //       }
  //     },
  //     credentials: true,
  //   }
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
