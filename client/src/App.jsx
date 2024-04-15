
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
  const [auth, setAuth] = useState({});
 

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
      </div>

      {
        !auth.id && <div>
           <Login login={login}  />
          OR
          <Register register={register} />
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
          <Route path="/" element={<Products  products={products} />} />
          <Route path="/:id" element={<SingleProduct />} />
          
        </Routes>
    </>
  )
}

export default App
