// src/components/LoginToast.jsx

import React, { useState, useRef, useEffect } from 'react';


export default function LoginToast() {
  const [show, setShow] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    let timeoutId;

    if (show && toastRef.current) {
      const toastEl = toastRef.current;
      const bsToast = new window.bootstrap.Toast(toastEl, {
        autohide: false,
      });
      bsToast.show();

      timeoutId = setTimeout(() => {
        bsToast.hide();
        setShow(false);
      }, 10000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [show]);

  return (
    <div className="position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 1055 }}>
      <button className="btn btn-primary mb-3" onClick={() => setShow(true)}>
        Show Login Toast
      </button>

      <div
        ref={toastRef}
        className={`toast ${show ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-body">
          Hello, world! This is a toast message.
          <div className="mt-2 pt-2 border-top">
            <button type="button" className="btn btn-primary btn-sm me-2">
              Take action
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShow(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
