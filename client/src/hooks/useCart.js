// src/hooks/useCart.js

import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

export default function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
