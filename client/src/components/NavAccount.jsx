// src/components/NavAccount.jsx
import { useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useAuthUI from '../hooks/useAuthUI';
import AuthDropdown from "./AuthDropdown";



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

            < AuthDropdown className="list-unstyled dropdown-menu"/>

        </div>
    )
}