import { useEffect, useState } from 'react';
import { orderAPI } from '../api';

export default function useOrders({ auth, setMsg, setRefreshCart }) {
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
        setMsg?.({ txt: 'Unable to fetch orders.' });
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
      setMsg?.({ txt: 'Failed to create order.' });
    }
  };

  return {
    orders,
    createOrder,
    refreshOrders,
    setRefreshOrders
  };
}
