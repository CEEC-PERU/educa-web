import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import './../../app/globals.css';
import { Question, ModuleResults, VideosInteractivo } from '../../interfaces/StudentModule';
import { useResultModule } from '../../hooks/useResultModule';
import { useAuth } from '../../context/AuthContext';

interface MainContentProps {
  sessionVideosInteractivos?: VideosInteractivo[];
  sessionVideo?: string;
  evaluationQuestions?: Question[];
  onFinish?: () => void;
  onProgress?: (progress: number, isCompleted: boolean) => void;
  videoProgress?: number;
  selectedModuleId?: number | null;
  moduleResults?: ModuleResults[];
}

const NPSForm: React.FC<{ onSubmit: (score: number) => void }> = ({ onSubmit }) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const emojis = ["😡", "😞", "😐", "🙂", "😃"]; // Emojis representing the NPS scale

  const handleSubmit = () => {
    if (selectedScore !== null) {
      onSubmit(selectedScore);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-900 to-fuchsia-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-white text-3xl mb-4">¿Qué tan satisfecho estás con el curso?</h2>
      <div className="flex justify-around w-full mb-4">
        {emojis.map((emoji, idx) => (
          <button
            key={idx}
            className={`text-5xl ${selectedScore === idx + 1 ? 'text-yellow-400' : 'text-white'} transition-transform transform hover:scale-110`}
            onClick={() => setSelectedScore(idx + 1)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <h2 className="text-white text-3xl mb-4">¿Qué tan satisfecho estás con el curso?</h2>
      <div className="flex justify-around w-full mb-4">
        {emojis.map((emoji, idx) => (
          <button
            key={idx}
            className={`text-5xl ${selectedScore === idx + 1 ? 'text-yellow-400' : 'text-white'} transition-transform transform hover:scale-110`}
            onClick={() => setSelectedScore(idx + 1)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300"
      >
        Enviar
      </button>
    </div>
  );
};


const MainContentPrueba: React.FC<MainContentProps> = ({
  sessionVideosInteractivos,
  sessionVideo,
  evaluationQuestions,
  onFinish,
  onProgress,
  videoProgress = 0,
  selectedModuleId,
  moduleResults
}) => {
  // State variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // New state variable
  const [videoEnded, setVideoEnded] = useState(false);
  const [evaluationCompleted, setEvaluationCompleted] = useState(false);
  const [showStartMessage, setShowStartMessage] = useState(true);
  const [showReaction, setShowReaction] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showGif, setShowGif] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showNPSForm, setShowNPSForm] = useState(false); // State to show NPS form
  const videoRef = useRef<HTMLVideoElement>(null);

  // Context
  const { user, token } = useAuth();
  const userInfo = user as { id: number };
  const { createResultModule } = useResultModule();
  const router = useRouter();

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setTotalScore(0);
    setCorrectAnswers(0); // Reset correct answers
    setVideoEnded(false);
    setEvaluationCompleted(false);
    setShowStartMessage(true);
    setCurrentVideoIndex(0);
    setShowGif(false);
  }, [sessionVideo, evaluationQuestions, selectedModuleId, sessionVideosInteractivos]);

  useEffect(() => {
    if (videoRef.current) {
      const handleTimeUpdate = () => {
        const currentTime = videoRef.current!.currentTime;
        const duration = videoRef.current!.duration;
        const progress = (currentTime / duration) * 100;
        if (onProgress) onProgress(progress, false);
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
  }, [onProgress, currentTime, videoProgress, videoEnded, sessionVideo, sessionVideosInteractivos]);

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowReaction(false);
    if (currentQuestion < (evaluationQuestions?.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleOptionSelect = (optionIndex: number, isCorrect: boolean) => {
    setSelectedOption(optionIndex);
    setIsCorrect(isCorrect);
    setShowReaction(true);
    if (isCorrect) {
      setTotalScore(prev => prev + (evaluationQuestions?.[currentQuestion]?.score || 0));
      setCorrectAnswers(prev => prev + 1); // Increment correct answers count
    }
    setTimeout(() => {
      setShowReaction(false);
    }, 2000);
  };

  const handleFinish = () => {
    setEvaluationCompleted(true);
    if (onFinish) onFinish();
    const moduloResultado = {
      user_id: userInfo.id,
      evaluation_id: evaluationQuestions?.[0]?.evaluation_id || 0,
      puntaje: totalScore,
      module_id: selectedModuleId
    };
    createResultModule(moduloResultado);
    console.log("MODULO_RESULTADO", moduloResultado);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 3000); // Show GIF for 3 seconds before the question
  };

  const handleStartEvaluation = () => {
    if (isFinalEvaluation) {
      setShowNPSForm(true); // Show NPS form before final evaluation
    } else {
      setShowStartMessage(false);
    }
  };

  const handleNPSSubmit = (score: number) => {
    console.log(`NPS Score: ${score}`);
    setShowNPSForm(false); // Ocultar formulario NPS

    setShowStartMessage(false);
  };

  

  const handleContinue = () => {
    if (currentVideoIndex < (sessionVideo?.length || 0) - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setVideoEnded(false);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      handleFinish();
    }
  };

  const moduleResult = moduleResults?.find(result => result.module_id === selectedModuleId);
  const isFinalEvaluation = !selectedModuleId;

  return (
    <div className="h-full w-full p-4 relative">
      {showNPSForm ? (
        <NPSForm onSubmit={handleNPSSubmit} />
      ) : sessionVideo ? (
        <div className="flex flex-col items-center">
          <video
            key={sessionVideo}
            controls
            className="w-full h-full"
            style={{ maxWidth: '100%' }}
            onEnded={handleVideoEnd}
            ref={videoRef}
          >
            <source src={sessionVideo} type="video/mp4" />
          </video>
        </div>
      ) : evaluationQuestions && evaluationQuestions.length > 0 ? (
        moduleResult ? (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-900 to-fuchsia-700 p-6 rounded-lg shadow-lg">
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721281738/WEB_EDUCA/WEB-IMAGENES/l726pef5kttv73tjzdts.png" alt="Congratulations" className="mb-4 justify-center" />
            <p className='text-white text-4xl'> Puntaje Total: {moduleResult.puntaje}</p>
            <p className='text-white text-2xl'> Preguntas correctas: {correctAnswers}/{evaluationQuestions.length}</p>
            <button 
              onClick={handleStartEvaluation} 
              className="bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300"
            >
              Volver a Intentar
            </button>
          </div>
        ) : showStartMessage ? (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-900 to-fuchsia-700 p-6 rounded-lg shadow-lg">
            <h1 className={`text-6xl text-yellow-400 mb-6 font-extrabold animate-pulse ${isFinalEvaluation ? '' : 'hidden'}`}>
              EVALUACIÓN FINAL
            </h1>
            <p className={`text-4xl text-white mb-8 ${isFinalEvaluation ? '' : 'hidden'}`}>
              Para finalizar el curso, inicia esto
            </p>
            <h1 className={`text-6xl text-yellow-400 mb-6 font-extrabold animate-pulse ${isFinalEvaluation ? 'hidden' : ''}`}>
              ¡Ponte a Prueba!
            </h1>
            <p className={`text-4xl text-white mb-8 ${isFinalEvaluation ? 'hidden' : ''}`}>
              Para finalizar el módulo, ¡Inicia la Evaluación!
            </p>
            <img 
              src={isFinalEvaluation ? "https://res.cloudinary.com/dk2red18f/image/upload/v1721282668/WEB_EDUCA/WEB-IMAGENES/gpki5vwl5iscesql4vgz.png" 
                  : "https://res.cloudinary.com/dk2red18f/image/upload/v1721282653/WEB_EDUCA/WEB-IMAGENES/iedxcrpplh3wmu5zfctf.png"} 
              alt="Evaluation"
              className="mb-6 w-64 h-64 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
            />
            <button 
              onClick={handleStartEvaluation} 
              className="bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300"
            >
              Comenzar Evaluación
            </button>
            <div className="mt-4 text-white text-sm">
              <p className="animate-bounce">¡Buena suerte!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-900 to-fuchsia-700 p-4 md:p-6 rounded-lg shadow-lg">
            <div className="w-3/4 bg-gray-800 rounded-full h-3 md:h-4 mb-4 md:mb-6 overflow-hidden">
              <div
                className="bg-yellow-600 h-3 md:h-4 text-xs font-medium text-white text-center leading-none rounded-full"
                style={{ width: `${((currentQuestion + 1) / evaluationQuestions.length) * 100}%` }}
              >
                {((currentQuestion + 1) / evaluationQuestions.length) * 100}%
              </div>
            </div>
            <div className="flex flex-col items-center text-center w-full max-w-4xl mb-4 md:mb-6">
              <p className="text-white text-3xl  md:text-3xl">Puntaje: {totalScore}</p> 
            </div>
            {!evaluationCompleted ? (
              <div className="flex flex-col items-center text-center w-full max-w-4xl">
                <h3 className="text-white text-2xl md:text-3xl pb-5 md:pb-7">{evaluationQuestions[currentQuestion]?.question_text}</h3>
                {evaluationQuestions[currentQuestion]?.image && (
                  <img src={evaluationQuestions[currentQuestion]?.image} alt="Question related" className="w-2/3 md:w-1/3 rounded-lg shadow-lg pb-5" />
                )}
                <ul className="text-white w-full md:w-2/3 space-y-3 md:space-y-4">
                  {evaluationQuestions[currentQuestion]?.options.map((option, idx) => (
                    <li key={idx}>
                      <button
                        className={`w-full p-3 rounded-lg ${selectedOption === idx ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-yellow-600'} text-purple-900 border font-bold border-white`}
                        onClick={() => handleOptionSelect(idx, option.is_correct)}
                        disabled={selectedOption !== null}
                      >
                        {option.option_text}
                      </button>
                    </li>
                  ))}
                </ul>
                {showReaction && (
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    {Array.from({ length: 20 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`absolute text-4xl md:text-6xl ${isCorrect ? 'text-green-500' : 'text-red-500'} animate-float`}
                        style={{
                          bottom: '0',
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 0.5}s`,
                        }}
                      >
                        {isCorrect ? '😊' : '😢'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 text-white text-center text-2xl">
                 <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721281738/WEB_EDUCA/WEB-IMAGENES/l726pef5kttv73tjzdts.png" alt="Congratulations" className="mb-4 justify-center" />
                 <button 
              onClick={handleStartEvaluation} 
              className="bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300"
            >
              Volver a Intentar
            </button>

              </div>
            )}
            {selectedOption !== null && !showReaction && !evaluationCompleted && (
              <button
                className="mt-6 p-3 bg-yellow-500 text-purple-900 font-bold rounded-lg shadow-lg w-full md:w-1/3"
                onClick={handleNextQuestion}
              >
                {currentQuestion < (evaluationQuestions?.length || 0) - 1 ? 'Siguiente' : 'Finalizar'}
              </button>
            )}
          </div>
        )
      ) : (
        <div className="flex justify-center items-center h-full w-full p-4 text-white">
          Selecciona una sesión para iniciar el curso
        </div>
      )}
    </div>
  );
};

export default MainContentPrueba;




