import React, { useState, useEffect } from 'react';
import {
  TrainingProgram,
  Classroom,
  UserInfo,
} from '@/interfaces/Training/Training';
import { useAuth } from '@/context/AuthContext';
import {
  getAllProgramsBySupervisor,
  getAllClassrooms,
  assignStudentsToProgram,
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

      {/* Selector de Programa */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Programa de Formación *
        </label>
        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
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
          disabled={loading}
        >
          {loading ? 'Asignando...' : 'Asignar Programa'}
        </button>
      </div>
    </form>
  );
};

export default TrainingAssignmentForm;
