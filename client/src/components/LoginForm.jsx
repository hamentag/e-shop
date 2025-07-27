// src/components/LoginForm.jsx

import React, { useState, useEffect, useRef } from 'react';

import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';

import SignUpForm from '../components/SignUpForm'


export default function LoginForm() {

    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');

    const [loginError, setLoginError] = useState('');


    const formRef = useRef(null);
    
    const { openModal, closeModal, showToast } = useOverlay();
    const { login, register } = useAuth();

    // const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);


    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = formRef.current;

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      try {
        setLoginError(''); // clear previous error
        await login({ email: emailLogin, password: passwordLogin });
        closeModal();
        showToast({
                title: 'Login',
                message: 'Login Success',
                time: 'just now',
                duration: 5000
              });
      } catch (err) {
        setLoginError(err.message || 'Login failed. Please try again.');
        form.classList.remove('was-validated');
      }
    };


    return (
          <form ref={formRef} noValidate onSubmit={handleSubmit}>

             <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" required
                    onChange={ev => setEmailLogin(ev.target.value)}
                  />
                  <label htmlFor="floatingEmail">Email address</label>
                  <div className="invalid-feedback">Please enter a valid email address.</div>
                </div>

                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required
                    onChange={ev => setPasswordLogin(ev.target.value)}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                  <div className="invalid-feedback">Password is required.</div>
                </div>

                <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="termsCheck" required />
                    <label className="form-check-label" htmlFor="termsCheck">
                      I agree to the {' '}
                      <a target="_blank" href="https://github.com/hamentag/e-shop" className="text-decoration-underline">
                      terms and conditions
                      </a>
                    </label>
                    <div className="invalid-feedback">You must agree before submitting.</div>
                </div>

                <button className="btn btn-primary" type="submit">
                    Login
                </button>

                {loginError && (
                  <div className="text-danger mt-2">
                    {loginError}
                  </div>
                )}

                <p className='pt-1'>New customer?{' '}
                    <a onClick={() => openModal(
                                        <SignUpForm />,
                                        {
                                          title: 'SignUpForm',
                                           props: {
                    dialogClassName: 'modal-fullscreen-sm-down',
                    size: 'md'
                    }
                                        }
                                      )}  href="#" 
                    className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    >Sign Up
                    </a>
                </p>
  
        </form>
    )
}