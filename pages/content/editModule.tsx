import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import { getModule, updateModule } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { getEvaluations } from '../../services/evaluationService';
import { Module } from '../../interfaces/Module';
import { Course } from '../../interfaces/Course';
import { Evaluation } from '../../interfaces/Evaluation';
import FormField from '../../components/FormField';
import ButtonComponent from '../../components/ButtonDelete';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';

const EditModule: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [module, setModule] = useState<Omit<Module, 'module_id' | 'created_at' | 'updated_at'>>({
    course_id: 0,
    evaluation_id: 0,
    is_finish: false,
    is_active: true,
    name: ''
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [availableEvaluations, setAvailableEvaluations] = useState<Evaluation[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      Promise.all([getModule(id as string), getCourses(), getEvaluations()])
        .then(([moduleRes, coursesRes, evaluationsRes]) => {
          setModule(moduleRes);
          setCourses(coursesRes);

          // Incluir la evaluación actual del módulo en las opciones disponibles
          const filteredEvaluations = evaluationsRes.filter(evaluation => {
            return evaluation.evaluation_id === moduleRes.evaluation_id || !coursesRes.some(course => course.evaluation_id === evaluation.evaluation_id);
          });

          setEvaluations(evaluationsRes);
          setAvailableEvaluations(filteredEvaluations);
        })
        .catch(error => {
          console.error('Error fetching module details:', error);
          setError('Error fetching module details');
        });
    }
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateModule(id as string, module);
      router.push(`/content/detailModule?id=${module.course_id}`); // Redirigir al curso correcto
    } catch (error) {
      console.error('Error updating module:', error);
      setError('Error updating module');
    }
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
  };

  const handleCancel = () => {
    router.push(`/content/detailModule?id=${module.course_id}`); // Redirigir al curso correcto
  };

  if (!module) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center text-purple-600 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>
        <div className="max-w-4xl bg-white p-6 rounded-lg">
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <FormField
              id="name"
              label="Nombre"
              type="text"
              value={module.name}
              onChange={handleChange}
            />
            <FormField
              id="course_id"
              label="Curso"
              type="select"
              value={module.course_id.toString()}
              onChange={handleChange}
              options={courses.map(course => ({ value: course.course_id.toString(), label: course.name }))}
            />
            <FormField
              id="evaluation_id"
              label="Evaluación"
              type="select"
              value={module.evaluation_id.toString()}
              onChange={handleChange}
              options={availableEvaluations.map(evaluation => ({ value: evaluation.evaluation_id.toString(), label: evaluation.name }))}
            />
            <div className="mb-4">
              <label htmlFor="is_active" className="block text-gray-700 text-sm font-bold mb-2">Activo</label>
              <input
                type="checkbox"
                id="is_active"
                checked={module.is_active}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="is_finish" className="block text-gray-700 text-sm font-bold mb-2">Finalizado</label>
              <input
                type="checkbox"
                id="is_finish"
                checked={module.is_finish}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
            </div> 
            <ButtonComponent buttonLabel="Guardar" onClick={handleSaveClick} backgroundColor="bg-purple-600" textColor="text-white" fontSize="text-sm" buttonSize="py-2 px-4" />
          </form>
        </div>
      </main>
      </div>
    </div>
  );
};

export default EditModule;
