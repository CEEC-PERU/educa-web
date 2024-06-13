import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import { addEvaluation } from '../../services/evaluationService';
import './../../app/globals.css';

const CreateEvaluation: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [evaluationName, setEvaluationName] = useState('');
  const [evaluationDescription, setEvaluationDescription] = useState('');

  const handleEvaluationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (id === 'evaluationName') setEvaluationName(value);
    else if (id === 'evaluationDescription') setEvaluationDescription(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEvaluation({ name: evaluationName, description: evaluationDescription });
      setEvaluationName('');
      setEvaluationDescription('');
      alert('Evaluación creada exitosamente');
    } catch (error) {
      console.error('Error creating evaluation:', error);
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
              <h2 className="text-2xl font-bold mb-4">Crear Nueva Evaluación</h2>
              <div className="mb-4">
                <label htmlFor="evaluationName" className="block text-gray-700 mb-2">Nombre de la Evaluación</label>
                <input type="text" id="evaluationName" value={evaluationName} onChange={handleEvaluationChange} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="evaluationDescription" className="block text-gray-700 mb-2">Descripción</label>
                <textarea id="evaluationDescription" value={evaluationDescription} onChange={handleEvaluationChange} className="w-full px-3 py-2 border border-gray-300 rounded"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Crear Evaluación</button>
            </form>
          </div>
        </main>
      </div>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default CreateEvaluation;
