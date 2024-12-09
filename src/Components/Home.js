import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import your custom CSS file

function Home() {
  return (
    <div className="home-page d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
      <h1 className="mb-4">Welcome to the Quiz Application</h1>
      <p className="mb-4">Please login or register to start using the application.</p>

      <div className="home-actions">
        <span>
        <Link to="/login">
          <button id='btn1' className="btn btn-primary mx-2">Login</button>
        </Link>
        <Link to="/register">
          <button id='btn2' className="btn btn-secondary mx-2">Register</button>
        </Link>
        </span>
      </div>
    </div>
  );
}

export default Home;
