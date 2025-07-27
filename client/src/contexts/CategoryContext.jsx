// src/contexts/CategoryContext.js

import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../api';
import useOverlay from '../hooks/useOverlay';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState({});

     // Fetch categories 
      useEffect(() => {
          const getCategories = async () => {
              try {
                  const data = await categoryAPI.fetchCategories();
                  setCategories(data);
              } catch (err) {
                  console.error('Fetch categories error:', err.message);
              }
          };
          
          getCategories();
      }, []);
 
  

    return (
      <CategoryContext.Provider value={{
       categories, setCategories
      }}>
        {children}
      </CategoryContext.Provider>
    );
  };
  
  ////