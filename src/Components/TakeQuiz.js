
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TakeQuiz.css';

const TakeQuiz = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [score, setScore] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(''); 
    const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`https://quizapplicationbackend-production.up.railway.app/api/admin/quizzes/${quizId}`, {
                    withCredentials: true
                });
                setQuiz(response.data);
                setAnswers(new Array(response.data.questions.length).fill(''));
            } catch (error) {
                console.error('Error fetching quiz:', error);
                if (error.response && error.response.status === 401) {
                    alert('You are not authorized to access this quiz.');
                    navigate('/register');
                }
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleAnswerChange = (value) => {
        if (!isSubmitted) { // Allow answer change only if quiz is not submitted
            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = value;
            setAnswers(newAnswers);
            setSelectedOption(value);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(answers[currentQuestionIndex + 1]);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption(answers[currentQuestionIndex - 1]);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitted) {
            alert("Quiz already submitted!");
            return; // Prevent duplicate submissions
        }
        try {
            const currentUserId = localStorage.getItem('user');
            let parsedUserId;
            try {
                parsedUserId = JSON.parse(currentUserId);
            } catch (e) {
                parsedUserId = currentUserId;
            }

            const userId1 = typeof parsedUserId === 'object' ? parsedUserId.userId : +parsedUserId;

            if (!userId1) {
                throw new Error('User not logged in. Please log in to submit the quiz.');
            }

            const response = await axios.post(`https://quizapplicationbackend-production.up.railway.app/quizzes/submit`, {
                quizId,
                userId: userId1,
                answers,
            });

            console.log("response", response.data);
            console.log('Quiz submitted successfully!');

            // Calculate the score after submitting answers
            const calculatedScore = calculateScore();

            // Save the score to the backend
            await axios.post(`https://quizapplicationbackend-production.up.railway.app/api/scores`, {
                userId: userId1,
                quizId,
                score: calculatedScore,
                //submittedAt: new Date().toISOString(), // Save the current date and time
            });

            setIsSubmitted(true); // Mark the quiz as submitted
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('You are already submitted the quiz.');
        }
    };

    const calculateScore = () => {
        if (!quiz || !quiz.correctAnswers) return 0; // Return 0 if quiz or correct answers are not available

        const correctAnswers = quiz.correctAnswers;
        let score = 0;

        answers.forEach((answer, index) => {
            if (answer === correctAnswers[index]) {
                score += 1;
            }
        });

        setScore(score);
        setSubmissionMessage(`Quiz submitted successfully! Your score: ${score}/${answers.length}`);
        
        return score; // Return the calculated score
    };
    // const calculateScore = () => {
    //     if (!quiz || !quiz.correctAnswers) return 0; // Return 0 if quiz or correct answers are not available
    
    //     const correctAnswers = quiz.correctAnswers;
    //     let score = 0;
    
    //     answers.forEach((answer, index) => {
    //         if (answer === correctAnswers[index]) {
    //             score += 1;
    //         }
    //     });
    
    //     const percentage = ((score / answers.length) * 100).toFixed(2); // Calculate percentage score
    //     setScore(score);
    //     setSubmissionMessage(`Quiz submitted successfully! Your score: ${percentage}% (${score}/${answers.length})`);
    
    //     return { score, percentage }; // Return both score and percentage
    // };
    

    const startQuiz = () => {
        setQuizStarted(true);
    };

    if (!quiz) return <div className="text-center">Loading...</div>;

    return (
        <div className="container4 mt-5">
            <h2 className="text-center">{quiz.subject}</h2>
            {submissionMessage && (
                <div className={`alert alert-success ${isSubmitted ? 'fullscreen-message' : ''}`}>
                    {submissionMessage}
                </div>
            )}
            {!quizStarted ? (
                <div className="text-center">
                    <button className="btn btn-primary" onClick={startQuiz}>
                        Take Quiz
                    </button>
                </div>
            ) : (
                <div className="mt-4">
                    <h4>{quiz.questions[currentQuestionIndex]}</h4>
                    {quiz.options[currentQuestionIndex].map((option, oIndex) => (
                        <div key={oIndex} className="form-check">
                            <input
                                type="radio"
                                className="form-check-input"
                                name={`question-${currentQuestionIndex}`}
                                value={option}
                                checked={selectedOption === option}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                id={`option-${currentQuestionIndex}-${oIndex}`}
                                disabled={isSubmitted} // Disable options if quiz is submitted
                            />
                            <label className="form-check-label" htmlFor={`option-${currentQuestionIndex}-${oIndex}`}>
                                {option}
                            </label>
                        </div>
                    ))}
                    <div className="text-center mt-4">
                        <div className="d-flex justify-content-between">
                            <button 
                                className="btn btn-secondary" 
                                onClick={handleBack} 
                                disabled={currentQuestionIndex === 0 || isSubmitted} // Disable Back if quiz is submitted
                            >
                                Back
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleNext}
                                disabled={!answers[currentQuestionIndex] || isSubmitted} // Disable Next if no answer is selected or quiz is submitted
                            >
                                {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isSubmitted && <div className="mt-4 text-center"><h4>Your Score: {score}/{quiz.questions.length}</h4></div>}
        </div>
    );
};

export default TakeQuiz;






