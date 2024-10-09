import React, { useState } from 'react';

// Componente del formulario de estrellas
export const StarForm: React.FC<{ onSubmit: (score: number) => void }> = ({ onSubmit }) => {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedStar !== null) {
      onSubmit(selectedStar); // Enviar puntaje seleccionado
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-900 to-cyan-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-white text-3xl mb-4">¿Cómo calificarías el curso?</h2>
      <h6 className="text-white text-xl mb-4">Selecciona una calificación de estrellas</h6>

      {/* Contenedor de las estrellas */}
      <div className="flex justify-around w-full mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`text-5xl p-2 transition-transform ${
              selectedStar && selectedStar >= star
                ? 'text-yellow-400'  // Color amarillo cuando está seleccionado
                : 'text-white'
            }`}
            onClick={() => setSelectedStar(star)}  // Asignar puntaje al hacer clic
          >
            ★
          </button>
        ))}
      </div>

      {/* Botón enviar solo si se selecciona una estrella */}
      {selectedStar !== null && (
        <button
          onClick={handleSubmit}
          className="bg-yellow-400 text-blue-900 font-bold text-xl px-8 py-4"
        >
          Enviar
        </button>
      )}
    </div>
  );
};

export default StarForm;
