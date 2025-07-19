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
import LoginRegister from './components/LoginRegister'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'

import Navbar from './components/Navbar';

import { productAPI } from './api';

import useOverlay from './hooks/useOverlay';
import useAuth from './hooks/useAuth';
import useCart from './hooks/useCart';
import useProducts from './hooks/useProducts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


//// App
function App() {

  const { msg, setMsg, popUpAuthn, setPopUpAuthn } = useOverlay();
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

  
  ////
  useEffect(() => {
    const getHeaderHeight = () => {
      if (headerRef.current && mainRef.current) {
        const headerHeight = headerRef.current.getBoundingClientRect().height;
        mainRef.current.style.marginTop = `${headerHeight}px`;
      }
    };

    // get header height initially and whenever the window is resized
    getHeaderHeight();
    window.addEventListener('resize', getHeaderHeight);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', getHeaderHeight);
    };
  }, [headerRef.current, mainRef.current]);


  //
  if (isLoading) {
    return <section className="loading">Loading..</section>
  }


  return (
    <>
      <div className='header' ref={headerRef}>
        <div className='header-top'>
          <h1><Link to={'/'}>E-Shop</Link></h1>
          <div style={{display:'flex',gap:'0.5rem' ,width:'fit-content'}}>
          {
            auth.id ?
              <div>
                <div className='logout'> <Link to={'/account'}>{auth.firstname} </Link>
                  <button onClick={logout}>Logout </button>
                </div>
              </div>
              :
              <div style={{display:'flex'}}>
                <button className='login-btn' onClick={() => {
                  // window.scrollTo({ top: 0, behavior: 'smooth' });
                  // setPopUpAuthn("to-login")
                  openModal(
                    <LoginForm />,
                    {
                      title: 'Login',
                      props: {
                        dialogClassName: 'modal-fullscreen-sm-down',
                        size: 'md'
                      }
                    }
                  );
                }
                }>Log In
                </button>

                <button className='login-btn' onClick={() => {
                  // setPopUpAuthn("to-register")
                  openModal(
                    <SignUpForm />,
                    {
                      title: 'Sign Up',
                      props: {
                        dialogClassName: 'modal-fullscreen-sm-down',
                        size: 'md'
                      }
                    }
                  );
                }
                }>Join
                </button>
              </div>    
          }

          <div className='cart'>
              
              <Link to={'/cart'} className='crt'>
                <div>{cart? cart.cart_count : ''}</div>
                <FontAwesomeIcon icon={faCartShopping} className='cart-icon' />
      
              </Link>
          </div>


          </div>


        </div>
        <div className='nav'>
          <div><Link to={'/'}>Home</Link></div>
          <div><Link to={'/products/all'}>Shop All</Link></div>

          {auth.id && <>
            <div>  <Link to={'/account'}>Account</Link> </div>
            <div><Link to={'/orders'}>Order History</Link></div>
          </>

          }
          {auth.is_admin && <>
            <Link to={'/users'}>Show Users</Link>
            <Link to={'/new_product'}>Add Product</Link>
          </>}
         
        </div>
      </div>
      
      <div className='main' ref={mainRef}>

      {msg && <DialogBox />}
      {/* {popUpAuthn && <LoginRegister />} */}
                
  
      {/* <Navbar /> */}

      <div style={{paddingTop:"25px"}}>
        <Routes>
          <Route path="/" element={<Home homeImages={homeImages} />} />
          <Route path="/products/:seller" element={<Products />} />
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

