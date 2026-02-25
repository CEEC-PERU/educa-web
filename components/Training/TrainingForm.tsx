import React, { useState, useEffect } from 'react';
import { TrainingProgram, UserInfo } from '@/interfaces/Training/Training';
import {
  createProgram,
  updateProgram,
} from '@/services/training/trainingService';
import { useAuth } from '@/context/AuthContext';

interface TrainingFormProps {
  training?: TrainingProgram | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  enterprise_id: number;
  title: string;
  description: string;
  total_days: number;
  created_by: number;
  is_active: boolean;
}

const TrainingForm: React.FC<TrainingFormProps> = ({
  training,
  onSuccess,
  onCancel,
}) => {
  const { user, token } = useAuth();
  const userInfo = user as UserInfo;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    enterprise_id: userInfo?.enterprise_id || 0,
    title: '',
    description: '',
    created_by: userInfo?.id || 0,
    total_days: 0,
    is_active: true,
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (training) {
      setFormData({
        enterprise_id: training.enterprise_id,
        title: training.title,
        description: training.description || '',
        created_by: training.created_by,
        total_days: training.total_days || 0,
        is_active: training.is_active ?? true,
      });
    }
  }, [training]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return false;
    }
    if (formData.total_days < 1) {
      setError('El programa debe tener al menos 1 día');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm() || !token) return;

    try {
      setLoading(true);

      if (training?.program_id) {
        // Editar
        await updateProgram(training.program_id, formData, token);
      } else {
        // Crear
        await createProgram(formData, token);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el programa');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Título */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Título del Programa *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Introducción a la Programación"
        />
      </div>

      {/* Descripción */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Descripción *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Describe el contenido del programa..."
        />
      </div>

      {/* Grid para campos pequeños */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total de días */}
        <div>
          <label
            htmlFor="total_days"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Total de Días *
          </label>
          <input
            type="number"
            id="total_days"
            name="total_days"
            value={formData.total_days}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      {/* Estado activo 
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
          Programa activo
        </label>
      </div>*/}

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {loading
            ? 'Guardando...'
            : training
              ? 'Actualizar'
              : 'Crear Programa'}
        </button>
      </div>
    </form>
  );
};

export default TrainingForm;
