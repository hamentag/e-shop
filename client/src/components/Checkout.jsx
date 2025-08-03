// src/components/Checkout.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CardElement } from '@stripe/react-stripe-js';

import ShippingAddrForm from './ShippingAddrForm';
import Confirmation from './Oreder';
import OrderReview from './OrderReview';
import SuggestedForYou from './SuggestedForYou';
import RequireLogin from './RequireLogin';

import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useOrders from '../hooks/useOrders';
import usePayment from '../hooks/usePayment';
import EmptyView from './EmptyView';

import { US_STATES } from '../utils/constants';


export default function Checkout() {
    const { setPopUpAuthn } = useOverlay();
    const { auth } = useAuth();
    const { cart } = useCart();
    const { createOrder, updateOrderPayment } = useOrders();

    const [nameOnCard, setNameOnCard] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [confirmedOrder, setConfirmedOrder] = useState(false);

    const [formValidated, setFormValidated] = useState(false);
    const [formData, setFormData] = useState({
        firstName: 'Demo_FN',
        lastName: 'Demo_LN',
        email: 'test@example.com',
        address: '2505 John Bragg Hwy',
        city: 'Murfreesboro',
        state: US_STATES[0].name,
        zip: '37127',
        agree: false,
    });

    const { processPayment, paymentLoading, paymentError } = usePayment();
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setFormValidated(true);
            return;
        }

        setFormValidated(true);

        const billingDetails = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zip,
            },
        };

        const paymentResult = await processPayment({
            amount: Math.round(cart.total * 100), // Convert dollars to cents
            billingDetails,
        });

        if (paymentResult.success) {
            const order_collection_id = await createOrder();

            // Update DB order record with Stripe payment info
            await updateOrderPayment(order_collection_id, paymentResult.paymentIntent);         
            
            navigate(`/order/${order_collection_id}`);
        }
    };


    if (!cart) return <section className="text-center my-5">Loading..</section>;

    if (cart?.cart_count === 0) {
        return (
            <EmptyView title="Your cart is empty" message="Why not add something you love?"/>
        )
    }

    return (
        <div className='py-3 mx-1 mx-lg-auto' style={{ maxWidth: '55rem' }}>
            <h4 className="mt-4">Order Review</h4>
            <OrderReview />
            
            {!auth?.id ? (
                <RequireLogin />

            ) : (
              <form
                className={`row g-3 needs-validation ${formValidated ? 'was-validated' : ''}`}
                noValidate
                onSubmit={handleSubmit}
             >
                <ShippingAddrForm formData={formData} handleChange={handleChange} />

                <h4 className="mt-5">Payment Information</h4>
                <div className="col-12">
                    <label className="form-label">Card Details</label>
                    <div className="form-control">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#32325d',
                                        fontFamily: 'Arial, sans-serif',
                                    },
                                },
                            }}
                        />
                    </div>
                    <small className="text-muted">
                        Use test card: <code>4242 4242 4242 4242</code>, any future expiry, any CVC.
                    </small>
                </div>

                <div className="col-12 mt-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="agree"
                            checked={formData.agree}
                            onChange={handleChange}
                            required
                        />
                        <label className="form-check-label">Agree to terms and conditions</label>
                        <div className="invalid-feedback">You must agree before submitting</div>
                    </div>
                </div>

                {paymentError && (
                    <div className="col-12 mt-2">
                        <div className="alert alert-danger">{paymentError}</div>
                    </div>
                )}

                <div className="col-12">
                    <button className="btn btn-primary" type="submit" disabled={paymentLoading}>
                        {paymentLoading ? 'Processing...' : 'Submit Payment'}
                    </button>
                </div>
            </form>  
            )}

            
        </div>

    );
}
