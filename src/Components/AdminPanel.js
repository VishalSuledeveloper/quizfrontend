import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';

const AdminPanel = () => {
    const [subject, setSubject] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [questions, setQuestions] = useState(['']);
    const [options, setOptions] = useState([['']]);
    const [correctAnswers, setCorrectAnswers] = useState(['']);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [userDetails, setUserDetails] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://quizapplicationbackend-production.up.railway.app/api/admin/quizzes');
                setQuizzes(response.data);
            } catch (error) {
                alert('Error fetching quizzes: ' + error.message);
            }
            setLoading(false);
        };
        fetchQuizzes();
    }, []);

    const handleAddQuestion = () => {
        setQuestions([...questions, '']);
        setOptions([...options, ['']]);
        setCorrectAnswers([...correctAnswers, '']);
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(questions.filter((_, qIndex) => qIndex !== index));
        setOptions(options.filter((_, oIndex) => oIndex !== index));
        setCorrectAnswers(correctAnswers.filter((_, cIndex) => cIndex !== index));
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newOptions = [...options];
        newOptions[questionIndex][optionIndex] = value;
        setOptions(newOptions);
    };

    const handleCorrectAnswerChange = (index, value) => {
        const newCorrectAnswers = [...correctAnswers];
        newCorrectAnswers[index] = value;
        setCorrectAnswers(newCorrectAnswers);
    };

    const handleAddOption = (questionIndex) => {
        const newOptions = [...options];
        newOptions[questionIndex].push('');
        setOptions(newOptions);
    };

    const handleDeleteQuiz = async (quizId) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await axios.delete(`https://quizapplicationbackend-production.up.railway.app/api/admin/quizzes/${quizId}`);
                setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
                alert('Quiz deleted successfully!');
            } catch (error) {
                alert('Error deleting quiz: ' + error.message);
            }
        }
    };

    const resetForm = () => {
        setSubject('');
        setStartDateTime('');
        setEndDateTime('');
        setAccessCode('');
        setQuestions(['']);
        setOptions([['']]);
        setCorrectAnswers(['']);
        setSelectedQuizId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const startDateObj = new Date(startDateTime);
        const endDateObj = new Date(endDateTime);

        if (startDateObj < currentDate) {
            alert('The start date must be in the future.');
            return;
        }

        if (endDateObj <= startDateObj) {
            alert('The end date must be after the start date.');
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            if (options[i].length < 2) {
                alert(`Question ${i + 1} must have at least 2 options.`);
                return;
            }
            if (!options[i].includes(correctAnswers[i])) {
                alert(`Correct answer for Question ${i + 1} must be one of the options.`);
                return;
            }
        }

        setLoading(true);
        try {
            const quiz = {
                subject,
                startDateTime,
                endDateTime,
                accessCode,
                questions,
                options,
                correctAnswers,
            };

            if (selectedQuizId) {
                await axios.put(`https://quizapplicationbackend-production.up.railway.app/api/admin/quizzes/${selectedQuizId}`, quiz);
                alert('Quiz updated successfully!');
            } else {
                await axios.post('https://quizapplicationbackend-production.up.railway.app/api/admin/quizzes', quiz);
                alert('Quiz created successfully!');
            }

            resetForm();
        } catch (error) {
            alert('Error creating/updating quiz: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditQuiz = (quiz) => {
        setSelectedQuizId(quiz.id);
        setSubject(quiz.subject);
        setStartDateTime(quiz.startDateTime);
        setEndDateTime(quiz.endDateTime);
        setAccessCode(quiz.accessCode);
        setQuestions(quiz.questions);
        setOptions(quiz.options);
        setCorrectAnswers(quiz.correctAnswers);
    };

    // const fetchUserDetails = async (subject) => {
    //     subject = subject.trim(); // Trim whitespace
    //     setUserLoading(true);
    //     setSelectedSubject(subject);
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/admin/quizzes/user-scores/${subject}`);
    //         setUserDetails(response.data);
    //         console.log("Subject Information", response.data);
    //     } catch (error) {
    //         alert('Error fetching user details: ' + error.message);
    //     }
    //     setUserLoading(false);
    // };
    const fetchUserDetails = async (subject) => {
        subject = subject.trim(); // Trim whitespace
        setUserLoading(true);
        setSelectedSubject(subject);
    
        try {
            console.log(`Requesting user details for subject: ${subject}`);
            const response = await axios.get(`https://quizapplicationbackend-production.up.railway.app/api/admin/quizzes/user-scores/${subject}`);
            console.log("Fetched user details:", response.data);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error.response || error.message);
            alert('Error fetching user details: ' + (error.response?.data?.message || error.message));
        } finally {
            setUserLoading(false);
        }
    };
    

    return (
        <div className="admin-panel container mt-5">
            <h2 className="text-center mb-4">Admin Panel</h2>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    <form onSubmit={handleSubmit} className="admin-form shadow-lg p-4 rounded">
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Quiz Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">Start Date Time
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">End Date Time
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={endDateTime}
                                onChange={(e) => setEndDateTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Access Code"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                required
                            />
                        </div>

                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="question-section mb-4 p-3 rounded shadow-sm">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder={`Question ${qIndex + 1}`}
                                    value={question}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    required
                                />
                                {options[qIndex].map((option, oIndex) => (
                                    <input
                                        key={oIndex}
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder={`Option ${oIndex + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        required
                                    />
                                ))}

                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Correct Answer"
                                    value={correctAnswers[qIndex]}
                                    onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                                    required
                                />
                                <div className="mb-2">
                                    <button type="button" className="btn btn-secondary" onClick={() => handleAddOption(qIndex)}>
                                        Add Option
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteQuestion(qIndex)}>
                                        Delete Question
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="btn btn-primary mb-3" onClick={handleAddQuestion}>
                            Add Question
                        </button>
                        <button type="submit" className="btn btn-success">{selectedQuizId ? 'Update Quiz' : 'Create Quiz'}</button>
                    </form>

                    <h3 className="mt-5">Existing Quizzes</h3>
                    {quizzes.length > 0 ? (
                        <ul className="list-group">
                            {quizzes.map((quiz) => (
                                <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {quiz.subject}
                                    <div>
                                        <button className="btn btn-sm btn-primary mr-2" onClick={() => handleEditQuiz(quiz)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteQuiz(quiz.id)}>
                                            Delete
                                        </button>
                                        <button className="btn btn-sm btn-info" onClick={() => fetchUserDetails(quiz.subject)}>
                                            Student Quiz History
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No quizzes available.</p>
                    )}

                    {userDetails.length > 0 && (
                        <div className="mt-4">
                            <h4>Student Details for: {selectedSubject}</h4>
                            {userLoading ? (
                                <div>Loading user details...</div>
                            ) : (
                                <ul className="list-group">
                                    
                                    {userDetails.map((user, index) => (
                                        
                                        <li key={index} className="list-group-item">
                                            <strong>Name:</strong> {user.username} <br />
                                            <strong>Email:</strong> {user.email}<br />
                                            <strong>Score:</strong> {user.score} 
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPanel;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Admin.css';

// const AdminPanel = () => {
//     const [subject, setSubject] = useState('');
//     const [startDateTime, setStartDateTime] = useState('');
//     const [endDateTime, setEndDateTime] = useState('');
//     const [accessCode, setAccessCode] = useState('');
//     const [questions, setQuestions] = useState(['']);
//     const [options, setOptions] = useState([['']]);
//     const [correctAnswers, setCorrectAnswers] = useState(['']);
//     const [quizzes, setQuizzes] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedQuizId, setSelectedQuizId] = useState(null);
//     const [userDetails, setUserDetails] = useState([]);
//     const [userLoading, setUserLoading] = useState(false);
//     const [selectedSubject, setSelectedSubject] = useState('');

//     useEffect(() => {
//         const fetchQuizzes = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get('http://localhost:8080/api/admin/quizzes');
//                 setQuizzes(response.data);
//             } catch (error) {
//                 alert('Error fetching quizzes: ' + error.message);
//             }
//             setLoading(false);
//         };
//         fetchQuizzes();
//     }, []);

//     const handleAddQuestion = () => {
//         setQuestions([...questions, '']);
//         setOptions([...options, ['']]);
//         setCorrectAnswers([...correctAnswers, '']);
//     };

//     const handleDeleteQuestion = (index) => {
//         setQuestions(questions.filter((_, qIndex) => qIndex !== index));
//         setOptions(options.filter((_, oIndex) => oIndex !== index));
//         setCorrectAnswers(correctAnswers.filter((_, cIndex) => cIndex !== index));
//     };

//     const handleQuestionChange = (index, value) => {
//         const newQuestions = [...questions];
//         newQuestions[index] = value;
//         setQuestions(newQuestions);
//     };

//     const handleOptionChange = (questionIndex, optionIndex, value) => {
//         const newOptions = [...options];
//         newOptions[questionIndex][optionIndex] = value;
//         setOptions(newOptions);
//     };

//     const handleCorrectAnswerChange = (index, value) => {
//         const newCorrectAnswers = [...correctAnswers];
//         newCorrectAnswers[index] = value;
//         setCorrectAnswers(newCorrectAnswers);
//     };

//     const handleAddOption = (questionIndex) => {
//         const newOptions = [...options];
//         newOptions[questionIndex].push('');
//         setOptions(newOptions);
//     };

//     const handleDeleteQuiz = async (quizId) => {
//         if (window.confirm('Are you sure you want to delete this quiz?')) {
//             try {
//                 await axios.delete(`http://localhost:8080/api/admin/quizzes/${quizId}`);
//                 setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
//                 alert('Quiz deleted successfully!');
//             } catch (error) {
//                 alert('Error deleting quiz: ' + error.message);
//             }
//         }
//     };

//     const resetForm = () => {
//         setSubject('');
//         setStartDateTime('');
//         setEndDateTime('');
//         setAccessCode('');
//         setQuestions(['']);
//         setOptions([['']]);
//         setCorrectAnswers(['']);
//         setSelectedQuizId(null);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const currentDate = new Date();
//         const startDateObj = new Date(startDateTime);
//         const endDateObj = new Date(endDateTime);

//         if (startDateObj < currentDate) {
//             alert('The start date must be in the future.');
//             return;
//         }

//         if (endDateObj <= startDateObj) {
//             alert('The end date must be after the start date.');
//             return;
//         }

//         // Validate that each question has at least 2 options
//         for (let i = 0; i < questions.length; i++) {
//             if (options[i].length < 2) {
//                 alert(`Question ${i + 1} must have at least 2 options.`);
//                 return;
//             }
//             if (!options[i].includes(correctAnswers[i])) {
//                 alert(`Correct answer for Question ${i + 1} must be one of the options.`);
//                 return;
//             }
//         }

//         setLoading(true);
//         try {
//             const quiz = {
//                 subject,
//                 startDateTime,
//                 endDateTime,
//                 accessCode,
//                 questions,
//                 options,
//                 correctAnswers,
//             };

//             if (selectedQuizId) {
//                 await axios.put(`http://localhost:8080/api/admin/quizzes/${selectedQuizId}`, quiz);
//                 alert('Quiz updated successfully!');
//             } else {
//                 await axios.post('http://localhost:8080/api/admin/quizzes', quiz);
//                 alert('Quiz created successfully!');
//             }

//             resetForm();
//         } catch (error) {
//             alert('Error creating/updating quiz: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEditQuiz = (quiz) => {
//         setSelectedQuizId(quiz.id);
//         setSubject(quiz.subject);
//         setStartDateTime(quiz.startDateTime);
//         setEndDateTime(quiz.endDateTime);
//         setAccessCode(quiz.accessCode);
//         setQuestions(quiz.questions);
//         setOptions(quiz.options);
//         setCorrectAnswers(quiz.correctAnswers);
//     };

//     // Function to fetch user details including scores based on the subject
//     const fetchUserDetails = async (subject) => {
//         setUserLoading(true);
//         setSelectedSubject(subject); // Set the selected subject for display
//         try {
//             const response = await axios.get(`http://localhost:8080/api/admin/quizzes/user-scores/${subject}`);
//             setUserDetails(response.data);
//             console.log("Subject Information",response.data);
//         } catch (error) {
//             alert('Error fetching user details: ' + error.message);
//         }
//         setUserLoading(false);
//     };

//     return (
//         <div className="admin-panel container mt-5">
//             <h2 className="text-center mb-4">Admin Panel</h2>
//             {loading ? (
//                 <div className="text-center">Loading...</div>
//             ) : (
//                 <>
//                     <form onSubmit={handleSubmit} className="admin-form shadow-lg p-4 rounded">
//                         <div className="form-group mb-3">
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Quiz Subject"
//                                 value={subject}
//                                 onChange={(e) => setSubject(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group mb-3">Start Date Time
//                             <input
//                                 type="datetime-local"
//                                 className="form-control"
//                                 value={startDateTime}
//                                 onChange={(e) => setStartDateTime(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group mb-3">End Date Time
//                             <input
//                                 type="datetime-local"
//                                 className="form-control"
//                                 value={endDateTime}
//                                 onChange={(e) => setEndDateTime(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group mb-3">
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Access Code"
//                                 value={accessCode}
//                                 onChange={(e) => setAccessCode(e.target.value)}
//                                 required
//                             />
//                         </div>

//                         {questions.map((question, qIndex) => (
//                             <div key={qIndex} className="question-section mb-4 p-3 rounded shadow-sm">
//                                 <input
//                                     type="text"
//                                     className="form-control mb-2"
//                                     placeholder={`Question ${qIndex + 1}`}
//                                     value={question}
//                                     onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
//                                     required
//                                 />
//                                 {options[qIndex].map((option, oIndex) => (
//                                     <input
//                                         key={oIndex} // You might also consider using a more unique identifier if available
//                                         type="text"
//                                         className="form-control mb-2"
//                                         placeholder={`Option ${oIndex + 1}`}
//                                         value={option}
//                                         onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
//                                         required
//                                     />
//                                 ))}

//                                 <input
//                                     type="text"
//                                     className="form-control mb-2"
//                                     placeholder="Correct Answer"
//                                     value={correctAnswers[qIndex]}
//                                     onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
//                                     required
//                                 />
//                                 <div className="mb-2">
//                                     <button type="button" className="btn btn-secondary" onClick={() => handleAddOption(qIndex)}>
//                                         Add Option
//                                     </button>
//                                     <button type="button" className="btn btn-danger" onClick={() => handleDeleteQuestion(qIndex)}>
//                                         Delete Question
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                         <button type="button" className="btn btn-primary mb-3" onClick={handleAddQuestion}>
//                             Add Question
//                         </button>
//                         <button type="submit" className="btn btn-success">{selectedQuizId ? 'Update Quiz' : 'Create Quiz'}</button>
//                     </form>

//                     <h3 className="mt-5">Existing Quizzes</h3>
//                     {quizzes.length > 0 ? (
//                         <ul className="list-group">
//                             {quizzes.map((quiz) => (
//                                 <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
//                                     <div>
//                                         <h5>{quiz.subject}</h5>
//                                         <p>Start: {new Date(quiz.startDateTime).toLocaleString()}</p>
//                                         <p>End: {new Date(quiz.endDateTime).toLocaleString()}</p>
//                                         <p>Access Code: {quiz.accessCode}</p>
//                                         <button className="btn btn-info mt-2" onClick={() => fetchUserDetails(quiz.subject)}>View Scores</button>
//                                     </div>
//                                     <div>
//                                         <button className="btn btn-warning" onClick={() => handleEditQuiz(quiz)}>Edit</button>
//                                         <button className="btn btn-danger" onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <div className="mt-3">No quizzes found.</div>
//                     )}

//                     {userDetails.length > 0 && (
//                         <>
//                             <h3 className="mt-5">User Scores for {selectedSubject}</h3>
//                             {userLoading ? (
//                                 <div>Loading user details...</div>
//                             ) : (
//                                 <ul className="list-group">
//                                     {userDetails.map((user) => (
//                                         <li key={user.id} className="list-group-item">
//                                             <div>{user.name} - Score: {user.score}</div>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default AdminPanel;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Admin.css';

// const AdminPanel = () => {
//     const [subject, setSubject] = useState('');
//     const [startDateTime, setStartDateTime] = useState('');
//     const [endDateTime, setEndDateTime] = useState('');
//     const [accessCode, setAccessCode] = useState('');
//     const [questions, setQuestions] = useState(['']);
//     const [options, setOptions] = useState([['']]);
//     const [correctAnswers, setCorrectAnswers] = useState(['']);
//     const [quizzes, setQuizzes] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedQuizId, setSelectedQuizId] = useState(null);
//     const [userDetails, setUserDetails] = useState([]);
//     const [userLoading, setUserLoading] = useState(false);

//     useEffect(() => {
//         const fetchQuizzes = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get('http://localhost:8080/api/admin/quizzes');
//                 setQuizzes(response.data);
//             } catch (error) {
//                 alert('Error fetching quizzes: ' + error.message);
//             }
//             setLoading(false);
//         };
//         fetchQuizzes();
//     }, []);

//     const handleAddQuestion = () => {
//         setQuestions([...questions, '']);
//         setOptions([...options, ['']]);
//         setCorrectAnswers([...correctAnswers, '']);
//     };

//     const handleDeleteQuestion = (index) => {
//         setQuestions(questions.filter((_, qIndex) => qIndex !== index));
//         setOptions(options.filter((_, oIndex) => oIndex !== index));
//         setCorrectAnswers(correctAnswers.filter((_, cIndex) => cIndex !== index));
//     };

//     const handleQuestionChange = (index, value) => {
//         const newQuestions = [...questions];
//         newQuestions[index] = value;
//         setQuestions(newQuestions);
//     };

//     const handleOptionChange = (questionIndex, optionIndex, value) => {
//         const newOptions = [...options];
//         newOptions[questionIndex][optionIndex] = value;
//         setOptions(newOptions);
//     };

//     const handleCorrectAnswerChange = (index, value) => {
//         const newCorrectAnswers = [...correctAnswers];
//         newCorrectAnswers[index] = value;
//         setCorrectAnswers(newCorrectAnswers);
//     };

//     const handleAddOption = (questionIndex) => {
//         const newOptions = [...options];
//         newOptions[questionIndex].push('');
//         setOptions(newOptions);
//     };

//     const handleDeleteQuiz = async (quizId) => {
//         if (window.confirm('Are you sure you want to delete this quiz?')) {
//             try {
//                 await axios.delete(`http://localhost:8080/api/admin/quizzes/${quizId}`);
//                 setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
//                 alert('Quiz deleted successfully!');
//             } catch (error) {
//                 alert('Error deleting quiz: ' + error.message);
//             }
//         }
//     };

//     const resetForm = () => {
//         setSubject('');
//         setStartDateTime('');
//         setEndDateTime('');
//         setAccessCode('');
//         setQuestions(['']);
//         setOptions([['']]);
//         setCorrectAnswers(['']);
//         setSelectedQuizId(null);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const currentDate = new Date();
//         const startDateObj = new Date(startDateTime);
//         const endDateObj = new Date(endDateTime);

//         if (startDateObj < currentDate) {
//             alert('The start date must be in the future.');
//             return;
//         }

//         if (endDateObj <= startDateObj) {
//             alert('The end date must be after the start date.');
//             return;
//         }

//         // Validate that each question has at least 2 options
//         for (let i = 0; i < questions.length; i++) {
//             if (options[i].length < 2) {
//                 alert(`Question ${i + 1} must have at least 2 options.`);
//                 return;
//             }
//             if (!options[i].includes(correctAnswers[i])) {
//                 alert(`Correct answer for Question ${i + 1} must be one of the options.`);
//                 return;
//             }
//         }

//         setLoading(true);
//         try {
//             const quiz = {
//                 subject,
//                 startDateTime,
//                 endDateTime,
//                 accessCode,
//                 questions,
//                 options,
//                 correctAnswers,
//             };

//             if (selectedQuizId) {
//                 await axios.put(`http://localhost:8080/api/admin/quizzes/${selectedQuizId}`, quiz);
//                 alert('Quiz updated successfully!');
//             } else {
//                 await axios.post('http://localhost:8080/api/admin/quizzes', quiz);
//                 alert('Quiz created successfully!');
//             }

//             resetForm();
//         } catch (error) {
//             alert('Error creating/updating quiz: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEditQuiz = (quiz) => {
//         setSelectedQuizId(quiz.id);
//         setSubject(quiz.subject);
//         setStartDateTime(quiz.startDateTime);
//         setEndDateTime(quiz.endDateTime);
//         setAccessCode(quiz.accessCode);
//         setQuestions(quiz.questions);
//         setOptions(quiz.options);
//         setCorrectAnswers(quiz.correctAnswers);
//     };

//     // Function to fetch user details including scores
//     const fetchUserDetails = async () => {
//         setUserLoading(true);
//         try {
//             const response = await axios.get('http://localhost:8080/api/admin/quizzes/user-scores');
//             setUserDetails(response.data);
//             console.log("user details",response.data);
//         } catch (error) {
//             alert('Error fetching user details: ' + error.message);
//         }
//         setUserLoading(false);
//     };

//     return (
//         <div className="admin-panel container mt-5">
//             <h2 className="text-center mb-4">Admin Panel</h2>
//             {loading ? (
//                 <div className="text-center">Loading...</div>
//             ) : (
//                 <>
//                     <form onSubmit={handleSubmit} className="admin-form shadow-lg p-4 rounded">
//                         <div className="form-group mb-3">
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Quiz Subject"
//                                 value={subject}
//                                 onChange={(e) => setSubject(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group mb-3">Start Date Time
//                             <input
//                                 type="datetime-local"
//                                 className="form-control"
//                                 value={startDateTime}
//                                 onChange={(e) => setStartDateTime(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group mb-3">End Date Time
//                             <input
//                                 type="datetime-local"
//                                 className="form-control"
//                                 value={endDateTime}
//                                 onChange={(e) => setEndDateTime(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group mb-3">
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Access Code"
//                                 value={accessCode}
//                                 onChange={(e) => setAccessCode(e.target.value)}
//                                 required
//                             />
//                         </div>

//                         {questions.map((question, qIndex) => (
//                             <div key={qIndex} className="question-section mb-4 p-3 rounded shadow-sm">
//                                 <input
//                                     type="text"
//                                     className="form-control mb-2"
//                                     placeholder={`Question ${qIndex + 1}`}
//                                     value={question}
//                                     onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
//                                     required
//                                 />
//                                 {options[qIndex].map((option, oIndex) => (
//                                     <input
//                                         key={oIndex} // You might also consider using a more unique identifier if available
//                                         type="text"
//                                         className="form-control mb-2"
//                                         placeholder={`Option ${oIndex + 1}`}
//                                         value={option}
//                                         onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
//                                         required
//                                     />
//                                 ))}

//                                 <input
//                                     type="text"
//                                     className="form-control mb-2"
//                                     placeholder="Correct Answer"
//                                     value={correctAnswers[qIndex]}
//                                     onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
//                                     required
//                                 />
//                                 <div className="mb-2">
//                                     <button type="button" className="btn btn-secondary" onClick={() => handleAddOption(qIndex)}>
//                                         Add Option
//                                     </button>
//                                     <button type="button" className="btn btn-danger" onClick={() => handleDeleteQuestion(qIndex)}>
//                                         Delete Question
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                         <button type="button" className="btn btn-primary mb-3" onClick={handleAddQuestion}>
//                             Add Question
//                         </button>
//                         <button type="submit" className="btn btn-success">{selectedQuizId ? 'Update Quiz' : 'Create Quiz'}</button>
//                     </form>

//                     <h3 className="mt-5">Existing Quizzes</h3>
//                     {quizzes.length > 0 ? (
//                         <ul className="list-group">
//                             {quizzes.map((quiz) => (
//                                 <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
//                                     <div>
//                                         <h5>{quiz.subject}</h5>
//                                         <p>Start: {new Date(quiz.startDateTime).toLocaleString()}</p>
//                                         <p>End: {new Date(quiz.endDateTime).toLocaleString()}</p>
//                                         <p>Access Code: {quiz.accessCode}</p>
//                                     </div>
//                                     <div>
//                                         <button className="btn btn-warning" onClick={() => handleEditQuiz(quiz)}>Edit</button>
//                                         <button className="btn btn-danger" onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <div className="mt-3">No quizzes found.</div>
//                     )}

//                     <h3 className="mt-5">User Scores</h3>
//                     <button onClick={fetchUserDetails} className="btn btn-info mb-3">Fetch User Details</button>
//                     {userLoading ? (
//                         <div>Loading user details...</div>
//                     ) : (
//                         <ul className="list-group">
//                             {userDetails.map((user) => (
//                                 <li key={user.id} className="list-group-item">
//                                     <div>{user.name} - Score: {user.score}</div>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default AdminPanel;
