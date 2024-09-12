import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Para la carga dinámica de react-apexcharts
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Corporate/CorporateSideBar';
import { useClassroom } from '../../../hooks/useClassroom';
import FormField from '../../../components/FormField';
import { useAuth } from '../../../context/AuthContext';
import { useNotas } from '../../../hooks/useNotas';
import Loader from '../../../components/Loader';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_GET_NOTAS_EXCEL } from '../../../utils/Endpoints';
import './../../../app/globals.css';

// Importar react-apexcharts dinámicamente para evitar SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const NotaCourses: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { course_id } = router.query;

  const { classrooms } = useClassroom();
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '');
  const { courseNota, isLoading, error } = useNotas(courseIdNumber);

  const userInfo = user as { id: number; enterprise_id: number };

  const [randomSessions, setRandomSessions] = useState<number[]>([]);
  const [randomDates, setRandomDates] = useState<{ startDate: Date; endDate: Date }[]>([]);
  const [statusCount, setStatusCount] = useState({ notable: 0, aprobado: 0, refuerzo: 0, desaprobado: 0 }); // Para el gráfico 1


  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedShift, setSelectedShift] = useState('');

  // Datos estáticos
  const users = [
    { name: 'Camila Fernandez', module1: [8, 9], module2: [7, 10], finalGrade: 9 },
    { name: 'Maria Gutierrez', module1: [7, 8], module2: [9, 9], finalGrade: 8.5 },
    { name: 'Alvaro Garcia', module1: [10, 10], module2: [8, 9], finalGrade: 9.5 },
    { name: 'Raul Rodriguez', module1: [6, 7], module2: [8, 8], finalGrade: 7.5 },
    { name: 'Rosa Fuentes', module1: [9, 9], module2: [7, 7], finalGrade: 8 },
    { name: 'Fiorella Peralta', module1: [8, 8], module2: [9, 9], finalGrade: 8.5 },
  ];

  const handleClassroomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSelectedClassroom(e.target.value);
  };

  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSelectedShift(e.target.value);
  };


  // Nueva lógica para obtener el estado según la nota del examen final
  const getStatus = (finalExamGrade: number) => {
    if (finalExamGrade >= 18) {
      return 'Notable';
    } else if (finalExamGrade >= 16) {
      return 'Aprobado';
    } else if (finalExamGrade >= 13) {
      return 'Refuerzo';
    } else {
      return 'Desaprobado';
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${API_GET_NOTAS_EXCEL}/${userInfo.enterprise_id}/${courseIdNumber}`, {
        responseType: 'blob', // Set response type to blob for file download
      });
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

 
  const getMaxExamResultsLength = (courseResults: any[]) => {
    return Math.max(...(courseResults || []).map((result: any) => (result.results ? result.results.length : 0)), 0);
  };

  useEffect(() => {
    if (courseNota && courseNota.length > 0) {
      const sessions = courseNota.map(() => Math.floor(Math.random() * 5) + 1); // Random number between 1 and 5
      setRandomSessions(sessions);

      // Generate random dates for each student
      const dates = courseNota.map(() => {
        const startDate = new Date(2024, 8, 11); // Fixed start date (11/09)
        const randomEndOffset = Math.floor(Math.random() * 3); // Random end date between 11/09 and 13/09
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + randomEndOffset);
        return { startDate, endDate };
      });
      setRandomDates(dates);

      // Contar el estado de cada estudiante para el gráfico de estado
      let notable = 0, aprobado = 0, refuerzo = 0, desaprobado = 0;
      courseNota.forEach(user => {
        const examGrade = user.CourseResults?.[0]?.puntaje || 0;
        const status = getStatus(examGrade);
        if (status === 'Notable') notable++;
        else if (status === 'Aprobado') aprobado++;
        else if (status === 'Refuerzo') refuerzo++;
        else if (status === 'Desaprobado') desaprobado++;
      });

      setStatusCount({ notable, aprobado, refuerzo, desaprobado });
    }
  }, [courseNota]);

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => { }} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}>
          <h2 className="text-4xl font-bold mb-6 text-[#0010F7]">USUARIOS</h2>
          <div className="flex items-center space-x-4 mb-10">
            <FormField
              id="classroom_id"
              label="Cod.Aula"
              type="select"
              value={selectedClassroom}
              onChange={handleClassroomChange}
              options={[{ value: '', label: 'Seleccione un aula' }, ...classrooms.map(classroom => ({ value: classroom.shift_id.toString(), label: classroom.code }))]}
            />
            <FormField
              id="shift_id"
              label="Turno"
              type="select"
              value={selectedShift}
              onChange={handleShiftChange}
              options={[{ value: '', label: 'Seleccione un turno' }, ...classrooms.map(classroom => ({ value: classroom.shift_id.toString(), label: classroom.Shift.name }))]}
            />
            <button className='text-white bg-blue-600 px-8 rounded-lg p-2' onClick={handleDownload}>
              Descargar Información
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid gap-6 shadow-lg rounded-lg overflow-hidden">
              {courseNota && (
                <>
                  <table className="min-w-full bg-white border border-blue-300 shadow-md">
                    <thead className="bg-blue-500 text-white">
                      <tr>
                        <th className="py-2 px-4 border-b border-l-4 border-blue-300">Nombre del Estudiante</th>
                        {courseNota[0]?.ModuleResults?.map((module: any, index: number) => (
                          <th key={`module-${index}`} className="py-2 px-4 border-b border-l-4 border-blue-300">
                            Módulo: {module.module_name}
                          </th>
                        ))}
                        <th className="py-2 px-4 border-b border-l-4 border-blue-300" colSpan={getMaxExamResultsLength(courseNota[0]?.CourseResults || [])}>
                          Examen Final
                        </th>
                        <th className="py-2 px-4 border-b border-l-4 border-blue-300">Estado</th>
                        <th className="py-2 px-4 border-b border-l-4 border-blue-300">Fecha Inicio</th>
                        <th className="py-2 px-4 border-b border-l-4 border-blue-300">Fecha Fin</th>
                        <th className="py-2 px-4 border-b border-l-4 border-blue-300">Sesiones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {courseNota.map((user: any, userIndex: number) => (
                        <tr key={userIndex} className="hover:bg-gray-100 transition-colors">
                          <td className="py-2 px-4 border-b border-l-4 border-blue-300">{user.userProfile.first_name} {user.userProfile.last_name}</td>
                          {courseNota[0]?.ModuleResults?.map((module: any, moduleIndex: number) => {
                            const moduleResult = user.ModuleResults.find((mod: any) => mod.module_name === module.module_name);
                            if (moduleResult) {
                              const highestScore = Math.max(...moduleResult.results.map((result: any) => result.puntaje));
                              return (
                                <td key={`module-highest-${userIndex}-${moduleIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">
                                  {highestScore}
                                </td>
                              );
                            } else {
                              return (
                                <td key={`empty-module-${userIndex}-${moduleIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">-</td>
                              );
                            }
                          })}
                          {user.CourseResults?.map((result: any, resultIndex: number) => (
                            <td key={`exam-${userIndex}-${resultIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">
                              {result.puntaje}
                            </td>
                          ))}
                          <td className="py-2 px-4 border-b border-l-4 border-blue-300">{getStatus(user.CourseResults?.[0]?.puntaje || 0)}</td>
                          {randomDates[userIndex] ? (
                            <>
                              <td className="py-2 px-4 border-b border-l-4 border-blue-300">{formatDate(randomDates[userIndex].startDate)}</td>
                              <td className="py-2 px-4 border-b border-l-4 border-blue-300">{formatDate(randomDates[userIndex].endDate)}</td>
                            </>
                          ) : (
                            <>
                              <td className="py-2 px-4 border-b border-l-4 border-blue-300">-</td>
                              <td className="py-2 px-4 border-b border-l-4 border-blue-300">-</td>
                            </>
                          )}
                          <td className="py-2 px-4 border-b border-l-4 border-blue-300">{randomSessions[userIndex]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Gráfico 1: Reporte de aprobados y desaprobados */}
                  <div className="mt-10">
                    <h3 className="text-2xl font-bold mb-4">Reporte de Aprobados y Desaprobados</h3>
                    <Chart
                      type="bar"
                      options={{
                        chart: {
                          id: 'aprobados-desaprobados-chart'
                        },
                        xaxis: {
                          categories: ['Notables', 'Aprobados', 'Refuerzos', 'Desaprobados']
                        }
                      }}
                      series={[
                        {
                          name: 'Estudiantes',
                          data: [statusCount.notable, statusCount.aprobado, statusCount.refuerzo, statusCount.desaprobado]
                        }
                      ]}
                      height="350"
                    />
                  </div>

                  {/* Gráfico 2: Número de sesiones por alumno */}
                  <div className="mt-10">
                    <h3 className="text-2xl font-bold mb-4">Número de Sesiones por Alumno</h3>
                    <Chart
                      type="bar"
                      options={{
                        chart: {
                          id: 'sesiones-alumno-chart'
                        },
                        xaxis: {
                          categories: courseNota.map((user: any) => `${user.userProfile.first_name} ${user.userProfile.last_name}`)
                        }
                      }}
                      series={[
                        {
                          name: 'Sesiones',
                          data: randomSessions
                        }
                      ]}
                      height="350"
                    />
                  </div>

                  {/* Gráfico 3: Participación diaria por estudiante */}
                  <div className="mt-10">
                    <h3 className="text-2xl font-bold mb-4">Participación Diaria por Estudiante</h3>
                    <Chart
                      type="line"
                      options={{
                        chart: {
                          id: 'participacion-diaria-chart'
                        },
                        xaxis: {
                          categories: courseNota.map((user: any) => `${user.userProfile.first_name} ${user.userProfile.last_name}`)
                        }
                      }}
                      series={[
                        {
                          name: 'Sesiones',
                          data: randomSessions
                        }
                      ]}
                      height="350"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NotaCourses;