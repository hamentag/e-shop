import { useEffect, useState } from 'react';
import { productAPI } from '../api';

export default function useProducts({ auth, setMsg, setRefreshCart }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await productAPI.fetchProducts();
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Fetch products error:', err.message);
        setMsg?.({
          txt: "Oops! Unable to fetch product list.",
          more: <button onClick={() => setMsg(null)}>OK</button>
        });
      }
    };
    getProducts();
  }, []);

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
      setMsg({ txt: 'Product created!' });
    } catch (err) {
      console.error(err.message);
      setMsg?.({ txt: err.message });
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const deleted = await productAPI.deleteProduct(id, token);

      setProducts(prev => prev.filter(p => p.id !== id));
      setRefreshCart?.(prev => !prev); // optional
      setMsg({
        txt: `${deleted.title} deleted.`,
        more: <button onClick={() => setMsg(null)}>OK</button>
      });
    } catch (err) {
      console.error(err.message);
      setMsg?.({ txt: err.message });
    }
  };

  return {
    products,
    isLoading,
    createProduct,
    deleteProduct
  };
}
