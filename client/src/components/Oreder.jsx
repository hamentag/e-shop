
// src/components/Oreder.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import useOrders from '../hooks/useOrders';
import usePayment from '../hooks/usePayment';

import { isRecent } from '../utils/timeUtils';

export default function Order() {
  const { auth } = useAuth();
  const { fetchOrder } = useOrders();
  const { retrievePayment } = usePayment();

  const [currOrder, setCurrOrder] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [charge, setCharge] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const order = await fetchOrder(orderId, { signal: controller.signal });
        setCurrOrder(order);

        if (order?.payment_intent_id) {
          try {
            const { paymentIntent, charge } = await retrievePayment(order.payment_intent_id);
            setPaymentIntent(paymentIntent);
            setCharge(charge);
            console.log("Stripe paymentIntent:", paymentIntent);
            console.log("Stripe charge:", charge);
          } catch (err) {
            setPaymentError('Could not retrieve full payment details from Stripe');
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Order fetch failed:", err);
        }
      }
    };

    if (orderId) fetchData();

    return () => {
      controller.abort();
    };
  }, [orderId]);

  // while currOrder is not fetched
  if (!currOrder) {
    return (
        <div className="d-flex justify-content-center my-5">
            <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading order details...</span>
            </div>
        </div>
    );
  }

  const isNewOrder = isRecent(currOrder.created_at, 15);

  return (
    <div className="text-center my-5">
      {isNewOrder ? (
        <h1 className="mb-4">Thank you for your order, {auth.firstname}</h1>
      ) : (
        <h1 className="mb-4">Order Summary</h1>
      )}

      <div><strong>Order ID:</strong> {orderId}</div>
      <div><strong>Status:</strong> {currOrder.status}</div>
      <div><strong>Date:</strong> {new Date(currOrder.created_at).toLocaleString()}</div>

      <hr className="my-4" />

      <h4>Items Purchased ({currOrder.items_count})</h4>
      <div className="row justify-content-center">
        {currOrder.items.map((item, idx) => (
          <div key={idx} className="col-md-6 my-2">
            <div className="card d-flex flex-row p-2 align-items-center">
              <img
                src={item.url}
                alt={item.product_name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem' }}
              />
              <div className="text-start">
                <div><strong>{item.product_name}</strong></div>
                <div>Quantity: {item.qty}</div>
                <div>Price: ${item.price.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-4" />

      <h4>Payment Info</h4>
      <p><strong>Status:</strong> {paymentIntent?.status ?? 'Unavailable'}</p>
      <p><strong>Card:</strong> {charge?.payment_method_details?.card?.brand?.toUpperCase()} •••• {charge?.payment_method_details?.card?.last4}</p>
      <p><strong>Billing:</strong> {charge?.billing_details?.name}</p>
      <p><strong>Billing Email:</strong> {charge?.billing_details?.email}</p>

      <p>
        <strong>Receipt:</strong>{' '}
        {
          charge?.receipt_url
            ? <a href={charge.receipt_url} target="_blank">View</a>
            : currOrder?.receipt_url
              ? <a href={currOrder.receipt_url} target="_blank">View</a>
              : <em>Awaiting confirmation…</em>
        }
      </p>

      <button className="btn btn-success mt-4" onClick={() => navigate('/orders')}>
        See Order History
      </button>
    </div>
  );
}
