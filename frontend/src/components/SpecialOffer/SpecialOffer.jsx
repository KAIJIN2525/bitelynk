import { FaStar, FaHeart, FaCartPlus, FaFire } from "react-icons/fa";
import { HiMinus, HiPlus } from "react-icons/hi";
import { useCart } from "../../CartContext/CartContext";
import {
  addButtonBase,
  addButtonHover,
  additionalData,
  cardData,
  commonTransition,
} from "../../assets/dummydata";
import { useEffect, useState } from "react";
import FloatingParticle from "../FloatingParticle/FloatingParticle";
import { formatPrice } from "../../utils/priceUtils";
import { specialOfferService } from "../../lib/specialOfferService";

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart();

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      setLoading(true);
      try {
        const res = await specialOfferService.getSpecialOffers();
        // Map _id to id, and ensure name and imageUrl are present
        const offers = (res.data || []).map((item) => ({
          ...item,
          id: item._id || item.id,
          name: item.name || item.title,
          image: item.imageUrl || item.image,
        }));
        setSpecialOffers(offers);
      } catch (error) {
        // Optionally show a toast or error
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialOffers();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(
      {
        ...item,
        id: item.id,
        name: item.name, // always use name
        price: item.price, // Already numeric
        image: item.image, // always use image
      },
      1
    );
  };

  const handleUpdateCart = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };

  return (
    <div className="bg-light-background text-text-primary py-16 px-4 font-poppins">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4 transform transition-all bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-playfair italic">
            Today's <span>Special</span> Offers
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto tracking-wide leading-relaxed">
            Savor the extraordinary with our exclusive daily specials. Each dish
            is crafted to perfection, bringing you a unique culinary experience
            that tantalizes your taste buds and warms your heart.
          </p>
        </div>

        {/* PRODUCT CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {(showAll ? specialOffers : specialOffers.slice(0, 4)).map(
            (item, index) => {
              const cartItem = cartItems.find((ci) => ci.id === item.id);
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="relative group bg-white rounded-3xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-500 hover:shadow-primary-dark/30 border-2 border-transparent hover:border-primary/20"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="flex items-center gap-2 text-primary">
                        <FaStar className="text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
                        <span className="font-bold">{item.rating}</span>
                      </span>
                      <span className="flex items-center gap-2 text-red-400">
                        <FaHeart className="text-xl animate-heartbeat" />
                        <span className="font-bold">{item.hearts}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6 relative z-10">
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-playfair italic">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary mb-5 text-sm leading-relaxed tracking-wide">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-2xl font-bold text-primary flex-1">
                        {formatPrice(item.price)}
                      </span>

                      {cartItem ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              quantity > 1
                                ? handleUpdateCart(cartItem.id, quantity - 1)
                                : handleRemoveFromCart(cartItem.id);
                            }}
                            className="w-8 h-8 rounded-full bg-primary-dark/20 flex items-center justify-center hover:bg-primary-dark/30 transition-all duration-100 active:scale-95"
                          >
                            <HiMinus />
                          </button>

                          <span className="w-8 text-center text-text-primary font-cinzel">
                            {quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleUpdateCart(cartItem.id, quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-primary-dark/20 flex items-center justify-center hover:bg-primary-dark/30 transition-all duration-100 active:scale-95"
                          >
                            <HiPlus className="w-4 h-4 text-text-primary" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center gap-2 bg-primary text-dark-accent px-4 py-2 rounded-full font-semibold hover:bg-primary-dark transition-all duration-300"
                        >
                          <FaCartPlus className="w-4 h-4" />
                          <span className="text-sm">Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent group-hover:border-primary/30 transition-all duration-500">
                    <div className="opacity-0 group-hover:opacity-100">
                      <FloatingParticle />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-dark-accent px-8 py-4 rounded-2xl font-bold text-lg uppercase tracking-wider hover:gap-4 hover:scale-105 hover:shadow-primary/20 transition-all duration-300 group border-2 border-primary/30 relative overflow-hidden group"
          >
            <FaFire className="w-6 h-6 animate-pulse" />
            <span>{showAll ? "Show Less" : "Show All"}</span>
            <div className="h-full w-1 bg-primary/30 absolute right-0 top-0 group-hover:animate-border-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
