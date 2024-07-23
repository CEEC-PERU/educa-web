import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import CourseCard from '../../components/student/CourseCard';
import { XCircleIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import './../../app/globals.css';
Modal.setAppElement('#__next');

const StudentIndex: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const openModal = (course: any) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  useEffect(() => {
    const handleNotificationPermission = async () => {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          notify();
        } else {
          Notification.requestPermission().then(res => {
            if (res === "granted") {
              notify();
            } else {
              console.error("Did not receive permission for notifications");
            }
          });
        }
      } else {
        console.error("Browser does not support notifications");
      }

      function notify() {
        const notification = new Notification('Breaking:', {
          body: `Celebrity Caught in Fresh Scandal`,
          icon: 'https://unsplash.it/400/400',
        });

        notification.addEventListener('click', function() {
          window.open('https://www.openjavascript.com');
        });

        setTimeout(() => notification.close(), 5 * 1000);
        navigator.vibrate([300, 200, 300]);
      }
    };

    handleNotificationPermission();
  }, []);

  const navigateToCourseDetails = () => {
    router.push({
      pathname: '/student/course-details',
      query: { course_id: selectedCourse.course_id }
    });
    console.log("selectedCourse:", selectedCourse);
    console.log("selectedCourse.course_id:", selectedCourse?.course_id);
  };

  
  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };


  return (
    <div>
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={user ? { profilePicture: uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
        />
         <SidebarDrawer isDrawerOpen={isDrawerOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pt-40 pb-40 from-brand-100 via-brand-200 to-brand-300 p-4">
        <div className="flex flex-col lg:flex-row items-center p-8 rounded-lg shadow-md w-full max-w-screen-lg pb-20">
          <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 p-10">
            <p className="text-4xl lg:text-5xl font-bold mb-4 text-brandrosado-800">Hola, {name}</p>
            <p className="mb-4 text-4xl lg:text-5xl text-white">¡Qué bueno verte!</p>
            <p className="mb-4 text-base lg:text-base text-white py-8">
              Este es tu portal de aprendizaje, explora tus cursos y potencia tu desarrollo profesional llevándolo al siguiente nivel con Educaweb.
            </p>
            <div className='bg-brandazul-600 border-2 border-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <p className="text-brandfucsia-900 text-4xl lg:text-7xl">5</p>
                  <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721713563/WEB_EDUCA/ICONOS/jbfxiscml6nrazyi1gda.png" className="h-12 w-12 ml-2" alt="Icon" />
                </div>
                <p className="text-white p-3">Cursos inscritos</p>
              </div>
              <div className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <p className="text-brandfucsia-900 text-4xl lg:text-7xl">1</p>
                  <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721713562/WEB_EDUCA/ICONOS/fsqde4gvrdhejt02t9xq.png" className="h-12 w-12 ml-2" alt="Icon" />
                </div>
                <p className="text-white p-3">Curso completado</p>
              </div>
              <div className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <p className="text-brandfucsia-900 text-4xl lg:text-7xl">1</p>
                  <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721713512/WEB_EDUCA/ICONOS/ake0tmixpx9wnbzvessc.png" className="h-12 w-12 ml-2" alt="Icon" />
                </div>
                <p className="text-white p-3">Diploma Obtenido</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src='https://res.cloudinary.com/dk2red18f/image/upload/v1721667505/WEB_EDUCA/p1copaxxrgtifhburiov.png'
              className="w-full h-96 max-w-full mx-auto object-cover"
              alt="Imagen descriptiva"
            />
          </div>
        </div>
        <div className="w-full max-w-screen-lg mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {courseStudent.map(courseStudent => (
            <CourseCard
              key={courseStudent.Course.course_id}
              name={courseStudent.Course.name}
              description={courseStudent.Course.description_short}
              image={courseStudent.Course.image}
              profesor={courseStudent.Course.courseProfessor.full_name}
              categoria={courseStudent.Course.courseCategory.name}
              course_id={courseStudent.Course.course_id}
              onClick={() => openModal(courseStudent.Course)}
            />
          ))}
        </div>
      </div>
      {selectedCourse && (
        <Modal
          key={selectedCourse.course_id}
          isOpen={!!selectedCourse}
          onRequestClose={closeModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-black"
            >
              <XCircleIcon className="h-8 w-8" />
            </button>
            <img className="w-full h-64 object-cover mb-4" src={selectedCourse.image} alt={selectedCourse.name} />
            <div className="px-6 py-4">
              <div className="bg-brandmorad-600 rounded font-bold text-md mb-2 text-white p-4">{selectedCourse.courseCategory.name}</div>
              <div className="font-bold text-md mb-2 text-black">{selectedCourse.name}</div>
              <p className="text-brandrosado-800 text-base mb-4">
                Por: {selectedCourse.courseProfessor.full_name}
              </p>
              <p className="text-black text-sm mb-4">
                {selectedCourse.description_short}
              </p>
              <div className="flex justify-end mt-4">
                <button 
                  className="bg-brandmora-500 text-white px-4 rounded hover:bg-brandmorado-700 border-2 border-brandborder-400 flex items-center"
                  onClick={navigateToCourseDetails}
                >
                  Detalles del curso <ChevronRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default StudentIndex;
