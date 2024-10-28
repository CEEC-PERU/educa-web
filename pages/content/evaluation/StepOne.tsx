import React, { useState } from 'react';
import { Evaluation } from '../../../interfaces/Evaluation';
import WizardStepContainer from '../../../components/WizardStepContainer';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import './../../../app/globals.css';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';

interface StepOneProps {
  nextStep: () => void;
  setEvaluationData: (data: Omit<Evaluation, 'evaluation_id'>) => void;
  evaluationData: Omit<Evaluation, 'evaluation_id'>;
}

const StepOne: React.FC<StepOneProps> = ({ nextStep, setEvaluationData, evaluationData }) => {
  const [evaluationName, setEvaluationName] = useState(evaluationData?.name || '');
  const [evaluationDescription, setEvaluationDescription] = useState(evaluationData?.description || '');
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({ name: false, description: false });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({ name: false, description: false });

  const handleNext = () => {
    const newErrors = {
      name: evaluationName.trim() === '',
      description: evaluationDescription.trim() === ''
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.description) {
      setTouched({ name: true, description: true });
      return;
    }

    setEvaluationData({ name: evaluationName, description: evaluationDescription });
    nextStep();
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({
      ...prev,
      [field]: (field === 'name' ? evaluationName : evaluationDescription).trim() === ''
    }));
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'name') {
      setEvaluationName(value);
      if (touched.name) {
        setErrors(prev => ({ ...prev, name: value.trim() === '' }));
      }
    } else if (field === 'description') {
      setEvaluationDescription(value);
      if (touched.description) {
        setErrors(prev => ({ ...prev, description: value.trim() === '' }));
      }
    }
  };

  return (
    <ProtectedRoute>
    <WizardStepContainer>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de la Evaluación</label>
        <input 
          type="text" 
          value={evaluationName} 
          onChange={(e) => handleChange('name', e.target.value)} 
          onBlur={() => handleBlur('name')}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${touched.name && errors.name ? 'border-red-500' : ''}`}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
        <textarea 
          value={evaluationDescription} 
          onChange={(e) => handleChange('description', e.target.value)} 
          onBlur={() => handleBlur('description')}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${touched.description && errors.description ? 'border-red-500' : ''}`}
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
  </ProtectedRoute>
  );
};

export default StepOne;
