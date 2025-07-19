// src/components/SignUpForm.jsx

import React, { useState, useEffect, useRef } from 'react';

import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';

import LoginForm from '../components/LoginForm'


export default function SignUpForm() {

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [confirmPasswordReg, setConfirmPasswordReg] = useState('');

  
  const [signUpError, setSignUpError] = useState('');

  const formRef = useRef(null);

  const { openModal, closeModal, showToast } = useOverlay();
  const { login, register } = useAuth();

  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  
  const [touchedConfirmPassword, setTouchedConfirmPassword] = useState(false);
    
  // const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  


  useEffect(() => {
    if (touchedConfirmPassword || formSubmitted) {
      if (!confirmPasswordReg) {
        setConfirmPasswordError('Please confirm your password.');
      } else if (passwordReg !== confirmPasswordReg) {
        setConfirmPasswordError('Passwords do not match.');
      } else {
        setConfirmPasswordError('');
      }
    }
  }, [passwordReg, confirmPasswordReg, touchedConfirmPassword, formSubmitted]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;

    setFormSubmitted(true);

    if (form.checkValidity() === false || passwordReg !== confirmPasswordReg) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    try {
      setSignUpError(''); // clear previous error
      await register({ email: emailReg, password: passwordReg, firstname, lastname });
      showToast({
                title: 'Sign Up',
                message: 'Sign Up Success',
                time: 'just now',
                duration: 5000
              });

      // Login automatically after creating account
      try {
        await login({ email: emailReg, password: passwordReg });
        closeModal();
        showToast({
              title: 'Login',
              message: 'Login Success',
              time: 'just now',
              duration: 5000
            });
      } catch (err) {
        setSignUpError('Account created, but login failed. Please try logging in manually.');
      }
    } catch (err) {
      setSignUpError(err.message);
      form.classList.remove('was-validated');
    }

  };


    return(
         <form ref={formRef} noValidate onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingFirstName" placeholder="First Name" required
                    onChange={(ev) => setFirstname(ev.target.value)}
                />
                  <label htmlFor="floatingFirstName">First Name</label>
                  <div className="invalid-feedback">First name is required.</div>
                </div>

                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="floatingLastName" placeholder="Last Name" required
                    onChange={(ev) => setLastname(ev.target.value)}
                  />
                  <label htmlFor="floatingLastName">Last Name</label>
                  <div className="invalid-feedback">Last name is required.</div>
                </div>


                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmailSignup"
                    placeholder="name@example.com"
                    required
                    onChange={(ev) => setEmailReg(ev.target.value)}
                  />
                  <label htmlFor="floatingEmailSignup">Email address</label>
                  <div className="invalid-feedback">Please enter a valid email address.</div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPasswordSignup"
                    placeholder="Password"
                    required
                    onChange={(ev) => setPasswordReg(ev.target.value)}
                  />
                  <label htmlFor="floatingPasswordSignup">Password</label>
                  <div className="invalid-feedback">Password is required.</div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={`form-control ${
                      formSubmitted && touchedConfirmPassword
                        ? confirmPasswordReg && confirmPasswordError === ''
                          ? 'custom-password-valid'
                          : 'custom-password-invalid'
                        : ''
                    }`}
                    id="floatingConfirmPassword"
                    placeholder="Confirm Password"
                    required
                    value={confirmPasswordReg}
                    onChange={(ev) => {
                      setConfirmPasswordReg(ev.target.value);
                      setTouchedConfirmPassword(true); // Validation when typing
                    }}
                  />
                  <label htmlFor="floatingConfirmPassword">Confirm Password</label>
                  <div
                    className="invalid-feedback"
                    style={{
                      display: touchedConfirmPassword && confirmPasswordError ? 'block' : 'none',
                    }}
                  >
                    {confirmPasswordError || 'Please confirm your password.'}
                  </div>

                </div>


                <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="termsCheck" required />
                    <label className="form-check-label" htmlFor="termsCheck">
                    I agree to the terms and conditions
                    </label>
                    <div className="invalid-feedback">You must agree before submitting.</div>
                </div>

                <button className="btn btn-primary" type="submit">
                    Sign Up
                </button>

                {signUpError && (
                  <div className="text-danger mt-2">
                    {signUpError}
                  </div>
                )}

                <p className='pt-1'>Already have an account?{' '}
                    <a onClick={() =>   openModal(
                        <LoginForm />,
                        {
                            title: 'LoginForm',
                            props: {
                                dialogClassName: 'modal-fullscreen-sm-down',
                                size: 'md'
                            }
                        }
                        )}  href="#" 
                        className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    >Log In
                    </a>
                </p> 

         </form>
    )
}

   