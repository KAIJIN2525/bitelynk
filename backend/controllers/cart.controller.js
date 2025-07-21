import asyncHandler from "express-async-handler";
import CartItem from "../model/cart.model.js";

// GET CART ITEMS
export const getCartItems = asyncHandler(async (req, res) => {
  const cartItems = await CartItem.find({ user: req.user._id }).populate(
    "product"
  );

  const formattedCartItems = cartItems.map((item) => ({
    _id: item._id.toString(),
    product: item.product,
    quantity: item.quantity,
  }));

  res.status(200).json({
    success: true,
    count: cartItems.length,
    data: {
      items: formattedCartItems,
    },
  });
});

// ADD ITEM TO CART
export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Convert quantity to number if it's a string
  const numericQuantity = Number(quantity);

  if (
    !productId ||
    !quantity ||
    isNaN(numericQuantity) ||
    numericQuantity <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Product ID and valid positive quantity are required",
    });
  }

  let cartItem = await CartItem.findOne({
    user: req.user._id,
    product: productId,
  });

  if (cartItem) {
    cartItem.quantity = Math.max(1, cartItem.quantity + numericQuantity);

    if (cartItem.quantity < 1) {
      await cartItem.remove();
      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: {
          _id: cartItem._id.toString(),
          product: cartItem.product,
          quantity: 0,
        },
      });
    }

    await cartItem.save();
    await cartItem.populate("product");
    return res.status(200).json({
      success: true,
      message: "Item quantity updated",
      data: {
        _id: cartItem._id.toString(),
        product: cartItem.product,
        quantity: cartItem.quantity,
      },
    });
  }

  cartItem = await CartItem.create({
    user: req.user._id,
    product: productId,
    quantity: numericQuantity,
  });
  await cartItem.populate("product");
  res.status(201).json({
    success: true,
    message: "Item added to cart",
    data: {
      _id: cartItem._id.toString(),
      product: cartItem.product,
      quantity: cartItem.quantity,
    },
  });
});

// UPDATE ITEM QUANTITY IN CART
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Product ID and valid positive quantity are required",
    });
  }

  const cartItem = await CartItem.findOne({
    product: productId,
    user: req.user._id,
  });

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found",
    });
  }

  cartItem.quantity = Math.max(1, quantity);
  await cartItem.save();
  await cartItem.populate("product");

  res.status(200).json({
    success: true,
    message: "Cart item quantity updated",
    data: {
      _id: cartItem._id.toString(),
      product: cartItem.product,
      quantity: cartItem.quantity,
    },
  });
});

// REMOVE ITEM FROM CART
export const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cartItem = await CartItem.findOne({
    product: productId,
    user: req.user._id,
  });

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found",
    });
  }

  await cartItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Cart item removed",
    data: {
      productId: productId,
    },
  });
});

// CLEAR CART
export const clearCart = asyncHandler(async (req, res) => {
  await CartItem.deleteMany({ user: req.user._id });
  res.status(200).json({
    success: true,
    message: "Cart cleared",
  });
});
