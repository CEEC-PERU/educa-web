import React, { useState } from 'react';
import { Question, Option } from '../../../interfaces/Evaluation';
import WizardStepContainer from '../../../components/WizardStepContainer';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import AlertComponent from '../../../components/AlertComponent'; // Importar el componente de alerta
import './../../../app/globals.css';

interface StepSummaryProps {
  prevStep: () => void;
  completeForm: () => void;
  questionsData: Omit<Question, 'question_id'>[];
  optionsData: { [key: number]: Omit<Option, 'option_id'>[] };
}

const StepSummary: React.FC<StepSummaryProps> = ({ prevStep, completeForm, questionsData, optionsData }) => {
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
      <h2 className="text-2xl font-bold mb-4">Resumen</h2>
      {questionsData.map((question, index) => (
        <WizardStepContainer key={index} title={`Pregunta ${index + 1}`}>
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">{question.question_text}</h3>
            {question.image && (
              <div className="mb-4">
                <img src={question.image} alt={`Pregunta ${index + 1}`} className="max-w-full h-auto rounded-md shadow-md" />
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
      {showAlert && (
        <AlertComponent
          type="success"
          message="Evaluación creada exitosamente."
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default StepSummary;
