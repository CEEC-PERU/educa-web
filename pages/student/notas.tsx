import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/User/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import { useNotas } from '../../hooks/resultado/useNotasUserId';
import ScreenSecurity from '../../components/ScreenSecurity';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

const NotasIndex: React.FC = () => {
  const { user, profileInfo } = useAuth();
  const { courseStudent } = useCourseStudent();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  // Fetch notas for the selected course
  const course_id = selectedCourseId;
  const { courseNota } = useNotas(course_id || 0);

  const renderNotas = () => {
    if (!courseNota || courseNota.length === 0) {
      return null;
    }

    const userNota = courseNota[0];

    return (
      <div className="space-y-4 transition-all duration-300 ease-in-out overflow-y-auto max-h-60">
        {userNota.ModuleResults?.length > 0 && (
          <div className="max-h-80 p-4 bg-gray-50 rounded-lg shadow-inner ">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Resultados de Módulos
            </h3>
            {userNota.ModuleResults.map((moduleResult: any) => (
              <div
                key={moduleResult.module_id}
                className="bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <h4 className="text-lg font-bold text-brand-500 mb-2">
                  Módulo: {moduleResult.module_name}
                </h4>
                {moduleResult.results.map((result: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between border-b border-gray-200 py-2"
                  >
                    <span className="text-gray-700">Puntaje:</span>
                    <span className="font-medium text-gray-900">
                      {result.puntaje}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {/* Display final course results */}
        {userNota.CourseResults?.length > 0 && (
          <div className="max-h-40 p-4 bg-gray-50 rounded-lg shadow-inner ">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Resultado Final del Curso
            </h3>
            {userNota.CourseResults.map((courseResult: any) => (
              <div
                key={courseResult.course_result_id}
                className="bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-700">Puntaje:</span>
                  <span className="font-medium text-gray-900">
                    {courseResult.puntaje}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Fecha:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(courseResult.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const toggleSidebar = () => setIsDrawerOpen(!isDrawerOpen);

  const handleToggleNotas = (courseId: number) => {
    setSelectedCourseId(selectedCourseId === courseId ? null : courseId);
  };

  return (
    <ProtectedRoute>
      <div>
        <ScreenSecurity />
        <div className="relative z-10">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={user ? { profilePicture: uri_picture } : undefined}
            toggleSidebar={toggleSidebar}
          />
          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        <div className="min-h-screen flex flex-col items-center bg-brandazul-600 p-4 pt-12">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {courseStudent.map((courseStudentItem) => (
              <div
                key={courseStudentItem.Course.course_id}
                className={`bg-white shadow-lg rounded-lg transform transition-all duration-300 ${
                  selectedCourseId === courseStudentItem.Course.course_id
                    ? 'scale-105'
                    : ''
                }`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {courseStudentItem.Course.name}
                </h3>
                <img
                  className="w-full h-40 object-cover rounded-lg"
                  src={courseStudentItem.Course.image}
                  alt={courseStudentItem.Course.name}
                />

                <button
                  className="bg-indigo-600 text-white w-full py-2 mt-4 rounded-b-lg hover:bg-indigo-800"
                  onClick={() =>
                    handleToggleNotas(courseStudentItem.Course.course_id)
                  }
                >
                  {selectedCourseId === courseStudentItem.Course.course_id
                    ? 'Ocultar Notas'
                    : 'Ver Notas'}
                </button>

                {selectedCourseId === courseStudentItem.Course.course_id && (
                  <div className="p-4">{renderNotas()}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NotasIndex;
