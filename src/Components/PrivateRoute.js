import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true'; // Assuming you store isAdmin in sessionStorage

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Redirect based on admin status
  if (isAdmin) {
    return <Navigate to="/admin" />; // Redirect to AdminPanel if admin
  } else {
    return <Navigate to="/quizzes" />; // Redirect to ViewQuizzes if not admin
  }

  return children; // Render children if no redirection is needed
}

export default PrivateRoute;
