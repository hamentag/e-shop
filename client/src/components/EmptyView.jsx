// src/components/EmptyView.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useOverlay from '../hooks/useOverlay';
import { EMPTY_IMAGES } from '../utils/constants';

const EmptyView = ({ title, message, actionText, actionLink }) => {
  const { hideOffcanvas } = useOverlay();

  const [imgSrc] = useState(() => {
    const i = Math.floor(Math.random() * EMPTY_IMAGES.length);
    return `/${EMPTY_IMAGES[i]}`;
  });

  return (
    <div className="text-center py-4">
      <img
        src={imgSrc}
        alt="Empty state illustration"
        className="img-fluid mb-3"
        style={{ maxWidth: '300px' }}
      />
      <h4>{title}</h4>
      <p>{message}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn act-btn mt-3 mx-1">
          {actionText}
        </Link>
      )}
      <Link to='/products/all' className="btn act-btn mt-3 mx-1"
            onClick={hideOffcanvas}
       >
          Continue Shopping
      </Link>
    </div>
  );
};

EmptyView.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  actionLink: PropTypes.string,
};

export default EmptyView;
