// src/components/CartQtyCtrl.jsx

import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useOrders from '../hooks/useOrders';


export default function CartQtyCtrl({item}){

    const { cart, updateCart, removeFromCart } = useCart();



    return (
       <>
        {item && (
            <div className="qty-control d-flex align-items-center border rounded-pill px-2 py-1 bg-light">
            {item.qty > 1 ? ( 
                <button
                    className="btn btn-sm btn-link text-dark px-2 m-0"
                        onClick={async () => {                
                    updateCart(item.product_id, item.qty - 1)
                    }}
                    disabled={ item.inventory === 0 }
                    style={{ textDecoration: 'none' }}
                >
                -
                </button>
            ) : (
                <button
                    className="btn btn-sm btn-link text-dark px-2 m-0"
                    onClick={async () => {                
                        removeFromCart(item.product_id)
                    }} 
                    disabled={ item.inventory === 0 }
                    style={{ textDecoration: 'none' }}
                >
                Del
                </button>
            )}

            <span className="mx-2 fw-semibold">{item.qty}</span>

            <button
                className="btn btn-sm btn-link text-dark px-2 m-0"
                onClick={async () => {
            updateCart(item.product_id, item.qty + 1)
                }}
                disabled={ item.inventory === 0 }
                style={{ textDecoration: 'none' }}
            >
                +
            </button>
        </div>       
        )}
       </> 
    )
}