// src/App.jsx

import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link } from "react-router-dom";

import Home from './components/Home';
import Products from './components/Products';
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Account from './components/Account';
import Checkout from './components/Checkout';
import Users from './components/Users';
import AddNewProduct from './components/AddNewProduct';
import Orders from './components/Orders';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import ShippingAddrForm from './components/ShippingAddrForm';
import Order from './components/Oreder';

import Layout from './layouts/Layout';


import useGreeting from './hooks/useGreeting'

import Navbar from './components/Navbar';

import { productAPI } from './api';

import useOverlay from './hooks/useOverlay';
import useAuth from './hooks/useAuth';
import useCart from './hooks/useCart';
import useProduct from './hooks/useProduct';


//// App
function App() {

  const { setMsg } = useOverlay();
  const { isLoading } = useProduct();
    
  const [homeImages, setHomeImages] = useState([]);
  // const mainRef = useRef(null);

  
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
    
    <Navbar />



          <Layout>
                  
               
          <Routes>
            <Route path="/" element={<Home homeImages={homeImages} />} />
            <Route path="/products/all" element={<Products />} />
            <Route path="/products/brands/:brand" element={<Products />} />
            <Route path="/products/categories/:category" element={<Products />} />
            <Route path="/products/search/:searchKey" element={<Products />} /> 
            <Route path="/:id" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/users" element={<Users />} />
            <Route path="/new_product" element={<AddNewProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            {/* <Route path="/tst" element={<ShippingAddrForm />} /> */}
            <Route path="/order/:orderId" element={<Order />} />
          </Routes>
    
        </Layout>

    </>
  )
}

export default App

