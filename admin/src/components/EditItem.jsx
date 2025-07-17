import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styles } from "../assets/dummyadmin";
import { FiHeart, FiStar, FiUpload } from "react-icons/fi";
import { TbCurrencyNaira } from "react-icons/tb";
import { apiServices } from "../lib/services";
import { toast } from "sonner";

const EditItem = () => {
  // State for the form data
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: 0,
    hearts: 0,
    image: null, // This will hold the new file if selected
    preview: "", // This will hold the image URL for display
  });

  // Other necessary state
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // For initial data fetch
  const [hoverRating, setHoverRating] = useState(0);
  const [categories] = useState([
    "Breakfast",
    "Lunch",
    "Dinner",
    "Mexican",
    "Italian",
    "Desserts",
    "Drinks",
  ]);

  // Hooks for routing
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate(); // To redirect after update

  // --- 1. FETCH EXISTING PRODUCT DATA ---
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setInitialLoading(true);
      try {
        const response = await apiServices.products.getProduct(id);
        if (response.success) {
          const fetchedProduct = response.product;
          // Populate the form with existing data
          setProductData({
            ...fetchedProduct,
            image: null, // Reset image file input
            preview: fetchedProduct.imageUrl, // Use existing imageUrl for preview
          });
        } else {
          toast.error(
            "Failed to fetch product: " + (response?.message || "Unknown error")
          );
          navigate("/list"); // Redirect if product not found
        }
      } catch (error) {
        toast.error("Error fetching product details.");
        console.error("Error fetching product:", error);
        navigate("/list");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]); // Rerun if ID changes

  // --- 2. FORM HANDLERS ---
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
      // Set the new file and create a local URL for immediate preview
      setProductData((prevData) => ({
        ...prevData,
        image: file, // The new file object
        preview: URL.createObjectURL(file), // The new preview URL
      }));
    }
  };

  const handleRating = (rating) =>
    setProductData((prevData) => ({ ...prevData, rating }));

  // --- 3. HANDLE FORM SUBMISSION (UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Updating product...");

    try {
      const payload = new FormData();
      // Append all fields except the ones we don't need
      Object.entries(productData).forEach(([key, value]) => {
        // Don't append the preview URL or the original imageUrl
        if (key === "preview" || key === "imageUrl") return;

        // IMPORTANT: Only append the 'image' if it's a new file.
        // If `productData.image` is null, it means the user didn't select a new image.
        if (key === "image" && !value) return;

        payload.append(key, value);
      });

      const response = await apiServices.products.updateProduct(id, payload);

      if (response.success) {
        toast.dismiss(loadingToast);
        toast.success("✅ Product updated successfully!");
        navigate("/list"); // Redirect back to the items list
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to update product", {
        description: error.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- 4. RENDER THE COMPONENT ---
  if (initialLoading) {
    return (
      <div className="text-center text-white p-10">Loading product data...</div>
    );
  }

  return (
    <div className={styles.formWrapper}>
      <div className="max-w-4xl mx-auto">
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Edit "{productData.name}"</h2>

          <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
            <div className={styles.uploadWrapper}>
              <label htmlFor="image-upload" className={styles.uploadLabel}>
                {/* This now correctly shows the existing image or the new preview */}
                {productData.preview ? (
                  <img
                    src={productData.preview}
                    alt="Product Preview"
                    className={styles.previewImage}
                  />
                ) : (
                  <div className="text-center p-4">
                    <FiUpload className={styles.uploadIcon} />
                    <p className={styles.uploadText}>Upload an image</p>
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
              {/* All input fields now use `value={productData.fieldName || ''}` to avoid uncontrolled component warnings */}
              <div>
                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name || ""}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>

              <div>
                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                  Description
                </label>
                <textarea
                  name="description"
                  value={productData.description || ""}
                  onChange={handleInputChange}
                  className={styles.inputField + " h-32 sm:h-40"}
                />
              </div>

              <div className={styles.gridTwoCols}>
                <div>
                  <label className="block mb-2 text-base sm:text-lg text-amber-400">
                    Category
                  </label>
                  <select
                    name="category"
                    value={productData.category || ""}
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
                      value={productData.price || ""}
                      onChange={handleInputChange}
                      className={styles.inputField + " pl-10 sm:pl-12"}
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
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <FiStar
                          className={`text-2xl sm:text-3xl transition-transform hover:scale-110 ${
                            star <= (hoverRating || productData.rating)
                              ? "text-amber-400 fill-current"
                              : "text-amber-100/30"
                          }`}
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
                      value={productData.hearts || 0}
                      onChange={handleInputChange}
                      className={styles.inputField + " pl-10 sm:pl-12"}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/list")} // Cancel button
                  className={styles.secondaryBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.actionBtn}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
