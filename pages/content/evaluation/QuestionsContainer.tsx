import React from 'react';
import { Question, Option, QuestionType } from '../../../interfaces/Evaluation';
import { uploadImage } from '../../../services/imageService';
import MediaUploadPreview from '../../../components/MediaUploadPreview';
import { PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import './../../../app/globals.css';

interface QuestionsContainerProps {
  questions: Question[];
  isEditing: boolean;
  questionTypes: QuestionType[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const QuestionsContainer: React.FC<QuestionsContainerProps> = ({ questions, isEditing, questionTypes, setQuestions }) => {

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const newOption: Omit<Option, 'option_id'> = {
      question_id: 0, // Asignar 0 temporalmente, ya que será autoincremental en la base de datos
      option_text: '',
      is_correct: false,
    };
    const questionOptions = updatedQuestions[questionIndex].options || [];
    updatedQuestions[questionIndex].options = [...questionOptions, newOption];
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    const newQuestion: Omit<Question, 'question_id'> = {
      evaluation_id: 0, // Debe asignarse el id de la evaluación correspondiente
      question_text: '',
      type_id: questionTypes[0]?.type_id || 1,
      score: 0,
      image: '',
      options: [],
    };
    setQuestions([...questions, newQuestion as Question]);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number, optionIndex: number) => {
    const { value, checked, type } = e.target;
    const updatedQuestions = [...questions];
    if (type === 'checkbox') {
      updatedQuestions[questionIndex].options![optionIndex].is_correct = checked;
    } else {
      updatedQuestions[questionIndex].options![optionIndex].option_text = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const imageUrl = await uploadImage(file, 'Preguntas');
      const updatedQuestions = [...questions];
      updatedQuestions[index] = { ...updatedQuestions[index], image: imageUrl };
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
    setQuestions(updatedQuestions);
  };

  const getQuestionTypeName = (type_id: number) => {
    const type = questionTypes.find(t => t.type_id === type_id);
    return type ? type.name : 'Tipo desconocido';
  };

  if (!questions || questions.length === 0) {
    return <div>No hay preguntas disponibles.</div>;
  }

  if (!questionTypes || questionTypes.length === 0) {
    return <div>No hay tipos de preguntas disponibles.</div>;
  }

  return (
    <div className="w-full max-w-5xl">
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-6 pb-4 border-b p-4 rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-purple-500 font-semibold"><strong>Pregunta {questionIndex + 1}</strong></h3>
            <span className="text-blue-600 font-bold">{question.score} pts</span>
          </div>
          <hr className="border-gray-200 mb-4 mt-4" />
          {isEditing ? (
            <div className="space-y-4">
              <input
                id={`questionText${questionIndex}`}
                type="text"
                name="question_text"
                value={question.question_text}
                onChange={(e) => handleQuestionChange(e, questionIndex)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <label className="block text-sm font-bold mb-2 text-gray-400">Tipo de Pregunta</label>
              <select
                id={`questionType${questionIndex}`}
                name="type_id"
                value={question.type_id}
                onChange={(e) => handleQuestionChange(e, questionIndex)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {questionTypes.map((type) => (
                  <option key={type.type_id} value={type.type_id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-bold mb-2 text-gray-400">Puntaje</label>
              <input
                id={`questionScore${questionIndex}`}
                type="number"
                name="score"
                value={question.score}
                onChange={(e) => handleQuestionChange(e, questionIndex)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <label className="block text-sm font-bold mb-2 text-gray-400">Imagen</label>
              <MediaUploadPreview 
                onMediaUpload={(file) => handleImageUpload(questionIndex, file)} 
                accept="image/*" 
                label={`Subir Imagen ${questionIndex}`}
                initialPreview={question.image}
              />
              <p className="text-gray-400"><strong>Opciones</strong></p>
              {question.type_id === 3 ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Verdadero</label>
                    <input 
                      type="checkbox" 
                      name="is_correct" 
                      checked={question.options?.[0]?.is_correct || false} 
                      onChange={(e) => handleOptionChange(e, questionIndex, 0)} 
                      className="mr-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Falso</label>
                    <input 
                      type="checkbox" 
                      name="is_correct" 
                      checked={question.options?.[1]?.is_correct || false} 
                      onChange={(e) => handleOptionChange(e, questionIndex, 1)} 
                      className="mr-2"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="ml-4 mt-2">
                      <input
                        id={`optionText${questionIndex}-${optionIndex}`}
                        type="text"
                        value={option.option_text}
                        onChange={(e) => handleOptionChange(e, questionIndex, optionIndex)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <label className="block text-blue-600 text-sm font-bold mb-2 mt-4">Correcta</label>
                      <input
                        id={`optionCorrect${questionIndex}-${optionIndex}`}
                        type="checkbox"
                        checked={option.is_correct}
                        onChange={(e) => handleOptionChange(e, questionIndex, optionIndex)}
                        className="mr-2 leading-tight"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(questionIndex)}
                    className="py-2 px-4 bg-green-500 text-white rounded-md mt-4 flex items-center"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Agregar Opción
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-800">{question.question_text}</p>
              {question.image && (
                <div className="flex justify-center">
                  <img src={question.image} alt="Preview" className="max-w-full h-64 object-contain rounded mb-4" />
                </div>
              )}
            </div>
          )}
          <div className="mt-4">
            {question.options && question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center">
                <p className="text-gray-700">
                  <strong>Opción {optionIndex + 1}: </strong> {option.option_text}
                </p>
                <span className={option.is_correct ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
                  {option.is_correct ? <CheckIcon className="h-5 w-5 inline" /> : <XMarkIcon className="h-5 w-5 inline" />}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {isEditing && (
        <button
          onClick={addQuestion}
          className="py-2 px-4 bg-purple-500 text-white rounded-md mt-4 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Agregar Pregunta
        </button>
      )}
    </div>
  );
};

export default QuestionsContainer;
