import React, { useEffect, useState } from "react";
import { styles } from "../../assets/dummyadmin";
import { FiEdit, FiHeart, FiStar, FiTrash2, FiUpload, FiPlus } from "react-icons/fi";
import { apiServices } from "../../lib/services";
import { toast } from "sonner";
import { TbCurrencyNaira } from "react-icons/tb";

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiServices.products.getAllProducts();
      if (response.success) {
        setItems(response.data || []);
      } else {
        toast.error("Failed to fetch products: " + (response?.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Error fetching products.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (item) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    setLoading(true);
    try {
      const response = await apiServices.products.deleteProduct(id);
      if (response.success) {
        toast.success("Product deleted successfully!");
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      } else {
        toast.error("Failed to delete product:" + (response?.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Error deleting product.");
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingItem(null);
    fetchProducts();
  };

  const renderStar = (rating) =>
    [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`text-xl ${
          index < rating ? "text-amber-400 fill-amber-400" : "text-amber-100/30"
        }`}
      />
    ));

  return (
    <div className={styles.pageWrapper}>
      <div className="max-w-7xl mx-auto">
        <div className={styles.cardContainer}>
          <div className="flex justify-between items-center mb-8">
            <h2 className={styles.title}>Manage Products</h2>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowAddForm(!showAddForm);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiPlus className="mr-2" /> {showAddForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-amber-300 mb-4">Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-gray-400">Total Products</h4>
                <p className="text-2xl font-bold text-white">{items.length}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-gray-400">Products by Category</h4>
                <ul>
                  {Object.entries(items.reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + 1;
                    return acc;
                  }, {})).map(([category, count]) => (
                    <li key={category} className="text-white">{category}: {count}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-gray-400">Special Offers</h4>
                <p className="text-2xl font-bold text-white">{items.filter(i => i.special).length}</p>
              </div>
            </div>
          </div>

          {showAddForm ? (
            <AddEditForm item={editingItem} onSuccess={handleFormSuccess} />
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th className={styles.th}>Image</th>
                      <th className={styles.th}>Name</th>
                      <th className={styles.th}>Price (₦)</th>
                      <th className={styles.th}>Category</th>
                      <th className={styles.th}>Ratings</th>
                      <th className={styles.th}>Hearts</th>
                      <th className={styles.th}>Special Offer</th>
                      <th className={styles.thCenter}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id} className={styles.tr}>
                        <td className={styles.imgCell}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className={styles.img}
                          />
                        </td>
                        <td className={styles.nameCell}>
                          <div className="space-y-">
                            <h3 className={styles.nameText}>{item.name}</h3>
                            <p className={styles.descText}>{item.description}</p>
                          </div>
                        </td>
                        <td className={styles.priceCell}>{item.price}</td>
                        <td className={styles.categoryCell}>{item.category}</td>
                        <td className={styles.ratingCell}>
                          <div className="flex gap-1">
                            {renderStar(item.rating)}
                          </div>
                        </td>
                        <td className={styles.heartsCell}>
                          <div className={styles.heartsWrapper}>
                            <FiHeart className="text-xl text-red-400" />
                            <span className="text-amber-400 font-bold">
                              {item.hearts}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <input type="checkbox" checked={item.special} readOnly className="form-checkbox h-5 w-5 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500" />
                        </td>
                        <td className="py-auto">
                          <div className="flex items-center justify-center p-4">
                            <button
                              onClick={() => handleUpdate(item)}
                              className={styles.updateButton}
                            >
                              <FiEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className={styles.deleteBtn}
                            >
                              <FiTrash2 className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {items.length === 0 && !loading && (
                <div className={styles.emptyState}>
                  No items found. Please add some products.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AddEditForm = ({ item, onSuccess }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: 0,
    hearts: 0,
    image: null,
    preview: "",
    special: false,
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

  useEffect(() => {
    if (item) {
      setProductData({
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        rating: item.rating,
        hearts: item.hearts,
        image: null,
        preview: item.imageUrl,
        special: item.special || false,
      });
    }
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
      setProductData((prevData) => ({
        ...prevData,
        image: file,
        preview: URL.createObjectURL(file),
      }));
      toast.success("Image ready for upload!");
    }
  };

  const handleRating = (rating) =>
    setProductData((prevData) => ({ ...prevData, rating }));

  const validateForm = () => {
    if (!productData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!productData.description.trim()) {
      toast.error("Product description is required");
      return false;
    }
    if (!productData.category) {
      toast.error("Please select a category");
      return false;
    }
    if (!productData.price || productData.price <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!item && !productData.image) {
      toast.error("Product image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loadingToast = toast.loading(item ? "Updating product..." : "Creating product...");
    try {
      setLoading(true);
      const payload = new FormData();
      for (const key in productData) {
        if (key !== 'preview') {
          payload.append(key, productData[key]);
        }
      }

      const response = item
        ? await apiServices.products.updateProduct(item._id, payload)
        : await apiServices.products.createProduct(payload);

      if (response.success) {
        toast.dismiss(loadingToast);
        toast.success(`🎉 Product ${item ? 'updated' : 'created'} successfully!`);
        onSuccess();
      }
    } catch (error) {
      console.error(`Error ${item ? 'updating' : 'creating'} product:`, error);
      toast.dismiss(loadingToast);
      toast.error(`Failed to ${item ? 'update' : 'create'} product`, {
        description: error.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
      <div className={styles.uploadWrapper}>
        <label htmlFor="image-upload" className={styles.uploadLabel}>
          {productData.preview ? (
            <img
              src={productData.preview}
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
            value={productData.name}
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
            value={productData.description}
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
              value={productData.category}
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
                value={productData.price}
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
                      star <= (hoverRating || productData.rating)
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
                value={productData.hearts}
                onChange={handleInputChange}
                className={styles.inputField + " pl-10 sm:pl-12"}
                placeholder="e.g., 150"
                min="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="special"
              checked={productData.special}
              onChange={handleInputChange}
              className="form-checkbox h-5 w-5 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
            />
            <span className="text-amber-400">Mark as Special Offer</span>
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={styles.actionBtn}
          >
            {loading ? (item ? 'Updating...' : 'Adding...') : (item ? 'Update Product' : 'Add To Menu')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Products;
