import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import { useRouter } from 'next/router';
import './../../app/globals.css';
import ScreenSecurity from '../../components/ScreenSecurity'; 
import Footter from '../../components/Footter';

Modal.setAppElement('#__next');

const NotasIndex: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [selectedCourse, setSelectedCourse] = useState<any>(null); // Estado para guardar el curso seleccionado
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  // Navegar a la página de detalles de las notas con el course_id seleccionado
  const navigateToCourseDetails = (course_id: number) => {
    router.push({
      pathname: '/student/detailnota', 
      query: { course_id } // Pasar el course_id como parámetro en la URL
    });
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

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pt-40 pb-10 from-brand-100 via-brand-200 to-brand-300 p-4">
        {/* Nueva visualización de los cursos */}
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
                    onClick={() => navigateToCourseDetails(courseStudentItem.Course.course_id)} // Llamar a la función con el course_id
                  >
                    Ver Notas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="bg-no-repeat bg-cover bg-brand-100"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dk2red18f/image/upload/v1724349813/WEB_EDUCA/icddbyrq4uovlhf6332o.png')",
          height: '500px',
        }}
      />
    </div>
  );
};

export default NotasIndex;
