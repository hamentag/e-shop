
const baseURL = ''

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

import shoppingCart from "./assets/shopping-cart.png";

import Navbar from './components/Navbar';

import LoginRegister from './components/LoginRegister'

import { cartAPI, authAPI, userAPI, productAPI, orderAPI} from './api';

import useAuth from './hooks/useAuth';
import useCart from './hooks/useCart';
import useProducts from './hooks/useProducts';
import useOrders from './hooks/useOrders';




import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


// const DialogBox = ({ msg, setMsg }) => {
//   return (
//     <>
//       <div className="dialog-box">
//         <div className="dialog-box-main">
//           <p>{msg.txt}</p>
//           <div>{msg.more}</div>
//         </div>
//         <button onClick={() => { setMsg(null) }} style={{ fontSize: '18px' }}> &times; </button>
//       </div>
//       <div className="overlay" onClick={() => { setMsg(null) }}></div>
//     </>
//   )
// }


//// App
function App() {
  // const [auth, setAuth] = useState({});
  // const [guest, setGuest] = useState({});
  // const [products, setProducts] = useState([]);
  // const [cart, setCart] = useState(null);
  // const [orders, setOrders] = useState([]);
  const [homeImages, setHomeImages] = useState([]);

  // const [isLoading, setIsLoading] = useState(true)
  // const [refreshCart, setRefreshCart] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const [msg, setMsg] = useState(null);
  const [popUpAuthn, setPopUpAuthn] = useState(null);


  const headerRef = useRef(null);
  const mainRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { auth, guest, setAuth, setGuest, login, register, logout } = useAuth({setMsg, setPopUpAuthn});
  const { cart, setCart, refreshCart, setRefreshCart, addToCart, updateCart, removeFromCart } = useCart({auth, guest, setGuest, setMsg});

  

  const { products, isLoading, createProduct, deleteProduct } = useProducts({ auth, setMsg, setRefreshCart });
  const { orders, createOrder } = useOrders({ auth, setMsg, setRefreshCart });

  

 
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
                  setPopUpAuthn("to-login") 
                }
                }>Log In
                </button>
                <button className='login-btn' onClick={() => {                  
                  setPopUpAuthn("to-register")
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

      {msg && <DialogBox msg={msg} setMsg={setMsg} />}
      {popUpAuthn && <LoginRegister login={login} register={register} popUpAuthn={popUpAuthn} setPopUpAuthn={setPopUpAuthn} />}
                
      {/* <NewImage />
      <AllImages /> */}

      {/* <Navbar /> */}

      <div style={{paddingTop:"25px"}}>
        <Routes>
          <Route path="/" element={<Home homeImages={homeImages} auth={auth} cart={cart} setMsg={setMsg}
            addToCart={addToCart} products={products}
            deleteProduct={deleteProduct} />}
          />
          <Route path="/products/:seller" element={<Products auth={auth} cart={cart} setMsg={setMsg}
            addToCart={addToCart} products={products}
            deleteProduct={deleteProduct} />}
          />
          <Route path="/:id" element={<SingleProduct auth={auth} cart={cart} addToCart={addToCart}
            deleteProduct={deleteProduct} setMsg={setMsg} />}
          />
          <Route path="/cart" element={<Cart auth={auth} cart={cart} updateCart={updateCart}
            setMsg={setMsg} removeFromCart={removeFromCart} />}
          />
          <Route path="/account" element={<Account auth={auth} />}
          />
          <Route path="/checkout" element={<Checkout auth={auth} cart={cart} createOrder={createOrder} setPopUpAuthn={setPopUpAuthn} />}
          />
          <Route path="/users" element={<Users auth={auth} />}
          />
          <Route path="/new_product" element={<AddNewProduct auth={auth} createProduct={createProduct} />}
          />
          <Route path="/orders" element={<Orders auth={auth} orders={orders} />}
          />

        </Routes>
      </div>
      </div>
    </>
  )
}

export default App

