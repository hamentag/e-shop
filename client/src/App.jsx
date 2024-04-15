
import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Products from './components/Products'
import SingleProduct from './components/SingleProduct'
import Cart from './components/Cart';


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



function App() {
  
  const [products, setProducts] = useState([]);
  const [auth, setAuth] = useState({});
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
 

  const navigate = useNavigate();

  useEffect(()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      attemptLoginWithToken();
    }
  }, []);

  useEffect(()=> {
    const fetchProducts = async()=> {
      const response = await fetch('/api/products'); 
      const json = await response.json();
      if(response.ok){
        setProducts(json);
      
      }
      else{
        console.error(response.error);        
      }
    };
    fetchProducts();
  }, []);

  console.log(cart)
  //
  useEffect(()=> {
    const fetchCart = async()=> {
      const response = await fetch(`/api/users/${auth.id}/cart`, {
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if(response.ok){
        setCart(json);
      }
      else{
        console.error(json.error)
      }
    };       
    
    if(auth.id){
      fetchCart();
    }
    else {
      setCart([]);
    }
  }, [auth, cartCount]);

   // Calculate total items in cart
   useEffect(()=> {
    setCartCount(
        cart.reduce((accumulator ,item) => {
            return accumulator + item.qty;
      }, 0)
      )
  }, [auth, cart]);

  const addToCart = async(product_id, qty)=> {
    const response = await fetch(`/api/users/${auth.id}/cart`, {
      method: 'POST',
      body: JSON.stringify({ product_id, qty}),
      headers: {
        'Content-Type': 'application/json',
        authorization: window.localStorage.getItem('token')
      }
    });
    const json = await response.json();
    if(response.ok){
      console.log(json)
      setCart([...cart, json]);
    }
    else {
      console.error(json.error);
    }
    return json
  };


  const removeFromCart = async(id)=> {
    const response = await fetch(`/api/users/${auth.id}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    });
    if(response.ok){
      setCart(cart.filter(item => item.product_id !== id));
    }
   
  };

  const attemptLoginWithToken = async()=> {
    const token = window.localStorage.getItem('token');
    const response = await fetch('/api/auth/me', {
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
    const response = await fetch('/api/auth/login', {    //
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
    }
  };

  const register = async(newUserData)=> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(newUserData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();    
    if(response.ok){
      login({ email: newUserData.email, password: newUserData.password });  
    }
    else{
      console.error(result.error);
    }
  };


  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
  }


  return (
    <>
      <div className='nav'>
          <div><Link to={'/'}>Home</Link></div>
          <div><Link to={'/cart'}>Cart</Link></div>

      </div>

      {
        !auth.id && <div className='login-register'>
          <div  className='login-form'>
             <Login login={login}  />
          </div>
          
          OR

          <div  className='login-form'>
            <Register register={register} />
          </div>

        
        </div>
      }
         

      
        {auth.id? // Display logged in user info
          <div>
            <div> id: {auth.id} </div>
            <div> First Name: {auth.firstname}</div>
            <div> email: {auth.email}</div>
        </div>
        :
        <div> No user is logged in</div>
        }

        {
          auth.id && <button onClick={logout}>Logout </button>
        }

        <Routes>
          <Route path="/" element={<Products auth={auth} products={products} addToCart={addToCart} />} />
          <Route path="/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart auth={auth} products={products} cart={cart}
             removeFromCart={removeFromCart} cartCount={cartCount} setCartCount={setCartCount} />} />
         
        </Routes>
    </>
  )
}

export default App
