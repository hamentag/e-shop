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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


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

  
  
  // ////
  // const launchLoginForm = () => {
  //   openModal(
  //     <LoginForm />,
  //     {
  //       title: 'Login',
  //       props: {
  //         dialogClassName: 'modal-fullscreen-sm-down',
  //         size: 'md'
  //       }
  //     }
  //   );
  // }

  // ////
  // const launchSignUpForm = () => {
  //     openModal(
  //       <SignUpForm />,
  //       {
  //         title: 'Sign Up',
  //         props: {
  //           dialogClassName: 'modal-fullscreen-sm-down',
  //           size: 'md'
  //         }
  //       }
  //     );
  // }
  
  // ////
  // const prevAuthRef = useRef(null); // Start with null, not auth
    

  // useEffect(() => {
  //   const prev = prevAuthRef.current;

  //   // User just logged in
  //   if (!prev?.id && auth?.id) {
  //     showActionToast(
  //       `Welcome Back ${auth.firstname}`, 
  //       <button type="button" className="btn btn-primary btn-sm"
  //       >See cart
  //       </button>
  //     );
  //   }
  //   // User just logged out
  //   else if (prev?.id && !auth?.id) {
  //     console.log("just logged out");
  //     const c = 
  //     showActionToast(
  //       'You have been logged out.',
  //       <button type="button" className="btn btn-primary btn-sm" onClick={ launchLoginForm }>log in again</button>
  //     );
  //   }
  //   //
  //   else if (!auth?.id) {
  //     showActionToast('login.', 
  //       <div className="">
  //     <div className='d-flex justify-content-evenly'>
  //         <button
  //         type="button"
  //         className="btn btn-primary btn-sm w-50"
  //         onClick={ launchLoginForm }
  //       >
  //         Log in
  //       </button>
  //     </div>
  //     <p className='pt-1'>New customer?{' '}
  //         <a onClick={launchSignUpForm}  href="#" 
  //         className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
  //         >Sign Up
  //         </a>
  //     </p>

    
    
  //   </div>
  // );

  //   }

  //   prevAuthRef.current = auth;
  // }, [auth]);

 

  
  // ////
  // useEffect(() => {
  //   const getHeaderHeight = () => {
  //     if (headerRef.current && mainRef.current) {
  //       const headerHeight = headerRef.current.getBoundingClientRect().height;
  //       mainRef.current.style.marginTop = `${headerHeight}px`;
  //     }
  //   };

  //   // get header height initially and whenever the window is resized
  //   getHeaderHeight();
  //   window.addEventListener('resize', getHeaderHeight);

  //   // Clean up the event listener on unmount
  //   return () => {
  //     window.removeEventListener('resize', getHeaderHeight);
  //   };
  // }, [headerRef.current, mainRef.current]);
  const Nvb = () => {
    return (
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
                 launchLoginForm();
                }
                }>Log In
                </button>

                <button className='login-btn' onClick={() => {
                  launchSignUpForm();
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
    )
  }




  //
  if (isLoading) {
    return <section className="loading">Loading..</section>
  }


  return (
    <>

      <div className='main' ref={mainRef}>

      {msg && <DialogBox />}
                
      <Nvb />  
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

