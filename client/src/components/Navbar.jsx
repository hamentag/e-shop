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
import NavCart from '../components/NavCart';
import MenuButton from '../components/MenuButton';


export default function Navbar() {
    const navigate = useNavigate();

    const { auth, logout } = useAuth()
    const { cart } = useCart()

    const { showOffcanvas, hideOffcanvas } = useOverlay();

    const { launchSignUpForm, launchLoginForm } = useAuthUI()




    return (
        <nav
            className="navbar fixed-top b shadow-sm p-0 pt-1 bg-white rounded"
            data-bs-theme="light"
        >
            <div className="container-fluid d-flex flex-nowrap align-items-center">
                <div className="navbar-brand flex-shrink-1 py-0" >
                  <Link to={'/'}>E-Shop</Link>
                </div>    

                <form
                    className="d-flex flex-grow-1 mx-1 p-0"
                    role="search"
                    onSubmit={(e) => e.preventDefault()}
                    >
                    <div className="input-group search-group">
                        <Link to={'/products/all'} className="btn btn-outline-secondary btn-sm py-0">All</Link>
                        <input
                            className="form-control py-0 no-outline"
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

                {/* //////CART///// */}
                <NavCart />
               
                {/* Menu burger */}
                <MenuButton />
                {/* <button
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
                </button> */}

            </div>
        </nav>
    )
}