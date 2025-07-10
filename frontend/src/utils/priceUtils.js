/**
 * Format a numeric price value to Nigerian Naira display format
 * @param {number} price - The numeric price value
 * @returns {string} - Formatted price string (e.g., "₦2,800")
 */
export const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "₦0";
  }

  return `₦${price.toLocaleString()}`;
};

/**
 * Parse a price string back to numeric value (utility function)
 * @param {string} priceString - Price string with currency symbols
 * @returns {number} - Numeric price value
 */
export const parsePrice = (priceString) => {
  if (typeof priceString === "number") return priceString;
  return parseFloat(priceString.replace(/[₦,]/g, "")) || 0;
};
