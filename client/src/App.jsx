const baseURL = 'https://hs-ecommerce-srv.onrender.com'

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
import shoppingCart from "./assets/shopping-cart.png";


const DialogBox = ({ msg, setMsg }) => {
  return (
    <>
      <div className="dialog-box">
        <div className="dialog-box-main">
          <p>{msg.txt}</p>
          <div>{msg.more}</div>
        </div>
        <button onClick={() => { setMsg(null) }} style={{ fontSize: '18px' }}> &times; </button>
      </div>
      <div className="overlay" onClick={() => { setMsg(null) }}></div>
    </>
  )
}

//
const LoginRegister = ({ login, register, popUpAuthn, setPopUpAuthn }) => {
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');

  const [hasAccount, setHasAccount] = useState(popUpAuthn === 'to-login');

  const submitT0Login = ev => {
    ev.preventDefault();
    login({ email: emailLogin, password: passwordLogin });
  }

  const submitT0Register = ev => {
    ev.preventDefault();
    register({ email: emailReg, password: passwordReg, firstname, lastname });
  }

  return (
    <>
      <div className="dialog-box">
        <div className="dialog-box-main">
          {hasAccount ?
            <div>
              <div className='login-form' >
                  <h4>Sign in to your account</h4>
                  <form onSubmit={submitT0Login} >
                    <input value={emailLogin} type='email' placeholder='Email' onChange={ev => setEmailLogin(ev.target.value)} />
                    <input value={passwordLogin} placeholder='Password' onChange={ev => setPasswordLogin(ev.target.value)} />
                    <button disabled={!(emailLogin && passwordLogin)}>Log In</button>
                  </form>
              </div>
              Don't have an account?
              <span onClick={() => { setHasAccount(false) }} className='signUp-link'>Sign Up</span>
            </div>
            :
            <div>
              <div className='register-form' > 
                <h4>Create a new account</h4>
                <form onSubmit={submitT0Register}>
                  <input value={firstname} placeholder='First Name' onChange={ev => setFirstname(ev.target.value)} />
                  <input value={lastname} placeholder='Last Name' onChange={ev => setLastname(ev.target.value)} />
                  <input value={emailReg} name='email' placeholder='Email' onChange={ev => setEmailReg(ev.target.value)} />
                  <input value={passwordReg} placeholder='Password' onChange={ev => setPasswordReg(ev.target.value)} />
                  <button disabled={!(firstname && lastname && emailReg && passwordReg)}>Continuer</button>
                </form>
              </div>
              Already have an account?
              <span onClick={() => { setHasAccount(true) }} className='login-link'>Log In</span>
            </div>
          }
        </div>
        <button onClick={() => { setPopUpAuthn(null) }} style={{ fontSize: '18px' }}> &times; </button>
      </div>
      <div className="overlay" onClick={() => { setPopUpAuthn(null) }}></div>
    </>
  );
}


