import React, { useState, useEffect } from 'react';
import {
  TrainingProgram,
  Classroom,
  UserInfo,
  ProgramValidation,
} from '@/interfaces/Training/Training';
import { useAuth } from '@/context/AuthContext';
import {
  getAllProgramsBySupervisor,
  getAllClassrooms,
  assignStudentsToProgram,
  validateProgramForAssignment,
} from '@/services/training/trainingService';

interface TrainingAssignmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TrainingAssignmentForm: React.FC<TrainingAssignmentFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { user, token } = useAuth();
  const userInfo = user as UserInfo;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [selectedProgram, setSelectedProgram] = useState<number>(0);
  const [selectedClassroom, setSelectedClassroom] = useState<number>(0);
  
  const [validation, setValidation] = useState<ProgramValidation | null>(null);
  const [validating, setValidating] = useState(false);

  // Cargar programas y aulas
  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.id || !token) return;

      try {
        const [programsData, classroomsData] = await Promise.all([
          getAllProgramsBySupervisor(userInfo.id, token),
          getAllClassrooms(userInfo.id, token),
        ]);

        setPrograms(programsData);
        setClassrooms(classroomsData);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos');
      }
    };

    fetchData();
  }, [user, token]);

  // Validar programa cuando se selecciona
  const handleProgramChange = async (programId: number) => {
    setSelectedProgram(programId);
    setValidation(null);
    
    if (programId === 0 || !token) return;

    try {
      setValidating(true);
      const validationResult = await validateProgramForAssignment(
        programId,
        token,
      );
      setValidation(validationResult);
    } catch (err) {
      console.error('Error validando programa:', err);
      setError('Error al validar el programa');
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedProgram === 0) {
      setError('Debe seleccionar un programa');
      return;
    }

    if (selectedClassroom === 0) {
      setError('Debe seleccionar una campaña');
      return;
    }

    if (!token) return;

    setLoading(true);

    try {
      await assignStudentsToProgram(selectedProgram, selectedClassroom, token);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Error al asignar estudiantes al programa',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Advertencias de validación */}
      {validation && validation.hasWarnings && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Advertencias del programa
          </h4>
          <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
            {validation.warnings.map((warning, idx) => (
              <li key={idx}>{warning.message}</li>
            ))}
          </ul>
          <p className="text-yellow-600 text-xs mt-2">
            Puedes continuar con la asignación, pero se recomienda agregar contenido a todos los días.
          </p>
        </div>
      )}

      {/* Selector de Programa */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Programa de Formación *
        </label>
        <select
          value={selectedProgram}
          onChange={(e) => handleProgramChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading || validating}
        >
          <option value={0}>Seleccione un programa</option>
          {programs.map((program) => (
            <option key={program.program_id} value={program.program_id}>
              {program.title} ({program.total_days} días)
            </option>
          ))}
        </select>
      </div>

      {/* Selector de Campaña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Campaña / Aula *
        </label>
        <select
          value={selectedClassroom}
          onChange={(e) => setSelectedClassroom(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value={0}>Seleccione una campaña</option>
          {classrooms.map((classroom) => (
            <option key={classroom.classroom_id} value={classroom.classroom_id}>
              {classroom.code}
            </option>
          ))}
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || validating || (validation !== null && !validation.canAssign)}
        >
          {validating
            ? 'Validando...'
            : loading
            ? 'Asignando...'
            : 'Asignar Programa'}
        </button>
      </div>
    </form>
  );
};

export default TrainingAssignmentForm;
