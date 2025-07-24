// src/components/Navbar.jsx

import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useAuthUI from '../hooks/useAuthUI';
import useSearch from "../hooks/useSearch";
import useCart from '../hooks/useCart';
import useOverlay from "../hooks/useOverlay";

import CartOverview from '../components/CartOverview';
import NavbarMenu from '../components/NavbarMenu';
import NavAccount from '../components/NavAccount';


export default function Navbar() {
    const navigate = useNavigate();

    const { searchParam, setSearchParam } = useSearch()

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
                        value={searchParam}
                        onChange={(e) => setSearchParam(e.target.value)}
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

             

                {/* <div
                    className="offcanvas offcanvas-end"
                    tabIndex="0"
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                >
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                            Offcanvas
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">Something else here</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <form className="d-flex mt-3" role="search" onSubmit={handleSearchSubmit}>
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search"
                                aria-label="Search" 
                                value={searchParam}
                                onChange={(e) => setSearchParam(e.target.value)}
                            />
                            <button className="btn btn-outline-success" type="submit">
                                Search
                            </button>
                        </form>
                    </div>
                </div> */}

            </div>
        </nav>
    )
}