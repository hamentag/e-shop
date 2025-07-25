// src/components/NavbarMenu.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


import useSearch from "../hooks/useSearch";
import useCart from '../hooks/useCart';
import useOverlay from '../hooks/useOverlay';
import useProducts from "../hooks/useProducts";
import useAuth from "../hooks/useAuth";
import useAuthUI from "../hooks/useAuthUI";
import useBrands from '../hooks/useBrands';

import CartQtyCtrl from '../components/CartQtyCtrl';
import NavAccount from '../components/NavAccount';
import AccordionItem from '../components/AccordionItem';

import { selectCategories } from '../utils/selectCategories';



export default function NavbarMenu() {
    const { cart, updateCart, removeFromCart } = useCart();

    const { searchParam, setSearchParam } = useSearch();

    const { hideOffcanvas } = useOverlay();

    const { products } = useProducts();

    const { auth, logout } = useAuth();
    const { launchSignUpForm, launchLoginForm } = useAuthUI();
    const { topBrands } = useBrands();

    const categories = selectCategories(products)

    
    return (
        <div className="offcanvas-body nav-menu">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                    {/* <a className="nav-link active" aria-current="page" href="#">Home</a> */}
                    <Link to={'/'} className="nav-link" onClick={hideOffcanvas} >Home</Link>
                </li>

                <li className="nav-item">
                    <Link to={'/products/all'} className="nav-link" onClick={hideOffcanvas}>Shop All</Link>
                </li>

                {/* <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                </li> */}

                 <li><hr className="nav-divider my-4" /></li>
            </ul>

            
            {/* /// Account/// */}
              <div className="accordion accordion-flush" id="accordionExample">

                <AccordionItem title="Categories" id="itemOne" parentId="accordionExample">
                    <ul className="px-1 py-0">
                        {categories.map((category) => (
                            <li key={category}>
                                <Link
                                    to={`/products/categories/${category}`}
                                    className="dropdown-item"
                                    onClick={hideOffcanvas}
                                >
                                    {category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </AccordionItem>

                <AccordionItem title="Best Sellers" id="itemThree" parentId="accordionExample">
                    <ul className="list-unstyled">
                        {topBrands.map((brand) => (
                            <li key={brand.id} >
                                <Link to={`/products/brands/${brand.brand}`}
                                    className="dropdown-item"
                                    onClick={hideOffcanvas}
                                >
                                    {brand.brand}                                    
                                </Link>
                            </li>
                        ))}
                      {/* <li>Soemseller</li>
                       <li>SomeOtherseller</li> */}
                    </ul>
                </AccordionItem>

                <AccordionItem title="Account" id="itemTwo" parentId="accordionExample">
                    <ul className="list-unstyled">
                        {!auth.id ? (
                            <>
                                <li><button className='dropdown-item' onClick={launchLoginForm}>Log In</button></li>
                                <li><button className='dropdown-item' onClick={launchSignUpForm}>Sign Up</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link className='dropdown-item' to="/orders">Orders</Link></li>
                                <li><Link className='dropdown-item' to="/account">Profile</Link></li>
                                <li><button className='dropdown-item' onClick={logout}>Quit</button></li>
                            </>
                        )}
                        
                    </ul>
                </AccordionItem>

            </div>

            <hr className="nav-divider my-4" />

            {/* /// Search form /// */}
            <form className="d-flex mt-3" role="search" onSubmit={(e) => { e.preventDefault(); hideOffcanvas() }}>
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
    )
}
