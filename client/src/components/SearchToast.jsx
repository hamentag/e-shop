// src/components/SearchToast.jsx
import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useOverlay from "../hooks/useOverlay";


export default function SearchToast() {
  const toastRef = useRef(null);
  const [toastInstance, setToastInstance] = useState(null);
  const [searchValue, setSearchValue] = useState('');

    const { showOffcanvas, hideOffcanvas } = useOverlay();
    const navigate = useNavigate();
    const inputRef = useRef(null);


  useEffect(() => {
    if (toastRef.current) {
      const toast = new window.bootstrap.Toast(toastRef.current, {
        autohide: false,
      });
      setToastInstance(toast);
    }
  }, []);

  const showToast = () => {
    toastInstance?.show();
    // Focus input 
    setTimeout(() => {
    inputRef.current?.focus();
  }, 200); 
  };


  return (
    <div>
      {/* Trigger Button */}
      <div onClick={showToast} style={{ cursor:'pointer'}} className="search-nav d-block d-sm-none">
        <span><i className="bi bi-search fs-5"></i></span>
      </div>

      {/* Toast */}
      <div
        className="search-toast position-fixed top-25 start-0 w-100"
        style={{ zIndex: 1055 }}
      >
        <div
          ref={toastRef}
          className="toast w-75 mx-auto"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Search</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            <form className="d-flex flex-column gap-2" 
                onSubmit={(e) => { 
                    e.preventDefault(); 
                    hideOffcanvas(); 
                    navigate(`/products/search/${searchValue}`);
                    setSearchValue('')
                    toastInstance?.hide();
                    }
                }
             >
              <input
                ref={inputRef}
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit" className="btn act-btn w-100">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}