import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../../../interfaces/Evaluation';
import WizardStepContainer from '../../../components/WizardStepContainer';
import { getQuestionTypes } from '../../../services/evaluationService';
import { uploadImage } from '../../../services/imageService';
import MediaUploadPreview from '../../../components/MediaUploadPreview';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import './../../../app/globals.css';

interface StepTwoProps {
  nextStep: () => void;
  prevStep: () => void;
  setQuestionsData: (data: Omit<Question, 'question_id'>[]) => void;
  initialQuestions: Omit<Question, 'question_id'>[];
}

const StepTwo: React.FC<StepTwoProps> = ({ nextStep, prevStep, setQuestionsData, initialQuestions }) => {
  const [questions, setQuestions] = useState<Omit<Question, 'question_id'>[]>(initialQuestions);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      const types = await getQuestionTypes();
      setQuestionTypes(types);
    };

    fetchQuestionTypes();
  }, []);

  const handleQuestionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [name]: value };
    setQuestions(newQuestions);
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      setLoading(true);
      const imageUrl = await uploadImage(file, 'questions');
      const newQuestions = [...questions];
      newQuestions[index] = { ...newQuestions[index], image: imageUrl };
      setQuestions(newQuestions);
    } catch (error) {
      setError('Error uploading image');
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      setQuestionsData(questions);
      nextStep();
    } catch (error) {
      setError('Error creating questions');
      console.error('Error creating questions:', error);
    }
  };

  const addQuestionToState = () => {
    setQuestions([...questions, { question_text: '', type_id: questionTypes[0]?.type_id || 1, score: 0, evaluation_id: 0, image: '' }]);
  };

  return (
    <WizardStepContainer title="Step 2: Add Questions">
      {loading && <p>Cargando imagen...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {questions.map((question, index) => (
        <div key={index} className="mb-6 border border-gray-300 rounded-lg p-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Pregunta</label>
          <input
            type="text"
            name="question_text"
            value={question.question_text}
            onChange={(e) => handleQuestionChange(index, e)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">Tipo de Pregunta</label>
          <select
            name="type_id"
            value={question.type_id}
            onChange={(e) => handleQuestionChange(index, e)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {questionTypes.map((type) => (
              <option key={type.type_id} value={type.type_id}>
                {type.name}
              </option>
            ))}
          </select>
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">Puntaje</label>
          <input
            type="number"
            name="score"
            value={question.score}
            onChange={(e) => handleQuestionChange(index, e)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">Imagen (opcional)</label>
          <MediaUploadPreview
            onMediaUpload={(file) => handleImageUpload(index, file)}
            accept="image/*"
            label={`question-${index}`}
            initialPreview={question.image}
          />
        </div>
      ))}
      <button onClick={addQuestionToState} className="py-2 px-4 bg-green-600 text-white rounded-md mr-4 flex items-center">
        <PlusIcon className="w-5 h-5 mr-2" />
        Agregar Pregunta
      </button>
      
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="py-2 px-4 bg-gray-600 text-white rounded-md flex items-center">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Anterior
        </button>
        <button onClick={handleNext} className="py-2 px-4 bg-custom-purple text-white rounded-md flex items-center">
          Siguiente
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
      </div>
    </WizardStepContainer>
  );
};

export default StepTwo;
