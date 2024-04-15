
import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Products from './components/Products'
import SingleProduct from './components/SingleProduct'


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

  const [hasAccount, setHasAccount] = useState(true);

  const navigate = useNavigate();

  useEffect(()=> {
    const fetchProducts = async()=> {
      const response = await fetch('/api/products'); 
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
  }, []);




  return (
    <>
      <div className='nav'>
          <div><Link to={'/'}>Home</Link></div>
          </div>

          <Login  />
          OR
          <Register  />

        <Routes>
          <Route path="/" element={<Products  products={products} />} />
          <Route path="/:id" element={<SingleProduct />} />
          
        </Routes>
    </>
  )
}

export default App
