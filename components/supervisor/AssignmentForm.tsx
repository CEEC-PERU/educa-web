import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
} from 'lucide-react';
import { AssignmentFormProps } from '../../interfaces/Certification';
import { useClassroomBySupervisor } from '@/hooks/useClassroom';

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  formData,
  onFormDataChange,
  availableCertifications,
  errors,
  isSubmitting,
  onSubmit,
  onClose,
}) => {
  const [selectedClassrooms, setSelectedClassrooms] = useState<number[]>(
    formData.classroom_ids
  );
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const { classrooms } = useClassroomBySupervisor();
  const renderFormField = (field: string, children: React.ReactNode) => {
    const allErrors = getAllErrors();
    const error = allErrors[field];

    return (
      <div className="space-y-1">
        {children}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  const updateFormData = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(e);
  };

  const handleClassroomToggle = (classroomId: number) => {
    const updatedClassrooms = selectedClassrooms.includes(classroomId)
      ? selectedClassrooms.filter((id) => id !== classroomId)
      : [...selectedClassrooms, classroomId];

    setSelectedClassrooms(updatedClassrooms);
    updateFormData('classroom_ids', updatedClassrooms);
  };

  const selectedCertification = availableCertifications.find(
    (cert) => cert.certification_id === formData.certification_id
  );

  useEffect(() => {
    const validateDates = () => {
      const newErrors: { [key: string]: string } = {};

      if (formData.start_date && formData.due_date) {
        const startDate = new Date(formData.start_date);
        const dueDate = new Date(formData.due_date);
        const now = new Date();

        // Validar que start_date no sea en el pasado (con tolerancia de 1 minuto)
        if (startDate < new Date(now.getTime() - 60000)) {
          newErrors.start_date = 'La fecha de inicio no puede ser en el pasado';
        }

        // Validar que due_date sea después de start_date (con tolerancia de 1 minuto)
        if (dueDate <= new Date(startDate.getTime() + 60000)) {
          newErrors.due_date =
            'La fecha límite debe ser posterior a la fecha de inicio';
        }
      }

      setValidationErrors((prev) => ({ ...prev, ...newErrors }));
    };

    validateDates();
  }, [formData.start_date, formData.due_date]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validar certificado seleccionado
    if (!formData.certification_id) {
      newErrors.certification_id = 'Debe seleccionar un certificado';
    }

    // Validar aulas seleccionadas
    if (selectedClassrooms.length === 0) {
      newErrors.classroom_ids = 'Debe seleccionar al menos una aula';
    }

    // Validar fechas
    if (!formData.start_date) {
      newErrors.start_date = 'La fecha de inicio es requerida';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'La fecha límite es requerida';
    }

    if (formData.start_date && formData.due_date) {
      const startDate = new Date(formData.start_date);
      const dueDate = new Date(formData.due_date);
      const now = new Date();

      if (isNaN(startDate.getTime())) {
        newErrors.start_date = 'Fecha de inicio inválida';
      }

      if (isNaN(dueDate.getTime())) {
        newErrors.due_date = 'Fecha límite inválida';
      }

      if (startDate < new Date(now.getTime() - 60000)) {
        newErrors.start_date = 'La fecha de inicio no puede ser en el pasado';
      }

      if (dueDate <= new Date(startDate.getTime() + 60000)) {
        newErrors.due_date =
          'La fecha límite debe ser posterior a la fecha de inicio';
      }
    }

    // Validar cantidad de preguntas si se especifica
    if (
      formData.questions_count !== undefined &&
      formData.questions_count !== null
    ) {
      if (formData.questions_count <= 0) {
        newErrors.questions_count = 'Debe ser mayor que 0';
      }
      // Aquí deberías validar contra el total de preguntas del certificado
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getAllErrors = () => {
    return { ...validationErrors, ...errors };
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Selección de Certificado */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
          Seleccione un Certificado
        </h3>

        {renderFormField(
          'certification_id',
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificado *
            </label>
            <select
              required
              value={formData.certification_id}
              onChange={(e) =>
                updateFormData('certification_id', parseInt(e.target.value))
              }
              className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                getAllErrors().certification_id
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:ring-2 transition-colors`}
            >
              <option value="">Seleccione un certificado</option>
              {availableCertifications.map((cert) => (
                <option
                  key={cert.certification_id}
                  value={cert.certification_id}
                >
                  {cert.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Información del certificado seleccionado */}
        {selectedCertification && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              {selectedCertification.title}
            </h4>
            <p className="text-sm text-blue-700 mb-2">
              {selectedCertification.description}
            </p>
            <div className="flex items-center text-sm text-blue-600">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>
                Duración: {selectedCertification.duration_in_minutes} minutos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Configuración de Asignación */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Configuración de Asignación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFormField(
            errors.start_date,
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={(e) => updateFormData('start_date', e.target.value)}
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  errors.start_date
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:ring-2 transition-colors`}
              />
            </div>
          )}

          {renderFormField(
            errors.due_date,
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha límite *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.due_date}
                onChange={(e) => updateFormData('due_date', e.target.value)}
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  errors.due_date
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:ring-2 transition-colors`}
              />
            </div>
          )}

          {renderFormField(
            errors.is_randomized,
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preguntas aleatorias
              </label>
              <select
                value={formData.is_randomized ? 'yes' : 'no'}
                onChange={(e) =>
                  updateFormData('is_randomized', e.target.value === 'yes')
                }
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  errors.is_randomized
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:ring-2 transition-colors`}
              >
                <option value="yes">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
          )}

          {renderFormField(
            errors.questions_count,
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de preguntas asignadas
              </label>
              <input
                type="number"
                min={1}
                value={formData.questions_count || ''}
                onChange={(e) =>
                  updateFormData(
                    'questions_count',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  errors.questions_count
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:ring-2 transition-colors`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Selección de Aulas */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
          Seleccionar Aulas ({selectedClassrooms.length} seleccionados)
        </h3>

        {/* Lista de Aulas */}
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
          {classrooms && classrooms.length > 0 ? (
            <div className="space-y-3">
              {classrooms.map((classroom) => (
                <div
                  key={classroom.classroom_id}
                  className="flex items-center p-5 mt-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedClassrooms.includes(
                      classroom.classroom_id
                    )}
                    onChange={() =>
                      handleClassroomToggle(classroom.classroom_id)
                    }
                    id={`classroom-${classroom.classroom_id}`}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`classroom-${classroom.classroom_id}`}
                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Aula : {classroom.code}
                        </p>
                        <p className="text-xs text-gray-500">
                          Turno: {classroom.Shift?.name} | Profesor:{' '}
                          {classroom.User?.userProfile?.first_name}{' '}
                          {classroom.User?.userProfile?.last_name} | Empresa:{' '}
                          {classroom.Enterprise?.name}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-4 text-sm text-gray-500">
              No hay aulas disponibles para asignar.
            </p>
          )}
        </div>

        {errors.assigned_users && (
          <p className="text-sm text-red-600 mt-2">{errors.assigned_users}</p>
        )}
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
          disabled={
            isSubmitting ||
            selectedClassrooms.length === 0 ||
            !formData.certification_id ||
            Object.keys(getAllErrors()).some((key) => getAllErrors()[key])
          }
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Asignando...' : 'Asignar Certificado'}
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;
