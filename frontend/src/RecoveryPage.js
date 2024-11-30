import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styles.css";

function RecoveryPage() {
    const [hasRecoveryKey, setHasRecoveryKey] = useState(null); // Tracks if the user has a recovery key
    const [recoveryKey, setRecoveryKey] = useState("");
    const [email, setEmail] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate('/');
    }
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (hasRecoveryKey === null) {
            setError("Please select if you have your recovery key.");
            return;
        }

        if (hasRecoveryKey) {
            // If user has recovery key, try to find the account by key
            try {
                const response = await axios.post("http://localhost:8080/recover-by-key", { recoveryKey });

                if (response.data.found) {
                    setSuccessMessage(`Account found! Your email is: ${response.data.email}. Your password is: ${response.data.password}`);
                } else {
                    setError("No account found with this recovery key.");
                }
            } catch (err) {
                setError("Error recovering account. Please try again.");
            }
        } else {
            // If no recovery key, ask for email
            try {
                const response = await axios.post("http://localhost:8080/recover-by-email", { email });

                if (response.data.found) {
                    setSecurityQuestion(response.data.securityQuestion);
                    setSecurityAnswer(response.data.securityAnswer);
                } else {
                    setError("No account found with this email.");
                }
            } catch (err) {
                setError("Error recovering account. Please try again.");
            }
        }
    };

    const handleSecurityAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/verify-answer", { email, answer: securityAnswer });

            if (response.data.correct) {
                setSuccessMessage(`Account verified! Your password is: ${response.data.password}`);
            } else {
                setError("Incorrect answer. Please reach out to support@workconnect.com for assistance.");
            }
        } catch (err) {
            setError("Error verifying answer. Please try again.");
        }
    };

    return (
        <div className="create-container">
        <div className="card">
            <img
                src={`${process.env.PUBLIC_URL}/favicon.png`}
                alt="WorkConnect logo"
                style={{ width: "250px", height: "250px" }}
                className="favicon-image"
                onClick={navigateHome}
            />
            <h2>Account Recovery</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}


            <form onSubmit={handleSubmit} className="create-form">
                {/* Hide the question and buttons after selection */}
                {hasRecoveryKey === null && (
                    <div className="form-group">
                        <div>
                            <label>Do you have a recovery key?</label>
                            <button
                                type="button"
                                onClick={() => setHasRecoveryKey(true)}
                                className={'btn-option-yes'}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setHasRecoveryKey(false)}
                                className={'btn-option-no'}
                            >
                                No
                            </button>
                        </div>
                    </div>
                )}

                {hasRecoveryKey !== null && hasRecoveryKey && (
                    <div className="form-group">
                        <label htmlFor="recoveryKey">Enter Your Recovery Key</label>
                        <input
                            type="text"
                            id="recoveryKey"
                            value={recoveryKey}
                            onChange={(e) => setRecoveryKey(e.target.value)}
                            placeholder="Enter your recovery key"
                        />
                    </div>
                )}

                {hasRecoveryKey !== null && !hasRecoveryKey && (
                    <div className="form-group">
                        <label htmlFor="email">Enter Your Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button type="submit" className="btn-primary">
                    Submit
                </button>
            </form>

            {/* Security Question Section */}
            {securityQuestion && (
                <form onSubmit={handleSecurityAnswerSubmit} className="create-form">
                    <div className="form-group">
                        <label>{securityQuestion}</label>
                        <input
                            type="text"
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            placeholder="Enter your answer"
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Verify Answer
                    </button>
                </form>
            )}
        </div>
    </div>
    );
}

export default RecoveryPage;
