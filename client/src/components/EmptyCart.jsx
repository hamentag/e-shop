import React, { useState } from 'react';
import { EMPTY_IMAGES } from '../utils/constants';

const EmptyCart = () => {
  const [imgSrc] = useState(() => {
    const i = Math.floor(Math.random() * EMPTY_IMAGES.length);
    return `/${EMPTY_IMAGES[i]}`;
  });

  return (
    <div className="text-center">
      <img
        src={imgSrc}
        alt="Empty"
        className="img-fluid"
        style={{ maxWidth: '300px' }}
      />
      <h4>Your cart is empty</h4>
      <p>Why not add something you love?</p>
      <a href="/shop" className="btn act-btn mt-3">Continue Shopping</a>
    </div>
  );
};

export default EmptyCart;
