import React from 'react';
import { Question } from '../../interfaces/StudentModule';

interface MainContentProps {
  sessionVideo?: string;
  evaluationQuestions?: Question[];
  onFinish?: () => void;
}

const MainContentPrueba: React.FC<MainContentProps> = ({ sessionVideo, evaluationQuestions, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestion < evaluationQuestions!.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (onFinish) {
        onFinish();
      }
    }
  };

  const handleOptionSelect = (optionIndex: number, isCorrect: boolean) => {
    setSelectedOption(optionIndex);
    setIsCorrect(isCorrect);
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
          <h1 className="text-white text-center text-3xl pb-7">Evaluación</h1>
          <h3 className="text-white text-center text-3xl pb-7">{question.question_text}</h3>
          <p className="text-white text-left text-xl pb-5">Puntaje: {question.score}</p>
         
          <div className="flex justify-between items-center">
            <ul className="text-white text-center w-1/2">
              {question.options.map((option, idx) => (
                <li key={idx}>
                  <button
                    className={`p-3 m-3 rounded-lg ${selectedOption === idx ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-brandpurpura-600'} text-white border border-white`}
                    style={{ width: '270px', height: '50px' }}
                    onClick={() => handleOptionSelect(idx, option.is_correct)}
                    disabled={selectedOption !== null}
                  >
                    {option.option_text}
                  </button>
                </li>
              ))}
            </ul>
            {question.image && <img src={question.image} alt="Question related" className="w-1/2" />}
          </div>
        </div>
        {selectedOption !== null && (
          <button className="mt-6 p-3 bg-brandmora-500 text-white rounded-lg border border-brandborder-400" style={{ width: '270px', height: '50px' }} onClick={handleNextQuestion}>
            {currentQuestion < evaluationQuestions.length - 1 ? 'Siguiente' : 'Finalizar'}
          </button>
        )}
      </div>
    );
  }

  return <div className="flex justify-center items-center h-full w-full p-4">Selecciona una sesión o Evaluación</div>;
};

export default MainContentPrueba;
