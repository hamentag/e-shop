import { useEffect, useRef } from 'react';
import useAuth from './useAuth';
import useOverlay from './useOverlay';
import useAuthUI from './useAuthUI';
import { Link } from 'react-router-dom';

export default function useGreeting() {
  const { auth, firstTimeUser } = useAuth();
  const { showActionToast } = useOverlay();
  const { launchLoginForm, launchSignUpForm } = useAuthUI();
  const prevAuthRef = useRef(null);

  useEffect(() => {
    const prev = prevAuthRef.current;

    if (!prev?.id && auth?.id) {
      const greeting = firstTimeUser ? 'Thanks for joining us' :  'Welcome back';
      showActionToast(`${greeting}, ${auth.firstname}`, (
        <Link to='/cart'>
          <button className="btn btn-sm act-btn">See cart</button>
        </Link>
       
      ));
    } else if (prev?.id && !auth?.id) {
      showActionToast('You have been logged out.', (
        <button className="btn btn-sm act-btn" onClick={launchLoginForm}>Log in again</button>
      ));
    } else if (!auth?.id) {
      showActionToast('Welcome! Please log in.', (
        <div>
          <button className="btn btn-sm w-75 mb-2 mx-auto act-btn" onClick={launchLoginForm}>Log in</button>
          <p className='pt-1'>New customer?{' '}
            <a href="#" onClick={launchSignUpForm}>Sign Up</a>
          </p>
        </div>
      ));
    }

    prevAuthRef.current = auth;
  }, [auth]);
}
