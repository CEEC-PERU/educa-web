import React, { useState } from 'react';
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

const NotaCourses: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { course_id } = router.query;
  
  const { classrooms } = useClassroom();
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '');
  const { courseNota, isLoading, error } = useNotas(courseIdNumber);
  
  const userInfo = user as { id: number , enterprise_id : number};
  
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

  const getMaxResultsLength = (moduleResults: any[]) => {
    return Math.max(...(moduleResults || []).map((module: any) => module.results.length), 0);
  };

  const getMaxExamResultsLength = (courseResults: any[]) => {
    return Math.max(...(courseResults || []).map((result: any) => (result.results ? result.results.length : 0)), 0);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b ">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}>
          <h2 className="text-4xl font-bold mb-6 text-[#0010F7]">USUARIOS</h2>
          <div className="flex items-center space-x-4 mb-10">
            
            <FormField 
              id="classroom_id" 
              label="Cod.Aula" 
              type="select" 
              value="" // Valor vacío ya que no se envía
              onChange={() => {}} // No se necesita manejo de cambios
              options={[{ value: '', label: 'Seleccione un aula' }, ...classrooms.map(classroom => ({ value: classroom.shift_id.toString(), label: classroom.code }))]}
            />
            <FormField 
              id="shift_id" 
              label="Turno" 
              type="select" 
              value="" // Valor vacío ya que no se envía
              onChange={() => {}} // No se necesita manejo de cambios
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
                <table className="min-w-full bg-white border border-blue-300 shadow-md">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="py-2 px-4 border-b border-l-4 border-blue-300">Nombre del Estudiante</th>
                      {courseNota[0]?.ModuleResults?.map((module: any, index: number) => (
                        <th key={`module-${index}`} className="py-2 px-4 border-b border-l-4 border-blue-300" colSpan={getMaxResultsLength(courseNota[0]?.ModuleResults || [])}>
                          Módulo: {module.module_name}
                        </th>
                      ))}
                      <th className="py-2 px-4 border-b border-l-4 border-blue-300" colSpan={getMaxExamResultsLength(courseNota[0]?.CourseResults || [])}>
                        Examen Final
                      </th>
                    </tr>
                    <tr>
                      <td className="border-l-4 border-blue-300"></td>
                      {courseNota[0]?.ModuleResults?.map((module: any, index: number) => (
                        Array.from({ length: getMaxResultsLength(courseNota[0]?.ModuleResults || []) }).map((_, resultIndex: number) => (
                          <th key={`nota-${index}-${resultIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">
                            Intento {resultIndex + 1}
                          </th>
                        ))
                      ))}
                      {courseNota[0]?.CourseResults?.map((_, resultIndex: number) => (
                        <th key={`exam-${resultIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">
                          Nota {resultIndex + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courseNota.map((user: any, userIndex: number) => (
                      <tr key={userIndex} className="hover:bg-gray-100 transition-colors">
                        <td className="py-2 px-4 border-b border-l-4 border-blue-300">{user.userProfile.first_name} {user.userProfile.last_name}</td>
                        {user.ModuleResults.map((module: any, moduleIndex: number) => (
                          module.results.map((result: any, resultIndex: number) => (
                            <td key={`module-${userIndex}-${moduleIndex}-${resultIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">
                              {result.puntaje}
                            </td>
                          )).concat(
                            Array(getMaxResultsLength(user.ModuleResults) - module.results.length).fill(
                              <td className="py-2 px-4 border-b border-l-4 border-blue-300">-</td>
                            )
                          )
                        ))}
                        {user.CourseResults.map((result: any, resultIndex: number) => (
                          <td key={`exam-${userIndex}-${resultIndex}`} className="py-2 px-4 border-b border-l-4 border-blue-300">
                            {result.puntaje || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NotaCourses;
