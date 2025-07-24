// src/components/CartOverview.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useOverlay from '../hooks/useOverlay';
import useCart from '../hooks/useCart';

import CartQtyCtrl from '../components/CartQtyCtrl';



export default function CartOverview() {
    const { cart, updateCart, removeFromCart } = useCart();

    const navigate = useNavigate();


    if (!cart) {
        return <section className="loading">Loading..</section>
    }

    return (
        <>
            {cart.cart_count === 0 ? (
                 <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <button onClick={() => { navigate('/products/all') }}>Shop Now</button>
                </div>
            ) : (
                <div>
                    <div>
                        <div>Subtotal ({cart.cart_count} items): ${cart.subtotal}</div>
                        <button onClick={() => { navigate('/checkout') }}>Proceed to checkout</button>
                    </div>
                    <ul>
                        {cart.products.map(item => {
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
                                                    {/* Description */}
                                                    <p className="card-text small text-muted mb-1">{item.characteristics}</p>


                                                    {/* Title */}
                                                    <h5 
                                                        className="card-title mb-1"
                                                        onClick={()=>{navigate(`/${item.product_id}`)}}
                                                    >{item.title}</h5>

                                                    {/* Price */}
                                                    <div className="text-primary small fw-semibold">${item.price} / ea</div>

                                                    <div>

                                                        <p className="card-text"><small className="text-body-secondary">
                                                            {item.inventory > 0 ?
                                                                item.inventory <= 5 ?
                                                                    <span style={{ color: "red" }}>Only {item.inventory} left</span>
                                                                    : <span>In Stock</span>
                                                                : <span>Out of Stock</span>
                                                            }
                                                        </small></p>
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
        </>
    )
}