import React from "react";
import { useState } from "react";
import { styles } from "../assets/dummyadmin";
import { FiHeart, FiStar, FiUpload } from "react-icons/fi";
import { TbCurrencyNaira } from "react-icons/tb";
import { apiServices } from "../lib/services";
import { toast } from "sonner";

const AddItems = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: 0,
    hearts: 0,
    image: null,
    preview: "",
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
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
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
    // ✅ FIX: Added validation for the image
    if (!productData.image) {
      toast.error("Product image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loadingToast = toast.loading("Creating product...");
    try {
      setLoading(true);
      const payload = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (key === "preview") return;
        payload.append(key, value);
      });

      const response = await apiServices.products.createProduct(payload);

      if (response.success) {
        toast.dismiss(loadingToast);
        toast.success("🎉 Product created successfully!", {
          description: `${productData.name} has been added to your menu`,
          duration: 4000,
        });
        handleClearForm(false); // Reset form without showing a toast
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to create product", {
        description: error.message || "Please try again later",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Added a parameter to control if a toast is shown
  const handleClearForm = (showToast = true) => {
    setProductData({
      name: "",
      description: "",
      category: "",
      price: "",
      rating: 0,
      hearts: 0,
      image: null,
      preview: "",
    });
    if (showToast) {
      toast.info("Form cleared");
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className="max-w-4xl mx-auto">
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Add New Item</h2>

          <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
            <div className={styles.uploadWrapper}>
              {/* ✅ FIX: Changed htmlFor to match the input id */}
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
                      // ✅ FIX: Added type="button"
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
                  {/* ✅ FIX: Simplified to just a number input */}
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

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => handleClearForm(true)}
                  className={styles.secondaryBtn} // Assuming you have a secondary button style
                >
                  Clear Form
                </button>
                <button type="submit" disabled={loading} className={styles.actionBtn}>
                  {loading ? "Adding..." : "Add To Menu"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItems;