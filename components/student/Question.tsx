import React, { useState } from 'react';

interface QuestionProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswer: (isCorrect: boolean) => void;
}

const Question: React.FC<QuestionProps> = ({ question, options, correctAnswer, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    onAnswer(index === correctAnswer);
  };

  return (
    <div className="question">
      <h3>{question}</h3>
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={() => handleOptionClick(index)} style={{ cursor: 'pointer' }}>
            {option}
          </li>
        ))}
      </ul>
      {selectedOption !== null && (
        <p>{selectedOption === correctAnswer ? 'Correct!' : 'Try again.'}</p>
      )}
    </div>
  );
};

export default Question;