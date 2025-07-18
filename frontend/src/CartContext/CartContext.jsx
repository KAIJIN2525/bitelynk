import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CartContext = createContext();

// REDUCER HANDLING CART ACTIONS
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload;
      const existingItem = state.find((i) => i.id === item.id);
      if (existingItem) {
        return state.map((i) => (i.id === item.id ? { ...i, quantity } : i));
      }
      return [...state, { ...item, quantity }];
    }
    case "REMOVE_ITEM": {
      return state.filter((i) => i.id !== action.payload.itemId);
    }
    case "UPDATE_QUANTITY": {
      const { itemId, newQuantity } = action.payload;
      return state.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(1, newQuantity) } : i
      );
    }
    case "CLEAR_CART": {
      return [];
    }
    default:
      return state;
  }
};

// INITIALIZE CART FROM LOCAL STORAGE
const initializer = () => {
  if (typeof window !== "undefined") {
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : [];
  }
  return [];
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
  // PERSIST CART TO LOCAL STORAGE

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // CALCULATE COST AND TOTAL ITEMS IN CART
  const cartTotal = cartItems.reduce((total, item) => {
    console.log(
      "Cart item:",
      item.name,
      "Price:",
      item.price,
      "Type:",
      typeof item.price,
      "Quantity:",
      item.quantity
    );
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[₦,]/g, ""))
        : item.price;
    return total + price * item.quantity;
  }, 0);
  const totalItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // FORMAT TOTAL ITEMS IN POWER FORM
  const formatTotalItems = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num;
  };

  // DISPATCHER WRAPPED IN CALLBACK FOR PERFORMANCE
  const addToCart = useCallback((item, quantity) => {
    dispatch({ type: "ADD_ITEM", payload: { item, quantity } });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  }, []);

  const updateItemQuantity = useCallback((itemId, newQuantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, newQuantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART", payload: {} });
  }, []);

  // Alias for backward compatibility
  const updateQuantity = updateItemQuantity;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        updateQuantity, // Alias for backward compatibility
        clearCart,
        cartTotal,
        totalItems: formatTotalItems(totalItemsCount),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
