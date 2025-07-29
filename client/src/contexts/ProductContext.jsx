// src/contexts/ProductContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { productAPI } from '../api';
import useAuth from '../hooks/useAuth';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    // const { setMsg } = useOverlay();
  const { auth } = useAuth();

  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [fl, setFl] = useState();

  
  // Get all products
  const getProducts = async () => {
      try {
        const data = await productAPI.fetchProducts();
        setProducts(data); //
        setIsLoading(false); //
        return data
      } catch (err) {
        console.error('Fetch products error:', err.message);
      }
    };

  useEffect(() => {
    getProducts();
  }, []);

  
  // Get products by category
  const getProductsByCategory = async (categoryId) => {
    try {
      const data = await productAPI.fetchProductsByCategory(categoryId);
      // setProducts(data);
      setIsLoading(false); //
      return data
    } catch (err) {
      console.error('Fetch products error:', err.message);
    }
  };


  // Create product
  const createProduct = async (newProductData) => {
    const formData = new FormData();

    Object.entries(newProductData).forEach(([key, value]) => {
      if (key !== 'submittedImages') {
        formData.append(key, value);
      } else {
        value.forEach((item, i) => {
          formData.append('images', item.file);
          formData.append(`caption[${i}]`, item.caption);
          formData.append(`is_showcase[${i}]`, item.is_showcase);
        });
      }
    });

    try {
      const token = localStorage.getItem('token');
      const created = await productAPI.createProduct(auth.id, formData, token);
      setProducts(prev => [created, ...prev]);
      // setMsg({ txt: 'Product created!' });
    } catch (err) {
      console.error(err.message);
      // setMsg?.({ txt: err.message });
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const deleted = await productAPI.deleteProduct(id, token);

      setProducts(prev => prev.filter(p => p.id !== id));
      setRefreshCart?.(prev => !prev); // optional
      // setMsg({
      //   txt: `${deleted.title} deleted.`,
      //   more: <button onClick={() => setMsg(null)}>OK</button>
      // });
    } catch (err) {
      console.error(err.message);
      // setMsg?.({ txt: err.message });
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      isLoading,
      getProducts, 
      getProductsByCategory,
      createProduct,
      deleteProduct,
      category,
      setCategory,
      fl,
      setFl
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export default function useProduct() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProduct must be used within a ProductProvider');
  return context;
}
