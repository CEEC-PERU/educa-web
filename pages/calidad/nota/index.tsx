import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Para la carga dinámica de react-apexcharts
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/calidad/SibebarCalidad';
import { useShifts} from '../../../hooks/useShifts';
import { useClassroom} from '../../../hooks/useClassroom';
import FormField from '../../../components/FormField';
import { useAuth } from '../../../context/AuthContext';
import { useNotas , useNotasClassroom } from '../../../hooks/useNotas';
import Loader from '../../../components/Loader';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProgressBar from '../../../components/Corporate/ProgressBar';
import { API_GET_NOTAS_EXCEL } from '../../../utils/Endpoints';
import './../../../app/globals.css';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

// Importar react-apexcharts dinámicamente para evitar SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const NotaCourses: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { course_id } = router.query;

  const { classrooms } = useClassroom();
  const {shifts } = useShifts();
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '');
  const { courseNota, isLoading, error } = useNotas(courseIdNumber);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const classroomId =  Number(selectedClassroom);
  console.log(classroomId);
  const { courseNotaClassroom , fetchCourseDetail} = useNotasClassroom(courseIdNumber ,classroomId);
  const userInfo = user as { id: number; enterprise_id: number };

  const [randomSessions, setRandomSessions] = useState<number[]>([]);
  const [randomDates, setRandomDates] = useState<{ startDate: Date; endDate: Date }[]>([]);
  const [statusCount, setStatusCount] = useState({ notable: 0, aprobado: 0, refuerzo: 0, desaprobado: 0 }); // Para el gráfico 1


  const [selectedShift, setSelectedShift] = useState('');

  
  
  const handleRowClick = (userId: number ) => {

    // Redirigir a la página de detalles del estudiante (puedes cambiar la ruta como desees)

    router.push({
      pathname: '/calidad/notasmodule',
      query: { course_id: courseIdNumber  , user_id: userId  },
    });
  };




  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSelectedShift(e.target.value);
  };

  
  const handleClassroomChange = async (value: string) => {
    setSelectedClassroom(value); // Actualizar el estado del aula seleccionada
    const updatedClassroomId = Number(value); // Asegurarse de usar el valor actualizado
    await fetchCourseDetail(updatedClassroomId); // Pasar el valor actualizado
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
      console.log( )
      const response = await axios.get(`${API_GET_NOTAS_EXCEL}/calidad/${userInfo.enterprise_id}/${courseIdNumber}`, {
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

//ejecutar de acuerdo a la selección courseNotaClassroom y CourseNota
const currentCourseData = selectedClassroom ? courseNotaClassroom : courseNota;
  useEffect(() => {
    if (currentCourseData && currentCourseData.length > 0) {
      const sessions = currentCourseData.map(() => Math.floor(Math.random() * 5) + 1); // Random number between 1 and 5
      setRandomSessions(sessions);

      // Generate random dates for each student
      const dates = currentCourseData.map(() => {
        const startDate = new Date(2024, 8, 11); // Fixed start date (11/09)
        const randomEndOffset = Math.floor(Math.random() * 3); // Random end date between 11/09 and 13/09
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + randomEndOffset);
        return { startDate, endDate };
      });
      setRandomDates(dates);

      // Contar el estado de cada estudiante para el gráfico de estado
      let notable = 0, aprobado = 0, refuerzo = 0, desaprobado = 0;
      currentCourseData.forEach(user => {
        const examGrade = user.CourseResults?.[0]?.puntaje || 0;
        const status = getStatus(examGrade);
        if (status === 'Notable') notable++;
        else if (status === 'Aprobado') aprobado++;
        else if (status === 'Refuerzo') refuerzo++;
        else if (status === 'Desaprobado') desaprobado++;
      });

      setStatusCount({ notable, aprobado, refuerzo, desaprobado });
    }
  }, [currentCourseData]);

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <ProtectedRoute>
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => { }} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}>
          <h2 className="text-4xl font-bold mb-6 text-[#0010F7]">USUARIOS</h2>
          <div className="flex items-center space-x-4 mb-10">
          <select
  id="classroom_id"
  value={selectedClassroom || ''}
  onChange={(e) => handleClassroomChange(e.target.value)}
  className="form-select border rounded px-4 py-2 text-gray-700"
>
  <option value="" disabled>
    Seleccione un aula
  </option>
  {classrooms.map((classroom) => (
    <option
      key={classroom.shift_id}
      value={classroom.classroom_id.toString()}
    >
      {`${classroom.code} - ${classroom.Shift.name} - (${classroom.User.userProfile.first_name} - ${classroom.User.userProfile.last_name})`}
    </option>
  ))}
