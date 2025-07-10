import { useState } from "react";
import { useCart } from "../../CartContext/CartContext";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaTimes, FaShoppingCart } from "react-icons/fa";
import { formatPrice } from "../../utils/priceUtils";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const totalPrice = cartItems.reduce((total, item) => {
    console.log(
      "CartPage - Item:",
      item.name,
      "Price:",
      item.price,
      "Type:",
      typeof item.price
    );
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[₦,]/g, ""))
        : item.price;
    return total + price * item.quantity;
  }, 0);

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold md:text-6xl text-center mb-12 animate-fade-in-down">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2 bg-gradient-to-r from-amber-100 to-amber-400 bg-clip-text text-transparent">
            Your Cart
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center animate-fade-in max-w-md mx-auto">
            <div className="bg-amber-900/20 rounded-3xl p-12 border border-amber-800/30 backdrop-blur-sm">
              {/* Empty Cart Icon */}
              <div className="mb-6">
                <FaShoppingCart className="text-6xl text-amber-300/50 mx-auto animate-pulse" />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-dancingscript text-amber-100 mb-4">
                Your Cart is Empty
              </h3>
              
              {/* Description */}
              <p className="text-amber-100/80 text-lg mb-8 font-cinzel leading-relaxed">
                Discover our delicious menu and add your favorite dishes to get started!
              </p>
              
              {/* CTA Button */}
              <Link
                to="/menu"
                className="group transition-all duration-300 text-amber-100 inline-flex items-center gap-3 hover:gap-4 bg-gradient-to-r from-amber-900/60 to-amber-700/60 hover:from-amber-800/80 hover:to-amber-600/80 px-8 py-3 rounded-full font-cinzel text-lg uppercase tracking-wider border border-amber-600/30 hover:border-amber-500/50 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <FaShoppingCart className="text-lg group-hover:animate-bounce" />
                <span>Explore Menu</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-amber-900/20 p-4 rounded-2xl border-4 border-dashed border-amber-500 backdrop-blur-sm flex flex-col items-center gap-4 transition-all duration-300 hover:border-solid hover:shadow-xl hover:shadow-amber-900/10 transform hover:-translate-x-1 animate-fade-in"
                >
                  <div
                    className="w-24 h-24 flex-shrink-0 cursor-pointer relative overflow-hidden rounded-lg transition-transform duration-300"
                    onClick={() => setSelectedImage(item.image)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-full text-center">
                    <h3 className="text-xl font-dancingscript text-amber-100">
                      {item.name}
                    </h3>
                    <p className="text-amber-100/80 font-cinzel mt-1 text-center">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-all duration-200 active:scale-95"
                    >
                      <FaMinus className="w-8 text-center text-amber-100 font-cinzel" />
                    </button>
                    <span className="w-8 text-center text-amber-100 font-cinzel">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-all duration-200 active:scale-95"
                    >
                      <FaPlus className="w-8 text-center text-amber-100 font-cinzel" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-amber-900/40 px-3 py-1 rounded-full font-cinzel text-xs uppercase transition-all duration-300 hover:bg-amber-800/50 flex items-center gap-1 active:scale-95"
                    >
                      <FaTrash className="w-4 h-4 text-amber-100" />
                      <span className="text-amber-100">Remove</span>
                    </button>

                    <div className="text-sm font-dancingscript text-amber-300">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-amber-800/30 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link
                  to="/menu"
                  className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/50 transition-all duration-300 text-amber-100 inline-flex items-center gap-2 active:scale-95 hover:gap-3"
                >
                  <span>Continue Shopping</span>
                </Link>

                <div className="flex items-center gap-8">
                  <h2 className="text-3xl font-dancingscript text-amber-100">
                    Total: {formatPrice(totalPrice)}
                  </h2>
                  <button className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/50 transition-all duration-300 text-amber-100 flex items-center gap-2 active:scale-95 ">
                    <span>Checkout Now</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/40 bg-opacity-75 backdrop-blur-xl p-4 overflow-auto" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-full max-h-full">
            <img src={selectedImage} alt="Full View" className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"  />

            <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-amber-900/80 rounded-full p-2 text-black hover:bg-amber-800/90 transition-transform duration-200 active:scale-90">
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;
