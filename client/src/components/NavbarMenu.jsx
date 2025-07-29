// src/components/NavbarMenu.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import useCart from '../hooks/useCart';
import useOverlay from '../hooks/useOverlay';
import useProduct from '../hooks/useProduct';
import useAuth from "../hooks/useAuth";
import useAuthUI from "../hooks/useAuthUI";
import useBrands from '../hooks/useBrands';
import useCategory from "../hooks/useCategory";

import CartQtyCtrl from '../components/CartQtyCtrl';
import NavAccount from '../components/NavAccount';
import AccordionItem from '../components/AccordionItem';

// import { selectCategories } from '../utils/selectCategories';




export default function NavbarMenu() {
    const navigate = useNavigate()
    const { cart, updateCart, removeFromCart } = useCart();
    const { hideOffcanvas } = useOverlay();
    const { products } = useProduct();
    const { auth, logout } = useAuth();
    const { launchSignUpForm, launchLoginForm } = useAuthUI();
    const { topBrands } = useBrands();    

    // const categories = selectCategories(products)
    const { categories } = useCategory();
    
    const [mnSear, setMnSear] = useState('')


    
    return (
        <div className="offcanvas-body nav-menu">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
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
                            <li key={category.id}>
                                <Link
                                    to={`/products/categories/${category.id}`}
                                    className="dropdown-item"
                                    onClick={hideOffcanvas}
                                >
                                    {category.name}
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
                                <li>
                                    <Link className='dropdown-item' to="/orders"
                                          onClick={hideOffcanvas}
                                     >Orders
                                    </Link>
                                </li>
                                <li>
                                    <Link className='dropdown-item' to="/account"
                                          onClick={hideOffcanvas}
                                     >Profile
                                    </Link>
                                </li>
                                <li>
                                    <button className='dropdown-item' onClick={()=>{hideOffcanvas();logout()}}
                                     >Quit
                                    </button>
                                </li>
                            </>
                        )}
                        
                    </ul>
                </AccordionItem>

            </div>

            <hr className="nav-divider my-4" />

            {/* /// Search form /// */}
            <form className="d-flex mt-3" role="search" onSubmit={(e) => { e.preventDefault(); hideOffcanvas(); navigate(`/products/search/${mnSear}`); }}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={mnSear}
                    onChange={(e) => setMnSear(e.target.value)}
                    
                />
                <button className="btn btn-outline-success" type="submit">
                    Search
                </button>
            </form>

        </div>
    )
}
