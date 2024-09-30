

import React, { useState } from 'react';

export const NPSForm: React.FC<{ onSubmit: (score: number) => void }> = ({ onSubmit }) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const emojis = ["😡", "😞", "😐", "🙂", "😃"];

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
            className={`text-5xl ${selectedScore === idx + 1 ? 'text-yellow-400' : 'text-white'} transition-transform`}
            onClick={() => setSelectedScore(idx + 1)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} className="bg-yellow-400 text-purple-900 font-bold text-xl px-8 py-4">
        Enviar
      </button>
    </div>
  );
};

export default NPSForm;