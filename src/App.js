import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Registration';
import AdminPanel from './Components/AdminPanel';
import PrivateRoute from './Components/PrivateRoute';
import Navbar from './Components/Navbar';
import TakeQuiz from './Components/TakeQuiz';
import QuizList from './Components/QuizList';
import AdminApprovalPage from './Components/AdminApprovalPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  useEffect(() => {
    document.title = 'QuizApp';  // Update the title here
   
  }, []);
  
  return (
    <Router>
       <Navbar  />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protecting routes */}
        <Route 
          path="/private" 
          element={
            <PrivateRoute>
              {/* No need to specify a child component here, as it redirects based on isAdmin */}
            </PrivateRoute>
          } 
        />
        
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/quizzes" element={<QuizList/>} />
        <Route path="/quizzes/:quizId" element={<TakeQuiz />} />
        <Route path="/admin/approve" element={<AdminApprovalPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;

