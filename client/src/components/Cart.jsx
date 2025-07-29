// src/components/Cart.jsx

 

import useOverlay from '../hooks/useOverlay';
import useCart from '../hooks/useCart';


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

 
 

import CartQtyCtrl from '../components/CartQtyCtrl';


import { truncateText, formatPrice } from '../utils/formatters';


import useProduct from "../hooks/useProduct";



export default function Cart(){

    const { setMsg } = useOverlay();
    // const { cart, updateCart, removeFromCart } = useCart();

 
      const { cart, updateCart, removeFromCart } = useCart();
    
        const { products } = useProduct()
        const { hideOffcanvas } = useOverlay();
    
        const navigate = useNavigate();
    
    //
    if (!cart) {
        return <section className="loading">Loading..</section>
    }

    if (cart.cart_count === 0) {
        return (
              <div className="empty-cart">
                    <p>Your cart is empty!!!</p>
                    <button onClick={() => { navigate('/products/all') }}>Shop Now</button>
                </div>
        )
    }
    const [subTotDollars, subTotCents] = formatPrice(cart.subtotal?.toFixed(2));


    return(
          <div className="cart-details-lst mx-auto">
                    {/* Sticky subtotal + button */}
                    <div className="sticky-top bg-white z-3 border-bottom pt-5 pb-2 px-3">
                        <div className="d-grid gap-2 subtotal">
                            <strong className="fs-5">
                                Subtotal ({cart.cart_count} items): {' '} 
                                <span className="text-primary small fw-semibold">
                                    <span className=" ">$</span>
                                    <span className="fs-3">{subTotDollars}</span>
                                    <sup>{subTotCents}</sup>
                                </span>
                            </strong>            
        
                            <button
                                className="btn fw-semibold act-btn"
                                onClick={() => {navigate('/checkout'); hideOffcanvas()}}
                            >
                                Proceed to checkout
                            </button>
                        </div>
                    </div>
                    <ul className="mt-3 px-0">
                        {cart.products.map(item => {
                                const [dollars, cents] = formatPrice(item.price);
                            return (
                                <li key={item.id} >
                                    <div className="card mb-3">
                                        <div className="row g-0">
                                            {/* Left: Image + Qty Control */}
                                            <div className="col-md-4 d-flex flex-column justify-content-between align-items-center p-2">
                                                <img
                                                    src={(item.images.find(image => image.is_showcase)).url}
                                                    className="img-fluid rounded object-fit-cover mb-2"
                                                    alt="prd image"
                                                    style={{ maxHeight: '140px', objectFit: 'cover' }}
                                                    onClick={()=>{navigate(`/${item.product_id}`)}}
                                                />
        
                                                {/* Quantity Buttons */}
                                                <CartQtyCtrl item = { item }/>
        
                                            </div>
        
                                            {/* Right: Description, Title, Price */}
                                            <div className="col-md-8">
                                                <div className="card-body py-2 px-3 h-100 d-flex flex-column justify-content-between">
                                                    {/* Title */}
                                                    <h5 
                                                        className="card-title mb-1"
                                                        onClick={()=>{navigate(`/${item.product_id}`)}}
                                                    >{truncateText(item.title, 38)}
                                                    </h5>
        
                                                    {/* Description */}
                                                    <p className="card-text small text-muted mb-1">{truncateText(item.characteristics, 68)}</p>
        
                                                    {/* Price */}
                                                    <div className="text-primary small fw-semibold">
                                                        <span className="align-text-top">$</span>
                                                        <span className="fs-4">{dollars}</span>
                                                        <sup>{cents}</sup>
                                                        {/* <span className="ms-1 text-muted small">/ ea</span> */}
                                                    </div>
        
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="card-text"><small className="text-body-secondary">
                                                                {item.inventory > 0 ?
                                                                    item.inventory <= 5 ?
                                                                        <span style={{ color: "red" }}>Only {item.inventory} left</span>
                                                                        : <span>In Stock</span>
                                                                    : <span>Out of Stock</span>
                                                                }
                                                                </small>
                                                            </p>
                                                        </div>
                                                        <button className="btn btn-danger px-1 py-0 fw-bold"
                                                            onClick={() => { removeFromCart(item.product_id)}}
                                                            >Delete
                                                        </button>
                                                    </div>
        
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                        }
                    </ul>
        
                </div>
     )
}

