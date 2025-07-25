// src/App.jsx

import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import Home from './components/Home';
import Products from './components/Products';
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Account from './components/Account';
import Checkout from './components/Checkout';
import Users from './components/Users';
import AddNewProduct from './components/AddNewProduct';
import Orders from './components/Orders';
import DialogBox from './components/DialogBox';
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'

import LoginToast from './components/LoginToast'

import useGreeting from './hooks/useGreeting'

import Navbar from './components/Navbar';

import { productAPI } from './api';

import useOverlay from './hooks/useOverlay';
import useAuth from './hooks/useAuth';
import useCart from './hooks/useCart';
import useProducts from './hooks/useProducts';

import useAuthUI from './hooks/useAuthUI';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import useBrands from './hooks/useBrands';


//// App
function App() {

  const { msg, setMsg, popUpAuthn, setPopUpAuthn, showActionToast } = useOverlay();
  const { auth, logout } = useAuth();
  const { cart } = useCart();
  const { isLoading } = useProducts();
    
  const { openModal, closeModal } = useOverlay();


  const [homeImages, setHomeImages] = useState([]);

  const headerRef = useRef(null);
  const mainRef = useRef(null);

  
 
  ////
  useEffect(() => {
    const getHomeImages = async () => {
      try {
        const json = await productAPI.fetchHomeImages();
        setHomeImages(json);
      } catch (err) {
        console.error(err.message);
        setMsg({
          txt: "Oops! Unable to fetch illustration videos currently.",
          more: <button onClick={() => setMsg(null)}>OK</button>
        });
      }
    };
    getHomeImages();
  }, []);
  

  useGreeting();


  //
  if (isLoading) {
    return <section className="loading">Loading..</section>
  }


  return (
    <>

      <div className='main' ref={mainRef}>
                  
        <Navbar />

        <div style={{ paddingTop: "25px", maxWidth: "100%", overflowX: "hidden" }}>           
          <Routes>
            <Route path="/" element={<Home homeImages={homeImages} />} />
            {/* <Route path="/products/:seller" element={<Products />} /> */}
            <Route path="/products/all" element={<Products />} />
            <Route path="/products/brands/:brand" element={<Products />} />
            <Route path="/products/categories/:category" element={<Products />} />


            <Route path="/:id" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/users" element={<Users />} />
            <Route path="/new_product" element={<AddNewProduct />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App

