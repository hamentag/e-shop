// src/hooks/useProduct.js

import { useContext } from 'react';
import { ProductContext } from '../contexts/ProductContext';

export default function useProduct() {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProduct must be used inside ProductProvider");
  return context;
}