// App
function App() {
  const [auth, setAuth] = useState({});
  const [guest, setGuest] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [illustrationVideos, setIllustrationVideos] = useState([]);

  const [isLoading, setIsLoading] = useState(true)
  const [refreshCart, setRefreshCart] = useState(false);
  const [refreshProductList, setRefreshProductList] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const [msg, setMsg] = useState(null);
  const [popUpAuthn, setPopUpAuthn] = useState(null);


  const headerRef = useRef(null);
  const mainRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      attemptLoginWithToken();
    }
    else {
      const foundGuest = window.localStorage.getItem('guest');
      if (foundGuest) {
        checkFoundGuest();
      }
      else {
        createGuest();
      }
    }
  }, []);

  useEffect(() => {
    const fetchIllustrationVideos = async () => {
      const response = await fetch(`${baseURL}/api/illustration-videos`);
      const json = await response.json();
      if (response.ok) {
        setIllustrationVideos(json);
        // setIsLoading(false)
      }
      else {
        console.error(response.error);
        setMsg({
          txt: "Oops! unable to fetch illustration videos currently."
        })
      }
    };
    fetchIllustrationVideos();
  }, []);


  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${baseURL}/api/products`);
      const json = await response.json();
      if (response.ok) {
        setProducts(json);
        setIsLoading(false)
      }
      else {
        console.error(response.error);
        setMsg({
          txt: "Oops! unable to fetch product list currently."
        })
      }
    };
    fetchProducts();
  }, [refreshProductList]);


  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch(`${baseURL}/api/users/${auth.id}/cart`, {
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if (response.ok) {  

        if (guest.id) {
          // from guest to logged in user  (from client side)
          cart.products.forEach(async (element) => {
            const guestCartItem = json.products.find(item => item.product_id === element.product_id);
            if (!guestCartItem) {
              // add to cart
              await addToCart(element.product_id, element.qty);
            }

            setGuest({})
          });
        }

        setCart(json);
      }
      else {
        console.error(json.error)
      }
    };

    const fetchGuestCart = async () => {
      const response = await fetch(`${baseURL}/api/guests/${guest.id}/cart`);
      const json = await response.json();
      if (response.ok) {
        setCart(json);
      }
      else {
        console.error(json.error)
      }
    }

    if (auth.id) {
      fetchCart();
    }
    else if (guest.id) {
      fetchGuestCart();
    }
  }, [auth, guest, refreshCart]);


  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`${baseURL}/api/users/${auth.id}/orders`, {
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if (response.ok) {
        setOrders(json)
      }
      else {
        console.error(json.error)
      }
    };

    if (auth.id) {
      fetchOrders();
    }
  }, [auth, refreshOrders]);

  
  // add to guest cart
  const addToGuestCart = async (product_id, qty) => {
    if (true) {
      const response = await fetch(`${baseURL}/api/guests/${guest.id}/guest_cart`, {
        method: 'POST',
        body: JSON.stringify({ product_id, qty }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      if (response.ok) {
        setRefreshCart(prevState => !prevState); // fetch updated cart
      }
      else {
        console.error(json.error);
        setMsg({
          txt: json.error,
          more: <button onClick={() => { setMsg(null) }}>OK</button>
        })
      }
    }
  };

  // add guest
  const createGuest = async () => {
    const response = await fetch(`${baseURL}/api/guests/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    if (response.ok) {
      setGuest(result);
      window.localStorage.setItem('guest', JSON.stringify(result));
    }
    else {
      console.error(result.error)
    }
  }

  // add to cart
  const addToCart = async (product_id, qty) => {
    if (auth.id) {
      const response = await fetch(`${baseURL}/api/users/${auth.id}/cart`, {
        method: 'POST',
        body: JSON.stringify({ product_id, qty }),
        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if (response.ok) {
        setRefreshCart(prevState => !prevState); // fetch cart
      }
      else {
        console.error(json.error);
        setMsg({
          txt: json.error,
          more: <button onClick={() => { setMsg(null) }}>OK</button>
        })
      }
    }
    else {   // not logged in
      await addToGuestCart(product_id, qty);
    }
  };

  // update cart
  const updateCart = async (product_id, qty) => {
    if (auth.id) {
      const responseAPI = await fetch(`${baseURL}/api/users/${auth.id}/cart`, {
        method: 'PUT',
        body: JSON.stringify({ product_id, qty }),
        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await responseAPI.json();
      if (responseAPI.ok) {
        // for (let element of cart) {
        //   if (element.product_id === product_id) {
        //     element.qty = json.qty;
        //     break;
        //   }
        // }
        setRefreshCart(prevState => !prevState); // fetch updated cart
      }
      else {
        console.error(json.error)
        // alert(json.error)
        setMsg({
          txt: json.error,
          more: <button onClick={() => { setMsg(null) }}>OK</button>
        })
      }
    }
    else if (guest.id) {
      const responseAPI = await fetch(`${baseURL}/api/guests/${guest.id}/cart`, {
        method: 'PUT',

        body: JSON.stringify({ product_id, qty }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await responseAPI.json();
      if (responseAPI.ok) {
        // for (let element of cart) {
        //   if (element.product_id === product_id) {
        //     element.qty = json.qty;
        //     break;
        //   }
        // }
        setRefreshCart(prevState => !prevState); // fetch updated cart
      }
      else {
        console.error(json.error)
        // alert(json.error)
        setMsg({
          txt: json.error,
          more: <button onClick={() => { setMsg(null) }}>OK</button>
        })
      }
    }
  };
  
  // Create Order 
  const createOrder = async () => {
    if (auth.id) {
      const response = await fetch(`${baseURL}/api/users/${auth.id}/orders`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if (response.ok) {
        setOrders([...orders, ...json]);
        setRefreshOrders(prevState => !prevState);
        setRefreshCart(prevState => !prevState);
      }
    }
  }

  const removeFromCart = async (id) => {
    let responseAPI;
    if (auth.id) {
      responseAPI = await fetch(`${baseURL}/api/users/${auth.id}/cart/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
    }
    else if (guest.id) {
      responseAPI = await fetch(`${baseURL}/api/guests/${guest.id}/cart/${id}`, {
        method: 'DELETE'
      });
    }

    if (responseAPI.ok) {
      // setCart(cart.products.filter(item => item.product_id !== id));
      setRefreshCart(prevState => !prevState); // fetch updated cart
    }
  };

  const checkFoundGuest = async () => {
    //
    const foundGuest = JSON.parse(window.localStorage.getItem('guest'));
    try {
      const response = await fetch(`${baseURL}/api/guests/${foundGuest.id}`);
      const json = await response.json();

      setGuest(json);

    } catch (error) {
      // invalid guest key.  
      window.localStorage.removeItem('guest');
      createGuest();
    }
  }

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem('token');
    const response = await fetch(`${baseURL}/api/auth/me`, {
      headers: {
        authorization: token
      }
    });
    const json = await response.json();
    if (response.ok) {
      setAuth(json);
      setPopUpAuthn(null)
    }
    else {
      window.localStorage.removeItem('token');
    }
  };

  const login = async (credentials) => {
    const response = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    }
    else {
      console.error(json.error)
      setPopUpAuthn(null)
      setMsg({
        txt: "Incorrect email or password. Please try again.",
        more: <button onClick={() => { setPopUpAuthn("to-login"); setMsg(null) }}>Try again</button>
      })
    }
  };

  const register = async (newUserData) => {
    const response = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify(newUserData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    if (response.ok) {
      setMsg({
        txt: "Success! Your account has been created.",
        more: <button onClick={() => { navigate('/account'); setMsg(null) }}>See Account</button>
      });
      login({ email: newUserData.email, password: newUserData.password });  // login by default when user success. creates account
    }
    else {
      console.error(result.error);
      setMsg({
        txt: "Account creation failed with provided information."
      });
    }
  };

  //
  const createProduct = async (newProductData) => {
    const formData = new FormData();

    Object.entries(newProductData).forEach(([key, value]) => {
      if(key !== 'submittedImages'){
        formData.append(key, value);
      }        
      else{
        // const image = newProductData.submittedImages;
        for (let i = 0; i < (newProductData.submittedImages).length; i++) {
          formData.append('images', (newProductData.submittedImages)[i].file);
          formData.append(`caption[${i}]`, (newProductData.submittedImages)[i].caption); // Add caption for each image
          formData.append(`is_showcase[${i}]`, (newProductData.submittedImages)[i].is_showcase); // is_showcase for each image
        }
      }
    });


    //
    const response = await fetch(`${baseURL}/api/users/${auth.id}/products`, {
      method: 'POST',
      body: formData,
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    });
    const json = await response.json();
    if (response.ok) {
      setMsg({ txt: "Product is now available!" });
      setRefreshProductList(prevState => !prevState);
    }
    else {
      console.error(json.error)
    }
  }

  //
  const deleteProduct = async (id) => {
    const response = await fetch(`${baseURL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    });
    if (response.ok) {
      //setProductCount((n)=> n -1);
      // setCart(cart.products.filter(item => item.product_id !== id));

      setRefreshProductList(prevState => !prevState); // Refresh product list
      setRefreshCart(prevState => !prevState); // fetch updated cart

    }
    else {
      await response.json().then((json) => {
        console.error(json.error)
        setMsg({
          txt: json.error,
          more: <button onClick={() => { setMsg(null) }}>OK</button>
        })
      })
    }
  }

  const logout = () => {
    window.localStorage.removeItem('token');
    setAuth({});
    createGuest();
  }


  //
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
          {
            auth.id ?
              <div>
                <div className='logout'> <Link to={'/account'}>{auth.firstname} </Link>
                  <button onClick={logout}>Logout </button>
                </div>
              </div>
              :
              <div>
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
          <div className='cart'>
              <Link to={'/cart'} className='crt'>
                <div>{cart? cart.cart_count : ''}</div>
                <img src={shoppingCart} alt="cart icon" style={{ width: '25px', height: '20px' }} />
              </Link>
          </div>
        </div>
      </div>
      <div className='main' ref={mainRef}>

      {msg && <DialogBox msg={msg} setMsg={setMsg} />}
      {popUpAuthn && <LoginRegister login={login} register={register} popUpAuthn={popUpAuthn} setPopUpAuthn={setPopUpAuthn} />}
                
      {/* <NewImage />
      <AllImages /> */}

      <div>
        <Routes>
          <Route path="/" element={<Home illustrationVideos={illustrationVideos} auth={auth} cart={cart} setMsg={setMsg}
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

