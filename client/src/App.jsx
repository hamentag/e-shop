
const baseURL = 'https://hs-ecommerce-srv.onrender.com'

import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import Products from './components/Products'
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Account from './components/Account';
import Checkout from './components/Checkout';
import Users from './components/Users';
import AddNewProduct from './components/AddNewProduct';
import Orders from './components/Orders'

const Login = ({ login })=> {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitT0Login = ev => {
    ev.preventDefault();
    login({ email, password });
  }
  return (
    <>
    <h4>Sign in</h4>
     <form onSubmit={ submitT0Login } >
        <input value={ email } type='email' placeholder='email' onChange={ ev=> setEmail(ev.target.value)}/>
        <input value={ password} placeholder='password' onChange={ ev=> setPassword(ev.target.value)}/>
        <button disabled={ !(email && password) }>Log In</button>
      </form>
    </>
  );
}


const Register = ({ register })=> {
  const [firstname, setFirstname ] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitT0Register = ev => {
    ev.preventDefault();
    register({ email, password, firstname, lastname });
  }
  return (
    <>
     <form onSubmit={ submitT0Register }>
        <input value={ firstname} placeholder='First Name' onChange={ ev=> setFirstname(ev.target.value)}/>
        <input value={ lastname} placeholder='Last Name' onChange={ ev=> setLastname(ev.target.value)}/>
        <input value={ email } name='email' placeholder='Email' onChange={ ev=> setEmail(ev.target.value)}/>
        <input value={ password} placeholder='password' onChange={ ev=> setPassword(ev.target.value)}/>
        <button disabled={ !(firstname && lastname && email && password) }>Continuer</button>
      </form>
    </>
  );
}

const DialogBox = ({msg, setMsg}) => {
  return(
    <>
        <div className="dialog-box">
            <div className="dialog-box-main">
                <p>{msg.txt}</p>
                <div>{msg.more}</div>                
            </div>
            <button onClick={()=>{setMsg(null)}} style={{fontSize:'18px'}}> &times; </button>
        </div>
        <div className="overlay" onClick={()=>{setMsg(null)}}></div>
    </>
)
}

