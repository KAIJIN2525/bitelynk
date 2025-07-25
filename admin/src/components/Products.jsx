"use client";

import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiStar,
  FiHeart,
  FiUpload,
} from "react-icons/fi";
import Card from "./Card";
import LoadingSpinner from "./LoadingSpinner";
import { productService } from "../lib/services/productService";
import { toast } from "sonner";
import { TbCurrencyNaira } from "react-icons/tb";
import { styles } from "../assets/dummyadmin";

const Products = () => {
  const [activeTab, setActiveTab] = useState("list"); // list, add, edit
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getAllProducts();
        // Use res.data for backend compatibility
        setProducts(res.data || []);
      } catch (error) {
        // Optionally show a toast or error
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Safe filter logic
  const filteredProducts = products.filter(
    (product) =>
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    setEditingProduct(product);
    setActiveTab("edit");
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  // Add special offer toggle logic
  const handleSpecialOfferToggle = async (productId, currentValue) => {
    try {
      const res = await productService.setSpecialOffer(
        productId,
        !currentValue
      );
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, specialOffer: !currentValue } : p
          )
        );
        toast.success(
          `Product ${!currentValue ? "set as" : "removed from"} special offer!`
        );
      } else {
        toast.error(res.message || "Failed to update special offer status");
      }
    } catch (error) {
      toast.error("Error updating special offer status");
    }
  };

  const ProductForm = ({ product = null, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category || "",
      price: product?.price || "",
      rating: product?.rating || 0,
      hearts: product?.hearts || 0,
      image: null,
      preview: product?.image || product?.imageUrl || "",
      specialOffer: product?.specialOffer || false,
    });
    const [categories] = useState([
      "Breakfast",
      "Lunch",
      "Dinner",
      "Mexican",
      "Italian",
      "Desserts",
      "Drinks",
    ]);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size must be less than 5MB");
          return;
        }
        if (!file.type.startsWith("image/")) {
          toast.error("Please select a valid image file");
          return;
        }
        setFormData((prev) => ({
          ...prev,
          image: file,
          preview: URL.createObjectURL(file),
        }));
        toast.success("Image ready for upload!");
      }
    };

    const handleRating = (rating) =>
      setFormData((prev) => ({ ...prev, rating }));

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "preview") return;
          if (key === "image" && !value) return;
          payload.append(key, value);
        });
        await onSubmit(payload);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Card title={product ? "Edit Product" : "Add New Product"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={styles.uploadWrapper}>
            <label htmlFor="image-upload" className={styles.uploadLabel}>
              {formData.preview ? (
                <img
                  src={formData.preview}
                  alt="Preview"
                  className={styles.previewImage}
                />
              ) : (
                <div className="text-center p-4">
                  <FiUpload className={styles.uploadIcon} />
                  <p className={styles.uploadText}>
                    Click or drag to upload an image
                  </p>
                </div>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-base sm:text-lg text-amber-400">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block mb-2 text-base sm:text-lg text-amber-400">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.inputField + " h-32 sm:h-40"}
                placeholder="Enter product description"
              />
            </div>
            <div className={styles.gridTwoCols}>
              <div>
                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={styles.inputField}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-[#3a2b2b]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                  Price
                </label>
                <div className={styles.relativeInput}>
                  <TbCurrencyNaira className={styles.nairaIcon} />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={styles.inputField + " pl-10 sm:pl-12"}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className={styles.gridTwoCols}>
              <div>
                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-2xl sm:text-3xl transition-transform hover:scale-110"
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <FiStar
                        className={
                          star <= (hoverRating || formData.rating)
                            ? "text-amber-400 fill-current"
                            : "text-amber-100/30"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                  Popularity (Hearts)
                </label>
                <div className={styles.relativeInput}>
                  <FiHeart className={styles.nairaIcon} />
                  <input
                    type="number"
                    name="hearts"
                    value={formData.hearts}
                    onChange={handleInputChange}
                    className={styles.inputField + " pl-10 sm:pl-12"}
                    placeholder="e.g., 150"
                    min="0"
                  />
                </div>
              </div>
            </div>
            {/* Special Offer Toggle */}
            <div className="flex items-center gap-2 mt-2">
              <label className="text-base text-amber-400">Special Offer</label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.specialOffer}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      specialOffer: !prev.specialOffer,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400 transition-colors relative">
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      formData.specialOffer ? "translate-x-4" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className={styles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={styles.actionBtn}
              >
                {loading
                  ? product
                    ? "Saving..."
                    : "Adding..."
                  : product
                  ? "Save Changes"
                  : "Add To Menu"}
              </button>
            </div>
          </div>
        </form>
      </Card>
    );
  };

  const ProductList = () => (
    <Card
      title="Products"
      subtitle={`${filteredProducts.length} products found`}
      action={
        <button
          onClick={() => setActiveTab("add")}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      }
    >
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <FiFilter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Special Offer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Rating
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.description || "No description provided."}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    ₦{product.price?.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!product.specialOffer}
                        onChange={() =>
                          handleSpecialOfferToggle(
                            product.id,
                            product.specialOffer
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400 transition-colors relative">
                        <div
                          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                            product.specialOffer ? "translate-x-4" : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={
                            star <= (product.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                          fill={star <= (product.rating || 0) ? "#facc15" : "none"}
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-500">
                        ({product.rating || 0})
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        // Update existing product (send to backend)
        await productService.updateProduct(editingProduct.id, formData);
        // Refetch products to update UI
        const res = await productService.getAllProducts();
        setProducts(res.data || []);
      } else {
        // Add new product (send to backend)
        await productService.createProduct(formData);
        // Refetch products to update UI
        const res = await productService.getAllProducts();
        setProducts(res.data || []);
      }
      setActiveTab("list");
      setEditingProduct(null);
      toast.success("Product saved successfully!");
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleFormCancel = () => {
    setActiveTab("list");
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant menu items</p>
        </div>
      </div>
      {/* Content based on active tab */}
      {activeTab === "list" && <ProductList />}
      {activeTab === "add" && (
        <ProductForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      )}
      {activeTab === "edit" && editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Products;
