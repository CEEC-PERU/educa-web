import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import { addModule } from '../../services/moduleService';
import { getEvaluations } from '../../services/evaluationService';
import { Evaluation } from '../../interfaces/Evaluation'; 
import { Module } from '../../interfaces/Module'; 
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';

const ModulePage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [module, setModule] = useState<Omit<Module, 'module_id' | 'created_at' | 'updated_at'>>({
    course_id: 0,
    evaluation_id: 0,
    is_finish: false,
    is_active: true,
    name: ''
  });
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { courseId } = router.query; // Obtener el ID del curso de la URL

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const evaluationsRes = await getEvaluations();
        setEvaluations(evaluationsRes);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        setError('Error fetching evaluations');
      }
    };

    fetchEvaluations();
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setModule(prevModule => ({
      ...prevModule,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newModule = await addModule({ ...module, course_id: Number(courseId) });
      setModule({ course_id: 0, evaluation_id: 0, is_finish: false, is_active: true, name: '' });
      router.push(`/content/detailModule?id=${courseId}`); // Redirigir a la página de módulos del curso actual
    } catch (error) {
      console.error('Error adding module:', error);
      setError('Error adding module');
    }
  };

  const handleCancel = () => {
    setModule({ course_id: 0, evaluation_id: 0, is_finish: false, is_active: true, name: '' });
    router.back();
  };

  if (error) {
    return <p className="text-red-500 mt-2">{error}</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <form onSubmit={handleSubmit} className="bg-white rounded w-full">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center text-purple-600 mb-6 "
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver
              </button>
              <FormField
                id="name"
                label="Nombre"
                type="text"
                value={module.name}
                onChange={handleChange}
              />
              <FormField
                id="evaluation_id"
                label="Evaluación"
                type="select"
                value={module.evaluation_id.toString()}
                onChange={handleChange}
                options={[{ value: '0', label: 'Seleccione una evaluación' }, ...evaluations.map(evaluation => ({ value: evaluation.evaluation_id.toString(), label: evaluation.name }))]}
              />
            </form>
            <div className="mt-14">
              <ActionButtons onSave={handleSubmit} onCancel={handleCancel} isEditing={true} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModulePage;
