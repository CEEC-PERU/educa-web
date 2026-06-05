import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  useNotasSupervisor,
  useNotasSupervisorClassroom,
} from '../../../hooks/resultado/useNotas';
import Loader from '../../../components/Loader';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_GET_NOTAS_EXCEL } from '../../../utils/Endpoints';
import { useClassroomBySupervisor } from '../../../hooks/useClassroom';
import {
  FiDownload,
  FiUsers,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiGrid,
  FiList,
} from 'react-icons/fi';

import { FaChalkboardTeacher } from 'react-icons/fa';
import AppLayout from '../../../components/layouts/AppLayout';
import type { NextPageWithLayout } from '../../../types/next';

const NotaCourses: NextPageWithLayout = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;
  const { classrooms } = useClassroomBySupervisor();
  const courseIdNumber = Array.isArray(course_id)
    ? parseInt(course_id[0])
    : parseInt(course_id || '');
  const { courseNota, isLoading, error } = useNotasSupervisor(courseIdNumber);
  const userInfo = user as { id: number; enterprise_id: number } | null;
  const [statusCount, setStatusCount] = useState({
    notable: 0,
    aprobado: 0,
    desaprobado: 0,
  });

  const [selectedClassroom, setSelectedClassroom] = useState('');
  const classroomId = Number(selectedClassroom);
  const { courseNotaClassroom, fetchCourseDetail } =
    useNotasSupervisorClassroom(courseIdNumber, classroomId);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState('');

  // Estilos modernos para los estados
  const statusStyles = {
    Notable: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Aprobado: 'bg-blue-100 text-blue-800 border-blue-200',
    Desaprobado: 'bg-rose-100 text-rose-800 border-rose-200',
    'En Proceso': 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const handleClassroomChange = async (value: string) => {
    setSelectedClassroom(value);
    const updatedClassroomId = Number(value);
    await fetchCourseDetail(updatedClassroomId);
  };

  const getStatus = (finalExamGrade: number) => {
    if (finalExamGrade >= 18) return 'Notable';
    if (finalExamGrade >= 13) return 'Aprobado';
    return 'Desaprobado';
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${API_GET_NOTAS_EXCEL}/${userInfo?.enterprise_id}/${courseIdNumber}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'course_grades.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error descargando el archivo Excel:', error);
    }
  };

  const currentCourseData = selectedClassroom
    ? courseNotaClassroom
    : courseNota;

  // Filtrar estudiantes basado en el término de búsqueda
  const filteredStudents = currentCourseData?.filter((user: any) => {
    const fullName = `${user?.userProfile?.first_name || ''} ${
      user?.userProfile?.last_name || ''
    }`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    if (currentCourseData && currentCourseData.length > 0) {
      let notable = 0, aprobado = 0, desaprobado = 0;
      currentCourseData.forEach((user) => {
        const examGrade = user.CourseResults?.[0]?.puntaje;
        if (examGrade === null || examGrade === undefined) return;
        const status = getStatus(examGrade);
        if (status === 'Notable') notable++;
        else if (status === 'Aprobado') aprobado++;
        else if (status === 'Desaprobado') desaprobado++;
      });

      setStatusCount({ notable, aprobado, desaprobado });
    }
  }, [currentCourseData]);

  return (
    <>
      <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Reporte de Notas
                  </h1>
                  <p className="text-gray-600">
                    Visualización y análisis del rendimiento académico
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
                        placeholder="Buscar estudiante..."
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

                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
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
                      className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      onClick={handleDownload}
                    >
                      <FiDownload className="h-4 w-4" />
                      <span>Exportar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Resumen estadístico */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Total Estudiantes</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {filteredStudents?.length || 0}
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
                        {statusCount.notable + statusCount.aprobado}
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
                        {statusCount.desaprobado}
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
                        const finalGrade = user.CourseResults?.length > 0
                          ? Math.max(...user.CourseResults.map((r: any) => r.puntaje || 0))
                          : 0;
                        const status = user.CourseResults?.length > 0
                          ? getStatus(finalGrade)
                          : 'En Proceso';
                        const progress = user.CourseStudents?.[0]?.progress ?? 0;
                        const lastEvaluatedModule = user.ModuleResults?.length > 0
                          ? user.ModuleResults[user.ModuleResults.length - 1]
                          : null;
                        const moduleLabel = progress === 100
                          ? 'Curso completado'
                          : lastEvaluatedModule
                          ? `En o después de: ${lastEvaluatedModule.module_name}`
                          : progress > 0
                          ? 'Módulo inicial (sin evaluaciones)'
                          : 'No ha iniciado';

                        return (
                          <div
                            key={userIndex}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="p-5">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {user?.userProfile?.first_name}{' '}
                                    {user?.userProfile?.last_name}
                                  </h3>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full border ${statusStyles[status]}`}
                                  >
                                    {status}
                                  </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-700">
                                  {finalGrade || '-'}
                                </div>
                              </div>

                              {/* Módulo estimado */}
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

                              {/* Detalles de módulos */}
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
                            {currentCourseData?.[0]?.ModuleResults?.map(
                              (module: any, index: number) => (
                                <th
                                  key={`module-${index}`}
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {module?.module_name || 'Módulo'}
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
                                        {user?.userProfile?.first_name || '-'}{' '}
                                        {user?.userProfile?.last_name || '-'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                {currentCourseData?.[0]?.ModuleResults?.map(
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
                                  {user.CourseResults?.length > 0
                                    ? Math.max(...user.CourseResults.map((r: any) => r.puntaje || 0))
                                    : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {(() => {
                                    const grade = user.CourseResults?.length > 0
                                      ? Math.max(...user.CourseResults.map((r: any) => r.puntaje || 0))
                                      : 0;
                                    const rowStatus = user.CourseResults?.length > 0
                                      ? getStatus(grade)
                                      : 'En Proceso';
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
