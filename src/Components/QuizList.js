// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './QuizList.css';


// const QuizList = () => {
//     const [quizzes, setQuizzes] = useState([]);
//     const [error, setError] = useState(null); // Store any error messages
//     const navigate = useNavigate(); // For navigation

//     useEffect(() => {
//         const fetchQuizzes = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/api/admin/quizzes');
//                 setQuizzes(response.data);
//             } catch (error) {
//                 console.error('Error fetching quizzes:', error);
//             }
//         };

//         fetchQuizzes();
//     }, []);

//     const handleTakeQuiz = (quizId) => {
//         // Ask user for access code
//         const enteredAccessCode = prompt('Please enter the access code for this quiz:');
        
//         if (enteredAccessCode) {
//             // Verify the access code by sending it to the backend
//             verifyAccessCode(quizId, enteredAccessCode);
//         }
//     };

//     const verifyAccessCode = async (quizId, enteredAccessCode) => {
//         const userData = JSON.parse(localStorage.getItem('user')); // or sessionStorage.getItem('user')
//         const userId = userData ? userData.userId : null; // Extract user ID

//         if (!userId) {
//             setError("User not logged in or invalid.");
//             return;
//         }
        
//         try {
//             const response = await axios.post('http://localhost:8080/api/user/verify-quiz-access', {
//                 quizId,
//                 accessCode: enteredAccessCode,
//                 userId
//             });

//             // If the access code is correct, navigate to the quiz page
//             if (response.status === 200) {
//                 navigate(`/quizzes/${quizId}`);
//             }
//         } catch (error) {
//             // Handle any error (e.g., invalid access code)
//             setError('Invalid access code or you have already taken this quiz.');
//         }
//     };

//     // Function to check if the quiz is available based on current date
//     const isQuizAvailable = (startDateTime, endDateTime) => {
//         const currentDate = new Date();
//         return new Date(startDateTime) <= currentDate && new Date(endDateTime) >= currentDate;
//     };

//     return (
//         <div className="container3 mt-5">
//             <h2 className="text-center mb-4">Scheduled Quizzes</h2>
//             {error && <div className="alert alert-danger">{error}</div>}
//             <ul className="list-group">
//                 {quizzes.map((quiz) => (
//                     <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
//                         <div>
//                             <h5>{quiz.subject}</h5>
//                             <p>
//                                 Start Date & Time: {new Date(quiz.startDateTime).toLocaleString()} <br />
//                                 End Date & Time: {new Date(quiz.endDateTime).toLocaleString()}
//                             </p>
//                         </div>
//                         <button
//                             onClick={() => handleTakeQuiz(quiz.id)}
//                             className="btn btn-primary"
//                             disabled={!isQuizAvailable(quiz.startDateTime, quiz.endDateTime)} // Disable if not available
//                         >
//                             {isQuizAvailable(quiz.startDateTime, quiz.endDateTime) ? 'Take Quiz' : 'Quiz Not Available'}
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default QuizList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QuizList.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null);
    const [userHistory, setUserHistory] = useState(null); // State to store user history
    const [showHistory, setShowHistory] = useState(false); // Toggle user history display
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('https://quizapplicationbackend-production.up.railway.app/api/admin/quizzes');
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    const handleTakeQuiz = (quizId) => {
        const enteredAccessCode = prompt('Please enter the access code for this quiz:');
        if (enteredAccessCode) {
            verifyAccessCode(quizId, enteredAccessCode);
        }
    };

    const verifyAccessCode = async (quizId, enteredAccessCode) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData ? userData.userId : null;

        if (!userId) {
            setError("User not logged in or invalid.");
            return;
        }

        try {
            const response = await axios.post('https://quizapplicationbackend-production.up.railway.app/api/user/verify-quiz-access', {
                quizId,
                accessCode: enteredAccessCode,
                userId
            });

            if (response.status === 200) {
                navigate(`/quizzes/${quizId}`);
            }
        } catch (error) {
            setError('Invalid access code or you have already taken this quiz.');
        }
    };

    const isQuizAvailable = (startDateTime, endDateTime) => {
        const currentDate = new Date();
        return new Date(startDateTime) <= currentDate && new Date(endDateTime) >= currentDate;
    };

    const fetchUserHistory = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData ? userData.userId : null;

        if (!userId) {
            setError("User not logged in or invalid.");
            return;
        }

        try {
            const response = await axios.get(`https://quizapplicationbackend-production.up.railway.app/api/user/user-history?userId=${userId}`);
            setUserHistory(response.data);
            setShowHistory(true); // Show the user history modal or section
            console.log("data",response.data)
            console.log(userHistory);
        } catch (error) {
            console.error('Error fetching user history:', error);
        }
    };
    useEffect(() => {
        console.log("User History state updated:", userHistory);

    }, [userHistory]);

    

    return (
        <div className="container3 mt-5">
            <div className="d-flex justify-content-between">
                <h2>Scheduled Quizzes</h2>
                <button onClick={fetchUserHistory} className="btn btn-info">Student Details</button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group">
                {quizzes.map((quiz) => (
                    <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{quiz.subject}</h5>
                            <p>
                                Start Date & Time: {new Date(quiz.startDateTime).toLocaleString()} <br />
                                End Date & Time: {new Date(quiz.endDateTime).toLocaleString()}
                            </p>
                        </div>
                        <button
                            onClick={() => handleTakeQuiz(quiz.id)}
                            className="btn btn-primary"
                            disabled={!isQuizAvailable(quiz.startDateTime, quiz.endDateTime)}
                        >
                            {isQuizAvailable(quiz.startDateTime, quiz.endDateTime) ? 'Take Quiz' : 'Quiz Not Available'}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Display User History in a Modal */}
            {showHistory && userHistory && userHistory.length > 0 && (
    <div className="user-history-modal">
        <div className="modal-content">
            <h4>Student Details</h4>
            <p><strong>Name:</strong> {userHistory[0]?.user?.username}</p>
            <p><strong>Email:</strong> {userHistory[0]?.user?.email}</p>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {userHistory.map((record, index) => (
                        <tr key={index}>
                            <td>{record.quiz.subject}</td> {/* Accessing quiz subject */}
                            <td>{record.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setShowHistory(false)} className="btn btn-secondary">Close</button>
        </div>
    </div>
)}

        </div>
    );
};

export default QuizList;
