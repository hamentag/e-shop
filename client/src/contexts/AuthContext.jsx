// src/contexts/AuthContext.js

import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../api';
import useOverlay from '../hooks/useOverlay';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [guest, setGuest] = useState({});

  const [firstTimeUser, setFirstTimeUser] = useState(false)
  
  const [loggedOut, setLoggedOut] = useState(false);

  // const { setMsg, setPopUpAuthn } = useOverlay();
 
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
        // setMsg?.({ txt: 'Unable to initialize guest session.' });
      }
    };

    initializeUser();
  }, []);

  const attemptLoginWithToken = async (token) => {
    try {
      const user = await authAPI.attemptLoginWithToken(token);
      setAuth(user);
      // setPopUpAuthn(null);
    } catch (err) {
      console.error(err.message);
      localStorage.removeItem('token');
      throw new Error("Session expired or invalid login");
    }
  };

  const login = async (credentials) => {
    try {
      const json = await authAPI.login(credentials);
      localStorage.setItem('token', json.token);
      await attemptLoginWithToken(json.token);

    } catch (err) {
      console.error(err.message);
      throw new Error("Invalid email or password");
    }
  };


  //
  const register = async (newUserData) => {
    try {
      await authAPI.register(newUserData);
    } catch (err) {
      console.error('Registration failed:', err.message);
      throw new Error('Registration failed. Please try again.');
    }
  };

  
  // 
  const logout = async () => {
    window.localStorage.removeItem('token');
    setLoggedOut(true)
    setAuth({});
    try {
      const guest = await userAPI.createGuest();
      setGuest(guest);
      localStorage.setItem('guest', JSON.stringify(guest));
    } catch (err) {
      console.error('Failed to recreate guest on logout.');
    }
  };

  return (
    <AuthContext.Provider value={{
      auth, guest, login, logout, register, setAuth, setGuest,
      firstTimeUser, setFirstTimeUser, loggedOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

////