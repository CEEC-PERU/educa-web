import React, { useState, useEffect, useMemo } from 'react';
import {
  useNotasSupervisor,
  useNotasSupervisorClassroom,
} from '../../../hooks/resultado/useNotas';
import Loader from '../../../components/Loader';
import { useRouter } from 'next/router';
import { useClassroomBySupervisor } from '../../../hooks/useClassroom';
import {
  FiDownload,
  FiUsers,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiGrid,
  FiList,
  FiInfo,
} from 'react-icons/fi';

import { FaChalkboardTeacher } from 'react-icons/fa';
import AppLayout from '../../../components/layouts/AppLayout';
import type { NextPageWithLayout } from '../../../types/next';

const parseGrade = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const grade = Number(value);
  return Number.isFinite(grade) ? grade : null;
};

const getLimaDate = (value: string | Date): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const escapeCsv = (value: unknown): string =>
  `"${String(value ?? '').replace(/"/g, '""')}"`;

const getExamGrade = (student: any): number | null => {
  const reportedGrade = parseGrade(student.examGrade);
  if (reportedGrade !== null) return reportedGrade;

  const grades = (student.CourseResults ?? student.EvaluationCourses ?? [])
    .map((result: any) => parseGrade(result.puntaje))
    .filter((grade: number | null): grade is number => grade !== null);
  return grades.length > 0 ? Math.max(...grades) : null;
};

const getFinalGrade = (student: any): number | null => {
  const reportedGrade = parseGrade(student.finalGrade);
  if (reportedGrade !== null) return reportedGrade;

  const examGrade = getExamGrade(student);
  if (examGrade === null) return null;

  const moduleGrades = (student.ModuleResults ?? [])
    .map((module: any) => {
      const reportedModuleGrade = parseGrade(module.highest_score);
      if (reportedModuleGrade !== null) return reportedModuleGrade;
      const attempts = (module.results ?? [])
        .map((result: any) => parseGrade(result.puntaje))
        .filter((grade: number | null): grade is number => grade !== null);
      return attempts.length > 0 ? Math.max(...attempts) : null;
    })
    .filter((grade: number | null): grade is number => grade !== null);

  if (moduleGrades.length === 0) return examGrade;
  const moduleAverage = moduleGrades.reduce((sum: number, grade: number) => sum + grade, 0) / moduleGrades.length;
  return Number((moduleAverage * 0.4 + examGrade * 0.6).toFixed(2));
};

