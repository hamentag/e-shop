// src/hooks/useAuthUI.js

import { useCallback } from 'react';
import useOverlay from './useOverlay';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';

export default function useAuthUI() {
  const { openModal } = useOverlay();

  const launchLoginForm = useCallback(() => {
    openModal(<LoginForm />, {
      title: 'Login',
      props: {
        dialogClassName: 'modal-fullscreen-sm-down',
        size: 'md',
      },
    });
  }, [openModal]);

  const launchSignUpForm = useCallback(() => {
    openModal(<SignUpForm />, {
      title: 'Sign Up',
      props: {
        dialogClassName: 'modal-fullscreen-sm-down',
        size: 'md',
      },
    });
  }, [openModal]);

  return {
    launchLoginForm,
    launchSignUpForm,
  };
}
