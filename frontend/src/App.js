import React, { useState } from 'react';
import './App.css';
import { sendChatMessage } from './services/api';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      question: "How do you typically spend your free time?",
      options: [
        "Reading books or learning new things",
        "Socializing with friends",
        "Engaging in physical activities",
        "Creating art or music"
      ]
    },
    {
      question: "What's your approach to problem-solving?",
      options: [
        "Analytical and methodical",
        "Collaborative and discussion-based",
        "Intuitive and gut-feeling based",
        "Creative and out-of-the-box"
      ]
    },
    {
      question: "How do you prefer to recharge?",
      options: [
        "Alone time in a quiet space",
        "Going out with friends",
        "Through physical exercise",
        "Immersing in creative projects"
      ]
    },
    {
      question: "What's your ideal career environment?",
      options: [
        "Structured and organized",
        "Dynamic and people-oriented",
        "Flexible and independent",
        "Creative and innovative"
      ]
    },
    {
      question: "How do you handle stress?",
      options: [
        "Planning and organizing",
        "Talking it out with others",
        "Physical activity or meditation",
        "Creative expression"
      ]
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCustomInput('');
    } else {
      submitAnswers(newAnswers);
    }
  };

  const handleCustomInput = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleAnswer(customInput);
    }
  };

  const submitAnswers = async (finalAnswers) => {
    setIsLoading(true);
    try {
      const message = `Based on these personality quiz answers, please provide a detailed personality analysis:
        ${Object.entries(finalAnswers).map(([q, a]) => 
          `Question ${parseInt(q) + 1}: ${questions[q].question}
           Answer: ${a}`
        ).join('\n')}`;

      const data = await sendChatMessage(message);
      setResult(data.response);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="App">
      <div className="quiz-container">
        {result ? (
          <div className="result">
            <h2>Your Personality Analysis</h2>
            <div className="analysis">{result}</div>
            <button onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setResult(null);
            }}>Start Over</button>
          </div>
        ) : (
          <>
            <div className="question-section">
              <h2>Question {currentQuestion + 1} of {questions.length}</h2>
              <p>{questions[currentQuestion].question}</p>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="options-section">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={isLoading}
                >
                  {option}
                </button>
              ))}
              <div className="custom-input">
                <form onSubmit={handleCustomInput}>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Or type your own answer..."
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={isLoading || !customInput.trim()}>
                    Submit Custom Answer
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App; 