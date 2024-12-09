

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Registration.css'; // Import custom CSS for additional styling if needed
// import { RequestStatus } from './RequestStatus'; // Adjust the import path as needed

// function Registration() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false);
//   const navigate = useNavigate(); // Initialize useNavigate

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       // Register the user
//       const response = await axios.post('http://localhost:8080/auth/register', {
//         username, email, password, confirmPassword, isAdmin
//       });
  
//       if (response.status === 200) {
//         // Registration successful
//         if (isAdmin) {
//           // If admin, create admin request
//           const adminRequest = {
//             username,
//             email,
//             status: RequestStatus.PENDING // Assuming RequestStatus is an enum or similar structure
//           };
  
//           const requestResponse = await axios.get('http://localhost:8080/admin/requests/pending', adminRequest);
//           if (requestResponse.status === 200) {
//             alert('Registration successful. Please wait for Admin approval.');
//           } else {
//             throw new Error('Admin request creation failed.');
//           }
//         } else {
//           alert('Registration successful. Check your email!');
//         }
//         navigate('/'); // Redirect to home page on success
//       } else {
//         throw new Error('Registration failed. Please try again.');
//       }
  
//     } catch (error) {
//       console.error('Error during registration:', error);
//       alert(error.response?.data || 'Registration failed.Wait for Admin Approval ');
//       navigate('/')

//     }
//   };
  

//   return (
//     <div className='body'>
//       <div className="container1 mt-5">
//         <h2 className="text-center mb-4">Register</h2>
//         <form onSubmit={handleRegister} className="w-100 mx-auto" style={{ maxWidth: '400px' }}>
//           <div className="mb-3">
//             <label className="form-label">Full Name</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Enter your full name"
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               placeholder="Enter email"
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Enter password"
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Confirm Password</label>
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Confirm password"
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-check mb-3">
//             <input
//               type="checkbox"
//               className="form-check-input"
//               checked={isAdmin}
//               onChange={(e) => setIsAdmin(e.target.checked)}
//             />
//             <label className="form-check-label">Register as Admin</label>
//           </div>
//           <button type="submit" className="btn btn-primary w-100">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Registration;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Registration.css';
import { RequestStatus } from './RequestStatus'; // Adjust the import path as needed

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return; // Exit the function if passwords do not match
    }

    try {
      // Register the user
      const response = await axios.post('https://quizapplicationbackend-production.up.railway.app/auth/register', {
        username,
        email,
        password,
        confirmPassword,
        isAdmin,
      });

      if (response.status === 200) {
        // Registration successful
        if (isAdmin) {
          // If admin, create admin request
          const adminRequest = {
            username,
            email,
            status: RequestStatus.PENDING, // Assuming RequestStatus is an enum or similar structure
          };

          const requestResponse = await axios.get('https://quizapplicationbackend-production.up.railway.app/admin/requests/pending', adminRequest);
          if (requestResponse.status === 200) {
            alert('Registration successful. Please wait for Admin approval.');
          } else {
            throw new Error('Admin request creation failed.');
          }
        } else {
          alert('Registration successful. Check your email!');
        }
        navigate('/'); // Redirect to home page on success
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.response?.data || 'Registration failed.');
      navigate('/');
    }
  };

  return (
    <div className='body'>
      <div className="container1 mt-5">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister} className="w-100 mx-auto" style={{ maxWidth: '400px' }}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label className="form-check-label">Register as Admin</label>
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
