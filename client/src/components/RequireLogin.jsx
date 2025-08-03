// src/components/RequireLogin.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

import useOverlay from '../hooks/useOverlay';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { REQUIRE_LOGIN } from '../utils/constants';



//  login-illustrations/

export default function RequireLogin() {
    const { openModal, hideOffcanvas } = useOverlay();

    const [content] = useState(() => {
        const i = Math.floor(Math.random() * REQUIRE_LOGIN.length);
        return REQUIRE_LOGIN[i];
    });

    return (
        <div className="text-center py-4">


            <h4>{content.title}</h4>
            <p className='py-3'>{content.message}</p>

            <div>
                <img src={`login-illustrations/${content.src}`} alt="Login illustration" className="img-fluid mb-3"
                    style={{ maxWidth: '12rem' }} />

            </div>

            <button className="btn act-btn mt-3 mx-1" onClick={() => openModal(
                <LoginForm />,
                {
                    title: 'LoginForm',
                    props: {
                        dialogClassName: 'modal-fullscreen-sm-down',
                        size: 'md'
                    }
                }
            )}

            >Log In
            </button>

            <button className="btn act-btn mt-3 mx-1" onClick={() => openModal(
                <SignUpForm />,
                {
                    title: 'SignUpForm',
                    props: {
                        dialogClassName: 'modal-fullscreen-sm-down',
                        size: 'md'
                    }
                }
            )}

            >Sign Up
            </button>
        </div>
    );
};

