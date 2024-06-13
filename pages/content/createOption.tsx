import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import { addOption, getQuestionsByEvaluationId } from '../../services/evaluationService';
import { Question } from '../../interfaces/Evaluation';
import './../../app/globals.css';

const CreateOption: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [optionText, setOptionText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionId, setQuestionId] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await getQuestionsByEvaluationId(questionId);
      setQuestions(questions);
    };

    fetchQuestions();
  }, [questionId]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setIsCorrect((e.target as HTMLInputElement).checked);
    } else if (name === 'optionText') {
      setOptionText(value);
    } else if (name === 'questionId') {
      setQuestionId(Number(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addOption({ option_text: optionText, is_correct: isCorrect, question_id: questionId });
      setOptionText('');
      setIsCorrect(false);
      setQuestionId(1);
      alert('Opción creada exitosamente');
    } catch (error) {
      console.error('Error creating option:', error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={() => setShowSidebar(!showSidebar)} />
      <div className="flex flex-1">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 gap-6 w-full max-w-4xl mx-auto mt-16">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full">
              <h2 className="text-2xl font-bold mb-4">Crear Nueva Opción</h2>
              <div className="mb-4">
                <label htmlFor="optionText" className="block text-gray-700 mb-2">Texto de la Opción</label>
                <input type="text" name="optionText" value={optionText} onChange={handleOptionChange} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="isCorrect" className="block text-gray-700 mb-2">Es Correcta</label>
                <input type="checkbox" name="isCorrect" checked={isCorrect} onChange={handleOptionChange} className="mr-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="questionId" className="block text-gray-700 mb-2">Pregunta</label>
                <select name="questionId" value={questionId} onChange={handleOptionChange} className="w-full px-3 py-2 border border-gray-300 rounded">
                  {questions.map(question => (
                    <option key={question.question_id} value={question.question_id}>{question.question_text}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Crear Opción</button>
            </form>
          </div>
        </main>
      </div>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default CreateOption;
