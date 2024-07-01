import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../interfaces/StudentModule';

interface MainContentProps {
  sessionVideo?: string;
  evaluationQuestions?: Question[];
  onFinish?: () => void;
  onContinue?: () => void;
  onProgress?: (progress: number) => void; // New prop to handle video progress
}

const MainContentPrueba: React.FC<MainContentProps> = ({ sessionVideo, evaluationQuestions, onFinish, onContinue, onProgress }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [videoEnded, setVideoEnded] = useState(false); // State to track if the video has ended
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      const handleTimeUpdate = () => {
        const currentTime = videoRef.current!.currentTime;
        const duration = videoRef.current!.duration;
        const progress = (currentTime / duration) * 100;
        if (onProgress) {
          onProgress(progress);
        }
        setCurrentTime(currentTime);
      };

      const handleSeeking = () => {
        if (videoRef.current!.currentTime > currentTime) {
          videoRef.current!.currentTime = currentTime;
        }
      };

      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('seeking', handleSeeking);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          videoRef.current.removeEventListener('seeking', handleSeeking);
        }
      };
    }
  }, [onProgress, currentTime]);

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

  const handleVideoEnd = () => {
    setVideoEnded(true); // Set videoEnded to true when the video ends
  };

  return (
    <div className="h-full w-full p-4">
      {sessionVideo ? (
        <div className="flex flex-col items-center">
          <video
            controls
            className="w-full h-full"
            style={{ maxWidth: '100%' }}
            onEnded={handleVideoEnd} // Handle video end event
            ref={videoRef} // Reference to the video element
          >
            <source src={sessionVideo} type="video/mp4" />
          </video>
          {videoEnded && ( // Show continue button if video has ended
            <button
              className="mt-6 p-3 bg-brandmora-500 text-white rounded-lg border border-brandborder-400"
              style={{ width: '270px', height: '50px' }}
              onClick={onContinue}
            >
              Continuar
            </button>
          )}
        </div>
      ) : evaluationQuestions && evaluationQuestions.length > 0 ? (
        <div className="flex flex-col justify-center items-center h-full w-full p-4">
          <div className="max-w-2xl w-full">
            <h1 className="text-white text-center text-3xl pb-7">Evaluación</h1>
            <h3 className="text-white text-center text-3xl pb-7">{evaluationQuestions[currentQuestion].question_text}</h3>
            <p className="text-white text-left text-xl pb-5">Puntaje: {evaluationQuestions[currentQuestion].score}</p>
            <div className="flex justify-between items-center">
              <ul className="text-white text-center w-1/2">
                {evaluationQuestions[currentQuestion].options.map((option, idx) => (
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
              {evaluationQuestions[currentQuestion].image && <img src={evaluationQuestions[currentQuestion].image} alt="Question related" className="w-1/2" />}
            </div>
          </div>
          {selectedOption !== null && (
            <button
              className="mt-6 p-3 bg-brandmora-500 text-white rounded-lg border border-brandborder-400"
              style={{ width: '270px', height: '50px' }}
              onClick={handleNextQuestion}
            >
              {currentQuestion < evaluationQuestions.length - 1 ? 'Siguiente' : 'Finalizar'}
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full p-4">Selecciona una sesión o Evaluación</div>
      )}
    </div>
  );
};

export default MainContentPrueba;
