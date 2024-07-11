import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { addModule } from '../../services/moduleService';
import { getAvailableEvaluations } from '../../services/evaluationService';
import { Evaluation } from '../../interfaces/Evaluation';
import { Module } from '../../interfaces/Module';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';
import AlertComponent from '../../components/AlertComponent';
import Loader from '../../components/Loader';

const AddModule: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [module, setModule] = useState<Omit<Module, 'module_id' | 'created_at' | 'updated_at'>>({
    course_id: 0,
    evaluation_id: 0,
    is_active: true,
    name: ''
  });
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para la carga de evaluaciones
  const [formLoading, setFormLoading] = useState(false); // Estado para la carga del formulario
  const router = useRouter();
  const { courseId } = router.query;

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const evaluationsRes = await getAvailableEvaluations();
        setEvaluations(evaluationsRes);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        setError('Error fetching evaluations');
      } finally {
        setLoading(false);
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
    setFormLoading(true);
    try {
      await addModule({ ...module, course_id: Number(courseId) });
      setShowAlert(true);
      setModule({ course_id: 0, evaluation_id: 0, is_active: true, name: '' });
    } catch (error) {
      console.error('Error adding module:', error);
      setError('Error adding module');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setModule({
      course_id: 0, evaluation_id: 0, is_active: true, name: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out flex`}>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-sm rounded-lg flex-grow mr-4">
            {showAlert && (
              <AlertComponent
                type="success"
                message="Módulo creado exitosamente."
                onClose={() => setShowAlert(false)}
              />
            )}
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center text-purple-600 mb-6"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver
            </button>
            
            <FormField id="name" label="Nombre del Módulo" type="text" value={module.name} onChange={handleChange} />
            <FormField
              id="evaluation_id"
              label="Evaluación"
              type="select"
              value={module.evaluation_id.toString()}
              onChange={handleChange}
              options={[{ value: '0', label: 'Seleccione una evaluación' }, ...evaluations.map(evaluation => ({ value: evaluation.evaluation_id.toString(), label: evaluation.name }))]}
            />
          </form>
          <div className="ml-4 flex-shrink-0">
            <ActionButtons
              onSave={handleSubmit}
              onCancel={handleCancel}
              isEditing={true} // Para asegurarse de que el botón "Guardar" aparezca
            />
          </div>
        </main>
      </div>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AddModule;
