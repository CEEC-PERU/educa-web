import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/SideBar';
import { getEvaluations, deleteEvaluation } from '../../../services/evaluationService';
import { Evaluation } from '../../../interfaces/Evaluation';
import Link from 'next/link';
import { PencilIcon, TrashIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import Table from '../../../components/Table';
import './../../../app/globals.css';

const EvaluationListPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const data = await getEvaluations();
        setEvaluations(data);
      } catch (error) {
        setError('Error fetching evaluations');
        console.error('Error fetching evaluations:', error);
      }
    };

    fetchEvaluations();
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleDelete = async (evaluation_id: number) => {
    try {
      await deleteEvaluation(evaluation_id);
      setEvaluations(evaluations.filter(evaluation => evaluation.evaluation_id !== evaluation_id));
    } catch (error) {
      setError('Error deleting evaluation');
      console.error('Error deleting evaluation:', error);
    }
  };

  const columns = [
    { label: 'Evaluación', key: 'name' },
    { label: 'Fecha de Creación', key: 'created_at' },
    { label: '', key: 'actions' },
  ];

  const rows = evaluations.map(evaluation => ({
    name: (
      <div className="flex items-center">
        <RocketLaunchIcon className="w-6 h-5 text-gray-500 mr-3 cursor-pointer" />
        <Link href={`/content/evaluation/detailEvaluation?id=${evaluation.evaluation_id}`}>
          <p className="text-blue-600 hover:underline">{evaluation.name}</p>
        </Link>
      </div>
    ),
    created_at: (
      <span>{new Date(evaluation.created_at!).toLocaleDateString()}</span>
    ),
    actions: (
      <div className="flex space-x-2">
        <Link href={`/content/evaluation/detailEvaluation?id=${evaluation.evaluation_id}`}>
          <PencilIcon className="w-6 h-5 text-blue-500 cursor-pointer" />
        </Link>
        <button onClick={() => handleDelete(evaluation.evaluation_id)}>
          <TrashIcon className="w-6 h-5 text-red-500 cursor-pointer" />
        </button>
      </div>
    ),
  }));

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <div className="flex flex-1">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-10 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 max-w-4x2 mt-16">
            <div className="container mx-auto">
              {error && <p className="text-red-500">{error}</p>}
              <Table columns={columns} rows={rows} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvaluationListPage;
