import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../../../interfaces/Evaluation';
import WizardStepContainer from '../../../components/WizardStepContainer';
import { getQuestionTypes } from '../../../services/evaluationService';
import MediaUploadPreview from '../../../components/MediaUploadPreview';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import './../../../app/globals.css';

interface StepTwoProps {
  nextStep: () => void;
  prevStep: () => void;
  setQuestionsData: (
    data: (Omit<Question, 'question_id'> & { imageFile?: File | null })[]
  ) => void;
  initialQuestions: (Omit<Question, 'question_id'> & {
    imageFile?: File | null;
  })[];
}

const StepTwo: React.FC<StepTwoProps> = ({
  nextStep,
  prevStep,
  setQuestionsData,
  initialQuestions,
}) => {
  const [questions, setQuestions] = useState<
    (Omit<Question, 'question_id'> & { imageFile?: File | null })[]
  >(initialQuestions || []);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<{
    [key: number]: { [key: string]: boolean };
  }>({});
  const [errors, setErrors] = useState<{
    [key: number]: { [key: string]: boolean };
  }>({});

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const types = await getQuestionTypes();
        setQuestionTypes(types || []);
      } catch (error) {
        console.error('Error fetching question types:', error);
      }
    };

    fetchQuestionTypes();
  }, []);

  const handleQuestionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [name]: value };
    setQuestions(newQuestions);
  };

  const handleBlur = (
    index: number,
    field: keyof Omit<Question, 'question_id'>
  ) => {
    setTouchedFields((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: true },
    }));
    setErrors((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: !questions[index][field] },
    }));
  };

  const handleImageUpload = (index: number, file: File) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      imageFile: file,
      image: URL.createObjectURL(file),
    };
    setQuestions(newQuestions);
  };

  const handleNext = () => {
    const newErrors: { [key: number]: { [key: string]: boolean } } = {};
    let hasErrors = false;

    questions.forEach((question, index) => {
      newErrors[index] = {
        question_text: question.question_text.trim() === '',
        type_id: question.type_id === 0,
        score: question.score <= 0,
        image: !question.imageFile, // Validate image field
      };

      if (
        newErrors[index].question_text ||
        newErrors[index].type_id ||
        newErrors[index].score ||
        newErrors[index].image
      ) {
        hasErrors = true;
        setTouchedFields((prev) => ({
          ...prev,
          [index]: {
            question_text: true,
            type_id: true,
            score: true,
            image: true, // Mark image field as touched
          },
        }));
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      return;
    }

    setQuestionsData(questions);
    nextStep();
  };

  const addQuestionToState = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        type_id: 0,
        score: 0,
        evaluation_id: 0,
        image: '',
        imageFile: null,
      },
    ]);
  };

  return (
    <WizardStepContainer title="Step 2: Add Questions">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
      {questions.length > 0 &&
        questions.map((question, index) => (
          <div
            key={index}
            className="mb-6 border border-gray-300 rounded-lg p-4"
          >
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Pregunta
            </label>
            <input
              type="text"
              name="question_text"
              value={question.question_text}
              onChange={(e) => handleQuestionChange(index, e)}
              onBlur={() => handleBlur(index, 'question_text')}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                touchedFields[index]?.question_text &&
                errors[index]?.question_text
                  ? 'border-red-500'
                  : ''
              }`}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
              Tipo de Pregunta
            </label>
            <select
              name="type_id"
              value={question.type_id}
              onChange={(e) => handleQuestionChange(index, e)}
              onBlur={() => handleBlur(index, 'type_id')}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                touchedFields[index]?.type_id && errors[index]?.type_id
                  ? 'border-red-500'
                  : ''
              }`}
            >
              <option value="">Seleccionar Tipo de Pregunta</option>
              {questionTypes.map((type) => (
                <option key={type.type_id} value={type.type_id}>
                  {type.name}
                </option>
              ))}
            </select>
            <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
              Puntaje
            </label>
            <input
              type="number"
              name="score"
              value={question.score}
              onChange={(e) => handleQuestionChange(index, e)}
              onBlur={() => handleBlur(index, 'score')}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                touchedFields[index]?.score && errors[index]?.score
                  ? 'border-red-500'
                  : ''
              }`}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">
              Imagen (opcional)
            </label>
            <MediaUploadPreview
              onMediaUpload={(file) => handleImageUpload(index, file)}
              accept="image/*"
              label={`question-${index}`}
              initialPreview={question.image || ''}
              error={errors[index]?.image}
              touched={touchedFields[index]?.image}
            />
          </div>
        ))}
      <button
        onClick={addQuestionToState}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
        Agregar otra pregunta
      </button>

      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
          Regresar
        </button>
        <button
          onClick={handleNext}
          disabled={loading || questions.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
          <ArrowRightIcon className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>
    </WizardStepContainer>
  );
};

export default StepTwo;
