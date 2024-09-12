import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import { useNotas } from '../../hooks/useNotasUserId';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import './../../app/globals.css';
import ScreenSecurity from '../../components/ScreenSecurity'; 
import Footter from '../../components/Footter';

Modal.setAppElement('#__next');

const NotasIndex: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  // Fetch notas for selected course
  const course_id = selectedCourse?.course_id;
  const { courseNota } = useNotas(course_id || 0);  // Pass a default value if course_id is undefined

  // Function to handle opening and closing of modal
  const openModal = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const renderNotas = () => {
    if (!courseNota || courseNota.length === 0) {
      return <p>No hay notas disponibles</p>;
    }

    const userNota = courseNota[0];

    return (
      <div className="space-y-4">
        {/* Display module results */}
        {userNota.ModuleResults?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados de Módulos</h3>
            {userNota.ModuleResults.map((moduleResult: any) => (
              <div key={moduleResult.module_id} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-bold text-brand-500 mb-2">Módulo: {moduleResult.module_name}</h4>
                {moduleResult.results.map((result: any, index: number) => (
                  <div key={index} className="flex justify-between border-b border-gray-200 py-2">
                    <span className="text-gray-700">Puntaje:</span>
                    <span className="font-medium text-gray-900">{result.puntaje}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Display final course results */}
        {userNota.CourseResults?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultado Final del Curso</h3>
            {userNota.CourseResults.map((courseResult: any) => (
              <div key={courseResult.course_result_id} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-bold text-brand-500 mb-2">Curso: {courseResult.Course.name}</h4>
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-700">Puntaje:</span>
                  <span className="font-medium text-gray-900">{courseResult.puntaje}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Fecha:</span>
                  <span className="font-medium text-gray-900">{new Date(courseResult.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      <ScreenSecurity />
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={user ? { profilePicture: uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer isDrawerOpen={isDrawerOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pb-10 from-brand-100 via-brand-200 to-brand-300 p-4">
        <div className="w-full max-w-screen-lg mt-8">
          {courseStudent.map((courseStudentItem) => (
            <div key={courseStudentItem.Course.course_id} className="bg-white shadow-md rounded-lg p-6 mb-4">
              <div className="flex items-center">
                <img
                  className="w-20 h-20 rounded-full object-cover mr-4"
                  src={courseStudentItem.Course.image}
                  alt={courseStudentItem.Course.name}
                />
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{courseStudentItem.Course.name}</h3>
                  <p className="text-gray-700 text-sm">{courseStudentItem.Course.description_short}</p>
                  <p className="text-gray-500 text-xs">Por: {courseStudentItem.Course.courseProfessor.full_name}</p>
                  <button
                    className="mt-2 bg-brandmora-500 text-white px-4 py-1 rounded hover:bg-brandmorado-700"
                    onClick={() => openModal(courseStudentItem.Course)}
                  >
                    Ver Notas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
            <button onClick={closeModal} className="absolute top-4 right-4 text-black">
              <XCircleIcon className="h-8 w-8" />
            </button>
            <div className="px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Notas del curso: {selectedCourse.name}</h2>
              {renderNotas()}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


export default NotasIndex;
