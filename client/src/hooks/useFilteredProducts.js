// src/hooks/useFilteredProducts.js
import { useEffect, useState } from 'react';
import useProduct from './useProduct';

export default function useFilteredProducts({ brand, category, searchKey }) {
  const { getProducts, getProductsByCategory, products } = useProduct();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);

      try {
        if (category) {
          const catProducts = await getProductsByCategory(category);
          setFilteredProducts(catProducts);
        } else if (brand) {
          // later replace with real API call:
          const filtered = products.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
          setFilteredProducts(filtered);
        } else if (searchKey) {
          const filtered = products.filter(p => p.title.toLowerCase().includes(searchKey.toLowerCase()));
          setFilteredProducts(filtered);
        } else {
          // default: all
          setFilteredProducts(products);
        }
      } catch (e) {
        console.error(e);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [brand, category, searchKey, products]);

  return { filteredProducts, loading };
}
