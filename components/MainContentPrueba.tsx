// components/MainContent.tsx
import React, { useState } from 'react';

interface Question {
  question_text: string;
  options: { option_text: string; is_correct: boolean }[];
}

interface MainContentProps {
  sessionVideo?: string;
  evaluationQuestions?: Question[];
}

const MainContentPrueba: React.FC<MainContentProps> = ({ sessionVideo, evaluationQuestions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  if (sessionVideo) {
    return (
      <div className="p-4">
        <video controls className="w-full">
          <source src={sessionVideo} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (evaluationQuestions) {
    const question = evaluationQuestions[currentQuestion];
    return (
      <div className="p-4">
        <div>
          <p>{question.question_text}</p>
          <ul>
            {question.options.map((option, idx) => (
              <li key={idx}>{option.option_text}</li>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 p-2 bg-blue-500 text-white"
          onClick={() => setCurrentQuestion((prev) => prev + 1)}
          disabled={currentQuestion >= evaluationQuestions.length - 1}
        >
          Siguiente
        </button>
      </div>
    );
  }

  return <div className="p-4">Selecciona una sesión o evaluación.</div>;
};

export default MainContentPrueba;
