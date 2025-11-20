import React from 'react';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { CertificationFormData, Question } from '../../interfaces/Certification';
import QuestionForm from './QuestionForm';

interface CertificationFormProps {
  formData: CertificationFormData;
  onFormDataChange: (data: CertificationFormData) => void;
  currentQuestion: Question;
  onCurrentQuestionChange: (question: Question) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
  errors: { [key: string]: string };
  isSubmitting: boolean;
  editingCertificate: any;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({
  formData,
  onFormDataChange,
  currentQuestion,
  onCurrentQuestionChange,
  onAddQuestion,
  onRemoveQuestion,
  errors,
  isSubmitting,
  editingCertificate,
  onSubmit,
  onClose
}) => {
  const renderFormField = (
    error: string | undefined,
    children: React.ReactNode
  ) => (
    <div className="space-y-1">
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );

  const updateFormData = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
          Información del Certificado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderFormField(
            errors.title,
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Certificado *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  errors.title
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:ring-2 transition-colors`}
                placeholder="Ingrese el título del certificado"
              />
            </div>
          )}

          {renderFormField(
            errors.duration_in_minutes,
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration_in_minutes}
                onChange={(e) => updateFormData('duration_in_minutes', parseInt(e.target.value) || 0)}
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  errors.duration_in_minutes
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:ring-2 transition-colors`}
                placeholder="Ingrese la duración en minutos"
              />
            </div>
          )}

          {renderFormField(
            errors.passing_percentage,
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntuación mínima (%) *
              </label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={formData.passing_percentage}
                onChange={(e) => updateFormData('passing_percentage', parseInt(e.target.value) || 0)}
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  errors.passing_percentage
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:ring-2 transition-colors`}
                placeholder="Ingrese la puntuación mínima para aprobar"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total de Preguntas
            </label>
            <input
              type="number"
              value={formData.questions.length}
              readOnly
              className="block w-full focus:outline-none rounded-md shadow-sm p-2 border border-gray-300 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de Intentos *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.max_attempts}
              onChange={(e) => updateFormData('max_attempts', parseInt(e.target.value) || 1)}
              className="block w-full focus:outline-none rounded-md shadow-sm p-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Ingrese la cantidad máxima de intentos"
            />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del Certificado
            </label>
            <textarea
              value={formData.description}
              rows={3}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Ingrese una descripción para el certificado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrucciones para el Certificado
            </label>
            <textarea
              value={formData.instructions}
              rows={3}
              onChange={(e) => updateFormData('instructions', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Ingrese las instrucciones para el certificado"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.show_results_immediately}
                onChange={(e) => updateFormData('show_results_immediately', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Mostrar resultados inmediatamente
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => updateFormData('is_active', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Certificado activo
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de preguntas agregadas */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Preguntas Agregadas
          </h3>
        </div>

        <div className="mb-6 space-y-3">
          <h4 className="font-medium text-gray-700">
            Preguntas agregadas: {formData.questions.length}
          </h4>
          {formData.questions.map((question, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{question.question_text}</p>
                <p className="text-xs text-gray-500">
                  Tipo: {question.type_id === 1 ? 'Opción simple' : 
                        question.type_id === 2 ? 'Opción múltiple' : 
                        'Verdadero/Falso'} | 
                  Puntos: {question.points_value} | 
                  Opciones: {question.options.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveQuestion(index)}
                className="text-red-600 hover:text-red-800 text-sm p-1"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          {formData.questions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay preguntas agregadas
            </p>
          )}
        </div>

        <QuestionForm
          currentQuestion={currentQuestion}
          onQuestionChange={onCurrentQuestionChange}
          onAddQuestion={onAddQuestion}
          errors={errors}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || formData.questions.length === 0}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creando...' : 'Crear Certificación'}
        </button>
      </div>
    </form>
  );
};

export default CertificationForm;