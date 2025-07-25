// src/hooks/useBrands.js

import { useContext } from 'react';
import { BrandsContext } from '../contexts/BrandsContext.jsx';

export default function useBrands() {
  const context = useContext(BrandsContext);
  if (!context) throw new Error("useBrands must be used inside BrandsProvider");
  return context;
}
