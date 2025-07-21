import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { apiServices } from "../lib/services";
import { authService } from "../lib/services/authService";
import { cartService } from "../lib/services/cartService";
import { toast } from "sonner";

const CartContext = createContext();

// REDUCER HANDLING CART ACTIONS
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART": {
      return action.payload;
    }
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
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();

  // Load cart from backend when user logs in
  const loadBackendCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await cartService.getCart();

      if (response.success && response.data?.items) {
        // Transform backend cart items to match frontend format
        const transformedItems = response.data.items.map((item) => ({
          id: item.product._id || item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
          ...item.product, // Include other product properties
        }));

        dispatch({ type: "SET_CART", payload: transformedItems });
      }
    } catch (error) {
      console.error("Error loading backend cart:", error);
      toast.error("Failed to load cart from server");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Sync local cart to backend when user logs in
  const syncLocalCartToBackend = useCallback(async () => {
    if (!isAuthenticated || cartItems.length === 0) return;

    try {
      setSyncing(true);

      // Clear backend cart first
      await cartService.clearCart();

      // Add each local cart item to backend
      for (const item of cartItems) {
        await cartService.addToCart(item.id, item.quantity);
      }

      // Reload backend cart to get updated data
      await loadBackendCart();

      toast.success("Cart synced successfully");
    } catch (error) {
      console.error("Error syncing cart to backend:", error);
      toast.error("Failed to sync cart to server");
    } finally {
      setSyncing(false);
    }
  }, [isAuthenticated, cartItems, loadBackendCart]);

  // Load backend cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadBackendCart();
    }
  }, [isAuthenticated, loadBackendCart]);

  // PERSIST CART TO LOCAL STORAGE (for guest users or backup)
  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

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
  const addToCart = useCallback(
    async (item, quantity) => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await cartService.addToCart(item.id, quantity);

          if (response.success) {
            // Update local state to match backend
            await loadBackendCart();
            toast.success(`${item.name} added to cart`);
          } else {
            throw new Error(response.message || "Failed to add item to cart");
          }
        } catch (error) {
          console.error("Error adding to cart:", error);
          toast.error("Failed to add item to cart");
          // Fallback to local update if backend fails
          dispatch({ type: "ADD_ITEM", payload: { item, quantity } });
        } finally {
          setLoading(false);
        }
      } else {
        // Local cart for guest users
        dispatch({ type: "ADD_ITEM", payload: { item, quantity } });
        toast.success(`${item.name} added to cart`);
      }
    },
    [isAuthenticated, loadBackendCart]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await cartService.removeFromCart(itemId);

          if (response.success) {
            // Update local state to match backend
            await loadBackendCart();
            toast.success("Item removed from cart");
          } else {
            throw new Error(
              response.message || "Failed to remove item from cart"
            );
          }
        } catch (error) {
          console.error("Error removing from cart:", error);
          toast.error("Failed to remove item from cart");
          // Fallback to local update if backend fails
          dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
        } finally {
          setLoading(false);
        }
      } else {
        // Local cart for guest users
        dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
        toast.success("Item removed from cart");
      }
    },
    [isAuthenticated, loadBackendCart]
  );

  const updateItemQuantity = useCallback(
    async (itemId, newQuantity) => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await cartService.updateCartItem(
            itemId,
            newQuantity
          );

          if (response.success) {
            // Update local state to match backend
            await loadBackendCart();
          } else {
            throw new Error(
              response.message || "Failed to update item quantity"
            );
          }
        } catch (error) {
          console.error("Error updating cart item:", error);
          toast.error("Failed to update item quantity");
          // Fallback to local update if backend fails
          dispatch({
            type: "UPDATE_QUANTITY",
            payload: { itemId, newQuantity },
          });
        } finally {
          setLoading(false);
        }
      } else {
        // Local cart for guest users
        dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, newQuantity } });
      }
    },
    [isAuthenticated, loadBackendCart]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const response = await cartService.clearCart();

        if (response.success) {
          dispatch({ type: "CLEAR_CART", payload: {} });
          toast.success("Cart cleared");
        } else {
          throw new Error(response.message || "Failed to clear cart");
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Failed to clear cart");
        // Fallback to local clear if backend fails
        dispatch({ type: "CLEAR_CART", payload: {} });
      } finally {
        setLoading(false);
      }
    } else {
      // Local cart for guest users
      dispatch({ type: "CLEAR_CART", payload: {} });
      toast.success("Cart cleared");
    }
  }, [isAuthenticated]);

  // Alias for backward compatibility
  const updateQuantity = updateItemQuantity;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        updateQuantity: updateItemQuantity, // Alias for backward compatibility
        clearCart,
        cartTotal,
        totalItems: formatTotalItems(totalItemsCount),
        loading,
        syncing,
        loadBackendCart,
        syncLocalCartToBackend,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
