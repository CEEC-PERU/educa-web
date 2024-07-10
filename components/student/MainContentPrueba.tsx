import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../interfaces/StudentModule';
import axios from 'axios';
import './../../app/globals.css';
import  {useResultModule } from '../../hooks/useResultModule';
import { useAuth } from '../../context/AuthContext';

interface MainContentProps {
  sessionVideo?: string;
  evaluationQuestions?: Question[];
  onFinish?: () => void;
  onContinue?: () => void;
  onProgress?: (progress: number, isCompleted: boolean) => void;
  videoProgress?: number;
  selectedModuleId?: number | null; // New prop for selected module ID
}

const MainContentPrueba: React.FC<MainContentProps> = ({
  sessionVideo,
  evaluationQuestions,
  onFinish,
  onContinue,
  onProgress,
  videoProgress = 0,
  selectedModuleId  // Include selectedModuleId
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [evaluationCompleted, setEvaluationCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const { user, token } = useAuth();
  const userInfo = user as { id: number }; 
  const { createResultModule } = useResultModule();


  useEffect(() => {
    if (videoRef.current) {
      const handleTimeUpdate = () => {
        const currentTime = videoRef.current!.currentTime;
        const duration = videoRef.current!.duration;
        const progress = (currentTime / duration) * 100;
        if (onProgress) {
          onProgress(progress, false);
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

      if (videoProgress > 0 && !videoEnded) {
        const duration = videoRef.current!.duration;
        const targetTime = (videoProgress / 100) * duration;
        if (targetTime > 0 && targetTime < duration) {
          videoRef.current.currentTime = targetTime;
        }
      }

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          videoRef.current.removeEventListener('seeking', handleSeeking);
        }
      };
    }
  }, [onProgress, currentTime, videoProgress, videoEnded]);

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestion < (evaluationQuestions?.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleOptionSelect = (optionIndex: number, isCorrect: boolean) => {
    setSelectedOption(optionIndex);
    setIsCorrect(isCorrect);
    if (isCorrect) {
      setTotalScore(prev => prev + (evaluationQuestions?.[currentQuestion]?.score || 0));
    }
  };

  const handleFinish = () => {
    setEvaluationCompleted(true);
    if (onFinish) {
      onFinish();
    }

    const moduloResultado = {
      user_id: userInfo.id,
      evaluation_id: evaluationQuestions?.[0]?.evaluation_id || 0,
      puntaje: totalScore,
      module_id: selectedModuleId // Include module_id here
    };

    createResultModule(moduloResultado)

    console.log("MODULO_RESULTADO",moduloResultado)
   
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    if (onProgress) {
      onProgress(100, true);
    }
  };

  return (
    <div className="h-full w-full p-4">
      {sessionVideo ? (
        <div className="flex flex-col items-center">
          <video
            controls
            className="w-full h-full"
            style={{ maxWidth: '100%' }}
            onEnded={handleVideoEnd}
            ref={videoRef}
          >
            <source src={sessionVideo} type="video/mp4" />
          </video>
          {videoEnded && (
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
          {!evaluationCompleted ? (
            <div className="max-w-2xl w-full">
              <h1 className="text-white text-center text-3xl pb-7">Evaluación</h1>
              <h3 className="text-white text-center text-3xl pb-7">{evaluationQuestions[currentQuestion]?.question_text}</h3>
              <p className="text-white text-left text-xl pb-5">Puntaje: {evaluationQuestions[currentQuestion]?.score}</p>
              <div className="flex justify-between items-center">
                <ul className="text-white text-center w-1/2">
                  {evaluationQuestions[currentQuestion]?.options.map((option, idx) => (
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
                {evaluationQuestions[currentQuestion]?.image && <img src={evaluationQuestions[currentQuestion]?.image} alt="Question related" className="w-1/2" />}
              </div>
            </div>
          ) : (
            <div className="mt-6 text-white text-center text-2xl">
              Puntaje Total: {totalScore}
            </div>
          )}
          {selectedOption !== null && !evaluationCompleted && (
            <button
              className="mt-6 p-3 bg-brandmora-500 text-white rounded-lg border border-brandborder-400"
              style={{ width: '270px', height: '50px' }}
              onClick={handleNextQuestion}
            >
              {currentQuestion < (evaluationQuestions?.length || 0) - 1 ? 'Siguiente' : 'Finalizar'}
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
