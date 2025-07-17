// src/components/LoginRegister.jsx

import { useState, useEffect, useRef } from 'react'

import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';


export default function LoginRegister() {


  const { popUpAuthn, setPopUpAuthn } = useOverlay();
  const { login, register } = useAuth();


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


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPopUpAuthn(null);
      }
    };

    // Attach event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setPopUpAuthn]);


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
                  <input value={emailReg} type='email' name='email' placeholder='Email' onChange={ev => setEmailReg(ev.target.value)} />
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

// ////////////////////


// // components/LoginRegister.jsx
// import { Modal } from 'react-bootstrap';
// import { useState, useEffect } from 'react'

// import useOverlay from '../hooks/useOverlay';
// import useAuth from '../hooks/useAuth';

// export default function LoginRegister() {
//   const { popUpAuthn, setPopUpAuthn } = useOverlay();
//   const { login, register } = useAuth();

//   const [hasAccount, setHasAccount] = useState(popUpAuthn === 'to-login');

//   const [emailLogin, setEmailLogin] = useState('');
//   const [passwordLogin, setPasswordLogin] = useState('');

//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [emailReg, setEmailReg] = useState('');
//   const [passwordReg, setPasswordReg] = useState('');

//   const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//   const handleClose = () => setPopUpAuthn(null);
  

//   const submitT0Login = ev => {
//     ev.preventDefault();
//     login({ email: emailLogin, password: passwordLogin });
//   }

//   const submitT0Register = ev => {
//     ev.preventDefault();
//     register({ email: emailReg, password: passwordReg, firstname, lastname });
//   }


//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') {
//         setPopUpAuthn(null);
//       }
//     };

//     // Attach event listener
//     document.addEventListener('keydown', handleKeyDown);

//     // Cleanup
//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [setPopUpAuthn]);

  
//   if (!popUpAuthn) return null;


//   return (
//     <Modal show={true} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>{hasAccount ? 'Login Form' : 'Signup Form'}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {/* Render your login/register form here */}
//         {hasAccount ? (
//           <div>

//             <div>
//               <div  >
//                 <h4>Sign in to your account</h4>
//                 <form onSubmit={submitT0Login} >


//                   {/* <input value={emailLogin} type='email' placeholder='Email' onChange={ev => setEmailLogin(ev.target.value)} />
//                   <input value={passwordLogin} type="password" placeholder='Password' onChange={ev => setPasswordLogin(ev.target.value)} />
//                   <button disabled={!(emailLogin && passwordLogin)}>Log In</button> */}


//                       <div className="form-floating is-invalid">
//                         <input value={emailLogin} type="email" className="form-control is-invalid" id="floatingInput" placeholder="name@example.com" 
//                           required onChange={ev => setEmailLogin(ev.target.value)}
//                         />
//                         <label htmlFor="floatingInput">Email address</label>
//                       </div>
//                       <div className="invalid-feedback">
//                         Please choose a username.
//                       </div>

//                       <div className="form-floating is-invalid">
//                         <input value={passwordLogin} type="password" className="form-control is-invalid" id="floatingPassword" placeholder="Password"
//                           required="" onChange={ev => setPasswordLogin(ev.target.value)}  
//                         />
//                         <label htmlFor="floatingPassword">Password</label>
//                       </div>
//                       <div className="invalid-feedback">
//                         Please choose a username.
//                       </div>

//                       <div className="col-12 mt-3">
//                         <button type="submit" className="btn btn-primary">Sign in</button>
//                       </div>



//                 </form>
//               </div>
//               Don't have an account?
//               <button onClick={() => { setHasAccount(false) }} className='signUp-link'>Sign Up</button>
//             </div>

//           </div>
//         ) : (
//           <div>

//             <div>
//               <div className='register-form' >
//                 <h4>Create a new account</h4>
//                 <form onSubmit={submitT0Register}>
//                   <input value={firstname} placeholder='First Name' onChange={ev => setFirstname(ev.target.value)} />
//                   <input value={lastname} placeholder='Last Name' onChange={ev => setLastname(ev.target.value)} />
//                   <input value={emailReg} type='email' name='email' placeholder='Email' onChange={ev => setEmailReg(ev.target.value)} />
//                   <input value={passwordReg} placeholder='Password' onChange={ev => setPasswordReg(ev.target.value)} />
//                   <button disabled={!(firstname && lastname && emailReg && passwordReg)}>Continuer</button>
//                 </form>
//               </div>
//               Already have an account?
//               <button onClick={() => { setHasAccount(true) }} className='login-link'>Log In</button>
//             </div>


//           </div>
//         )}

//         <div>{isMobile? "Tap outside to close" : "Press Esc or tap outside to close"}</div>
//       </Modal.Body>
//     </Modal>
//   );
// }


/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

/* 
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Floating Label Form</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>
  </head>
  <body class="p-5">

    <h1>Floating Label Form</h1>

    <form id="floatingForm" class="needs-validation" novalidate>

      <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingFirstName" placeholder="First Name" required>
        <label for="floatingFirstName">First Name</label>
        <div class="invalid-feedback">First name is required.</div>
      </div>

      <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingLastName" placeholder="Last Name" required>
        <label for="floatingLastName">Last Name</label>
        <div class="invalid-feedback">Last name is required.</div>
      </div>

      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" required>
        <label for="floatingEmail">Email address</label>
        <div class="invalid-feedback">Please enter a valid email address.</div>
      </div>

      <div class="form-floating mb-3">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" required>
        <label for="floatingPassword">Password</label>
        <div class="invalid-feedback">Password is required.</div>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="termsCheck" required>
        <label class="form-check-label" for="termsCheck">
          I agree to the terms and conditions
        </label>
        <div class="invalid-feedback">You must agree before submitting.</div>
      </div>

      <button class="btn btn-primary" type="submit">Submit</button>
    </form>

    <script>
      (() => {
        'use strict';
        const form = document.querySelector('#floatingForm');

        form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add('was-validated');
        }, false);
      })();
    </script>
  </body>
</html>



*/

 