import React, { useState } from 'react';
import { TrainingDay } from '@/interfaces/Training/Training';

interface DayFormProps {
  day?: TrainingDay | null;
  onSubmit: (title: string) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const DayForm: React.FC<DayFormProps> = ({ day, onSubmit, onCancel, mode }) => {
  const [title, setTitle] = useState(day?.title || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = mode === 'edit';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }

    if (isEditMode && title === day?.title) {
      setError('No has realizado ningún cambio');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(title.trim());
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Error al ${isEditMode ? 'actualizar' : 'crear'} el día`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Título del Día *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Introducción al tema"
        />
        <p className="mt-1 text-xs text-gray-500">
          {title.length}/100 caracteres
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || (isEditMode && title === day?.title)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
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
            ? isEditMode
              ? 'Guardando...'
              : 'Creando...'
            : isEditMode
              ? 'Guardar Cambios'
              : 'Crear Día'}
        </button>
      </div>
    </form>
  );
};

export default DayForm;
