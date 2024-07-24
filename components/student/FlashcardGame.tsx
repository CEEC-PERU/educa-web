import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const flashcardData = {
  flashcard: {
    flashcard_id: 1,
    name: "Test 1",
    description: "Flashcard curso 1",
    questions: [
      {
        question_id: 2,
        question_text: "¿Que son las habilidades blandas?",
        options: [
          { option_id: 5, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158135/CEEC/FLASHCARD/jmpexf1hqcpa51ax5vre.png", is_correct: false },
          { option_id: 4, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158095/CEEC/FLASHCARD/rbeqvaccktqh3pmepsib.png", is_correct: false },
          { option_id: 3, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158083/CEEC/FLASHCARD/qmmk1wvqkra3bjblmzqr.png", is_correct: true },
          { option_id: 2, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158071/CEEC/FLASHCARD/lvgadawp51bisqcw5kjw.png", is_correct: true },
          { option_id: 1, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158071/CEEC/FLASHCARD/lvgadawp51bisqcw5kjw.png", is_correct: true }
        ]
      },
      {
        question_id: 3,
        question_text: "¿Tercera pregunta?",
        options: [
          { option_id: 3, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158135/CEEC/FLASHCARD/jmpexf1hqcpa51ax5vre.png", is_correct: false },
          { option_id: 4, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158095/CEEC/FLASHCARD/rbeqvaccktqh3pmepsib.png", is_correct: false },
          { option_id: 3, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158083/CEEC/FLASHCARD/qmmk1wvqkra3bjblmzqr.png", is_correct: true },
          { option_id: 2, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158071/CEEC/FLASHCARD/lvgadawp51bisqcw5kjw.png", is_correct: true },
          { option_id: 1, option_text: "https://res.cloudinary.com/dk2red18f/image/upload/v1709158071/CEEC/FLASHCARD/lvgadawp51bisqcw5kjw.png", is_correct: true }
        ]
      }
    ]
  }
};

const FlashcardGame: React.FC = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [incorrectOption, setIncorrectOption] = useState<number | null>(null);

  const questions = flashcardData.flashcard.questions;

  useEffect(() => {
    shuffleOptions();
  }, [questionIndex]);

  const shuffleOptions = () => {
    const options = [...questions[questionIndex].options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    setShuffledOptions(options);
  };

  const handleOptionClick = (option: any) => {
    if (gameOver) return;
    if (selectedOptions.includes(option.option_id)) return;

    if (option.is_correct) {
      setCorrectAnswers(correctAnswers + 1);
      setSelectedOptions([...selectedOptions, option.option_id]);
      if (correctAnswers + 1 === questions[questionIndex].options.filter(opt => opt.is_correct).length) {
        setGameOver(true);
        setModalMessage('¡Felicidades! Has seleccionado todas las respuestas correctas 🎉');
        setShowModal(true);
      }
    } else {
      setIncorrectOption(option.option_id);
      setGameOver(true);
      setModalMessage('¡Has seleccionado una respuesta incorrecta! Inténtalo de nuevo.');
      setShowModal(true);
    }
  };

  const retryGame = () => {
    setQuestionIndex(0);
    setSelectedOptions([]);
    setCorrectAnswers(0);
    setGameOver(false);
    setShowModal(false);
    setIncorrectOption(null);
    shuffleOptions();
  };

  return (
    <div className="min-h-screen  from-brand-100 via-brand-200 to-brand-300  flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-white font-bold mb-4">{questions[questionIndex].question_text}</h1>
      <p className="mb-4 text-white">{correctAnswers}/{questions[questionIndex].options.filter(opt => opt.is_correct).length} correctas</p>
      <div className="grid grid-cols-3 gap-4">
        {shuffledOptions.map((option) => (
          <div
            key={option.option_id}
            onClick={() => handleOptionClick(option)}
            className={`border-4 p-2 cursor-pointer transform transition-transform ${
              selectedOptions.includes(option.option_id)
                ? 'border-green-500'
                : incorrectOption === option.option_id
                ? 'border-red-500'
                : 'border-white'
            }`}
          >
            <img src={option.option_text} alt="option" className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg text-center">
            <p>{modalMessage}</p>
            <button onClick={retryGame} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Reintentar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGame;
