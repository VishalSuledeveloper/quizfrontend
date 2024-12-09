
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Import custom CSS for further customization
import Logo from './Images/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear(); 
        //localStorage.clear();
        navigate('/login'); 
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top custom-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img 
                        src={Logo} 
                        alt="Logo" 
                        width="250" 
                        height="30" 
                        className="d-inline-block align-top custom-logo"
                    />
                </Link>

                {/* Navbar Toggle for Mobile */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                    </ul>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
