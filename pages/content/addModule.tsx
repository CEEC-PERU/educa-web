import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import { getModules, addModule } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { getEvaluations } from '../../services/evaluationService';
import { Module } from '../../interfaces/Module';
import { Course } from '../../interfaces/Course';
import { Evaluation } from '../../interfaces/Evaluation';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import ButtonComponent from '../../components/ButtonDelete';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Importa el ícono de flecha
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
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchModulesCoursesAndEvaluations = async () => {
      try {
        const [modulesRes, coursesRes, evaluationsRes] = await Promise.all([
          getModules(),
          getCourses(),
          getEvaluations()
        ]);
        setModules(modulesRes);
        setCourses(coursesRes);
        setEvaluations(evaluationsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchModulesCoursesAndEvaluations();
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
      const newModule = await addModule(module);
      setModules([...modules, newModule]);
      setModule({ course_id: 0, evaluation_id: 0, is_finish: false, is_active: true, name: '' });
    } catch (error) {
      console.error('Error adding module:', error);
      setError('Error adding module');
    }
  };

  const handleCancel = () => {
    setModule({ course_id: 0, evaluation_id: 0, is_finish: false, is_active: true, name: '' });
  };

  if (error) {
    return <p className="text-red-500 mt-2">{error}</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center text-purple-600 mb-6 mt-4"
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
                id="course_id"
                label="Curso"
                type="select"
                value={module.course_id.toString()}
                onChange={handleChange}
                options={[{ value: '0', label: 'Seleccione un curso' }, ...courses.map(course => ({ value: course.course_id.toString(), label: course.name }))]}
              />
              <FormField
                id="evaluation_id"
                label="Evaluación"
                type="select"
                value={module.evaluation_id.toString()}
                onChange={handleChange}
                options={[{ value: '0', label: 'Seleccione una evaluación' }, ...evaluations.map(evaluation => ({ value: evaluation.evaluation_id.toString(), label: evaluation.name }))]}
              />
              <div className="mb-4">
                <label htmlFor="is_active" className="block text-gray-700 mb-2">Activo</label>
                <input
                  type="checkbox"
                  id="is_active"
                  checked={module.is_active}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="is_finish" className="block text-gray-700 mb-2">Finalizado</label>
                <input
                  type="checkbox"
                  id="is_finish"
                  checked={module.is_finish}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
              <ButtonComponent buttonLabel="Guardar" onClick={handleSubmit} backgroundColor="bg-purple-500" textColor="text-white" fontSize="text-sm" buttonSize="py-3 px-4" />
              </div>
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
