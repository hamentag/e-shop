// src/contexts/CartContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { cartAPI } from '../api';
import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';


export const CartContext = createContext();


export const CartProvider = ({ children }) => {
    const { setMsg } = useOverlay();
    const { auth, guest, setGuest } = useAuth();
    const [cart, setCart] = useState(null);
    const [refreshCart, setRefreshCart] = useState(false);

    // Add to cart (used during guest->user merge or normal actions)
    const addToCart = async (product_id, qty) => {
        try {
            if (auth.id) {
                const token = localStorage.getItem('token');
                await cartAPI.addToUserCart(auth.id, product_id, qty, token);
            } else if (guest.id) {
                await cartAPI.addToGuestCart(guest.id, product_id, qty);
            }
            setRefreshCart(prev => !prev);
        } catch (err) {
            console.error(err.message);
            setMsg?.({
                txt: 'Failed to add item to cart.',
                more: <button onClick={() => setMsg(null)}>OK</button>,
            });
        }
    };

    // Fetch cart & merge guest cart into user cart on login
    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (auth.id) {
                    const token = localStorage.getItem('token');
                    const userCart = await cartAPI.fetchUserCart(auth.id, token);

                    // Merge guest cart
                    if (guest.id && cart?.products?.length) {
                        for (const item of cart.products) {
                            const exists = userCart.products.find(p => p.product_id === item.product_id);
                            if (!exists) {
                                await addToCart(item.product_id, item.qty);
                            }
                        }
                        setGuest({});
                    }

                    setCart(userCart);
                } else if (guest.id) {
                    const guestCart = await cartAPI.fetchGuestCart(guest.id);
                    setCart(guestCart);
                }
            } catch (err) {
                console.error('Error fetching cart:', err.message);
                setMsg?.({
                    txt: 'Something went wrong while loading the cart.',
                    more: <button onClick={() => setMsg(null)}>OK</button>,
                });
            }
        };

        fetchCart();
    }, [auth, guest, refreshCart]);

    // Update item quantity
    const updateCart = async (product_id, qty) => {
        try {
            if (auth.id) {
                const token = localStorage.getItem('token');
                await cartAPI.updateUserCart(auth.id, product_id, qty, token);
            } else if (guest.id) {
                await cartAPI.updateGuestCart(guest.id, product_id, qty);
            }
            setRefreshCart(prev => !prev);
        } catch (err) {
            console.error(err.message);
            setMsg?.({
                txt: err.message,
                more: <button onClick={() => setMsg(null)}>OK</button>,
            });
        }
    };

    // Remove item
    const removeFromCart = async (productId) => {
        try {
            if (auth.id) {
                const token = localStorage.getItem('token');
                await cartAPI.removeFromUserCart(auth.id, productId, token);
            } else if (guest.id) {
                await cartAPI.removeFromGuestCart(guest.id, productId);
            }
            setRefreshCart(prev => !prev);
        } catch (err) {
            console.error(err.message);
            setMsg?.({
                txt: err.message,
                more: <button onClick={() => setMsg(null)}>OK</button>,
            });
        }
    };


    return (
        <CartContext.Provider value={{
            cart,
            setCart,
            refreshCart,
            setRefreshCart,
            addToCart,
            updateCart,
            removeFromCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
