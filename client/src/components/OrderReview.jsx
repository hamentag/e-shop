import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


import useCart from '../hooks/useCart';


export default function OrderReview() {
    const { cart } = useCart();

    return (
        <div className="pt-4">
            {cart.products.map(item => (
                <div
                    key={item.id}
                    className="order-details d-flex justify-content-between align-items-start border rounded p-3 mb-3"
                >
                    {/* Image */}
                    <img
                        src={item.images.find(image => image.is_showcase)?.url}
                        alt={item.title}
                        style={{ width: '65px', height: '55px', objectFit: 'cover' }}
                    />

                    {/* Title, Qty x Price */}
                    <div className="flex-grow-1 px-3">
                        <h6 className="mb-1">{item.title}</h6>
                        <div className="text-muted small">
                            Qty: {item.qty} x ${item.price}
                        </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-end fw-bold">
                        ${item.cost_per_product}
                    </div>
                </div>
            ))}


            {/* Totals Section */}
            <div className="d-flex justify-content-end order-total">
                <table className="table table-sm w-auto">
                    <tbody>
                        <tr>
                            <td>Order Subtotal</td>
                            <td><strong>${cart.subtotal}</strong></td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td><strong>${cart.tax}</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Order Total</strong></td>
                            <td className="text-danger"><strong>${cart.total}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    )
}



