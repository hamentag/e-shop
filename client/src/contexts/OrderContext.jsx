// src/contexts/OrderContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { orderAPI } from '../api';
import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    // const { setMsg } = useOverlay();
    const { auth } = useAuth();
    const { setRefreshCart } = useCart();
    const [orders, setOrders] = useState([]);
    const [refreshOrders, setRefreshOrders] = useState(false);


    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await orderAPI.fetchOrders(auth.id, token);
                setOrders(data);
            } catch (err) {
                console.error('Fetch orders error:', err.message);
                // setMsg?.({ txt: 'Unable to fetch orders.' });
            }
        };

        if (auth.id) {
            fetchOrders();
        }
    }, [auth, refreshOrders]);

    // Create order
    const createOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const newOrders = await orderAPI.createOrder(auth.id, token);
            setOrders(prev => [...prev, ...newOrders]);
            setRefreshOrders(prev => !prev);
            setRefreshCart?.(prev => !prev);
        } catch (err) {
            console.error('Create order error:', err.message);
            // setMsg?.({ txt: 'Failed to create order.' });
        }
    };


    return (
        <OrderContext.Provider value={{
            orders,
            createOrder,
            refreshOrders,
            setRefreshOrders,
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export default function useOrders() {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrders must be used within an OrderProvider');
    return context;
}
