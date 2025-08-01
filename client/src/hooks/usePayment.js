// src/hooks/usePayment.js

import { useContext } from 'react';
import { PaymentContext } from '../contexts/PaymentContext';

export default function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayment must be used inside PaymentProvider");
  return context;
}
