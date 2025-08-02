// StarRating.jsx

import React from 'react';

const StarRating = ({ rating, count }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const fill = Math.min(1, Math.max(0, rating - i));
    return (
      <div key={i} className="star position-relative">
        <span className="star-bg fs-5">★</span>
        <span className="star-fill fs-5" style={{ width: `${fill * 100}%` }}>★</span>
      </div>
    );
  });

  return (
    <div className='d-flex align-items-center gap-1'>
      <div className="star-rating d-flex pb-1">{stars}</div>
       {count && <small className="text-muted">({count})</small>}
    </div>
  )
};

export default StarRating;
