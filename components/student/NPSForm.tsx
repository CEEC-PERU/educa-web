

import React, { useState } from 'react';

// Componente del formulario NPS
export const NPSForm: React.FC<{ onSubmit: (score: number) => void }> = ({ onSubmit }) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedScore !== null) {
      onSubmit(selectedScore); // Enviar puntaje seleccionado
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-900 to-fuchsia-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-white text-3xl mb-4">¿Qué tan probable es que recomiendes el curso?</h2>
      <h6 className="text-white text-xl mb-4">En una escala del 1 al 10</h6>

      {/* Contenedor de los números del 1 al 10 */}
      <div className="flex justify-around w-full mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
          <button
            key={score}
            className={`text-3xl p-2 transition-transform ${
              selectedScore === score
                ? 'bg-yellow-400 text-purple-900 font-bold rounded-full px-4 py-2'  // Color de fondo y borde cuando está seleccionado
                : 'text-white'
            }`}
            onClick={() => setSelectedScore(score)}  // Asignar puntaje al hacer clic
          >
            {score}
          </button>
        ))}
      </div>

      {/* Botón enviar solo si se selecciona una puntuación */}
      {selectedScore !== null && (
        <button
          onClick={handleSubmit}
          className="bg-yellow-400 text-purple-900 font-bold text-xl px-8 py-4"
        >
          Enviar
        </button>
      )}
    </div>
  );
};

export default NPSForm;
