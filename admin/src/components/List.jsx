import React, { useEffect, useState } from "react";
import { styles } from "../assets/dummyadmin";
import { FiEdit, FiHeart, FiStar, FiTrash2 } from "react-icons/fi";
import { apiServices } from "../lib/services";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch items from API or state management
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiServices.products.getAllProducts();
      if (response.success) {
        toast.success("Products fetched successfully!");
        setItems(response.products);
      } else {
        toast.error(
          "Failed to fetch products:" + (response?.message || "Unknown error")
        );
      }
    } catch (error) {
      toast.error("Error fetching products.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
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
        toast.error(
          "Failed to delete product:" + (response?.message || "Unknown error")
        );
      }
    } catch (error) {
      toast.error("Error deleting product.");
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
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
  if (loading) {
    return (
      <div
        className={styles.pageWrapper
          .replace(/bg-gradient-to-br.*/, "")
          .concat("flex flex-col items-center justify-center text-amber-100")}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
        <p className="ml-4">Loading...</p>
      </div>
    );
  }
  return (
    <div className={styles.pageWrapper}>
      <div className="max-w-7xl mx-auto">
        <div className={styles.cardContainer}>
          <h2 className={styles.title}>Manage Menu</h2>

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
                    <td className="py-auto">
                      <div className="flex items-center justify-center p-4">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className={styles.updateButton}
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

          {items.length === 0 && (
            <div className={styles.emptyState}>
              No items found. Please add some products.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
