import React, { useState } from 'react';

const SecurityQuestionDropdown = ({ onQuestionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const questions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "What was the make of your first car?",
    "In what city were you born?",
    "What is your favorite book?",
    "What is your favorite food?",
    "What was your childhood nickname?",
    "What was the name of your best friend?",
    "What is the name of your favorite pet?",
  ];

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleSelectOption = (question) => {
    setSelectedOption(question);
    setIsOpen(false); // Close dropdown after selection
    if (onQuestionSelect) {
      onQuestionSelect(question); // Notify parent about selected question
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="securityQuestion">Select a security question below</label>
      <div className="dropdown-container">
        <div
          className="dropdown"
          onClick={toggleDropdown}
          tabIndex={0} // makes it focusable
        >
          {selectedOption || "Select a question..."}
        </div>
        <div
          className={`dropdown-options ${isOpen ? 'open' : 'closed'}`}
        >
          {questions.map((question, index) => (
            <div
              key={index}
              className={`dropdown-item ${selectedOption === question ? 'selected-option' : ''}`}
              onClick={() => handleSelectOption(question)}
            >
              {question}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestionDropdown;