function App() {
  const [auth, setAuth] = useState({});
  const [guest, setGuest] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
   
  const [refreshCart, setRefreshCart] = useState(false);
  const [refreshProductList, setRefreshProductList] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const [msg, setMsg] = useState(null);
  const [hasAccount, setHasAccount] = useState(true);

  const [isScrolledLoginRegElem, setIsScrolledLoginRegElem] = useState(false);
  const loginRegRef = useRef(null);
  const headerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      attemptLoginWithToken();
    }
    else {
      const foundGuest = window.localStorage.getItem('guest');
      if(foundGuest){
        checkFoundGuest();
      }
      else{
        createGuest();
      }
    }
  }, []);

  useEffect(()=> {
    const fetchProducts = async()=> {
      const response = await fetch(`${baseURL}/api/products`); 
      const json = await response.json();
      if(response.ok){
        setProducts(json);
      }
      else{
        console.error(response.error);
        setMsg("Oops! unable to fetch product list currently.")            
      }
    };
    fetchProducts();
  }, [refreshProductList]);


  useEffect(()=> {
    const fetchCart = async()=> {
      const response = await fetch(`${baseURL}/api/users/${auth.id}/cart`, {
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if(response.ok){

        if(guest.id){
          // from guest too logged in user  (from client side)
          cart.forEach(async(element) => {
             const guestCartItem = json.find(item => item.product_id === element.product_id);
             if(!guestCartItem){
              // add to cart
              await addToCart(element.product_id, element.qty);
             }
             else{
              const newQty = element.qty > guestCartItem.qty? element.qty : guestCartItem.qty;
              // update cart... to be defined
             }
             setGuest({})
          });
        }
      
        setCart(json);
      }
      else{
        console.error(json.error)
      }
    };   
    
    const fetchGuestCart = async()=> {
      const response = await fetch(`${baseURL}/api/guests/${guest.id}/cart`); 
      const json = await response.json();
      if(response.ok){
        setCart(json);
      }
      else{
        console.error(json.error)
      }
    }
    
    if(auth.id){
      fetchCart();
    }
    else if(guest.id){
      fetchGuestCart();
    }
  }, [auth, guest, refreshCart]);


  useEffect(()=> {    
    const fetchOrders = async()=> {     
      const response = await fetch(`${baseURL}/api/users/${auth.id}/orders`, {
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if(response.ok){
        setOrders(json)
      }
      else{
        console.error(json.error)
      }
    };

    if(auth.id){
      fetchOrders();
    }
  }, [auth, refreshOrders]);




  // Display log in button when Login or Register form is scrolled past (compared to
  // the bottom of the header)
  useEffect(()=> {
    const handleScroll = () => {
     if(loginRegRef.current){
      const loginRegBtmPosition = loginRegRef.current.getBoundingClientRect().bottom;
      const headerBtmPosition = headerRef.current.getBoundingClientRect().bottom;
      setIsScrolledLoginRegElem(loginRegBtmPosition < headerBtmPosition);
     }
    };

    // Add event listener to track scroll position
    window.addEventListener('scroll', handleScroll);

    // Clean up by removing event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  // add to guest cart
  const addToGuestCart = async(product_id, qty)=> {
    if(true){
      const response = await fetch(`${baseURL}/api/guests/${guest.id}/guest_cart`, {
        method: 'POST',
        body: JSON.stringify({ product_id, qty}),
        headers: {
          'Content-Type': 'application/json'
        }
      });    
      const json = await response.json();
      if(response.ok){
        setCart([...cart, json]);
        setRefreshCart(prevState => !prevState); // fetch updated cart
      }
      else {
        console.error(json.error);
        setMsg({
          txt: json.error,
          more: <button onClick={()=>{setMsg(null)}}>OK</button>
        })
      }
    }
  };

  // add guest
  const createGuest = async() => {
    const response = await fetch(`${baseURL}/api/guests/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    if(response.ok){
      setGuest(result);
      window.localStorage.setItem('guest', JSON.stringify(result));          
    }
    else{
      console.error(result.error)
    }
  }


  // add to cart
  const addToCart = async(product_id, qty)=> {
    if(auth.id){
      const response = await fetch(`${baseURL}/api/users/${auth.id}/cart`, {
        method: 'POST',
        body: JSON.stringify({ product_id, qty}),
        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if(response.ok){
        setCart([...cart, json]);
        setRefreshCart(prevState => !prevState); // fetch cart
      }
      else {
        console.error(json.error);
        setMsg({
          txt: json.error,
          more: <button onClick={()=>{setMsg(null)}}>OK</button>
        })
      }      
    }
    else{   // not logged in
      await addToGuestCart(product_id, qty);      
    }
  };

    // update cart
 const updateCart = async(product_id, qty)=> {
  let responseAPI;
  if(auth.id){
    responseAPI = await fetch(`/api/users/${auth.id}/cart`, {
      method: 'PUT',
      body: JSON.stringify({ product_id, qty}),
      headers: {
        'Content-Type': 'application/json',
        authorization: window.localStorage.getItem('token')
      }
    });

  }
  else if(guest.id){
    responseAPI = await fetch(`/api/guests/${guest.id}/cart`, {
      method: 'PUT',
      body: JSON.stringify({ product_id, qty}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }
  const json = await responseAPI.json();                                                 
  if(responseAPI.ok){
      for(let element of cart){
        if(element.product_id === product_id ){
          element.qty = json.qty;
          break;
        }
      }
      setRefreshCart(prevState => !prevState); // fetch updated cart
  }
  else{
    console.error(json.error)
    alert(json.error)
  }  
};

// Create Order 
const createOrder = async()=> {
  if(auth.id){
    const response = await fetch(`${baseURL}/api/users/${auth.id}/orders`, {
      method: 'POST',
      
      headers: {
        'Content-Type': 'application/json',
        authorization: window.localStorage.getItem('token')
      }
    });
    const json = await response.json();
    if(response.ok){      
      setOrders([...orders, ...json]);
      setRefreshOrders(prevState => !prevState);
      setRefreshCart(prevState => !prevState);
    }
  }
}
      
  const removeFromCart = async(id)=> {
    let responseAPI;
    if(auth.id){
      responseAPI = await fetch(`${baseURL}/api/users/${auth.id}/cart/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
    }  
    else if(guest.id){
      responseAPI = await fetch(`${baseURL}/api/guests/${guest.id}/cart/${id}`, {
        method: 'DELETE'
      });      
    }

    if(responseAPI.ok){
      setCart(cart.filter(item => item.product_id !== id));
      setRefreshCart(prevState => !prevState); // fetch updated cart
    }
  };

  const checkFoundGuest = async()=> {
    //
    const foundGuest = JSON.parse(window.localStorage.getItem('guest'));
    try{
      const response = await fetch(`${baseURL}/api/guests/${foundGuest.id}`);
      const json = await response.json();

      setGuest(json);

    } catch (error){
      // invalid guest key.  
      window.localStorage.removeItem('guest');
      createGuest();
    }  
  }

  const attemptLoginWithToken = async()=> {
    const token = window.localStorage.getItem('token');
    const response = await fetch(`${baseURL}/api/auth/me`, {
      headers: {
        authorization: token
      }
    });
    const json = await response.json();
    if(response.ok){
      setAuth(json);
    }
    else {
      window.localStorage.removeItem('token');
    }
  };

  const login = async(credentials)=> {
    const response = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    if(response.ok){
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    }
    else{
      console.error(json.error)
      setMsg({
        txt: "Incorrect email or password. Please try again."
      })
    }
  };

  const register = async(newUserData)=> {
    const response = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify(newUserData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();    
    if(response.ok){
      setMsg({
        txt: "Success! Your account has been created.",
        more: <button onClick={()=>{navigate('/account'); setMsg(null)}}>See Account</button>
      });
      login({ email: newUserData.email, password: newUserData.password });  // login by default when user success. creates account
    }
    else{
      console.error(result.error);
      setMsg({
        txt: "Account creation failed with provided information."
      });
    }
  };

  const createProduct = async(newProductData)=> {
    const response = await fetch(`${baseURL}/api/users/${auth.id}/products`, {
      method: 'POST',
      body: JSON.stringify(newProductData),
      headers: {
        'Content-Type': 'application/json',
        authorization: window.localStorage.getItem('token')
      }
    });
    const json = await response.json();
    if(response.ok){
      setMsg({txt: "Product has been added."});
      setRefreshProductList(prevState => !prevState); 
    }
    else{
      console.error(json.error)
    }
  }

  const deleteProduct = async(id) =>{
    const response = await fetch(`${baseURL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    });
    if(response.ok){
      //setProductCount((n)=> n -1);
      setCart(cart.filter(item => item.product_id !== id));

      setRefreshProductList(prevState => !prevState); // Refresh product list
      setRefreshCart(prevState => !prevState); // fetch updated cart
      
    }
    else{
      await response.json().then((json)=>{
        console.error(json.error)
        setMsg({
          txt: json.error,
          more: <button onClick={()=>{setMsg(null)}}>OK</button>
        })  
      })         
    }
  }

  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
    createGuest();
  }


  return (
    <>
      <div className='header' ref={headerRef}>
        <div className='header-top'>
          <h1><Link to={'/'}>E-Shop</Link></h1>
          {
            auth.id?
              <div>
                <div className='logout'> <Link to={'/account'}>{auth.firstname} </Link>
                  <button onClick={logout}>Logout </button>
                </div>
              </div>
            :  
              <>
                { isScrolledLoginRegElem &&
                  <button className='login-btn' onClick={()=>{
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setHasAccount(true);
                        }
                      }>Log In
                  </button>  
                }
              </>
          }
        </div>
        <div className='nav'>
          <div><Link to={'/'}>Home</Link></div>
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
            <h4><Link to={'/cart'}>Cart<sup>({cart.length===0? 0 : cart[0].cart_count })</sup></Link></h4>
          </div>
        </div>
      </div>
      <div className='main'>
        {
          !auth.id && <div ref={loginRegRef} className={location.pathname === '/cart'? 'loginReg-in-cart-comp' : ''}>
            {hasAccount ?
              <div className='login-form'>
                <Login login={login} />
                Don't have an account? 
                <span onClick={() => { setHasAccount(false)}} className='signUp-link'>Sign Up</span>
              </div>
              :
              <div className='register-form'>
                <h4>Create account</h4>
                <Register register={register} />
                Already have an account? 
                <span onClick={() => { setHasAccount(true) }} className='login-link'>Log In</span>
              </div>
            }
          </div>
        }

        {msg && <DialogBox msg={msg} setMsg={setMsg} />}

        <Routes>
          <Route path="/" element={<Products auth={auth} cart={cart} setMsg={setMsg}
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
          <Route path="/checkout" element={<Checkout auth={auth} cart={cart} createOrder={createOrder} setMsg={setMsg} />}
          />
          <Route path="/users" element={<Users auth={auth} />}
          />
          <Route path="/new_product" element={<AddNewProduct auth={auth} createProduct={createProduct} />}
          />
          <Route path="/orders" element={<Orders auth={auth} orders={orders}/>}
          />

        </Routes>
      </div>
    </>
  )
}

export default App
