// src/hooks/useSearch.js

import { useContext } from 'react';
import { SearchContext } from '../contexts/SearchContext';

export default function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used inside SearchProvider");
  return context;
}
