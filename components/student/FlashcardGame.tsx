import React, { useState, useEffect } from 'react';
import { useFlashcards } from '../../hooks/useFlashCards';
import { useRouter } from 'next/router';

const FlashcardGame: React.FC = () => {
  const router = useRouter();
  const module_id = Array.isArray(router.query.module_id)
    ? parseInt(router.query.module_id[0], 10)
    : parseInt(router.query.module_id as string, 10);
    
  const { flashcards, isLoading } = useFlashcards(module_id);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [incorrectOption, setIncorrectOption] = useState<string | null>(null);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [completedAllFlashcards, setCompletedAllFlashcards] = useState(false);

  const currentFlashcard = flashcards[currentFlashcardIndex]; 

  useEffect(() => {
    if (currentFlashcard) {
      shuffleOptions(); // Solo barajar las opciones la primera vez que se carga la tarjeta
    }
  }, [currentFlashcardIndex, currentFlashcard]);

  const shuffleOptions = () => {
    if (currentFlashcard) {
      const options = [...currentFlashcard.correct_answer, ...currentFlashcard.incorrect_answer];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      setShuffledOptions(options);
    }
  };

  const handleOptionClick = (option: string) => {
    if (gameOver || selectedOptions.includes(option)) return;

    if (currentFlashcard?.correct_answer.includes(option)) {
      setCorrectAnswers(correctAnswers + 1);
      setSelectedOptions([...selectedOptions, option]);
      if (correctAnswers + 1 === currentFlashcard.correct_answer.length) {
        setGameOver(true);
        setModalMessage('¡Felicidades! Has seleccionado todas las respuestas correctas 🎉');
        setShowModal(true);
      }
    } else {
      setIncorrectOption(option);
      setModalMessage('¡Has seleccionado una respuesta incorrecta! Inténtalo de nuevo.');
      setShowModal(true);
    }
  };

  const resetGame = (keepOptions: boolean = true) => {
    setSelectedOptions([]);
    setCorrectAnswers(0);
    setGameOver(false);
    setShowModal(false);
    setIncorrectOption(null);

    if (!keepOptions) {
      shuffleOptions(); // Solo barajar si es necesario
    }
  };

  // Modificado para reiniciar el mismo flashcard sin barajar las opciones
  const handleRetryFlashcard = () => {
    resetGame(true); // No reordenar las opciones
  };

  const handleNextFlashcard = () => {
    if (currentFlashcardIndex + 1 < flashcards.length) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
      resetGame();
    } else {
      setCompletedAllFlashcards(true);
      setModalMessage('¡Has completado todos los flashcards! 🎉');
    }
  };

  const handleRestart = () => {
    setCurrentFlashcardIndex(0);
    setCompletedAllFlashcards(false);
    resetGame();
  };

  if (isLoading || !currentFlashcard) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen from-brand-100 via-brand-200 to-brand-300 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-white font-bold mb-4">{currentFlashcard.question}</h1>
      <p className="mb-4 text-white">{correctAnswers}/{currentFlashcard.correct_answer.length} correctas</p>
      <div className="grid grid-cols-3 gap-4">
        {shuffledOptions.map((option) => (
          <div
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`border-4 p-2 cursor-pointer transform transition-transform ${
              selectedOptions.includes(option)
                ? 'border-green-500'
                : incorrectOption === option
                ? 'border-red-500'
                : 'border-white'
            }`}
          >
            <img src={option} alt="option" className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg text-center">
            <p>{modalMessage}</p>
            {!completedAllFlashcards ? (
              incorrectOption ? (
                <button onClick={handleRetryFlashcard} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                  Reintentar
                </button>
              ) : (
                <button onClick={handleNextFlashcard} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                  Siguiente
                </button>
              )
            ) : (
              <button onClick={handleRestart} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
                Finalizar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGame;
