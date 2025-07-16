import Order from "../model/order.model.js";
import CartItem from "../model/cart.model.js";
import PaystackService from "../lib/paystack.js";
import asyncHandler from "express-async-handler";
import "dotenv/config";

// CREATE ORDER AND INITIALIZE PAYMENT
export const createOrder = asyncHandler(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      country,
      deliveryFee = 0,
      paymentMethod = "paystack",
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state
    ) {
      return res.status(400).json({
        success: false,
        message: "All delivery details are required",
      });
    }

    // Get user's cart items
    const cartItems = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Calculate order totals
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const vatCalculation = PaystackService.calculateVAT(subtotal);
    const total = vatCalculation.total + deliveryFee;

    // Generate unique reference
    const reference = PaystackService.generateReference("BL");

    // Prepare order items with product snapshot
    const orderItems = cartItems.map((item) => ({
      product: {
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
        imagePublicId: item.product.imagePublicId,
      },
      quantity: item.quantity,
    }));

    // Create order
    const order = new Order({
      user: req.user._id,
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zip,
      country,
      items: orderItems,
      paymentMethod,
      subtotal: vatCalculation.subtotal,
      vat: vatCalculation.vat,
      deliveryFee,
      total,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    await order.save();

    // Initialize Paystack payment
    if (paymentMethod === "paystack") {
      const paymentResult = await PaystackService.initializeTransaction({
        email,
        amount: total,
        reference,
        callback_url: `${process.env.FRONTEND_URL}/order-success?reference=${reference}`,
        metadata: {
          orderId: order._id.toString(),
          userId: req.user._id.toString(),
          customerName: `${firstName} ${lastName}`,
        },
      });

      if (!paymentResult.success) {
        await Order.findByIdAndDelete(order._id);
        return res.status(400).json({
          success: false,
          message: "Payment initialization failed",
          error: paymentResult.error,
        });
      }

      // Update order with payment reference
      order.transactionId = reference;
      await order.save();

      // Clear cart after successful order creation
      await CartItem.deleteMany({ user: req.user._id });

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: {
          id: order._id,
          reference,
          total,
          status: order.orderStatus,
        },
        payment: {
          authorization_url: paymentResult.authorization_url,
          access_code: paymentResult.access_code,
          reference: paymentResult.reference,
        },
      });
    }

    // For Cash on Delivery
    if (paymentMethod === "Cash on Delivery") {
      await CartItem.deleteMany({ user: req.user._id });

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: {
          id: order._id,
          total,
          status: order.orderStatus,
          paymentMethod: "Cash on Delivery",
        },
      });
    }
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// VERIFY PAYMENT
export const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    // Verify payment with Paystack
    const verificationResult = await PaystackService.verifyTransaction(
      reference
    );

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        error: verificationResult.error,
      });
    }

    const { data } = verificationResult;

    // Find order by transaction ID
    const order = await Order.findOne({ transactionId: reference });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status based on payment status
    if (data.status === "success") {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentIntentId = data.reference;
    } else {
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Payment ${data.status}`,
      order: {
        id: order._id,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
      },
      payment: data,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

// PAYSTACK WEBHOOK
export const paystackWebhook = asyncHandler(async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!PaystackService.verifyWebhookSignature(payload, signature)) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const { reference } = event.data;

      // Find and update order
      const order = await Order.findOne({ transactionId: reference });

      if (order) {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        await order.save();

        console.log(`Order ${order._id} payment confirmed via webhook`);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
});

// GET USER ORDERS
export const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean()
      .limit(20);

    const formatted = orders.map((o) => ({
      id: o._id,
      user: o.user,
      email: o.email,
      firstName: o.firstName,
      lastName: o.lastName,
      phone: o.phone,

      // Shipping Address
      shippingAddress: {
        address: o.address,
        city: o.city,
        state: o.state,
        zip: o.zip,
        country: o.country,
      },

      reference: o.transactionId || null,
      total: o.total,
      status: o.orderStatus,
      paymentStatus: o.paymentStatus,

      createdAt: o.createdAt,
      items: o.items.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      orders: formatted, // Fixed: Send formatted data, not raw orders
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// GET ORDER BY ID
export const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this order",
      });
    }

    if (req.query.email && order.email !== req.query.email) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

//  UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updated,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// UPDATE ORDER STATUS
export const updateOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this order",
      });
    }

    if (req.body.email && order.email !== req.body.email) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this order",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      updatedOrder,
    });
  } catch (error) {
    console.error("Get order by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// ADMIN: GET ALL ORDERS (with filtering and pagination)
export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, search } = req.query;

    // Build query
    const query = {};

    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Search by customer name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    // Format orders for admin view
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderNumber: order.transactionId || order._id,
      customer: {
        name: `${order.firstName} ${order.lastName}`,
        email: order.email,
        phone: order.phone,
      },
      shippingAddress: {
        address: order.address,
        city: order.city,
        state: order.state,
        country: order.country,
      },
      items: order.items.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      })),
      subtotal: order.subtotal,
      vat: order.vat,
      deliveryFee: order.deliveryFee,
      total: order.total,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      deliveryNotes: order.deliveryNotes,
    }));

    res.status(200).json({
      success: true,
      orders: formattedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});
