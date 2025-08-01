// src/contexts/OrderContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { orderAPI } from '../api';
// import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';
// import useCart from '../hooks/useCart';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    // const { setMsg } = useOverlay();
    const { auth } = useAuth();
    // const { setRefreshCart } = useCart();
    const [orders, setOrders] = useState([]);
    const [refreshOrders, setRefreshOrders] = useState(false);

    const [orderCollectionId, setOrderCollectionId] = useState(null)

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await orderAPI.fetchOrders(auth.id, token);
                setOrders(data);
            } catch (err) {
                console.error('Fetch orders error:', err.message);
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
            const response = await orderAPI.createOrder(auth.id, token);
            const order_collection_id = response.order_collection_id; // return response.items too
            setRefreshOrders(prev => !prev);
            // setRefreshCart?.(prev => !prev);
            return order_collection_id;
        } catch (err) {
            console.error('Create order error:', err.message);
        }
    };

    //
    const updateOrderPayment = async (order_collection_id, paymentIntent) => {
        try {
            const token = localStorage.getItem('token');
            const response = await orderAPI.updateOrderPayment(order_collection_id, paymentIntent, token)
            return response
        } catch (err) {
            console.error('Update order payment error:', err.message);       
        }
    }

    //
    const fetchOrder = async (order_collection_id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await orderAPI.fetchOrder(order_collection_id, token)
            return response
        } catch (err) {
            console.error('Fetch order error:', err.message);
        }
    }
    


    return (
        <OrderContext.Provider value={{
            orders,
            createOrder, updateOrderPayment, fetchOrder,
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

