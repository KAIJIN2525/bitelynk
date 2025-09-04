import { useState, useEffect } from "react";
import { useCart } from "../../CartContext/CartContext";
import { productService } from "../../lib/services/productService";
import { FaMinus, FaPlus, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./OurHomeMenu.css";
import { formatPrice } from "../../utils/priceUtils";
import { toast } from "sonner";

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Desserts",
  "Mexican",
  "Italian",
  "Drinks",
];

const OurHomeMenu = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);

  const { cartItems, addToCart, removeFromCart } = useCart();
  const getQuantity = (id) =>
    cartItems.find((item) => item.id === id)?.quantity || 0;

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();

        if (response.success && response.data) {
          setProducts(response.data);

          // Extract unique categories from products
          const uniqueCategories = [
            "All",
            ...new Set(response.data.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          toast.error("Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products and limit to 4 for home page
  const displayItems =
    activeCategory === "All"
      ? products.slice(0, 4)
      : products
          .filter((product) => product.category === activeCategory)
          .slice(0, 4);

  return (
    <div className="bg-light-background min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
          <span className="font-dancingscript block text-5xl md:text-7xl sm:text-6xl mb-2">
            Our Exquisite Menu
          </span>
          <div className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-text-secondary">
            Symphony of Flavors
          </div>
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <FaSpinner className="text-4xl text-primary animate-spin mx-auto mb-4" />
              <p className="text-text-primary font-cinzel">
                Loading our delicious menu...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-6 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-lg tracking-widest ${
                    activeCategory === cat
                      ? "bg-primary text-white border-primary scale-105 shadow-lg shadow-primary/30"
                      : "bg-white border-border text-text-secondary hover:bg-primary/10 hover:scale-95 "
                  } `}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {displayItems.map((item, i) => {
                const quantity = getQuantity(item.id);

                return (
                  <div
                    key={item.id}
                    className="relative bg-white rounded-2xl overflow-hidden border border-border flex flex-col transition-all duration-500 hover:shadow-lg"
                    style={{ "--index": i }}
                  >
                    <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain transition-all duration-700"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50 transition-all duration-300" />
                      <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-text-secondary text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-auto flex items-center gap-4 justify-between">
                        <div className="bg-primary/10 py-1 px-3 rounded-2xl">
                          <span className="text-xl font-bold text-primary font-dancingscript">
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {quantity > 0 ? (
                            <>
                              <button
                                className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                                onClick={() =>
                                  quantity > 1
                                    ? addToCart(item, quantity - 1)
                                    : removeFromCart(item.id)
                                }
                              >
                                <FaMinus className="text-text-primary" />
                              </button>

                              <span className="w-8 text-center text-text-primary">
                                {quantity}
                              </span>

                              <button
                                className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                                onClick={() => addToCart(item, quantity + 1)}
                              >
                                <FaPlus className="text-text-primary" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addToCart(item, 1)}
                              className="bg-primary px-4 py-1.5 rounded-full font-cinzel text-xs uppercase sm:text-sm tracking-wider transition-transform duration-300 hover:scale-110 shadow-lg hover:shadow-primary/20 text-dark-accent"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-16">
              <Link
                to="/menu"
                className="bg-primary border-2 border-primary text-dark-accent px-8 sm:px-10 py-3 rounded-full font-cinzel uppercase tracking-widest transition-all duration-300 hover:bg-primary-dark hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
              >
                Explore Full Menu
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OurHomeMenu;
