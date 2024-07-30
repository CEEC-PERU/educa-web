import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const flashcardData = {
  flashcard_id: 1,
  question: "Indicación del flashcard",
  correct_answer: [
    "https://res.cloudinary.com/dk2red18f/image/upload/v1709055523/CEEC/FLASHCARD/op1wnba750zlcocvyl06.png",
    "https://res.cloudinary.com/dk2red18f/image/upload/v1709055556/CEEC/FLASHCARD/pgvp4clvoeep9kvkkw2j.png",
    "https://res.cloudinary.com/dk2red18f/image/upload/v1709055504/CEEC/FLASHCARD/u5txpc008783lv0jzq6d.png"
  ],
  incorrect_answer: [
    "https://res.cloudinary.com/dk2red18f/image/upload/v1709158095/CEEC/FLASHCARD/rbeqvaccktqh3pmepsib.png",
    "https://res.cloudinary.com/dk2red18f/image/upload/v1709158083/CEEC/FLASHCARD/qmmk1wvqkra3bjblmzqr.png",
    "https://res.cloudinary.com/dk2red18f/image/upload/v1709158071/CEEC/FLASHCARD/lvgadawp51bisqcw5kjw.png"
  ],
  course_id: 101,
  created_at: "2023-07-29T12:34:56Z",
  updated_at: "2023-07-29T12:34:56Z"
};

const FlashcardGame: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [incorrectOption, setIncorrectOption] = useState<string | null>(null);

  const question = flashcardData.question;
  const correctAnswersList = flashcardData.correct_answer;
  const incorrectAnswersList = flashcardData.incorrect_answer;

  useEffect(() => {
    shuffleOptions();
  }, []);

  const shuffleOptions = () => {
    const options = [...correctAnswersList, ...incorrectAnswersList];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    setShuffledOptions(options);
  };

  const handleOptionClick = (option: string) => {
    if (gameOver) return;
    if (selectedOptions.includes(option)) return;

    if (correctAnswersList.includes(option)) {
      setCorrectAnswers(correctAnswers + 1);
      setSelectedOptions([...selectedOptions, option]);
      if (correctAnswers + 1 === correctAnswersList.length) {
        setGameOver(true);
        setModalMessage('¡Felicidades! Has seleccionado todas las respuestas correctas 🎉');
        setShowModal(true);
      }
    } else {
      setIncorrectOption(option);
      setGameOver(true);
      setModalMessage('¡Has seleccionado una respuesta incorrecta! Inténtalo de nuevo.');
      setShowModal(true);
    }
  };

  const retryGame = () => {
    setSelectedOptions([]);
    setCorrectAnswers(0);
    setGameOver(false);
    setShowModal(false);
    setIncorrectOption(null);
    shuffleOptions();
  };

  return (
    <div className="min-h-screen from-brand-100 via-brand-200 to-brand-300 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-white font-bold mb-4">{question}</h1>
      <p className="mb-4 text-white">{correctAnswers}/{correctAnswersList.length} correctas</p>
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
            <button onClick={retryGame} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Reintentar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGame;
