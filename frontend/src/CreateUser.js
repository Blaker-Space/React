import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import SecurityQuestionDropdown from './SecurityQuestionDropdown';

function CreateUser() {
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [OrganizationName, setOrganizationName] = useState("");
    const [SecurityQuestion, setSecurityQuestion] = useState("");
    const [SecurityAnswer, setSecurityAnswer] = useState("");
    const [RecoveryKey, setRecoveryKey] = useState("");
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isAccountCreated, setIsAccountCreated] = useState(false);

    const navigate = useNavigate();

    const generateRecoveryKey = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let key = "";
        for (let i = 0; i < 16; i++) {
            key += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return key;
    };

    const navigateHome = () => {
        navigate('/');
    }

    const validateForm = () => {
        const newErrors = {};
        if (!Name) newErrors.Name = "Name is required.";
        if (!Email) newErrors.Email = "Email is required.";
        if (!Password) newErrors.Password = "Password is required.";
        if (!OrganizationName) newErrors.OrganizationName = "Organization Name is required.";
        if (!SecurityQuestion) newErrors.SecurityQuestion = "Please select a security question.";
        if (!SecurityAnswer) newErrors.SecurityAnswer = "Answer to the security question is required.";
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSecurityQuestionChange = (question) => {
        setSecurityQuestion(question);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            let uniqueKey = generateRecoveryKey();

            try {
                let keyUnique = false;
                while (!keyUnique) {
                    const response = await axios.post("http://localhost:8080/check-key", { recoveryKey: uniqueKey });
                    if (response.data.unique) {
                        keyUnique = true;
                    } else {
                        uniqueKey = generateRecoveryKey(); // Generate a new key if not unique
                    }
                }

                axios
                    .post("http://localhost:8080/create", {
                        Name,
                        Email,
                        Password,
                        OrganizationName,
                        SecurityQuestion,
                        SecurityAnswer,
                        RecoveryKey: uniqueKey
                    })
                    .then(res => {
                        console.log(res.data);
                        setSuccessMessage(
                            `Account created successfully! Your recovery key is: `
                        );
                        setRecoveryKey(uniqueKey);
                        setIsAccountCreated(true);
                        setName("");
                        setEmail("");
                        setPassword("");
                        setOrganizationName("");
                        setSecurityQuestion("");
                        setSecurityAnswer("");
                    })
                    .catch(err => {
                        console.error("Error creating user:", err.response || err);
                        setErrors({ server: "Failed to create user. Please try again later." });
                    });
            } catch (error) {
                console.error("Error checking recovery key:", error);
                setErrors({ server: "An error occurred while generating a recovery key. Please try again." });
            }
        }
    };

    const handleReturnToLogin = () => {
        navigate('/');
    };

    return (
        <div className="create-container">
            <div className="card">
                {!isAccountCreated ?
                    <form className="create-form" onSubmit={handleSubmit}>
                        <img
                            src={`${process.env.PUBLIC_URL}/favicon.png`}
                            alt="WorkConnect logo"
                            style={{ width: "250px", height: "250px" }}
                            className="favicon-image"
                            onClick={navigateHome}
                        />
                        <h2>Create Your Account</h2>
                        {errors.server && <div className="error-message">{errors.server}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}

                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                            {errors.Name && <span className="error">{errors.Name}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                            {errors.Email && <span className="error">{errors.Email}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            {errors.Password && <span className="error">{errors.Password}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="orgName">Organization Name</label>
                            <input
                                type="text"
                                id="orgName"
                                value={OrganizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                placeholder="Enter the name of your organization"
                            />
                            {errors.OrganizationName && <span className="error">{errors.OrganizationName}</span>}
                        </div>
                        <SecurityQuestionDropdown onQuestionSelect={handleSecurityQuestionChange} />
                        <div className="form-group">
                            <label htmlFor="securityAnswer">Security Question Answer</label>
                            <input
                                type="text"
                                id="securityAnswer"
                                value={SecurityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                placeholder="Enter the answer to your security question"
                            />
                            {errors.SecurityAnswer && <span className="error">{errors.SecurityAnswer}</span>}
                        </div>
                        <button type="submit" className="btn-primary">
                            Create Account
                        </button>
                    </form>
                    : (
                        <div className="success-container">
                            <div className='success-message'>
                                <img
                                    src={`${process.env.PUBLIC_URL}/favicon.png`}
                                    alt="WorkConnect logo"
                                    style={{ width: "200px", height: "200px" }}
                                    className="favicon-image"
                                />
                                <h1 className='recovery-message'>Account Created Successfully!</h1>
                                <p className='recovery-message'>Your recovery key is:</p>
                                <strong className='brand-name'>{RecoveryKey}</strong>
                                <br />
                                <br />
                                <p className='recovery-message'>Please retain it for future account recovery</p>
                                <button className='brand-name' onClick={handleReturnToLogin}>
                                    Return to Login
                                </button>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default CreateUser;