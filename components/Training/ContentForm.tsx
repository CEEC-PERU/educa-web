'use client';

import { useState } from 'react';
import { TrainingContent } from '@/interfaces/Training/Training';

interface ContentFormProps {
  content: TrainingContent | null;
  mode: 'create' | 'edit';
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

type ContentType = 'scorm' | 'pdf' | 'video' | 'audio';

const CONTENT_TYPES: Array<{
  value: ContentType;
  label: string;
  accept: string;
}> = [
  { value: 'scorm', label: 'SCORM', accept: '.zip' },
  { value: 'pdf', label: 'PDF', accept: '.pdf' },
  { value: 'video', label: 'Video', accept: '.mp4,.avi,.mov' },
  { value: 'audio', label: 'Audio', accept: '.mp3,.wav' },
];

export default function ContentForm({
  content,
  mode,
  onSubmit,
  onCancel,
}: ContentFormProps) {
  const [title, setTitle] = useState(content?.title || '');
  const [contentType, setContentType] = useState<ContentType>(
    content?.content_type as ContentType,
  );
  const [file, setFile] = useState<File | null>(null);
  const [isMandatory, setIsMandatory] = useState(content?.is_mandatory ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedType = CONTENT_TYPES.find((type) => type.value === contentType);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (mode === 'create' && !file) {
      setError('Debes seleccionar un archivo');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content_type', contentType);
      formData.append('is_mandatory', String(isMandatory));

      if (file) {
        formData.append('file', file);
      }

      await onSubmit(formData);
    } catch (err) {
      setError('Error al guardar el contenido. Inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Título del contenido *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Introducción al curso"
          disabled={isSubmitting}
        />
      </div>

      {/* Tipo de contenido */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de contenido *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => {
                setContentType(type.value);
                setFile(null);
              }}
              disabled={mode === 'edit' || isSubmitting}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                ${
                  contentType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }
                ${mode === 'edit' || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
        {mode === 'edit' && (
          <p className="mt-2 text-xs text-gray-500">
            No puedes cambiar el tipo de contenido en modo edición
          </p>
        )}
      </div>

      {/* Subir archivo */}
      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {mode === 'create' ? 'Archivo *' : 'Cambiar archivo (opcional)'}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
              >
                <span>Seleccionar archivo</span>
                <input
                  id="file"
                  name="file"
                  type="file"
                  className="sr-only"
                  accept={selectedType?.accept}
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </label>
              <p className="pl-1">o arrastra y suelta</p>
            </div>
            <p className="text-xs text-gray-500">
              {selectedType?.label}: {selectedType?.accept}
            </p>
          </div>
        </div>
        {file && (
          <div className="mt-2 flex items-center text-sm text-green-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Archivo seleccionado: {file.name}
          </div>
        )}
      </div>

      {/* Contenido obligatorio */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_mandatory"
          checked={isMandatory}
          onChange={(e) => setIsMandatory(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isSubmitting}
        />
        <label
          htmlFor="is_mandatory"
          className="ml-2 block text-sm text-gray-700"
        >
          Marcar como contenido obligatorio
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? 'Guardando...'
            : mode === 'create'
              ? 'Crear contenido'
              : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
