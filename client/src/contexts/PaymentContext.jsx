// src/contexts/PaymentContext.jsx

import { createContext, useContext, useState } from 'react';
import { useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { stripeAPI } from '../api';
import { STRIPE_PUBLISHABLE_KEY } from '../utils/constants';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY) 

export const PaymentContext = createContext();

const InternalStripePaymentProvider = ({ children }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const processPayment = async ({ amount, billingDetails }) => {
    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    if (!stripe || !elements) {
      setPaymentError('Stripe not loaded');
      setPaymentLoading(false);
      return { success: false };
    }

    try {
      const clientSecret = await stripeAPI.createPaymentIntent(amount);  

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: billingDetails,
        },
      });

      if (result.error) {
        setPaymentError(result.error.message);
        setPaymentLoading(false);
        return { success: false };
      }

      if (result.paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        setPaymentLoading(false);
        return {
          success: true,
          paymentIntent: result.paymentIntent,
        };
      }
    } catch (err) {
      setPaymentError('Unexpected error occurred');
      setPaymentLoading(false);
      return { success: false };
    }
  };

  //
  const retrievePayment = async (paymentIntentId) => {
    try {
      return await stripeAPI.retrievePaymentIntent(paymentIntentId);
    } catch (err) {
      console.error('❌ Failed to retrieve payment data:', err);
      return null;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        processPayment,
        retrievePayment,
        paymentLoading,
        paymentError,
        paymentSuccess,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const PaymentProvider = ({ children }) => (
  <Elements stripe={stripePromise}>
    <InternalStripePaymentProvider>{children}</InternalStripePaymentProvider>
  </Elements>
);
