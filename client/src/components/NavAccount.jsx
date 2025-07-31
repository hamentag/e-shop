// src/components/NavAccount.jsx
import { useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useAuthUI from '../hooks/useAuthUI';
import useCart from '../hooks/useCart';
import useOverlay from "../hooks/useOverlay";



export default function NavAccount() {
    const navigate = useNavigate();

    const { auth, logout } = useAuth();

    const { launchSignUpForm, launchLoginForm } = useAuthUI()

   

    return (
        <div className="nav-item dropdown btn flex-shrink-1 p-0 nav-btn nav-account">
            <button className="nav-link dropdown-toggle flex-shrink-1"
                role="button" data-bs-toggle="dropdown" aria-expanded="false" >
                <span><i className="bi bi-person fs-4"></i></span>
                <span className="fname-account">
                    {auth.id ? `${auth.firstname}` : 'Account'}
                </span>
            </button>

            <ul className="dropdown-menu">
              {!auth.id ? (
                <>
                  <li><button className='dropdown-item' onClick={launchLoginForm}>Log In</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className='dropdown-item' onClick={launchSignUpForm}>Sign Up</button></li>
                </>
              ) : (
                <>
                  <li><Link className='dropdown-item' to="/orders">Orders</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className='dropdown-item' to="/account">Profile</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className='dropdown-item' onClick={logout}>Quit</button></li>
                </>
              )}
            </ul>


        </div>
    )
}