const NotaCourses: NextPageWithLayout = () => {
  const router = useRouter();
  const { course_id } = router.query;
  const { classrooms } = useClassroomBySupervisor();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const courseIdNumber = Array.isArray(course_id)
    ? parseInt(course_id[0])
    : parseInt(course_id || '');
  const { courseNota, isLoading, error } = useNotasSupervisor(courseIdNumber, debouncedSearchTerm);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const classroomId = Number(selectedClassroom);
  const { courseNotaClassroom, fetchCourseDetail } =
    useNotasSupervisorClassroom(courseIdNumber, classroomId, debouncedSearchTerm);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [segment, setSegment] = useState<'all' | 'approved' | 'failed' | 'not_started' | 'in_progress'>('all');
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setEndDate(getLimaDate(new Date()));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  // Estilos modernos para los estados
  const statusStyles = {
    Notable: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Aprobado: 'bg-blue-100 text-blue-800 border-blue-200',
    Desaprobado: 'bg-rose-100 text-rose-800 border-rose-200',
    'En Proceso': 'bg-gray-100 text-gray-800 border-gray-200',
    'No iniciado': 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const handleClassroomChange = async (value: string) => {
    setSelectedClassroom(value);
    const updatedClassroomId = Number(value);
    await fetchCourseDetail(updatedClassroomId);
  };

  const handleDownload = () => {
    try {
      const headers = [
        'Nombre del alumno',
        'Supervisor de campo',
        'Estado de cuenta',
        'Curso',
        'Progreso (%)',
        ...availableModules.map((module: any) => module.module_name),
        'Examen final',
        'Nota final',
        'Estado del curso',
        'Fecha de inicio',
        'Fecha de finalización',
      ];
      const rows = dateFilteredStudents.map((student: any) => {
        const courseStudent = student.CourseStudents?.[0];
        const studentName = [
          student.userProfile?.first_name || student.user_name || '',
          student.userProfile?.last_name || '',
        ].filter(Boolean).join(' ');
        return [
          studentName,
          student.userProfile?.external_supervisor || '',
          student.is_active === false ? 'Inactivo' : 'Activo',
          courseStudent?.Course?.name || `Curso ${courseIdNumber}`,
          getCourseProgress(student),
          ...availableModules.map((module: any) => {
            const moduleResult = student.ModuleResults?.find(
              (result: any) => result.module_id === module.module_id,
            );
            return moduleResult?.highest_score ?? '';
          }),
          getExamGrade(student) ?? '',
          getFinalGrade(student) ?? '',
          getStudentStatusLabel(student),
          courseStudent?.created_at ? getLimaDate(courseStudent.created_at) : '',
          courseStudent?.finished_date ? getLimaDate(courseStudent.finished_date) : '',
        ];
      });
      const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\r\n')}`;
      const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_notas_curso_${courseIdNumber}_${startDate}_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando el reporte de notas:', error);
    }
  };

  const currentCourseData = selectedClassroom
    ? courseNotaClassroom
    : courseNota;

  const getCourseProgress = (student: any) => {
    const courseStudent = student.CourseStudents?.[0];
    if (courseStudent?.finished_date || courseStudent?.is_approved) return 100;

    const progress = Number(courseStudent?.progress);
    if (!Number.isFinite(progress)) return 0;
    return Math.max(0, Math.min(100, progress));
  };

  const getStudentReportStatus = (student: any): 'approved' | 'failed' | 'not_started' | 'in_progress' => {
    const finalGrade = getFinalGrade(student);
    if (student.CourseStudents?.[0]?.is_approved || (finalGrade !== null && finalGrade >= 13)) {
      return 'approved';
    }
    if (finalGrade !== null) return 'failed';

    const hasModuleResults = (student.ModuleResults ?? []).some(
      (module: any) => (module.results ?? []).length > 0,
    );
    if (getCourseProgress(student) === 0 && getExamGrade(student) === null && !hasModuleResults) {
      return 'not_started';
    }
    return 'in_progress';
  };

  const getStudentStatusLabel = (student: any): 'Notable' | 'Aprobado' | 'Desaprobado' | 'No iniciado' | 'En Proceso' => {
    const reportStatus = getStudentReportStatus(student);
    if (reportStatus === 'approved') {
      const grade = getFinalGrade(student);
      return grade !== null && grade >= 18 ? 'Notable' : 'Aprobado';
    }
    if (reportStatus === 'failed') return 'Desaprobado';
    if (reportStatus === 'not_started') return 'No iniciado';
    return 'En Proceso';
  };

  const dateFilteredStudents = useMemo(
    () => (currentCourseData ?? []).filter((student: any) => {
      const enrollmentDate = student.CourseStudents?.[0]?.created_at;
      if (!enrollmentDate || !startDate || !endDate) return false;
      const enrollmentDay = getLimaDate(enrollmentDate);
      return enrollmentDay >= startDate && enrollmentDay <= endDate;
    }),
    [currentCourseData, startDate, endDate],
  );

  const availableModules = useMemo(() => {
    const modules = new Map<string | number, any>();
    dateFilteredStudents.forEach((student: any) => {
      (student.ModuleResults ?? []).forEach((module: any) => {
        const key = module.module_id ?? module.module_name;
        if (!modules.has(key)) modules.set(key, module);
      });
    });
    return Array.from(modules.values());
  }, [dateFilteredStudents]);

  const statusCount = useMemo(() => {
    const counts = { approved: 0, failed: 0, not_started: 0, in_progress: 0, notable: 0 };
    dateFilteredStudents.forEach((student: any) => {
      const status = getStudentReportStatus(student);
      counts[status]++;
      const finalGrade = getFinalGrade(student);
      if (status === 'approved' && finalGrade !== null && finalGrade >= 18) counts.notable++;
    });
    return counts;
  }, [dateFilteredStudents]);

  const filteredStudents = useMemo(
    () => dateFilteredStudents.filter((user: any) => {
      if (segment === 'all') return true;
      return getStudentReportStatus(user) === segment;
    }),
    [dateFilteredStudents, segment],
  );

  return (
    <>
      <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      Reporte de Notas
                    </h1>
                    <div className="relative group">
                      <FiInfo className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-help" />
                      <div className="absolute left-0 top-full mt-2 w-72 rounded-lg bg-gray-800 text-white text-xs p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                        <p className="font-semibold mb-1">¿Como se calcula la Nota Final?</p>
                        <p>Si el curso tiene evaluaciones por modulo: 40% promedio de modulos + 60% examen final.</p>
                        <p className="mt-1">Si el curso solo tiene examen final, esa nota se toma como Nota Final.</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Visualizacion y analisis del rendimiento academico
                  </p>
                </div>
              </div>

              {/* Filtros y controles */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1 md:w-64">
                      <input
                        type="text"
                        placeholder="Buscar estudiante o DNI..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-end gap-2">
                    <div>
                      <label htmlFor="grades-start-date" className="mb-1 block text-xs text-gray-600">Fecha Inicio</label>
                      <input
                        id="grades-start-date"
                        type="date"
                        value={startDate}
                        max={endDate || undefined}
                        onChange={(event) => setStartDate(event.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="grades-end-date" className="mb-1 block text-xs text-gray-600">Fecha Fin</label>
                      <input
                        id="grades-end-date"
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      id="classroom_id"
                      value={selectedClassroom || ''}
                      onChange={(e) => handleClassroomChange(e.target.value)}
                      className="form-select border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="" disabled>
                        Seleccione un aula
                      </option>
                      {classrooms.map((classroom) => (
                        <option
                          key={classroom.shift_id}
                          value={classroom.classroom_id.toString()}
                        >
                          {`${classroom.code} - ${classroom.Shift.name}`}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setViewMode('cards')}
                        className={`px-3 py-1 rounded-md flex items-center space-x-1 ${
                          viewMode === 'cards'
                            ? 'bg-white shadow text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <FiGrid className="h-4 w-4" />
                        <span>Tarjetas</span>
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-1 rounded-md flex items-center space-x-1 ${
                          viewMode === 'table'
                            ? 'bg-white shadow text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <FiList className="h-4 w-4" />
                        <span>Tabla</span>
                      </button>
                    </div>

                    <button
                      className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handleDownload}
                      disabled={!endDate || startDate > endDate || dateFilteredStudents.length === 0}
                    >
                      <FiDownload className="h-4 w-4" />
                      <span>Exportar</span>
                    </button>
                    <p className="basis-full text-xs text-gray-500">
                      El rango de fechas se aplica al inicio de la matrícula del curso.
                    </p>
                  </div>
                </div>
              </div>

              {/* Segmentacion */}
              <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                {([
                  { value: 'all', label: 'Todos', count: dateFilteredStudents.length },
                  { value: 'approved', label: 'Aprobados', count: statusCount.approved },
                  { value: 'failed', label: 'Desaprobados', count: statusCount.failed },
                  { value: 'not_started', label: 'No Iniciados', count: statusCount.not_started },
                  { value: 'in_progress', label: 'En Proceso', count: statusCount.in_progress },
                ] as const).map(({ value, label, count }) => (
                  <button
                    key={value}
                    onClick={() => setSegment(value)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      segment === value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>

              {/* Resumen estadistico */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Total Estudiantes</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {dateFilteredStudents.length}
                      </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <FiUsers className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Notables</p>
                      <h3 className="text-2xl font-bold text-emerald-600">
                        {statusCount.notable}
                      </h3>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                      <FiStar className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Aprobados</p>
                      <h3 className="text-2xl font-bold text-blue-600">
                        {statusCount.approved}
                      </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <FiCheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Desaprobados</p>
                      <h3 className="text-2xl font-bold text-rose-600">
                        {statusCount.failed}
                      </h3>
                    </div>
                    <div className="bg-rose-100 p-3 rounded-full text-rose-600">
                      <FiXCircle className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido principal */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                      {filteredStudents?.map((user: any, userIndex: number) => {
                        const examGrade = getExamGrade(user);
                        const finalGrade = getFinalGrade(user);
                        const status = getStudentStatusLabel(user);
                        const progress = getCourseProgress(user);
                        const lastEvaluatedModule = user.ModuleResults?.length > 0
                          ? user.ModuleResults[user.ModuleResults.length - 1]
                          : null;
                        const moduleLabel = progress === 100
                          ? 'Curso completado'
                          : lastEvaluatedModule
                          ? `En o despues de: ${lastEvaluatedModule.module_name}`
                          : progress > 0
                          ? 'Modulo inicial (sin evaluaciones)'
                          : 'No ha iniciado';

                        return (
                          <div
                            key={userIndex}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="p-5">
                              <div className="mb-4">
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {user?.userProfile?.first_name || user?.user_name || 'Usuario'}{' '}
                                    {user?.userProfile?.last_name || ''}
                                  </h3>
                                  {user.is_active === false && (
                                    <span className="rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                      Inactivo
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  <span className="font-medium text-gray-600">Supervisor de campo:</span>{' '}
                                  {user?.userProfile?.external_supervisor || 'No registrado'}
                                </p>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full border ${statusStyles[status]}`}
                                >
                                  {status}
                                </span>
                              </div>

                              {/* Modulo estimado */}
                              <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="truncate" title={moduleLabel}>{moduleLabel}</span>
                              </div>

                              {/* Barra de progreso */}
                              <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>Progreso</span>
                                  <span>{progress} %</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      status === 'Notable'
                                        ? 'bg-emerald-500'
                                        : status === 'Aprobado'
                                        ? 'bg-blue-500'
                                        : status === 'Desaprobado'
                                        ? 'bg-rose-500'
                                        : 'bg-gray-400'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* Detalles de modulos */}
                              <div className="space-y-3">
                                {user.ModuleResults?.map(
                                  (module: any, moduleIndex: number) => {
                                    const highestScore = Math.max(
                                      ...module.results.map(
                                        (result: any) => result.puntaje
                                      )
                                    );
                                    return (
                                      <div
                                        key={moduleIndex}
                                        className="flex justify-between items-center"
                                      >
                                        <span
                                          className="text-sm text-gray-600 truncate"
                                          title={module.module_name}
                                        >
                                          {module.module_name}
                                        </span>
                                        <span className="text-sm font-medium text-gray-800">
                                          {highestScore || '-'}
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>

                              {/* Notas */}
                              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-500">
                                    Examen final:
                                  </span>
                                  <span className="text-base font-medium text-gray-700">
                                    {examGrade !== null
                                      ? examGrade
                                      : '-'}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    NOTA FINAL:
                                  </span>
                                  <span className="text-2xl font-bold text-gray-700">
                                    {finalGrade !== null
                                      ? finalGrade
                                      : '-'}
                                  </span>
                                </div>
                              </div>

                              {/* Fechas */}
                              <div className="flex justify-between mt-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {user.CourseStudents?.[0]?.created_at
                                    ? new Date(
                                        user.CourseStudents[0].created_at
                                      ).toLocaleDateString('es-ES')
                                    : '-'}
                                </div>
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  {user.CourseStudents?.[0]?.finished_date
                                    ? new Date(
                                        user.CourseStudents[0].finished_date
                                      ).toLocaleDateString('es-ES')
                                    : 'En progreso'}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Estudiante
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Supervisor de campo
                            </th>
                            {availableModules.map(
                              (module: any, index: number) => (
                                <th
                                  key={`module-${index}`}
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {module?.module_name || 'Modulo'}
                                </th>
                              )
                            )}
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Nota Final
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Estado
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Inicio
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Fin
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents?.map(
                            (user: any, userIndex: number) => (
                              <tr
                                key={userIndex}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                      <FaChalkboardTeacher className="h-5 w-5" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {user?.userProfile?.first_name || user?.user_name || 'Usuario'}{' '}
                                        {user?.userProfile?.last_name || ''}
                                      </div>
                                      {user.is_active === false && (
                                        <span className="mt-1 inline-flex rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                          Inactivo
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user?.userProfile?.external_supervisor || 'No registrado'}
                                </td>
                                {availableModules.map(
                                  (module: any, moduleIndex: number) => {
                                    const moduleResult =
                                      user.ModuleResults?.find(
                                        (mod: any) =>
                                          mod.module_name === module.module_name
                                      );
                                    const highestScore = moduleResult
                                      ? Math.max(
                                          ...moduleResult.results.map(
                                            (result: any) => result.puntaje
                                          )
                                        )
                                      : '-';
                                    return (
                                      <td
                                        key={`module-${userIndex}-${moduleIndex}`}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                      >
                                        {highestScore}
                                      </td>
                                    );
                                  }
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {getFinalGrade(user) ?? '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {(() => {
                                    const rowStatus = getStudentStatusLabel(user);
                                    return (
                                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[rowStatus]}`}>
                                        {rowStatus}
                                      </span>
                                    );
                                  })()}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.CourseStudents?.[0]?.created_at
                                    ? new Date(
                                        user.CourseStudents[0].created_at
                                      ).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                      })
                                    : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.CourseStudents?.[0]?.finished_date
                                    ? new Date(
                                        user.CourseStudents[0].finished_date
                                      ).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                      })
                                    : 'En progreso'}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
      </div>
    </>
  );
};

NotaCourses.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default NotaCourses;
