// StepOne.tsx
import React, { useState } from 'react';
import { Evaluation } from '../../../interfaces/Evaluation';
import WizardStepContainer from '../../../components/WizardStepContainer';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import './../../../app/globals.css';

interface StepOneProps {
  nextStep: () => void;
  setEvaluationData: (data: Omit<Evaluation, 'evaluation_id'>) => void;
}

const StepOne: React.FC<StepOneProps> = ({ nextStep, setEvaluationData }) => {
  const [evaluationName, setEvaluationName] = useState('');
  const [evaluationDescription, setEvaluationDescription] = useState('');

  const handleNext = () => {
    setEvaluationData({ name: evaluationName, description: evaluationDescription });
    nextStep();
  };

  return (
    <WizardStepContainer>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de la Evaluación</label>
        <input 
          type="text" 
          value={evaluationName} 
          onChange={(e) => setEvaluationName(e.target.value)} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
        <textarea 
          value={evaluationDescription} 
          onChange={(e) => setEvaluationDescription(e.target.value)} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button 
        onClick={handleNext} 
        className="py-2 px-4 bg-custom-purple text-white rounded-md flex items-center"
      >
        <ArrowRightIcon className="w-5 h-5 mr-2" />
        Siguiente
      </button>
    </WizardStepContainer>
  );
};

export default StepOne;
