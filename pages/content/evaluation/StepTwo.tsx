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
  const [questions, setQuestions] = useState<Omit<Question, 'question_id'>[]>(initialQuestions || []);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<{ [key: number]: { [key: string]: boolean } }>({});
  const [errors, setErrors] = useState<{ [key: number]: { [key: string]: boolean } }>({});

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

  const handleQuestionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [name]: value };
    setQuestions(newQuestions);
  };

  const handleBlur = (index: number, field: keyof Omit<Question, 'question_id'>) => {
    setTouchedFields(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: true }
    }));
    setErrors(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: !questions[index][field] }
    }));
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

  const handleNext = () => {
    const newErrors: { [key: number]: { [key: string]: boolean } } = {};
    let hasErrors = false;

    questions.forEach((question, index) => {
      newErrors[index] = {
        question_text: question.question_text.trim() === '',
        type_id: question.type_id === 0,
        score: question.score <= 0,
        image: question.image?.trim() === ''
      };

      if (newErrors[index].question_text || newErrors[index].type_id || newErrors[index].score || newErrors[index].image) {
        hasErrors = true;
        setTouchedFields(prev => ({
          ...prev,
          [index]: {
            question_text: true,
            type_id: true,
            score: true,
            image: true
          }
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
    setQuestions([...questions, { question_text: '', type_id: 0, score: 0, evaluation_id: 0, image: '' }]);
  };

  return (
    <WizardStepContainer title="Step 2: Add Questions">
      {loading && <p>Cargando imagen...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {questions.length > 0 && questions.map((question, index) => (
        <div key={index} className="mb-6 border border-gray-300 rounded-lg p-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Pregunta</label>
          <input
            type="text"
            name="question_text"
            value={question.question_text}
            onChange={(e) => handleQuestionChange(index, e)}
            onBlur={() => handleBlur(index, 'question_text')}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${touchedFields[index]?.question_text && errors[index]?.question_text ? 'border-red-500' : ''}`}
          />
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">Tipo de Pregunta</label>
          <select
            name="type_id"
            value={question.type_id}
            onChange={(e) => handleQuestionChange(index, e)}
            onBlur={() => handleBlur(index, 'type_id')}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${touchedFields[index]?.type_id && errors[index]?.type_id ? 'border-red-500' : ''}`}
          >
            <option value="">Seleccionar Tipo de Pregunta</option>
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
            onBlur={() => handleBlur(index, 'score')}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${touchedFields[index]?.score && errors[index]?.score ? 'border-red-500' : ''}`}
          />
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">Imagen (opcional)</label>
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
      <button onClick={addQuestionToState} className="py-2 px-4 bg-green-600 text-white rounded-md mr-4 flex items-center">
        <PlusIcon className="w-5 h-5 mr-2" />
        Agregar Pregunta
      </button>
      
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="py-2 px-4 bg-gray-600 text-white rounded-md flex items-center">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Anterior
        </button>
        <button onClick={handleNext} className="py-2 px-4 bg-custom-purple text-white rounded-md flex items-center" disabled={loading}>
          Siguiente
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
      </div>
    </WizardStepContainer>
  );
};

export default StepTwo;
