import React, { useState, useEffect } from 'react';
import { addModule } from '../../services/moduleService';
import { getAvailableEvaluations } from '../../services/evaluationService';
import { Evaluation } from '../../interfaces/Evaluation';
import { Module } from '../../interfaces/Module';
import FormField from '../../components/FormField';
import AlertComponent from '../../components/AlertComponent';
import Loader from '../../components/Loader';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

interface AddModuleFormProps {
  courseId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddModuleForm: React.FC<AddModuleFormProps> = ({ courseId, onClose, onSuccess }) => {
  const [module, setModule] = useState<Omit<Module, 'module_id' | 'created_at' | 'updated_at'>>({
    course_id: courseId,
    evaluation_id: 0,
    is_active: true,
    name: ''
  });
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{ [key in keyof typeof module]?: boolean }>({});

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
      setFormLoading(false);
      return;
    }

    try {
      await addModule(module);
      setError(null);
      onSuccess();
    } catch (error) {
      console.error('Error adding module:', error);
      setError('Error adding module');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="bg-white p-6 w-full max-w-4xl mx-auto">
      {error && (
        <AlertComponent
          type="danger"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded">
            Cancelar
          </button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Guardar
          </button>
        </div>
      </form>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
};

export default AddModuleForm;
