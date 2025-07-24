
// src/contexts/SearchContext.js

import { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI, userAPI } from '../api';
import useOverlay from '../hooks/useOverlay';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {

  const [searchParam, setSearchParam] = useState('')

  const navigate = useNavigate();
  const location = useLocation();

  const returnPath = useRef(null);


  useEffect(() => {
    const isInputEmpty = searchParam.trim() === "";

    if (!isInputEmpty && location.pathname !== "/products/all") {
      navigate("/products/all");
    }

  }, [searchParam]);

  useEffect(() => {
    if (location.pathname !== '/products/all' && searchParam.trim() !== '') {
      setSearchParam('');
    }
  }, [location.pathname]);



  return (
    <SearchContext.Provider value={{
      searchParam, setSearchParam
    }}>
      {children}
    </SearchContext.Provider>
  );
};

////