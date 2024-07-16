import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { addModule } from '../../services/moduleService';
import { getAvailableEvaluations } from '../../services/evaluationService';
import { Evaluation } from '../../interfaces/Evaluation';
import { Module } from '../../interfaces/Module';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/Content/ActionButtons';
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
  const [success, setSuccess] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{ [key in keyof typeof module]?: boolean }>({});
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id } = e.target;
    setTouchedFields(prevState => ({
      ...prevState,
      [id]: true,
    }));
  };

  const requiredFields: (keyof typeof module)[] = ['name', 'evaluation_id'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const newTouchedFields: { [key in keyof typeof module]?: boolean } = {};
    requiredFields.forEach(field => {
      if (!module[field]) {
        newTouchedFields[field] = true;
      }
    });

    const hasEmptyFields = requiredFields.some((field) => !module[field]);

    if (hasEmptyFields) {
      setTouchedFields(prev => ({ ...prev, ...newTouchedFields }));
      setError('Por favor, complete todos los campos requeridos.');
      setShowAlert(true);
      setFormLoading(false);
      return;
    }

    try {
      await addModule({ ...module, course_id: Number(courseId) });
      setShowAlert(true);
      setError(null);
      setSuccess('Módulo creado exitosamente.');
      setModule({ course_id: 0, evaluation_id: 0, is_active: true, name: '' });
      setTouchedFields({}); // Reset touched fields
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
    setTouchedFields({});
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
                type={error ? "danger" : "success"}
                message={error || success || ''}
                onClose={() => setShowAlert(false)}
              />
            )}
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center text-purple-600 mb-6"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver
            </button>
            
            <FormField
              id="name"
              label="Nombre del Módulo"
              type="text"
              value={module.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!module.name && touchedFields['name']}
              touched={touchedFields['name']}
              required
            />
            <FormField
              id="evaluation_id"
              label="Evaluación"
              type="select"
              value={module.evaluation_id.toString()}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[{ value: '0', label: 'Seleccione una evaluación' }, ...evaluations.map(evaluation => ({ value: evaluation.evaluation_id.toString(), label: evaluation.name }))]}
              error={module.evaluation_id === 0 && touchedFields['evaluation_id']}
              touched={touchedFields['evaluation_id']}
              required
            />
          </form>
          <div className="ml-4 flex-shrink-0">
            <ActionButtons
              onSave={handleSubmit}
              onCancel={handleCancel}
              isEditing={true}
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
