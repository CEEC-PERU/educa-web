import React, { useState, useEffect } from "react";
import { useFlashcards } from "../../hooks/useFlashCards";
import { useRouter } from "next/router";

const FlashcardGame: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.module_id;
  const module_id = Array.isArray(rawId)
    ? parseInt(rawId[0], 10)
    : parseInt(rawId as string, 10);

  const { flashcards, isLoading } = useFlashcards(module_id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectOption, setIncorrectOption] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [allCompleted, setAllCompleted] = useState(false);

  const currentFlashcard = flashcards[currentIndex];

  const shuffle = (options: string[]) => {
    const arr = [...options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    if (currentFlashcard) {
      setShuffledOptions(
        shuffle([
          ...currentFlashcard.correct_answer,
          ...currentFlashcard.incorrect_answer,
        ])
      );
    }
  }, [currentIndex, currentFlashcard]);

  const resetRound = (reshuffle = false) => {
    setSelectedOptions([]);
    setCorrectAnswers(0);
    setGameOver(false);
    setShowModal(false);
    setIncorrectOption(null);
    if (reshuffle && currentFlashcard) {
      setShuffledOptions(
        shuffle([
          ...currentFlashcard.correct_answer,
          ...currentFlashcard.incorrect_answer,
        ])
      );
    }
  };

  const handleOptionClick = (option: string) => {
    if (gameOver || selectedOptions.includes(option)) return;

    if (currentFlashcard.correct_answer.includes(option)) {
      const newCount = correctAnswers + 1;
      const newSelected = [...selectedOptions, option];
      setCorrectAnswers(newCount);
      setSelectedOptions(newSelected);
      if (newCount === currentFlashcard.correct_answer.length) {
        setGameOver(true);
        setModalMessage("¡Correcto! Completaste esta flashcard 🎉");
        setShowModal(true);
      }
    } else {
      setIncorrectOption(option);
      setModalMessage("Respuesta incorrecta. Inténtalo de nuevo.");
      setShowModal(true);
    }
  };

  const handleRetry = () => resetRound(false);

  const handleNext = () => {
    if (currentIndex + 1 < flashcards.length) {
      setCurrentIndex(currentIndex + 1);
      resetRound(false);
    } else {
      setAllCompleted(true);
      setModalMessage("¡Completaste todos los flashcards! 🎉");
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAllCompleted(false);
    resetRound(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-white text-lg">Cargando flashcards...</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-white text-lg">Este módulo no tiene flashcards.</p>
        <button
          onClick={() => router.back()}
          className="text-white/70 hover:text-white text-sm underline transition-colors"
        >
          ← Volver a módulos
        </button>
      </div>
    );
  }

  const progressPct = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="flex flex-col items-center px-4 py-10 sm:px-8 min-h-screen">
      {/* Header */}
      <div className="w-full max-w-3xl mb-6">
        <button
          onClick={() => router.back()}
          className="text-white/70 hover:text-white text-sm transition-colors mb-5 flex items-center gap-1"
        >
          ← Volver
        </button>

        <div className="flex items-center justify-between mb-2 text-sm text-white/70">
          <span>
            Flashcard {currentIndex + 1} de {flashcards.length}
          </span>
          <span>
            {correctAnswers}/{currentFlashcard.correct_answer.length} correctas
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1.5">
          <div
            className="bg-white rounded-full h-1.5 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Pregunta */}
      <div className="w-full max-w-3xl mb-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {currentFlashcard.question}
        </h2>
      </div>

      {/* Opciones */}
      <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {shuffledOptions.map((option) => {
          const isCorrect = selectedOptions.includes(option);
          const isWrong = incorrectOption === option;
          return (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className={[
                "rounded-xl overflow-hidden border-4 cursor-pointer transition-all duration-200",
                isCorrect && "border-green-400",
                isWrong && "border-red-400",
                !isCorrect && !isWrong && "border-white/30 hover:border-white",
                gameOver && !isCorrect && "opacity-40 cursor-default",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <img
                src={option}
                alt="opción"
                className="w-full h-40 sm:h-52 object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 px-4 pb-6 sm:pb-0">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm text-center shadow-xl">
            <p className="text-gray-800 font-semibold text-lg mb-6">
              {modalMessage}
            </p>

            {!allCompleted ? (
              incorrectOption ? (
                <button
                  onClick={handleRetry}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Reintentar
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                >
                  {currentIndex + 1 < flashcards.length
                    ? "Siguiente"
                    : "Ver resultado"}
                </button>
              )
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRestart}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Jugar de nuevo
                </button>
                <button
                  onClick={() => router.back()}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Volver a módulos
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGame;
