import { useEffect, useRef } from 'react';
import useAuth from './useAuth';
import useOverlay from './useOverlay';
import useAuthUI from './useAuthUI';

export default function useGreeting() {
  const { auth } = useAuth();
  const { showActionToast } = useOverlay();
  const { launchLoginForm, launchSignUpForm } = useAuthUI();
  const prevAuthRef = useRef(null);

  useEffect(() => {
    const prev = prevAuthRef.current;

    if (!prev?.id && auth?.id) {
      showActionToast(`Welcome back, ${auth.firstname}`, (
        <button className="btn btn-primary btn-sm">See cart</button>
      ));
    } else if (prev?.id && !auth?.id) {
      showActionToast('You have been logged out.', (
        <button className="btn btn-outline-primary btn-sm" onClick={launchLoginForm}>Log in again</button>
      ));
    } else if (!auth?.id) {
      showActionToast('Welcome! Please log in.', (
        <div>
          <button className="btn btn-primary btn-sm w-75 mb-2 mx-auto" onClick={launchLoginForm}>Log in</button>
          <p className='pt-1'>New customer?{' '}
            <a href="#" onClick={launchSignUpForm}>Sign Up</a>
          </p>
        </div>
      ));
    }

    prevAuthRef.current = auth;
  }, [auth]);
}