</select>

            <button className='text-white bg-blue-600 px-8 rounded-lg p-2' onClick={handleDownload}>
              Descargar Información
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid gap-6 shadow-lg rounded-lg overflow-hidden">
  {currentCourseData && (
    <>
      <table className="min-w-full bg-white border border-blue-300 shadow-md">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th rowSpan={2} className="py-2 px-4 border-b border-l-4 border-blue-300">Nombre del Estudiante</th>
            {currentCourseData[0]?.ModuleResults?.map((module: any, index: number) => (
              <th key={`module-${index}`} rowSpan={2} className="py-2 px-4 border-b border-l-4 border-blue-300">
                Módulo: {module?.module_name || "-"}
              </th>
            ))}
            <th colSpan={3} className="py-2 px-4 border-b border-l-4 border-blue-300">Examen Final</th>
            <th rowSpan={2} className="py-2 px-4 border-b border-l-4 border-blue-300">Estado</th>
            <th rowSpan={2} className="py-2 px-4 border-b border-l-4 border-blue-300">Fecha Inicio</th>
            <th rowSpan={2} className="py-2 px-4 border-b border-l-4 border-blue-300">Fecha Fin</th>
            <th rowSpan={2} className="py-2 px-4 border-b border-l-4 border-blue-300">Sesiones</th>
          </tr>
          <tr>
            <th className="py-2 px-4 border-b border-l-4 border-blue-300">Nota 1</th>
            <th className="py-2 px-4 border-b border-l-4 border-blue-300">Nota 2</th>
            <th className="py-2 px-4 border-b border-l-4 border-blue-300">Nota Final</th>
          </tr>
        </thead>

        <tbody>
          {currentCourseData.map((user: any, userIndex: number) => (
    
                 <tr key={userIndex} className="hover:bg-gray-100 transition-colors" onClick={() => handleRowClick(user.user_id )}>
              {/* Nombre del estudiante */}
              <td className="py-2 px-4 border-b border-l-4 border-blue-300">
                {user?.userProfile?.first_name || "-"} {user?.userProfile?.last_name || "-"}
              </td>
              {/* Notas de los módulos */}
              {currentCourseData[0]?.ModuleResults?.map((module: any, moduleIndex: number) => {
                const moduleResult = user.ModuleResults?.find((mod: any) => mod.module_name === module.module_name);
                if (moduleResult) {
                  const highestScore = Math.max(...moduleResult.results.map((result: any) => result.puntaje));
                  return (
                    <td key={`module-highest-${userIndex}-${moduleIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">
                      {highestScore || "-"}
                    </td>
                  );
                } else {
                  return (
                    <td key={`empty-module-${userIndex}-${moduleIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">-</td>
                  );
                }
              })}
              {/* Resultados del examen final */}
              {["Nota 1", "Nota 2"].map((label, examIndex) => {
                const result = user.CourseResults?.[examIndex]?.puntaje || "-";
                return (
                  <td key={`exam-${userIndex}-${examIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">
                    {result}
                  </td>
                );
              })}
              {/* Nota Final */}
              <td className="py-2 px-4 border-b border-l-4 border-blue-300">
                {Math.max(
                  user.CourseResults?.[0]?.puntaje || 0,
                  user.CourseResults?.[1]?.puntaje || 0
                ) || "-"}
              </td>
              {/* Columna de estado */}
              <td className="py-2 px-4 border-b border-l-4 border-blue-300">
  {user.CourseResults?.length > 0
    ? getStatus(
        Math.max(
          user.CourseResults?.[0]?.puntaje || 0,
          user.CourseResults?.[1]?.puntaje || 0
        )
      )
    : "En Proceso"}
</td>
       
<>
  <td className="py-2 px-4 border-b border-l-4 border-blue-300">
    {user.CourseStudents?.[0]?.created_at 
      ? new Date(user.CourseStudents[0].created_at).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : "-"
    }
  </td>
  <td className="py-2 px-4 border-b border-l-4 border-blue-300">
    {user.CourseStudents?.[0]?.finished_at
      ? new Date(user.CourseStudents[0].finished_at).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : "En progreso"
    }
  </td>
</>

              {/* Sesiones */}
              <td className="py-2 px-4 border-b border-l-4 border-blue-300">
                { user.totalSessions || "-"}
              </td>
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
                          categories: currentCourseData.map((user: any) => `${user.userProfile.first_name} ${user.userProfile.last_name}`)
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
                          categories: currentCourseData.map((user: any) => `${user.userProfile.first_name} ${user.userProfile.last_name}`)
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
    </ProtectedRoute>
  );
};

export default NotaCourses;