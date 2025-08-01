// src/utils/formatters.js

export function truncateText(str, max) {
    if (str.length <= max) {
        return str;
    }
    return str.slice(0, max) + '...';
}

/**
 * Splits a number into [dollars, cents] with 2 fixed decimal places.
 * @param {number|string} price - The price value.
 * @returns {[string, string]} An array 
 */
export function formatPrice(price) {
  const [dollars, cents] = Number(price).toFixed(2).split('.');
  return [dollars, cents];
}
