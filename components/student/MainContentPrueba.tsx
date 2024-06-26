import React, { useState } from 'react';
import { Question } from '../../interfaces/StudentModule';

interface MainContentProps {
  sessionVideo?: string;
  evaluationQuestions?: Question[];
  onFinish?: () => void;
}

const MainContentPrueba: React.FC<MainContentProps> = ({ sessionVideo, evaluationQuestions, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleNextQuestion = () => {
    if (currentQuestion < evaluationQuestions!.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (onFinish) {
        onFinish();
      }
    }
  };

  if (sessionVideo) {
    return (
      <div className="h-full w-full p-4">
        <video controls className="w-full h-full" style={{ maxWidth: '100%' }}>
          <source src={sessionVideo} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (evaluationQuestions && evaluationQuestions.length > 0) {
    const question = evaluationQuestions[currentQuestion];
    return (
      <div className="flex flex-col justify-center items-center h-full w-full p-4">
        <div className="max-w-2xl w-full">
          <h1>Evaluación </h1>
          <h3>{question.question_text}</h3>
          <p>Puntaje :  {question.score}</p>
          <img src={question.image}></img>
          <ul>
            {question.options.map((option, idx) => (
              <li key={idx}>{option.option_text}</li>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 p-2 bg-blue-500 text-white"
          onClick={handleNextQuestion}
          disabled={currentQuestion >= evaluationQuestions.length - 1}
        >
          Siguiente
        </button>
      </div>
    );
  }

  return <div className="flex justify-center items-center h-full w-full p-4">Selecciona una sesión o Evaluación</div>;
};

export default MainContentPrueba;
