import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import { getStudentsByEnterprise, getCoursesWithGradesByStudent } from '../../services/courseStudent';
import Loader from '../../components/Loader';
import './../../app/globals.css';

const CorporateUsers: React.FC = () => {
  const { user } = useAuth();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (enterpriseId) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const response = await getStudentsByEnterprise(enterpriseId);
          console.log('Fetched students:', response); // Agregamos un console.log para verificar los datos
          setStudents(response);
        } catch (error) {
          console.error('Error fetching students:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    }
  }, [enterpriseId]);

  useEffect(() => {
    if (selectedStudent) {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const response = await getCoursesWithGradesByStudent(selectedStudent.user_id);
          setCourses(response);
        } catch (error) {
          console.error('Error fetching courses with grades:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [selectedStudent]);

  const filteredStudents = students.filter(student =>
    student.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}>
          <h2 className="text-2xl font-bold mb-6">Usuarios de la Empresa</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por apellido"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          </div>
          {loading ? (
            <Loader />
          ) : selectedStudent ? (
            <div>
              <h3 className="text-xl font-bold mb-4">
                Cursos de {selectedStudent.first_name} {selectedStudent.last_name}
              </h3>
              <ul>
                {courses.map(course => (
                  <li key={course.course_id} className="mb-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold">{course.name}</h4>
                        <p>Progreso: {course.progress}%</p>
                        <p>Fecha de finalización: {course.finished_date ? new Date(course.finished_date).toLocaleDateString() : 'No completado'}</p>
                        <p>Aprobado: {course.is_approved ? 'Sí' : 'No'}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedStudent(null)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Volver a la lista de usuarios
              </button>
            </div>
          ) : (
            <ul>
              {filteredStudents.map(student => (
                <li key={student.user_id} className="mb-4 flex justify-between items-center">
                  <div>
                    {student.first_name} {student.last_name} - {student.email}
                  </div>
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Ver notas
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default CorporateUsers;
