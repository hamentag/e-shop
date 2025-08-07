// src/components/Navbar.jsx

import { useRef, useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useAuthUI from '../hooks/useAuthUI';
import useCart from '../hooks/useCart';
import useOverlay from "../hooks/useOverlay";

import CartOverview from '../components/CartOverview';
import NavbarMenu from '../components/NavbarMenu';
import NavAccount from '../components/NavAccount';
import NavCart from '../components/NavCart';
import MenuButton from '../components/MenuButton';


const SearchToast = () => {
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
      {/* Trigger Button (mobile only) */}
      <div  onClick={showToast} style={{ cursor:'pointer'}}  className="d-block d-sm-none">
        <span><i className="bi bi-search fs-5 w-100"></i></span>
      </div>

      {/* Toast (mobile styled) */}
      <div
        className="search-toast position-fixed top-0 start-0 w-100 p-3"
        style={{ zIndex: 1055 }}
      >
        <div
          ref={toastRef}
          className="toast w-100"
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
};


//////
export default function Navbar() {
    const navigate = useNavigate();

    const { auth, logout } = useAuth()
    const { cart } = useCart()

    const { showOffcanvas, hideOffcanvas } = useOverlay();

    const { launchSignUpForm, launchLoginForm } = useAuthUI()




    return (
        <nav
            className="navbar fixed-top b shadow-sm px-2 px-md-3 pt-2 bg-white rounded"
            data-bs-theme="light"
        >
            <div className="container-fluid d-flex flex-nowrap align-items-end">
                <div className="navbar-brand flex-shrink-1 py-0" >
                  <Link to={'/'}>E-Shop</Link>
                </div>

                <form
                    className="d-flex flex-grow-1 mx-1 p-0 d-none d-sm-block main-srch"
                    role="search"
                    onSubmit={(e) => e.preventDefault()}
                    >
                    <div className="input-group search-group">
                        <Link to={'/products/all'} className="btn btn-outline-secondary btn-sm py-1"><strong>All</strong></Link>
                        <input
                            className="form-control py-1 no-outline w-75"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            onChange={(e) => {
                                const value = e.target.value.trim();
                                if (value) {
                                navigate(`/products/search/${value}`);
                                } else {
                                navigate(`/products/all`);
                                }
                            }}
                        />
                    </div>
                </form>
              

                <SearchToast className="mx-0 px-1 d-block d-sm-none"/>


               
                <NavAccount />        

                {/* //////CART///// */}
                <NavCart />
               
                {/* Menu burger */}
                <MenuButton />
                
            </div>
        </nav>
    )
}