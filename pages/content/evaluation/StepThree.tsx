import React, { useState } from 'react';
import { Question, Option } from '../../../interfaces/Evaluation';
import WizardStepContainer from '../../../components/WizardStepContainer';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import './../../../app/globals.css';

interface StepThreeProps {
  prevStep: () => void;
  nextStep: () => void;
  questionsData: Omit<Question, 'question_id'>[];
  setOptionsData: (data: { [key: number]: Omit<Option, 'option_id'>[] }) => void;
  optionsData: { [key: number]: Omit<Option, 'option_id'>[] };
}

const StepThree: React.FC<StepThreeProps> = ({ prevStep, questionsData = [], setOptionsData, optionsData = {}, nextStep }) => {
  const [localOptionsData, setLocalOptionsData] = useState<{ [key: number]: Omit<Option, 'option_id'>[] }>(optionsData);
  const [touchedFields, setTouchedFields] = useState<{ [key: number]: boolean[] }>({});
  const [errors, setErrors] = useState<{ [key: number]: boolean[] }>({});
  const [correctOptionErrors, setCorrectOptionErrors] = useState<{ [key: number]: boolean }>({});

  const handleOptionChange = (questionIndex: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newOptions = { ...localOptionsData };
    const questionOptions = newOptions[questionIndex] || [];

    if (type === 'checkbox') {
      questionOptions[optionIndex] = { ...questionOptions[optionIndex], [name]: checked };
    } else {
      questionOptions[optionIndex] = { ...questionOptions[optionIndex], [name]: value };
    }

    newOptions[questionIndex] = questionOptions;
    setLocalOptionsData(newOptions);

    // Clear the error if any checkbox is checked
    if (type === 'checkbox' && checked) {
      setCorrectOptionErrors(prev => ({
        ...prev,
        [questionIndex]: false,
      }));
    }
  };

  const addOption = (questionIndex: number) => {
    const newOptions = { ...localOptionsData };
    const questionOptions = newOptions[questionIndex] || [];
    questionOptions.push({ option_text: '', is_correct: false, question_id: questionsData[questionIndex].evaluation_id });
    newOptions[questionIndex] = questionOptions;
    setLocalOptionsData(newOptions);
  };

  const handleBlur = (questionId: number, optionIndex: number, field: keyof Omit<Option, 'option_id'>) => {
    setTouchedFields(prev => ({
      ...prev,
      [questionId]: prev[questionId] ? [...prev[questionId], true] : [true]
    }));
    setErrors(prev => ({
      ...prev,
      [questionId]: prev[questionId] ? [...prev[questionId], !localOptionsData[questionId][optionIndex][field]] : [!localOptionsData[questionId][optionIndex][field]]
    }));
  };

  const handleNext = () => {
    const newErrors: { [key: number]: boolean[] } = {};
    const newCorrectOptionErrors: { [key: number]: boolean } = {};
    let hasErrors = false;

    Object.keys(localOptionsData).forEach((questionId) => {
      newErrors[Number(questionId)] = localOptionsData[Number(questionId)].map(option => option.option_text.trim() === '');
      if (newErrors[Number(questionId)].includes(true)) {
        hasErrors = true;
        setTouchedFields(prev => ({
          ...prev,
          [Number(questionId)]: localOptionsData[Number(questionId)].map(() => true)
        }));
      }

      const hasCorrectOption = localOptionsData[Number(questionId)].some(option => option.is_correct);
      if (!hasCorrectOption) {
        newCorrectOptionErrors[Number(questionId)] = true;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setCorrectOptionErrors(newCorrectOptionErrors);

    if (hasErrors) {
      return;
    }

    setOptionsData(localOptionsData);
    nextStep();
  };

  return (
    <WizardStepContainer>
      {questionsData.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-4">
          <h3 className="text-lg font-bold">{question.question_text}</h3>
          {(localOptionsData[questionIndex] || []).map((option, optionIndex) => (
            <div key={optionIndex} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">Opción</label>
              <input 
                type="text" 
                name="option_text" 
                value={option.option_text} 
                onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)} 
                onBlur={() => handleBlur(questionIndex, optionIndex, 'option_text')}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${touchedFields[questionIndex]?.[optionIndex] && errors[questionIndex]?.[optionIndex] ? 'border-red-500' : ''}`}
              />
              <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                <input 
                  type="checkbox" 
                  name="is_correct" 
                  checked={option.is_correct} 
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)} 
                  className="mr-2"
                />
                Correcta
              </label>
              {correctOptionErrors[questionIndex] && optionIndex === localOptionsData[questionIndex].length - 1 && (
                <p className="text-red-500 text-xs italic">Debe marcar al menos una opción como correcta.</p>
              )}
            </div>
          ))}
          <button onClick={() => addOption(questionIndex)} className="py-2 px-4 bg-green-600 text-white rounded-md mr-4 flex items-center mt-4">
            <PlusIcon className="w-5 h-5 mr-2" />
            Agregar Opciones
          </button>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="py-2 px-4 bg-gray-600 text-white rounded-md mr-4 flex items-center">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
        </button>
        <button onClick={handleNext} className="py-2 px-4 bg-custom-purple text-white rounded-md flex items-center">
          <ArrowRightIcon className="w-5 h-5 mr-2" />
          Siguiente
        </button>
      </div>
    </WizardStepContainer>
  );
};

export default StepThree;
