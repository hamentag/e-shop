import { useState, useEffect, useRef } from 'react'

export default function LoginRegister({ login, register, popUpAuthn, setPopUpAuthn }) {

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