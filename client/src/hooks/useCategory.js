// src/hooks/useCategory.js

import { useContext } from 'react';
import { CategoryContext } from '../contexts/CategoryContext.jsx';

export default function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategory must be used inside CategoryProvider");
  return context;
}
