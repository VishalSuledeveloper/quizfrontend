import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Login.css'
function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('https://quizapplicationbackend-production.up.railway.app/auth/login', { email, password });
        console.log("response", response.data);
        
        if (response && response.data) {
            console.log("Admin status:", response.data.admin); // Corrected here
            console.log("User ID:", response.data.userId); // Log userId
            alert(response.data.message); // Show success message
            
            // Store userId in localStorage
            const userId=response.data.userId;
            console.log("userId:::",userId);
           // localStorage.setItem('userId', userId);
           localStorage.setItem('user', JSON.stringify({ userId: response.data.userId }));
        
            
            // Check isAdmin status and redirect accordingly
            if (response.data.admin !== undefined) { // Corrected here
                if (response.data.admin===true) { // Corrected here
                    navigate('/admin'); // Redirect to admin page
                } else {
                    navigate('/quizzes'); // Redirect to quizzes page
                }
            } else {
                alert("Admin status not found!");
            }
        } else {
            alert("Unexpected response format!");
        }
    } catch (error) {
        alert("Login failed!");
    }
};


  return (
    <div className='body'>
      <div className="container2 mt-5">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleLogin} className="w-50 mx-auto">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
    </div>
  );
}
export default Login;


