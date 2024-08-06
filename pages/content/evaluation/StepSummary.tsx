import React, { useState } from 'react';
import { Question, Option } from '../../../interfaces/Evaluation';
import WizardStepContainer from '../../../components/WizardStepContainer';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import AlertComponent from '../../../components/AlertComponent'; // Importar el componente de alerta
import './../../../app/globals.css';

interface StepSummaryProps {
  prevStep: () => void;
  completeForm: () => void;
  questionsData: (Omit<Question, 'question_id'> & { imageFile?: File | null })[];
  optionsData: { [key: number]: Omit<Option, 'option_id'>[] };
}

const StepSummary: React.FC<StepSummaryProps> = ({ prevStep, completeForm, questionsData = [], optionsData = {} }) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleComplete = () => {
    completeForm();
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000); // Ocultar la alerta después de 3 segundos
  };

  return (
    <div className="space-y-6">
      {showAlert && (
        <AlertComponent
          type="success"
          message="Evaluación creada exitosamente."
          onClose={() => setShowAlert(false)}
        />
      )}
      {questionsData.map((question, index) => (
        <WizardStepContainer key={index}>
          <div className="mb-4 pb-4 border-b p-4 rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-purple-500 font-semibold"><strong>Pregunta {index + 1}</strong></h3>
              <span className="text-blue-600 font-bold">{question.score} pts</span>
            </div>
            <hr className="border-gray-200 mb-4 mt-4" />
            <div className="space-y-2">
              <p className="text-gray-800">{question.question_text}</p>
              {question.image && (
                <div className="flex justify-center">
                  <img src={question.image} alt={`Pregunta ${index + 1}`} className="max-w-full h-64 object-contain rounded mb-4" />
                </div>
              )}
              <ul className="list-disc list-inside">
                {(optionsData[index] || []).map((option, optionIndex) => (
                  <li key={optionIndex} className={`mb-1 ${option.is_correct ? 'text-green-600 font-semibold' : ''}`}>
                    {option.option_text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </WizardStepContainer>
      ))}
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="py-2 px-4 bg-gray-600 text-white rounded-md flex items-center">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Anterior
        </button>
        <button onClick={handleComplete} className="py-2 px-4 bg-custom-purple text-white rounded-md flex items-center">
          <CheckIcon className="w-5 h-5 mr-2" />
          Completar
        </button>
      </div>
    </div>
  );
};

export default StepSummary;
