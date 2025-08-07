// src/components/Navbar.jsx

import { useRef, useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import NavAccount from './NavAccount';
import NavCart from './NavCart';
import MenuButton from './MenuButton';
import SearchToast from './SearchToast';

//////
export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav
            className="navbar fixed-top b shadow-sm px-2 px-md-3 pt-2 bg-white rounded"
            data-bs-theme="light"
        >
            <div className="container-fluid d-flex flex-nowrap align-items-center">
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
                        <span><i className="bi bi-search fs-5 px-1 w-100" style={{ color: '#a3a3a3' }}></i></span>
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