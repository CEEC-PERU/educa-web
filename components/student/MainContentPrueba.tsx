import React, { useState, useEffect, useRef } from 'react';
import { Question, ModuleResults, Videos } from '../../interfaces/StudentModule';
import axios from 'axios';
import './../../app/globals.css';
import { useResultModule } from '../../hooks/useResultModule';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

interface MainContentProps {
  sessionVideos?: Videos[];
  evaluationQuestions?: Question[];
  onFinish?: () => void;
  onContinue?: () => void;
  onProgress?: (progress: number, isCompleted: boolean) => void;
  videoProgress?: number;
  selectedModuleId?: number | null;
  moduleResults?: ModuleResults[];
}

const MainContentPrueba: React.FC<MainContentProps> = ({
  sessionVideos,
  evaluationQuestions,
  onFinish,
  onProgress,
  videoProgress = 0,
  selectedModuleId,
  moduleResults
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [evaluationCompleted, setEvaluationCompleted] = useState(false);
  const [showStartMessage, setShowStartMessage] = useState(true);
  const [showReaction, setShowReaction] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showGif, setShowGif] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };
  const { createResultModule } = useResultModule();
  const router = useRouter();

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setTotalScore(0);
    setVideoEnded(false);
    setEvaluationCompleted(false);
    setShowStartMessage(true);
    setCurrentVideoIndex(0);
    setShowGif(false);
  }, [sessionVideos, evaluationQuestions, selectedModuleId]);

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
  }, [onProgress, currentTime, videoProgress, videoEnded, sessionVideos]);

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
    }
    setTimeout(() => {
      setShowReaction(false);
    }, 2000);
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
      module_id: selectedModuleId
    };

    createResultModule(moduloResultado);
    console.log("MODULO_RESULTADO", moduloResultado);

    router.reload();
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 3000); // Mostrar el GIF por 3 segundos antes de la pregunta
  };

  const handleStartEvaluation = () => {
    setShowStartMessage(false);
  };

  const handleContinue = () => {
    if (currentVideoIndex < (sessionVideos?.length || 0) - 1) {
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
      {sessionVideos ? (
        <div className="flex flex-col items-center">
          {!videoEnded ? (
            <video
              key={sessionVideos[currentVideoIndex]?.video_id}
              controls
              className="w-full h-full"
              style={{ maxWidth: '100%' }}
              onEnded={handleVideoEnd}
              ref={videoRef}
            >
              <source src={sessionVideos[currentVideoIndex]?.video_enlace} type="video/mp4" />
            </video>
          ) : showGif ? (
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721946233/WEB_EDUCA/VIDEOS/oyywqqxqwzwi7szbbmt5.gif" alt="Transition GIF" className="w-full h-full" style={{ maxWidth: '100%' }} />
          ) : (
            <div className="flex flex-col justify-center items-center mt-4">
              <h3 className="text-white text-center text-3xl pb-7">
                {sessionVideos[currentVideoIndex]?.question}
              </h3>
               <img src={sessionVideos[currentVideoIndex]?.image} className="w-auto h-48 mb-6" />
              <div className="flex justify-between items-center">
                <ul className="text-white text-center w-1/2">
                  {[sessionVideos[currentVideoIndex]?.correct_answer, ...sessionVideos[currentVideoIndex]?.incorrect_answer].map((option, idx) => (
                    <li key={idx}>
                      <button
                        className={`p-3 m-3 rounded-lg ${selectedOption === idx ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-brandpurpura-600'} text-white border border-white`}
                        style={{ width: '270px', height: '50px' }}
                        onClick={() => handleOptionSelect(idx, option === sessionVideos[currentVideoIndex]?.correct_answer)}
                        disabled={selectedOption !== null}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {showReaction && (
                <div className="absolute bottom-0 left-0 w-full h-full flex justify-center items-end">
                  <div className="relative w-full h-full flex justify-center">
                    {Array.from({ length: 20 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`absolute text-6xl ${isCorrect ? 'text-green-500' : 'text-red-500'} animate-float`}
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
                </div>
              )}
              {selectedOption !== null && !showReaction && (
                <button
                  className="mt-6 p-3 bg-brandmora-500 text-white rounded-lg border border-brandborder-400"
                  style={{ width: '270px', height: '50px' }}
                  onClick={handleContinue}
                >
                  Continuar
                </button>
              )}
            </div>
          )}
        </div>
      ) : evaluationQuestions && evaluationQuestions.length > 0 ? (
        moduleResult ? (
          <div className="flex flex-col mt-6 items-center justify-center text-white text-center text-4xl">
            <img src={"https://res.cloudinary.com/dk2red18f/image/upload/v1721281738/WEB_EDUCA/WEB-IMAGENES/l726pef5kttv73tjzdts.png"} alt="Congratulations" className="mb-4 justify-center" />
            Puntaje Total: {moduleResult.puntaje}
          </div>
        ) : showStartMessage ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className={`text-5xl text-white mb-4 ${isFinalEvaluation ? '' : 'hidden'}`}>EVALUACIÓN FINAL</h1>
            <p className={`text-4xl text-white mb-4 ${isFinalEvaluation ? '' : 'hidden'}`}>Para finalizar el Curso incia esto</p>
            <h1 className={`text-5xl text-white mb-4 ${isFinalEvaluation ? 'hidden' : ''}`}>Ponte a Prueba</h1>
            <p className={`text-4xl text-white mb-4 ${isFinalEvaluation ? 'hidden' : ''}`}>Para finalizar el Módulo ¡Inicia la Evaluación!</p>
            <img src={isFinalEvaluation ? "https://res.cloudinary.com/dk2red18f/image/upload/v1721282668/WEB_EDUCA/WEB-IMAGENES/gpki5vwl5iscesql4vgz.png" : "https://res.cloudinary.com/dk2red18f/image/upload/v1721282653/WEB_EDUCA/WEB-IMAGENES/iedxcrpplh3wmu5zfctf.png"} alt="Congratulations" className="mb-4" />
            <button onClick={handleStartEvaluation} className="bg-brandmora-500 text-white rounded-lg border border-brandborder-400 px-4 py-2">
              Comenzar Evaluación
            </button>
          </div>
        ) : (
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
                          
                          style={{ width: '300px', height: '80px' }}
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
                {showReaction && (
                  <div className="absolute bottom-0 left-0 w-full h-full flex justify-center items-end">
                    <div className="relative w-full h-full flex justify-center">
                      {Array.from({ length: 20 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`absolute text-6xl ${isCorrect ? 'text-green-500' : 'text-red-500'} animate-float`}
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
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 text-white text-center text-2xl">
                Puntaje Total: {totalScore}
              </div>
            )}
            {selectedOption !== null && !showReaction && !evaluationCompleted && (
              <button
                className="mt-6 p-3 bg-brandmora-500 text-white rounded-lg border border-brandborder-400"
                style={{ width: '270px', height: '50px' }}
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
