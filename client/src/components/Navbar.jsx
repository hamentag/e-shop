// src/components/Navbar.jsx

import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useAuthUI from '../hooks/useAuthUI';
import useCart from '../hooks/useCart';
import useOverlay from "../hooks/useOverlay";

import CartOverview from '../components/CartOverview';
import NavbarMenu from '../components/NavbarMenu';
import NavAccount from '../components/NavAccount';


export default function Navbar() {
    const navigate = useNavigate();

    const { auth, logout } = useAuth()
    const { cart } = useCart()

    const { showOffcanvas, hideOffcanvas } = useOverlay();

    const { launchSignUpForm, launchLoginForm } = useAuthUI()


    //  useEffect (() => {
    //     console.log("tst")

    // }, [auth]);




    return (
        <nav
            className="navbar fixed-top b shadow-sm p-0 bg-white rounded"
            data-bs-theme="light"
        >
            <div className="container-fluid d-flex flex-nowrap align-items-center">
                <div className="navbar-brand flex-shrink-1 py-0" >
                  <Link to={'/'}>E-Shop</Link>
                </div>    

                <form
                    className="d-flex flex-grow-1 mx-1"
                    role="search"
                    onSubmit={(e) => e.preventDefault()}
                    >
                    <div className="input-group search-group">
                        <Link to={'/products/all'} className="btn btn-outline-secondary btn-sm">All</Link>
                        <input
                            className="form-control py-1 no-outline"
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
           
               
                <NavAccount />
        

                {/* ///////////////////CART////////////////////////// */}              
                < button className="btn flex-shrink-1 position-relative p-0 nav-btn"
                    onClick={() => {
                        showOffcanvas({
                            title: 'Shopping Cart',
                            content: <CartOverview />,
                        })
                    }}
                >
                    {/* cart-icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-cart2"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
                        />
                    </svg>
                    <span className="position-absolute top-0 start-75 translate-middle badge rounded-pill bg-danger">
                        {cart? cart.cart_count : ''}
                        <span className="visually-hidden">unread messages</span>
                    </span>
                </button>


                {/* Menu burger */}
                <button
                    className="navbar-toggler flex-shrink-1 p-0"
                    type="button"
                    // data-bs-toggle="offcanvas"
                    // data-bs-target="#offcanvasNavbar"
                    // aria-controls="offcanvasNavbar"
                    // aria-label="Toggle navigation"

                    onClick={() => {
                        showOffcanvas({
                            title: 'Menu',
                            content: <NavbarMenu />,
                                        })
                                    }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

            </div>
        </nav>
    )
}