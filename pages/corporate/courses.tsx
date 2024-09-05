import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import { getCoursesByEnterprise } from '../../services/courseStudent';
import Loader from '../../components/Loader';
import CourseCard from './CourseCard';
import './../../app/globals.css';

const CorporateCourses: React.FC = () => {
  const { user } = useAuth();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enterpriseId) {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const response = await getCoursesByEnterprise(enterpriseId);
          console.log('Courses data:', response); // Verify that the data is correct
          setCourses(response);
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [enterpriseId]);

  // Datos de ejemplo para la tabla
  const studentData = [
    { name: 'Juan Pérez', module1: 'Introducción a React', module2: 'React Avanzado', finalGrade: 'A', status: 'Completado' },
    { name: 'Ana Gómez', module1: 'Fundamentos de JavaScript', module2: 'JavaScript ES6', finalGrade: 'B', status: 'En progreso' },
    { name: 'Luis Martínez', module1: 'HTML & CSS Básico', module2: 'HTML & CSS Avanzado', finalGrade: 'C', status: 'Completado' },
    { name: 'Laura Sánchez', module1: 'Programación en Python', module2: 'Data Science con Python', finalGrade: 'B', status: 'Completado' },
    { name: 'Carlos Ramírez', module1: 'Bases de Datos SQL', module2: 'Bases de Datos NoSQL', finalGrade: 'A', status: 'No iniciado' }
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}>
          <h2 className="text-4xl font-bold mb-6 text-[#0010F7]">CURSOS</h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              {/* Tabla de datos de estudiantes */}
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Nombre del Estudiante</th>
                    <th className="py-2 px-4 border-b">Módulo 1</th>
                    <th className="py-2 px-4 border-b">Módulo 2</th>
                    <th className="py-2 px-4 border-b">Nota Final</th>
                    <th className="py-2 px-4 border-b">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{student.name}</td>
                      <td className="py-2 px-4 border-b">{student.module1}</td>
                      <td className="py-2 px-4 border-b">{student.module2}</td>
                      <td className="py-2 px-4 border-b">{student.finalGrade}</td>
                      <td className="py-2 px-4 border-b">{student.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CorporateCourses;
