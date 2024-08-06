import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { getModule, updateModule } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { getEvaluations } from '../../services/evaluationService';
import { Module } from '../../interfaces/Module';
import { Course } from '../../interfaces/Course';
import { Evaluation } from '../../interfaces/Evaluation';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/Content/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';
import AlertComponent from '../../components/AlertComponent';
import Loader from '../../components/Loader';

const EditModule: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [module, setModule] = useState<Omit<Module, 'module_id' | 'created_at' | 'updated_at'>>({
    course_id: 0,
    evaluation_id: 0,
    is_active: true,
    name: ''
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [availableEvaluations, setAvailableEvaluations] = useState<Evaluation[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    if (id) {
      Promise.all([getModule(id as string), getCourses(), getEvaluations()])
        .then(([moduleRes, coursesRes, evaluationsRes]) => {
          setModule(moduleRes);
          setCourses(coursesRes);

          // Filtrar evaluaciones asignadas a otros cursos o módulos
          const assignedEvaluations = new Set(
            [...coursesRes.map(course => course.evaluation_id), ...modules.map(mod => mod.evaluation_id)]
          );

          const filteredEvaluations = evaluationsRes.filter(evaluation => {
            return evaluation.evaluation_id === moduleRes.evaluation_id || !assignedEvaluations.has(evaluation.evaluation_id);
          });

          setEvaluations(evaluationsRes);
          setAvailableEvaluations(filteredEvaluations);
          setLoading(false); // Finaliza la carga
        })
        .catch(error => {
          console.error('Error fetching module details:', error);
          setError('Error fetching module details');
          setLoading(false); // Finaliza la carga en caso de error
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
      setSuccess('Módulo actualizado exitosamente');
      setTimeout(() => {
        setSuccess(null);
        router.push(`/content/detailModule?id=${module.course_id}`);
      }, 3000);
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
    router.push(`/content/detailModule?id=${module.course_id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!module) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out flex flex-col md:flex-row md:space-x-4`}>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl rounded-lg flex-grow">
            {success && (
              <AlertComponent
                type="info"
                message={success}
                onClose={() => setSuccess(null)}
              />
            )}
            <FormField
              id="name"
              label="Nombre del Módulo"
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
          </form>
          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            <ActionButtons
              onSave={handleSaveClick}
              onCancel={handleCancel}
              isEditing={true} // Para asegurarse de que el botón "Guardar" aparezca
              customSize={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditModule;
