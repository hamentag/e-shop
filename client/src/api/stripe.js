// src/api/stripe.js

//
export const createPaymentIntent = async (amount) => {
  const res = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) {
    throw new Error('Failed to create payment intent');
  }

  const { clientSecret } = await res.json();
  return clientSecret;
};

//
export const retrievePaymentIntent = async (paymentIntentId) => {
  const res = await fetch(`/api/payment-intents/${paymentIntentId}`);

  if (!res.ok) {
    throw new Error('Failed to retrieve payment intent');
  }

  return res.json();
};
