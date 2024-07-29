import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Corporate/CorporateSideBar';
import { getCoursesWithGradesByStudent, getModulesByCourseId2 } from '../../../services/courseStudent';
import { getUserById } from '../../../services/userService';
import { getEnterprise } from '../../../services/enterpriseService';
import Loader from '../../../components/Loader';
import StudentCourseCard from './StudentCourseCard';
import GradesModal from './Modal';
import './../../../app/globals.css';

const StudentGrades: React.FC = () => {
  const router = useRouter();
  const { user_id } = router.query as { user_id: string };
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [finalExam, setFinalExam] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [enterprise, setEnterprise] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user_id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const studentData = await getUserById(Number(user_id));
          setStudent(studentData);

          const enterpriseData = await getEnterprise(studentData.enterprise_id);
          setEnterprise(enterpriseData);

          const coursesData = await getCoursesWithGradesByStudent(Number(user_id));
          setCourses(coursesData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user_id]);

  const handleViewGrades = async (course: any) => {
    try {
      const modulesData = await getModulesByCourseId2(course.course_id, Number(user_id));
      console.log('Modules Data:', modulesData); // Agrega un console.log para verificar los datos
      setModules(modulesData[0].courseModules);
      setFinalExam(modulesData[0].Evaluation);
      setSelectedCourse(course);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching module data:', error);
    }
  };
  

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow transition-all duration-300 ease-in-out ml-20">
          {loading ? (
            <Loader />
          ) : (
            <div>
              {enterprise && student && (
                <div className="relative w-full max-w-full lg:max-w-4xl mx-auto mb-12">
                  <img
                    src={enterprise.image_fondo}
                    className="w-full h-auto"
                    alt="Imagen de la empresa"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center lg:justify-start lg:items-start p-4">
                    <img
                      src={student.userProfile?.profile_picture || 'default_profile_picture.png'}
                      alt="Profile"
                      className="h-40 w-40 rounded-full border-4 border-white"
                    />
                    <h2 className="text-2xl font-bold text-black mt-4">
                      {student.userProfile?.first_name} {student.userProfile?.last_name}
                    </h2>
                  </div>
                </div>
              )}
              <div className="mt-24">
                <h2 className="text-2xl font-bold text-center mb-8">Cursos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map(course => (
                    <StudentCourseCard
                      key={course.course_id}
                      course={{
                        image: course.image,
                        name: course.name,
                        description_short: course.description_short,
                        progress: course.progress ?? 0,
                        completed: course.completed ?? 0,
                        approved: course.approved ?? 0,
                        course_id: course.course_id, // Asegúrate de que el ID del curso esté incluido
                      }}
                      onViewGrades={handleViewGrades}
                    />
                  ))}
                </div>
                <button
                  onClick={() => router.back()}
                  className="mt-12 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Volver a la lista de usuarios
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      {selectedCourse && (
        <GradesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          course={selectedCourse}
          modules={modules}
          finalExam={finalExam}
        />
      )}
    </div>
  );
};

export default StudentGrades;
