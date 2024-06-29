import React, { useState, useEffect } from 'react';
import { Question, Option } from '../../../interfaces/Evaluation';
import WizardStepContainer from '../../../components/WizardStepContainer';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import './../../../app/globals.css';

interface StepThreeProps {
  prevStep: () => void;
  nextStep: () => void;
  setOptionsData: (data: { [key: number]: Omit<Option, 'option_id'>[] }) => void;
  questionsData: Omit<Question, 'question_id'>[];
  optionsData: { [key: number]: Omit<Option, 'option_id'>[] };
}

const StepThree: React.FC<StepThreeProps> = ({ prevStep, nextStep, questionsData, setOptionsData, optionsData }) => {
  const [localOptionsData, setLocalOptionsData] = useState<{ [key: number]: Omit<Option, 'option_id'>[] }>(optionsData);

  useEffect(() => {
    setLocalOptionsData(optionsData);
  }, [optionsData]);

  const handleOptionChange = (questionId: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newOptions = { ...localOptionsData };
    const questionOptions = newOptions[questionId] || [];

    if (type === 'checkbox') {
      questionOptions[optionIndex] = { ...questionOptions[optionIndex], [name]: checked };
    } else {
      questionOptions[optionIndex] = { ...questionOptions[optionIndex], [name]: value };
    }

    newOptions[questionId] = questionOptions;
    setLocalOptionsData(newOptions);
  };

  const addOption = (questionId: number) => {
    const newOptions = { ...localOptionsData };
    const questionOptions = newOptions[questionId] || [];
    questionOptions.push({ option_text: '', is_correct: false, question_id: questionId });
    newOptions[questionId] = questionOptions;
    setLocalOptionsData(newOptions);
  };

  const handleNext = () => {
    setOptionsData(localOptionsData);
    nextStep();
  };

  return (
    <WizardStepContainer>
      {questionsData.map((question, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-bold">{question.question_text}</h3>
          {(localOptionsData[index] || []).map((option, optionIndex) => (
            <div key={optionIndex} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 mt-5">Opción</label>
              <input 
                type="text" 
                name="option_text" 
                value={option.option_text} 
                onChange={(e) => handleOptionChange(index, optionIndex, e)} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                <input 
                  type="checkbox" 
                  name="is_correct" 
                  checked={option.is_correct} 
                  onChange={(e) => handleOptionChange(index, optionIndex, e)} 
                  className="mr-2"
                />
                Correcta
              </label>
            </div>
          ))}
          <button onClick={() => addOption(index)} className="mt-4 py-2 px-4 bg-green-600 text-white rounded-md mr-4 flex items-center">
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
