// AuthDropdown.jsx

import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useAuthUI from '../hooks/useAuthUI';

import useOverlay from "../hooks/useOverlay";
   

export default function AuthDropdown({className}) {
    const navigate = useNavigate();

        const { auth, logout } = useAuth();
        const { launchSignUpForm, launchLoginForm } = useAuthUI()
        const { hideOffcanvas } = useOverlay()


    return (
        <ul className={`list-unstyled ${className}`}>
            {!auth.id ? (
                <>
                    <li><button className='dropdown-item' onClick={launchLoginForm}>Log In</button></li>
                    <li><button className='dropdown-item' onClick={launchSignUpForm}>Sign Up</button></li>
                </>
            ) : (
                <>
                    <li>
                        <Link className='dropdown-item' to="/orders"
                                onClick={hideOffcanvas}
                            >Orders
                        </Link>
                    </li>
                    <li>
                        <Link className='dropdown-item' to="/account"
                                onClick={hideOffcanvas}
                            >Profile
                        </Link>
                    </li>
                    <li>
                        <button className='dropdown-item' onClick={()=>{hideOffcanvas();logout()}}
                            >Quit
                        </button>
                    </li>
                </>
            )}
            
        </ul>
    )
}

