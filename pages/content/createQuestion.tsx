import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import { addQuestion, getQuestionTypes, getEvaluations } from '../../services/evaluationService';
import { QuestionType, Evaluation } from '../../interfaces/Evaluation';
import './../../app/globals.css';

const CreateQuestion: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [questionText, setQuestionText] = useState('');
  const [typeId, setTypeId] = useState(1);
  const [evaluationId, setEvaluationId] = useState(1);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      const types = await getQuestionTypes();
      setQuestionTypes(types);
    };

    const fetchEvaluations = async () => {
      const evaluations = await getEvaluations();
      setEvaluations(evaluations);
    };

    fetchQuestionTypes();
    fetchEvaluations();
  }, []);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'questionText') setQuestionText(value);
    else if (name === 'typeId') setTypeId(Number(value));
    else if (name === 'evaluationId') setEvaluationId(Number(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addQuestion({ question_text: questionText, type_id: typeId, evaluation_id: evaluationId });
      setQuestionText('');
      setTypeId(1);
      setEvaluationId(1);
      alert('Pregunta creada exitosamente');
    } catch (error) {
      console.error('Error creating question:', error);
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
              <h2 className="text-2xl font-bold mb-4">Crear Nueva Pregunta</h2>
              <div className="mb-4">
                <label htmlFor="questionText" className="block text-gray-700 mb-2">Texto de la Pregunta</label>
                <input type="text" name="questionText" value={questionText} onChange={handleQuestionChange} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="typeId" className="block text-gray-700 mb-2">Tipo de Pregunta</label>
                <select name="typeId" value={typeId} onChange={handleQuestionChange} className="w-full px-3 py-2 border border-gray-300 rounded">
                  {questionTypes.map(type => (
                    <option key={type.type_id} value={type.type_id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="evaluationId" className="block text-gray-700 mb-2">Evaluación</label>
                <select name="evaluationId" value={evaluationId} onChange={handleQuestionChange} className="w-full px-3 py-2 border border-gray-300 rounded">
                  {evaluations.map(evaluation => (
                    <option key={evaluation.evaluation_id} value={evaluation.evaluation_id}>{evaluation.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Crear Pregunta</button>
            </form>
          </div>
        </main>
      </div>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default CreateQuestion;
