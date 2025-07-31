// src/components/CartQtyCtrl.jsx

import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useOrders from '../hooks/useOrders';


export default function CartQtyCtrl({item}){

    const { cart, updateCart, removeFromCart } = useCart();

    const { showActionToast, closeActionToast } = useOverlay();
   
  
    return (
       <>
        {item && (
            <div className="qty-control d-flex justify-content-between align-items-center border rounded-pill py-0 px-0 px-md-1 px-lg-2 bg-light w-100"
              style={{ maxWidth: '10rem', margin: '0 auto' }}
             >
            {item.qty > 1 ? ( 
                <button
                    className="btn btn-sm btn-link text-dark px-2 m-0"
                        onClick={async () => {                
                    updateCart(item.product_id, item.qty - 1)
                    }}
                    disabled={ item.inventory === 0 }
                    style={{ textDecoration: 'none' }}
                >
                <span><i className="bi bi-dash-circle fs-5 fs-md-4 fs-lg-3"></i></span>
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
                <span><i className="bi bi-trash fs-5 fs-md-4 fs-lg-3"></i></span>
                </button>
            )}

            <span className="mx-2 fw-semibold">{item.qty}</span>

            <button
                className="btn btn-sm btn-link text-dark px-2 m-0"
                onClick={async () => {
                    try {
                        await updateCart(item.product_id, item.qty + 1);
                    } catch (err) {
                        await showActionToast(err.message,
                        );
                    }
                }}
                disabled={ item.inventory === 0 }
                style={{ textDecoration: 'none' }}
            >
                <span><i className="bi bi-plus-circle fs-5 fs-md-4 fs-lg-3"></i></span>
            </button>
        </div>       
        )}
       </> 
    )
}