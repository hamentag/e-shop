// BrandsContext.jsx


// src/contexts/AuthContext.js

import { createContext, useState, useEffect } from 'react';
import { brandsAPI } from '../api';

export const BrandsContext = createContext();

export const BrandsProvider = ({ children }) => {
    const [topBrands, setTopBrands] = useState([]);

    // Fetch top brands
    useEffect(() => {
        const getTopBrands = async () => {
            try {
                const data = await brandsAPI.fetchTopBrands();
                setTopBrands(data);
                console.log("data from brandsApi: ", data)
            } catch (err) {
                console.error('Fetch top brands error:', err.message);
            }
        };
        getTopBrands();
        console.log("topBrn,,: ", topBrands)
    }, []);


    return (
        <BrandsContext.Provider value={{
            topBrands
        }}>
            {children}
        </BrandsContext.Provider>
    );
};

////