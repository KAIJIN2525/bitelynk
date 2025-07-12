import Product from "../model/product.model.js";
import { uploadImage, deleteImage } from "../lib/cloudinary.js";

// CREATE PRODUCT WITH IMAGE UPLOAD
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, rating, hearts } = req.body;

    // Validation
    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Convert string values to numbers (form-data sends everything as strings)
    const numericPrice = Number(price);
    const numericRating = rating ? Number(rating) : 0;
    const numericHearts = hearts ? Number(hearts) : 0;

    // Validate numeric conversions
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    if (rating && isNaN(numericRating)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a valid number",
      });
    }

    if (hearts && isNaN(numericHearts)) {
      return res.status(400).json({
        success: false,
        message: "Hearts must be a valid number",
      });
    }

    let imageUrl = null;
    let imagePublicId = null;

    // Handle image upload if file is provided
    if (req.file) {
      const uploadResult = await uploadImage(req.file.path, "products");

      if (!uploadResult.success) {
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
          error: uploadResult.error,
        });
      }

      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    // Calculate total (price * quantity, defaulting to 1)
    const total = numericPrice * 1;

    // Create product
    const product = await Product.create({
      name,
      description,
      category,
      price: numericPrice,
      rating: numericRating,
      hearts: numericHearts,
      imageUrl,
      imagePublicId,
      total,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: {
        id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        total: product.total,
        rating: product.rating,
        hearts: product.hearts,
        imageUrl: product.imageUrl, // Direct Cloudinary URL for immediate use
        imagePublicId: product.imagePublicId, // Public ID for creating optimized versions
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const formattedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      total: product.total,
      ratings: product.rating,
      hearts: product.hearts,
      imageUrl: product.imageUrl, // Direct Cloudinary URL
      imagePublicId: product.imagePublicId, // For optimization
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let imageUrl = product.imageUrl;
    let imagePublicId = product.imagePublicId;

    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      if (product.imagePublicId) {
        await deleteImage(product.imagePublicId);
      }

      // Upload new image
      const uploadResult = await uploadImage(req.file.path, "products");

      if (!uploadResult.success) {
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
          error: uploadResult.error,
        });
      }

      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        description: description || product.description,
        category: category || product.category,
        price: price || product.price,
        imageUrl,
        imagePublicId,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (product.imagePublicId) {
      await deleteImage(product.imagePublicId);
    }

    // Delete product from database
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
