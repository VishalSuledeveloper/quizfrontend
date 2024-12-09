import React, { useState } from 'react';
import axios from 'axios';

const QuizAccess = ({ quizId,  startQuiz }) => {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');

     const currentUserId = localStorage.getItem('userId'); // Retrieve from localStorage

    console.log("Current User Id ",currentUserId);
    const handleAccessCodeSubmit = async () => {
        if (!currentUserId) {
        setError('User not logged in. Please login first.');
        return;
    }
        try {
            const response = await axios.post('https://quizapplicationbackend-production.up.railway.app/api/user/verify-quiz-access', null, {
                params: {
                    quizId,
                    accessCode,
                    userId: currentUserId
                }
            });

            if (response.data === "Access granted") {
                // Allow the user to start the quiz
                startQuiz(quizId);
            } else {
                setError(response.data);
            }
        } catch (error) {
            setError('Access denied: ' + error.response.data);
        }
    };

    return (
        <div>
            <h3>Enter Access Code for Quiz</h3>
            <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Access Code"
            />
            <button onClick={handleAccessCodeSubmit}>Start Quiz</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default QuizAccess;
