// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../api';

export default function useAuth({ setMsg, setPopUpAuthn }) {
  const [auth, setAuth] = useState({});
  const [guest, setGuest] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      const existingGuest = JSON.parse(localStorage.getItem('guest'));

      if (token) {
        try {
          const user = await authAPI.attemptLoginWithToken(token);
          setAuth(user);
          return;
        } catch (err) {
          console.error('Token login failed:', err.message);
          localStorage.removeItem('token');
        }
      }

      if (existingGuest) {
        try {
          const guest = await userAPI.checkGuest(existingGuest.id);
          setGuest(guest);
          return;
        } catch (err) {
          console.warn('Invalid guest ID. Creating new guest...');
          localStorage.removeItem('guest');
        }
      }

      try {
        const guest = await userAPI.createGuest();
        setGuest(guest);
        localStorage.setItem('guest', JSON.stringify(guest));
      } catch (err) {
        console.error('Guest creation failed:', err.message);
        setMsg?.({ txt: 'Unable to initialize guest session.' });
      }
    };

    initializeUser();
  }, []);


  //// token login
  const attemptLoginWithToken = async (token) => {
    try {
      // const token = localStorage.getItem('token');
      const json = await authAPI.attemptLoginWithToken(token);
      setAuth(json);
      setPopUpAuthn(null);
      // return json; 
    } catch (err) {
      console.error(err.message);
      localStorage.removeItem('token');
    }
  };


  //// login
  const login = async (credentials) => {
    try {
      const json = await authAPI.login(credentials);
      localStorage.setItem('token', json.token);
      await attemptLoginWithToken(json.token);
    } catch (err) {
      console.error(err.message);
      setPopUpAuthn(null);
      setMsg({
        txt: "Incorrect email or password. Please try again.",
        more: <button onClick={() => { setPopUpAuthn("to-login"); setMsg(null) }}>Try again</button>,
      });
    }
  };


  //// register
  const register = async (newUserData) => {
    try {
      await authAPI.register(newUserData);
      setMsg({
        txt: "Success! Your account has been created.",
        more: <button onClick={() => { navigate('/account'); setMsg(null) }}>See Account</button>
      });
      await login({ email: newUserData.email, password: newUserData.password });
    } catch (err) {
      console.error(err.message);
      setMsg({
        txt: "Account creation failed: " + err.message
      });
    }
  };


  ////
  const logout = async () => {
    window.localStorage.removeItem('token');
    setAuth({});
    try {
      const guest = await userAPI.createGuest();
      setGuest(guest);
      localStorage.setItem('guest', JSON.stringify(guest));
    } catch (err) {
      console.error('Failed to recreate guest on logout.');
    }
  };

  return {
    auth,
    guest,
    setAuth,
    setGuest,
    login,
    register,
    logout,
  };
  
}

